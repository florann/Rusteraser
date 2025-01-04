export type EntityInfo =
  | {
      type: "File";
      name: string;
      extension: string;
      path: string;
      parent: string;
      size: number;
    }
  | {
      type: "Folder";
      name: string;
      path: string;
      parent: string;
      size: number;
      nb_elements: number;
    };
