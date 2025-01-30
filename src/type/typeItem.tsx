/* Type for tabletree */
export type ItemContent = { title: string, size: number};

export type Item = {
	id: string;
	content: ItemContent;
	hasChildren: boolean;
	children?: Item[];
};

// type guard function
export function isItem(obj: unknown): obj is Item {
  if (!obj || typeof obj !== "object") return false;

    const candidate = obj as Item;

        console.log(typeof candidate.id.toString());
        console.log(isItemContent(candidate.content)) ;
        console.log(typeof candidate.hasChildren);
        console.log(Array.isArray(candidate.children));
        
    return (
        typeof candidate.id.toString() === "string" &&
        isItemContent(candidate.content) &&
        typeof candidate.hasChildren === "boolean" &&
        Array.isArray(candidate.children)
    );
}

function isItemContent(obj: unknown): boolean {
    // First check that `obj` is an object and not null
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }
  
    // Then check each property in ItemContent
    const candidate = obj as ItemContent;
    console.log("---------D-----------");
    console.log(typeof candidate.title);
    console.log(typeof candidate.size);
    console.log("----------F----------");

    return (
      typeof candidate.title === 'string' &&
      typeof candidate.size === 'number'
    );
  }
