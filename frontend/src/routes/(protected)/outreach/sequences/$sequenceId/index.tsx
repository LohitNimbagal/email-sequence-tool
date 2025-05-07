import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/outreach/sequences/$sequenceId/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { sequenceId } = Route.useParams()

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{sequenceId}</h1>
          <p className="text-gray-600">
            Create/Manage your sequences with automated emails & timely tasks.
          </p>
        </div>
        <Button>
          <span>Save Sequence</span>
        </Button>
      </div>
    </div>
  )
}
