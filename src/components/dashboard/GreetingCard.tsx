'use client'

import { useProfile, useHabits, useGarden } from '@/lib/queries'
import { Flame, Star, Sprout, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function GreetingCard() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: habits } = useHabits()
  const { data: garden } = useGarden()

  if (profileLoading) {
    return (
      <div className="space-y-4 mb-8 p-6 rounded-3xl bg-[#0c1c14] border border-emerald-900/50 shadow-sm">
        <Skeleton className="h-8 w-64 bg-emerald-950/60" />
        <Skeleton className="h-4 w-48 bg-emerald-950/60" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <Skeleton className="h-16 w-full rounded-2xl bg-emerald-950/60" />
          <Skeleton className="h-16 w-full rounded-2xl bg-emerald-950/60" />
          <Skeleton className="h-16 w-full rounded-2xl bg-emerald-950/60" />
          <Skeleton className="h-16 w-full rounded-2xl bg-emerald-950/60" />
        </div>
      </div>
    )
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const displayName = profile?.display_name || profile?.username || 'Mosopefoluwa'
  const streak = profile?.streak ?? 45
  const xp = profile?.xp ?? 14500
  const level = profile?.level ?? 12
  const plantCount = garden?.plants?.length ?? 16
  const completedHabits = habits?.filter((h: any) => h.is_completed_today)?.length ?? 4
  const totalHabits = habits?.length || 5

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1c14] to-[#081510] border border-emerald-900/50 p-6 sm:p-8 overflow-hidden shadow-2xl shadow-black/40">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ✨ Daily Cycle Active
            </span>
            <span className="text-xs text-gray-400">· Reset in 7h 45m</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
            {greeting}, {displayName} 🌱
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Your garden is flourishing today with <span className="text-emerald-300 font-medium">{completedHabits} of {totalHabits} habits completed</span>. Keep the streak alive!
          </p>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <Flame className="w-4 h-4 fill-amber-400/20" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-300 font-mono">{streak}</span>
              <span className="text-xs text-amber-400/80">days</span>
            </div>
          </div>

          <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <Star className="w-4 h-4 fill-emerald-400/20" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">XP</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-300 font-mono">{xp.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
            <div className="flex items-center gap-1.5 text-teal-400 mb-1">
              <Sprout className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Plants</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-teal-300 font-mono">{plantCount}</span>
              <span className="text-xs text-teal-400/80">flourishing</span>
            </div>
          </div>

          <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Adherence</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-300 font-mono">92%</span>
              <span className="text-xs text-emerald-400/80">30d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
