use serde::Serialize;

#[derive(Debug, Serialize, Default)]
pub struct FolderInfo {
    pub name: String,
    pub parent: String,
    pub path: String,
    pub size: u64,
    pub nb_elements: u64
}

