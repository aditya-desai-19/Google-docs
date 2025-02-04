"use client";

import { useEffect, useState, useRef } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function MyEditor() {
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	console.log({ isClient });
	if (!isClient) return null; // Prevent rendering during SSR

	return (
		<div>
			<header className="App-header">Rich Text Editor Example</header>
			<Editor
				editorState={editorState}
				onEditorStateChange={setEditorState}
			/>
		</div>
	);
}
