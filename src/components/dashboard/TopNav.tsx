'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Overview', href: '/' },
  { name: 'Garden', href: '/garden' },
  { name: 'Statistics', href: '/statistics' },
  { name: 'Settings', href: '/settings' },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="hidden md:flex items-center justify-between py-4 px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-primary tracking-tight">Habit Garden</h1>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
