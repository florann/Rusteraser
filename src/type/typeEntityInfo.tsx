export type EntityInfo =
  | {
      type: "File";
      name: string;
      extension: string;
      path: string;
      parent_path: string;
      node_type: string;
      size: number;
    }
  | {
      type: "Folder";
      name: string;
      path: string;
      parent_path: string;
      node_type: string;
      size: number;
      nb_elements: number;
    };


    // Type guard function
export function isEntityInfo(obj: any): obj is EntityInfo {
  if (!obj || typeof obj !== "object") return false;

  if (obj.type === "File") {
    return (
      typeof obj.name === "string" &&
      typeof obj.extension === "string" &&
      typeof obj.parent_path === "string" &&
      typeof obj.node_type === "string" &&
      typeof obj.parent === "string" &&
      typeof obj.size === "number"
    );
  }

  if (obj.type === "Folder") {
    return (
      typeof obj.name === "string" &&
      typeof obj.path === "string" &&
      typeof obj.parent_path === "string" &&
      typeof obj.node_type === "string" &&
      typeof obj.size === "number" &&
      typeof obj.nb_elements === "number"
    );
  }

  return false;
}
