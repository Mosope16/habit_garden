import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { HabitList } from '@/components/dashboard/HabitList'
import { GardenGrid } from '@/components/garden/GardenGrid'
import { Toaster } from '@/components/ui/toast'

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto">
      <GreetingCard />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <HabitList />
        </div>
        <div className="lg:col-span-5">
          <GardenGrid />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
