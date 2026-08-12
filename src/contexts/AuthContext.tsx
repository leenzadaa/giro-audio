import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function initAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!cancelled && !error) {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch {
        // Supabase not configured or unreachable — app still renders without auth
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    initAuth()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) {
          setSession(session)
          setUser(session?.user ?? null)
        }
      })
      return () => {
        cancelled = true
        subscription.unsubscribe()
      }
    } catch {
      return () => { cancelled = true }
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error as Error | null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Erro ao fazer login') }
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      return { error: error as Error | null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Erro ao criar conta') }
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut()
    } catch {
      // Silent fail if Supabase is not configured
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}