import { useState } from 'react'
import { Calculator, Zap, Battery, Cable, Volume2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const CALCULATOR_TABS = [
  { id: 'impedance', label: 'Impedância', icon: Zap },
  { id: 'power', label: 'Potência RMS', icon: Volume2 },
  { id: 'battery', label: 'Banco de Baterias', icon: Battery },
  { id: 'cable', label: 'Cabo / Disjuntor', icon: Cable },
] as const

type TabId = typeof CALCULATOR_TABS[number]['id']

export function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('impedance')

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Calculadoras Automotivas
        </h1>
        <p className="text-muted-foreground text-lg">
          Ferramentas essenciais para montar seu sistema de som automotivo
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {CALCULATOR_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-sm text-sm font-bold uppercase tracking-wider border transition-all",
              activeTab === tab.id
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calculator Content */}
      <div className="bg-card border border-border rounded-sm p-6 md:p-8 min-h-[400px]">
        {activeTab === 'impedance' && <ImpedanceCalculator />}
        {activeTab === 'power' && <PowerCalculator />}
        {activeTab === 'battery' && <BatteryCalculator />}
        {activeTab === 'cable' && <CableCalculator />}
      </div>
    </div>
  )
}

/* ─── Impedance Calculator ─── */
function ImpedanceCalculator() {
  const [quantity, setQuantity] = useState(2)
  const [coilImpedance, setCoilImpedance] = useState(4)
  const [coilsPerSub, setCoilsPerSub] = useState(2)
  const [wiring, setWiring] = useState<'series' | 'parallel' | 'series-parallel'>('parallel')

  const calculateImpedance = () => {
    if (wiring === 'series') {
      return quantity * coilsPerSub * coilImpedance
    } else if (wiring === 'parallel') {
      const totalCoils = quantity * coilsPerSub
      return coilImpedance / totalCoils
    } else {
      // Series-parallel: coils in series per sub, subs in parallel
      const impedancePerSub = coilsPerSub * coilImpedance
      return impedancePerSub / quantity
    }
  }

  const result = calculateImpedance()

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Calculadora de Impedância</h2>
        <p className="text-muted-foreground text-sm">
          Calcule a impedância final do seu sistema baseado na quantidade de subwoofers, bobinas e tipo de ligação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quantidade de Subwoofers</label>
            <input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bobinas por Subwoofer</label>
            <select
              value={coilsPerSub}
              onChange={(e) => setCoilsPerSub(parseInt(e.target.value))}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={1}>1 Bobina (SVC)</option>
              <option value={2}>2 Bobinas (DVC)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Impedância por Bobina (Ω)</label>
            <select
              value={coilImpedance}
              onChange={(e) => setCoilImpedance(parseInt(e.target.value))}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={2}>2 Ω</option>
              <option value={4}>4 Ω</option>
              <option value={8}>8 Ω</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo de Ligação</label>
            <div className="grid grid-cols-3 gap-2">
              {(['parallel', 'series', 'series-parallel'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setWiring(type)}
                  className={cn(
                    "py-2 text-xs font-bold uppercase tracking-wider border rounded-sm transition-colors",
                    wiring === type
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {type === 'parallel' ? 'Paralelo' : type === 'series' ? 'Série' : 'Misto'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-secondary/50 border border-border rounded-sm p-6 flex flex-col items-center justify-center text-center space-y-4">
          <Zap className="w-10 h-10 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Impedância Final</p>
            <p className="text-5xl font-black text-foreground mt-2">
              {result < 0.1 ? result.toFixed(2) : result < 1 ? result.toFixed(2) : result % 1 === 0 ? result : result.toFixed(1)}
              <span className="text-2xl text-muted-foreground ml-1">Ω</span>
            </p>
          </div>
          <div className="pt-4 border-t border-border w-full">
            <p className="text-xs text-muted-foreground">
              {quantity} sub(s) × {coilsPerSub} bobina(s) de {coilImpedance}Ω em{' '}
              <span className="text-foreground font-bold">
                {wiring === 'parallel' ? 'paralelo' : wiring === 'series' ? 'série' : 'série-paralelo'}
              </span>
            </p>
          </div>

          {result < 0.5 && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-left">
              <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">
                Atenção: Impedância muito baixa pode danificar seu amplificador. Verifique se o módulo suporta essa carga.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Power Calculator ─── */
function PowerCalculator() {
  const [voltage, setVoltage] = useState(14.4)
  const [current, setCurrent] = useState(100)

  const power = Math.round(voltage * current)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Calculadora de Potência RMS</h2>
        <p className="text-muted-foreground text-sm">
          Estime a potência real do seu sistema baseada na tensão da bateria e corrente consumida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tensão do Sistema (V)</label>
            <input
              type="number"
              step={0.1}
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">12.6V (bateria) ou 14.4V (alternador ligado)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Corrente Total (A)</label>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(parseInt(e.target.value) || 0)}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">Soma dos fusíveis ou consumo medido</p>
          </div>
        </div>

        <div className="bg-secondary/50 border border-border rounded-sm p-6 flex flex-col items-center justify-center text-center space-y-4">
          <Volume2 className="w-10 h-10 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Potência Estimada</p>
            <p className="text-5xl font-black text-foreground mt-2">
              {power >= 1000 ? `${(power / 1000).toFixed(1)}kW` : `${power}W`}
            </p>
          </div>
          <div className="pt-4 border-t border-border w-full">
            <p className="text-xs text-muted-foreground">
              P = V × I → {voltage}V × {current}A = {power}W
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Battery Calculator ─── */
function BatteryCalculator() {
  const [totalPower, setTotalPower] = useState(3000)
  const [voltage, setVoltage] = useState(12)
  const [playTime, setPlayTime] = useState(30)

  const currentDraw = totalPower / voltage
  const ahNeeded = Math.ceil((currentDraw * playTime) / 60)
  const batteries220 = Math.ceil(ahNeeded / 220)

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Calculadora de Banco de Baterias</h2>
        <p className="text-muted-foreground text-sm">
          Descubra quantas baterias você precisa para tocar seu som pelo tempo desejado sem descarregar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Potência Total do Sistema (W RMS)</label>
            <input
              type="number"
              value={totalPower}
              onChange={(e) => setTotalPower(parseInt(e.target.value) || 0)}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tempo de Uso (minutos)</label>
            <input
              type="number"
              value={playTime}
              onChange={(e) => setPlayTime(parseInt(e.target.value) || 0)}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tensão do Sistema (V)</label>
            <select
              value={voltage}
              onChange={(e) => setVoltage(parseInt(e.target.value))}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={12}>12V (padrão)</option>
              <option value={24}>24V (dois bancos)</option>
            </select>
          </div>
        </div>

        <div className="bg-secondary/50 border border-border rounded-sm p-6 space-y-6">
          <div className="text-center space-y-2">
            <Battery className="w-10 h-10 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Resultado</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Consumo estimado</span>
              <span className="font-bold text-foreground">{Math.round(currentDraw)}A</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Capacidade necessária</span>
              <span className="font-bold text-foreground">{ahNeeded}Ah</span>
            </div>
            <div className="flex justify-between items-center py-2 pt-3">
              <span className="text-sm text-muted-foreground">Baterias 220Ah recomendadas</span>
              <span className="text-3xl font-black text-primary">{batteries220}x</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Cálculo baseado em uso contínuo. Adicione margem de segurança de 20-30%.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Cable/Breaker Calculator ─── */
function CableCalculator() {
  const [current, setCurrent] = useState(100)
  const [length, setLength] = useState(3)

  const cableSize = current <= 30 ? '10mm²' : current <= 60 ? '16mm²' : current <= 100 ? '25mm²' : current <= 150 ? '35mm²' : current <= 200 ? '50mm²' : '70mm²'
  const breakerSize = Math.ceil(current * 1.25 / 10) * 10

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">Calculadora de Cabo e Disjuntor</h2>
        <p className="text-muted-foreground text-sm">
          Determine a bitola ideal do cabo e o disjuntor correto para proteger sua instalação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Corrente Máxima (A)</label>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(parseInt(e.target.value) || 0)}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Comprimento do Cabo (metros)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value) || 0)}
              className="w-full h-11 px-4 bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-secondary/50 border border-border rounded-sm p-6 space-y-6">
          <div className="text-center space-y-2">
            <Cable className="w-10 h-10 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Recomendação</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Bitola do cabo</span>
              <span className="font-bold text-foreground text-lg">{cableSize}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Disjuntor recomendado</span>
              <span className="font-bold text-foreground text-lg">{breakerSize}A</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Fusível ANL</span>
              <span className="font-bold text-foreground text-lg">{breakerSize}A</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Para cabos acima de 5m, considere aumentar uma bitola para evitar queda de tensão.
          </p>
        </div>
      </div>
    </div>
  )
}