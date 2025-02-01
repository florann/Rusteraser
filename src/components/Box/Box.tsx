import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./box.css";

interface BoxProps {
    title: string,
    ReactComponent: React.ReactNode
}

function Box({title, ReactComponent }: BoxProps) {
    /* Run on load */
    useEffect(() => {

    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="box">
    <div className="boxTitle">
      <div className="title">
        <div className="innerTitle">
          {title}
        </div>
      </div>
    </div>
    <div className="boxContent">
        {ReactComponent}
    </div>
  </div>
  );
}

export default Box;