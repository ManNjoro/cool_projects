/* eslint-disable react/prop-types */

import { useRef } from "react";
import useOutsideClick from "./useOutsideClick";

export default function Modal({ id, header, body, footer, setShowModalPopup }) {
  const ref = useRef()
  useOutsideClick(ref, ()=> setShowModalPopup(false))
  const handleCloseModal = () => {
    setShowModalPopup(false);
  };
  return (
    <div ref={ref} id={id || "Modal"} className="modal">
      <div className="content">
        <div className="header">
          <span className="close-modal-icon" onClick={handleCloseModal}>
            &times;
          </span>
          <h2>{header ? header : "Header"}</h2>
        </div>
        <div className="body">
          {body ? (
            body
          ) : (
            <div>
              <p>This is our Modal body</p>
            </div>
          )}
        </div>
        <div className="footer">
          {footer ? (
            footer
          ) : (
            <div>
              <h2>This is our footer</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
