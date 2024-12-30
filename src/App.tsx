import React, { useState, useEffect } from "react";

import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

interface DiskInfo {
  name: string;
  total_space: number;
  available_space: number;
}


function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  /* Scan directory */ 
  const [scannedDirectory, setScanDirectory] = useState("");
  const [path, setDirectory] = useState("");

  async function scan_directory()
  {
    setScanDirectory(await invoke("scan_directory", {path}));
  }

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

  /* Run on load */
  useEffect(() => {
    scan_disk();
  }, []); // The empty dependency array ensures this runs only once (on mount)


  return (
    <div className="container" style={{display: "flex", flexDirection : "row"}}>
      <div className="sideBar">
          <div>Disks</div>
          {scannedDisks.map((disk, index) => (
            <div className={`sideBarItem ${activeIndex === index ? " selected" : ""}`}
            key={index}  onClick={() => handleClick(index)}>
              <strong>{disk.name}</strong>: {'['}
              {(disk.total_space / (1024 * 1024 * 1024)).toFixed(2)} GB /&nbsp;
              {(disk.available_space / (1024 * 1024 * 1024)).toFixed(2)} GB{']'}
            </div>
          ))}
      </div>
      <div className="mainContent">
          <h1>Welcome to Tauri!</h1>
          <div className="row">
            <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" className="logo vite" alt="Vite logo" />
            </a>
            <a href="https://tauri.app" target="_blank">
              <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
            </a>
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <p>Click on the Tauri, Vite, and React logos to learn more.</p>
          <form
            className="row"
            onSubmit={(e) => {
              e.preventDefault();
              scan_directory();
            }}
          >
            <input
              id="greet-input"
              onChange={(e) => setDirectory(e.currentTarget.value)}
              placeholder="Enter a name..."
            />
            <button type="submit">Scan</button>
          </form>
          <p>{scannedDirectory}</p>
        </div>
      </div>
  );
}

export default App;
