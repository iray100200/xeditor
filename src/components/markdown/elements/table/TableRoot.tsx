import { useTheme } from '@mui/material/styles';

import { Wrapper } from '../core/wrapper/Wrapper';

export function TableRoot({ attributes, element, ...props }, ref) {
  return <Wrapper role='table-root' contentNodeProps={{
    alignSelf: 'stretch'
  }} suppressContentEditableWarning contentEditable={false} direction='row' baseLineHeight='48px' contentNodeLineHeight='28px' draggable slateElement={element}>
    {props.children}
  </Wrapper>
}