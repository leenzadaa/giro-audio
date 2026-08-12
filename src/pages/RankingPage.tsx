import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Flame, Zap, Camera, Sparkles, MapPin, Heart } from 'lucide-react'
import { MOCK_PROJECTS } from '@/data/mock'
import { formatRMS, formatNumber, cn } from '@/lib/utils'

const RANKING_CATEGORIES = [
  { id: 'likes', label: 'Mais Curtidos', icon: Heart, color: 'text-pink-500' },
  { id: 'popular', label: 'Mais Populares', icon: Flame, color: 'text-orange-500' },
  { id: 'power', label: 'Maior Potência', icon: Zap, color: 'text-yellow-400' },
  { id: 'best', label: 'Melhor Projeto', icon: Camera, color: 'text-blue-500' },
  { id: 'new', label: 'Novos Projetos', icon: Sparkles, color: 'text-green-500' },
] as const

type CategoryId = typeof RANKING_CATEGORIES[number]['id']

export function RankingPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('likes')

  const sortedProjects = [...MOCK_PROJECTS].sort((a, b) => {
    switch (activeCategory) {
      case 'likes':
        return b.likes_count - a.likes_count
      case 'popular':
        return b.views_count - a.views_count
      case 'power':
        return b.rms_power - a.rms_power
      case 'new':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return b.likes_count - a.likes_count
    }
  })

  const activeConfig = RANKING_CATEGORIES.find((c) => c.id === activeCategory)!

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
          Ranking GIRO AUDIO
        </h1>
        <p className="text-muted-foreground text-lg">
          Os melhores projetos de som automotivo do Brasil em um só lugar
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {RANKING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-sm text-sm font-bold uppercase tracking-wider border transition-all",
              activeCategory === cat.id
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <cat.icon className={cn("w-4 h-4", activeCategory === cat.id ? "" : cat.color)} />
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Podium (Top 3) */}
      {sortedProjects.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto pt-4">
          {/* 2nd Place */}
          <Link to={`/projeto/${sortedProjects[1].id}`} className="order-2 md:order-1 group">
            <div className="bg-card border border-border rounded-sm p-6 text-center space-y-3 hover:border-gray-400 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-400" />
              <div className="w-12 h-12 bg-gray-400/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-black text-gray-400">2º</span>
              </div>
              <img
                src={sortedProjects[1].images[0]?.url}
                alt={sortedProjects[1].title}
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-400"
              />
              <h3 className="font-bold text-foreground truncate">{sortedProjects[1].title}</h3>
              <p className="text-sm text-muted-foreground">{sortedProjects[1].car_model}</p>
              <p className="text-lg font-black text-primary">{formatRMS(sortedProjects[1].rms_power)}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Heart className="w-3 h-3" /> {formatNumber(sortedProjects[1].likes_count)} curtidas
              </p>
            </div>
          </Link>

          {/* 1st Place */}
          <Link to={`/projeto/${sortedProjects[0].id}`} className="order-1 md:order-2 group">
            <div className="bg-card border-2 border-yellow-500/50 rounded-sm p-8 text-center space-y-4 hover:border-yellow-500 transition-colors relative overflow-hidden shadow-xl shadow-yellow-500/10">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <img
                src={sortedProjects[0].images[0]?.url}
                alt={sortedProjects[0].title}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-yellow-500 shadow-lg"
              />
              <h3 className="font-black text-xl text-foreground truncate">{sortedProjects[0].title}</h3>
              <p className="text-muted-foreground">{sortedProjects[0].car_make} {sortedProjects[0].car_model}</p>
              <p className="text-2xl font-black text-primary">{formatRMS(sortedProjects[0].rms_power)}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatNumber(sortedProjects[0].likes_count)}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {sortedProjects[0].state}</span>
              </div>
            </div>
          </Link>

          {/* 3rd Place */}
          <Link to={`/projeto/${sortedProjects[2].id}`} className="order-3 group">
            <div className="bg-card border border-border rounded-sm p-6 text-center space-y-3 hover:border-orange-700 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-700" />
              <div className="w-12 h-12 bg-orange-700/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-black text-orange-700">3º</span>
              </div>
              <img
                src={sortedProjects[2].images[0]?.url}
                alt={sortedProjects[2].title}
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-orange-700"
              />
              <h3 className="font-bold text-foreground truncate">{sortedProjects[2].title}</h3>
              <p className="text-sm text-muted-foreground">{sortedProjects[2].car_model}</p>
              <p className="text-lg font-black text-primary">{formatRMS(sortedProjects[2].rms_power)}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Heart className="w-3 h-3" /> {formatNumber(sortedProjects[2].likes_count)} curtidas
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Full Ranking List */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pb-4 border-b border-border">
          <activeConfig.icon className={cn("w-5 h-5", activeConfig.color)} />
          Classificação Completa — {activeConfig.label}
        </h2>

        <div className="space-y-2">
          {sortedProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projeto/${project.id}`}
              className="flex items-center gap-4 bg-card border border-border rounded-sm p-4 hover:border-primary/50 transition-colors group"
            >
              <span className={cn(
                "w-8 text-center font-black text-lg shrink-0",
                index === 0 ? "text-yellow-500" :
                index === 1 ? "text-gray-400" :
                index === 2 ? "text-orange-700" :
                "text-muted-foreground"
              )}>
                {index + 1}º
              </span>

              <img
                src={project.images[0]?.url}
                alt={project.title}
                className="w-14 h-14 rounded-sm object-cover shrink-0 border border-border"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {project.car_make} {project.car_model} • {project.city}, {project.state}
                </p>
              </div>

              <div className="text-right shrink-0 hidden sm:block">
                <p className="font-black text-primary">{formatRMS(project.rms_power)}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Heart className="w-3 h-3" /> {formatNumber(project.likes_count)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}