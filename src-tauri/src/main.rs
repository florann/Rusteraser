// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod disk;
mod helper;
mod implementation;

use std::path::Path;
use std::{fs, thread, path};
use tauri::{api::dir::read_dir, Manager};
use sysinfo::{DiskExt, System, SystemExt};

use std::fs::{metadata}; 
use std::time::Instant;

use implementation::entity::{Entity, FileEntity, FolderEntity};
use implementation::disk_data::{scan_folder_start, DiskData};

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

/* TODO : Setup this command to take disk root as parameter */
/* Frontend side setup the treemap */
#[tauri::command]
fn dummy_emit(app_handler: tauri::AppHandle){
    std::thread::spawn(move || {
        let stopwatch = Instant::now(); // Start the stopwatch
        let path = Path::new("D://");
        let handled_result = match(scan_folder_start(path, &app_handler))
        {
            Ok(result) => {
                result
            }
            Err(err) =>  {
                println!("error : {}", err);
                DiskData::new("".to_string(), 0, Vec::new())
            }
        };

        app_handler.emit_all("dummy-scan", &handled_result).unwrap();
        app_handler.emit_all("dummy-scan", stopwatch.elapsed().as_secs()).unwrap();
    });
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, scan_disk, dummy_emit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
