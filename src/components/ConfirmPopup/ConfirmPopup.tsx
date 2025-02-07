import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

type ConfirmPopupProps = {
  message: string;
  onYes: () => void;
  onNo: () => void;
  position: { top: number; left: number };
};

const ConfirmPopup = ({ message, onYes, onNo, position }: ConfirmPopupProps) => {
  return createPortal(
    <div className="confirm" style={{top: position.top, left: position.left}}>
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

type PopupState = { 
  message: string; 
  onYes: () => void; 
  position: { top: number; left: number } 
} | null;

let setPopupState: ((state: PopupState) => void) | null = null;

// **Global Function to Spawn the Popup**
export function spawnConfirmPopup(message: string, onYes: () => void, event: React.MouseEvent) {
  if (setPopupState) {
    console.log("spawn function");
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopupState({
      message,
      onYes,
      position: {
        top: rect.top + window.scrollY + rect.height + 5, // Position below clicked element
        left: rect.left + window.scrollX
      }
    });
  }
}

// **Popup Manager Component**
const ConfirmPopupManager = () => {
  const [popupState, setPopupStateLocal] = useState<PopupState>(null);

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
        setPopupStateLocal(null);
      }}
      onNo={() => setPopupStateLocal(null)}
      position={popupState.position}
    />
  ) : null;
};

export default ConfirmPopupManager;
