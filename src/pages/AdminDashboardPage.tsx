import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FolderOpen, Flag, ShieldAlert, TrendingUp, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface AdminStats {
  totalUsers: number
  totalProjects: number
  totalListings: number
  newUsersToday: number
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminAndLoad() {
      if (!user) {
        navigate('/entrar')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.role !== 'admin') {
        navigate('/')
        return
      }

      setIsAdmin(true)

      const today = new Date().toISOString().split('T')[0]

      const [usersRes, projectsRes, listingsRes, newUsersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', today),
      ])

      setStats({
        totalUsers: usersRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalListings: listingsRes.count || 0,
        newUsersToday: newUsersRes.count || 0,
      })
      setLoading(false)
    }

    checkAdminAndLoad()
  }, [user, navigate])

  if (loading || !isAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const cards = [
    { label: 'Usuários Totais', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Projetos Publicados', value: stats.totalProjects, icon: FolderOpen, color: 'text-green-500' },
    { label: 'Anúncios Ativos', value: stats.totalListings, icon: TrendingUp, color: 'text-yellow-500' },
    { label: 'Novos Hoje', value: stats.newUsersToday, icon: ShieldAlert, color: 'text-red-500' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral da plataforma GIRO AUDIO</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-sm p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-black text-foreground">{card.value.toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-sm p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Flag className="w-4 h-4 text-destructive" />
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="h-11 px-4 border border-border rounded-sm text-sm font-medium text-foreground hover:bg-secondary transition-colors text-left">
            Gerenciar Usuários
          </button>
          <button className="h-11 px-4 border border-border rounded-sm text-sm font-medium text-foreground hover:bg-secondary transition-colors text-left">
            Moderar Projetos
          </button>
          <button className="h-11 px-4 border border-border rounded-sm text-sm font-medium text-foreground hover:bg-secondary transition-colors text-left">
            Ver Denúncias
          </button>
        </div>
      </div>
    </div>
  )
}