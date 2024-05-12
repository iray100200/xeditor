import { CustomElement } from 'slate';

import { Wrapper } from "./core/wrapper/Wrapper";

declare interface ParagraphProps {
  element: CustomElement;
  attributes: {};
  children: React.ReactNode | React.ReactNode[];
}

export const Paragraphy = ({ attributes, element, ...props }: ParagraphProps) => {
  return <Wrapper slateElement={element} baseLineHeight='24px' contentNodeLineHeight='24px' draggable>
    <span {...attributes}>{props.children}</span>
  </Wrapper>
}