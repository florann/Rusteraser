import React, { useState, useEffect, useRef  } from "react";
import { listen } from "@tauri-apps/api/event";
import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';
import { Box } from '@atlaskit/primitives';
import { Item, ItemContent, isItem} from "../../type/typeItem";
import eventDiskSelected from "../../event/eventDiskSelected";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import "./Browser.css";

const Title = (props: ItemContent) => <Box as="span">{props.title}</Box>;
const Size = (props: ItemContent) => {
    const sizeInMB = props.size / (1024 * 1024);
    const formattedSize =
      sizeInMB >= 1000
        ? `${(sizeInMB / 1024).toFixed(2)} Go`
        : `${sizeInMB.toFixed(0)} Mo`;
    
        return <Box as="span">
                    <div className="browserSizeContent">
                        <div>{formattedSize}</div>
                        <div className="actionBrowser mouseClick" data-file-path={props.path}>
                            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                        </div>
                    </div>
                </Box>;
}

function Browser() {
    const [items, setItems] = useState<Item>({
        id : "0", 
        content : {title: "", size : 0, path: ""},
        hasChildren : false,
        children : []
    });
    const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);

    /* Run on load */
    useEffect(() => {
            const handleEvent = async() => {
                /* Event */
                const unlistenScanDataChunk = await listen('cmd_scan_selected_disk_entity_done', async (event) => {
                    try {
                        if(isItem(event.payload)){
                            setItems(event.payload);
                        }
                    } catch (error) {
                    console.error("Failed to parse payload:", error);
                    }
                });
                unlistenScanDataChunkRef.current = unlistenScanDataChunk;
            };
            handleEvent();

            eventDiskSelected.on("clearDiv",() => {
                setItems(Object);
            });

            // Cleanup listeners on unmount
            return () => {
            if (unlistenScanDataChunkRef.current){
                unlistenScanDataChunkRef.current();
            }

            eventDiskSelected.off("clearDiv"); 
            };
        }, []); 

    return (
        <div id="Browser" className="browser" >
            <TableTree>
                <Headers>
                    <Header width={"80%"}>Name</Header>
                    <Header width={"20%"}>Size</Header>
                </Headers>
                <Rows
                    items={items ? [items] :  undefined}
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