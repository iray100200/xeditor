import { MarkdownElementType } from "../../custom-types";

export declare interface BlockShortcut {
  type: MarkdownElementType;
  match: (RegExp | string)[];
  brick?: boolean;
}

export const BLOCK_SHORTCUTS: BlockShortcut[] = [
  {
    type: MarkdownElementType.ListItem,
    match: [
      '*', '-', '+',
    ]
  },
  {
    type: MarkdownElementType.OrderListItem,
    match: [
      /^[0-9]./
    ]
  },
  {
    brick: true,
    type: MarkdownElementType.BlockQuote,
    match: [
      '>'
    ]
  },
  {
    type: MarkdownElementType.HeadingOne,
    match: [
      '#'
    ]
  },
  {
    type: MarkdownElementType.HeadingTwo,
    match: [
      '##'
    ]
  },
  {
    type: MarkdownElementType.HeadingThree,
    match: [
      '###'
    ]
  },
  {
    type: MarkdownElementType.HeadingFour,
    match: [
      '####'
    ]
  },
  {
    type: MarkdownElementType.HeadingFive,
    match: [
      '#####'
    ]
  },
  {
    type: MarkdownElementType.HeadingSix,
    match: [
      '######'
    ]
  }
]