import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import "./styles.css"

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

function TextEditor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null)

  const wrapperRef = useCallback((wrapper) => {
    if(wrapper == null) return
    wrapper.innerHTML = ''
    const editor = document.createElement('div')
    wrapper.append(editor)
    const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS}})
    setQuill(q)
  }, [])

  useEffect(() => {
    const s = new WebSocket("ws://localhost:8000/ws");
    setSocket(s)

    s.onopen = () => {
      s.send("Connection established")
    }

    return () => {
      s.close()
    }
  }, [])

  useEffect(() => {
    if(socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if(source !== 'user') return
      socket.send(JSON.stringify(delta))
    }

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if(socket == null || quill == null) return

    socket.onmessage = (event) => {
      if(event.data) {
        const data = JSON.parse(event.data); 
        quill.updateContents(data);
      }
    };
  }, [socket, quill])

  return (
    <div className="container" ref={wrapperRef}></div>
  )
}

export default TextEditor