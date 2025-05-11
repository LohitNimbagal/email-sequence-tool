
import { type FormSchemaType, type SourceFormValues } from '@/lib/zod-schemas';
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

export const handleAddSource = (reactFlow: ReactFlowInstance, values: SourceFormValues) => {

    if (values.sourceType === "list" && values.listName) {
        const HORIZONTAL_SPACING = 250;
        const START_Y = 300;
        const existingNodes = reactFlow.getNodes();
        const sourceNodes = existingNodes.filter(node =>
            node.type === 'sourceNode' && !node.data.isAdder);

        // Calculate X position for the new node
        let xPosition;

        if (sourceNodes.length > 0) {
            // Find the rightmost existing source node
            const rightmostNodeX = sourceNodes.reduce(
                (max, node) => Math.max(max, node.position.x),
                -Infinity
            );
            xPosition = rightmostNodeX + HORIZONTAL_SPACING;
        } else {
            // First source node — place to the right of node '1'
            const startNode = existingNodes.find(node => node.id === 'node-sequence-starting-point');
            xPosition = startNode ? startNode.position.x + HORIZONTAL_SPACING : 300;
        }

        const newNode = {
            id: `node-${nanoid()}`,
            type: 'sourceNode',
            position: { x: xPosition, y: START_Y },
            data: {
                isAdder: false,
                label: "Leads from",
                sourceType: values.sourceType,
                listName: values.listName,
                subtitle: values.listName,
            },
        };

        // Create a new edge to connect the new source node to the sequence start point (id: '1')
        const newEdge = {
            id: `edge-${nanoid()}`,
            source: newNode.id,
            target: 'node-sequence-starting-point', // Connect to the sequence start point
            type: 'default',
        };

        reactFlow.addNodes(newNode);
        reactFlow.addEdges(newEdge);

        const addBlockNode = existingNodes.find(node => node.id === 'add-block');
        if (addBlockNode) {
            reactFlow.addEdges({
                id: `edge-${nanoid()}`,
                source: 'node-sequence-starting-point',
                target: addBlockNode.id,
                type: 'default',
            });
        }
    }
}

export const handleEditSource = (reactFlow: ReactFlowInstance, values: SourceFormValues, id: string) => {

    reactFlow.setNodes((nodes) =>
        nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...values,
                        listName: values.listName,
                        subtitle: values.listName,
                    }
                };
            }
            return node;
        })
    );
}