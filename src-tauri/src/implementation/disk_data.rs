/* File that implement the representation of the whole disk architecture with all element */
use std::fs;
use std::io;
use std::path::Path;

struct DiskData {
    path: String,
    size: u64, 
    children: Vec<DiskData>
} 

pub fn scan_folder_start(path: &Path) -> io::Result<u64> {

    if !path.is_dir() {
        return Ok(0);
    }

    let mut totalSize: u64 = 0;
    println!("start scan");
     // Handle permission errors for `fs::read_dir`
     let read_dir_data = match fs::read_dir(path) {
        Ok(dir) => dir.filter_map(Result::ok),
        Err(e) if e.kind() == io::ErrorKind::PermissionDenied => {
            eprintln!("Permission denied: {}", path.display());
            return Ok(0); // Skip the entire directory if permissions are denied
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

        println!("23");
        if metadata.file_type().is_symlink() {
            continue;
        }

        if metadata.file_type().is_file() {
            println!("29");
            totalSize += metadata.len();
        }
        else if metadata.file_type().is_dir() {
            println!("33");
            if metadata.permissions().readonly() {
                eprintln!(
                    "Skipping read-only directory: {:?}",
                    entry.path()
                );
                continue; // Skip read-only directories
            }
            totalSize += scan_folder_start(&entry.path())?;
            println!("  ahhhhhhh");
        }
    }

    Ok(totalSize)
}