import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, SlidersHorizontal, MapPin, Tag, Heart, Phone, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Todos', 'Carros com Som', 'Kits', 'Subwoofers', 'Módulos', 'Baterias', 'Peças']

interface Listing {
  id: string
  user_id: string
  title: string
  description: string | null
  price: number | null
  category: string | null
  condition: string | null
  images: string[]
  is_active: boolean
  contact_info: string | null
  created_at: string
}

export function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('cat') || ''
  const sort = searchParams.get('sort') || 'recent'

  useEffect(() => {
    async function loadListings() {
      setLoading(true)
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setListings((data as Listing[]) || [])
      setLoading(false)
    }
    loadListings()
  }, [])

  const filteredListings = useMemo(() => {
    let result = [...listings]

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.description || '').toLowerCase().includes(q)
      )
    }

    if (category && category !== 'Todos') {
      result = result.filter((l) => l.category === category)
    }

    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
  }, [listings, query, category, sort])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  const formatPrice = (value: number | null) => {
    if (value == null) return 'Sob consulta'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Marketplace | GIRO AUDIO</title>
        <meta name="description" content="Compre e venda carros com som e peças automotivas. Encontre os melhores negócios da comunidade." />
        <meta property="og:title" content="Marketplace | GIRO AUDIO" />
        <meta property="og:description" content="Compre e venda carros com som e peças automotivas no maior marketplace de som automotivo do Brasil." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Marketplace
          </h1>
          <p className="text-muted-foreground">
            Compre e venda carros com som e peças automotivas
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
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1489824904134-897ab2764a9c?w=600&h=400&fit=crop'}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
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

                  {listing.contact_info && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-2 rounded-sm">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span className="truncate">{listing.contact_info}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Anúncio ativo
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
    </>
  )
}