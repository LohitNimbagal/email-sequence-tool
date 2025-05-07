import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/outreach/outbox/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/outreach/outbox/"!</div>
}
