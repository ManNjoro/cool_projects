import { useEffect, useState } from "react"
import TreeView from "./components/TreeView"
import axios from 'axios'

function App() {
  const url = "http://localhost:3000/menus"
  const [menus, setMenus] = useState([])

  useEffect(()=>{
    axios.get(url)
    .then(res => {
      setMenus(res.data)
    })
  },[])
  return (
    <>
      <TreeView menus={menus}/>
    </>
  )
}

export default App
