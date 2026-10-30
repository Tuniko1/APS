import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PRACTICE_AREAS } from '../data/lawFirmData';

interface PracticeAreasSectionProps {
  onConsultArea: (areaTitle: string) => void;
}

export function PracticeAreasSection({ onConsultArea }: PracticeAreasSectionProps) {
  const [selectedId, setSelectedId] = useState<string>(PRACTICE_AREAS[0].id);
  const activeArea = PRACTICE_AREAS.find((a) => a.id === selectedId) ?? PRACTICE_AREAS[0];

  return (
    <section
      id="atuacao"
      aria-labelledby="atuacao-heading"
      className="bg-[#090806] py-20 sm:py-28 border-b border-[#2C2314]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-xs text-[#D4AF37] tracking-wide">Especialidades Jurídicas</p>
          <h2
            id="atuacao-heading"
            className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#F5EFE6] text-balance"
          >
            Atuação coordenada em demandas empresariais e patrimoniais críticas.
          </h2>
          <p className="mt-3 text-base text-[#BFB39C] leading-relaxed">
            Cada demanda é conduzida com dedicação direta pelo Dr. Adevandro Pereira da Silva,
            combinando rigor técnico processual e visão estratégica.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Numbered Editorial Index List */}
          <div className="lg:col-span-5 divide-y divide-[#2C2314] border-t border-b border-[#2C2314]">
            {PRACTICE_AREAS.map((area) => {
              const isSelected = area.id === activeArea.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedId(area.id)}
                  aria-pressed={isSelected}
                  className={`w-full py-5 px-4 text-left transition-colors duration-150 flex items-start justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    isSelected ? 'bg-[#110E09]' : 'hover:bg-[#110E09]/50'
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs tabular-nums text-[#D4AF37]">
                      {area.index}
                    </span>
                    <h3
                      className={`mt-1 font-display text-xl font-semibold ${
                        isSelected ? 'text-[#F3D88B]' : 'text-[#F5EFE6]'
                      }`}
                    >
                      {area.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#BFB39C] leading-relaxed">
                      {area.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Practice Dossier Panel */}
          <div className="lg:col-span-7 bg-[#110E09] border border-[#2C2314] rounded-lg p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7E65]">
                <span className="font-mono tabular-nums text-[#D4AF37]">{activeArea.index}</span>
                <span aria-hidden="true">·</span>
                <span>Coordenação: {activeArea.leadPartner}</span>
              </div>

              <h3 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-[#F5EFE6] text-balance">
                {activeArea.title}
              </h3>

              <p className="mt-4 text-base text-[#BFB39C] leading-relaxed max-w-prose">
                {activeArea.description}
              </p>

              <div className="mt-8 pt-6 border-t border-[#2C2314]">
                <h4 className="text-xs font-semibold text-[#F3D88B] tracking-wide">
                  Escopo Técnico de Atuação
                </h4>
                <ul className="mt-4 space-y-3">
                  {activeArea.deliverables.map((item) => (
                    <li key={item} className="text-sm text-[#F5EFE6] flex items-baseline gap-3">
                      <span aria-hidden="true" className="text-[#D4AF37] font-mono text-xs">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#2C2314] flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[#8C7E65]">
                Atendimento em Brasília/DF, âmbito nacional e videoconferência criptografada
              </span>
              <button
                type="button"
                onClick={() => onConsultArea(activeArea.title)}
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Consultar Especialista</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
