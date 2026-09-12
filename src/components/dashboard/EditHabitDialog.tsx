'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useUpdateHabit } from '@/lib/queries'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

interface EditHabitDialogProps {
  habit: { id: string; name: string; xp_reward: number }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
  const [name, setName] = useState(habit.name)
  const updateHabit = useUpdateHabit()
  const { toast } = useToast()

  const handleUpdate = () => {
    if (!name.trim()) return

    updateHabit.mutate(
      { id: habit.id, name: name.trim() },
      {
        onSuccess: () => {
          toast({
            title: 'Habit updated',
            description: 'Your habit has been saved.',
          })
          onOpenChange(false)
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="E.g., Read for 20 minutes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdate()
            }}
            autoFocus
          />
          <Button 
            onClick={handleUpdate} 
            disabled={!name.trim() || updateHabit.isPending || name === habit.name}
            className="w-full"
          >
            {updateHabit.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
