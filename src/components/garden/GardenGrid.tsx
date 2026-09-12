'use client'

import { useGarden } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'

// Simple SVG components for the garden
const Seed = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary">
    <path d="M12 22C12 22 15 19 15 15C15 11 12 8 12 8C12 8 9 11 9 15C9 19 12 22 12 22Z" fill="currentColor" fillOpacity="0.5"/>
  </svg>
)

const Sprout = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary">
    <path d="M12 22V12M12 12C12 12 15 10 18 6C18 6 19 10 16 14C14 16 12 12 12 12ZM12 12C12 12 9 12 6 8C6 8 5 12 8 16C10 18 12 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Flower = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-accent">
    <path d="M12 22V14M12 14C12 14 15 12 18 10C19 9 20 6 18 5C16 4 14 6 12 8C10 6 8 4 6 5C4 6 5 9 6 10C9 12 12 14 12 14Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Tree = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary">
    <path d="M12 22V14M12 14C12 14 17 12 18 8C19 4 15 2 12 2C9 2 5 4 6 8C7 12 12 14 12 14Z" fill="currentColor" opacity="0.8"/>
  </svg>
)

const PlantStage = ({ stage }: { stage: string }) => {
  switch (stage) {
    case 'seed': return <Seed />
    case 'sprout': return <Sprout />
    case 'flower': return <Flower />
    case 'tree': return <Tree />
    case 'plant':
    default: return <Sprout />
  }
}

export function GardenGrid() {
  const { data: garden, isLoading } = useGarden()

  if (isLoading) {
    return <Skeleton className="w-full h-full min-h-[300px] rounded-2xl" />
  }

  if (!garden) return null

  // For MVP, if real plants table is empty, simulate garden growth based on level
  const plants = garden.plants.length > 0 ? garden.plants : generatePlantsForLevel(garden.level || 1)
  
  return (
    <div className="p-6 rounded-2xl bg-card border shadow-sm flex flex-col h-full min-h-[300px]">
      <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-6">
        Your Garden
      </h2>
      <div className="flex-1 rounded-xl bg-background border border-border/50 relative overflow-hidden flex items-end justify-center p-8 pb-4">
        <div className="flex flex-wrap gap-4 items-end justify-center w-full max-w-[400px]">
          {plants.map((plant: any, i: number) => (
            <div 
              key={plant.id || i} 
              className="flex items-end justify-center transition-all duration-700 animate-in fade-in zoom-in-50" 
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <PlantStage stage={plant.growth_stage} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function generatePlantsForLevel(level: number) {
  const generated = []
  const count = Math.min(level + 1, 16) // max 16 items for now
  
  for (let i = 0; i < count; i++) {
    let stage = 'seed'
    if (level >= 2 && i % 3 === 0) stage = 'sprout'
    if (level >= 3 && i % 4 === 1) stage = 'flower'
    if (level >= 5 && i % 5 === 2) stage = 'tree'
    generated.push({ id: `mock-${i}`, growth_stage: stage })
  }
  return generated
}
