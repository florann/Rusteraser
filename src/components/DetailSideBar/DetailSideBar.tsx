import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../../styles.css";
import "./DetailSideBar.css";
import { DiskInfo } from "../../interfaces/DiskInfo";

interface DetailSideBarProps {
    diskInfo: DiskInfo,
    isHidden: boolean
}

function DetailSideBar({ diskInfo, isHidden }: DetailSideBarProps) {
    /* Run on load */
    useEffect(() => {

    }, []); // The empty dependency array ensures this runs only once (on mount)

  return (
    <div className={`detailSideBar ${isHidden ? " hidden" : ""}`}>
        <div> {'>'} Name : {diskInfo.name}</div>
        <div> {'>'} Available space : {diskInfo.available_space}</div>
        <div> {'>'} Total space : {diskInfo.total_space}</div>
        <div> {'>'} Usage percentage : {diskInfo.usage_percentage}</div>
        <div> {'>'} Available percentage : {diskInfo.available_percentage}</div>
    </div>
  );
}

export default DetailSideBar;