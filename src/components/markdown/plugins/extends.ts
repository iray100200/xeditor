import { CustomElement, Editor } from 'slate'

export function extend(editor: Editor) {
  editor.insertNodeAtCurrentLocation = (node: CustomElement): void => {
    if (!editor.selection) return
    const { anchor } = editor.selection
    const { children, ...nextProperties } = node
    editor.setNodes(nextProperties)
    editor.insertNodes(children, {
      at: anchor.path
    })
  }

  return editor
}
