import { useCallback, useEffect, useMemo, useState } from "react"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"
import { BaseEditor, createEditor, Editor } from "slate"
import { withYjs, YjsEditor, withYHistory } from "@slate-yjs/core"
import * as Y from "yjs"
import styles from "./CustomEditor.module.css"
import { HocuspocusProvider } from "@hocuspocus/provider"
import { useParams } from "react-router"

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
    children: [{ text: "" }],
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

  const getFontSize = () => {
    if(leaf.fontSize18) {
      return 18
    }
    else if(leaf.fontSize16) {
      return 16
    }
    else if(leaf.fontSize14) {
      return 14
    }
    return 12
  }

  const getFontFamily = () => {
    if(leaf.Oswald) {
      return "Oswald"
    }
    else if(leaf.Roboto) {
      return "Roboto"
    }
    return "Montserrat"
  }

  return <span {...attributes} style={{fontSize: getFontSize(), fontFamily: getFontFamily()}}>{children}</span>
}

const handleFormat = (
  editor: BaseEditor & ReactEditor,
  format: string,
  isActive: boolean
) => {
  Editor.addMark(editor, format, isActive)
}

const defaultToolbarStatus: ToolbarStatus = {
  isActiveBold: false,
  isActiveItalic: false,
  isActiveUnderline: false,
}

const fontSizes = ['12', '14', '16', '18']
const fontFamilies = ['Roboto', 'Oswald', 'Montserrat']

const defaultFontSize = "12"
const defaultFontFamily = 'Montserrat'

const CustomEditor = () => {
  const { id } = useParams()
  const [toolbarStatus, setToolbarStatus] = useState<ToolbarStatus>(defaultToolbarStatus)
  const [fontSize, setFontSize] = useState<string>(defaultFontSize)
  const [fontFamily, setFontFamily] = useState<string>(defaultFontFamily)

  const provider = useMemo(() => {
    const doc = new Y.Doc()

    return new HocuspocusProvider({
      url: import.meta.env.VITE_SERVER_URL,
      name: id || "demo",
      connect: false,
      document: doc,
    })
  }, [])

  const editor = useMemo(() => {
    const sharedType = provider.document.get("content", Y.XmlText)
    const e = withReact(withYHistory(withYjs(createEditor(), sharedType)))

    // Ensure editor always has at least 1 valid child
    const { normalizeNode } = e
    e.normalizeNode = (entry) => {
      const [node] = entry
      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry)
      }
    }

    return e
  }, [provider.document])

  const renderElement = useCallback(({ attributes, children, element }: { attributes: any, children: any, element: any }) => {
    switch (element.type) {
      
      default:
        return <p {...attributes}>{children}</p>
    }
  }, []) 

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  const handleBold = useCallback(
    (editor: BaseEditor & ReactEditor) => {
      handleFormat(editor, "bold", !toolbarStatus.isActiveBold)
      setToolbarStatus({
        ...toolbarStatus,
        isActiveBold: !toolbarStatus.isActiveBold,
      })
    },
    [toolbarStatus]
  )

  const handleItalic = useCallback(
    (editor: BaseEditor & ReactEditor) => {
      handleFormat(editor, "italic", !toolbarStatus.isActiveItalic)
      setToolbarStatus({
        ...toolbarStatus,
        isActiveItalic: !toolbarStatus.isActiveItalic,
      })
    },
    [toolbarStatus]
  )

  const handleUnderline = useCallback(
    (editor: BaseEditor & ReactEditor) => {
      handleFormat(editor, "underline", !toolbarStatus.isActiveUnderline)
      setToolbarStatus({
        ...toolbarStatus,
        isActiveUnderline: !toolbarStatus.isActiveUnderline,
      })
    },
    [toolbarStatus]
  )

  const changeFontSize = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newFontSize = e.target.value
      handleFormat(editor, `fontSize${fontSize}`, false)
      handleFormat(editor, `fontSize${newFontSize}`, true)
      setFontSize(newFontSize)
    },
    [handleFormat, fontSize]
  )

  const changeFontFamily = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newFontFamily = e.target.value
      handleFormat(editor, fontFamily, false)
      handleFormat(editor, newFontFamily, true)
      setFontFamily(newFontFamily)
    },
    [handleFormat, fontFamily]
  )
  
  const MemonizedToolbar = useMemo(() => {
    return (
      <div className={styles.toolbar}>
        <select title="Font" className={styles.toolbarDropdown} value={fontFamily} onChange={changeFontFamily}>
          {fontFamilies.map(fm => (
            <option value={fm} key={fm}>{fm}</option>
          ))}
        </select>
        <select title="Font size" className={styles.toolbarDropdown} value={fontSize} onChange={changeFontSize}>
          {fontSizes.map((fz) =>
            <option value={fz} key={fz}>{fz}</option>
          )}
        </select>
        <span
          title="Bold"
          className={styles.toolbarBtn}
          style={{ 
            color: toolbarStatus.isActiveBold ?  "black" : "white",
            fontWeight: toolbarStatus.isActiveBold ? "bold" : "normal"
          }}
          onClick={() => handleBold(editor)}
        >
          B
        </span>
        <span
          title="Italics"
          className={styles.toolbarBtn}
          style={{
            color: toolbarStatus.isActiveItalic ?  "black" : "white",
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
            color: toolbarStatus.isActiveUnderline ?  "black" : "white",
            fontWeight: toolbarStatus.isActiveUnderline ? "bold" : "normal",
          }}
          onClick={() => handleUnderline(editor)}
        >
          U
        </span>
      </div>
    )
  }, [toolbarStatus, fontSize, fontFamily])

  useEffect(() => {
    provider.connect()
    return () => provider.disconnect()
  }, [provider])

  useEffect(() => {
    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor])

  return (
    <div className={styles.editorContainer}>
      <Slate editor={editor} initialValue={initialValue}>
        {MemonizedToolbar}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className={styles.editor}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return
            }

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
