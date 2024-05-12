import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react'
import { Element } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

import { MarkdownElementType } from '../../custom-types';
import { filter } from '../../manager';
import BaseComponent, { BaseProps } from "../__deprecated/Base";
import { useSlateElementFilter } from '../hooks';

declare interface TableProps {

}

export function TableCell({ attributes, ...props }: BaseProps, ref) {
  const theme = useTheme()
  const editor = useSlate()

  return <Box contentEditable suppressContentEditableWarning role='cell' padding={theme.spacing(0, 1)} component='td' border='1px solid #ccc'>
    <span>{props.children}</span>
  </Box>
}