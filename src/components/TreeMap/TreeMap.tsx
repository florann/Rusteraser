import React, { useState, useEffect, useRef  } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { typeTreeMap, isTypeTreeMap} from "../../type/typeTreeMap";
import Entity from "../Entity/Entity";
import eventDiskSelected from "../../event/eventDiskSelected";
import "./TreeMap.css";

function TreeMap() {
  // State to store received data chunks
  const [dataChunks, setDataChunks] = useState<typeTreeMap>();

  const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);
  
  /* Run on load */
  useEffect(() => {
            const handleEvent = async() => {
            /* Event */
            const unlistenScanDataChunk = await listen('cmd_scan_selected_disk_done', async (event) => {
                let obj_TypeTreeMap = event.payload;
                try {
                    if(isTypeTreeMap(obj_TypeTreeMap)){
                        setDataChunks(obj_TypeTreeMap as typeTreeMap);
                    }
                } catch (error) {
                    console.error("Failed to parse EntityInfo:", error);
                }
            });
            unlistenScanDataChunkRef.current = unlistenScanDataChunk;
        };
        handleEvent();
        eventDiskSelected.on("clearDiv",() => {
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

    </div>
  );
}

export default TreeMap;