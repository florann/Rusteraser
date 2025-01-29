/* Implementation of the Item struct ( for frontend tabletree ) */
use serde::Serialize;

#[derive(Serialize)]
pub struct TbItem {
    pub id: u64,
    pub content: TbItemContent,
    pub hasChildren: bool,
    pub children: Vec<TbItem>
}

#[derive(Serialize)]
pub struct TbItemContent {
    title: String,
    size: u64
}
