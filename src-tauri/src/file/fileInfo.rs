use crate::traits::Info::Info;
use serde::Serialize;

#[derive(Debug, Serialize, Default)]
pub struct FileInfo {
    pub name: String,
    pub extension: String,
    pub path: String,
    pub parent: String,
    pub size: u64
}


impl Info for FileInfo {
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


impl FileInfo {
    pub fn new(name: String, extension: String, path: String, parent: String, size: u64) -> Self {
        FileInfo {
            name,
            path,
            parent,
            extension,
            size
        }
    }
}