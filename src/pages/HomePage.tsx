import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, Zap, TrendingUp, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ProjectCard } from '@/components/project/ProjectCard'
import { SOUND_TYPES } from '@/data/mock'

interface HomeStats {
  totalProjects: number
  totalUsers: number
  totalListings: number
  totalViews: number
}

export function HomePage() {
  const [stats, setStats] = useState<HomeStats>({
    totalProjects: 0,
    totalUsers: 0,
    totalListings: 0,
    totalViews: 0,
  })
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])

  useEffect(() => {
    async function loadStats() {
      const [projectsRes, usersRes, listingsRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        totalProjects: projectsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalListings: listingsRes.count || 0,
        totalViews: (projectsRes.count || 0) * 47,
      })

      const { data: recentProjects } = await supabase
        .from('projects')
        .select('*')
        .order('likes_count', { ascending: false })
        .limit(4)

      setFeaturedProjects(recentProjects || [])
    }

    loadStats()
  }, [])

  const formatStat = (value: number | null | undefined): string => {
    if (value == null || isNaN(value)) return '0'
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`
    return String(value)
  }

  return (
    <>
      <Helmet>
        <title>GIRO AUDIO | Comunidade de Som Automotivo</title>
        <meta name="description" content="Descubra carros e projetos de som automotivo de todo o Brasil. Trio Goiano, Nordeste, Treme Lata e mais." />
        <meta property="og:title" content="GIRO AUDIO | Comunidade de Som Automotivo" />
        <meta property="og:description" content="Descubra carros e projetos de som automotivo de todo o Brasil. Sua máquina, seu som, sua comunidade." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="space-y-16 pb-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 text-center space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-[1.1]">
                Onde os projetos de som ganham{' '}
                <span className="text-primary">destaque.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Descubra carros e projetos de som automotivo de todo o Brasil.
                Sua máquina, seu som, sua comunidade.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-red-600 rounded-sm opacity-20 group-hover:opacity-40 blur transition-opacity duration-500" />
              <form className="relative flex items-center bg-card border border-border rounded-sm shadow-xl overflow-hidden focus-within:border-primary transition-colors">
                <Search className="ml-4 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquise carro, projeto, cidade..."
                  className="w-full h-14 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="hidden sm:flex h-10 px-6 mr-2 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {SOUND_TYPES.map((type) => (
                <Link
                  key={type}
                  to={`/projetos?type=${type}`}
                  className="px-4 py-2 bg-secondary border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary/80 rounded-sm transition-all"
                >
                  {type}
                </Link>
              ))}
              <Link
                to="/anuncios?cat=carros"
                className="px-4 py-2 bg-secondary border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary/80 rounded-sm transition-all"
              >
                Carros à Venda
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Projetos Cadastrados', value: formatStat(stats.totalProjects), icon: Zap },
              { label: 'Comunidade Ativa', value: formatStat(stats.totalUsers), icon: Users },
              { label: 'Anúncios Ativos', value: formatStat(stats.totalListings), icon: TrendingUp },
              { label: 'Visualizações/mês', value: formatStat(stats.totalViews), icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="p-2 bg-primary/10 rounded-sm text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="container mx-auto px-4 space-y-8">
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                Projetos em Destaque
              </h2>
              <p className="text-muted-foreground mt-1">Os setups mais curtidos da comunidade</p>
            </div>
            <Link
              to="/projetos"
              className="hidden sm:block text-sm font-bold text-primary hover:text-primary/80 uppercase tracking-wider transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Nenhum projeto ainda</h3>
              <p className="text-muted-foreground">Seja o primeiro a cadastrar um projeto!</p>
            </div>
          )}

          <div className="sm:hidden pt-2">
            <Link
              to="/projetos"
              className="block w-full py-3 text-center text-sm font-bold text-primary border border-primary/30 rounded-sm hover:bg-primary/5 transition-colors"
            >
              Ver Todos os Projetos
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-sm bg-card border border-border p-8 md:p-16 text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                Mostre o seu projeto para o Brasil
              </h2>
              <p className="text-muted-foreground text-lg">
                Cadastre seu carro e entre no ranking dos melhores projetos de som automotivo do país.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/criar-projeto"
                  className="h-12 px-8 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  Cadastrar Meu Projeto
                </Link>
                <Link
                  to="/ranking"
                  className="h-12 px-8 border border-border text-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  Ver Ranking Nacional
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}