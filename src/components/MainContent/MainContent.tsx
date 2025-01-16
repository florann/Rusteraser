import React, { useState, useEffect, useRef  } from "react";

import "./MainContent.css";
import Browser from "../Browser/Browser";
import TreeMap from "../TreeMap/TreeMap";

function MainContent() {
    /* Run on load */
    useEffect(() => {
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">
      <TreeMap></TreeMap>
    </div>
  );
}

export default MainContent;