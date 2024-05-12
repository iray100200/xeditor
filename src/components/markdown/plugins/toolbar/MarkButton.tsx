import { Editor } from 'slate'
import { useSlate } from 'slate-react'

import { IconButton } from './base/IconButton'
import { IconButtonContainer } from './base/IconButtonContainer'

const toggleMark = (editor, format) => {
  const active = isMarkActive(editor, format)

  if (active) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const MarkButton = ({ format, Icon }) => {
  const editor = useSlate()

  return (
    <IconButtonContainer onMouseDown={event => {
      event.preventDefault()
      toggleMark(editor, format)
    }} selectable active={isMarkActive(editor, format)}>
      <IconButton>
        <Icon size={20}></Icon>
      </IconButton>
    </IconButtonContainer>
  )
}
