import { GardenGrid } from '@/components/garden/GardenGrid'

export default function GardenPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto h-full min-h-[80vh] flex flex-col">
      <div className="flex-1">
        <GardenGrid />
      </div>
    </div>
  )
}
