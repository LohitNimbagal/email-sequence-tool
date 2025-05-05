
import { useState } from 'react'
import { X, AlignJustify } from 'lucide-react'

const navItems = [
    { name: 'Dashboard', href: '/', key: 'dashboard' },
    { name: 'Outreach', href: '/outreach', key: 'outreach' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeNav, setActiveNav] = useState('dashboard')

    const handleNavClick = (key: string) => {
        setActiveNav(key)
        setMobileMenuOpen(false)
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <AlignJustify className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Logo and Desktop Nav */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img
                                className="h-6 w-auto"
                                src="https://unicorn-images.b-cdn.net/147c28c6-09fa-4aaf-8493-f6e98c1a6d17"
                                alt="Your Company"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navItems.map((item) => (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        onClick={() => handleNavClick(item.key)}
                                        className={classNames(
                                            activeNav === item.key
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                            'rounded-md px-3 py-2 text-sm font-medium'
                                        )}
                                        aria-current={activeNav === item.key ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {navItems.map((item) => (
                            <a
                                key={item.key}
                                href={item.href}
                                onClick={() => handleNavClick(item.key)}
                                className={classNames(
                                    activeNav === item.key
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                                aria-current={activeNav === item.href ? 'page' : undefined}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
