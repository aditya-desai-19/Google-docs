import { useCallback, useState } from "react"
import styles from "./editor.module.css"
import { Editable, Slate, withReact } from "slate-react"
import { createEditor, Descendant, Editor } from "slate"

type LeafType = {
  attributes: any
  children: any
  leaf: any
}

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
]

const Leaf = ({ attributes, children, leaf }: LeafType) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.h1) {
    children = <span style={{ fontSize: 20 }}>{children}</span>
  }

  return <span {...attributes}>{children}</span>
}

//todo 
const Toolbar = () => {
  return (
    <div className={styles.toolbar}>
      <select title="Font">
        <option value="ar">Arial</option>
        <option value="tnr">Times new roman</option>
      </select>
      <select title="Font size">
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
      </select>
      <span title="Bold" className={styles.toolbarBtn}>B</span>
      <span title="Italics" className={styles.toolbarBtn}>I</span>
      <span title="Underline" className={styles.toolbarBtn}>U</span>
    </div>
  )
}

const CustomEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  return (
    <div className={styles.editorContainer}>
      <Slate editor={editor} initialValue={initialValue}>
        <Toolbar />
        <Editable
          renderLeaf={renderLeaf}
          className={styles.editor}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return
            }
            
            //create a common function
            switch (event.key) {
              case "b": {
                console.log("inside here")
                event.preventDefault()
                Editor.addMark(editor, "bold", true)
                break
              }

              case "i": {
                event.preventDefault()
                Editor.addMark(editor, "italic", true)
                break
              }

              case "u": {
                event.preventDefault()
                Editor.addMark(editor, "underline", true)
                break
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}

export default CustomEditor
