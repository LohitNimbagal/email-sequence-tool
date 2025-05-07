import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/outreach/lists/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/outreach/lists/"!</div>
}
