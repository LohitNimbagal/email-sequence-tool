import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/outreach/templates/templates')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/outreach/templates"!</div>
}
