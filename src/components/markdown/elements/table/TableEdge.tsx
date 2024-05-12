import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

export function TableLeft({ attributes, ...props }, ref) {
  const theme = useTheme()

  return <Box suppressContentEditableWarning fontSize={40} display='flex' alignItems='center' margin={theme.spacing(1, 0, 1)} height='100%' position='relative' contentEditable={true} width={2} zIndex={10} left='2px' {...attributes.position} tabIndex={0}>
    <span {...attributes}>{props.children}</span>
  </Box>
}

export function TableRight({ attributes, ...props }, ref) {
  const theme = useTheme()

  return <Box suppressContentEditableWarning display='flex' alignItems='center' padding={theme.spacing(1, 0, 1)} height='100%' position='relative' contentEditable={true} width={2} zIndex={10} right='1px' {...attributes.position} tabIndex={0}>
    <span {...attributes}>{props.children}</span>
  </Box>
}