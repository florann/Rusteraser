import React, { useState, useEffect, useRef, Children  } from "react";
import { listen } from "@tauri-apps/api/event";
import { typeTreeMap, isTypeTreeMap} from "../../type/typeTreeMap";
import eventDiskSelected from "../../event/eventDiskSelected";

import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

import "./TreeMapChart.css";

interface TreeMapChartDataParent {
    name: string,
    children: Array<object>
}


interface TreeMapChartDataChild {
    name: string,
    size: number
}

function TreeMapChart() {
    // State to store received data chunks
    const [dataChunks, setDataChunks] = useState<typeTreeMap>();
    const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);
    const [TreeMapChartData, setTreeMapChartData] = useState<Array<TreeMapChartDataParent>>();
    
      
    function toTreeMapChartData(data: typeTreeMap | undefined) {
        if(data !== undefined)
        {
            let result = Array<TreeMapChartDataParent>();
            result.push({name : data.name, children : Array<TreeMapChartDataChild>()});
            for(const child of data.children){
                result[0].children.push({
                    name : child.name,
                    size : child.size
                })
            }
            setTreeMapChartData(result);
        }
    }
    

    /* Run on load */
    useEffect(() => {
            const handleEvent = async() => {
            /* Event */
            const unlistenScanDataChunk = await listen('cmd_scan_selected_disk_done', async (event) => {
                let obj_TypeTreeMap = event.payload;
                try {
                    if(isTypeTreeMap(obj_TypeTreeMap)){
                        setDataChunks(obj_TypeTreeMap as typeTreeMap);
                    }
                } catch (error) {
                    console.error("Failed to parse EntityInfo:", error);
                }
            });
            unlistenScanDataChunkRef.current = unlistenScanDataChunk;
        };
        handleEvent();
        eventDiskSelected.on("clearDiv",() => {
            setDataChunks(undefined);
        });

        // Cleanup listeners on unmount
        return () => {
            if (unlistenScanDataChunkRef.current){
                unlistenScanDataChunkRef.current();
            }
            eventDiskSelected.off("clearDiv"); // Remove custom event listener
        };

    }, []); // The empty dependency array ensures this runs only once (on mount)

    useEffect(() => {
        if (dataChunks) {
            console.log("Data chunks updated:", dataChunks);
            toTreeMapChartData(dataChunks);
        }
    }, [dataChunks]);

  return (
    <div>
    <ResponsiveContainer width="100%" height={400}>
        <Treemap
            data={TreeMapChartData ?? []}
            dataKey="size"
            nameKey="name"
            stroke="#fff"
            fill="#8884d8"
        >
            <Tooltip />
        </Treemap>
    </ResponsiveContainer>
    </div>
  );
}

export default TreeMapChart;