
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    component: () => (
        <div className='font-inter'>
            <Outlet />
        </div>
    ),
})