import { useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import BlockNodeForm from './block-node-form';

interface NodeData {
    isAdder?: boolean;
    blockType?: "cold-email" | "wait-delay";
    templateName?: string;
    duration?: string;
    durationUnit?: "minutes" | "hours" | "days";
}

interface BlockNodeProps {
    data: NodeData;
    id: string;
}

export function BlockNode({ data, id }: BlockNodeProps) {

    const [dialogKey, setDialogKey] = useState(0);
    const isAdder = data.isAdder || false;

    const defaultValues = {
        blockType: (data.blockType || "cold-email") as "cold-email" | "wait-delay",
        emailTemplate: data.templateName || "",
        delayDuration: data.duration || "",
        delayUnit: (data.durationUnit || "minutes") as "minutes" | "hours" | "days",
    };

    useEffect(() => {
        // Force dialog to re-render with new values
        setDialogKey(prev => prev + 1);
    }, [data]);

    return (
        <>
            <Handle type="target" position={Position.Top} id="a" />
            <Handle type="source" position={Position.Bottom} id="b" />

            <BlockNodeForm
                id={id}
                key={dialogKey}
                isAdder={isAdder}
                defaultValues={defaultValues}
            />
        </>
    )
}