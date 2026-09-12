import { ReactNode } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TopNav } from "@/components/dashboard/TopNav"
import { BottomNav } from "@/components/dashboard/BottomNav"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopNav />
      <main className="flex-1 w-full max-w-6xl mx-auto pb-20 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
