import { useState } from "react";
import Modal from "./Modal";

export default function ModalTest() {
  const [showModalPopup, setShowModalPopup] = useState(false);

  function handleToggleModalPopup() {
    setShowModalPopup(!showModalPopup);
  }
  return (
    <div>
      <button onClick={handleToggleModalPopup}>Open Modal Popup</button>
      {showModalPopup && (
        <Modal
          id={"custom-id"}
          header={<h2>Customized Header</h2>}
          body={<div>Customized body</div>}
          footer={<h2>Customized Footer</h2>}
          setShowModalPopup={setShowModalPopup}
        />
      )}
    </div>
  );
}
