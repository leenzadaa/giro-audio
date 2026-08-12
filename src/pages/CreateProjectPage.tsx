import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { SOUND_TYPES, VEHICLE_TYPES } from '@/data/mock'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Veículo' },
  { id: 2, title: 'Tipo de Som' },
  { id: 3, title: 'Equipamentos' },
  { id: 4, title: 'Fotos' },
  { id: 5, title: 'Detalhes' },
]

export function CreateProjectPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to Supabase
    alert('Projeto cadastrado com sucesso! (Demo)')
    navigate('/projetos')
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

        {/* Step 4: Photos Placeholder */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-foreground">Fotos do Projeto</h2>
            <div className="border-2 border-dashed border-border rounded-sm p-12 text-center space-y-4 hover:border-primary/50 hover:bg-secondary/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Arraste fotos ou clique para enviar</p>
                <p className="text-sm text-muted-foreground mt-1">JPG, PNG até 5MB cada. Máximo 10 fotos.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              (Upload simulado nesta versão demo)
            </p>
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
              className="h-11 px-8 bg-green-600 text-white text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Publicar Projeto
            </button>
          )}
        </div>
      </form>
    </div>
  )
}