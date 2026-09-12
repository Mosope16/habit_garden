import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { HabitList } from '@/components/dashboard/HabitList'
import { GardenGrid } from '@/components/garden/GardenGrid'
import { Toaster } from '@/components/ui/toast'

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <GreetingCard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HabitList />
        <GardenGrid />
      </div>
      <Toaster />
    </div>
  )
}
