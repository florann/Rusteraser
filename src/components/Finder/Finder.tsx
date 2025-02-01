import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Finder.css";

function Finder() {
    /* Run on load */
    useEffect(() => {

    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="finder">
    
    </div>
  );
}

export default Finder;