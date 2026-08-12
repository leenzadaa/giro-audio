import { useState, useEffect } from 'react'
import { X, Save, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile: {
    full_name: string
    username: string
    bio: string
    city: string
    state: string
    last_username_change?: string | null
  }
  onSaved: () => void
}

export function EditProfileModal({ isOpen, onClose, currentProfile, onSaved }: EditProfileModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    city: '',
    state: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usernameCooldownDays, setUsernameCooldownDays] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: currentProfile.full_name || '',
        username: currentProfile.username || '',
        bio: currentProfile.bio || '',
        city: currentProfile.city || '',
        state: currentProfile.state || '',
      })
      setError(null)

      if (currentProfile.last_username_change) {
        const lastChange = new Date(currentProfile.last_username_change)
        const now = new Date()
        const diffMs = now.getTime() - lastChange.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const remaining = Math.max(0, 7 - diffDays)
        setUsernameCooldownDays(remaining)
      } else {
        setUsernameCooldownDays(0)
      }
    }
  }, [isOpen, currentProfile])

  if (!isOpen || !user) return null

  const canChangeUsername = usernameCooldownDays === 0

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError(null)

    try {
      const updateData: Record<string, unknown> = {
        full_name: formData.full_name,
        bio: formData.bio,
        city: formData.city,
        state: formData.state.toUpperCase(),
      }

      if (formData.username !== currentProfile.username) {
        if (!canChangeUsername) {
          setError(`Você só pode alterar o @ novamente em ${usernameCooldownDays} dia${usernameCooldownDays !== 1 ? 's' : ''}.`)
          setSaving(false)
          return
        }
        updateData.username = formData.username
        updateData.last_username_change = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) {
        if (updateError.message.includes('duplicate key') || updateError.message.includes('unique')) {
          setError('Este @ já está em uso por outro usuário.')
        } else {
          setError(updateError.message)
        }
        setSaving(false)
        return
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-sm p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-foreground tracking-tight">Editar Perfil</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome Completo</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              @ Username
              {!canChangeUsername && (
                <span className="ml-2 text-xs text-yellow-500 font-normal">
                  (alterável em {usernameCooldownDays} dia{usernameCooldownDays !== 1 ? 's' : ''})
                </span>
              )}
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
              disabled={!canChangeUsername}
              className={`w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary lowercase ${!canChangeUsername ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="seuuser"
            />
            {!canChangeUsername && (
              <p className="text-xs text-muted-foreground">O @ só pode ser alterado a cada 7 dias.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full p-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Conte um pouco sobre você..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cidade</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: Brasília"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estado</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value.toUpperCase() }))}
                maxLength={2}
                className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                placeholder="DF"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-border text-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-11 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}