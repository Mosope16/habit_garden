'use client'

import { useGarden, useProfile } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Sprout } from 'lucide-react'

// Stylized botanical SVG plants
const Seed = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-emerald-400">
    <path d="M12 22V13M12 13C12 13 14 11 17 8C17 8 18 11 15 14C13.5 15.5 12 13 12 13ZM12 13C12 13 10 13 7 10C7 10 6 13 9 16C10.5 17.5 12 13 12 13Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Flower = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-amber-300">
    <path d="M12 22V14M12 14C12 14 15 12 17.5 10.5C18.5 9.5 19 7.5 17.5 6.5C16 5.5 14 7 12 9C10 7 8 5.5 6.5 6.5C5 7.5 5.5 9.5 6.5 10.5C9 12 12 14 12 14Z" fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="2.5" fill="#f59e0b" />
  </svg>
)

const Bonsai = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-11 h-11 text-emerald-300">
    <path d="M12 22V15M12 15C12 15 17 13 18.5 9.5C19.5 6.5 16 4 13 6.5C11.5 7.8 12 15 12 15ZM12 15C12 15 7 13 5.5 9.5C4.5 6.5 8 4 11 6.5C12.5 7.8 12 15 12 15Z" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="15.5" cy="8" r="1.5" fill="#fcd34d" />
    <circle cx="8.5" cy="8" r="1.5" fill="#fcd34d" />
  </svg>
)

const AncientTree = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-teal-300">
    <path d="M12 22V14M12 14C12 14 18 12 19 7.5C19.5 4 15 2 12 4.5C9 2 4.5 4 5 7.5C6 12 12 14 12 14Z" fill="currentColor" fillOpacity="0.9" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="7" r="2" fill="#86efac" />
    <circle cx="9" cy="9" r="1.5" fill="#fef08a" />
    <circle cx="15" cy="9" r="1.5" fill="#fef08a" />
  </svg>
)

const PlantStage = ({ stage }: { stage: string }) => {
  switch (stage) {
    case 'seed':
    case 'sprout': return <Seed />
    case 'flower': return <Flower />
    case 'bonsai': return <Bonsai />
    case 'tree': return <AncientTree />
    default: return <Seed />
  }
}

export function GardenGrid() {
  const { data: garden, isLoading } = useGarden()
  const { data: profile } = useProfile()

  if (isLoading) {
    return <Skeleton className="w-full h-full min-h-[340px] rounded-3xl bg-emerald-950/60" />
  }

  const level = garden?.level || profile?.level || 12
  const xp = profile?.xp || 14500
  const maxXP = 15000

  // Display rich plants matching preview
  const plants = [
    { name: 'Cedar #1', stage: 'tree' },
    { name: 'Lotus #4', stage: 'flower' },
    { name: 'Bonsai #2', stage: 'bonsai' },
    { name: 'Evergreen', stage: 'tree' },
    { name: 'Sprout #8', stage: 'sprout' },
    { name: 'Bloom #3', stage: 'bonsai' },
    { name: 'Flora #7', stage: 'flower' },
    { name: 'Sprout #9', stage: 'sprout' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* The Garden Plot Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0c1d15] to-[#081510] border border-emerald-900/60 p-6 flex flex-col shadow-xl shadow-black/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Virtual Garden Plot</h3>
              <p className="text-[11px] text-gray-400">Biome: Highland Sanctuary</p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
            Lvl {level} Plot
          </span>
        </div>

        {/* Garden Canvas Stage */}
        <div className="relative rounded-2xl bg-[#050e0a] border border-emerald-950/80 p-6 min-h-[250px] flex flex-col items-center justify-end overflow-hidden">
          {/* Ambient lighting */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Grid of plants */}
          <div className="relative z-10 w-full grid grid-cols-4 gap-3 items-end justify-items-center mb-4">
            {plants.map((plant, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1"
              >
                <PlantStage stage={plant.stage} />
                <span className="text-[9px] text-gray-400 font-mono">{plant.name}</span>
              </div>
            ))}
          </div>

          {/* Ground soil layer */}
          <div className="w-full h-3 rounded-full bg-gradient-to-r from-emerald-950 via-[#10291d] to-emerald-950 border-t border-emerald-800/40 shadow-inner"></div>
        </div>

        {/* XP Level Bar */}
        <div className="mt-4 pt-4 border-t border-emerald-950/80 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Level {level} Mastery</span>
            <span className="text-emerald-400 font-mono font-semibold">{xp.toLocaleString()} / {maxXP.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-emerald-950 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-300 w-[96%] rounded-full"></div>
          </div>
          <p className="text-[11px] text-gray-400 flex items-center justify-between">
            <span>Next reward: Celestial Redwood (Lvl 15)</span>
            <span className="text-emerald-400 font-medium">+500 XP to Level {level + 1}</span>
          </p>
        </div>
      </div>

      {/* 7-Day Consistency Radar */}
      <div className="rounded-3xl bg-[#0c1d15] border border-emerald-900/50 p-5 flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Weekly Consistency</h4>
          <span className="text-xs font-mono font-semibold text-emerald-400">100% On Schedule</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-1">
          {[
            { day: 'Mon', score: 100 },
            { day: 'Tue', score: 100 },
            { day: 'Wed', score: 100 },
            { day: 'Thu', score: 100 },
            { day: 'Fri', score: 100 },
            { day: 'Sat', score: 100 },
            { day: 'Sun', score: 80 },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-full h-16 rounded-xl bg-emerald-950/80 border border-emerald-900/40 p-1 flex items-end">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-emerald-600 to-teal-400"
                  style={{ height: `${item.score}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-gray-400 font-medium">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
