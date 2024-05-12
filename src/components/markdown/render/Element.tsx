import { css } from '@emotion/css';
import { RenderElementProps } from 'slate-react';

import { MarkdownElementType } from '../custom-types';
import { Heading } from '../elements/Heading';
import { Paragraphy } from '../elements/Paragraphy';
import { Table } from '../elements/table/Table';
import { TableCell } from '../elements/table/TableCell';
import { TableLeft, TableRight } from '../elements/table/TableEdge';
import { TableRoot } from '../elements/table/TableRoot';
import { TableRow } from '../elements/table/TableRow';

export function Element({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case MarkdownElementType.BlockQuote:
      return <blockquote {...attributes}>{children}</blockquote>
    case MarkdownElementType.UnorderedList:
      return <ul {...attributes}>{children}</ul>
    case MarkdownElementType.OrderList:
      return <ol {...attributes}>{children}</ol>
    case MarkdownElementType.HeadingOne:
    case MarkdownElementType.HeadingTwo:
    case MarkdownElementType.HeadingThree:
    case MarkdownElementType.HeadingFour:
    case MarkdownElementType.HeadingFive:
    case MarkdownElementType.HeadingSix:
      return <Heading
        variant={element.type} element={element} attributes={attributes}>{children}</Heading>
    case MarkdownElementType.ListItem:
    case MarkdownElementType.OrderListItem:
      return <li {...attributes}>{children}</li>
    // case 'block-quote-item':
    //   return <p {...attributes}>{children}</p>
    case MarkdownElementType.TableRoot:
      return <TableRoot element={element} attributes={attributes}>{children}</TableRoot>
    case MarkdownElementType.Table:
      return <Table element={element} attributes={attributes}>{children}</Table>
    case MarkdownElementType.TableRow:
      return <TableRow element={element} attributes={attributes}>{children}</TableRow>
    case MarkdownElementType.TableCell:
      return <TableCell element={element} attributes={attributes}>{children}</TableCell>
    case MarkdownElementType.TableLeft:
      return <TableLeft element={element} attributes={attributes}>{children}</TableLeft>
    case MarkdownElementType.TableRight:
      return <TableRight element={element} attributes={attributes}>{children}</TableRight>
    default:
      return <Paragraphy element={element} attributes={attributes}>{children}</Paragraphy>
  }
}

export default Element