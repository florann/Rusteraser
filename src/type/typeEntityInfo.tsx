export type EntityInfo =
  | {
      type: "File";           // For discriminating in your React code
      name: string;
      path: string;
      size: number;
      entity_type: string;    // Matches Rust's `entity_type` field
      extension: string;      // File-specific field

      // Arrays of string paths, converted from DirEntry
      parent_entries: string[];
      current_entries: string[];
      children_entries: string[][];
    }
  | {
      type: "Folder";
      name: string;
      path: string;
      size: number;
      entity_type: string;    // Matches Rust's `entity_type` field
      extension: string;      // File-specific field

      // Arrays of string paths, converted from DirEntry
      parent_entries: string[];
      current_entries: string[];
      children_entries: string[][];
    };


    // Type guard function
export function isEntityInfo(obj: any): obj is EntityInfo {
  if (!obj || typeof obj !== "object") return false;

  if (obj.entity_type === "file") {
    return (
      typeof obj.name === "string" &&
      typeof obj.path === "string" &&
      typeof obj.extension === "string" &&
      typeof obj.size === "number" &&
      typeof obj.entity_type === "string" &&
      Array.isArray(obj.parent_entries) &&
      Array.isArray(obj.current_entries) &&
      Array.isArray(obj.children_entries)
    );
  }

  if (obj.entity_type === "folder") {
    return (
      typeof obj.name === "string" &&
      typeof obj.path === "string" &&
      typeof obj.size === "number" &&
      typeof obj.entity_type === "string" &&
      Array.isArray(obj.parent_entries) &&
      Array.isArray(obj.current_entries) &&
      Array.isArray(obj.children_entries)
    );
  }
  console.log("false");
  return false;
}
