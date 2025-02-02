use rayon::iter::plumbing::Folder;
use serde::Serialize;
use serde_json::Serializer;

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
pub fn format_entities_to_items(folder_entity: &FolderEntity) -> TbItem {
    /* Convert */
    let mut id: u64 = 0;
    convert_entities_items(&Entity::Folder(folder_entity.clone()), &mut id)
}

fn convert_entities_items(entity: &Entity, id: &mut u64) -> TbItem {
    *id = *id + 1;
    let mut item = build_item(&entity, id);
    
    match entity {
        Entity::File(file) => {
            return item;
        },
        Entity::Folder(folder) => {
            if folder.children.is_empty() {
                return item;
            }

            for it_entity in &folder.children {
                item.children.push(convert_entities_items(&it_entity, id));
            }
            item
        }
    }
}

fn build_item(entity: &Entity, id: &u64) -> TbItem {
    match entity {
        Entity::File(file) => {
            TbItem {
                id: *id,
                content : TbItemContent{
                    title : file.name.clone(),
                    size : file.size
                },
                hasChildren : false, 
                children : Vec::new()
            }
        },
        Entity::Folder(folder) => {
            TbItem {
                id: *id,
                content : 
                    TbItemContent {
                    title : folder.name.clone(),
                    size : folder.size
                },
                hasChildren : false, 
                children : Vec::new()
            }
        }
    }
}

pub fn sort_entities(folder_entity: &mut FolderEntity) -> () {

    if !folder_entity.children.is_empty() {
        folder_entity.children.sort_by(|a, b| match(a, b){
            (Entity::Folder(folder1), Entity::Folder(folder2)) => folder1.size.cmp(&folder2.size).reverse(),
            (Entity::File(file1), Entity::File(file2)) => file1.size.cmp(&file2.size).reverse(),
            (Entity::File(file), Entity::Folder(folder)) => file.size.cmp(&folder.size).reverse(),
            (Entity::Folder(folder), Entity::File(file)) => folder.size.cmp(&file.size).reverse(),
        })
    }

    for entity in &mut folder_entity.children {
        match entity {
            Entity::Folder(folder) => {
                sort_entities(folder);
            },
            Entity::File(file) => {
                
            }
        }
    }
}

pub fn get_list_heavy_files(folder_entity: &FolderEntity, max_file: u64) -> Vec<FileEntity> {
    let mut cpt_file = 0;
    let mut vec_files: Vec<FileEntity> = Vec::new();

    get_list_heavy_files_rec(folder_entity, &mut vec_files, &max_file, &mut cpt_file);

    vec_files
}

fn get_list_heavy_files_rec(folder_entity: &FolderEntity, vec_files: &mut Vec<FileEntity>, max_file: &u64, cpt_file: &mut u64) -> () {
    if max_file <= cpt_file {
        return;
    }
    
    if folder_entity.children.is_empty() {
        return; 
    }
    
    for entity in &folder_entity.children {
        match(entity) {
            Entity::File(file) => {
                if max_file <= cpt_file {
                    return;
                }
                vec_files.push(file.clone());
               *cpt_file = *cpt_file + 1;
            },
            Entity::Folder(folder) => {
                get_list_heavy_files_rec(&folder, vec_files, max_file, cpt_file);
            }
        }
    }
}