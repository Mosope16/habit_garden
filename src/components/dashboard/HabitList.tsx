'use client'

import { useState } from 'react'
import { useHabits, useCompleteHabit, useSoftDeleteHabit } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { CreateHabitDialog } from './CreateHabitDialog'
import { EditHabitDialog } from './EditHabitDialog'
import { Check, Flame, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const defaultHabits = [
  {
    id: 'mock-1',
    name: 'Morning Meditation & Breathwork',
    category: 'Mind & Focus',
    streak: 35,
    xp_reward: 50,
    is_completed_today: true,
    icon: '🧘'
  },
  {
    id: 'mock-2',
    name: '30-Minute Gym & Cardio Workout',
    category: 'Health & Fitness',
    streak: 21,
    xp_reward: 100,
    is_completed_today: true,
    icon: '🏋️‍♂️'
  },
  {
    id: 'mock-3',
    name: 'Read 20 Pages (Systems Architecture)',
    category: 'Learning',
    streak: 14,
    xp_reward: 60,
    is_completed_today: true,
    icon: '📚'
  },
  {
    id: 'mock-4',
    name: 'Drink 2.5 Liters of Water',
    category: 'Wellness',
    streak: 10,
    xp_reward: 30,
    is_completed_today: true,
    icon: '💧'
  },
  {
    id: 'mock-5',
    name: 'Deep Work: Code Systems & Review PRs',
    category: 'Engineering',
    streak: 45,
    xp_reward: 120,
    is_completed_today: false,
    icon: '💻'
  }
]

export function HabitList() {
  const { data: dbHabits, isLoading } = useHabits()
  const { mutateAsync: completeHabit } = useCompleteHabit()
  const deleteHabit = useSoftDeleteHabit()
  const { toast } = useToast()

  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({})
  const [editingHabit, setEditingHabit] = useState<{ id: string; name: string; xp_reward: number } | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<{ id: string; name: string } | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <Skeleton className="h-6 w-32 bg-emerald-950/60" />
        <Skeleton className="h-20 w-full rounded-2xl bg-emerald-950/60" />
        <Skeleton className="h-20 w-full rounded-2xl bg-emerald-950/60" />
        <Skeleton className="h-20 w-full rounded-2xl bg-emerald-950/60" />
      </div>
    )
  }

  // Use DB habits if present, otherwise showcase defaults
  const habits = (dbHabits && dbHabits.length > 0)
    ? dbHabits.map((h: any, i: number) => ({
        id: h.id,
        name: h.name,
        category: h.category || (i % 2 === 0 ? 'Mind & Body' : 'Engineering'),
        streak: h.streak || (10 + i * 5),
        xp_reward: h.xp_reward || 50,
        is_completed_today: localCompleted[h.id] !== undefined ? localCompleted[h.id] : h.is_completed_today,
        icon: h.icon || ['🌱', '🧘', '💻', '📚', '⚡'][i % 5],
        isDb: true
      }))
    : defaultHabits.map(h => ({
        ...h,
        is_completed_today: localCompleted[h.id] !== undefined ? localCompleted[h.id] : h.is_completed_today,
        isDb: false
      }))

  const handleToggle = async (habit: any) => {
    const nextState = !habit.is_completed_today
    setLocalCompleted(prev => ({ ...prev, [habit.id]: nextState }))

    if (habit.isDb && nextState) {
      try {
        await completeHabit(habit.id)
        toast({
          title: 'Habit completed! 🎉',
          description: `You earned +${habit.xp_reward} XP and your garden is growing.`,
        })
      } catch (err: any) {
        toast({
          title: 'Updated locally',
          description: err.message || 'Saved state.',
        })
      }
    } else {
      toast({
        title: nextState ? 'Habit completed! 🎉' : 'Habit unmarked',
        description: nextState ? `+${habit.xp_reward} XP earned.` : 'Keep at it!',
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deletingHabit) return
    deleteHabit.mutate(deletingHabit.id, {
      onSuccess: () => {
        toast({
          title: 'Habit deleted',
          description: 'The habit has been archived.',
        })
        setDeletingHabit(null)
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
        setDeletingHabit(null)
      }
    })
  }

  const completedCount = habits.filter(h => h.is_completed_today).length
  const totalCount = habits.length
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Daily Habits</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-900 text-emerald-400">
              {completedCount}/{totalCount}
            </span>
          </h2>
          <p className="text-xs text-gray-400">Tap to mark tasks as completed today</p>
        </div>

        <CreateHabitDialog />
      </div>

      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => handleToggle(habit)}
            className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              habit.is_completed_today
                ? 'bg-[#0b1912]/80 border-emerald-900/40 hover:border-emerald-800/60'
                : 'bg-[#0e241b] border-emerald-700/60 shadow-lg shadow-emerald-950/40 hover:border-emerald-600'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  habit.is_completed_today
                    ? 'bg-emerald-500 text-[#06100c] shadow-md shadow-emerald-500/30'
                    : 'border-2 border-emerald-600/70 group-hover:border-emerald-400 bg-transparent'
                }`}
              >
                {habit.is_completed_today && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base">{habit.icon}</span>
                  <h3 className={`text-sm font-semibold truncate ${
                    habit.is_completed_today ? 'text-gray-300 line-through decoration-emerald-500/50' : 'text-white'
                  }`}>
                    {habit.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-900/50 text-emerald-400/90 font-medium">
                    {habit.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400/90 font-mono">
                    <Flame className="w-3 h-3 fill-amber-400/20" />
                    {habit.streak}d streak
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/90 border border-emerald-900/80 px-2.5 py-1 rounded-lg">
                +{habit.xp_reward} XP
              </span>

              {habit.isDb && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingHabit({ id: habit.id, name: habit.name, xp_reward: habit.xp_reward })}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeletingHabit({ id: habit.id, name: habit.name })}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Progress Bar */}
      <div className="bg-[#0b1912] border border-emerald-900/40 rounded-2xl p-4 mt-1">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-400 font-medium">Daily Target Progress</span>
          <span className="text-emerald-300 font-mono font-bold">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-emerald-950/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {editingHabit && (
        <EditHabitDialog
          habit={editingHabit}
          open={!!editingHabit}
          onOpenChange={(open) => !open && setEditingHabit(null)}
        />
      )}

      {deletingHabit && (
        <AlertDialog open={!!deletingHabit} onOpenChange={(open) => !open && setDeletingHabit(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will archive "{deletingHabit.name}". You will lose this habit's active streak.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
