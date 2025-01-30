/* Implementation of the Item struct ( for frontend tabletree ) */
use serde::Serialize;

#[derive(Serialize)]
pub struct TbItem {
    pub id: u64,
    pub content: TbItemContent,
    pub hasChildren: bool, // Not snake to respect React tabletree name
    pub children: Vec<TbItem>
}

#[derive(Serialize)]
pub struct TbItemContent {
    pub title: String,
    pub size: u64
}
