import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, Calendar, Heart, Users, Zap, Settings, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ProjectCard } from '@/components/project/ProjectCard'
import { EditProfileModal } from '@/components/EditProfileModal'
import { formatNumber } from '@/lib/utils'

interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  city: string | null
  state: string | null
  bio: string | null
  followers_count: number
  following_count: number
  projects_count: number
  likes_received: number
  last_username_change: string | null
  created_at: string
}

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)

  const isOwnProfile = user && profile && user.id === profile.id

  async function loadProfile() {
    setLoading(true)

    let query = supabase.from('profiles').select('*')

    if (username === 'me' && user) {
      query = query.eq('id', user.id)
    } else {
      query = query.eq('username', username)
    }

    const { data: profileData } = await query.maybeSingle()

    if (!profileData) {
      setLoading(false)
      return
    }

    setProfile(profileData as Profile)

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', profileData.id)
      .order('created_at', { ascending: false })

    setProjects(projectsData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProfile()
  }, [username, user])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">Perfil não encontrado</h2>
          <Link to="/" className="text-primary hover:text-primary/80 font-medium">Voltar ao início</Link>
        </div>
      </div>
    )
  }

  const memberSince = new Date(profile.created_at).getFullYear()

  return (
    <>
      <Helmet>
        <title>{profile.full_name} (@{profile.username}) | GIRO AUDIO</title>
        <meta name="description" content={profile.bio || `Perfil de ${profile.full_name} na comunidade GIRO AUDIO`} />
        <meta property="og:title" content={`${profile.full_name} | GIRO AUDIO`} />
        <meta property="og:description" content={profile.bio || `Perfil de ${profile.full_name} na comunidade GIRO AUDIO`} />
        <meta property="og:image" content={profile.avatar_url || undefined} />
        <meta property="og:type" content="profile" />
      </Helmet>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        currentProfile={{
          full_name: profile.full_name || '',
          username: profile.username || '',
          bio: profile.bio || '',
          city: profile.city || '',
          state: profile.state || '',
          last_username_change: profile.last_username_change,
        }}
        onSaved={loadProfile}
      />

      <div className="space-y-8 pb-12">
        {/* Profile Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative shrink-0">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop'}
                  alt={profile.full_name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-sm object-cover border-4 border-background shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-card text-white">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {profile.full_name}
                  </h1>
                  <span className="text-muted-foreground font-medium">@{profile.username}</span>
                </div>

                <p className="text-muted-foreground max-w-xl">{profile.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                  {(profile.city || profile.state) && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {[profile.city, profile.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Membro desde {memberSince}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {!isOwnProfile ? (
                  <button className="h-10 px-6 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors">
                    Seguir
                  </button>
                ) : (
                  <button
                    onClick={() => setEditOpen(true)}
                    className="h-10 px-6 border border-border text-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
              {[
                { label: 'Projetos', value: profile.projects_count, icon: Zap },
                { label: 'Curtidas', value: formatNumber(profile.likes_received), icon: Heart },
                { label: 'Seguidores', value: formatNumber(profile.followers_count), icon: Users },
                { label: 'Seguindo', value: formatNumber(profile.following_count), icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="text-center md:text-left space-y-1">
                  <p className="text-xl md:text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 space-y-6">
          <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
            {['Projetos', 'Anúncios', 'Curtidas'].map((tab, idx) => (
              <button
                key={tab}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  idx === 0
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Nenhum projeto ainda</h3>
              <p className="text-muted-foreground">Este usuário ainda não cadastrou projetos.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}