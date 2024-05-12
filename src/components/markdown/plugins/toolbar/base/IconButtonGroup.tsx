import Stack, { StackProps } from '@mui/material/Stack';
import React from 'react';

interface IconButtonGroupProps extends StackProps {
  value: string;
  children: React.ReactElement<{ value: string }>[];
}

export const IconButtonGroup = (props: IconButtonGroupProps) => {
  return <Stack direction='row' spacing={0.5} padding={0.5} {...props}>
    {props.children}
  </Stack>
}