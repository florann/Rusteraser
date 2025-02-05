import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import "./ConfirmPop.css";

function ConfirmPop() {
    /* Run on load */
    useEffect(() => {

    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="confirm">
        <div className="btn_yes">
            <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
        </div>
        <div className="btn_no">
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
        </div>
    </div>
  );
}

export default ConfirmPop;