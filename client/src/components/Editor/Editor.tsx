import { useCallback, useEffect, useMemo, useState } from "react"
import styles from "./editor.module.css"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"
import { BaseEditor, createEditor, Editor } from "slate"

type LeafType = {
  attributes: any
  children: any
  leaf: any
}

type ToolbarStatus = {
  isActiveBold: boolean
  isActiveItalic: boolean
  isActiveUnderline: boolean
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

  return <span {...attributes}>{children}</span>
}

const handleFormat = (
  editor: BaseEditor & ReactEditor,
  format: string,
  isActive: boolean
) => {
  Editor.addMark(editor, format, isActive)
}

//todo
const defaultToolbarStatus: ToolbarStatus = {
  isActiveBold: false,
  isActiveItalic: false,
  isActiveUnderline: false,
}

const defaultFontSize: number = 12

const CustomEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))
  const [toolbarStatus, setToolbarStatus] =
    useState<ToolbarStatus>(defaultToolbarStatus)
  const [fontSize, setFontSize] = useState<number>(defaultFontSize)

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  const handleBold = useCallback(
    (editor: BaseEditor & ReactEditor) => {
      handleFormat(editor, "bold", !toolbarStatus.isActiveBold)
      setToolbarStatus({
        ...toolbarStatus,
        isActiveBold: !toolbarStatus.isActiveBold,
      })
    },
    [toolbarStatus.isActiveBold]
  )

  const handleItalic = useCallback(
    (editor: BaseEditor & ReactEditor) => {
      handleFormat(editor, "italic", !toolbarStatus.isActiveItalic)
      setToolbarStatus({
        ...toolbarStatus,
        isActiveBold: !toolbarStatus.isActiveItalic,
      })
    },
    [toolbarStatus.isActiveItalic]
  )

  const handleUnderline = useCallback(
    (editor: BaseEditor & ReactEditor) => {
      handleFormat(editor, "italic", !toolbarStatus.isActiveUnderline)
      setToolbarStatus({
        ...toolbarStatus,
        isActiveBold: !toolbarStatus.isActiveUnderline,
      })
    },
    [toolbarStatus.isActiveUnderline]
  )

  const changeFontSize = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFontSize(parseInt(e.target.value))
    },
    []
  )

  const MemonizedToolbar = useMemo(() => {
    return (
      <div className={styles.toolbar}>
        {/* todo */}
        <select title="Font">
          <option value="ar">Arial</option>
          <option value="tnr">Times new roman</option>
        </select>
        {/* todo */}
        <select title="Font size" value={fontSize} onChange={changeFontSize}>
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
        </select>
        <span
          title="Bold"
          className={styles.toolbarBtn}
          style={{ fontWeight: toolbarStatus.isActiveBold ? "bold" : "normal" }}
          onClick={() => handleBold(editor)}
        >
          B
        </span>
        <span
          title="Italics"
          className={styles.toolbarBtn}
          style={{
            fontWeight: toolbarStatus.isActiveItalic ? "bold" : "normal",
          }}
          onClick={() => handleItalic(editor)}
        >
          I
        </span>
        <span
          title="Underline"
          className={styles.toolbarBtn}
          style={{
            fontWeight: toolbarStatus.isActiveUnderline ? "bold" : "normal",
          }}
          onClick={() => handleUnderline(editor)}
        >
          U
        </span>
      </div>
    )
  }, [toolbarStatus, fontSize])

  useEffect(() => {
    handleFormat(editor, `fontSize${fontSize}`, true)
  }, [fontSize, editor])

  return (
    <div className={styles.editorContainer}>
      <Slate editor={editor} initialValue={initialValue}>
        {MemonizedToolbar}
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
                event.preventDefault()
                handleFormat(editor, "bold", true)
                break
              }

              case "i": {
                event.preventDefault()
                handleFormat(editor, "italic", true)
                break
              }

              case "u": {
                event.preventDefault()
                handleFormat(editor, "underline", true)
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
