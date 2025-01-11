import React, { useState, useEffect, useRef  } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { EntityInfo, isEntityInfo} from "../../type/typeEntityInfo";
import Entity from "../Entity/Entity";
import eventDiskSelected from "../../event/eventDiskSelected";
import "./Browser.css";

function Browser() {
  // State to store received data chunks
  const [dataChunks, setDataChunks] = useState<EntityInfo[]>([]);

  const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);
  
  /* Run on load */
  useEffect(() => {
        const handleEvent = async() => {
        /* Event */
        const unlistenScanDataChunk = await listen('dummy-scan', async (event) => {
            console.log("payload");
            console.log(event.payload);
            let obj_EntityInfo = event.payload;
            try {
                if(isEntityInfo(obj_EntityInfo)){
                    setDataChunks((prevChunks) => [...prevChunks, event.payload as EntityInfo]);
                }
            } catch (error) {
            console.error("Failed to parse EntityInfo:", error);
            }
        });
        unlistenScanDataChunkRef.current = unlistenScanDataChunk;

        };
        handleEvent();

        eventDiskSelected.on("clearDiv",() => {
        //console.log("Cleared dataChunks:", dataChunks); // Should log an empty array
        setDataChunks([]);
        });

        // Cleanup listeners on unmount
        return () => {
        if (unlistenScanDataChunkRef.current){
            unlistenScanDataChunkRef.current();
        }

        eventDiskSelected.off("clearDiv"); // Remove custom event listener
        };
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="FileContent">
        {false ? (<div>Loading...</div>) : (dataChunks.map((chunk, index) => (
            <div  key={index}>
            <Entity index={index} p_EntityInfo={chunk}></Entity>
            </div>
        )))}
    </div>
  );
}

export default Browser;