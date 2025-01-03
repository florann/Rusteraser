use serde::Serialize;

#[derive(Debug, Serialize, Default)]
pub struct FileInfo {
    pub name: String,
    pub extension: String,
    pub path: String,
    pub parent: String,
    pub size: u64
}
