import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { EntityInfo } from "../../type/typeEntityInfo";
//import "./example.css";

interface EntityProps {
    index: number,
    str_EntityInfo: string
}

function Entity({index, str_EntityInfo}: EntityProps) {

    const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null);

    /* Run on load */
    useEffect(() => {
      try {
        const parsedEntity = JSON.parse(str_EntityInfo) as EntityInfo;
        setEntityInfo(parsedEntity); // Update state with parsed object
      } catch (error) {
        console.error("Failed to parse EntityInfo:", error);
      }
    }, [str_EntityInfo]); // Re-run if str_EntityInfo changes

    if (!entityInfo) {
      return <div>Loading...</div>;
    }

  return (
    <div key={index} className="dataChunk">
      {entityInfo.type === "File" ? (
        <div>
          <strong>Type:</strong> {entityInfo.type} <br />
          <strong>Name:</strong> {entityInfo.name} <br />
          <strong>Extension:</strong> {entityInfo.extension} <br />
          <strong>Path:</strong> {entityInfo.path} <br />
          <strong>Parent:</strong> {entityInfo.parent} <br />
          <strong>Size:</strong> {entityInfo.size} bytes
        </div>
      ) : (
        <div>
          <strong>Type:</strong> {entityInfo.type} <br />
          <strong>Name:</strong> {entityInfo.name} <br />
          <strong>Path:</strong> {entityInfo.path} <br />
          <strong>Parent:</strong> {entityInfo.parent} <br />
          <strong>Size:</strong> {entityInfo.size} bytes <br />
          <strong>Number of Elements:</strong> {entityInfo.nb_elements}
        </div>
      )}
  </div>
  );
}

export default Entity;