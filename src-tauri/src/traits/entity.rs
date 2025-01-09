use rayon::iter::plumbing::Folder;
use serde::Serialize;
use std::fs::{metadata, read_dir, DirEntry, Metadata};
use std::path::{Path};

#[derive(Serialize)]
struct FileEntity {
    name: String,
    #[serde(skip)]
    parent_entries: Vec<DirEntry>,
    #[serde(skip)]
    children_entries: Vec<DirEntry>,
    size: u64,
    path: String,
    extension: String,
    #[serde(skip)]
    meta_data: Metadata,
    entity_type: String
}
#[derive(Serialize)]
struct FolderEntity {
    name: String,
    #[serde(skip)]
    parent_entries: Vec<DirEntry>,
    #[serde(skip)]
    children_entries: Vec<DirEntry>,
    size: u64,
    path: String,
    #[serde(skip)]
    meta_data: Metadata,
    entity_type: String
}

pub trait Entity : Serialize {
    fn new(&mut self, _:DirEntry);
    fn get_name(&self) -> &String;
    fn get_parents(&self) -> &Vec<DirEntry>;
    fn get_children(&self) -> &Vec<DirEntry>;
    fn get_size(&self) -> &u64;
    fn get_path(&self) -> &String;
    fn get_meta_data(&self) -> &Metadata;
    fn get_entity_type(&self) -> &String;
}

impl Entity for FileEntity
{
    fn new(&mut self, entry:DirEntry){
        self.meta_data = metadata(entry.path()).unwrap();
        self.name = entry.file_name().into_string().unwrap();
        self.path = entry.path().to_string_lossy().to_string();
        self.entity_type = "file".to_string();
        self.parent_entries = read_dir(entry.path()).unwrap().flatten().collect();
        self.children_entries = Vec::<DirEntry>::new();
        self.size = self.meta_data.len();
    }

    fn get_name(&self) -> &String{
        &self.name
    }

    fn get_parents(&self) -> &Vec<DirEntry>{
        &self.parent_entries
    }

    fn get_children(&self) -> &Vec<DirEntry> {
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

impl Entity for FolderEntity
{
    fn new(&mut self, entry:DirEntry){
        self.meta_data = metadata(entry.path()).unwrap();
        self.name = entry.file_name().into_string().unwrap();
        self.path = entry.path().to_string_lossy().to_string();
        self.entity_type = "folder".to_string();
        
        let entry_path = entry.path();
        let std_path = Path::new(&entry_path);
        self.parent_entries = read_dir(std_path.parent().unwrap()).unwrap().flatten().collect();
        self.children_entries = read_dir(entry.path()).unwrap().flatten().collect();

        self.size = self.meta_data.len();
    }

    fn get_name(&self) -> &String{
        &self.name
    }

    fn get_parents(&self) -> &Vec<DirEntry>{
        &self.parent_entries
    }

    fn get_children(&self) -> &Vec<DirEntry> {
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
