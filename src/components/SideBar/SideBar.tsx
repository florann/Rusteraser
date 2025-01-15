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

    async function cmd_scan_selected_disk(disk: DiskInfo)
    {
      setScanItems(await invoke("cmd_scan_selected_disk", {disk}));
    }
  
    const handleClick = (index: number) => {
      if (activeIndex === index) {
        return; // Do nothing if the clicked index is already active
      }
      eventDiskSelected.emit("clearDiv"); // Emit the custom event
      setActiveIndex(index); // Set the clicked element as active

      let item = getItem(index);
      if(item){
        cmd_scan_selected_disk(item);
      }
    };

    const getItem = (index: number) => {
      if (index >= 0 && index < scannedDisks.length) {
        return scannedDisks[index];
      }
      // return undefined or handle the error
      return undefined;
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
          <div key={index}  onClick={() => {handleClick(index)}}  className={`containerSideBarItem ${activeIndex === index ? " selected" : ""}`} style={{flexDirection: "column", backgroundColor: getUsageColor(disk.usage_percentage)}}>
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