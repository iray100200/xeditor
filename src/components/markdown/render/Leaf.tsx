
import CSS from 'csstype';

export default function Leaf({ attributes, children, leaf }) {
  const styles: CSS.Properties = {}
  if (leaf.color) {
    styles.color = leaf.color
  }

  if (leaf.bold) children = <strong>{children}</strong>
  if (leaf.code) children = <code>{children}</code>
  if (leaf.italic) children = <em>{children}</em>
  if (leaf.underline) children = <u>{children}</u>
  if (leaf.strikethrough) children = <del>{children}</del>
  if (leaf.superscript) children = <sup>{children}</sup>
  if (leaf.subscript) children = <sub>{children}</sub>

  return <span style={styles} {...attributes}>{children}</span>
}