import React, { useState, useEffect, StrictMode } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import "./MainContent.css";

function MainContent() {
    // State to store received data chunks
    const [dataChunks, setDataChunks] = useState<string[]>([]);


    /* Run on load */
    useEffect(() => {
      /* Event */
      listen('scan-data-chunk', (event) => {
        console.log("Event payload");
        console.log(event.payload);
        setDataChunks((prevChunks) => [...prevChunks, event.payload as string]);
      });
      

    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="mainContent">
      {dataChunks.map((chunk, index) => (
        <div>
          {chunk.toString()}
        </div>
      ))}
    </div>
  );
}

export default MainContent;