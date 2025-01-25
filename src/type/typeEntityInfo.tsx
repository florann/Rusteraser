export type EntityInfo =
  | {
      type: "File";          
      name: string;
      size: number;
      path: string;
      extension: string;      
      entity_type: string;    
    }
  | {
      type: "Folder";
      name: string;
      size: number;
      path: string;
      entity_type: string;  
      children: string[];
    };


    // Type guard function
export function isEntityInfo(obj: any): obj is EntityInfo {
  if (!obj || typeof obj !== "object") return false;

  if (obj.entity_type === "file") {
    return (
      typeof obj.name === "string" &&
      typeof obj.size === "number" &&
      typeof obj.path === "string" &&
      typeof obj.extension === "string" &&
      typeof obj.entity_type === "string" 
    );
  }

  if (obj.entity_type === "folder") {
    return (
      typeof obj.name === "string" &&
      typeof obj.size === "number" &&
      typeof obj.path === "string" &&
      typeof obj.entity_type === "string" &&
      Array.isArray(obj.children)
    );
  }
  console.log("false");
  return false;
}
