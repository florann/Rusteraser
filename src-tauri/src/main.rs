// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod disk;
mod helper;
mod file;
mod folder;
mod traits;
mod mod_enum;

use std::{fs::metadata, thread};
use tauri::Manager;
use walkdir::WalkDir;
use sysinfo::{DiskExt, System, SystemExt};
use tokio::task;
use std::pin::Pin;

use mod_enum::entity_info::{self, EntityInfo};
use disk::disk_info::DiskInfo;
use folder::folder_info::FolderInfo;
use file::file_info::FileInfo;

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

/* TODO : Implement new logic of disk scouting
    -> Begin the search at the root
        for each entity found 
            if 
                it's a file store it 
            else if
                it's a folder scout it

*/
#[tauri::command]
async fn scan_directory_async(path: String, app_handle: tauri::AppHandle) {
    thread::spawn(move || {
        scan_directory(path, app_handle);
    });
}

fn scan_directory(path: String, app_handle: tauri::AppHandle) {
        use std::fs;
        if let Ok(entries) = fs::read_dir(&path) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let entity_metadata = entry.metadata().unwrap();
                    let is_dir = entity_metadata.is_dir();
                    let scanned_entity: entity_info::EntityInfo;
                    if is_dir {
                        scanned_entity = entity_info::EntityInfo::Folder {
                            name: entry.file_name().into_string().unwrap(),
                            path: entry.path().to_string_lossy().to_string(),
                            node_type: "folder".to_string(),
                            parent_path: entry.path().to_string_lossy().to_string(),
                            size: metadata(entry.path()).map(|f_metadata| f_metadata.len()).unwrap_or(0),
                            nb_elements: 0
                        };
                    }
                    else {
                        scanned_entity = entity_info::EntityInfo::File {
                            name: entry.file_name().into_string().unwrap(),
                            path: entry.path().to_string_lossy().to_string(),
                            node_type: "file".to_string(),
                            parent_path: entry.path().to_string_lossy().to_string(),
                            extension: entry.path().extension().map(|extension| extension.to_string_lossy().to_string()).unwrap_or_default(),
                            size: metadata(entry.path()).map(|f_metadata| f_metadata.len()).unwrap_or(0)
                        };
                    }
    
                    app_handle.emit_all("scan-data-chunk", scanned_entity).expect("Failed to emit data chunk");
    
                    if is_dir {
                        scan_directory(entry.path().to_string_lossy().to_string(), app_handle.clone());
                    }
                }
            }
        }
        app_handle.emit_all("scan-complete", path).unwrap(); // Signal the folder scan is complete    
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, scan_disk, scan_directory_async])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
