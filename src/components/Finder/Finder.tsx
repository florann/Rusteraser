import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { EntityInfo, isEntityInfo } from "../../type/typeEntityInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

import "./Finder.css";

function Finder() {

    const [entityInfo, setEntityInfo] = useState<EntityInfo[]>([]);
    const unlistenScanHeavyFileRef = useRef<(() => void) | null>(null);
    /* Run on load */
    useEffect(() => {
      const handleEvent = async() => {
          /* Event */
          const unlistenScanHeavyFile = await listen('cmd_scan_heavy_file_done', async (event) => {
              try {
                if (Array.isArray(event.payload)) {
                  // Convert to an array of EntityInfo
                    const parsedData: EntityInfo[] = event.payload.map((item) => ({
                      name: item.name,
                      size: item.size,
                      path: item.path,
                      extension: item.extension,
                      entity_type: item.entity_type,
                      type: "File"
                    }));
                    setEntityInfo(parsedData);
                }
              } catch (error) {
              console.error("Failed to parse payload:", error);
              }
            });
            unlistenScanHeavyFileRef.current = unlistenScanHeavyFile;
        };
        handleEvent();
        // Cleanup listeners on unmount
        return () => {
          if (unlistenScanHeavyFileRef.current){
            unlistenScanHeavyFileRef.current();
        }
      };
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="finder">
      {entityInfo.map((file, index) => (
          <div className="file">
            <FontAwesomeIcon icon={faFileLines}></FontAwesomeIcon>
            <div>
              {file.name}
            </div>
          </div>
      ))}
    </div>
  );
}

export default Finder;