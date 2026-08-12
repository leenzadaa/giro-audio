import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Heart, Users, Zap, Settings } from 'lucide-react'
import { MOCK_PROFILES, MOCK_PROJECTS } from '@/data/mock'
import { ProjectCard } from '@/components/project/ProjectCard'
import { formatNumber } from '@/lib/utils'

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()

  // For demo, if username is 'me', show first profile
  const profile = username === 'me'
    ? MOCK_PROFILES[0]
    : MOCK_PROFILES.find((p) => p.username === username) || MOCK_PROFILES[0]

  const userProjects = MOCK_PROJECTS.filter((p) => p.user_id === profile.user_id)

  return (
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
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {profile.city}, {profile.state}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Membro desde 2024
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button className="h-10 px-6 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors">
                Seguir
              </button>
              <button className="h-10 w-10 border border-border text-foreground rounded-sm hover:bg-secondary transition-colors flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </button>
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
          {['Projetos', 'Anúncios', 'Equipamentos', 'Curtidas'].map((tab, idx) => (
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
        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {userProjects.map((project) => (
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
  )
}