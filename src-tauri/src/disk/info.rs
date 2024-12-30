use serde::Serialize;
use crate::helper::number;

#[derive(Debug, Serialize)]
pub struct DiskInfo {
    pub name: String,
    pub total_space: u64,
    pub available_space: u64,
    pub available_percentage: f64,
    pub usage_percentage: f64

}

impl DiskInfo {
    pub fn new(name: String, total_space: u64, available_space: u64) -> Self {
        DiskInfo {
            name,
            total_space,
            available_space,
            available_percentage: number::round_to_decimals((available_space as f64 / total_space as f64) * 100.0, 2),
            usage_percentage:number::round_to_decimals((1.0 - (available_space as f64 / total_space as f64)) * 100.0, 2)
        }
    }
}