import React, { useState, useEffect } from "react";

import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Sidebar from "./components/SideBar/SideBar";
import MainContent from "./components/MainContent/MainContent";
import ConfirmPopupManager from "./components/ConfirmPopup/ConfirmPopup";

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
      <MainContent></MainContent>
      <ConfirmPopupManager></ConfirmPopupManager>
      </div>
  );
}

export default App;
