import React, { useState, useEffect, useRef  } from "react";

import "./MainContent.css";
import FileTree from "../FileTree/FileTree";

function MainContent() {
    /* Run on load */
    useEffect(() => {
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">
      <FileTree></FileTree>
    </div>
  );
}

export default MainContent;