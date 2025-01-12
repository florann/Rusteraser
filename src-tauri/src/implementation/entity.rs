/* File that implementation the representation of a file and folder */

use serde::Serialize;
use serde::ser::SerializeSeq;
use serde::Serializer;
use std::fs::{metadata, read_dir, DirEntry, Metadata};
use std::path::{Path};
use std::ffi::OsStr;

#[derive(Serialize)]
pub struct FileEntity {
    name: String,
    #[serde(serialize_with = "serialize_dir_entries")]
    parent_entries: Vec<DirEntry>,
    #[serde(serialize_with = "serialize_dir_entries")]
    current_entries: Vec<DirEntry>,
    #[serde(serialize_with = "serialize_vec_of_vec_dir_entries")]
    children_entries: Vec<Vec<DirEntry>>,
    size: u64,
    path: String,
    extension: String,
    entity_type: String
}
#[derive(Serialize)]
pub struct FolderEntity {
    name: String,
    #[serde(serialize_with = "serialize_dir_entries")]
    parent_entries: Vec<DirEntry>,
    #[serde(serialize_with = "serialize_dir_entries")]
    current_entries: Vec<DirEntry>,
    #[serde(serialize_with = "serialize_vec_of_vec_dir_entries")]
    children_entries: Vec<Vec<DirEntry>>,
    size: u64,
    path: String,
    entity_type: String
}

fn serialize_dir_entries<S>(entries: &Vec<DirEntry>, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
    let dir_entries_path: Vec<String> = entries.iter()
    .map(|e| e.path().to_string_lossy().into_owned()).collect();

    dir_entries_path.serialize(serializer)
}

fn serialize_vec_of_vec_dir_entries<S>(
    entries: &Vec<Vec<DirEntry>>, 
    serializer: S
) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    // We'll create a sequence of sequences of strings
    let mut outer_seq = serializer.serialize_seq(Some(entries.len()))?;
    for inner_vec in entries {
        let as_paths: Vec<String> = inner_vec
            .iter()
            .map(|e| e.path().to_string_lossy().into_owned())
            .collect();
        outer_seq.serialize_element(&as_paths)?;
    }
    outer_seq.end()
}

pub trait Entity : Serialize {
    fn new(_:String) -> Self;
    fn get_name(&self) -> &String;
    fn get_parents(&self) -> &Vec<DirEntry>;
    fn get_currents(&self) -> &Vec<DirEntry>;
    fn get_children(&self) -> &Vec<Vec<DirEntry>>;
    fn get_size(&self) -> &u64;
    fn get_path(&self) -> &String;
    fn get_entity_type(&self) -> &String;
}

impl Entity for FileEntity
{
    fn new(entity_path: String) -> Self {
        let std_path = Path::new(&entity_path);
        let meta_data = metadata(std_path).unwrap();
        if meta_data.is_file() 
        {
            let len =  meta_data.len();

            let current_entries: Vec<DirEntry> = Vec::new();
            let children_entries: Vec<Vec<DirEntry>> = Vec::new();

            let parent_entries;
            if let Some(parent_path) = std_path.parent()
            {
                parent_entries = read_dir(parent_path).unwrap().flatten().collect();
            }
            else {
                parent_entries = Vec::new();
            }

            FileEntity{
                name: std_path.file_name().unwrap_or(OsStr::new("root")).to_string_lossy().to_string(),
                path: entity_path.clone(),
                entity_type: "file".to_string(),
                parent_entries: parent_entries,
                current_entries: current_entries,
                children_entries: children_entries,
                size:len,
                extension: std_path.extension().unwrap().to_string_lossy().to_string()
            }
        }
        else {
            FileEntity {
                name: String::new(),
                parent_entries: Vec::new(),
                children_entries: Vec::new(),
                current_entries: Vec::new(),
                size: 0,
                path: String::new(),
                extension: String::new(),
                entity_type: String::new(),
            }
        }
    }

    fn get_name(&self) -> &String{
        &self.name
    }

    fn get_parents(&self) -> &Vec<DirEntry>{
        &self.parent_entries
    }

    fn get_children(&self) -> &Vec<Vec<DirEntry>> {
        &self.children_entries
    }

    fn get_currents(&self) -> &Vec<DirEntry>{
        &self.current_entries
    }

    fn get_size(&self) -> &u64{
        &self.size
    }

    fn get_path(&self) -> &String{
        &self.path
    }

    fn get_entity_type(&self) -> &String {
        &self.entity_type
    }

}

impl Entity for FolderEntity
{
    fn new(entity_path: String) -> Self {
        let std_path = Path::new(&entity_path);
        let meta_data = metadata(std_path).unwrap();
        if meta_data.is_dir() {
            let len =  meta_data.len();
            let current_entries: Vec<DirEntry> = read_dir(std_path).unwrap().flatten().collect();
            let mut children_entries: Vec<Vec<DirEntry>> = Vec::new();
            for entry in &current_entries {
                //println!("{}", entry.file_name().to_string_lossy().to_string());
                let entry_meta_data = metadata(entry.path());
                if entry_meta_data.unwrap().is_dir() {
                    if let Ok(entries) = read_dir(entry.path()) {
                        let tmp_folder_entry = entries.flatten().collect();
                        children_entries.push(tmp_folder_entry);
                    }
                    else {
                       // println!("----------------------------------");
                       // println!(" Error reading folder : {}", entry.path().to_string_lossy().to_string());
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
                name: std_path.file_name().unwrap_or(OsStr::new("root")).to_string_lossy().to_string(),
                path: entity_path.clone(),
                entity_type: "folder".to_string(),
                parent_entries: parent_entries,
                current_entries: current_entries,
                children_entries: children_entries, /* TODO : Scan the children of the current dir */
                size:len
            }
        }
        else {
            FolderEntity {
                name: String::new(),
                parent_entries: Vec::new(),
                current_entries: Vec::new(),
                children_entries: Vec::new(),
                size: 0,
                path: String::new(),
                entity_type: String::new(),
            }
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

    fn get_entity_type(&self) -> &String {
        &self.entity_type
    }
}
