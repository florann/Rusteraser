import React, { useState, useEffect, useRef, Children  } from "react";
import { listen } from "@tauri-apps/api/event";
import { typeTreeMap, isTypeTreeMap, reduceTreeDepth} from "../../type/typeTreeMap";
import eventDiskSelected from "../../event/eventDiskSelected";

import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

import "./TreeMapChart.css";

function TreeMapChart() {
    // State to store received data chunks
    const [dataChunks, setDataChunks] = useState<typeTreeMap>();
    const unlistenScanDataChunkRef = useRef<(() => void) | null>(null);
    const [TreeMapChartData, setTreeMapChartData] = useState<Array<any>>();
    
    function toArrayDataChunks(data: typeTreeMap | undefined) {
        if(data !== undefined)
        {
            data = reduceTreeDepth(data);
            console.log("Data after treatment");
            console.log(data);
            let result = Array<object>();
            result.push(data);
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
            toArrayDataChunks(dataChunks);
        }
    }, [dataChunks]);

  return (
    <div>
    <ResponsiveContainer width={250} height={250}>
        <Treemap
            data={TreeMapChartData ?? []}
            height={50}
            width={50}
            dataKey="size"
            nameKey="name"
            stroke="#fff"
            fill="#8884d8"
            aspectRatio={1}
            isAnimationActive={false}
        
        >
        <Tooltip />
        </Treemap>
    </ResponsiveContainer>
    </div>
  );
}

export default TreeMapChart;