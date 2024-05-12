import cuid from 'cuid';
import { CustomElement, Editor, Element, Node, Point, Range, Transforms } from 'slate'

import { MarkdownElementType } from '../../custom-types'
import { filter, is } from '../../manager'
import { Plugin, PluginInstance } from '../plugin';
import { findMarkdownElementType } from './utils'

export class ShortcutsPlugin extends PluginInstance implements Plugin {
  checkEnds(text: string) {
    return text.endsWith(' ')
  }

  isSupportedElement(editor: Editor) {
    return () => {
      const node = editor.above<CustomElement>({
        match: (node) => Element.isElement(node) && editor.isBlock(node)
      })
      return !node || !/table/.test(node[0].type)
    }
  }

  override apply() {
    const editor = this.editor

    editor.proxy('insertText').pipe<string, string>(
      filter(this.checkEnds),
      filter(this.isSupportedElement(editor))
    ).end((event) => {
      const text = event.data
      if (!editor.selection) return
      const { anchor } = editor.selection
      const block = Editor.above(editor, {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const currentInput = Editor.string(editor, range) + text.slice(0, -1)
      const style = findMarkdownElementType(currentInput)
      if (!style) return

      const { type } = style
      Transforms.select(editor, range)

      if (!Range.isCollapsed(range)) {
        Transforms.delete(editor)
      }

      const next = { type }
      Transforms.setNodes(editor, next, {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      })

      if (type === MarkdownElementType.ListItem) {
        const list = {
          type: MarkdownElementType.UnorderedList,
          id: cuid(),
          children: [],
        }
        Transforms.wrapNodes(editor, list, {
          match: n => Element.isElement(n) &&
            n.type === MarkdownElementType.ListItem,
        })
      }

      if (type === MarkdownElementType.OrderListItem) {
        const list = {
          type: MarkdownElementType.OrderList,
          id: cuid(),
          children: [],
        }
        Transforms.wrapNodes(editor, list, {
          match: n => Element.isElement(n) &&
            n.type === MarkdownElementType.OrderListItem,
        })
      }

      event.preventDefault()
    })

    const { deleteBackward, insertBreak } = editor

    const match = (...types: string[]) => (n: Node) => {
      return Element.isElement(n) && types.includes(n.type)
    }

    const is = (n: CustomElement, ...types: string[]) => {
      return types.includes(n.type)
    }

    const insertNode = (type: MarkdownElementType) => {
      Transforms.insertNodes(editor, {
        type,
        id: cuid(),
        children: [{ text: '' }]
      })
    }

    editor.insertBreak = () => {
      const next = () => insertBreak()
      const block = Editor.above(editor, {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      })

      if (!block) return next()

      const [node, path] = block
      if (!Element.isElement(node)) return next()

      if (is(node, MarkdownElementType.ListItem, MarkdownElementType.OrderListItem) && editor.string(path) === '') {
        Transforms.unwrapNodes(editor, {
          match: match(MarkdownElementType.UnorderedList, MarkdownElementType.OrderList),
          split: true,
        })
        Transforms.setNodes(editor, {
          type: MarkdownElementType.Paragraph
        })
        return
      }

      if (is(node, MarkdownElementType.ListItem)) {
        insertNode(MarkdownElementType.ListItem)
        return
      }
      if (is(node, MarkdownElementType.OrderListItem)) {
        insertNode(MarkdownElementType.OrderListItem)
        return
      }

      next()
    }

    // editor.deleteBackward = (...args) => {
    //   const { selection } = editor

    //   if (selection && Range.isCollapsed(selection)) {
    //     const block = Editor.above(editor, {
    //       match: n => Element.isElement(n),
    //     })

    //     if (block) {
    //       const [node, path] = block
    //       const start = Editor.start(editor, path)

    //       if (Element.isElement(node) &&
    //         node.type !== MarkdownElementType.Paragraph &&
    //         Point.equals(selection.anchor, start)
    //       ) {
    //         const next: Partial<Element> = {
    //           type: MarkdownElementType.Paragraph,
    //         }
    //         Transforms.setNodes(editor, next)

    //         if (node.type === MarkdownElementType.ListItem || node.type === MarkdownElementType.OrderListItem) {
    //           Transforms.unwrapNodes(editor, {
    //             match: match(MarkdownElementType.UnorderedList, MarkdownElementType.OrderList),
    //             split: true,
    //           })
    //         }

    //         return
    //       }
    //     }

    //     deleteBackward(...args)
    //   }
    // }

  }
}
