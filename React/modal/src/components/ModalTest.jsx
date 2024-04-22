import { useState } from "react"


export default function ModalTest() {
  const [showModalPopup, setShowModalPopup] = useState(false)

  function handleToggleModalPopup() {
    setShowModalPopup(!showModalPopup)
  }
  return (
    <div>
      <button onClick={handleToggleModalPopup}>Open Modal Popup</button>
    </div>
  )
}
