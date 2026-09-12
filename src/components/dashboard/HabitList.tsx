'use client'

import { useState } from 'react'
import { useHabits, useCompleteHabit, useSoftDeleteHabit } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { CreateHabitDialog } from './CreateHabitDialog'
import { EditHabitDialog } from './EditHabitDialog'
import { Progress } from '@/components/ui/progress'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
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

export function HabitList() {
  const { data: habits, isLoading } = useHabits()
  const { mutateAsync: completeHabit } = useCompleteHabit()
  const deleteHabit = useSoftDeleteHabit()
  const { toast } = useToast()

  const [editingHabit, setEditingHabit] = useState<{ id: string; name: string; xp_reward: number } | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<{ id: string; name: string } | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    )
  }

  const handleComplete = async (habitId: string, isCompleted: boolean) => {
    if (isCompleted) return

    try {
      await completeHabit(habitId)
      toast({
        title: 'Habit completed! 🎉',
        description: 'You earned XP and your garden is growing.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete habit.',
        variant: 'destructive',
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

  const completedCount = habits?.filter(h => h.is_completed_today).length || 0
  const totalCount = habits?.length || 0
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <div className="mb-8 p-6 rounded-2xl bg-card border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Today's Habits
        </h2>
        <CreateHabitDialog />
      </div>

      <div className="space-y-3 mb-8">
        {habits?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl border-border">
            No habits yet. Plant your first seed!
          </div>
        ) : (
          habits?.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${
                habit.is_completed_today
                  ? 'bg-primary/5 border-primary/20 opacity-75'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <Checkbox
                  id={habit.id}
                  checked={habit.is_completed_today}
                  disabled={habit.is_completed_today}
                  onCheckedChange={() => handleComplete(habit.id, habit.is_completed_today)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform active:scale-95 ${
                    habit.is_completed_today ? 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary' : 'border-muted-foreground/50'
                  }`}
                />
                <label
                  htmlFor={habit.id}
                  className={`font-medium cursor-pointer transition-colors flex-1 line-clamp-2 break-words ${
                    habit.is_completed_today ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}
                >
                  {habit.name}
                </label>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md hidden sm:block">
                  +{habit.xp_reward} XP
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingHabit(habit)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeletingHabit(habit)}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-muted-foreground">Today's progress</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-background border border-border" />
      </div>

      {editingHabit && (
        <EditHabitDialog 
          habit={editingHabit} 
          open={!!editingHabit} 
          onOpenChange={(open) => !open && setEditingHabit(null)} 
        />
      )}

      <AlertDialog open={!!deletingHabit} onOpenChange={(open) => !open && setDeletingHabit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this habit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your completion history will also be removed from future views. This action will archive the habit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteHabit.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
