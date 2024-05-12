import { useTheme } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import Grid from '@mui/material/Grid'
import Stack, { StackProps } from '@mui/material/Stack';
import { RiDraggable, RiH1, RiH2, RiH3, RiH4, RiH5, RiH6 } from '@remixicon/react'
import React, { forwardRef, MouseEvent, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { CustomElement, Node as SlateNode } from 'slate'
import { useSlate, useSlateSelection } from 'slate-react'

export declare interface WrapperProps extends StackProps {
  draggble?: boolean;
  symbol?: React.ReactNode;
  baseLineHeight: number | string;
  slateElement: CustomElement;
  contentNodeEditable?: boolean;
  contentNodeLineHeight?: number | string;
  contentNodeProps?: BoxProps;
}

export declare interface WrapperRef<T extends HTMLElement> {
  current: T | null;
}

export const Wrapper = forwardRef<WrapperRef<HTMLElement>, WrapperProps>(function Wrapper($props, ref) {
  const { draggable, symbol, slateElement, baseLineHeight, contentNodeEditable, contentNodeLineHeight, contentNodeProps, ...props } = $props
  const { align, id } = slateElement || {}
  const theme = useTheme()
  const [hover, setHover] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>()
  const targetRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>()
  const slate = useSlate()
  const selection = useSlateSelection()

  // const active = React.useMemo(() => {
  //   return slate.children.findIndex(t => t.id === id) === selection?.anchor.path[0]
  // }, [id, slate.children, selection])

  const handleSort = (x, y) => {
    slate.moveNodes({
      at: [x],
      to: [y],
    })
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: () => {
      if (!targetRef.current || !dragRef.current) return {}

      document.body.classList.add('dragging')
      const targetRefPosition = targetRef.current?.getBoundingClientRect()
      const dragRefPosition = dragRef.current?.getBoundingClientRect()
      return {
        id,
        offset: [
          targetRefPosition.x - dragRefPosition.x,
          targetRefPosition.y - dragRefPosition.y
        ],
        target: targetRef.current,
        position: targetRefPosition
      }
    },
    collect: (monitor) => {
      return {
        canDrag: monitor.canDrag(),
        isDragging: monitor.isDragging()
      }
    },
    end: () => document.body.classList.remove('dragging')
  }), [props, targetRef, dragRef])

  const [_drop, drop] = useDrop<{
    index: number;
    id: string;
  }>(() => ({
    accept: 'block',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (dragItem, monitor) => {
      if (!wrapperRef.current || dragItem.id === id) {
        return
      }

      const slateChildren = slate.children
      const hoverRect = wrapperRef.current.getBoundingClientRect()
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
      const hoverClientY = (monitor.getClientOffset()?.y || 0) - hoverRect.top
      const dragIndex = slateChildren.findIndex(t => t.id === dragItem.id)
      const hoverIndex = slateChildren.findIndex(t => t.id === id)

      if (hoverIndex > dragIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (hoverIndex < dragIndex && hoverClientY > hoverMiddleY) {
        return
      }
      handleSort(hoverIndex, dragIndex)
    }
  }), [id, wrapperRef])

  const handleMouseEnter = useCallback(() => {
    setHover(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHover(false)
  }, [])

  const preventDefault = useCallback((event: MouseEvent) => {
    event.preventDefault()
  }, [])

  return <Stack
    direction='row'
    component='div'
    ref={(element) => {
      drop(element)
      wrapperRef.current = element
    }}
    spacing={1}
    visibility={isDragging ? 'hidden' : 'visible'}
    suppressContentEditableWarning
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    padding={theme.spacing(0, 12)}
    alignItems='flex-start'
    {...props}>
    <Stack onMouseDown={preventDefault} contentEditable={false} justifyContent='flex-end' component='div' direction='row' flexShrink={0} width={100} height={baseLineHeight} alignItems='center'>
      {/* <Box width={32} display='inline-flex' justifyContent='center'>
        <Box display='inline-flex' alignItems='center' color={grey[400]} sx={{
          transition: '0.5s opacity',
          opacity: (active || hover) ? 1 : 0,
        }}>
          {symbol}
        </Box>
      </Box> */}
      <Box width={28} display='inline-flex' justifyContent='center'>
        {
          draggable && <Box display='inline-flex' alignItems='center' padding={theme.spacing(0.5, 0.25)} color={grey[500]} borderRadius={0.5} ref={(element: HTMLDivElement) => {
            if (element) {
              drag(element)
              dragRef.current = element
            }
          }}
            sx={{
              cursor: 'pointer',
              transition: '0.5s opacity, backgroundColor',
              opacity: hover ? 1 : 0,
              transform: 'translate(0, -1px)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: grey[900]
              }
            }}>
            <RiDraggable size={18} />
          </Box>
        }
      </Box>
    </Stack>
    <Box {...contentNodeProps} contentEditable={contentNodeEditable} display='flex' alignItems='center' ref={targetRef} textAlign={align} position='relative' flexGrow={1} lineHeight={contentNodeLineHeight}>
      {props.children}
    </Box>
    <Box onMouseDown={preventDefault} contentEditable={false} flexShrink={0} width={100}></Box>
  </Stack>
})

Wrapper.defaultProps = {
  contentEditable: true,
}