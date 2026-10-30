import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, Copy, FileText, Trash2, Upload, X } from 'lucide-react';
import { FEE_SCHEDULE_OPTIONS } from '../data/lawFirmData';
import {
  buildPixCopyPasteCode,
  formatCpfCnpj,
  formatCurrencyBRL,
  formatFileSize,
  generateProtocolCode,
  validateComunicar,
  validateDocumentos,
  validatePagamento,
  type PortalOptionId,
  type PortalRecord,
} from '../utils/portalValidation';

interface PortalModalsProps {
  activeModal: PortalOptionId | null;
  onClose: () => void;
  onSwitchModal: (next: PortalOptionId) => void;
  nextSequence: number;
  onRecordCreated: (record: PortalRecord) => void;
}

export function PortalModals({
  activeModal,
  onClose,
  onSwitchModal,
  nextSequence,
  onRecordCreated,
}: PortalModalsProps) {
  // Comunicar state
  const [comName, setComName] = useState('');
  const [comContact, setComContact] = useState('');
  const [comUrgency, setComUrgency] = useState<'Geral' | 'Andamento Processual' | 'Urgência / Plantão 24h'>('Geral');
  const [comProcess, setComProcess] = useState('');
  const [comMessage, setComMessage] = useState('');
  const [comErrors, setComErrors] = useState<Record<string, string>>({});
  const [comReceipt, setComReceipt] = useState<PortalRecord | null>(null);

  // Enviar documentos state
  const [docName, setDocName] = useState('');
  const [docTaxId, setDocTaxId] = useState('');
  const [docCategory, setDocCategory] = useState('Contratos & Societário');
  const [docNotes, setDocNotes] = useState('');
  const [docFiles, setDocFiles] = useState<Array<{ name: string; sizeBytes: number }>>([]);
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});
  const [docReceipt, setDocReceipt] = useState<PortalRecord | null>(null);

  // Pagamento state
  const [selectedFeeId, setSelectedFeeId] = useState(FEE_SCHEDULE_OPTIONS[0].id);
  const [payName, setPayName] = useState('');
  const [payTaxId, setPayTaxId] = useState('');
  const [customAmountReais, setCustomAmountReais] = useState('1500,00');
  const [payMethod, setPayMethod] = useState<'PIX' | 'Cartão Corporativo' | 'Boleto Registrado'>('PIX');
  const [cardDigits, setCardDigits] = useState('');
  const [payErrors, setPayErrors] = useState<Record<string, string>>({});
  const [payReceipt, setPayReceipt] = useState<PortalRecord | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const parseReaisToCents = (val: string): number => {
    const normalized = val.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
  };

  const activeFee = FEE_SCHEDULE_OPTIONS.find((f) => f.id === selectedFeeId) ?? FEE_SCHEDULE_OPTIONS[0];
  const currentAmountCents =
    selectedFeeId === 'retainer-mensal' ? parseReaisToCents(customAmountReais) : activeFee.amountCents;

  const previewProtocol = generateProtocolCode('PAG', nextSequence);
  const pixPayload = buildPixCopyPasteCode(previewProtocol, Math.max(currentAmountCents, 10000));

  const formatNow = () =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleComunicarSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateComunicar({
      clientName: comName,
      contact: comContact,
      urgency: comUrgency,
      processNumber: comProcess,
      message: comMessage,
    });
    if (!validation.valid) {
      setComErrors(validation.errors);
      return;
    }
    setComErrors({});
    const protocol = generateProtocolCode('COM', nextSequence);
    const record: PortalRecord = {
      id: protocol,
      protocol,
      type: 'comunicar',
      title: 'Comunicação Jurídica',
      clientName: comName.trim(),
      summary: `${comUrgency} · ${comContact.trim()}`,
      timestamp: formatNow(),
    };
    setComReceipt(record);
    onRecordCreated(record);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const added = Array.from(fileList).map((f) => ({
      name: f.name,
      sizeBytes: f.size,
    }));
    setDocFiles((prev) => [...prev, ...added]);
    setDocErrors((prev) => {
      const next = { ...prev };
      delete next.files;
      return next;
    });
    e.target.value = '';
  };

  const handleAddSampleDeclaration = () => {
    setDocFiles((prev) => [
      ...prev,
      { name: 'Procuracao_Ad_Judicia_Assinada.pdf', sizeBytes: 318400 },
    ]);
    setDocErrors((prev) => {
      const next = { ...prev };
      delete next.files;
      return next;
    });
  };

  const handleDocumentosSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateDocumentos({
      clientName: docName,
      taxId: docTaxId,
      category: docCategory,
      notes: docNotes,
      files: docFiles,
    });
    if (!validation.valid) {
      setDocErrors(validation.errors);
      return;
    }
    setDocErrors({});
    const protocol = generateProtocolCode('DOC', nextSequence);
    const record: PortalRecord = {
      id: protocol,
      protocol,
      type: 'documentos',
      title: 'Envio de Documentos',
      clientName: docName.trim(),
      summary: `${docFiles.length} arquivo(s) · ${docCategory}`,
      timestamp: formatNow(),
    };
    setDocReceipt(record);
    onRecordCreated(record);
  };

  const handlePagamentoSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validatePagamento({
      clientName: payName,
      taxId: payTaxId,
      serviceLabel: activeFee.label,
      amountCents: currentAmountCents,
      method: payMethod,
      cardLastFour: cardDigits,
    });
    if (!validation.valid) {
      setPayErrors(validation.errors);
      return;
    }
    setPayErrors({});
    const protocol = generateProtocolCode('PAG', nextSequence);
    const formattedAmount = formatCurrencyBRL(currentAmountCents);
    const record: PortalRecord = {
      id: protocol,
      protocol,
      type: 'pagamento',
      title: `Pagamento (${payMethod})`,
      clientName: payName.trim(),
      summary: activeFee.label,
      amountFormatted: formattedAmount,
      timestamp: formatNow(),
    };
    setPayReceipt(record);
    onRecordCreated(record);
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPix(true);
      window.setTimeout(() => setCopiedPix(false), 2000);
    } catch {
      setCopiedPix(true);
      window.setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-[#090806] border border-[#D4AF37]/50 rounded-lg p-6 sm:p-8 my-auto text-left">
        {/* Top Modal Switcher & Close Button */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#2C2314]">
          <div className="flex items-center gap-1 p-1 bg-black border border-[#2C2314] rounded-md overflow-x-auto">
            <button
              type="button"
              onClick={() => onSwitchModal('comunicar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeModal === 'comunicar'
                  ? 'bg-[#D4AF37] text-black font-semibold'
                  : 'text-[#BFB39C] hover:text-[#F5EFE6]'
              }`}
            >
              Comunicar
            </button>
            <button
              type="button"
              onClick={() => onSwitchModal('documentos')}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeModal === 'documentos'
                  ? 'bg-[#D4AF37] text-black font-semibold'
                  : 'text-[#BFB39C] hover:text-[#F5EFE6]'
              }`}
            >
              Enviar documentos
            </button>
            <button
              type="button"
              onClick={() => onSwitchModal('pagamento')}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeModal === 'pagamento'
                  ? 'bg-[#D4AF37] text-black font-semibold'
                  : 'text-[#BFB39C] hover:text-[#F5EFE6]'
              }`}
            >
              Pagamento
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de atendimento"
            className="p-2 text-[#BFB39C] hover:text-[#F3D88B] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* 1. COMUNICAR */}
        {activeModal === 'comunicar' && (
          <div className="mt-6">
            <h2 id="portal-modal-title" className="font-display text-2xl sm:text-3xl font-semibold text-[#F5EFE6]">
              Comunicar · APS
            </h2>
            <p className="mt-1 text-sm text-[#BFB39C]">
              Canal direto e sigiloso com o Dr. Adevandro Pereira da Silva (OAB/DF 86.083).
            </p>

            {comReceipt ? (
              <div className="mt-6 p-5 bg-[#110E09] border border-[#D4AF37]/40 rounded-md space-y-4">
                <div className="flex items-center gap-2 text-[#F3D88B] text-sm font-semibold">
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Comunicação protocolada junto à Secretaria Jurídica</span>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-[#2C2314] pt-3">
                  <div>
                    <dt className="text-[#8C7E65]">Protocolo</dt>
                    <dd className="font-mono tabular-nums text-[#F5EFE6] mt-0.5">{comReceipt.protocol}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8C7E65]">Cliente / Solicitante</dt>
                    <dd className="text-[#F5EFE6] mt-0.5">{comReceipt.clientName}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[#8C7E65]">Classificação &amp; Retorno</dt>
                    <dd className="text-[#BFB39C] mt-0.5">{comReceipt.summary}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setComReceipt(null);
                      setComMessage('');
                      setComProcess('');
                    }}
                    className="py-2 px-4 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Nova Mensagem
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 border border-[#2C2314] hover:border-[#D4AF37] text-[#F5EFE6] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleComunicarSubmit} noValidate className="mt-5 space-y-4">
                <div>
                  <label htmlFor="com-name" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                    Nome completo ou Razão Social
                  </label>
                  <input
                    id="com-name"
                    type="text"
                    value={comName}
                    onChange={(e) => setComName(e.target.value)}
                    placeholder="Ex.: Grupo Vanguarda Participações S.A."
                    className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                  />
                  {comErrors.clientName && (
                    <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                      {comErrors.clientName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="com-contact" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      E-mail ou Telefone / WhatsApp
                    </label>
                    <input
                      id="com-contact"
                      type="text"
                      value={comContact}
                      onChange={(e) => setComContact(e.target.value)}
                      placeholder="diretoria@empresa.com.br ou (11) 99999-0000"
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                    />
                    {comErrors.contact && (
                      <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                        {comErrors.contact}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="com-urgency" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      Natureza do Contato
                    </label>
                    <select
                      id="com-urgency"
                      value={comUrgency}
                      onChange={(e) =>
                        setComUrgency(
                          e.target.value as 'Geral' | 'Andamento Processual' | 'Urgência / Plantão 24h'
                        )
                      }
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] focus:outline-none"
                    >
                      <option value="Geral">Geral</option>
                      <option value="Andamento Processual">Andamento Processual</option>
                      <option value="Urgência / Plantão 24h">Urgência / Plantão 24h</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="com-process" className="block text-xs font-medium text-[#BFB39C] mb-1.5">
                    Número do Processo CNJ (opcional)
                  </label>
                  <input
                    id="com-process"
                    type="text"
                    value={comProcess}
                    onChange={(e) => setComProcess(e.target.value)}
                    placeholder="0000000-00.2026.8.26.0100"
                    className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm font-mono tabular-nums text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="com-message" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                    Mensagem Confidencial
                  </label>
                  <textarea
                    id="com-message"
                    rows={3}
                    value={comMessage}
                    onChange={(e) => setComMessage(e.target.value)}
                    placeholder="Descreva o assunto ou providência jurídica desejada..."
                    className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                  />
                  {comErrors.message && (
                    <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                      {comErrors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 border border-[#2C2314] hover:border-[#D4AF37] text-[#BFB39C] hover:text-[#F5EFE6] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Enviar Comunicação
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 2. ENVIAR DOCUMENTOS */}
        {activeModal === 'documentos' && (
          <div className="mt-6">
            <h2 id="portal-modal-title" className="font-display text-2xl sm:text-3xl font-semibold text-[#F5EFE6]">
              Enviar Documentos
            </h2>
            <p className="mt-1 text-sm text-[#BFB39C]">
              Remessa digital sob sigilo profissional advogado-cliente (Art. 7º, II, Estatuto da OAB).
            </p>

            {docReceipt ? (
              <div className="mt-6 p-5 bg-[#110E09] border border-[#D4AF37]/40 rounded-md space-y-4">
                <div className="flex items-center gap-2 text-[#F3D88B] text-sm font-semibold">
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Documentação recebida e autenticada no dossiê</span>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-[#2C2314] pt-3">
                  <div>
                    <dt className="text-[#8C7E65]">Protocolo de Recebimento</dt>
                    <dd className="font-mono tabular-nums text-[#F5EFE6] mt-0.5">{docReceipt.protocol}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8C7E65]">Titular</dt>
                    <dd className="text-[#F5EFE6] mt-0.5">{docReceipt.clientName}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[#8C7E65]">Resumo da Remessa</dt>
                    <dd className="text-[#BFB39C] mt-0.5">{docReceipt.summary}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDocReceipt(null);
                      setDocFiles([]);
                      setDocNotes('');
                    }}
                    className="py-2 px-4 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Enviar Novos Arquivos
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 border border-[#2C2314] hover:border-[#D4AF37] text-[#F5EFE6] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDocumentosSubmit} noValidate className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="doc-name" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      Titular ou Empresa
                    </label>
                    <input
                      id="doc-name"
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="Nome completo ou razão social"
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                    />
                    {docErrors.clientName && (
                      <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                        {docErrors.clientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="doc-taxid" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      CPF ou CNPJ
                    </label>
                    <input
                      id="doc-taxid"
                      type="text"
                      value={docTaxId}
                      onChange={(e) => setDocTaxId(formatCpfCnpj(e.target.value))}
                      placeholder="000.000.000-00 ou 00.000.000/0001-00"
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm font-mono tabular-nums text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                    />
                    {docErrors.taxId && (
                      <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                        {docErrors.taxId}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="doc-category" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                    Pasta / Área Destinatária
                  </label>
                  <select
                    id="doc-category"
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] focus:outline-none"
                  >
                    <option value="Contratos & Societário">Contratos &amp; Societário</option>
                    <option value="Contencioso Estratégico & Arbitragem">Contencioso Estratégico &amp; Arbitragem</option>
                    <option value="Penal Econômico & Compliance">Penal Econômico &amp; Compliance</option>
                    <option value="Planejamento Patrimonial & Sucessório">Planejamento Patrimonial &amp; Sucessório</option>
                    <option value="Procurações & Documentos Pessoais">Procurações &amp; Documentos Pessoais</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor="doc-file-input" className="text-xs font-medium text-[#F5EFE6]">
                      Arquivos (PDF, DOCX, Certidões ou Imagens)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSampleDeclaration}
                      className="text-xs text-[#F3D88B] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Anexar minuta de procuração padrão
                    </button>
                  </div>

                  <label
                    htmlFor="doc-file-input"
                    className="flex flex-col items-center justify-center gap-2 p-5 bg-black border border-dashed border-[#D4AF37]/45 hover:border-[#F3D88B] rounded-md cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
                    <span className="text-xs text-[#F5EFE6] font-medium">
                      Selecionar documentos do dispositivo
                    </span>
                    <span className="text-xs text-[#8C7E65]">
                      Criptografia em trânsito · Múltiplos arquivos permitidos
                    </span>
                    <input
                      id="doc-file-input"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>

                  {docErrors.files && (
                    <p role="alert" className="mt-1.5 text-xs text-[#F3D88B]">
                      {docErrors.files}
                    </p>
                  )}

                  {docFiles.length > 0 && (
                    <ul className="mt-3 divide-y divide-[#2C2314] border border-[#2C2314] rounded-md bg-black">
                      {docFiles.map((file, idx) => (
                        <li key={`${file.name}-${idx}`} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                            <span className="text-[#F5EFE6] truncate">{file.name}</span>
                            <span className="text-[#8C7E65] font-mono tabular-nums shrink-0">
                              ({formatFileSize(file.sizeBytes)})
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remover arquivo ${file.name}`}
                            onClick={() =>
                              setDocFiles((prev) => prev.filter((_, itemIdx) => itemIdx !== idx))
                            }
                            className="p-1 text-[#8C7E65] hover:text-[#F3D88B] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label htmlFor="doc-notes" className="block text-xs font-medium text-[#BFB39C] mb-1.5">
                    Observações para a equipe jurídica (opcional)
                  </label>
                  <input
                    id="doc-notes"
                    type="text"
                    value={docNotes}
                    onChange={(e) => setDocNotes(e.target.value)}
                    placeholder="Ex.: Documentos referentes à assembleia extraordinária"
                    className="w-full px-3.5 py-2 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 border border-[#2C2314] hover:border-[#D4AF37] text-[#BFB39C] hover:text-[#F5EFE6] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Protocolar Documentos
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3. PAGAMENTO */}
        {activeModal === 'pagamento' && (
          <div className="mt-6">
            <h2 id="portal-modal-title" className="font-display text-2xl sm:text-3xl font-semibold text-[#F5EFE6]">
              Central de Pagamento e Honorários
            </h2>
            <p className="mt-1 text-sm text-[#BFB39C]">
              Liquidação transparente de consultas, pareceres técnicos e faturas contratuais.
            </p>

            {payReceipt ? (
              <div className="mt-6 p-5 bg-[#110E09] border border-[#D4AF37]/40 rounded-md space-y-4">
                <div className="flex items-center gap-2 text-[#F3D88B] text-sm font-semibold">
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Comprovante de Liquidação Emitido</span>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-[#2C2314] pt-3">
                  <div>
                    <dt className="text-[#8C7E65]">Autenticação</dt>
                    <dd className="font-mono tabular-nums text-[#F5EFE6] mt-0.5">{payReceipt.protocol}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8C7E65]">Valor Liquidado</dt>
                    <dd className="font-mono tabular-nums text-[#F3D88B] font-semibold mt-0.5">
                      {payReceipt.amountFormatted}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8C7E65]">Pagador</dt>
                    <dd className="text-[#F5EFE6] mt-0.5">{payReceipt.clientName}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8C7E65]">Modalidade</dt>
                    <dd className="text-[#BFB39C] mt-0.5">{payReceipt.title}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPayReceipt(null)}
                    className="py-2 px-4 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Novo Pagamento
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 border border-[#2C2314] hover:border-[#D4AF37] text-[#F5EFE6] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePagamentoSubmit} noValidate className="mt-5 space-y-4">
                <div>
                  <label htmlFor="pay-service" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                    Referência de Honorários
                  </label>
                  <select
                    id="pay-service"
                    value={selectedFeeId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setSelectedFeeId(nextId);
                      const found = FEE_SCHEDULE_OPTIONS.find((item) => item.id === nextId);
                      if (found) {
                        setCustomAmountReais((found.amountCents / 100).toFixed(2).replace('.', ','));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] focus:outline-none"
                  >
                    {FEE_SCHEDULE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} ({formatCurrencyBRL(opt.amountCents)})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-[#8C7E65]">{activeFee.description}</p>
                </div>

                {selectedFeeId === 'retainer-mensal' && (
                  <div>
                    <label htmlFor="pay-custom-amount" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      Valor da Fatura (R$)
                    </label>
                    <input
                      id="pay-custom-amount"
                      type="text"
                      value={customAmountReais}
                      onChange={(e) => setCustomAmountReais(e.target.value)}
                      placeholder="8500,00"
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm font-mono tabular-nums text-[#F3D88B] focus:outline-none"
                    />
                    {payErrors.amountCents && (
                      <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                        {payErrors.amountCents}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pay-name" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      Pagador / Razão Social
                    </label>
                    <input
                      id="pay-name"
                      type="text"
                      value={payName}
                      onChange={(e) => setPayName(e.target.value)}
                      placeholder="Nome ou empresa para nota fiscal"
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                    />
                    {payErrors.clientName && (
                      <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                        {payErrors.clientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pay-taxid" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      CPF ou CNPJ para Nota Fiscal
                    </label>
                    <input
                      id="pay-taxid"
                      type="text"
                      value={payTaxId}
                      onChange={(e) => setPayTaxId(formatCpfCnpj(e.target.value))}
                      placeholder="000.000.000-00 ou 00.000.000/0001-00"
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm font-mono tabular-nums text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                    />
                    {payErrors.taxId && (
                      <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                        {payErrors.taxId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <span className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                    Meio de Pagamento
                  </span>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-black border border-[#2C2314] rounded-md">
                    {(['PIX', 'Cartão Corporativo', 'Boleto Registrado'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPayMethod(method)}
                        className={`py-2 px-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap truncate ${
                          payMethod === method
                            ? 'bg-[#D4AF37] text-black font-semibold'
                            : 'text-[#BFB39C] hover:text-[#F5EFE6]'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {payMethod === 'PIX' && (
                  <div className="p-3.5 bg-black border border-[#2C2314] rounded-md space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#BFB39C]">Chave PIX Institucional (Copia e Cola)</span>
                      <span className="font-mono tabular-nums text-[#F3D88B] font-semibold">
                        {formatCurrencyBRL(currentAmountCents)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        aria-label="Código PIX Copia e Cola"
                        value={pixPayload}
                        className="w-full px-2.5 py-1.5 bg-[#090806] border border-[#2C2314] rounded-sm text-xs font-mono text-[#8C7E65] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="flex items-center gap-1.5 py-1.5 px-3 border border-[#D4AF37]/50 hover:border-[#F3D88B] text-[#F3D88B] text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {copiedPix ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {payMethod === 'Cartão Corporativo' && (
                  <div>
                    <label htmlFor="pay-card" className="block text-xs font-medium text-[#F5EFE6] mb-1.5">
                      Últimos 4 dígitos ou número do Cartão Corporativo
                    </label>
                    <input
                      id="pay-card"
                      type="text"
                      value={cardDigits}
                      onChange={(e) => setCardDigits(e.target.value)}
                      placeholder="Ex.: 4921"
                      className="w-full px-3.5 py-2.5 bg-black border border-[#2C2314] focus:border-[#D4AF37] rounded-md text-sm font-mono tabular-nums text-[#F5EFE6] placeholder:text-[#8C7E65]/60 focus:outline-none"
                    />
                    {payErrors.cardLastFour && (
                      <p role="alert" className="mt-1 text-xs text-[#F3D88B]">
                        {payErrors.cardLastFour}
                      </p>
                    )}
                  </div>
                )}

                {payMethod === 'Boleto Registrado' && (
                  <p className="p-3 bg-black border border-[#2C2314] rounded-md text-xs text-[#BFB39C]">
                    O boleto bancário registrado em favor de{' '}
                    <strong className="text-[#F5EFE6] font-medium">APS — Dr. Adevandro Pereira da Silva (OAB/DF 86.083)</strong>{' '}
                    será emitido com vencimento para 5 dias úteis no valor de{' '}
                    <span className="font-mono tabular-nums text-[#F3D88B]">
                      {formatCurrencyBRL(currentAmountCents)}
                    </span>.
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 border border-[#2C2314] hover:border-[#D4AF37] text-[#BFB39C] hover:text-[#F5EFE6] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#D4AF37] hover:bg-[#F3D88B] text-black text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
