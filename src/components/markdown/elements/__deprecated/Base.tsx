import Box, { BoxProps } from '@mui/material/Box';
import React, { forwardRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Node as SlateNode } from 'slate'
import { useSlate, useSlateSelection } from 'slate-react'

import { Position } from './Position';
import { BlockOperationPrefix } from './SymbolAndDnd';
import Wrapper, { WrapperRef } from './Wrapper';

export declare interface BaseProps extends BoxProps {
  attributes: any;
  element?: any;
  type?: string;
}

const serialize = nodes => {
  if (!nodes) return '';
  return nodes.map(n => SlateNode.string(n)).join('')
}

export function BaseComponent({ attributes, children, ...$props }: BaseProps, ref) {
  const { element, type, ...props } = $props
  const id = element.id
  const slate = useSlate()
  const selection = useSlateSelection()
  const rootRef = React.useRef<HTMLDivElement>()

  const getText = React.useCallback(() => {
    const t = slate.children.find(t => t.id === id)
    return serialize(t?.children)
  }, [slate, id])
  
  const active = React.useMemo(() => {
    return slate.children.findIndex(t => t.id === id) === selection?.anchor.path[0]
  }, [id, slate.children, selection])
  const [hover, setHover] = React.useState(false)

  const handleSort = (x, y) => {
    slate.moveNodes({
      at: [x],
      to: [y],
    })
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: () => {
      if (!getText()) return null
      document.body.classList.add('dragging')
      return { id, props, children, ref: rootRef.current } 
    },
    collect: (monitor) => {
      return {
        canDrag: monitor.canDrag(),
        isDragging: monitor.isDragging()
      }
    },
    end: () => document.body.classList.remove('dragging')
  }), [props, getText])

  const [_drop, drop] = useDrop(() => ({
    accept: 'block',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item: any, monitor) => {
      if (!rootRef.current || item.id === id) {
        return
      }

      const hoverRect = rootRef.current.getBoundingClientRect()
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
      const hoverClientY = (monitor.getClientOffset()?.y || 0) - hoverRect.top
      const hoverIndex = slate.children.findIndex(t => t.id === item.id)
      const dragIndex = slate.children.findIndex(t => t.id === id)

      if (hoverIndex < dragIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (hoverIndex > dragIndex && hoverClientY > hoverMiddleY) {
        return
      }
      handleSort(hoverIndex, dragIndex)
    }
  }), [id])

  const handlePositionChange = useCallback((pos: Position) => {
    setHover(pos !== Position.Out)
  }, [])

  return <Wrapper
    {...props}
    ref={(element: WrapperRef<HTMLDivElement>) => {
      if (element?.current) {
        rootRef.current = element.current
        drop(rootRef)
      }
    }}
    textAlign={element.align}
    suppressContentEditableWarning
    onPositionChange={handlePositionChange}
  >
    <Box visibility={isDragging ? 'hidden' : 'visible'} position='relative'>
      <span {...attributes}>{children}</span>
    </Box>
    <BlockOperationPrefix hover={hover} active={active} setDragRef={drag} type={type} />
  </Wrapper>
}

export default forwardRef(BaseComponent)