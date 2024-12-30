// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod disk;

use walkdir::WalkDir;
use sysinfo::{DiskExt, System, SystemExt};
use disk::info::DiskInfo;

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
fn scan_directory(path: &str) -> Vec<String> {
    print!("{}",path);
    let mut vector: Vec<String> = Vec::new();
    for entity in WalkDir::new(path).max_depth(0) {
        match entity {
            Ok(success) => {
                if let Some(name) = success.file_name().to_str() {
                    print!("{}", name.to_string());
                    vector.push(name.to_string()); // Convert &str to String
                }
            },
            Err(_err) => {
                //nothing
            }
        }
    }
    vector
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, scan_directory, scan_disk])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
