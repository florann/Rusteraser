export type typeTreeMap = 
{
    path: string;          
    size: number;
    children: typeTreeMap[];
};

export function isTypeTreeMap(obj: any): obj is typeTreeMap {
    if (!obj || typeof obj !== "object") return false;
    console.log("Is `obj.path`? ", typeof obj.path === "string");
    console.log("Is `obj.size`? ", typeof obj.size === "number");
    console.log("Is `obj.children? ", Array.isArray(obj.children));
    return (
        typeof obj.path === "string" &&
        typeof obj.size === "number" &&
        Array.isArray(obj.children)
    );
}
