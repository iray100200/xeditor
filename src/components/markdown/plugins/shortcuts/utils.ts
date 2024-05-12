import { BLOCK_SHORTCUTS, BlockShortcut } from "./constants"

export function findMarkdownElementType(input: string): BlockShortcut | undefined {
  return BLOCK_SHORTCUTS.find((item: BlockShortcut) => {
    return item.match.some((value) => {
      if (typeof value === 'string') {
        return input === value
      }
      return value.test(input)
    })
  })
}