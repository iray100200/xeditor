import { Variant } from '@mui/material/styles/createTypography';
import Typography from '@mui/material/Typography';
import { RemixiconComponentType,RiH1, RiH2, RiH3, RiH4, RiH5, RiH6 } from '@remixicon/react';
import { useMemo } from 'react'
import { CustomElement } from 'slate';

import { MarkdownElementType } from '../custom-types';
import { Wrapper } from './core/wrapper/Wrapper';

declare interface HeadingProps {
  element: CustomElement;
  attributes: {};
  children: React.ReactNode | React.ReactNode[];
  variant: Variant;
}

export const Heading = ({ attributes, element, ...props }: HeadingProps, ref) => {
  const Icon = useMemo<RemixiconComponentType | null>(() => {
    switch (element.type) {
      case MarkdownElementType.HeadingOne:
        return RiH1
      case MarkdownElementType.HeadingTwo:
        return RiH2
      case MarkdownElementType.HeadingThree:
        return RiH3
      case MarkdownElementType.HeadingFour:
        return RiH4
      case MarkdownElementType.HeadingFive:
        return RiH5
      case MarkdownElementType.HeadingSix:
        return RiH6
      default:
        return null
    }
  }, [element.type])

  return <Wrapper baseLineHeight='40px' contentNodeLineHeight='40px' slateElement={element} draggable symbol={Icon && <Icon size={20} />}>
    <Typography variant={props.variant}>
      <span {...attributes}>{props.children}</span>
    </Typography>
  </Wrapper>
}
