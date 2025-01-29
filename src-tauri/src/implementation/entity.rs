/* File that implementation the representation of a file and folder */
use serde::Serialize;

#[derive(Serialize, Clone)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Entity {
    File(FileEntity),
    Folder(FolderEntity),
}

#[derive(Serialize, Clone)]
pub struct FileEntity {
    pub name: String,
    pub size: u64,
    pub path: String,
    pub extension: String,
    pub entity_type: String
}
#[derive(Serialize, Clone)]
pub struct FolderEntity {
    pub name: String,
    pub size: u64,
    pub path: String,
    pub entity_type: String,
    pub children: Vec<Entity>
}


/* Entity for a file & folder in the system */
impl FileEntity {
    pub fn new(name: String, length: u64, extension: String, path: String) -> Self {
        FileEntity{
            name: name,
            path: path,
            entity_type: "file".to_string(),
            size: length,
            extension: extension
        }
    }
}

impl FolderEntity
{
    pub fn new(name: String, path: String, length: u64, children: Vec<Entity> ) -> Self {
        FolderEntity{
            name: name,
            path: path,
            entity_type: "folder".to_string(),
            children: children, 
            size:length
        }
    }
}
