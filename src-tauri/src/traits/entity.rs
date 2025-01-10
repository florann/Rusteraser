use serde::Serialize;
use std::fs::{metadata, read_dir, DirEntry, Metadata};
use std::path::{Path};
use std::ffi::OsStr;

#[derive(Serialize)]
pub struct FileEntity {
    name: String,
    #[serde(skip)]
    parent_entries: Vec<DirEntry>,
    #[serde(skip)]
    children_entries: Vec<Vec<DirEntry>>,
    size: u64,
    path: String,
    extension: String,
    #[serde(skip)]
    meta_data: Metadata,
    entity_type: String
}
#[derive(Serialize)]
pub struct FolderEntity {
    name: String,
    #[serde(skip)]
    parent_entries: Vec<DirEntry>,
    #[serde(skip)]
    current_entries: Vec<DirEntry>,
    #[serde(skip)]
    children_entries: Vec<Vec<DirEntry>>,
    size: u64,
    path: String,
    #[serde(skip)]
    meta_data: Metadata,
    entity_type: String
}

pub trait Entity : Serialize {
    fn new(_:String) -> Self;
    fn get_name(&self) -> &String;
    fn get_parents(&self) -> &Vec<DirEntry>;
    fn get_currents(&self) -> &Vec<DirEntry>;
    fn get_children(&self) -> &Vec<Vec<DirEntry>>;
    fn get_size(&self) -> &u64;
    fn get_path(&self) -> &String;
    fn get_meta_data(&self) -> &Metadata;
    fn get_entity_type(&self) -> &String;
}

// impl Entity for FileEntity
// {
//     fn new(&mut self, entry:DirEntry) -> FileEntity 
//     {
//         self.meta_data = metadata(entry.path()).unwrap();
//         self.name = entry.file_name().into_string().unwrap();
//         self.path = entry.path().to_string_lossy().to_string();
//         self.entity_type = "file".to_string();
//         self.parent_entries = read_dir(entry.path()).unwrap().flatten().collect();
//         self.children_entries = Vec::<DirEntry>::new();
//         self.size = self.meta_data.len();
//         self
//     }

//     fn get_name(&self) -> &String{
//         &self.name
//     }

//     fn get_parents(&self) -> &Vec<DirEntry>{
//         &self.parent_entries
//     }

//     fn get_children(&self) -> &Vec<DirEntry> {
//         &self.children_entries
//     }

//     fn get_size(&self) -> &u64{
//         &self.size
//     }

//     fn get_path(&self) -> &String{
//         &self.path
//     }

//     fn get_meta_data(&self) -> &Metadata{
//         &self.meta_data
//     }

//     fn get_entity_type(&self) -> &String {
//         &self.entity_type
//     }
// }

impl Entity for FolderEntity
{
    fn new(entity_path: String) -> Self {
        let std_path = Path::new(&entity_path);
        let meta_data = metadata(std_path).unwrap();
        let len =  meta_data.len();
        
        let current_entries: Vec<DirEntry> = read_dir(std_path).unwrap().flatten().collect();
        let mut children_entries: Vec<Vec<DirEntry>> = Vec::new();
        for entry in &current_entries {
            println!("{}", entry.file_name().to_string_lossy().to_string());
            let entry_meta_data = metadata(entry.path());
            if entry_meta_data.unwrap().is_dir() {
                if let Ok(entries) = read_dir(entry.path()) {
                    let tmp_folder_entry = entries.flatten().collect();
                    children_entries.push(tmp_folder_entry);
                }
                else {
                    println!("----------------------------------");
                    println!(" Error reading folder : {}", entry.path().to_string_lossy().to_string());
                }
           
            }
        } 
        
        let parent_entries;
        if let Some(parent_path) = std_path.parent()
        {
            parent_entries = read_dir(parent_path).unwrap().flatten().collect();
        }
        else {
            parent_entries = Vec::new();
        }

        FolderEntity{
            meta_data,
            name: std_path.file_name().unwrap_or(OsStr::new("root")).to_string_lossy().to_string(),
            path: entity_path.clone(),
            entity_type: "folder".to_string(),
            parent_entries: parent_entries,
            current_entries: current_entries,
            children_entries: children_entries, /* TODO : Scan the children of the current dir */
            size:len
        }
    }

    fn get_name(&self) -> &String{
        &self.name
    }

    fn get_parents(&self) -> &Vec<DirEntry>{
        &self.parent_entries
    }

    fn get_currents(&self) -> &Vec<DirEntry>{
        &self.current_entries
    }

    fn get_children(&self) -> &Vec<Vec<DirEntry>> {
        &self.children_entries
    }

    fn get_size(&self) -> &u64{
        &self.size
    }

    fn get_path(&self) -> &String{
        &self.path
    }

    fn get_meta_data(&self) -> &Metadata{
        &self.meta_data
    }

    fn get_entity_type(&self) -> &String {
        &self.entity_type
    }
}
