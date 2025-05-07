import { useState } from 'react'
import { AlignJustify, X, User, Lightbulb } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'

const navItems = [
    { name: 'Dashboard', href: '/', key: 'dashboard' },
    { name: 'Outreach', href: '/outreach', key: 'outreach' }
]

export default function Navbar() {

    const [mobileOpen, setMobileOpen] = useState(false)
    // const navigate = useNavigate()

    // const handleLogout = () => {
    //     console.log('Logging out...')
    //     // perform logout logic
    //     navigate('/login')
    // }

    return (
        <header className="bg-white border-b border-muted-200 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* Left: Logo & Nav */}
                    <div className="flex items-center space-x-2">
                        <Lightbulb className="w-6 h-6 text-primary" />
                        <nav className="hidden sm:flex items-center space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.key}
                                    to={item.href}
                                    className="[&.active]:font-bold"
                                // className={({ isActive }) =>
                                //     `px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
                                //         ? 'text-sidebar-primary bg-sidebar-primary-foreground rounded-md' // More prominent active state
                                //         : 'text-muted-foreground hover:text-primary'
                                //     }`
                                // }
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
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

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full border border-muted-300"
                                >
                                    <User className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem >Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
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
            )}
        </header>
    )
}
