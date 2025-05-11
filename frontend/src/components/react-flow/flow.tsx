import {
    ReactFlow, Controls, Background, applyEdgeChanges, applyNodeChanges, addEdge,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { SourceNode } from './source-node';
import { BlockNode } from './block-node';

// Define node types with unified components
const nodeTypes = {
    sourceNode: SourceNode,
    blockNode: BlockNode
};

type FlowProps = {
    nodes: Node[];
    edges: Edge[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

export default function Flow({ nodes, edges, setNodes, setEdges }: FlowProps) {

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes], 
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges], 
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges], 
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
            >
                <Background color="#f8f9fa" gap={16} />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
}