// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod disk;
mod helper;
mod implementation;

use std::{fs, thread, path};
use tauri::{api::dir::read_dir, Manager};
use sysinfo::{DiskExt, System, SystemExt};

use std::fs::{metadata}; 

use implementation::entity::{Entity, FileEntity, FolderEntity};

use disk::disk_info::DiskInfo;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn scan_disk() -> Vec<DiskInfo> {
    let mut vector: Vec<DiskInfo> = Vec::new();

    // Initialize the system object
    let mut system = System::new_all();
    system.refresh_disks_list();

    for disk in system.disks()
    {
        let disk_info = DiskInfo::new(
            disk.name().to_string_lossy().to_string(),
            disk.total_space(), 
            disk.available_space()
        );

        // Format the output
        vector.push(disk_info);
    }

    vector
}

#[tauri::command]
fn start_disk_scan(path: String, app_handle: tauri::AppHandle){
    std::thread::spawn(move || {
        
    });
}

/* Function to scan the whole, will be thread on another thread to not block the application while the process 
is on go  */
/* The goal will be to scan the whole disk and to send back information to the front with some abstraction toward the 
number of element because the front end is not able to create one DOM element for each element on a disk */
/* 
    -> Create a vector to store data
    -> Set the maximum elements inside the vector of 1000
    -> scan recursivly the whole disk
        ->  Each time a file is found, store it. 
            -> Or the vector by file size. 

        
*/
fn disk_scan(disk_name: String, app_handle: tauri::AppHandle)
{
    
}

#[tauri::command]
fn dummy_emit(app_handler: tauri::AppHandle){
    let folder: FolderEntity = FolderEntity::new("C://".to_string());
    let file: FileEntity = FileEntity::new("C://Users//flora//Documents//Azer.txt".to_string());

    app_handler.emit_all("dummy-scan", &folder).unwrap();
    app_handler.emit_all("dummy-scan", &file).unwrap();
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, scan_disk, start_disk_scan, dummy_emit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
