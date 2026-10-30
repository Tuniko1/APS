export type PortalOptionId = 'comunicar' | 'documentos' | 'pagamento';

export interface PortalRecord {
  id: string;
  protocol: string;
  type: PortalOptionId;
  title: string;
  clientName: string;
  summary: string;
  timestamp: string;
  amountFormatted?: string;
}

export interface ComunicarInput {
  clientName: string;
  contact: string;
  urgency: 'Geral' | 'Andamento Processual' | 'Urgência / Plantão 24h';
  processNumber?: string;
  message: string;
}

export interface DocumentosInput {
  clientName: string;
  taxId: string;
  category: string;
  notes?: string;
  files: Array<{ name: string; sizeBytes: number }>;
}

export interface PagamentoInput {
  clientName: string;
  taxId: string;
  serviceLabel: string;
  amountCents: number;
  method: 'PIX' | 'Cartão Corporativo' | 'Boleto Registrado';
  cardLastFour?: string;
}

export interface ConsultaInput {
  fullName: string;
  email: string;
  phone: string;
  area: string;
  summary: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function formatCurrencyBRL(amountCents: number): string {
  const reais = amountCents / 100;
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function stripDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCpfCnpj(raw: string): string {
  const digits = stripDigits(raw).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function isValidCpfOrCnpjDigits(raw: string): boolean {
  const digits = stripDigits(raw);
  return digits.length === 11 || digits.length === 14;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isValidContact(contact: string): boolean {
  const trimmed = contact.trim();
  if (isValidEmail(trimmed)) return true;
  const digits = stripDigits(trimmed);
  return digits.length >= 10 && digits.length <= 13;
}

export function generateProtocolCode(prefix: 'COM' | 'DOC' | 'PAG' | 'CON', sequence: number): string {
  const padded = String(sequence).padStart(4, '0');
  return `APS-2026-${prefix}-${padded}`;
}

export function buildPixCopyPasteCode(protocol: string, amountCents: number): string {
  const amountStr = (amountCents / 100).toFixed(2);
  return `00020126500014BR.GOV.BCB.PIX0128financeiro@apsadvocacia.adv.br520400005303986540${amountStr.length}${amountStr}5802BR5925APS ADVOCACIA OABDF 860836008BRASILIA62200516${protocol}6304A9F2`;
}

export function validateComunicar(input: ComunicarInput): ValidationResult {
  const errors: Record<string, string> = {};
  if (input.clientName.trim().length < 3) {
    errors.clientName = 'Informe seu nome completo ou razão social.';
  }
  if (!isValidContact(input.contact)) {
    errors.contact = 'Informe um e-mail válido ou telefone com DDD.';
  }
  if (input.message.trim().length < 10) {
    errors.message = 'Descreva sua solicitação com pelo menos 10 caracteres.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateDocumentos(input: DocumentosInput): ValidationResult {
  const errors: Record<string, string> = {};
  if (input.clientName.trim().length < 3) {
    errors.clientName = 'Informe o nome do titular ou empresa.';
  }
  if (!isValidCpfOrCnpjDigits(input.taxId)) {
    errors.taxId = 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.';
  }
  if (!input.category.trim()) {
    errors.category = 'Selecione a natureza documental.';
  }
  if (input.files.length === 0) {
    errors.files = 'Selecione pelo menos um arquivo ou documento para envio.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePagamento(input: PagamentoInput): ValidationResult {
  const errors: Record<string, string> = {};
  if (input.clientName.trim().length < 3) {
    errors.clientName = 'Informe o nome do pagador ou razão social.';
  }
  if (!isValidCpfOrCnpjDigits(input.taxId)) {
    errors.taxId = 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.';
  }
  if (!Number.isFinite(input.amountCents) || input.amountCents < 10000) {
    errors.amountCents = 'O valor mínimo para liquidação é R$ 100,00.';
  }
  if (input.method === 'Cartão Corporativo') {
    const digits = stripDigits(input.cardLastFour ?? '');
    if (digits.length < 4) {
      errors.cardLastFour = 'Informe os 4 últimos dígitos ou número do cartão corporativo.';
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateConsulta(input: ConsultaInput): ValidationResult {
  const errors: Record<string, string> = {};
  if (input.fullName.trim().length < 3) {
    errors.fullName = 'Informe seu nome completo.';
  }
  if (!isValidEmail(input.email)) {
    errors.email = 'Informe um endereço de e-mail corporativo ou pessoal válido.';
  }
  const phoneDigits = stripDigits(input.phone);
  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    errors.phone = 'Informe um telefone ou WhatsApp válido com DDD.';
  }
  if (input.summary.trim().length < 15) {
    errors.summary = 'Apresente um breve resumo da demanda (mínimo de 15 caracteres).';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
