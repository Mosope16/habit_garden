'use client'

import { useProfile } from '@/lib/queries'
import { Flame, Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function GreetingCard() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8 p-6 rounded-2xl bg-card border shadow-sm">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-4 mt-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  if (!profile) return null

  // A basic greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mb-8 p-6 rounded-2xl bg-card border shadow-sm">
      <h1 className="text-2xl font-bold mb-1 text-foreground">
        {greeting}, {profile.display_name || profile.username || 'Friend'}
      </h1>
      <p className="text-muted-foreground mb-6 text-sm">Keep growing, one habit at a time.</p>
      
      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium">
        <div className="flex items-center gap-2 text-warning">
          <Flame className="w-4 h-4 fill-current" />
          <span>{profile.streak} day streak</span>
        </div>
        <div className="flex items-center gap-2 text-accent">
          <Star className="w-4 h-4 fill-current" />
          <span>{profile.xp} XP</span>
          <span className="text-muted-foreground ml-2">Level {profile.level}</span>
        </div>
      </div>
    </div>
  )
}
