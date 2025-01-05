import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { EntityInfo, isEntityInfo} from "../../type/typeEntityInfo";
import "./Entity.css";

interface EntityProps {
    index: number,
    p_EntityInfo: EntityInfo
}

function Entity({index, p_EntityInfo}: EntityProps) {

    const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null);

    /* Run on load */
    useEffect(() => {
      setEntityInfo(p_EntityInfo);
    }, []); // Re-run if str_EntityInfo changes

    if (!entityInfo) {
      return <div></div>;
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