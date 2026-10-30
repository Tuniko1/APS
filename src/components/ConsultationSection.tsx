import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { PRACTICE_AREAS } from '../data/lawFirmData';
import {
  generateProtocolCode,
  validateConsulta,
  type PortalRecord,
} from '../utils/portalValidation';

interface ConsultationSectionProps {
  preselectedArea: string;
  nextSequence: number;
  onConsultationCreated: (record: PortalRecord) => void;
}

export function ConsultationSection({
  preselectedArea,
  nextSequence,
  onConsultationCreated,
}: ConsultationSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState(preselectedArea || PRACTICE_AREAS[0].title);
  const [summary, setSummary] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedProtocol, setConfirmedProtocol] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedArea) {
      setArea(preselectedArea);
    }
  }, [preselectedArea]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateConsulta({
      fullName,
      email,
      phone,
      area,
      summary,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const protocol = generateProtocolCode('CON', nextSequence);
    setConfirmedProtocol(protocol);
    onConsultationCreated({
      id: protocol,
      protocol,
      type: 'comunicar',
      title: 'Agendamento de Consulta',
      clientName: fullName.trim(),
      summary: `${area} · ${email.trim()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  return (
    <section
      id="contato"
      aria-labelledby="contato-heading"
      className="bg-black py-20 sm:py-28 border-b border-[#2C2314]"
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div>
            <p className="text-xs text-[#D4AF37] tracking-wide">Atendimento Institucional · APS</p>
            <h2
              id="contato-heading"
              className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#F5EFE6] text-balance"
            >
              Agende uma consulta confidencial com o Dr. Adevandro Pereira da Silva.
            </h2>
            <p className="mt-3 text-sm text-[#BFB39C] leading-relaxed">
              Todas as informações compartilhadas são protegidas por sigilo profissional desde o
              primeiro contato institucional.
            </p>
          </div>

          <dl className="space-y-6 pt-6 border-t border-[#2C2314] text-sm">
            <div>
              <dt className="text-xs text-[#F3D88B] font-medium">Titularidade &amp; Registro</dt>
              <dd className="mt-1 text-[#F5EFE6] font-medium">
                Dr. Adevandro Pereira da Silva
              </dd>
              <dd className="mt-0.5 font-mono text-xs tabular-nums text-[#BFB39C]">
                ADVOGADO | OAB/DF 86.083
              </dd>
            </div>

            <div>
              <dt className="text-xs text-[#F3D88B] font-medium">Sede Brasília — Distrito Federal</dt>
              <dd className="mt-1 text-[#BFB39C]">
                Atuação presencial no Distrito Federal, Tribunais Superiores (STJ e STF) e atendimento
                digital em todo o território nacional.
              </dd>
              <dd className="mt-0.5 font-mono text-xs tabular-nums text-[#8C7E65]">
                Segunda a Sexta, 08h30 às 19h30 · Plantão em Medidas Urgentes
              </dd>
            </div>

            <div>
              <dt className="text-xs text-[#F3D88B] font-medium">Correspondência Eletrônica Oficial</dt>
              <dd className="mt-1 font-mono text-xs text-[#F5EFE6]">
                contato@apsadvocacia.adv.br
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7 bg-[#090806] border border-[#2C2314] rounded-lg p-7 sm:p-9">
          {confirmedProtocol ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#F3D88B] text-base font-semibold">
                <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Solicitação de Consulta Registrada</span>
              </div>
              <p className="text-sm text-[#BFB39C] leading-relaxed">
                O escritório <strong className="text-[#F5EFE6] font-medium">APS</strong> confirmará as
                opções de horário para atendimento em{' '}
                <strong className="text-[#F5EFE6] font-medium">{area}</strong> com brevidade.
              </p>
              <div className="p-4 bg-black border border-[#2C2314] rounded-md text-xs space-y-1">
                <span className="text-[#8C7E65] block">Protocolo Confidencial</span>
                <span className="font-mono tabular-nums text-sm text-[#F3D88B] font-semibold">
                  {confirmedProtocol}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConfirmedProtocol(null);
                  setSummary('');
                }}
                className="py-2.5 px-5 border border-[#D4AF37]/50 hover:border-[#F3D88B] text-[#F5EFE6] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Solicitar Novo Agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="con-name" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                  Nome Completo
                </label>
                <input
                  id="con-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. / Sra. Nome Completo"
                  className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                />
                {errors.fullName && (
                  <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="con-email" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                    E-mail Corporativo ou Pessoal
                  </label>
                  <input
                    id="con-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@empresa.com.br"
                    className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="con-phone" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                    Telefone / WhatsApp com DDD
                  </label>
                  <input
                    id="con-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(61) 99800-0000"
                    className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm font-mono tabular-nums text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="con-area" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                  Área de Especialidade
                </label>
                <select
                  id="con-area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] focus:outline-none"
                >
                  {PRACTICE_AREAS.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="con-summary" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                  Síntese Confidencial da Demanda
                </label>
                <textarea
                  id="con-summary"
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Informe brevemente o contexto jurídico, contratual ou processual..."
                  className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                />
                {errors.summary && (
                  <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                    {errors.summary}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto py-3 px-6 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Solicitar Agendamento · APS
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
