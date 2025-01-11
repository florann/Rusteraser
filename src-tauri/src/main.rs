// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod disk;
mod helper;
mod traits;
mod entity;

use std::{fs, thread, path};
use tauri::{api::dir::read_dir, Manager};
use sysinfo::{DiskExt, System, SystemExt};

use std::fs::{metadata};

use entity::entity_info::{self, EntityInfo};
use traits::entity::{Entity, FileEntity, FolderEntity};

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

/* TODO : Implement multithread scannig to improve speed */
#[tauri::command]
fn start_scan(path: String, app_handle: tauri::AppHandle){
    std::thread::spawn(move || {
        scan_directory_iterative_dfs(&path, app_handle);
    });
}

fn scan_directory_iterative_dfs(path: &str, app_handle: tauri::AppHandle) {
    let mut stack = vec![path::PathBuf::from(path)];
    let mut cpt = 0;
    while let Some(current_path) = stack.pop() {
        cpt = cpt + 1;
        if cpt > 150 {
            break;
        }
        if let Ok(entries) = std::fs::read_dir(&current_path) {
            for entry_result in entries {
                if let Ok(entry) = entry_result {
                    let entry_path = entry.path();
                    let entity_metadata = entry.metadata().unwrap();
                    let scanned_entity:EntityInfo;
                    if entity_metadata.is_dir() {
                        scanned_entity = entity_info::EntityInfo::Folder {
                            name: entry.file_name().into_string().unwrap(),
                            path: entry.path().to_string_lossy().to_string(),
                            node_type: "folder".to_string(),
                            parent_path: entry.path().to_string_lossy().to_string(),
                            size: metadata(entry.path()).map(|f_metadata| f_metadata.len()).unwrap_or(0),
                            nb_elements: 0
                        };

                        println!("Dir: {}", entry_path.display());
                        stack.push(entry_path);
                        app_handle.emit_all("scan-data-chunk", scanned_entity).expect("Failed to emit data chunk");
                    } else {
                        // scanned_entity = entity_info::EntityInfo::File {
                        //     name: entry.file_name().into_string().unwrap(),
                        //     path: entry.path().to_string_lossy().to_string(),
                        //     node_type: "file".to_string(),
                        //     parent_path: entry.path().to_string_lossy().to_string(),
                        //     extension: entry.path().extension().map(|extension| extension.to_string_lossy().to_string()).unwrap_or_default(),
                        //     size:  metadata(entry.path()).map(|f_metadata| f_metadata.len()).unwrap_or(0)
                        // };
                        
                        //println!("File: {}", entry_path.display());
                    }

                  
                }
            }
        }
    }
    app_handle.emit_all("scan-complete", true).unwrap(); // Signal the folder scan is complete    
}

#[tauri::command]
async fn scan_directory_async(path: String, app_handle: tauri::AppHandle) {
    thread::spawn(move || {
        scan_directory(path, app_handle);
    });
}

fn _scan_directory(path: String, app_handle: tauri::AppHandle) {
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

/* 
    TODO : 
        -> Create a function to scan a folder - NOT MORE, then send back the content of the folder 
        -> Create a function to scan the whole disk to 
*/
fn scan_directory(path: String, app_handle: tauri::AppHandle){
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
                        size: fs::metadata(entry.path()).map(|f_metadata| f_metadata.len()).unwrap_or(0),
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
                        size: fs::metadata(entry.path()).map(|f_metadata| f_metadata.len()).unwrap_or(0)
                    };
                }

                app_handle.emit_all("entity-scanned", scanned_entity).expect("Failed to emit data");
            }
        }
    }
    app_handle.emit_all("dir-scanned", path).unwrap(); // Signal the folder scan is complete    
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
        .invoke_handler(tauri::generate_handler![greet, scan_disk, scan_directory_async, start_scan, dummy_emit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
