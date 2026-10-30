export interface PracticeArea {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  leadPartner: string;
}

export interface LegalPrecedent {
  id: string;
  sector: string;
  matter: string;
  metric: string;
  timeframe: string;
  outcome: string;
  attribution: string;
}

export interface FeeScheduleOption {
  id: string;
  label: string;
  description: string;
  amountCents: number;
}

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 'contencioso',
    index: '01.',
    title: 'Contencioso Estratégico & Tribunais Superiores',
    subtitle: 'Atuação direta em Brasília perante o STJ, STF, TRFs e câmaras arbitrais.',
    description:
      'Condução técnica e artesanal de recursos especiais, extraordinários, medidas cautelares de urgência, sustentações orais e memoriais estratégicos perante os Tribunais Superiores em Brasília/DF.',
    deliverables: [
      'Recursos especiais, extraordinários, agravos e ações rescisórias no STJ e STF',
      'Medidas cautelares e tutelas de urgência para proteção imediata de direitos e ativos',
      'Memoriais personalizados e sustentação oral presencial nos colegiados superiores',
    ],
    leadPartner: 'Dr. Adevandro Pereira da Silva · OAB/DF 86.083',
  },
  {
    id: 'empresarial',
    index: '02.',
    title: 'Direito Empresarial & Contratual',
    subtitle: 'Estruturação societária, contratos empresariais e resolução de conflitos corporativos.',
    description:
      'Assessoria jurídica para empresários, sociedades e grupos econômicos na blindagem contratual, negociações complexas, reorganizações societárias e prevenção de passivos.',
    deliverables: [
      'Elaboração e revisão estratégica de contratos empresariais e acordos de sócios',
      ' Mediação e contencioso societário em dissoluções e apuração de haveres',
      'Consultoria jurídica preventiva para tomada de decisão executiva',
    ],
    leadPartner: 'Dr. Adevandro Pereira da Silva · OAB/DF 86.083',
  },
  {
    id: 'penal-economico',
    index: '03.',
    title: 'Direito Penal & Garantias Fundamentais',
    subtitle: 'Defesa técnica intransigente em inquéritos, ações penais e medidas de urgência.',
    description:
      'Representação combativa e sigilosa em procedimentos investigativos, operações policiais, crimes empresariais e financeiros, com atuação imediata em habeas corpus nos Tribunais.',
    deliverables: [
      'Atendimento de urgência em medidas cautelares, buscas e audiências',
      'Impetração de Habeas Corpus e recursos perante TJDFT, TRFs, STJ e STF',
      'Acompanhamento estratégico em inquéritos e procedimentos administrativos',
    ],
    leadPartner: 'Dr. Adevandro Pereira da Silva · OAB/DF 86.083',
  },
  {
    id: 'patrimonial',
    index: '04.',
    title: 'Direito Civil, Patrimonial & Sucessões',
    subtitle: 'Proteção patrimonial, responsabilidade civil, imóveis e planejamento sucessório.',
    description:
      'Arquitetura jurídica segura para preservação de bens familiares, regularização e disputas imobiliárias de alto valor, inventários judiciais e extrajudiciais e holdings.',
    deliverables: [
      'Constituição de holdings patrimoniais e planejamento sucessório familiar',
      'Inventários extrajudiciais célere em cartório e inventários judiciais complexos',
      'Ações possessórias, imobiliárias e indenizatórias de alta relevância',
    ],
    leadPartner: 'Dr. Adevandro Pereira da Silva · OAB/DF 86.083',
  },
  {
    id: 'administrativo-tributario',
    index: '05.',
    title: 'Direito Administrativo & Tributário',
    subtitle: 'Defesa perante órgãos públicos, tribunais de contas, autuações fiscais e licitações.',
    description:
      'Atuação especializada em processos administrativos disciplinares, improbidade, licitações, contratos públicos e anulação de exigências fiscais indevidas.',
    deliverables: [
      'Defesas administrativas e judiciais perante órgãos federais, TCU e TCDF',
      'Mandados de segurança contra atos coatores e bloqueios patrimoniais',
      'Defesa em execuções fiscais, autuações e transações tributárias',
    ],
    leadPartner: 'Dr. Adevandro Pereira da Silva · OAB/DF 86.083',
  },
];

export const LEGAL_PRECEDENTS: LegalPrecedent[] = [
  {
    id: 'prec-1',
    sector: 'Tribunais Superiores · Brasília/DF',
    matter: 'Reversão de Decisão e Preservação de Ativos Empresariais',
    metric: 'Tutela Deferida',
    timeframe: 'Medida urgente em 48 horas',
    outcome:
      'Suspensão imediata de constrição patrimonial desproporcional mediante efeito suspensivo em recurso perante instância superior, assegurando plena continuidade empresarial.',
    attribution: 'Contencioso Estratégico · Atuação em Brasília/DF',
  },
  {
    id: 'prec-2',
    sector: 'Blindagem Contratual & Societária',
    matter: 'Reestruturação Patrimonial e Acordo Extrajudicial',
    metric: '100% Preservado',
    timeframe: 'Concluído em 4 meses',
    outcome:
      'Composição societária definitiva com blindagem jurídica dos ativos operacionais e quitação integral de obrigações sem necessidade de litígio prolongado.',
    attribution: 'Consultivo & Societário · Grupo Empresarial',
  },
  {
    id: 'prec-3',
    sector: 'Garantias Constitucionais & Administrativo',
    matter: 'Anulação de Penalidade Administrativa e Fiscal',
    metric: 'Êxito Integral',
    timeframe: 'Decisão colegiada unânime',
    outcome:
      'Reconhecimento de nulidade material em auto administrativo com restabelecimento imediato das certidões de regularidade e direitos da parte representada.',
    attribution: 'Direito Público · Distrito Federal',
  },
];

export const FEE_SCHEDULE_OPTIONS: FeeScheduleOption[] = [
  {
    id: 'consulta-estrategica',
    label: 'Consulta Jurídica Estratégica — Dr. Adevandro Pereira da Silva',
    description: 'Sessão confidencial de diagnóstico técnico (presencial em Brasília/DF ou videoconferência) com diretriz jurídica.',
    amountCents: 150000,
  },
  {
    id: 'parecer-preliminar',
    label: 'Parecer Jurídico & Análise Técnica de Processo',
    description: 'Exame aprofundado de autos, contratos ou inquéritos com definição fundamentada da tese jurídica.',
    amountCents: 480000,
  },
  {
    id: 'retainer-mensal',
    label: 'Liquidação de Honorários Contratuais / Custas',
    description: 'Quitação de parcela contratual, honorários pactuados ou provisão de custas processuais.',
    amountCents: 850000,
  },
];
