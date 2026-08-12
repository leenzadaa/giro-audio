import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, ChevronRight, ChevronLeft, Check, Image as ImageIcon, Loader2 } from 'lucide-react'
import { SOUND_TYPES, VEHICLE_TYPES } from '@/data/mock'
import { cn } from '@/lib/utils'
import { useUploadImage } from '@/hooks/useUploadImage'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const STEPS = [
  { id: 1, title: 'Veículo' },
  { id: 2, title: 'Tipo de Som' },
  { id: 3, title: 'Potência e Elétrica' },
  { id: 4, title: 'Fotos' },
  { id: 5, title: 'Detalhes' },
]

export function CreateProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { uploadMultiple, uploading } = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    car_make: '',
    car_model: '',
    car_year: '',
    vehicle_type: '',
    sound_type: '',
    title: '',
    description: '',
    rms_power: '',
    battery_count: '',
    alternator_amps: '',
    city: '',
    state: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((f) => f.type.startsWith('image/'))
    const remaining = 10 - images.length
    const toAdd = validFiles.slice(0, remaining)

    setImages((prev) => [...prev, ...toAdd])
    toAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const imageUrls = images.length > 0
        ? await uploadMultiple(images, 'project-images')
        : []

      const { error } = await supabase.from('projects').insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        sound_type: formData.sound_type || null,
        vehicle_type: formData.vehicle_type || null,
        vehicle_model: `${formData.car_make} ${formData.car_model}`.trim(),
        vehicle_year: formData.car_year ? parseInt(formData.car_year) : null,
        rms_power: formData.rms_power ? parseFloat(formData.rms_power) : null,
        images: imageUrls,
      })

      if (error) {
        setSubmitError(error.message)
        setSubmitting(false)
        return
      }

      navigate('/projetos')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro desconhecido ao publicar projeto')
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Cadastrar Projeto</h1>
        <p className="text-muted-foreground">Mostre seu setup para a comunidade GIRO AUDIO</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between border-b border-border pb-6 overflow-x-auto">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-2 min-w-fit">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                currentStep >= step.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:block",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
            {idx < STEPS.length - 1 && (
              <div className="w-8 h-px bg-border mx-2 hidden sm:block" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 md:p-8 space-y-8">
        {submitError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-sm text-destructive text-sm font-medium">
            {submitError}
          </div>
        )}

        {/* Step 1: Vehicle Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-foreground">Informações do Veículo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Marca</label>
                <input
                  type="text"
                  placeholder="Ex: Volkswagen"
                  value={formData.car_make}
                  onChange={(e) => updateField('car_make', e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Modelo</label>
                <input
                  type="text"
                  placeholder="Ex: Gol G6"
                  value={formData.car_model}
                  onChange={(e) => updateField('car_model', e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ano</label>
                <input
                  type="number"
                  placeholder="2020"
                  value={formData.car_year}
                  onChange={(e) => updateField('car_year', e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tipo de Veículo</label>
                <select
                  value={formData.vehicle_type}
                  onChange={(e) => updateField('vehicle_type', e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="">Selecione...</option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cidade</label>
                <input
                  type="text"
                  placeholder="Ex: Brasília"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Estado</label>
                <input
                  type="text"
                  placeholder="Ex: DF"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value.toUpperCase())}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Sound Type */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-foreground">Qual o estilo do seu som?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SOUND_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('sound_type', type)}
                  className={cn(
                    "h-16 border rounded-sm font-bold text-sm uppercase tracking-wider transition-all",
                    formData.sound_type === type
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Equipment & Power */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-foreground">Potência e Elétrica</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Potência RMS Total</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.rms_power}
                    onChange={(e) => updateField('rms_power', e.target.value)}
                    className="w-full h-11 pl-4 pr-10 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">W</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Qtd. Baterias</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.battery_count}
                  onChange={(e) => updateField('battery_count', e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Alternador (Amperes)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.alternator_amps}
                    onChange={(e) => updateField('alternator_amps', e.target.value)}
                    className="w-full h-11 pl-4 pr-10 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">A</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Você poderá detalhar cada equipamento (marca/modelo) após publicar, na edição do projeto.
            </p>
          </div>
        )}

        {/* Step 4: Photos with Real Upload */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-foreground">Fotos do Projeto</h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-sm p-12 text-center space-y-4 hover:border-primary/50 hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Arraste fotos ou clique para enviar</p>
                <p className="text-sm text-muted-foreground mt-1">JPG, PNG até 5MB cada. Máximo 10 fotos.</p>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-sm overflow-hidden border border-border group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs font-medium">Adicionar</span>
                  </button>
                )}
              </div>
            )}

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando imagens...</span>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Details & Review */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-foreground">Título e Descrição</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome do Projeto</label>
                <input
                  type="text"
                  placeholder="Ex: Projeto Black Bass"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descrição</label>
                <textarea
                  placeholder="Conte a história do seu projeto, equipamentos usados, curiosidades..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full p-4 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  required
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-secondary/50 border border-border rounded-sm p-6 space-y-3 mt-6">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Resumo do Projeto</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Veículo:</span>
                <span className="font-medium text-foreground text-right">{formData.car_make} {formData.car_model} ({formData.car_year})</span>

                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium text-foreground text-right">{formData.sound_type || '-'}</span>

                <span className="text-muted-foreground">Local:</span>
                <span className="font-medium text-foreground text-right">{formData.city}/{formData.state}</span>

                <span className="text-muted-foreground">Potência:</span>
                <span className="font-medium text-primary text-right">{formData.rms_power ? `${formData.rms_power}W RMS` : '-'}</span>

                <span className="text-muted-foreground">Fotos:</span>
                <span className="font-medium text-foreground text-right">{images.length} foto{images.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              "h-11 px-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider rounded-sm transition-colors",
              currentStep === 1
                ? "opacity-0 pointer-events-none"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="h-11 px-8 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || uploading}
              className="h-11 px-8 bg-green-600 text-white text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Publicar Projeto
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}