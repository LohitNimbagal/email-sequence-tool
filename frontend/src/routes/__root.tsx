
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    component: () => (
        <div className='font-inter flex items-center justify-center'>
            <div className='w-full max-w-7xl'>
                <Outlet />
            </div>
        </div>
    ),
})