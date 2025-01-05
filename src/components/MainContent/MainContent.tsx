import React, { useState, useEffect, useRef  } from "react";
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

    const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);
    const unlistenScanCompleteRef = useRef<(() => void) | null>(null);
    /* Run on load */
    useEffect(() => {
      const handleEvent = async() => {
        /* Event */
        const unlistenScanDataChunk = await listen('scan-data-chunk', async (event) => {
          console.log("Emit");
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

        const unlistenScanComplete = await listen('scan-complete',async () => {
          setLoading(false);
        });

        // Store unlisten functions in refs
        unlistenScanDataChunkRef.current = unlistenScanDataChunk;
        unlistenScanCompleteRef.current = unlistenScanComplete;
      };

      eventDiskSelected.on("clearDiv",() => {
        console.log("Cleared dataChunks:", dataChunks); // Should log an empty array
        setDataChunks([]);
      });

      handleEvent();

      // Cleanup listeners on unmount
      return () => {
        console.log("Cleaning up listeners...");
        if (unlistenScanDataChunkRef.current) unlistenScanDataChunkRef.current();
        if (unlistenScanCompleteRef.current) unlistenScanCompleteRef.current();
        eventDiskSelected.off("clearDiv"); // Remove custom event listener
      };
    }, []); // The empty dependency array ensures this runs only once (on mount)

    // Log updated state whenever dataChunks changes
  useEffect(() => {
    console.log("Updated dataChunks:", dataChunks); // Logs after state update
  }, [dataChunks]);

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