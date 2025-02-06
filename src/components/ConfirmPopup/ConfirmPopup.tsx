import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

type ConfirmPopupProps = {
  message: string;
  onYes: () => void;
  onNo: () => void;
};

const ConfirmPopup = ({ message, onYes, onNo }: ConfirmPopupProps) => {
  return createPortal(
    <div className="confirm">
      <div>{message}</div>
      <div className="btn_yes">
          <FontAwesomeIcon icon={faCheck} onClick={onYes}></FontAwesomeIcon>
      </div>
      <div className="btn_no" onClick={onNo}>
          <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
      </div>
  </div>,
    document.body
  );
};

let setPopupState: (
  (state: 
    { message: string; onYes: () => void } | null) => void) | null = null;

// **Global Function to Spawn the Popup**
export function spawnConfirmPopup(message: string, onYes: () => void) {
  if (setPopupState) {
    setPopupState({ message, onYes });
  }
}

// **Popup Manager Component**
const ConfirmPopupManager = () => {
  //const [popupState, setPopupStateLocal] = useState<{ message: string; onYes: () => void } | null | undefined>(null);
  const [popupState, setPopupStateLocal] = useState<{ message: string; onYes: () => void } | null>(null);

  useEffect(() => {
    setPopupState = setPopupStateLocal;
    return () => {
      setPopupState = null;
    };
  }, []);

  return popupState ? (
    <ConfirmPopup
      message={popupState.message}
      onYes={() => {
        popupState.onYes();
        setPopupStateLocal(null); // ✅ No TypeScript error
      }}
      onNo={() => setPopupStateLocal(null)} // ✅ No TypeScript error
    />
  ) : null;
};

export default ConfirmPopupManager;
