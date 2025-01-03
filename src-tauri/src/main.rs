// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod disk;
mod helper;
mod file;
mod folder;
mod traits;

use std::{fs::{metadata, Metadata}};
use folder::folderInfo::FolderInfo;
use tauri::Manager;
use traits::Info::Info;
use walkdir::WalkDir;
use sysinfo::{DiskExt, System, SystemExt};
use disk::diskInfo::DiskInfo;
use file::fileInfo::FileInfo;
//use folder::folderInfo::FolderInfo;

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
fn scan_all(path: &str, app_handle: tauri::AppHandle) {
    print!("{}",path);
    if !std::path::Path::new(path).exists() {
        format!("Path does not exist: {}", path);
    }

    for entity in WalkDir::new(path).max_depth(1) {
        match entity {
            Ok(success) => {
                let entity_info: Box<dyn Info>;
                // If file
                if success.file_type().is_file() {

                    let mut file = FileInfo::default();
                    if let Some(extension) = success.path().extension() {
                        file.extension = extension.to_string_lossy().to_string();
                    }
                    if let Some(name) = success.file_name().to_str() {
                        file.name = name.to_string();
                    }
                    file.size = metadata(success.path()).map(|metadata| metadata.len()).unwrap_or(0);
                    file.path = success.path().to_string_lossy().to_string();

                    entity_info = Box::new(file);
                }
                // if dir
                else if success.file_type().is_dir() {
                    let mut folder = FolderInfo::default();

                    folder.name = success.file_name().to_str().map(|name| name.to_string()).unwrap_or_default();
                    folder.path = success.path().to_string_lossy().to_string();
                    folder.size = metadata(success.path()).map(|metadata| metadata.len()).unwrap_or(0);

                    //vector.push(Box::new(folder));

                    entity_info = Box::new(folder);
                } 

                app_handle.emit_all("data-chunk", entity_info).expect("Failed to emit data chunk");
            },
            Err(_err) => {
                //nothing
            }
        }
    }

}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, scan_all, scan_disk])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
