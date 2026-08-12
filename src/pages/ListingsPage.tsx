import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, X, MapPin, Tag, Heart } from 'lucide-react'
import { MOCK_LISTINGS } from '@/data/mock'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Todos', 'Carros com Som', 'Kits', 'Subwoofers', 'Módulos', 'Baterias', 'Peças']

export function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('cat') || ''
  const sort = searchParams.get('sort') || 'recent'

  const filteredListings = useMemo(() => {
    let result = [...MOCK_LISTINGS]

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      )
    }

    if (category && category !== 'Todos') {
      result = result.filter((l) => l.category === category)
    }

    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
  }, [query, category, sort])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Marketplace
        </h1>
        <p className="text-muted-foreground">
          Compre e venda carros com som, equipamentos e peças automotivas
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <form className="relative w-full md:max-w-md" onSubmit={(e) => e.preventDefault()}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar anúncios..."
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
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-10 px-4 flex items-center gap-2 border rounded-sm text-sm font-medium transition-colors flex-1 md:flex-none justify-center",
              showFilters
                ? "bg-primary/10 border-primary text-primary"
                : "bg-card border-border text-foreground hover:bg-secondary"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParam('cat', cat === 'Todos' ? '' : cat)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider border rounded-sm transition-colors",
              (cat === 'Todos' && !category) || category === cat
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/anuncio/${listing.id}`}
              className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={listing.images[0]?.url}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {listing.is_sponsored && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-wider rounded-sm">
                    Destaque
                  </span>
                )}
                <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur text-white rounded-full hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{listing.category}</p>
                  <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {listing.title}
                  </h3>
                </div>

                <p className="text-xl font-black text-primary">{formatPrice(listing.price)}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.city}, {listing.state}
                  </span>
                  <span>{new Date(listing.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
            <Tag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Nenhum anúncio encontrado</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tente ajustar seus filtros ou buscar por outros termos.
          </p>
        </div>
      )}
    </div>
  )
}