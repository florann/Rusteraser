use serde::Serialize;

#[derive(Serialize, Clone)]
#[serde(tag = "type")] // Adds a `type` field to distinguish variants
pub enum EntityInfo {
    File {
        name: String,
        extension: String,
        path: String,
        parent: String,
        size: u64,
    },
    Folder {
        name: String,
        path: String,
        parent: String,
        size: u64,
        nb_elements: u64,
    },
}