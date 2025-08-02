'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

// Add validation for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

import type { SupabaseClient, Session } from '@supabase/supabase-js'

interface SupabaseContextType {
  supabase: SupabaseClient<any, 'public', any>;
  session: Session | null;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']}
        />
      </div>
    )
  }

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider')
  }
  return context
}