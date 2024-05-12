import Box from '@mui/material/Box'
import { blue, grey } from '@mui/material/colors'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { RiTable2 } from '@remixicon/react'
import cuid from 'cuid'
import { MouseEvent, useCallback, useRef, useState } from 'react'
import { map } from 'rxjs'
import { CustomElement, Editor, Element, Path, Transforms } from 'slate'
import { useSlate } from 'slate-react'

import { MarkdownElementType } from '../../custom-types'
import { IconButton } from './base/IconButton'
import { IconButtonContainer } from './base/IconButtonContainer'
import { MoreButton } from './base/MoreButton'
import { Popper, usePopper } from './base/Popper'

const TABLE_LENGTH = [8, 8]

declare type Location = [number, number]

declare interface TableSelectorProps {
  onCreate?: (scale: [number, number]) => void;
}

function TableSelector(props: TableSelectorProps) {
  const [hoverLocation, setHoverLocation] = useState<Location>([0, 0])
  const handleOver = useCallback((rowIndex: number, columnIndex: number) => {
    setHoverLocation([rowIndex, columnIndex])
  }, [])

  const handleCreate = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    props.onCreate && props.onCreate([hoverLocation[0] + 1, hoverLocation[1] + 1])
  }, [props, hoverLocation])

  return <Stack spacing={0.75} onMouseDown={(event) => event.preventDefault()}>
    <Typography variant='body2'>{hoverLocation[0] + 1} × {hoverLocation[1] + 1}</Typography>
    <Box component='table' border={0} cellPadding={0} cellSpacing={0} sx={{
      borderCollapse: 'collapse'
    }}>
      <Box component='tbody'>
        {
          Array.from({ length: TABLE_LENGTH[0] }).map((_, rowIndex) => {
            return <Box component='tr' key={rowIndex}>
              {
                Array.from({ length: TABLE_LENGTH[1] }).map((_, columnIndex) => {
                  const selected = hoverLocation[0] >= rowIndex && hoverLocation[1] >= columnIndex
                  return <Box
                    component='td'
                    border={`1px solid ${grey[300]}`}
                    key={columnIndex}
                    bgcolor={selected ? blue[100] : undefined}
                    onMouseDown={handleCreate}
                    onMouseOver={() => handleOver(rowIndex, columnIndex)} width={20} height={20}>
                  </Box>
                })
              }
            </Box>
          })
        }
      </Box>
    </Box>
  </Stack>
}

export const TableButton = () => {
  const editor = useSlate()
  const anchorRef = useRef(null)
  const theme = useTheme()
  const { ref, open, context: popperContext } = usePopper()

  const handleCreateTable = useCallback(([rowLength, columnLength]) => {
    if (!editor.selection) return

    const handleInsertTextBeforeCurrentNode = (text) => {
      if (!editor.selection) return
      const root = editor.above({
        match: node => Element.isElement(node) && node.type === MarkdownElementType.TableRoot
      })

      if (!root) return

      editor.insertNode({
        type: MarkdownElementType.Paragraph,
        id: cuid(),
        children: [
          {
            text
          }
        ]
      }, {
        at: root[1],
        select: true
      })
    }

    const handleInsertTextAfterCurrentNode = (text: string) => {
      if (!editor.selection) return
      const root = editor.above({
        match: node => Element.isElement(node) && node.type === MarkdownElementType.TableRoot
      })
      if (!root) return
      const nextPath = Path.next(root?.[1])

      editor.insertNode({
        type: MarkdownElementType.Paragraph,
        id: cuid(),
        children: [
          {
            text: ''
          },
        ]
      }, {
        at: nextPath,
        select: true
      })
    }

    const node = editor.above({
      match: (n) => Element.isElement(n) && !editor.isEmpty(n)
    })

    const next = {
      type: MarkdownElementType.TableRoot,
      id: cuid(),
      children: [
        {
          type: MarkdownElementType.TableLeft,
          id: cuid(),
          children: [
            {
              text: ''
            }
          ]
        },
        {
          type: MarkdownElementType.Table,
          id: cuid(),
          children: Array.from({ length: rowLength }).map(() => ({
            type: MarkdownElementType.TableRow,
            id: cuid(),
            children: Array.from({ length: columnLength }).map(() => ({
              type: MarkdownElementType.TableCell,
              id: cuid(),
              children: [
                {
                  text: ''
                },
              ]
            }))
          }))
        },
        {
          type: MarkdownElementType.TableRight,
          id: cuid(),
          children: [
            {
              text: ''
            }
          ]
        },
      ]
    }
    if (node) {
      editor.insertNodes(next)
    } else {
      editor.insertNodeAtCurrentLocation(next)
    }
    popperContext.close()
  }, [editor, popperContext])

  return (
    <IconButtonContainer ref={anchorRef} active={open} onMouseDown={event => {
      event.preventDefault()
    }} selectable>
      <IconButton>
        <RiTable2 size={20} />
      </IconButton>
      <MoreButton />
      <Popper ref={ref} anchorEl={anchorRef.current} triggerEl={anchorRef.current}>
        <Box padding={theme.spacing(1.5, 1.5)}>
          <TableSelector onCreate={handleCreateTable} />
        </Box>
      </Popper>
    </IconButtonContainer>
  )
}
