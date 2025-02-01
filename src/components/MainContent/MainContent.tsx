import React, { useState, useEffect, useRef  } from "react";

import "./MainContent.css";
import Box from "../Box/Box";
import Browser from "../Browser/Browser";
import Finder from "../Finder/finder";

function MainContent() {
    /* Run on load */
    useEffect(() => {
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">
      <Box title="Browser" ReactComponent={<Browser />}></Box>
      <Box title="Finder" ReactComponent={<Finder />}></Box>
    </div>
  );
}

export default MainContent;