"use client"

import { useEffect, useState, useRef } from "react";
import { Editor, EditorState } from "draft-js";

export default function MyEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isClient, setIsClient] = useState(false);
  const editor = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const focusEditor = () => {
    editor.current?.focus();
  };

  console.log({isClient})
  if (!isClient) return null; // Prevent rendering during SSR

  return (
    <div onClick={focusEditor} style={{width: "100%", height: "100%", border: "1px solid black"}}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={(editorState) => setEditorState(editorState)}
        
      />
    </div>
  );
}
