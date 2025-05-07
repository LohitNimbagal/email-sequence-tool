import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/outreach/sequences/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  navigate({ to: '/outreach' })
}
