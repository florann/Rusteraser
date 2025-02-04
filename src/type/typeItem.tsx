/* Type for tabletree */
export type ItemContent = { title: string, size: number, path: string};

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
    return (
      typeof candidate.title === 'string' &&
      typeof candidate.size === 'number' && 
      typeof candidate.path === 'string'
    );
  }
