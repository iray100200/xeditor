import Box from '@mui/material/Box';
import React, { forwardRef, MouseEvent, useCallback, useImperativeHandle, useRef } from 'react';
import { RiArrowDownSFill } from "react-icons/ri";

interface MoreButtonProps {
  onMouseDown?: React.EventHandler<React.MouseEvent>;
  selectable?: boolean;
}

export const MoreButton = forwardRef(
  function MoreButton(props: MoreButtonProps, ref) {
    const moreElementRef = useRef()
    const { selectable, ...$props } = props

    useImperativeHandle(ref, () => {
      return moreElementRef.current
    }, [moreElementRef])

    const styles = {
      cursor: 'pointer',
    }
    if (selectable) {
      styles['&:hover'] = {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
      }
    }

    const handleMouseDown = useCallback((event: MouseEvent) => {
      event.preventDefault()
      props.onMouseDown && props.onMouseDown(event)
    }, [props])

    return <Box {...$props} ref={moreElementRef} onMouseDown={handleMouseDown} display='flex' alignItems='center' height={26} borderRadius={0.5} sx={styles}>
      <RiArrowDownSFill color='var(--md-toolbar-icon-button-color)' />
    </Box>
  }
)