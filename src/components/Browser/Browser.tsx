import React, { useState, useEffect, useRef  } from "react";
import { Tree } from 'react-arborist'

import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import { EntityInfo, isEntityInfo} from "../../type/typeEntityInfo";
import eventDiskSelected from "../../event/eventDiskSelected";
import "./Browser.css";

function Browser() {
  // State to store received data chunks
  const [dataChunks, setDataChunks] = useState<EntityInfo[]>([]);

  const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);

    let dummyEntityInfo = [];
    for( let cpt = 0; cpt <= 20; cpt++)
    {
        dummyEntityInfo.push({
            id: "" + cpt + "",
            type: "File",          
            name: "name",
            size: 0,
            path: "path",
            extension: "extension",      
            entity_type: "file",
            children : [{
                id : 99 + cpt, name : "zaer"
            }]
          }
          );
    }

  /* Run on load */
  useEffect(() => {
        //setDataChunks(dummyEntityInfo);
        const handleEvent = async() => {
        /* Event */
        const unlistenScanDataChunk = await listen('cmd_scan_selected_disk_entity_done', async (event) => {
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
    <div id="FileContent" className="FileContent" >
        <Tree
        // Pass the data array here:
        data={dummyEntityInfo}

        // The container must have a fixed height (and ideally width)
        // so react-arborist can virtualize the tree.
        height={400}
        width={300}

        // Optional: default row height in pixels (if all rows are the same height).
        // If your rows vary, see "rowHeight" in the docs for a more advanced usage.
        rowHeight={24}

        // The child render function receives a "node" object with
        // node.data (your item), node.isOpen, node.isSelected, etc.
      >
        {({ node }) => (
            <div style={{ paddingLeft: node.level * 20 }}>
                {node.data.name}
            </div>
        )}
      </Tree>


    </div>
  );
}

export default Browser;