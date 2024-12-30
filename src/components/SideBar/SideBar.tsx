import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./Sidebar.css";
import { DiskInfo } from "../../interfaces/DiskInfo";
import DetailSideBar from "../DetailSideBar/DetailSideBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHardDrive } from '@fortawesome/free-regular-svg-icons'



function Sidebar() {

    const [activeIndex, setActiveIndex] = React.useState<number | null>(null); // Track active index

    /* Scan disks */
    const [scannedDisks, setScanDisk] = useState<DiskInfo[]>([]);
    async function scan_disk()
    {
        setScanDisk(await invoke("scan_disk"));
        scannedDisks
    }
  
    const handleClick = (index: number) => {
        setActiveIndex(activeIndex == index ? null : index); // Set the clicked element as active
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
    {scannedDisks.map((disk, index) => (
        <div style={{flexDirection: "column"}}>
          <div className={`sideBarItem ${activeIndex === index ? " selected" : ""}`}
          key={index}  onClick={() => handleClick(index)} 
          style={{
                  // Single, uniform color from our helper:
                  backgroundColor: getUsageColor(disk.usage_percentage),
                  // Optionally, transition background changes:
                  transition: "background-color 0.5s ease-in-out",
            }}>
              <strong>{disk.name}</strong>&nbsp;- {disk.usage_percentage} % 
              {/* {'['}
              {(disk.total_space / (1024 * 1024 * 1024)).toFixed(2)} GB /&nbsp;
              {(disk.available_space / (1024 * 1024 * 1024)).toFixed(2)} GB
              {']'} */}
          </div>
          <DetailSideBar diskInfo={disk} isHidden={activeIndex === index ? false : true}></DetailSideBar>
        </div>
    ))}
    </div>
  );
}

export default Sidebar;