"use client"

import { Home, Search, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <footer className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t z-50">
            <nav className="container h-full">
                <ul className="flex justify-around items-center h-full">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.label}>
                                <Link href={item.href} className="flex flex-col items-center gap-1">
                                    <item.icon className={cn("h-6 w-6", isActive ? "text-accent" : "text-muted-foreground")} />
                                    <span className={cn("text-xs", isActive ? "text-accent font-semibold" : "text-muted-foreground")}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </footer>
    )
}
