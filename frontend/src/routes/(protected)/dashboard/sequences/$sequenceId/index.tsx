import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Flow from '@/components/react-flow/flow'
import { Button } from '@/components/ui/button'
import { saveSquence, sequenceQueryOptions } from '@/services/sequence'
import '@xyflow/react/dist/style.css'
import { useState, type CSSProperties } from 'react'
import type { Edge, Node } from '@xyflow/react'
import { ArrowLeft, Save, Info } from 'lucide-react'

export const Route = createFileRoute('/(protected)/dashboard/sequences/$sequenceId/')({
  loader: async ({ context: { queryClient }, params: { sequenceId } }) => {
    return queryClient.ensureQueryData(sequenceQueryOptions(sequenceId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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
  ]

  const initialEdges: Edge[] = []

  const [nodes, setNodes] = useState(sequence?.nodes?.length > 0 ? sequence.nodes : initialNodes)
  const [edges, setEdges] = useState(sequence?.edges?.length > 0 ? sequence.edges : initialEdges)

  const updateSequenceMutation = useMutation({
    mutationFn: saveSquence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequences', sequenceId] })
    },
  })

  if (isLoading) return <div className="flex justify-center items-center h-96">Loading...</div>

  const handleSave = async () => {
    try {
      await updateSequenceMutation.mutateAsync({
        nodes,
        edges,
        sequenceId,
        name: sequence.name
      })
    } catch (error) {
      console.error('Failed to save sequence:', error)
      // You might want to show an error toast/notification here
    }
  }

  const handleBack = () => {
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-9 w-9 p-0 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{sequence.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create/Manage your sequences with automated emails & timely tasks.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateSequenceMutation.isPending}
          className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
        >
          <Save className="h-4 w-4" />
          {updateSequenceMutation.isPending ? 'Saving...' : 'Save Sequence'}
        </Button>
      </div>

      {/* Flow Designer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 overflow-hidden h-[calc(100vh-180px)]">
        {/* Sequence Flow Builder instructions */}
        <div className="bg-blue-50 text-blue-700 px-4 py-2 mb-2 rounded-md flex items-start gap-2 text-sm">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Sequence Builder:</span>Connect nodes to create your sequence flow. Add lead sources and email blocks as needed.
          </div>
        </div>

        {/* The Flow component */}
        <div className="h-[calc(100%-40px)]">
          <Flow
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
          />
        </div>
      </div>
    </div>
  )
}