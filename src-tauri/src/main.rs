// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod disk;
mod helper;
mod implementation;

use std::path::Path;
use tauri::{api::dir::read_dir, Manager};
use sysinfo::{DiskExt, System, SystemExt};
use std::time::Instant;

use implementation::entity::{Entity, FileEntity, FolderEntity};
use implementation::tb_item::{TbItem, TbItemContent};
use disk::disk_info::DiskInfo;
use implementation::disk_data::DiskData;
use helper::scan::{rmdir, del, scan_folder_start_disk_data, scan_start_entity};
use helper::helper::{format_entities_to_items, sort_entities, get_list_heavy_files};

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
            disk.available_space(),
        );

        // Format the output
        vector.push(disk_info);
    }

    vector
}

#[tauri::command]
fn cmd_scan_selected_disk_entity(disk: DiskInfo, app_handler: tauri::AppHandle){
    println!("------------DEBUT--------------");
    std::thread::spawn(move || {
        let mut disk_name: String = "".to_string();
        if disk.name == "OS" {
            disk_name = "C:\\".to_string();
        }
        else {
            disk_name = disk.name + ":\\";
        }
        println!("disk total space {}", disk.used_space);
        println!("disk name {}", disk_name);
        let stopwatch = Instant::now(); // Start the stopwatch
        let path = Path::new(&disk_name);
        /* Scan given the disk */
        let mut handled_result = match scan_start_entity(path, &app_handler, *Some(&disk.used_space).unwrap())
        {
            Ok(result) => {
                result
            }
            Err(err) =>  {
                println!("error : {}", err);
                FolderEntity::new("".to_string(), "".to_string(), 0, Vec::new())
            }
        };
        /* Format data into different output ( maybe process into different thread if there is more than one output) */
        sort_entities(&mut handled_result);
        let tabletree_item = format_entities_to_items(&handled_result);
        let vec_heavy_file = get_list_heavy_files(&handled_result, 10);
        println!("size heavy file : {}", vec_heavy_file.len());
        println!("-------------END-------------");

        app_handler.emit_all("cmd_scan_selected_disk_entity_done", &tabletree_item).unwrap();
        app_handler.emit_all("cmd_scan_selected_disk_entity_done", stopwatch.elapsed().as_secs()).unwrap();
        app_handler.emit_all("cmd_scan_heavy_file_done", &vec_heavy_file).unwrap();
    });
}

#[tauri::command]
fn cmd_scan_selected_disk_disk_data(disk: DiskInfo, app_handler: tauri::AppHandle) {
    println!("--------------------------");
    std::thread::spawn(move || {
        let mut disk_name: String = "".to_string();
        if disk.name == "OS" {
            disk_name = "C:\\".to_string();
        }
        else {
            disk_name = disk.name + ":\\";
        }
        println!("disk total space {}", disk.used_space);
        println!("disk name {}", disk_name);
        let stopwatch = Instant::now(); // Start the stopwatch
        let path = Path::new(&disk_name);
        let handled_result = match scan_folder_start_disk_data(path, &app_handler, Some(&disk.used_space))
        {
            Ok(result) => {
                result
            }
            Err(err) =>  {
                println!("error : {}", err);
                DiskData::new("".to_string(), 0, Vec::new())
            }
        };

        app_handler.emit_all("cmd_scan_selected_disk_disk_data_done", &handled_result).unwrap();
        app_handler.emit_all("cmd_scan_selected_disk_disk_data_done", stopwatch.elapsed().as_secs()).unwrap();
    });
}

#[tauri::command]
fn cmd_rmdir(str: String, app_handler: tauri::AppHandle){
    let result = rmdir(str);
    app_handler.emit_all("event-rmdir", result).unwrap();
}

#[tauri::command]
fn cmd_del(str: String, app_handler: tauri::AppHandle){
    let result = del(str);
    app_handler.emit_all("event-del", result).unwrap();
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, scan_disk, cmd_scan_selected_disk_disk_data, cmd_scan_selected_disk_entity, cmd_rmdir, cmd_del])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
