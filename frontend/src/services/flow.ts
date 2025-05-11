
import { type FormSchemaType } from '@/lib/zod-schemas';
import { type Node, type Edge, type ReactFlowInstance } from '@xyflow/react';
import { nanoid } from "nanoid";

interface BlockNodeData extends Record<string, unknown> {
    isAdder?: boolean;
    label: string;
    description?: string;
    blockType?: 'cold-email' | 'wait-delay' | string;
    templateName?: string;
    subtitle?: string;
    duration?: string;
    durationUnit?: string;
}

interface BlockNode extends Node {
    data: BlockNodeData;
    type: 'blockNode';
}

interface NewTypeData extends BlockNodeData {
    isAdder: boolean;
    blockType: string;
    label: string;
}

export const handleAdd = (reactFlow: ReactFlowInstance, values: FormSchemaType): void => {

    const { emailTemplate, delayDuration, delayUnit, blockType } = values

    const VERTICAL_SPACING = 150;

    const existingNodes = reactFlow.getNodes();
    const startNode = existingNodes.find(node => node.id === 'node-sequence-starting-point');
    const blockNodes = existingNodes.filter(node =>
        node.type === 'blockNode' && !node.data.isAdder);
    const addBlockNode = existingNodes.find(node =>
        node.type === 'blockNode' && node.data.isAdder);

    const xPosition = startNode ? startNode.position.x : 300;

    let yPosition;
    if (blockNodes.length > 0) {
        const lowestBlockY = blockNodes.reduce((max, node) =>
            Math.max(max, node.position.y), startNode?.position.y || 0);
        yPosition = lowestBlockY + VERTICAL_SPACING;
    } else {
        yPosition = (startNode?.position.y || 0) + VERTICAL_SPACING;
    }

    const newBlockId = `node-${nanoid()}`;

    // Block-specific data
    const blockData: NewTypeData = {
        isAdder: false,
        blockType: blockType!,
        label: blockType === "cold-email" ? "Cold Email" : "Wait / Delay",
    };

    console.log("blockData:", blockData);


    if (blockType === "cold-email") {
        if (!emailTemplate) return;
        blockData.templateName = emailTemplate;
    } else if (blockType === "wait-delay") {
        if (!delayDuration || !delayUnit) return;
        blockData.duration = delayDuration;
        blockData.durationUnit = delayUnit;
    }

    const newBlockNode: BlockNode = {
        id: newBlockId,
        type: 'blockNode',
        position: { x: xPosition, y: yPosition },
        data: blockData,
    };

    console.log("New BLock", newBlockNode);

    reactFlow.addNodes(newBlockNode);

    // Move adder node below new block
    if (addBlockNode) {
        reactFlow.setNodes(nodes =>
            nodes.map(node => {
                if (node.id === addBlockNode.id) {
                    return {
                        ...node,
                        position: {
                            x: xPosition,
                            y: yPosition + VERTICAL_SPACING,
                        },
                    };
                }
                return node;
            })
        );
    }

    // Clean edges
    const cleanedEdges = reactFlow.getEdges().filter((edge: Edge) =>
        edge.target !== addBlockNode?.id && edge.target !== newBlockId
    );

    // Determine connection source
    let previousBlockId = 'node-sequence-starting-point';
    if (blockNodes.length > 0) {
        const latestBlock = blockNodes.reduce((latest, node) =>
            node.position.y > latest.position.y ? node : latest, blockNodes[0]);
        previousBlockId = latestBlock.id;
    }

    // Add new edges
    cleanedEdges.push({
        id: `edge-${nanoid()}`,
        source: previousBlockId,
        target: newBlockId,
        type: 'default',
    });

    if (addBlockNode) {
        cleanedEdges.push({
            id: `edge-${nanoid()}`,
            source: newBlockId,
            target: addBlockNode.id,
            type: 'default',
        });
    }

    reactFlow.setEdges(cleanedEdges);
}


export const handleEdit = (reactFlow: ReactFlowInstance, values: FormSchemaType, id: string): void => {

    if (values.blockType === "cold-email") {

        reactFlow.setNodes((nodes: Node[]) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...values,
                            templateName: values.emailTemplate,
                        }
                    };
                }
                return node;
            })
        );

    } else if (values.blockType === "wait-delay") {

        reactFlow.setNodes((nodes: Node[]) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...values,
                            duration: values.delayDuration,
                            durationUnit: values.delayUnit,
                        }
                    };
                }
                return node;
            })
        );
    }
}