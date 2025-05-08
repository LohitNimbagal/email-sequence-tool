import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/dashboard/sequences/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  navigate({ to: '/dashboard' })
}
