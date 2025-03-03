import { useCallback, useEffect, useMemo, useState } from "react"
import { Editable, ReactEditor, Slate, withReact } from "slate-react"
import { BaseEditor, createEditor, Editor, Transforms } from "slate"
import { withYjs, YjsEditor, withYHistory } from "@slate-yjs/core"
import * as Y from "yjs"
import styles from "./editor.module.css"
import { HocuspocusProvider } from "@hocuspocus/provider"

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
  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: 'ws://127.0.0.1:1234',
        name: 'slate-yjs-demo',
        connect: false,
      }),
    []
  );
  
  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText);
    const e = withReact(withYHistory(withYjs(createEditor(), sharedType)));

    // Ensure editor always has at least 1 valid child
    const { normalizeNode } = e;
    e.normalizeNode = (entry) => {
      const [node] = entry;
      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      Transforms.insertNodes(
        editor,
        {
          //@ts-ignore
          type: 'paragraph',
          children: [{ text: '' }],
        },
        { at: [0] }
      );
    };

    return e;
  }, [provider.document]);
  
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

  // Connect editor and provider in useEffect to comply with concurrent mode
  // requirements.
  useEffect(() => {
    provider.connect();
    return () => provider.disconnect();
  }, [provider]);

  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor);
  }, [editor]);

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
