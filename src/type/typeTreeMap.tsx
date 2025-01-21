export type typeTreeMap = 
{
    name: string;          
    size: number;
    children: typeTreeMap[];
};

export function isTypeTreeMap(obj: any): obj is typeTreeMap {
    if (!obj || typeof obj !== "object") return false;
    return (
        typeof obj.name === "string" &&
        typeof obj.size === "number" &&
        Array.isArray(obj.children)
    );
}
