import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPixCopyPasteCode,
  formatCpfCnpj,
  formatCurrencyBRL,
  generateProtocolCode,
  validateComunicar,
  validateConsulta,
  validateDocumentos,
  validatePagamento,
} from './portalValidation';

test('formatCpfCnpj formats 11-digit CPF and 14-digit CNPJ cleanly', () => {
  assert.equal(formatCpfCnpj('12345678901'), '123.456.789-01');
  assert.equal(formatCpfCnpj('12345678000199'), '12.345.678/0001-99');
});

test('validateComunicar rejects empty fields and accepts valid communication', () => {
  const invalid = validateComunicar({
    clientName: 'Jo',
    contact: 'invalido',
    urgency: 'Geral',
    message: 'curto',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.clientName);
  assert.ok(invalid.errors.contact);
  assert.ok(invalid.errors.message);

  const valid = validateComunicar({
    clientName: 'Carlos Eduardo Monteiro',
    contact: 'carlos@monteiroholding.com.br',
    urgency: 'Andamento Processual',
    processNumber: '1045892-22.2025.8.26.0100',
    message: 'Solicito reunião sobre os memoriais do recurso especial.',
  });
  assert.equal(valid.valid, true);
});

test('validateDocumentos enforces CPF/CNPJ and at least one attached file', () => {
  const noFiles = validateDocumentos({
    clientName: 'Construtora Horizonte S.A.',
    taxId: '12.345.678/0001-99',
    category: 'Contratos & Societário',
    files: [],
  });
  assert.equal(noFiles.valid, false);
  assert.ok(noFiles.errors.files);

  const withFiles = validateDocumentos({
    clientName: 'Construtora Horizonte S.A.',
    taxId: '12.345.678/0001-99',
    category: 'Contratos & Societário',
    files: [{ name: 'Acordo_Acionistas_Assinado.pdf', sizeBytes: 420800 }],
  });
  assert.equal(withFiles.valid, true);
});

test('validatePagamento checks payer info, minimum amount, and corporate card digits', () => {
  const badCard = validatePagamento({
    clientName: 'Grupo Vanguarda Ltda',
    taxId: '12345678000199',
    serviceLabel: 'Consulta Jurídica Estratégica',
    amountCents: 150000,
    method: 'Cartão Corporativo',
    cardLastFour: '12',
  });
  assert.equal(badCard.valid, false);
  assert.ok(badCard.errors.cardLastFour);

  const validPix = validatePagamento({
    clientName: 'Grupo Vanguarda Ltda',
    taxId: '12345678000199',
    serviceLabel: 'Consulta Jurídica Estratégica',
    amountCents: 150000,
    method: 'PIX',
  });
  assert.equal(validPix.valid, true);
});

test('validateConsulta validates institutional consultation requests', () => {
  const ok = validateConsulta({
    fullName: 'Dra. Patrícia Azevedo',
    email: 'patricia@azevedoparticipacoes.com.br',
    phone: '(11) 99812-4410',
    area: 'Direito Empresarial & Societário',
    summary: 'Necessitamos de assessoria jurídica para reorganização de holding familiar.',
  });
  assert.equal(ok.valid, true);
});

test('protocol generator and PIX payload include accurate values', () => {
  const protocol = generateProtocolCode('PAG', 7);
  assert.equal(protocol, 'APS-2026-PAG-0007');
  const pix = buildPixCopyPasteCode(protocol, 150000);
  assert.ok(pix.includes('APS-2026-PAG-0007'));
  assert.ok(pix.includes('1500.00'));
  assert.ok(formatCurrencyBRL(150000).includes('1.500,00'));
});
