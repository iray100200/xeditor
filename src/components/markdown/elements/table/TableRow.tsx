import Box from '@mui/material/Box'
import { useState } from 'react'

import BaseComponent, { BaseProps } from "../__deprecated/Base";

declare interface TableProps {

}

export function TableRow({ attributes, ...props }: BaseProps, ref) {
  return <Box role='row' component='tr'>
    {props.children}
  </Box>
}