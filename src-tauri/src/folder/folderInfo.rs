use serde::Serialize;

#[derive(Debug, Serialize, Default)]
pub struct FolderInfo {
    pub name: String,
    pub parent: String,
    pub path: String,
    pub size: u64,
    pub nb_elements: u64
}

impl FolderInfo {
    pub fn new(name: String, parent: String, path: String, size: u64, nb_elements: u64) -> Self {
        FolderInfo {
            name,
            parent,
            path,
            size,
            nb_elements
        }
    }
}