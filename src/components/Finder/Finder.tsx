import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { EntityInfo, isEntityInfo } from "../../type/typeEntityInfo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { spawnConfirmPopup } from "../ConfirmPopup/ConfirmPopup";

import "./Finder.css";

function Finder() {

    const [entityInfo, setEntityInfo] = useState<EntityInfo[]>([]);
    const unlistenScanHeavyFileRef = useRef<(() => void) | null>(null);
    
    const [delInfo, setDelInfo] = useState<boolean>();

    /* Delete function will call rust on click */
    async function del_action(path: string)
    {
      setDelInfo(await invoke("cmd_del",{path}));
    }

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

    useEffect(() => {
      if(delInfo){
        console.log("del success")
      }else{
        console.log("del failure")
      }
    }, [delInfo])

  return (
    <div className="finder">
      {entityInfo.map((file, index) => (
          <div className="file" key={index}>
            <div className="fileLogo">
              <FontAwesomeIcon icon={faFileLines}></FontAwesomeIcon>
            </div>
            <div className="fileContent">
              <div className="filePath" style={{display: 'none'}}>{file.path}</div>
              <div>
                {file.name}
              </div>
              <div>
                Size :&nbsp;
                {file.size} &nbsp;Mo
              </div>
            </div>
            <div className="fileAction mouseClick" data-path={file.path} onClick={(e) => 
              {
                const dataPath = e.currentTarget.dataset.path;
                spawnConfirmPopup("Delete this element ?", 
                  () => {
                    del_action(dataPath as string)
                  },
                  e)
              }
            }>
              <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
            </div>
          </div>
      ))}
    </div>
  );
}

export default Finder;