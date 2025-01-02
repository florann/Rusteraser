use serde::Serialize;

#[derive(Debug, Serialize, Default)]
pub struct FileInfo {
    pub name: String,
    pub extension: String,
    pub path: String,
    pub size: u64
}


impl FileInfo {
    pub fn new(name: String, extension: String, path: String, size: u64) -> Self {
        FileInfo {
            name,
            path,
            extension,
            size
        }
    }
}