import ClickAwayListener from '@mui/material/ClickAwayListener'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import MuiPopper from '@mui/material/Popper'
import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useImperativeHandle, useMemo, useReducer, useRef, useState } from 'react'
import { Subject } from 'rxjs'

interface PopperProps {
  children: React.ReactNode;
  triggerEl: HTMLElement | null;
  anchorEl: HTMLElement | null;
}

interface States {
  [id: string]: boolean;
}

type State = {
  states: States
}

type Action = {
  type: 'open',
  payload: States
}

function reducer(_: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return {
        states: action.payload
      }
    default:
      return _
  }
}

type ContextType = {
  states: States,
  dispatch?: React.Dispatch<Action>,
  close: () => void,
}

const defaultStates = {}
export const PopperContext = createContext<ContextType>({
  states: defaultStates, close: () => {}
})

export function PopperProvider({ children }) {
  const [{ states }, dispatch] = useReducer(reducer, { states: defaultStates })
  const close = useCallback(() => dispatch({ type: 'open', payload: {} }), [dispatch])

  return <PopperContext.Provider value={{ states, dispatch, close }}>
    {children}
  </PopperContext.Provider>
}

declare interface PopperRef {
  open: boolean;
  subscribe: (callback: (value: boolean) => void) => void;
}

export const Popper = forwardRef<PopperRef, PopperProps>(function Popper(props: PopperProps, ref) {
  const id = useId()
  const { triggerEl, anchorEl } = props
  const { states, dispatch } = useContext(PopperContext)
  const open = states[id] || false
  const subject = useMemo(() => new Subject<boolean>(), [])

  useEffect(() => {
    subject.next(open)
  }, [open, subject])

  useImperativeHandle(ref, () => {
    return {
      open,
      subscribe: (callback: (value: boolean) => void) => {
        subject.subscribe(callback)
      }
    }
  })

  const handleClick = useCallback(() => {
    states[id] = !states[id]
    dispatch && dispatch({ type: 'open', payload: states })
  }, [states, id, dispatch])

  const handleMouseEnter = useCallback(() => {
    if (!Object.values(states).includes(true)) return
    if (!(id in states)) {
      for (let existingId in states) {
        states[existingId] = false
      }
      states[id] = true
    } else {
      for (let existingId in states) {
        states[existingId] = id === existingId
      }
    }
    dispatch && dispatch({ type: 'open', payload: states })
  }, [states, id, dispatch])

  useEffect(() => {
    if (!triggerEl) return
    triggerEl.addEventListener('click', handleClick)
    triggerEl.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      triggerEl.removeEventListener('click', handleClick)
      triggerEl.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [triggerEl, id, handleClick, handleMouseEnter])

  const handleClose = useCallback(() => {
    dispatch && dispatch({ type: 'open', payload: {} })
  }, [dispatch])

  return <MuiPopper
    open={open}
    placement='bottom-start'
    anchorEl={anchorEl}
    transition
  >
    {
      ({ TransitionProps }) => (
        <ClickAwayListener onClickAway={handleClose}>
          <Fade {...TransitionProps} timeout={300}>
            <Paper
              sx={{
                marginTop: 0.5,
                bgcolor: 'var(--md-tooltip-popper-bgcolor)'
              }}
              onMouseDown={(evt) => evt.stopPropagation()}>
              {props.children}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )
    }
  </MuiPopper>
})

export function usePopper() {
  const [open, setOpen] = useState(false)
  const ref = useRef<PopperRef>(null)
  const context = useContext(PopperContext)

  useEffect(() => {
    if (ref.current) {
      ref.current.subscribe((open) => {
        setOpen(open)
      })
    }
  }, [ref])

  return {
    ref,
    open,
    context
  }
}
