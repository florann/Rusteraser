import React, { useState, useEffect, useRef  } from "react";
import { listen } from "@tauri-apps/api/event";
import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';
import { Box } from '@atlaskit/primitives';
import { EntityInfo, isEntityInfo} from "../../type/typeEntityInfo";
import eventDiskSelected from "../../event/eventDiskSelected";
import "./Browser.css";

/* Type creation for the TableTree */
type Content = { title: string, size: number};

type Item = {
	id: string;
	content: Content;
	hasChildren: boolean;
	children?: Item[];
};

function EntityInfoToItem(data : EntityInfo[], id: number, level: number): Item[] {
    let items: Item[] = [];
    for(const entity of data)
    {   
        let hasChildren = false;
        let children: EntityInfo[] = [];
        if(entity.entity_type === "folder"){
            hasChildren = (entity.children.length > 0) ? true : false;
            children = entity.children;
        }

        items.push({
            id: level.toString() + '_' + id.toString(),
            content : { title : entity.name, size : entity.size },
            hasChildren : hasChildren,
            children : EntityInfoToItem(children, id++, level++)
        });
    }

    return items;
}


const Title = (props: Content) => <Box as="span">{props.title}</Box>;
const Size = (props: Content) => <Box as="span">{props.size}</Box>;


function Browser() {
    // State to store received data chunks
    const [dataChunks, setDataChunks] = useState<EntityInfo[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);

    /* Run on load */
    useEffect(() => {
            //setDataChunks(dummyEntityInfo);
            const handleEvent = async() => {
            /* Event */
            const unlistenScanDataChunk = await listen('cmd_scan_selected_disk_entity_done', async (event) => {
                let obj_EntityInfo = event.payload;
                try {
                    if(isEntityInfo(obj_EntityInfo)){
                        setDataChunks((prevChunks) => [...prevChunks, event.payload as EntityInfo]);
                    }
                } catch (error) {
                console.error("Failed to parse EntityInfo:", error);
                }
            });
            unlistenScanDataChunkRef.current = unlistenScanDataChunk;

            };
            handleEvent();

            eventDiskSelected.on("clearDiv",() => {
                setDataChunks([]);
            });

            // Cleanup listeners on unmount
            return () => {
            if (unlistenScanDataChunkRef.current){
                unlistenScanDataChunkRef.current();
            }

            eventDiskSelected.off("clearDiv"); 
            };
        }, []); 
    
    /* Run on dataChunks update */
    useEffect(() => {
        setItems(EntityInfoToItem(dataChunks, 0, 0));
    }
    ,[dataChunks]);


    return (
        <div id="FileContent" className="browser" >
            <TableTree>
                <Headers>
                    <Header width={500}>Name</Header>
                    <Header width={120}>Size</Header>
                </Headers>
                <Rows
                    items={items}
                    render={({ id, content, children = [] }: Item) => (
                        <Row
                            itemId={id}
                            items={children}
                            hasChildren={children.length > 0}
                        >
                            <Cell>{Title(content)}</Cell>
                            <Cell>{Size(content)}</Cell>
                        </Row>
                    )}
                />
            </TableTree>
        </div>
    );
}

export default Browser;