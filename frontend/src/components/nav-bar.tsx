import { useState } from 'react'
import { AlignJustify, X, Lightbulb, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { authService } from '@/services/auth-service'
import { useNavigate } from '@tanstack/react-router'

export default function Navbar() {

    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => {
        await authService.logout()
        navigate({ to: "/login" })
    }

    return (
        <header className="bg-white border-b border-muted-200 shadow-sm w-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Left: Logo & Nav */}
                    <div className="flex items-center space-x-2">
                        <Lightbulb className="w-6 h-6 text-primary" />
                    </div>

                    {/* Right: Mobile toggle & User */}
                    <div className="flex items-center space-x-2">
                        <div className="sm:hidden">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                {mobileOpen ? <X className="w-5 h-5 text-muted" /> : <AlignJustify className="w-5 h-5 text-muted" />}
                            </Button>
                        </div>

                        <Button variant={"outline"} onClick={handleLogout}>
                            <LogOut className='w-4 h-4 text-red-500' />
                            <span className='text-red-500 text-sm'>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {/* {mobileOpen && (
                <div className="sm:hidden px-4 pb-4 pt-2 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            to={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="[&.active]:font-bold"
                        // className={({ isActive }) =>
                        //     `block px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
                        //         ? 'text-primary bg-muted-200 rounded-md'
                        //         : ' hover:text-primary'
                        //     }`
                        // }
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )} */}
        </header>
    )
}
