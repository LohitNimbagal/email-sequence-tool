import { Link, useLocation } from "@tanstack/react-router";

export default function OutreachNavbar() {

    const subNavigation = [
        { name: "Sequence", href: "/outreach", key: "sequence" },
        { name: "Outbox", href: "/outreach/outbox", key: "outbox" },
        { name: "Lists", href: "/outreach/lists", key: "lists" },
        { name: "Templates", href: "/outreach/templates", key: "templates" },
    ];

    // Use useLocation to get the current path
    const location = useLocation();

    return (
        <div className="w-full border-b bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-6 py-0" aria-label="Sub navigation">
                    {subNavigation.map((item) => {
                        const isActive = location.pathname === item.href;

                        return (
                            <Link
                                key={item.key}
                                to={item.href}
                                className={`text-sm font-medium transition-colors py-4 
                                    ${isActive
                                        ? "text-foreground border-b-2 border-primary pb-2"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
