import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const id = uuidv4();
    navigate(`/document/${id}`)
  }, [])

  return (
    <></>
  )
}

export default App
