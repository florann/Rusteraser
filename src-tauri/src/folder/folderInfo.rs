use crate::traits::Info::Info;
use serde::Serialize;

#[derive(Debug, Serialize, Default)]
pub struct FolderInfo {
    pub name: String,
    pub parent: String,
    pub path: String,
    pub size: u64,
    pub nb_elements: u64
}

// Implement the `Info` trait for `FolderInfo`
impl Info for FolderInfo {
    fn name(&self) -> &String {
        &self.name
    }

    fn parent(&self) -> &String {
        &self.parent
    }

    fn size(&self) -> &u64 {
        &self.size
    }

    fn path(&self) -> &String {
        &self.path
    }
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