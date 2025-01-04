import React, { useState, useEffect, StrictMode } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import "./MainContent.css";

import Entity from "../Entity/Entity";

function MainContent() {
    // State to store received data chunks
    const [dataChunks, setDataChunks] = useState<object[]>([]);


    /* Run on load */
    useEffect(() => {
      /* Event */
      listen('scan-data-chunk', (event) => {
        console.log("Event payload");
        console.log(event.payload);
        setDataChunks((prevChunks) => [...prevChunks, event.payload as object]);
      });
      

    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">
      {dataChunks.map((chunk, index) => (
        <div>
          <Entity index={index} obj_EntityInfo={chunk}></Entity>
        </div>
      ))}
    </div>
  );
}

export default MainContent;