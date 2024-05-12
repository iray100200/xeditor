import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import { RiDraggable, RiH1, RiH2, RiH3, RiH4, RiH5, RiH6 } from '@remixicon/react'
import { MouseEvent, useCallback } from 'react';

declare interface BlockOperationPrefixProps {
  children?: React.ReactElement | React.ReactElement[] | string;
  setDragRef: (element: HTMLElement) => void;
  active?: boolean;
  hover?: boolean;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | string
}

const icons: {
  [name: string]: JSX.ElementType
} = {
  h1: RiH1,
  h2: RiH2,
  h3: RiH3,
  h4: RiH4,
  h5: RiH5,
  h6: RiH6,
}

export function BlockOperationPrefix(props: BlockOperationPrefixProps) {
  const theme = useTheme()
  const Icon = props.type && icons[props.type]
  const preventDefault = useCallback((event: MouseEvent) => {
    event.preventDefault()
  }, [])

  return <Stack
    direction='row'
    position='absolute'
    top={0}
    left={theme.spacing(5)}
    width={0}
    height='100%'
    alignItems='center'
    spacing={1}
    component='div'
    suppressContentEditableWarning
    onMouseDown={preventDefault}
    contentEditable={false}>
    <Box height='100%' display='inline-flex' alignItems='center' width={20} color={grey[400]} sx={{
      transition: '0.5s opacity',
      opacity: props.hover || props.active ? 1 : 0,
    }}>
      {Icon && <Icon size={20} />}
    </Box>
    <Box display='inline-flex' alignItems='center' width={20} padding={theme.spacing(0.5, 0.25)} color={grey[400]} borderRadius={0.5} ref={props.setDragRef}
      sx={{
        cursor: 'pointer',
        transition: '0.5s opacity, backgroundColor',
        opacity: props.hover ? 1 : 0,
        transform: 'translate(0, 0.5px)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          color: grey[900]
        }
      }}>
      <RiDraggable size={18} />
    </Box>
  </Stack>
}