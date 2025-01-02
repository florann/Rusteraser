pub trait Info {
    fn name(&self) -> &String;
    fn parent(&self) -> &String;
    fn size(&self) -> &u64;
    fn path(&self) -> &String;
}