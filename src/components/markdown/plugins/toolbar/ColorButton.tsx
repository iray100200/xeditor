import Box from '@mui/material/Box'
import { blue, cyan, green, orange, purple, red, yellow } from '@mui/material/colors'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { ColorTranslator } from 'colortranslator';
import { MouseEvent, MouseEventHandler, useCallback, useRef } from 'react'
import { CustomText, Editor } from 'slate'
import { useSlate } from 'slate-react'

import { IconButton } from './base/IconButton'
import { IconButtonContainer } from './base/IconButtonContainer'
import { MoreButton } from './base/MoreButton'
import { Popper, usePopper } from './base/Popper';

declare interface GridItemProps {
  color: string;
  style?: React.CSSProperties;
  onMouseDown?: MouseEventHandler;
  className?: string;
  disableHover?: boolean;
}

const ColorItem = styled(({ color, disableHover, ...props }: GridItemProps) => <div {...props}></div>)((props) => {
  return {
    width: 18,
    height: 18,
    borderRadius: 0,
    backgroundColor: props.color,
    border: `1px solid ${props.color}`,
    position: 'relative',
    cursor: 'pointer',
    '&:hover': {
      outline: !props.disableHover ? `1px solid #808080` : undefined,
      outlineOffset: '1px'
    },
    '&.selected': {
      outline: `1px solid #808080`,
      outlineOffset: '1px'
    }
  }
})

const colors = [red, orange, yellow, green, blue, purple, cyan]

interface ColorSelectorProps {
  value: string;
  onColorChange?: (evt: MouseEvent, color: ColorTranslator) => void;
}

const AUTO_COLOR = '#000000'

const ColorSelector = (props: ColorSelectorProps) => {
  const theme = useTheme()
  const handleColorChange = useCallback((event: MouseEvent, color: string) => {
    event?.preventDefault()
    props.onColorChange && props.onColorChange(event, new ColorTranslator(color))
  }, [props])

  return <Stack>
    <Stack alignItems='center' sx={{
      cursor: 'pointer',
      padding: theme.spacing(1.25, 1.5),
      '&:hover': {
        bgcolor: 'var(--md-tooltip-color-selector-default-item-hover-bgcolor)'
      }
    }}
      onMouseDown={(evt) => handleColorChange(evt, AUTO_COLOR)}
      direction='row' spacing={1}>
      <ColorItem disableHover color={AUTO_COLOR}></ColorItem>
      <Typography color={AUTO_COLOR} variant='caption'>Auto</Typography>
    </Stack>
    <Divider />
    <Box padding={theme.spacing(1.5)}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={0.75}>
          {Array.from({ length: 10 }).map((_, index) => {
            const t = Math.round(255 / 9 * index)
            const color = new ColorTranslator(`rgb(${t}, ${t}, ${t})`);
            return <ColorItem
              key={index}
              onMouseDown={(evt) => handleColorChange(evt, color.HEX)}
              style={{ borderColor: color.HEX === '#FFFFFF' ? '#a0a0a0' : 'transparent' }}
              className={color.HEX === props.value ? 'selected' : ''}
              color={color.HEX}></ColorItem>
          })}
        </Stack>
        {
          colors.map((collection, index) => {
            return <Stack key={index} direction='row' spacing={0.75}>
              {
                Object.keys(collection).slice(0, 10).reverse().map((colorKey) => {
                  const color = new ColorTranslator(collection[colorKey]).HEX
                  return <ColorItem className={color === props.value ? 'selected' : ''} key={colorKey} onMouseDown={(evt) => handleColorChange(evt, color)} color={color}></ColorItem>
                })
              }
            </Stack>
          })
        }
      </Stack>
    </Box>
  </Stack>
}


function getColor(marks: Omit<CustomText, 'text'> | null) {
  if (marks) return marks.color || AUTO_COLOR
  return AUTO_COLOR
}

export const ColorButton = () => {
  const editor = useSlate()
  const anchorRef = useRef(null)
  const moreButtonRef = useRef(null)
  const marks = Editor.marks(editor)
  const color = getColor(marks)
  const { ref, open, context: popperContext } = usePopper()

  const handleColorChange = useCallback((event: MouseEvent, color: ColorTranslator) => {
    event.preventDefault()
    editor.addMark('color', color.HEX)
    popperContext.close()
  }, [editor, popperContext])

  return <IconButtonContainer ref={anchorRef} active={open}>
    <IconButton selectable onMouseDown={(event) => handleColorChange(event, new ColorTranslator(color))}>
      <Box position='relative' width={18} height={18} display='flex' alignItems='center' justifyContent='center'>
        <Box position='relative' top={-0.5} fontSize={15}>A</Box>
        <Box position='absolute' bottom={0} height={2.5} width={14} bgcolor={color}></Box>
      </Box>
    </IconButton>
    <MoreButton ref={moreButtonRef} selectable />
    <Popper ref={ref} anchorEl={anchorRef.current} triggerEl={moreButtonRef.current}>
      <ColorSelector value={color} onColorChange={handleColorChange} />
    </Popper>
  </IconButtonContainer>
}