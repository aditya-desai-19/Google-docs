import { useCallback, useState } from "react"
import { Editable, withReact, useSlate, Slate } from "slate-react"
import { Editor, createEditor } from "slate"
import styles from "./editor.module.css"

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
]

const RichTextExample = () => {
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <div
      className={styles.editorContainer}
    >
      <Slate editor={editor} initialValue={initialValue}>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          className={styles.editor}
        />
      </Slate>
    </div>
  )
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const Toolbar = () => {
  const editor = useSlate()
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.toolbarBtn}
        style={{
          fontWeight: isMarkActive(editor, "bold") ? "bold" : "normal",
        }}
        onMouseDown={(event) => {
          event.preventDefault()
          toggleMark(editor, "bold")
        }}
      >
        B
      </button>
      <button
        className={styles.toolbarBtn}
        style={{
          fontWeight: isMarkActive(editor, "italic") ? "bold" : "normal",
        }}
        onMouseDown={(event) => {
          event.preventDefault()
          toggleMark(editor, "italic")
        }}
      >
        I
      </button>
    </div>
  )
}

export default RichTextExample
