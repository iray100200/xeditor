import { BaseEditor, CustomElement,Element, Range  } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

import { Manager } from './manager'

export type EmptyText = {
  text: string
}

export enum MarkdownElementType {
  UnorderedList = 'ul',
  OrderList = 'ol',
  BlockQuote = 'block-quote',
  HeadingOne = 'h1',
  HeadingTwo = 'h2',
  HeadingThree = 'h3',
  HeadingFour = 'h4',
  HeadingFive = 'h5',
  HeadingSix = 'h6',
  CodeBlock = 'code-block',
  ListItem = 'li',
  OrderListItem = 'oli',
  Paragraph = 'paragraph',
  Table = 'table',
  TableRow = 'table-row',
  TableCell = 'table-cell',
  TableRoot = 'table-root',
  TableLeft = 'table-left',
  TableRight = 'table-right',
}

export enum MarkdownStyleType {
  Bold = 'bold',
  Italic = 'italic',
  Underline = 'underline',
  Strikethrough = 'strikethrough',
  Superscript = 'superscript',
  Subscript = 'subscript',
  Code = 'code',
}

export enum MarkdownAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Justify = 'justify'
}

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>
    insertNodeAtCurrentLocation: (element: CustomElement) => void
  } & Manager
