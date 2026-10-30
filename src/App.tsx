/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ConsultationSection } from './components/ConsultationSection';
import { PortalModals } from './components/PortalModals';
import { PracticeAreasSection } from './components/PracticeAreasSection';
import { PrecedentsAndFirmSection } from './components/PrecedentsAndFirmSection';
import { SpinningCrestHub } from './components/SpinningCrestHub';
import type { PortalOptionId, PortalRecord } from './utils/portalValidation';

export default function App() {
  const [crestOptionsOpen, setCrestOptionsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<PortalOptionId | null>(null);
  const [records, setRecords] = useState<PortalRecord[]>([]);
  const [preselectedArea, setPreselectedArea] = useState('');

  const scrollToContact = (areaTitle?: string) => {
    if (areaTitle) {
      setPreselectedArea(areaTitle);
    }
    const el = document.getElementById('contato');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRecordCreated = (record: PortalRecord) => {
    setRecords((prev) => [record, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-[#F5EFE6] flex flex-col">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xs border-b border-[#2C2314]">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#inicio"
            className="font-display text-xl sm:text-2xl font-bold tracking-widest text-gold-metallic whitespace-nowrap shrink-0"
          >
            APS
          </a>

          {/* Zone 2: 4 Single-line Navigation Links */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-7 text-sm text-[#BFB39C]">
            <a
              href="#atuacao"
              className="hover:text-[#F3D88B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Áreas de Atuação
            </a>
            <a
              href="#escritorio"
              className="hover:text-[#F3D88B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              O Escritório
            </a>
            <a
              href="#precedentes"
              className="hover:text-[#F3D88B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Precedentes
            </a>
            <a
              href="#contato"
              className="hover:text-[#F3D88B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Contato
            </a>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToContact()}
              className="py-2 px-4 border border-[#D4AF37]/65 hover:border-[#F3D88B] hover:bg-[#D4AF37] text-[#F3D88B] hover:text-black text-xs font-semibold rounded-md transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D88B] whitespace-nowrap shrink-0"
            >
              Agendar Consulta
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <SpinningCrestHub
          optionsOpen={crestOptionsOpen}
          onToggleOptions={() => setCrestOptionsOpen((prev) => !prev)}
          onSelectOption={(option) => setActiveModal(option)}
          records={records}
          onOpenConsultation={() => scrollToContact()}
        />

        <PracticeAreasSection onConsultArea={(areaTitle) => scrollToContact(areaTitle)} />

        <PrecedentsAndFirmSection />

        <ConsultationSection
          preselectedArea={preselectedArea}
          nextSequence={records.length + 1}
          onConsultationCreated={handleRecordCreated}
        />
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="bg-black py-12 text-xs text-[#8C7E65]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <p className="font-display text-lg font-semibold text-[#F3D88B]">
              APS — Dr. Adevandro Pereira da Silva
            </p>
            <p>
              ADVOGADO | OAB/DF 86.083 · Informativo institucional em conformidade com o Provimento nº
              205/2021 do Conselho Federal da OAB.
            </p>
            <p>© {new Date().getFullYear()} APS Advocacia. Todos os direitos reservados.</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[#BFB39C]">
            <button
              type="button"
              onClick={() => setActiveModal('comunicar')}
              className="hover:text-[#F3D88B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Comunicar
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('documentos')}
              className="hover:text-[#F3D88B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Enviar documentos
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('pagamento')}
              className="hover:text-[#F3D88B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Pagamento
            </button>
          </div>
        </div>
      </footer>

      <PortalModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSwitchModal={(next) => setActiveModal(next)}
        nextSequence={records.length + 1}
        onRecordCreated={handleRecordCreated}
      />
    </div>
  );
}
