import MuiDivider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled, useTheme } from '@mui/material/styles'
import { MouseEvent, useCallback } from 'react'
import {
  RiBold, RiCodeFill,
  RiDoubleQuotesL,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiStrikethrough, RiSubscript, RiUnderline
} from 'react-icons/ri'

import { MarkdownElementType, MarkdownStyleType } from '../../custom-types'
import { AlignmentButtons } from './AlignmentButtons'
import { PopperProvider } from './base/Popper'
import { BlockButton } from './BlockButton'
import { ColorButton } from './ColorButton'
import { Headings } from './Headings'
import { MarkButton } from './MarkButton'
import { TableButton } from './TableButton'

const Menu = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& > .MuiIconButton-root': {
    margin: theme.spacing(0, 1)
  }
}))

const Divider = styled(MuiDivider)(({ theme }) => ({
  height: 26,
  borderColor: 'var(--md-tooltip-divider-color)',
  margin: theme.spacing(0, 1)
}))

const StyledMenubar = styled(Menu)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1, 1.5),
  borderBottom: 'var(--md-toolbar-border-bottom)',
}))

export const Toolbar = function Toolbar() {
  const theme = useTheme()
  const preventDefault = useCallback((event: MouseEvent) => {
    event.preventDefault()
  }, [])

  return <PopperProvider>
    <Stack onMouseDown={preventDefault} padding={theme.spacing(1, 2)} spacing={1} direction='row'>
      {/* style styles */}
      <MarkButton format={MarkdownStyleType.Bold} Icon={RiBold} />
      <MarkButton format={MarkdownStyleType.Italic} Icon={RiItalic} />
      <MarkButton format={MarkdownStyleType.Underline} Icon={RiUnderline} />
      <MarkButton format={MarkdownStyleType.Strikethrough} Icon={RiStrikethrough} />
      <MarkButton format={MarkdownStyleType.Superscript} Icon={RiSubscript}></MarkButton>
      <MarkButton format={MarkdownStyleType.Subscript} Icon={RiSubscript} />
      <MarkButton format={MarkdownStyleType.Code} Icon={RiCodeFill} />
      {/* element types */}
      <Headings />
      <BlockButton format={MarkdownElementType.BlockQuote} Icon={RiDoubleQuotesL}></BlockButton>
      <BlockButton format={MarkdownElementType.OrderList} Icon={RiListOrdered}></BlockButton>
      <BlockButton format={MarkdownElementType.UnorderedList} Icon={RiListUnordered}></BlockButton>
      {/* align types */}
      <Divider orientation="vertical" />
      <AlignmentButtons />
      <Divider orientation="vertical" />
      <ColorButton />
      <Divider orientation='vertical' />
      <TableButton />
    </Stack>
  </PopperProvider>
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}
