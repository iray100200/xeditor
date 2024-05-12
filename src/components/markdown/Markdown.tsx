'use client';

import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack';
import cuid from 'cuid'
import { useCallback, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { createEditor, Descendant, Editor, Element as SlateElement, Node as SlateNode } from 'slate';
import { withHistory } from 'slate-history/dist/index';
import { ReactEditor, Slate, withReact } from 'slate-react';

import { MarkdownElementType } from './custom-types';
import { Editable } from './Editor'
import { Preview } from './elements/core/wrapper/Preview';
import { TablePlugin } from './elements/table/plugin';
import { Manager } from './manager';
import { extend } from './plugins/extends';
import { ShortcutsPlugin } from './plugins/shortcuts/plugin';
import { findMarkdownElementType } from './plugins/shortcuts/utils'
import { Toolbar } from './plugins/toolbar/Toolbar';
import Element from './render/Element';
import Leaf from './render/Leaf';

declare interface MarkdownShortcutsProps {
  value?: Descendant[]
}

const defaultValue: Descendant[] = [
  {
    type: MarkdownElementType.Paragraph,
    id: cuid(),
    children: [
      {
        text: ''
      }
    ]
  }
]

function isEmpty(document: Descendant[]) {
  return !document.some((node) => {
    return (SlateElement.isElement(node) && node.type !== MarkdownElementType.Paragraph) ||
      (SlateElement.isAncestor(node) && (node.children.length > 1 ||
        (!SlateElement.isElement(node.children[0]) && node.children[0].text)))
  })
}

const plugins = [
  TablePlugin,
  ShortcutsPlugin
]

export default function MarkdownEditor(props: MarkdownShortcutsProps) {
  const [value, setValue] = useState(props.value || defaultValue)
  const editor: Editor = useMemo(() => Manager.apply(extend(withReact(withHistory(createEditor()))), ...plugins), [])
  const [document, setDocument] = useState(value)
  const isDocumentEmpty = useMemo(() => isEmpty(document), [document])
  const placeholder = useMemo(() => isDocumentEmpty ? 'Write some markdown...' : '', [isDocumentEmpty])

  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const renderElement = useCallback((props) => <Element {...props} />, [])

  const handleDocumentChange = useCallback((evt: Descendant[]) => {
    setDocument(evt)
  }, [])

  const handleDOMBeforeInput = useCallback(
    (e: InputEvent) => {
      queueMicrotask(() => {
        const pendingDiffs = ReactEditor.androidPendingDiffs(editor)

        const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
          if (!diff.text.endsWith(' ')) {
            return false
          }

          const { text } = SlateNode.leaf(editor, path)
          const currentInput = text.slice(0, diff.start) + diff.text.slice(0, -1)
          if (!(findMarkdownElementType(currentInput))) {
            return
          }

          const blockEntry = Editor.above(editor, {
            at: path,
            match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
          })
          if (!blockEntry) {
            return false
          }

          const [, blockPath] = blockEntry
          return Editor.isStart(editor, Editor.start(editor, path), blockPath)
        })

        if (scheduleFlush) {
          ReactEditor.androidScheduleFlush(editor)
        }
      })
    },
    [editor]
  )

  return <Stack height='100%' overflow='hidden'>
    <Slate
      editor={editor}
      initialValue={value}
      onChange={handleDocumentChange}
    >
      <Toolbar />
      <Divider />
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <Editable
          onDOMBeforeInput={handleDOMBeforeInput}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          autoFocus
          spellCheck
        />
        <Preview />
      </DndProvider>
    </Slate>
  </Stack>
}