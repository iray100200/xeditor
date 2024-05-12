import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { Variant } from '@mui/material/styles/createTypography'
import Typography from '@mui/material/Typography'
import { RiH1, RiH2, RiH3, RiH4, RiH5, RiH6 } from '@remixicon/react'
import { MouseEvent, useCallback, useMemo, useRef } from 'react'
import { Element as SlateElement, Transforms } from 'slate'
import { useSlate } from 'slate-react'

import { MarkdownElementType } from '../../custom-types'
import { IconButton } from './base/IconButton'
import { IconButtonContainer } from './base/IconButtonContainer'
import { MoreButton } from './base/MoreButton'
import { Popper, usePopper } from './base/Popper'

declare type MenuItemType = {
  label: String,
  value: MarkdownElementType,
  variant: Variant,
  Icon: JSX.ElementType
}

const NormalIcon = () => (
  <Typography sx={{
    top: 1.5,
    position: 'relative'
  }} variant='caption'>NORMAL</Typography>
)

const headings: MenuItemType[] = [
  {
    label: 'NORMAL',
    value: MarkdownElementType.Paragraph,
    variant: 'body2',
    Icon: NormalIcon
  },
  {
    label: 'HEADING 1',
    value: MarkdownElementType.HeadingOne,
    variant: 'h1',
    Icon: RiH1
  },
  {
    label: 'HEADING 2',
    value: MarkdownElementType.HeadingTwo,
    variant: 'h2',
    Icon: RiH2
  },
  {
    label: 'HEADING 3',
    value: MarkdownElementType.HeadingThree,
    variant: 'h3',
    Icon: RiH3
  },
  {
    label: 'HEADING 4',
    value: MarkdownElementType.HeadingFour,
    variant: 'h4',
    Icon: RiH4
  },
  {
    label: 'HEADING 5',
    value: MarkdownElementType.HeadingFive,
    variant: 'h5',
    Icon: RiH5
  },
  {
    label: 'HEADING 6',
    value: MarkdownElementType.HeadingSix,
    variant: 'h6',
    Icon: RiH6
  }
]

export const Headings = () => {
  const editor = useSlate()
  const anchorEl = useRef(null)
  const { ref, open, context: popperContext } = usePopper()

  const block = editor.above({
    match: n => SlateElement.isElement(n) && editor.isBlock(n)
  })
  const type: string = (block && SlateElement.isElement(block[0]) && block[0].type) || MarkdownElementType.Paragraph

  const selectedItem = useMemo(() => headings.find(t => t.value === type) || {
    Icon: NormalIcon
  }, [type])

  const handleItemSelection = useCallback((event: MouseEvent, value: MarkdownElementType) => {
    event.preventDefault()
    let next: Partial<SlateElement>
    next = {
      type: value
    }
    Transforms.setNodes<SlateElement>(editor, next)
    popperContext.close && popperContext.close()
  }, [editor, popperContext])

  return (
    <IconButtonContainer ref={anchorEl} selectable active={open}>
      <IconButton>
        <selectedItem.Icon size={20} />
      </IconButton>
      <MoreButton />
      <Popper ref={ref} anchorEl={anchorEl.current} triggerEl={anchorEl.current}>
        <MenuList>
          {
            headings.map((item, index) => {
              return <MenuItem onMouseDown={(event) => handleItemSelection(event, item.value)} selected={item.value === type} key={index}>
                <Typography variant={item.variant}>{item.label}</Typography>
              </MenuItem>
            })
          }
        </MenuList>
      </Popper>
    </IconButtonContainer>
  )
}