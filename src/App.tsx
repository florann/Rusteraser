import React, { useState, useEffect } from "react";

import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Sidebar from "./components/SideBar/SideBar";

function App() {
  /* Scan directory */ 
  const [scannedDirectory, setScanDirectory] = useState("");
  const [path, setDirectory] = useState("");

  async function scan_directory()
  {
    setScanDirectory(await invoke("scan_directory", {path}));
  }

  return (
    <div className="container" style={{display: "flex", flexDirection : "row"}}>
      <Sidebar></Sidebar>
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
