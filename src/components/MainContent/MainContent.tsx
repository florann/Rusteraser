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
      <div className="box">
        <div>
          Title
        </div>
        <div className="boxContent">
          <Browser></Browser>
        </div>
      </div>
      <div className="box">
        DummyContentDummyContentDummyContentDummyConten
        tDummyContentDummyContentDummyContentDummyContentDummyCon
        tentDummyContentDummyContentDummyContentDummyContentDummyC
        ontentDummyContentDummyContentDummyContent
      </div>
    </div>
  );
}

export default MainContent;