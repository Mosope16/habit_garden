'use client'

import React, { useState } from 'react'
import { 
  Flame, 
  Star, 
  Check, 
  Plus, 
  Sprout, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
  Leaf
} from 'lucide-react'

// Stylized botanical SVG plants
const Seedling = () => (
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

const BloomingBonsai = () => (
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

interface Habit {
  id: string
  title: string
  category: string
  streak: number
  xp: number
  completed: boolean
  icon: string
}

export default function HabitGardenShowcase() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      title: 'Morning Meditation & Breathwork',
      category: 'Mind & Focus',
      streak: 35,
      xp: 50,
      completed: true,
      icon: '🧘'
    },
    {
      id: '2',
      title: '30-Minute Gym & Cardio Workout',
      category: 'Health & Fitness',
      streak: 21,
      xp: 100,
      completed: true,
      icon: '🏋️‍♂️'
    },
    {
      id: '3',
      title: 'Read 20 Pages (Systems Architecture)',
      category: 'Learning',
      streak: 14,
      xp: 60,
      completed: true,
      icon: '📚'
    },
    {
      id: '4',
      title: 'Drink 2.5 Liters of Water',
      category: 'Wellness',
      streak: 10,
      xp: 30,
      completed: true,
      icon: '💧'
    },
    {
      id: '5',
      title: 'Deep Work: Code Systems & Review PRs',
      category: 'Engineering',
      streak: 45,
      xp: 120,
      completed: false,
      icon: '💻'
    }
  ])

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, completed: !h.completed } : h))
    )
  }

  const completedCount = habits.filter(h => h.completed).length

  return (
    <div className="min-h-screen bg-[#06100c] text-[#f1f5f2] font-sans selection:bg-emerald-500/20">
      {/* Top Navigation */}
      <header className="border-b border-emerald-950/80 bg-[#06100c]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Leaf className="w-5 h-5 text-[#06100c] fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                  Habit Garden
                </span>
                <span className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-semibold -mt-1">
                  Consistency Engine
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-emerald-950/30 p-1 rounded-xl border border-emerald-900/40">
              {['Overview', 'Garden Plot', 'Analytics', 'Achievements'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-emerald-950/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center text-gray-400 hover:text-emerald-300 transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-emerald-950">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-200">Mosopefoluwa</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">Lvl 12 Bloom Master</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-bold text-[#06100c] shadow-md shadow-emerald-900/40">
                MA
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        
        {/* Hero Greeting & Stats Bar */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1c14] to-[#081510] border border-emerald-900/50 p-6 sm:p-8 overflow-hidden shadow-2xl shadow-black/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ✨ Daily Cycle Active
                </span>
                <span className="text-xs text-gray-400">· Reset in 7h 45m</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
                Good morning, Mosopefoluwa 🌱
              </h1>
              <p className="text-gray-400 text-sm max-w-xl">
                Your garden is flourishing today with <span className="text-emerald-300 font-medium">{completedCount} of {habits.length} habits completed</span>. Keep the streak alive!
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <Flame className="w-4 h-4 fill-amber-400/20" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Streak</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-300 font-mono">45</span>
                  <span className="text-xs text-amber-400/80">days</span>
                </div>
              </div>

              <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <Star className="w-4 h-4 fill-emerald-400/20" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">XP</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-300 font-mono">14,500</span>
                </div>
              </div>

              <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
                <div className="flex items-center gap-1.5 text-teal-400 mb-1">
                  <Sprout className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Plants</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-teal-300 font-mono">16</span>
                  <span className="text-xs text-teal-400/80">flourishing</span>
                </div>
              </div>

              <div className="bg-[#0e2219]/70 border border-emerald-900/50 rounded-2xl p-3.5 flex flex-col">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Adherence</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-300 font-mono">92%</span>
                  <span className="text-xs text-emerald-400/80">30d</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Habits List & Interactive Garden Plot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Habits List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Daily Habits</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-900 text-emerald-400">
                    {completedCount}/{habits.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-400">Tap to mark tasks as completed today</p>
              </div>

              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Habit</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    habit.completed
                      ? 'bg-[#0b1912]/80 border-emerald-900/40 hover:border-emerald-800/60'
                      : 'bg-[#0e241b] border-emerald-700/60 shadow-lg shadow-emerald-950/40 hover:border-emerald-600'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                        habit.completed
                          ? 'bg-emerald-500 text-[#06100c] shadow-md shadow-emerald-500/30'
                          : 'border-2 border-emerald-600/70 group-hover:border-emerald-400 bg-transparent'
                      }`}
                    >
                      {habit.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base">{habit.icon}</span>
                        <h3 className={`text-sm font-semibold truncate ${
                          habit.completed ? 'text-gray-300 line-through decoration-emerald-500/50' : 'text-white'
                        }`}>
                          {habit.title}
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

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/90 border border-emerald-900/80 px-2.5 py-1 rounded-lg">
                      +{habit.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Completion Progress Bar */}
            <div className="bg-[#0b1912] border border-emerald-900/40 rounded-2xl p-4 mt-2">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400 font-medium">Daily Target Progress</span>
                <span className="text-emerald-300 font-mono font-bold">{Math.round((completedCount / habits.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-950/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${(completedCount / habits.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Column: Virtual Garden Plot & Growth Canvas (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
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
                  Lvl 12 Plot
                </span>
              </div>

              {/* Garden Canvas Stage */}
              <div className="relative rounded-2xl bg-[#050e0a] border border-emerald-950/80 p-6 min-h-[260px] flex flex-col items-center justify-end overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Simulated Grid of Plants */}
                <div className="relative z-10 w-full grid grid-cols-4 gap-3 items-end justify-items-center mb-4">
                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <AncientTree />
                    <span className="text-[9px] text-gray-400 font-mono">Cedar #1</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <Flower />
                    <span className="text-[9px] text-gray-400 font-mono">Lotus #4</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <BloomingBonsai />
                    <span className="text-[9px] text-gray-400 font-mono">Bonsai #2</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <AncientTree />
                    <span className="text-[9px] text-gray-400 font-mono">Evergreen</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <Seedling />
                    <span className="text-[9px] text-gray-400 font-mono">Sprout #8</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <BloomingBonsai />
                    <span className="text-[9px] text-gray-400 font-mono">Bloom #3</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <Flower />
                    <span className="text-[9px] text-gray-400 font-mono">Flora #7</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
                    <Seedling />
                    <span className="text-[9px] text-gray-400 font-mono">Sprout #9</span>
                  </div>
                </div>

                {/* Ground Soil Layer */}
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-emerald-950 via-[#10291d] to-emerald-950 border-t border-emerald-800/40 shadow-inner"></div>
              </div>

              {/* XP Level Bar */}
              <div className="mt-4 pt-4 border-t border-emerald-950/80 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Level 12 Mastery</span>
                  <span className="text-emerald-400 font-mono font-semibold">14,500 / 15,000 XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-emerald-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-300 w-[96%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Next reward: Celestial Redwood (Lvl 15)</span>
                  <span className="text-emerald-400 font-medium">+500 XP to Level 13</span>
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
                  { day: 'Mon', score: 100, active: true },
                  { day: 'Tue', score: 100, active: true },
                  { day: 'Wed', score: 100, active: true },
                  { day: 'Thu', score: 100, active: true },
                  { day: 'Fri', score: 100, active: true },
                  { day: 'Sat', score: 100, active: true },
                  { day: 'Sun', score: 80, active: true },
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

        </div>

      </main>
    </div>
  )
}
