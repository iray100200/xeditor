import { useCallback } from 'react';
import { Element } from 'slate';
import { useSlate } from 'slate-react';

import { MarkdownElementType } from '../../custom-types';
import { filter } from '../../manager';


export function useSlateElementFilter(type: MarkdownElementType) {
  const editor = useSlate()
  const getNode = useCallback(() => {
    return !!editor.above({
      match: node => Element.isElement(node) && editor.isBlock(node) && node.type === type
    })
  }, [editor, type])

  const node = getNode()
  const element = Element.isElement(node) ? node : null

  return {
    filter: filter(() => {
      return !!node
    }),
    element
  }
}
