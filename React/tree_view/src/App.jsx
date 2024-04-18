import TreeView from "./components/TreeView"

function App() {
  const url = "http://localhost:3000/menus"

  return (
    <>
      <TreeView menus={url}/>
    </>
  )
}

export default App
