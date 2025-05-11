import { Handle, Position, useReactFlow } from '@xyflow/react';
import BlockNodeDialog from './block-node-dialog';
import { handleAdd, handleEdit } from '@/services/flow';
import { useEffect, useState } from 'react';
import type { FormSchemaType } from '@/lib/zod-schemas';

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
    const reactFlow = useReactFlow();

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

    const handleSubmit = (values: FormSchemaType) => {
        if (isAdder) {
            handleAdd(reactFlow, values)
        } else {
            handleEdit(reactFlow, values, id)
        }
    }

    return (
        <>
            <Handle type="target" position={Position.Top} id="a" />
            <Handle type="source" position={Position.Bottom} id="b" />

            <BlockNodeDialog
                key={dialogKey}
                isAdder={isAdder}
                handleSubmit={handleSubmit}
                defaultValues={defaultValues}
            />
        </>
    )
}