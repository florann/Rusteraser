/* File that implement the representation of the whole disk architecture with all element */
use std::fs;
use std::io;
use std::path::Path;

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

    pub fn path(&self) -> &str {
        &self.path
    }

    pub fn size(&self) -> u64 {
        self.size
    }

    pub fn children(&self) -> &Vec<DiskData> {
        &self.children
    }
}

pub fn scan_folder_start(path: &Path) -> io::Result<DiskData> {
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
            total_size += metadata.len();
        }
        else if metadata.file_type().is_dir() {
             // Recursive call for subdirectory
             match scan_folder_start(&entry.path()) {
                Ok(sub_dir_data) => {
                    total_size += sub_dir_data.size; // Add subdirectory size to total
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