import Navbar from '@/components/nav-bar'
import { authService } from '@/services/auth-service'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)')({
  beforeLoad: async ({ location }) => {
    const user = await authService.getCurrentUser()
    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />
      <main className="w-full flex-1 p-4 flex items-start justify-center max-w-7xl">
        <Outlet />
      </main>
    </div>
  )
}