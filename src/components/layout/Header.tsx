import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X, User, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Projetos', href: '/projetos' },
  { label: 'Anúncios', href: '/anuncios' },
  { label: 'Ranking', href: '/ranking' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/projetos?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-primary-foreground font-black text-lg leading-none">G</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground hidden sm:block">
            GIRO<span className="text-primary">AUDIO</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar projetos, carros, equipamentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/criar-projeto"
            className="hidden sm:flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Projeto</span>
          </Link>
          <Link
            to="/entrar"
            className="hidden sm:flex items-center gap-2 h-9 px-4 border border-border text-foreground text-sm font-medium rounded-sm hover:bg-secondary transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Entrar</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-sm transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-sm transition-colors border-b border-border/50 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/criar-projeto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 h-11 w-full bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Criar Projeto
              </Link>
              <Link
                to="/entrar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 h-11 w-full border border-border text-foreground font-medium rounded-sm hover:bg-secondary transition-colors"
              >
                <User className="w-4 h-4" />
                Entrar na Conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}