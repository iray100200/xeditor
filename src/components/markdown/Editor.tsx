'use client';

import { styled } from '@mui/material/styles';
import { useDragLayer } from 'react-dnd';
import { Editable as SlateEditable } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';

const StyledEditor = styled(SlateEditable)(({ theme }) => ({
  '&': {
    outline: 'none',
    flexGrow: 1,
    padding: theme.spacing(6, 0),
    fontSize: '0.875rem',
  }
}))

export function Editable(props: EditableProps) {
  const { isDragging } = useDragLayer((monitor) => ({ isDragging: monitor.isDragging() }))

  return (
    <StyledEditor
      {...props}
      readOnly={isDragging}
    />
  )
}