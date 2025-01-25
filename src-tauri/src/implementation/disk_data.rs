#[derive(serde::Serialize)]
pub struct DiskData {
    pub name: String,
    pub size: u64, 
    pub children: Vec<DiskData>
} 

impl DiskData {
    pub fn new(name: String, size: u64, children: Vec<DiskData>) -> Self {
        Self { name, size, children }
    }
}
