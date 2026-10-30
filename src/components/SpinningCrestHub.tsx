import { useEffect, useRef } from 'react';
import { CreditCard, FileUp, MessageSquare } from 'lucide-react';
import {
  createInitialCoinSpinState,
  onLogoMouseEnter,
  onLogoMouseLeave,
  stepCoinSpin,
} from '../utils/coinSpin';
import type { PortalOptionId, PortalRecord } from '../utils/portalValidation';

interface SpinningCrestHubProps {
  optionsOpen: boolean;
  onToggleOptions: () => void;
  onSelectOption: (option: PortalOptionId) => void;
  records: PortalRecord[];
  onOpenConsultation: () => void;
}

export function SpinningCrestHub({
  optionsOpen,
  onToggleOptions,
  onSelectOption,
  records,
  onOpenConsultation,
}: SpinningCrestHubProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rotorRef = useRef<HTMLDivElement | null>(null);
  const spinStateRef = useRef(createInitialCoinSpinState());

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dtMs = now - lastTime;
      lastTime = now;

      const next = stepCoinSpin(spinStateRef.current, dtMs);
      spinStateRef.current = next;

      if (rotorRef.current) {
        rotorRef.current.style.setProperty('--coin-angle', `${next.angle.toFixed(2)}deg`);
      }
      if (buttonRef.current) {
        if (buttonRef.current.dataset.spinMode !== next.mode) {
          buttonRef.current.dataset.spinMode = next.mode;
        }
        buttonRef.current.dataset.coinAngle = String(Math.round(next.angle));
      }

      frameId = window.requestAnimationFrame(tick);
    };

    if (buttonRef.current) {
      buttonRef.current.dataset.spinMode = spinStateRef.current.mode;
      buttonRef.current.dataset.coinAngle = '0';
    }

    frameId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleMouseEnter = () => {
    spinStateRef.current = onLogoMouseEnter(spinStateRef.current);
    if (buttonRef.current) {
      buttonRef.current.dataset.spinMode = spinStateRef.current.mode;
    }
  };

  const handleMouseLeave = () => {
    spinStateRef.current = onLogoMouseLeave(spinStateRef.current);
    if (buttonRef.current) {
      buttonRef.current.dataset.spinMode = spinStateRef.current.mode;
    }
  };

  return (
    <section
      id="inicio"
      aria-labelledby="hero-heading"
      className="relative bg-black pt-6 pb-20 sm:pt-8 sm:pb-24 border-b border-[#2C2314]"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Upper-Center 3D Coin-Spinning Wolf & Laurel Crown Logo (Unaltered Asset) */}
        <div className="coin-stage flex flex-col items-center">
          <button
            ref={buttonRef}
            type="button"
            onClick={onToggleOptions}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-expanded={optionsOpen}
            aria-controls="brasao-opcoes-portal"
            aria-label="Brasão APS: clique para abrir Comunicar, Enviar documentos e Pagamento"
            className="group relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-black cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-lg"
          >
            <div ref={rotorRef} className="coin-rotor relative w-full h-full">
              <div className="coin-face-front relative w-full h-full">
                <img
                  src="/assets/aistudio/image_23b325ea.png"
                  alt="Brasão institucional Lobo e Coroa de Louros Dourada — APS Advocacia"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain select-none pointer-events-none block"
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-black" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-black" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-black" />
              </div>
              <div className="coin-face-back absolute inset-0 w-full h-full">
                <img
                  src="/assets/aistudio/image_23b325ea.png"
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain select-none pointer-events-none block"
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-black" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-black" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-black" />
              </div>
            </div>
          </button>

          <p className="mt-3 text-xs text-[#8C7E65] tracking-wide">
            <span>Clique no brasão para acesso rápido ao cliente</span>
            <span aria-hidden="true" className="mx-2 text-[#D4AF37]/60">·</span>
            <span>{optionsOpen ? 'Selecione uma opção abaixo' : 'Comunicar, Enviar documentos ou Pagamento'}</span>
          </p>
        </div>

        {/* 3 Options Revealed Upon Clicking the Logo */}
        {optionsOpen && (
          <div
            id="brasao-opcoes-portal"
            role="region"
            aria-label="Opções de atendimento rápido do brasão"
            className="mt-6 w-full max-w-2xl p-4 sm:p-5 bg-[#110E09] border border-[#D4AF37]/50 rounded-lg transition-opacity duration-150"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onSelectOption('comunicar')}
                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-black hover:bg-[#1A150C] text-[#F5EFE6] border border-[#D4AF37]/40 hover:border-[#F3D88B] rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span>Comunicar</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectOption('documentos')}
                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-black hover:bg-[#1A150C] text-[#F5EFE6] border border-[#D4AF37]/40 hover:border-[#F3D88B] rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] whitespace-nowrap shrink-0"
              >
                <FileUp className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span>Enviar documentos</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectOption('pagamento')}
                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-black hover:bg-[#1A150C] text-[#F5EFE6] border border-[#D4AF37]/40 hover:border-[#F3D88B] rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] whitespace-nowrap shrink-0"
              >
                <CreditCard className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                <span>Pagamento</span>
              </button>
            </div>
          </div>
        )}

        {/* Session Protocols Ledger */}
        {records.length > 0 && (
          <div
            aria-label="Protocolos registrados nesta sessão"
            className="mt-5 w-full max-w-2xl text-left border-t border-b border-[#2C2314] py-3 px-2"
          >
            <p className="text-xs text-[#BFB39C] mb-2">
              Protocolos registrados nesta sessão ({records.length})
            </p>
            <ul className="space-y-1.5">
              {records.map((rec) => (
                <li
                  key={rec.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#F5EFE6]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-[#F3D88B]">{rec.protocol}</span>
                    <span aria-hidden="true" className="text-[#8C7E65]">·</span>
                    <span className="font-medium">{rec.title}</span>
                    <span aria-hidden="true" className="text-[#8C7E65]">·</span>
                    <span className="text-[#BFB39C]">{rec.summary}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#8C7E65]">
                    {rec.amountFormatted ? `${rec.amountFormatted} · ` : ''}
                    {rec.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Gold Identity Lockup from Reference Image: DR. ADEVANDRO PEREIRA DA SILVA | ADVOGADO | OAB/DF 86.083 */}
        <div className="mt-9 w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="font-display font-bold tracking-wider leading-[1.15] text-gold-metallic">
            <span className="block text-xl sm:text-2xl lg:text-3xl">
              Dr. Adevandro
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl mt-0.5">
              Pereira da Silva
            </span>
          </div>

          <div
            aria-hidden="true"
            className="divider-gold-metallic h-0.5 w-full max-w-lg my-3.5"
          />

          <p className="text-xs sm:text-sm font-medium tracking-[0.22em] text-gold-metallic tabular-nums">
            ADVOGADO | OAB/DF 86.083
          </p>
        </div>

        {/* Institutional Hero Typography & Primary Proposition */}
        <div className="mt-8 max-w-3xl mx-auto">
          <h1
            id="hero-heading"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F5EFE6] tracking-wide leading-[1.1] text-balance"
          >
            Verum Est
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#BFB39C] leading-relaxed max-w-2xl mx-auto">
            Atuação jurídica estratégica, consultiva e contenciosa no Distrito Federal, perante os
            Tribunais Superiores e em âmbito nacional, pautada pela verdade, lealdade e excelência técnica.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="py-3 px-6 bg-[#D4AF37] hover:bg-[#F3D88B] text-black font-semibold text-sm rounded-md transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D88B] focus-visible:ring-offset-2 focus-visible:ring-offset-black whitespace-nowrap shrink-0"
            >
              Agendar Consulta Confidencial
            </button>
            <a
              href="#atuacao"
              className="py-3 px-6 border border-[#2C2314] hover:border-[#D4AF37] text-[#F5EFE6] text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              Conhecer Áreas de Atuação
            </a>
          </div>
        </div>

        {/* Full-Width 4-Column Institutional Pillars Strip */}
        <dl className="mt-16 pt-10 border-t border-[#2C2314] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          <div>
            <dt className="text-xs text-[#8C7E65] tracking-wide">Inscrição Profissional</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-[#F3D88B] tabular-nums">
              OAB/DF 86.083
            </dd>
            <p className="mt-1 text-xs text-[#BFB39C]">
              Sede no Distrito Federal com atuação direta nos Tribunais Superiores
            </p>
          </div>

          <div>
            <dt className="text-xs text-[#8C7E65] tracking-wide">Condução Técnica</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-[#F3D88B]">
              Atuação Pessoal
            </dd>
            <p className="mt-1 text-xs text-[#BFB39C]">
              Acompanhamento direto e individualizado pelo Dr. Adevandro Pereira da Silva
            </p>
          </div>

          <div>
            <dt className="text-xs text-[#8C7E65] tracking-wide">Abrangência</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-[#F3D88B]">
              Nacional &amp; DF
            </dd>
            <p className="mt-1 text-xs text-[#BFB39C]">
              Processo eletrônico, sustentações orais e atendimento digital criptografado
            </p>
          </div>

          <div>
            <dt className="text-xs text-[#8C7E65] tracking-wide">Compromisso Institucional</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-[#F3D88B]">
              Sigilo &amp; Rigor
            </dd>
            <p className="mt-1 text-xs text-[#BFB39C]">
              Defesa intransigente das garantias legais, contratuais e patrimoniais
            </p>
          </div>
        </dl>
      </div>
    </section>
  );
}
