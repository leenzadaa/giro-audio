import { Link, useNavigate } from 'react-router-dom'
import { Heart, Eye, Zap, MapPin } from 'lucide-react'
import type { Project } from '@/types'
import { formatNumber, formatRMS } from '@/lib/utils'
import { useProjectLikes } from '@/hooks/useProjectLikes'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { likesCount, isLiked, toggling, toggleLike } = useProjectLikes(
    project.id,
    project.likes_count
  )
  const coverImage = project.images.find((img) => img.is_cover) || project.images[0]

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/entrar')
      return
    }

    toggleLike()
  }

  return (
    <Link
      to={`/projeto/${project.id}`}
      className={cn(
        "group relative bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-300",
        featured && "col-span-full md:col-span-2 lg:col-span-1"
      )}
    >
      {/* Image Container */}
      <div className={cn("relative overflow-hidden", featured ? "aspect-[16/9]" : "aspect-[4/3]")}>
        <img
          src={coverImage?.url || 'https://images.unsplash.com/photo-1489824904134-897ab2764a9c?w=800&h=500&fit=crop'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Sound Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-sm">
            {project.sound_type}
          </span>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-3 right-3 flex gap-3 text-white/90 text-xs font-medium">
          <button
            onClick={handleLikeClick}
            disabled={toggling}
            className={cn(
              "flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-sm transition-colors",
              isLiked ? "text-red-500" : "hover:text-red-400"
            )}
          >
            <Heart className={cn("w-3 h-3", isLiked && "fill-current")} />
            {formatNumber(likesCount)}
          </button>
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-sm">
            <Eye className="w-3 h-3" />
            {formatNumber(project.views_count)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors truncate">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {project.car_make} {project.car_model} • {project.car_year}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{project.city}, {project.state}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
            <Zap className="w-3.5 h-3.5 fill-current" />
            {formatRMS(project.rms_power)} RMS
          </div>
        </div>
      </div>
    </Link>
  )
}