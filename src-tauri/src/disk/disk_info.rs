use serde::{Deserialize, Serialize};
use crate::helper::helper;

#[derive(Debug, Serialize, Deserialize)]
pub struct DiskInfo {
    pub name: String,
    pub total_space: u64,
    pub available_space: u64,
    pub available_percentage: f64,
    pub used_space: u64,
    pub usage_percentage: f64

}

impl DiskInfo {
    pub fn new(name: String, total_space: u64, available_space: u64) -> Self {
        DiskInfo {
            name,
            total_space,
            available_space,
            available_percentage: helper::round_to_decimals((available_space as f64 / total_space as f64) * 100.0, 2),
            used_space: total_space - available_space,
            usage_percentage:helper::round_to_decimals((1.0 - (available_space as f64 / total_space as f64)) * 100.0, 2)
        }
    }
}