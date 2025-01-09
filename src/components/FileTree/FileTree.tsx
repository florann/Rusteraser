import React, { useState, useEffect, useRef  } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { EntityInfo, isEntityInfo} from "../../type/typeEntityInfo";
import Entity from "../Entity/Entity";
import eventDiskSelected from "../../event/eventDiskSelected";
import "./FileTree.css";

function FileTree() {
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
            setLoading(false);
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

        const unlistenScanComplete = await listen('scan-complete',async () => {
            setLoading(false);
        });
        unlistenScanCompleteRef.current = unlistenScanComplete;
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
        if (unlistenScanCompleteRef.current){
            unlistenScanCompleteRef.current();
        }
        eventDiskSelected.off("clearDiv"); // Remove custom event listener
        };
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="FileContent">
        {loading ? (<div>Loading...</div>) : (dataChunks.map((chunk, index) => (
            <div  key={index}>
            <Entity index={index} p_EntityInfo={chunk}></Entity>
            </div>
        )))}
    </div>
  );
}

export default FileTree;