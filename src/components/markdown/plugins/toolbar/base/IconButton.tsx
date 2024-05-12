import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton";
import React, { forwardRef, MouseEvent, useCallback, useImperativeHandle, useRef } from 'react';

interface IconButtonProps extends MuiIconButtonProps {
  selectable?: boolean;
}

export const IconButton = forwardRef(
  function IconButton(props: IconButtonProps, ref) {
    const iconButtonRef = useRef<HTMLButtonElement>()
    const { selectable, ...$props } = props

    useImperativeHandle(ref, () => {
      return iconButtonRef.current
    }, [iconButtonRef])

    const styles = {}
    if (selectable) {
      styles['&:hover'] = {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
      }
    }

    const handleMouseDown = useCallback((event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      props.onMouseDown && props.onMouseDown(event);
    }, [props])

    return <MuiIconButton sx={styles} {...$props} ref={(element) => {
      if (element) {
        iconButtonRef.current = element
      }
    }} onMouseDown={handleMouseDown} size='small'>
      {props.children}
    </MuiIconButton>
  })
