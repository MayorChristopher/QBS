"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: "user" | "admin"
}

interface UseAuthReturn {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user)

        if (user) {
          const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          setProfile(profileData)
        }
      } catch (error) {
        console.error("[QBS] Auth session error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(profileData)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return {
    user,
    profile,
    isLoading,
    signOut,
  }
}
