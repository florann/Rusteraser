export type typeTreeMap = 
{
    name: string;          
    size: number;
    children: typeTreeMap[];
};

/**
 * Function to reduce the tree depth to a maximum of 2 levels.
 * @param data - The original tree structure.
 * @param level - Current depth level (default is 1).
 * @returns A new tree structure with max 2 levels.
 */
export function reduceTreeDepth(data: typeTreeMap, children_level: number = 2,level: number = 1): typeTreeMap {
    if (level >= children_level) {
        // Truncate children at level 2, keeping only the top-level nodes
        return {
            name: data.name,
            size: data.size,
            children: [],  // Remove deeper nesting beyond level 2
        };
    }
    return {
        name: data.name,
        size: Math.log(data.size + 1),
        children: data.children?.map(child => {
            child.size = Math.log(child.size + 1);
            return reduceTreeDepth(child, children_level, level + 1)
        }),
    };
}

export function isTypeTreeMap(obj: any): obj is typeTreeMap {
    if (!obj || typeof obj !== "object") return false;
    return (
        typeof obj.name === "string" &&
        typeof obj.size === "number" &&
        Array.isArray(obj.children)
    );
}
