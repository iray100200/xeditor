import cuid from 'cuid'
import { useMemo } from 'react'
import { Editor, Element as SlateElement, Transforms } from 'slate'
import { useSlate } from 'slate-react'

import { MarkdownElementType } from '../../custom-types'
import { IconButton } from './base/IconButton'
import { IconButtonContainer } from './base/IconButtonContainer'

const LIST_TYPES = [
  MarkdownElementType.UnorderedList,
  MarkdownElementType.OrderList
]

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const toggleBlock = (editor, format) => {
  const active = isBlockActive(
    editor,
    format,
    'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  let next: Partial<SlateElement>
  next = {
    type: active ? 'paragraph' : isList ? MarkdownElementType.ListItem : format,
  }
  Transforms.setNodes<SlateElement>(editor, next)

  if (!active && isList) {
    const block = { type: format, children: [], id: cuid() }
    Transforms.wrapNodes(editor, block)
  }
}

export const BlockButton = ({ format, Icon }) => {
  const editor = useSlate()
  const active = useMemo(() => isBlockActive(
    editor,
    format,
    'type'
  ), [editor, format])

  return (
    <IconButtonContainer selectable onMouseDown={event => {
      event.preventDefault()
      toggleBlock(editor, format)
    }} value={format} active={active}>
      <IconButton>
        <Icon size={20}></Icon>
      </IconButton>
    </IconButtonContainer>
  )
}