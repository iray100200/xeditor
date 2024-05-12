import cuid from 'cuid'
import { Editor, Element, NodeEntry, Path } from 'slate'
import { ReactEditor } from 'slate-react';

import { MarkdownElementType } from '../../custom-types'
import { filter, is, map } from '../../manager';
import { Plugin, PluginInstance } from '../../plugins/plugin'

type NextEventData = {
  node: NodeEntry,
  text: string
}

export class TablePlugin extends PluginInstance implements Plugin {

  override apply() {
    const editor = this.editor

    editor.proxy('insertText').pipe<string, NextEventData | undefined>(
      map((text) => {
        const node = editor.above({
          match: node => Element.isElement(node) && editor.isBlock(node) && node.type === MarkdownElementType.TableLeft
        })
        if (node) {
          return {
            node, text
          }
        }
      })
    ).end((event) => {
      if (event.data) {
        const { node, text } = event.data
        const next = Path.parent(node[1])
        editor.insertNode({
          type: MarkdownElementType.Paragraph,
          id: cuid(),
          children: [
            {
              text
            }
          ]
        }, {
          at: next,
          select: true
        })
        ReactEditor.focus(editor)
        event.preventDefault()
      }
    })

    editor.proxy('insertText').pipe<string, NextEventData | undefined>(
      map((text: string) => {
        const node = editor.above({
          match: node => Element.isElement(node) && node.type === MarkdownElementType.TableRight
        })
        if (node) {
          return {
            node, text
          }
        }
      })
    ).end((event) => {
      if (event.data) {
        const { node, text } = event.data
        const next = Path.next(Path.parent(node[1]))
        editor.insertNode({
          type: MarkdownElementType.Paragraph,
          id: cuid(),
          children: [
            {
              text
            }
          ]
        }, {
          at: next,
          select: true
        })
        ReactEditor.focus(editor)
        event.preventDefault()
      }
    })

    editor.proxy('insertText').pipe<string, string>(
      is(MarkdownElementType.TableCell)
    ).end(() => {
      ReactEditor.focus(editor)
    })

    editor.proxy('deleteBackward').pipe(
      is(MarkdownElementType.TableCell)
    ).end((event) => {
      if (editor.selection && editor.selection.anchor.offset === 0) {
        event.preventDefault()
      } else {
        ReactEditor.focus(editor)
      }
    })
  }
}