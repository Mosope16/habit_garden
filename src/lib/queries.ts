import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// -- Profile & Streak Hooks --

export function useProfile() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const [profileRes, streakRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.rpc('get_user_streak', { p_user_id: user.id }),
      ])

      if (profileRes.error) throw profileRes.error

      return {
        ...profileRes.data,
        streak: streakRes.data || 0,
      }
    },
  })
}

// -- Habits Hooks --

export function useHabits() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get habits
      const { data: habits, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Get today's completions
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const dateString = startOfDay.toISOString().split('T')[0]

      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completion_date', dateString)

      if (completionsError) throw completionsError

      const completedHabitIds = new Set(completions.map(c => c.habit_id))

      return habits.map(habit => ({
        ...habit,
        is_completed_today: completedHabitIds.has(habit.id),
      }))
    },
  })
}

export function useCreateHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (habitData: { name: string; xp_reward?: number }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            user_id: user.id,
            name: habitData.name,
            xp_reward: habitData.xp_reward || 10,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

export function useCompleteHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (habitId: string) => {
      const { data, error } = await supabase.rpc('complete_habit', {
        p_habit_id: habitId,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['garden'] })
    },
  })
}

// -- Garden Hooks --

export function useUpdateHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string, name?: string, xp_reward?: number, is_active?: boolean }) => {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

export function useSoftDeleteHabit() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (habitId: string) => {
      const { data, error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

// -- Garden Hooks --

export function useGarden() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['garden'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: garden, error: gardenError } = await supabase
        .from('garden')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (gardenError) throw gardenError

      const { data: plants, error: plantsError } = await supabase
        .from('garden_plants')
        .select('*')
        .eq('garden_id', garden.id)

      if (plantsError) throw plantsError

      return {
        ...garden,
        plants: plants || [],
      }
    },
  })
}

export function useHabitStatistics(startDate: string, endDate: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['habit_statistics', startDate, endDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.rpc('get_habit_statistics', {
        p_user_id: user.id,
        p_start_date: startDate,
        p_end_date: endDate,
      })

      if (error) throw error
      return data
    },
  })
}


export function useUpdateProfile() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string, display_name?: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

