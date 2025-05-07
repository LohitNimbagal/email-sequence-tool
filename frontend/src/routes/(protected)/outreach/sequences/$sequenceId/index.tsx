import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import Flow from '@/components/react-flow/flow';
import { Button } from '@/components/ui/button'

import { sequenceQueryOptions } from '@/services/sequence'

import '@xyflow/react/dist/style.css';

export const Route = createFileRoute('/(protected)/outreach/sequences/$sequenceId/')({
  loader: async ({ context: { queryClient }, params: { sequenceId } }) => {
    return queryClient.ensureQueryData(sequenceQueryOptions(sequenceId))
  },
  component: RouteComponent,
})

function RouteComponent() {

  const sequenceId = Route.useParams().sequenceId
  const { data: sequenceArray, isLoading } = useSuspenseQuery(sequenceQueryOptions(sequenceId))
  const sequence = sequenceArray[0]

  if (isLoading) {
    <div>Loading.....</div>
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{sequence.name}</h1>
          <p className="text-gray-600">
            Create/Manage your sequences with automated emails & timely tasks.
          </p>
        </div>
        <Button>
          <span>Save Sequence</span>
        </Button>
      </div>

      <div className='bg-red-300 w-[80rem] h-[40rem]'>
        <Flow />
      </div>

    </div>
  )
}
