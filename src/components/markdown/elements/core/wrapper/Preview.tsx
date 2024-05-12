import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useDragLayer } from 'react-dnd';

const previewStyles = ({ top = 0, left = 0, width, height }) => ({
  position: 'absolute',
  transform: `translate(${left}px, ${top}px)`,
  zIndex: 3090,
  pointerEvents: 'none',
  width,
  height
})

export const Preview = () => {
  const theme = useTheme()
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  if (!item || !isDragging || !currentOffset) {
    return null
  }

  const { x: left, y: top } = currentOffset
  const { width, height } = item.position

  return <Box position='absolute' sx={{ ...previewStyles({ width, height, left: left + item.offset[0], top: top + item.offset[1] }) }}>
    <div dangerouslySetInnerHTML={{ __html: item.target.outerHTML }}></div>
  </Box>
}
