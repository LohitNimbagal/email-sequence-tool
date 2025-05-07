import OutreachNavbar from '@/components/outreach-nav-bar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/outreach')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <OutreachNavbar />
      <main className="w-full flex-1 p-4 flex items-start justify-center max-w-7xl">
        <Outlet />
      </main>
    </div>
  )
}
