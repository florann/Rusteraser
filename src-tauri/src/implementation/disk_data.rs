/* File that implement the representation of the whole disk architecture with all element */
use std::fs::{self, metadata};
use std::io;
use std::path::Path;
use std::process::exit;
use std::sync::atomic::{AtomicU64, AtomicU8};
use lazy_static::lazy_static;

use std::sync::atomic::{Ordering};
use tauri::Manager;

use crate::helper::helper;

lazy_static! {
    static ref SCAN_PROGRESS: AtomicU64 = AtomicU64::new(0);
    static ref PERCENTAGE_SCAN_PROGRESS: AtomicU64 = AtomicU64::new(0);
}

pub fn send_scanning_progress(app_handler: &tauri::AppHandle, total: &u64)
{   
    if total > &0
    {
        let bytes_scanned = SCAN_PROGRESS.load(Ordering::SeqCst);
        let percentage_scan_progress = PERCENTAGE_SCAN_PROGRESS.load(Ordering::SeqCst);
        let ftotal = total.clone(); 
        let percentage_scanned = helper::round_to_decimals((bytes_scanned as f64 / ftotal as f64) * 100.0, 0) as u64;
        
        if percentage_scanned > percentage_scan_progress as u64 {
            PERCENTAGE_SCAN_PROGRESS.store(percentage_scanned, Ordering::SeqCst);
            app_handler.emit_all("dummy-scan", percentage_scanned).unwrap();
        }
    }
}

#[derive(serde::Serialize)]
pub struct DiskData {
    path: String,
    size: u64, 
    children: Vec<DiskData>
} 

impl DiskData {
    pub fn new(path: String, size: u64, children: Vec<DiskData>) -> Self {
        Self { path, size, children }
    }
}

pub fn scan_folder_start(path: &Path, app_handler: &tauri::AppHandle, total_disk_size: Option<&u64>) -> io::Result<DiskData> {

    let total_disk_size = total_disk_size.unwrap_or(&0);

    if !path.is_dir() {
        return Ok(DiskData {
            path: path.to_path_buf().to_string_lossy().to_string(),
            size: 0,
            children: Vec::new(),
        });
    }

    let mut total_size: u64 = 0;
    let mut children: Vec<DiskData> = Vec::new();

     // Handle permission errors for `fs::read_dir`
     let read_dir_data = match fs::read_dir(path) {
        Ok(dir) => dir.filter_map(Result::ok),
        Err(e) if e.kind() == io::ErrorKind::PermissionDenied => {
            eprintln!("Permission denied: {}", path.display());
            return Ok(DiskData {
                path: path.to_path_buf().to_string_lossy().to_string(),
                size: 0,
                children: Vec::new(),
            });
        }
        Err(e) => return Err(e), // Propagate other errors
    };

    for entry in  read_dir_data{
        let metadata = match fs::symlink_metadata(entry.path()) {
            Ok(metadata) => {
               metadata
            }
            Err(err) => {
                println!("error : {}", err);
                continue;
            }
        };

        if metadata.file_type().is_symlink() {
            continue;
        }

        if metadata.file_type().is_file() {
            let len = metadata.len();

            // Update the global progress
            SCAN_PROGRESS.fetch_add(len, Ordering::SeqCst);
            send_scanning_progress(&app_handler, &total_disk_size);

            total_size += len;
        }
        else if metadata.file_type().is_dir() {
             // Recursive call for subdirectory
             match scan_folder_start(&entry.path(), app_handler, Some(total_disk_size)) {
                Ok(sub_dir_data) => {
                    total_size += sub_dir_data.size; // Add subdirectory size to total
                    send_scanning_progress(&app_handler, &total_disk_size);

                    children.push(sub_dir_data); // Store subdirectory information
                } 
                Err(err) => eprintln!("Error scanning folder {:?}: {}", entry.path(), err),
            }
        }
    }

    Ok(DiskData {
        path: path.to_path_buf().to_string_lossy().to_string(),
        size: total_size,
        children,
    })
}

/* rmdir */
pub fn rmdir(path: String) -> bool {
    return false;
    match fs::remove_dir_all(path) {
        Ok(_) => {
            println!("Directory {} successfully remove.", path);
            true
        },
        Err(err) => {
            eprintln!("err - rmdir : {} ", err);
            false
        }        
    }
}

/* del */
pub fn del(path: String) -> bool {
    return false;
    match fs::remove_file(&path) {
        Ok(_) => {
            println!("File '{}' successfully deleted.", path);
            true
        }
        Err(err) => {
            eprintln!("Error deleting file '{}': {}", path, err);
            false
        }
    }
}