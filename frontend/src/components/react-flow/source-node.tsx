import { useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import SourceNodeForm from './source-node-form';

interface SourceNodeData {
    isAdder?: boolean;
    label: string;
    description?: string;
    sourceType?: 'list' | string;
    listName?: string;
    subtitle?: string;
}

// Define props for the SourceNode component
interface SourceNodeProps {
    data: SourceNodeData;
    id: string;
}

export function SourceNode({ data, id }: SourceNodeProps) {

    const [dialogKey, setDialogKey] = useState(0);
    const isAdder = data.isAdder || false;

    const defaultValues = {
        sourceType: (data.sourceType || "list") as "list",
        listName: data.listName || "",
    };

    useEffect(() => {
        setDialogKey(prev => prev + 1);
    }, [data]);

    return (
        <>
            <Handle type="source" position={Position.Bottom} id="a" />
            <SourceNodeForm
                id={id}
                key={dialogKey}
                isAdder={isAdder}
                defaultValues={defaultValues}
                data={data}
            />
        </>
    )
}