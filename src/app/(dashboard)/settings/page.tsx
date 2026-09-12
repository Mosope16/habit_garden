'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile, useUpdateProfile } from '@/lib/queries'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [displayName, setDisplayName] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name)
    }
  }, [profile])

  const handleUpdateProfile = () => {
    if (!profile) return
    if (!displayName.trim() || displayName.trim() === profile.display_name) return

    updateProfile.mutate(
      { id: profile.id, display_name: displayName.trim() },
      {
        onSuccess: () => {
          toast({
            title: 'Profile updated',
            description: 'Your display name has been saved.',
          })
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

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      })
      setIsSigningOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse max-w-xl mx-auto">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8 space-y-8">
      <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-6">
            Profile Settings
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <Button
              onClick={handleUpdateProfile}
              disabled={!displayName.trim() || displayName.trim() === profile?.display_name || updateProfile.isPending}
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-6">
            Account Actions
          </h2>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full sm:w-auto"
          >
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </div>
  )
}
