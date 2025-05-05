import { Link, useLocation } from "react-router"

const subNavigation = [
    { name: 'Sequence', href: '/outreach/sequence', key: 'sequence' },
    { name: 'Outbox', href: '/outreach/outbox', key: 'outbox' },
    { name: 'Lists', href: '/outreach/lists', key: 'lists' },
    { name: 'Templates', href: '/outreach/templates', key: 'templates' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function SubNavbar() {
    
    const location = useLocation()

    return (
        <div className="w-full bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-4" aria-label="Sub navigation">
                    {subNavigation.map((item) => {
                        const isActive = location.pathname === item.href

                        return (
                            <Link
                                key={item.key}
                                to={item.href}
                                className={classNames(
                                    isActive
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                                )}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
