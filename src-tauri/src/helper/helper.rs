use rayon::iter::plumbing::Folder;

use crate::implementation::entity;
use crate::Entity;
use crate::FolderEntity;
use crate::FileEntity;
use crate::TbItem;
use crate::TbItemContent;

/* Function to round a float number to the specify decimal */
pub fn round_to_decimals(num: f64, decimals: usize) -> f64 {
    let factor = 10_f64.powi(decimals as i32);
    (num * factor).round() / factor
}

/* Function to descent sort entities by their size and to convert them into Item */
fn format_entities_to_items(mut folder_entity: FolderEntity){
    /* Sort */
    sort_entities(&mut folder_entity);

    /* Convert */
    
}

fn sort_entities(folder_entity: &mut FolderEntity) -> () {

    if !folder_entity.children.is_empty() {
        folder_entity.children.sort_by(|a, b| match(a, b){
            (Entity::Folder(folder1), Entity::Folder(folder2)) => folder1.size.cmp(&folder2.size),
            (Entity::File(file1), Entity::File(file2)) => file1.size.cmp(&file2.size),
            (Entity::File(file), Entity::Folder(folder)) => file.size.cmp(&folder.size),
            (Entity::Folder(folder), Entity::File(file)) => folder.size.cmp(&file.size),
        })
    }

    for entity in &mut folder_entity.children {
        match entity {
            Entity::Folder(folder) => {
                sort_entities(folder);
            },
            Entity::File(file) => {
                println!("Processing file: {}", file.name);
            }
        }
    }
}