import React, { useState, useEffect, useRef  } from "react";

import "./MainContent.css";
import Browser from "../Browser/Browser";
import TreeMapChart from "../TreeMap/TreeMapChart";

function MainContent() {
    /* Run on load */
    useEffect(() => {
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">
      <TreeMapChart></TreeMapChart>
    </div>
  );
}

export default MainContent;