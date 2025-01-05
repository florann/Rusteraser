import React, { useState, useEffect, StrictMode } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import { EntityInfo, isEntityInfo} from "../../type/typeEntityInfo";
import "./MainContent.css";

import Entity from "../Entity/Entity";

import eventDiskSelected from "../../event/eventDiskSelected";

function MainContent() {
    // State to store received data chunks
    const [dataChunks, setDataChunks] = useState<EntityInfo[]>([]);

    const [loading, setLoading] = useState(true);

    const [content, setContent] = useState();

    /* Run on load */
    useEffect(() => {
      const handleEvent = async() => {
        /* Event */
        await listen('scan-data-chunk', async (event) => {
          setLoading(true);
          let obj_EntityInfo = event.payload;
          try {
            if(isEntityInfo(obj_EntityInfo)){
              setDataChunks((prevChunks) => [...prevChunks, event.payload as EntityInfo]);
            }
          } catch (error) {
            console.error("Failed to parse EntityInfo:", error);
          }
        });

        await listen('scan-complete',async () => {
          setLoading(false);
        });
      };


      handleEvent();
    }, [loading]); // The empty dependency array ensures this runs only once (on mount)

    
    eventDiskSelected.on("clearDiv",() => {
      console.log("Cleared dataChunks:", dataChunks); // Should log an empty array
      setDataChunks([]);
      console.log("Cleared dataChunks:", dataChunks); // Should log an empty array
    });
    
  return (
    <div className="mainContent">
      {loading ? (<div>Loading...</div>) : (dataChunks.map((chunk, index) => (
        <div  key={index}>
          <Entity index={index} p_EntityInfo={chunk}></Entity>
        </div>
      )))}
    </div>
  );
}

export default MainContent;