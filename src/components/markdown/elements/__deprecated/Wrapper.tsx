import { useTheme } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { forwardRef, MouseEvent, useCallback, useImperativeHandle, useRef } from 'react';

import { Position } from './Position';

export declare interface StyledRootProps extends BoxProps {
  onPositionChange?: (pos: Position) => void;
}

export declare interface WrapperRef<T extends HTMLElement> {
  current: T | null;
}

const Wrapper = forwardRef<WrapperRef<HTMLElement>, StyledRootProps>(function Wrapper({ onPositionChange, ...props }, ref) {
  const theme = useTheme()
  const elementRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => {
    return {
      current: elementRef.current
    }
  }, [elementRef])

  const handleMouseMove = useCallback((evt: MouseEvent) => {
    if (elementRef.current) {
      const { clientY } = evt
      const { height, y } = elementRef.current.getBoundingClientRect();
      if (clientY < y + height / 2) {
        onPositionChange && onPositionChange(Position.Before)
      } else if (clientY > y + height / 2) {
        onPositionChange && onPositionChange(Position.After)
      }
    }
  }, [elementRef, onPositionChange])

  const handleMouseLeave = useCallback((evt: MouseEvent) => {
    if (elementRef?.current) {
      onPositionChange && onPositionChange(Position.Out)
    }
  }, [elementRef, onPositionChange])

  return <Box
    ref={elementRef}
    padding={theme.spacing(1.25, 12)}
    position='relative'
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    {...props}>
    {props.children}
  </Box>
})

export default Wrapper
export {
  Wrapper
}
