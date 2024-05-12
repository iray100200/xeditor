import { useContext, useEffect, useMemo, useRef } from 'react';
import { RiAlignCenter, RiAlignJustify, RiAlignLeft, RiAlignRight } from 'react-icons/ri'
import { Element as SlateElement, Transforms } from 'slate'
import { useSlate } from 'slate-react'

import { MarkdownAlignment } from '../../custom-types'
import { IconButton } from './base/IconButton'
import { IconButtonContainer } from './base/IconButtonContainer'
import { IconButtonGroup } from './base/IconButtonGroup'
import { MoreButton } from './base/MoreButton'
import { Popper, usePopper } from './base/Popper'

const alignmentButtons = [
  {
    Icon: RiAlignLeft,
    value: MarkdownAlignment.Left
  },
  {
    Icon: RiAlignCenter,
    value: MarkdownAlignment.Center
  },
  {
    Icon: RiAlignRight,
    value: MarkdownAlignment.Right
  },
  {
    Icon: RiAlignJustify,
    value: MarkdownAlignment.Justify
  }
]

export const AlignmentButtons = () => {
  const editor = useSlate()
  const anchorEl = useRef(null)
  const { ref, open, context: popperContext } = usePopper()

  const block = editor.above({
    match: n => SlateElement.isElement(n) && editor.isBlock(n)
  })
  const selectedAlign: string = (block && SlateElement.isElement(block[0]) && block[0].align) || MarkdownAlignment.Left
  const DisplayIcon = useMemo(() => { return alignmentButtons.find(t => t.value === selectedAlign)?.Icon || RiAlignLeft }, [selectedAlign])

  return (
    <IconButtonContainer ref={anchorEl} selectable active={open}>
      <IconButton>
        <DisplayIcon />
      </IconButton>
      <MoreButton />
      <Popper ref={ref} anchorEl={anchorEl.current} triggerEl={anchorEl.current}>
        <IconButtonGroup value={selectedAlign}>
          {
            alignmentButtons.map(item => (
              <IconButtonContainer active={selectedAlign === item.value} onMouseDown={(
                event => {
                  event.preventDefault()
                  const next = {
                    align: item.value,
                  }
                  Transforms.setNodes<SlateElement>(editor, next)
                  popperContext.close()
                }
              )} selectable key={item.value} value={item.value}>
                <IconButton >
                  <item.Icon />
                </IconButton>
              </IconButtonContainer>
            ))
          }
        </IconButtonGroup>
      </Popper>
    </IconButtonContainer>
  )
}