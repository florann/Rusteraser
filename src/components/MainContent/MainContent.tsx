import React, { useState, useEffect, useRef  } from "react";

import "./MainContent.css";
import Browser from "../Browser/Browser";

function MainContent() {
    /* Run on load */
    useEffect(() => {
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">
      <Browser></Browser>
    </div>
  );
}

export default MainContent;