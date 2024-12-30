use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct DiskInfo {
    pub name: String,
    pub total_space: u64,
    pub available_space: u64,
}

impl DiskInfo {
    pub fn new(name: String, total_space: u64, available_space: u64) -> Self {
        DiskInfo {
            name,
            total_space,
            available_space,
        }
    }
}