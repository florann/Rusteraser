import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { EntityInfo, isEntityInfo} from "../../type/typeEntityInfo";
import "./Entity.css";

interface EntityProps {
    index: number,
    obj_EntityInfo: object
}

function Entity({index, obj_EntityInfo}: EntityProps) {

    const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null);

    /* Run on load */
    useEffect(() => {
      try {

        if(isEntityInfo(obj_EntityInfo)){
            setEntityInfo(obj_EntityInfo); // Update state with parsed object
        }
      } catch (error) {
        console.error("Failed to parse EntityInfo:", error);
      }
    }, [obj_EntityInfo]); // Re-run if str_EntityInfo changes

    if (!entityInfo) {
      return <div>Loading...</div>;
    }

  return (
    <div key={index} className="dataChunk">
      {entityInfo.type === "File" ? (
        <div className="entity">
          <div>
            <strong>Type:</strong> {entityInfo.type}
          </div>
          <div>
            <strong>Name:</strong> {entityInfo.name}
          </div>
          <div>
            <strong>Extension:</strong> {entityInfo.extension} 
          </div>
          <div>
            <strong>Path:</strong> {entityInfo.path} 
          </div>
          <div>
            <strong>Parent:</strong> {entityInfo.parent} 
          </div>
          <div>
            <strong>Size:</strong> {entityInfo.size} bytes
          </div>
        </div>
      ) : (
        <div className="entity">
          <div>
            <strong>Type:</strong> {entityInfo.type} 
          </div>
          <div>
            <strong>Name:</strong> {entityInfo.name} 
          </div>
          <div>
            <strong>Path:</strong> {entityInfo.path} 
          </div>
          <div>
            <strong>Parent:</strong> {entityInfo.parent} 
          </div>
          <div>
            <strong>Size:</strong> {entityInfo.size} bytes 
          </div>
          <div>
            <strong>Number of Elements:</strong> {entityInfo.nb_elements}
          </div>
        </div>
      )}
  </div>
  );
}

export default Entity;