import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { BrowserRouter as Router, Routes, Route } from "react-router"
import CustomEditor from "./components/Editor/Editor.tsx"
import "./main.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/document/:id" element={<CustomEditor />} />
      </Routes>
    </Router>
  </StrictMode>
)
