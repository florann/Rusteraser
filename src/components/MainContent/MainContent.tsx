import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./MainContent.css";

function MainContent() {
    /* Run on load */
    useEffect(() => {

    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">

    </div>
  );
}

export default MainContent;