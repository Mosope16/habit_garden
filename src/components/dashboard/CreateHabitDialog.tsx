'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateHabit } from '@/lib/queries'
import { useToast } from '@/hooks/use-toast'

export function CreateHabitDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const { mutateAsync: createHabit, isPending } = useCreateHabit()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createHabit({ name: name.trim() })
      toast({
        title: 'Habit created',
        description: `Successfully added "${name.trim()}" to your garden.`,
      })
      setOpen(false)
      setName('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create habit. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-primary border-primary/20 hover:bg-primary/10">
        <Plus className="w-4 h-4" />
        Add Habit
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Plant a new habit</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              What do you want to do every day to grow your garden?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              placeholder="e.g. Read for 30 minutes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
              disabled={isPending}
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending || !name.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isPending ? 'Planting...' : 'Plant Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
