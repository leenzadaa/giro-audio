import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, Bookmark, MapPin, Zap, Battery, Gauge, User, Eye, MessageSquare } from 'lucide-react'
import { MOCK_PROJECTS } from '@/data/mock'
import { formatRMS, formatNumber } from '@/lib/utils'
import { ProjectCard } from '@/components/project/ProjectCard'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const project = MOCK_PROJECTS.find((p) => p.id === id)

  // Initialize like count when project loads
  if (project && likeCount === 0 && !liked) {
    setLikeCount(project.likes_count)
  }

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setLiked(!liked)
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Projeto não encontrado</h1>
        <Link to="/projetos" className="text-primary hover:underline mt-4 inline-block">
          Voltar para projetos
        </Link>
      </div>
    )
  }

  const relatedProjects = MOCK_PROJECTS.filter(
    (p) => p.id !== project.id && (p.sound_type === project.sound_type || p.city === project.city)
  ).slice(0, 3)

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Image Gallery */}
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] bg-card overflow-hidden">
        <img
          src={project.images[0]?.url}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-sm">
                {project.sound_type}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">
                {project.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-white/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {project.profile?.full_name}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {project.city}, {project.state}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`h-11 px-6 font-bold text-sm uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 ${
                  liked
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Curtido' : 'Curtir'} ({formatNumber(likeCount)})
              </button>
              <button className="h-11 w-11 border border-white/20 bg-black/50 backdrop-blur text-white rounded-sm hover:bg-white/10 transition-colors flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="h-11 w-11 border border-white/20 bg-black/50 backdrop-blur text-white rounded-sm hover:bg-white/10 transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Potência RMS', value: formatRMS(project.rms_power), icon: Zap, color: 'text-primary' },
              { label: 'Baterias', value: `${project.battery_count}x`, icon: Battery, color: 'text-yellow-500' },
              { label: 'Alternador', value: `${project.alternator_amps}A`, icon: Gauge, color: 'text-blue-500' },
              { label: 'Visualizações', value: formatNumber(project.views_count), icon: Eye, color: 'text-green-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border p-4 rounded-sm space-y-1">
                <div className={`flex items-center gap-2 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-xl font-black text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground border-l-4 border-primary pl-4">Sobre o Projeto</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Veículo</span>
                <span className="font-bold text-foreground">{project.car_make} {project.car_model} {project.car_year}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Tipo</span>
                <span className="font-bold text-foreground">{project.vehicle_type}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Equipamentos</span>
                <span className="font-bold text-foreground">{project.equipment_count} itens</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Publicado em</span>
                <span className="font-bold text-foreground">{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </section>

          {/* Setup Details (Mocked for demo) */}
          <section className="bg-card border border-border rounded-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground border-l-4 border-primary pl-4">Setup Completo</h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-border/50">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Subwoofers</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modelo</span>
                    <span className="font-medium text-foreground">Eros E-15 3K RMS</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantidade</span>
                    <span className="font-medium text-foreground">2 unidades</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impedância</span>
                    <span className="font-medium text-foreground">2+2 ohms</span>
                  </li>
                </ul>
              </div>

              <div className="pb-4 border-b border-border/50">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Amplificadores</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modelo</span>
                    <span className="font-medium text-foreground">Taramps MD 5000</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantidade</span>
                    <span className="font-medium text-foreground">2 unidades</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Potência Total</span>
                    <span className="font-medium text-foreground">10.000W RMS</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Elétrica</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Baterias</span>
                    <span className="font-medium text-foreground">{project.battery_count}x Moura 220Ah</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Alternador</span>
                    <span className="font-medium text-foreground">{project.alternator_amps}A</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comments Placeholder */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Comentários (12)
            </h2>
            <div className="bg-card border border-border rounded-sm p-8 text-center space-y-3">
              <p className="text-muted-foreground">Faça login para comentar neste projeto.</p>
              <Link
                to="/entrar"
                className="inline-flex h-10 px-6 bg-secondary text-foreground font-medium text-sm rounded-sm hover:bg-secondary/80 transition-colors"
              >
                Entrar na Conta
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Owner Card */}
          <div className="bg-card border border-border rounded-sm p-6 space-y-4 sticky top-20">
            <div className="flex items-center gap-4">
              <img
                src={project.profile?.avatar_url}
                alt={project.profile?.full_name}
                className="w-16 h-16 rounded-sm object-cover border-2 border-border"
              />
              <div>
                <h3 className="font-bold text-foreground text-lg">{project.profile?.full_name}</h3>
                <p className="text-sm text-muted-foreground">@{project.profile?.username}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {project.profile?.city}, {project.profile?.state}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border text-center">
              <div>
                <p className="font-bold text-foreground">{project.profile?.projects_count}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Projetos</p>
              </div>
              <div>
                <p className="font-bold text-foreground">{formatNumber(project.profile?.likes_received || 0)}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Curtidas</p>
              </div>
              <div>
                <p className="font-bold text-foreground">{formatNumber(project.profile?.followers_count || 0)}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Seguidores</p>
              </div>
            </div>

            <Link
              to={`/perfil/${project.profile?.username}`}
              className="block w-full h-10 bg-secondary text-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-secondary/80 transition-colors text-center leading-10"
            >
              Ver Perfil Completo
            </Link>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground text-lg">Projetos Relacionados</h3>
              <div className="space-y-4">
                {relatedProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}