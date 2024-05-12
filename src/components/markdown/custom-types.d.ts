import { BaseRange } from 'slate'

import { CustomEditor, CustomText, EmptyText, MarkdownElementType } from './custom-types'

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
    Range: BaseRange & {
      [key: string]: unknown;
    };
  }

  type CustomText = {
    bold?: boolean
    italic?: boolean
    code?: Boolean
    underline?: boolean
    stikethrough?: boolean
    color?: string
    text: string
  }

  type CustomElement = {
    type: MarkdownElementType
    align?: MarkdownAlignment
    children: CustomText[] | CustomElement[]
    id: string
  }

  type Descendant = CustomElement

  Node = CustomElement
}