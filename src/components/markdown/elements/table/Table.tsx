import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles';
import cuid from 'cuid'
import { useEffect } from 'react'
import { Editor, Element, NodeEntry, Path, Selection, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react';

import { MarkdownElementType } from '../../custom-types'
import { map, SlateEvent } from '../../manager';
import { BaseProps } from "../__deprecated/Base";
import { useSlateElementFilter } from '../hooks';

declare interface TableProps {

}

export function Table({ attributes, element, ...props }: BaseProps, ref) {
  const theme = useTheme()
  const editor = useSlate()
  const { filter, element: node } = useSlateElementFilter(MarkdownElementType.TableLeft)

  useEffect(() => {
    
  }, [editor])

  return <Box role='table' margin={theme.spacing(1, 0)} bgcolor='#fff' width='100%' component='table' sx={{
    tableLayout: 'fixed',
    borderCollapse: 'collapse'
  }}>
    <Box component='tbody'>
      {props.children}
    </Box>
  </Box>
}