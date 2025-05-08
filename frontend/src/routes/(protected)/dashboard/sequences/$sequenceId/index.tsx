import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import Flow from '@/components/react-flow/flow';
import { Button } from '@/components/ui/button'

import { saveSquence, sequenceQueryOptions } from '@/services/sequence'

import '@xyflow/react/dist/style.css';
import { useState, type CSSProperties } from 'react';
import type { Edge, Node } from '@xyflow/react';

export const Route = createFileRoute('/(protected)/dashboard/sequences/$sequenceId/')({
  loader: async ({ context: { queryClient }, params: { sequenceId } }) => {
    return queryClient.ensureQueryData(sequenceQueryOptions(sequenceId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient();

  const sequenceId = Route.useParams().sequenceId
  const { data: sequence, isLoading } = useSuspenseQuery(sequenceQueryOptions(sequenceId))

  // Initial nodes setup
  const initialNodes: Node[] = [
    {
      id: 'node-sequence-starting-point',
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
      id: 'node-add-source',
      position: { x: 300, y: 300 },
      type: 'sourceNode',
      data: {
        isAdder: true,
        label: 'Add Lead Source',
        description: 'Click to add leads from List or CRM'
      },
    },
    {
      id: 'node-add-block',
      position: { x: 390, y: 600 },
      type: 'blockNode',
      data: {
        isAdder: true,
        label: 'Add Block',
        description: 'Click to add block to the sequence'
      },
    }
  ];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes] = useState<Node[]>(sequence.nodes.length > 0 ? sequence.nodes : initialNodes);
  const [edges, setEdges] = useState<Edge[]>(sequence.edges.length > 0 ? sequence.edges : initialEdges);

  const updateSequenceMutation = useMutation({
    mutationFn: saveSquence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequences', sequenceId] });
    },
  });

  if (isLoading) return <div>Loading.....</div>;

  const handleSave = async () => {
    try {
      await updateSequenceMutation.mutateAsync({ nodes, edges, sequenceId, name: sequence.name });
    } catch (error) {
      console.error('Failed to save sequence:', error);
      // You might want to show an error toast/notification here
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{sequence.name}</h1>
          <p className="text-gray-600">
            Create/Manage your sequences with automated emails & timely tasks.
          </p>
        </div>
        <Button onClick={handleSave}>
          <span>Save Sequence</span>
        </Button>
      </div>

      <div className='bg-red-300 w-[80rem] h-[40rem]'>
        <Flow nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
      </div>

    </div>
  )
}
