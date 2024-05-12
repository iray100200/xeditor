import ClickAwayListener from '@mui/material/ClickAwayListener';
import Stack, { StackProps } from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface IconButtonContainerProps extends StackProps {
  value?: string;
  active?: boolean;
  onClickAway?: (event: MouseEvent | TouchEvent) => void;
  selectable?: boolean;
}

export const IconButtonContainer = forwardRef<HTMLDivElement | undefined, IconButtonContainerProps>(
  function IconButtonContainer(props: IconButtonContainerProps, ref) {
    const iconButtonContainerRef = useRef<HTMLDivElement>()
    const { onClickAway, active, selectable, ...$props } = props

    useImperativeHandle(ref, () => {
      return iconButtonContainerRef.current
    }, [iconButtonContainerRef])

    const styles: SxProps = {}
    if (active) {
      styles['backgroundColor'] = 'rgba(0, 0, 0, 0.08)'
    } else if (selectable) {
      styles['&:hover'] = {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
      }
    }

    const Node = <Stack overflow='hidden' height={28} borderRadius='2px' {...$props} ref={(element) => {
      if (element) {
        iconButtonContainerRef.current = element
      }
    }} direction='row' alignItems='center' sx={styles}>
      {props.children}
    </Stack>

    return onClickAway ? <ClickAwayListener onClickAway={onClickAway}>
      {Node}
    </ClickAwayListener> : Node
  }
)