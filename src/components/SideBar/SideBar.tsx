import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Sidebar.css";
import { DiskInfo } from "../../interfaces/DiskInfo";
import DetailSideBar from "../DetailSideBar/DetailSideBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHardDrive } from '@fortawesome/free-regular-svg-icons'

import eventDiskSelected from "../../event/eventDiskSelected";

function Sidebar() {

    const [activeIndex, setActiveIndex] = React.useState<number | null>(null); // Track active index

    /* Scan disks */
    const [scannedDisks, setScanDisk] = useState<DiskInfo[]>([]);
    async function scan_disk()
    {
      setScanDisk(await invoke("scan_disk"));
    }

    const [scanItems, setScanItems] = useState("");
    async function scan_all(path: string)
    {
      setScanItems(await invoke("scan_all", {path}));
    }
  
    const handleClick = (index: number) => {
      if (activeIndex === index) {
        return; // Do nothing if the clicked index is already active
      }
      setActiveIndex(index); // Set the clicked element as active
      eventDiskSelected.emit("clearDiv"); // Emit the custom event
    };

      // Our color helper:
  const getUsageColor = (usage: number) => {
        if (usage < 50) {
        return "green";
        } else if (usage < 80) {
        return "orange";
        } else if (usage < 90) {
        return "red";
        } else {
        return "darkred";
        }
    };

    /* Run on load */
    useEffect(() => {
        scan_disk();
    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className="sideBar">
      <div className="sideBarTitle">
        <div>
          <FontAwesomeIcon icon={faHardDrive}></FontAwesomeIcon>
        </div>
        <div style={{paddingLeft: "5px"}} >Disks</div>
      </div>
      <div className="containerAllSideBarItems">
      {scannedDisks.map((disk, index) => (
          <div key={index}  onClick={() => {handleClick(index), scan_all("C:\\")}}  className={`containerSideBarItem ${activeIndex === index ? " selected" : ""}`} style={{flexDirection: "column", backgroundColor: getUsageColor(disk.usage_percentage)}}>
            <div 
            style={{}}>
                <strong>{disk.name}</strong>&nbsp;- {disk.usage_percentage} % 
            </div>
            <DetailSideBar diskInfo={disk} isHidden={activeIndex === index ? false : true}></DetailSideBar>
          </div>
      ))}
      </div>
    </div>
  );
}

export default Sidebar;