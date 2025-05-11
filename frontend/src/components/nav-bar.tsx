import { useState } from 'react'
import { AlignJustify, X, LogOut, Mail } from 'lucide-react'
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

                    <div className="flex items-center gap-2 font-semibold">
                        <Mail className="h-5 w-5" />
                        <span>EmailSequence</span>
                    </div>

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
        </header>
    )
}
