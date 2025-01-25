/* File that implementation the representation of a file and folder */

use serde::Serialize;

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Entity {
    File(FileEntity),
    Folder(FolderEntity),
}

#[derive(Serialize)]
pub struct FileEntity {
    name: String,
    size: u64,
    path: String,
    extension: String,
    entity_type: String
}
#[derive(Serialize)]
pub struct FolderEntity {
    name: String,
    children: Vec<Entity>,
    size: u64,
    path: String,
    entity_type: String
}


/* Entity for a file in the system */
impl FileEntity {
    fn new(name: String, length: u64, extension: String, path: String) -> Self {
        let len =  length;

        // FileEntity{
        //     name: std_path.file_name().unwrap_or(OsStr::new("root")).to_string_lossy().to_string(),
        //     path: entity_path.clone(),
        //     entity_type: "file".to_string(),
        //     size:len,
        //     extension: std_path.extension().unwrap().to_string_lossy().to_string()
        // }
        
        FileEntity{
            name: name,
            path: path,
            entity_type: "file".to_string(),
            size:len,
            extension: extension
        }
    }
}



impl FolderEntity
{
    fn new(name: String, path: String, length: u64, children: Vec<Entity> ) -> Self {
        FolderEntity{
            name: name,
            path: path,
            entity_type: "folder".to_string(),
            children: children, 
            size:length
        }
        // let std_path = Path::new(&entity_path);
        // let meta_data = metadata(std_path).unwrap();
        // if meta_data.is_dir() {
        //     let len =  meta_data.len();
        //     let current_entries: Vec<DirEntry> = read_dir(std_path).unwrap().flatten().collect();
        //     let mut children_entries: Vec<Vec<DirEntry>> = Vec::new();
        //     for entry in &current_entries {
        //         //println!("{}", entry.file_name().to_string_lossy().to_string());
        //         let entry_meta_data = metadata(entry.path());
        //         if entry_meta_data.unwrap().is_dir() {
        //             if let Ok(entries) = read_dir(entry.path()) {
        //                 let tmp_folder_entry = entries.flatten().collect();
        //                 children_entries.push(tmp_folder_entry);
        //             }
        //             else {
        //                // println!("----------------------------------");
        //                // println!(" Error reading folder : {}", entry.path().to_string_lossy().to_string());
        //             }
                
        //         }
        //     } 
                    
        //     let parent_entries;
        //     if let Some(parent_path) = std_path.parent()
        //     {
        //         parent_entries = read_dir(parent_path).unwrap().flatten().collect();
        //     }
        //     else {
        //         parent_entries = Vec::new();
        //     }

    }
}
