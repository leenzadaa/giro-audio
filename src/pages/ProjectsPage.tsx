import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProjectCard } from '@/components/project/ProjectCard'
import { MOCK_PROJECTS, SOUND_TYPES, VEHICLE_TYPES } from '@/data/mock'
import { cn } from '@/lib/utils'

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const query = searchParams.get('q') || ''
  const typeFilter = searchParams.get('type') || ''
  const vehicleFilter = searchParams.get('vehicle') || ''
  const sort = searchParams.get('sort') || 'recent'

  const filteredProjects = useMemo(() => {
    let result = [...MOCK_PROJECTS]

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.car_model.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (typeFilter) {
      result = result.filter((p) => p.sound_type === typeFilter)
    }

    if (vehicleFilter) {
      result = result.filter((p) => p.vehicle_type === vehicleFilter)
    }

    switch (sort) {
      case 'likes':
        result.sort((a, b) => b.likes_count - a.likes_count)
        break
      case 'views':
        result.sort((a, b) => b.views_count - a.views_count)
        break
      case 'power':
        result.sort((a, b) => b.rms_power - a.rms_power)
        break
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
  }, [query, typeFilter, vehicleFilter, sort])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasActiveFilters = typeFilter || vehicleFilter || query

  return (
    <>
    <Helmet>
      <title>Explorar Projetos | GIRO AUDIO</title>
      <meta name="description" content="Explore projetos de som automotivo de todo o Brasil. Filtre por tipo de som, veículo e potência." />
      <meta property="og:title" content="Explorar Projetos | GIRO AUDIO" />
      <meta property="og:description" content="Descubra os melhores projetos de som automotivo do Brasil." />
      <meta property="og:type" content="website" />
    </Helmet>
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Explorar Projetos
        </h1>
        <p className="text-muted-foreground">
          Encontre os melhores projetos de som automotivo do Brasil
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <form className="relative w-full md:max-w-md" onSubmit={(e) => e.preventDefault()}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por carro, projeto, cidade..."
            defaultValue={query}
            onChange={(e) => updateParam('q', e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="h-10 px-3 bg-card border border-border rounded-sm text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary flex-1 md:flex-none"
          >
            <option value="recent">Mais Recentes</option>
            <option value="likes">Mais Curtidos</option>
            <option value="views">Mais Visualizados</option>
            <option value="power">Maior Potência</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-10 px-4 flex items-center gap-2 border rounded-sm text-sm font-medium transition-colors flex-1 md:flex-none justify-center",
              showFilters || hasActiveFilters
                ? "bg-primary/10 border-primary text-primary"
                : "bg-card border-border text-foreground hover:bg-secondary"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-sm p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">Filtrar Resultados</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Limpar Filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sound Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tipo de Som
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam('type', '')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors",
                    !typeFilter
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  Todos
                </button>
                {SOUND_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateParam('type', type)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors",
                      typeFilter === type
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Veículo
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam('vehicle', '')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors",
                    !vehicleFilter
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  Todos
                </button>
                {VEHICLE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateParam('vehicle', type)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium border rounded-sm transition-colors",
                      vehicleFilter === type
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Nenhum projeto encontrado</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tente ajustar seus filtros ou buscar por outros termos.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-sm hover:bg-primary/90 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
    </>
  )
}