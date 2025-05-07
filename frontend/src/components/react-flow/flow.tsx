import {
    ReactFlow, Controls, Background, applyEdgeChanges, applyNodeChanges, addEdge,
    type Node, type Edge, type NodeChange, type EdgeChange, type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, type CSSProperties } from 'react';
import { SourceNode } from './source-node';
import { AddSourceNode } from './add-source-node';
import { AddBlockNode } from './add-block';
import { BlockNode } from './block-node';

// Define node types
const nodeTypes = {
    sourceNode: SourceNode,
    blockNode: BlockNode,
    addSourceNode: AddSourceNode,
    addBlockNode: AddBlockNode
};

export default function Flow() {
    // Initial nodes setup
    const initialNodes: Node[] = [
        {
            id: '1',
            position: { x: 315, y: 500 }, // Sequence Start Point at the bottom
            data: { label: 'Sequence Start Point' },
            style: {
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '15px',
                width: 200,
                textAlign: 'center' as const,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            } as CSSProperties
        },
        {
            id: 'add-source',
            position: { x: 300, y: 300 }, // Positioned above and to the right
            type: 'addSourceNode',
            data: { label: 'Add Lead Source', description: 'Click to add leads from List or CRM' },
        },
        {
            id: 'add-block',
            position: { x: 390, y: 600 }, // Positioned above and to the right
            type: 'addBlockNode', // Ensure this type is defined in your custom nodes
            data: { label: 'Add Block', description: 'Click to add block to the sequence' },
        }
    ];

    const initialEdges: Edge[] =[];

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    // Handle nodes changes
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );

    // Handle edges changes
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    // Handle new connections
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={{ type: 'smoothstep' }}
                fitView
            >
                <Background color="#f8f9fa" gap={16} />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
}