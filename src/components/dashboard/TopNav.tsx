'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Bell } from 'lucide-react'
import { useProfile } from '@/lib/queries'

const navItems = [
  { name: 'Overview', href: '/' },
  { name: 'Garden Plot', href: '/garden' },
  { name: 'Statistics', href: '/statistics' },
  { name: 'Settings', href: '/settings' },
]

export function TopNav() {
  const pathname = usePathname()
  const { data: profile } = useProfile()

  const displayName = profile?.display_name || profile?.username || 'Mosopefoluwa'
  const level = profile?.level || 12
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'MA'

  return (
    <header className="border-b border-emerald-950/80 bg-[#06100c]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-[#06100c] fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                Habit Garden
              </span>
              <span className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-semibold -mt-1">
                Consistency Engine
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-emerald-950/30 p-1 rounded-xl border border-emerald-900/40">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-emerald-950/20'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button" 
            aria-label="Notifications" 
            className="w-9 h-9 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center text-gray-400 hover:text-emerald-300 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-emerald-950">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-gray-200">{displayName}</p>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium">Lvl {level} Bloom Master</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-bold text-[#06100c] shadow-md shadow-emerald-900/40">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
