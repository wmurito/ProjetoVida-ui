import * as yup from 'yup';

// --- ESTRUTURA INICIAL PARA A SEÇÃO DE TRATAMENTO ---
const tratamentoInitialState = {
  cirurgia: {
    contexto_cirurgico: '', // Novo campo para 'Upfront' ou 'Pós Neoadjuvante'
    mamas: [],
    axilas: [],
    reconstrucoes: [],
  },
  quimioterapia: {
    neoadjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    adjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    paliativa: [],
  },
  radioterapia: {
    neoadjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    adjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    paliativa: [],
  },
  endocrinoterapia: {
    neoadjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    adjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    paliativa: [],
  },
  imunoterapia: {
    neoadjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    adjuvante: { data_inicio: '', data_termino: '', esquema: '', intercorrencias: '' },
    paliativa: [],
  },
  imunohistoquimicas: [],
  core_biopsy: {
    realizada: false,
    data: '',
    especime: '',
    tecnica: '',
    tipo_lesao: '',
    anatomopatologico: '',
    tipo_histologico: '',
  },
  mamotomia: {
    realizada: false,
    data: '',
    especime: '',
    tecnica: '',
    tipo_lesao: '',
    anatomopatologico: '',
    tipo_histologico: '',
  },
  paaf: {
    realizada: false,
    data: '',
    especime: '',
    tecnica: '',
    achados: '',
  },
};

// --- ESTRUTURA COMPLETA DO ESTADO INICIAL DO FORMULÁRIO ---
export const initialState = {
  // --- IDENTIFICAÇÃO E DADOS SOCIAIS ---
  nome_completo: '',
  data_nascimento: '',
  genero: '',
  estado_civil: '',
  cor_etnia: '',
  escolaridade: '',
  renda_familiar: '',
  naturalidade: '',
  endereco: '',
  cep: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  telefone: '',
  altura: '',
  peso: '',
  imc: '',
  idade: '',

  // --- HISTÓRIA PATOLÓGICA PREGRESSA ---
  historia_patologica: {
    has: false,
    diabetes: false,
    hipertensao: false,
    hipotireoidismo: false,
    ansiedade: false,
    depressao: false,
    doenca_cardiaca: false,
    doenca_renal: false,
    doenca_pulmonar: false,
    doenca_figado: false,
    avc: false,
    outra: '',
    neoplasia_previa: false,
    qual_neoplasia: '',
    idade_diagnostico_neoplasia: '',
    biopsia_mamaria_previa: false,
    resultado_biopsia: '',
  },
  
  // --- HISTÓRIA FAMILIAR ---
  familiares: [],
  historia_familiar: {
    cancer_familia: false,
    observacoes: '',
  },

  // --- HÁBITOS DE VIDA ---
  habitos_vida: {
    tabagismo: 'nao',
    tabagismo_carga: '',
    tabagismo_tempo_anos: '',
    etilismo: 'nao',
    etilismo_dose_diaria: '',
    etilismo_tempo_anos: '',
    atividade_fisica: 'nao',
    tipo_atividade: '',
    tempo_atividade_semanal_min: '',
  },
  
  // --- PARIDADE ---
  paridade: {
    gesta: '',
    para: '',
    aborto: '',
    teve_filhos: false,
    idade_primeiro_filho: '',
    amamentou: false,
    tempo_amamentacao_meses: '',
    menarca_idade: '',
    menopausa: 'nao',
    idade_menopausa: '',
    uso_trh: false,
    tempo_uso_trh: '',
    tipo_terapia: '',
    uso_aco: false,
    tempo_uso_aco: '',
  },
  
  // --- HISTÓRIA DA DOENÇA ATUAL ---
  historia_doenca: {
    sinal_sintoma_principal: '',
    outro_sinal_sintoma: '',
    data_sintomas: '',
    idade_diagnostico: '',
    ecog: '',
    lado_acometido: '',
    tamanho_tumoral_clinico: '',
    linfonodos_palpaveis: 'nao',
    estadiamento_clinico: '',
    metastase_distancia: false,
    locais_metastase: '',
  },

  // --- MODELOS PREDITORES DE RISCO ---
  modelos_preditores: {
    score_tyrer_cuzick: '',
    score_canrisk: '',
    score_gail: '',
  },


  // --- TRATAMENTO E EVOLUÇÃO ---
  tratamento: tratamentoInitialState,
  desfecho: {
    status_vital: '',
    morte: false,
    data_morte: null,
    causa_morte: '',
    metastase_ocorreu: false,
    recidiva_local: false,
    data_recidiva_local: null,
    cirurgia_recidiva_local: '',
    recidiva_regional: false,
    data_recidiva_regional: null,
    cirurgia_recidiva_regional: '',
    metastases: [],
  },
  tempos_diagnostico: {
    data_primeira_consulta: '',
    data_diagnostico: '',
    data_inicio_tratamento: '',
    data_cirurgia: '',
    eventos: [],
  },
};

// --- SCHEMA DE VALIDAÇÃO (YUP) ---
// Schema expandido para cobrir os campos mais importantes e condicionais.
export const validationSchema = yup.object().shape({
  // --- Aba: Identificação ---
  nome_completo: yup.string().required('O nome completo é obrigatório').min(3, 'O nome deve ter pelo menos 3 caracteres'),
  data_nascimento: yup.date().required('A data de nascimento é obrigatória').typeError('Forneça uma data válida').nullable(),
  genero: yup.string().required('O gênero é obrigatório'),
  endereco: yup.string().required('O endereço é obrigatório'),
  cep: yup.string().required('O CEP é obrigatório'),
  numero: yup.string().required('O número é obrigatório'),
  bairro: yup.string().required('O bairro é obrigatório'),
  cidade: yup.string().required('A cidade é obrigatória'),
  uf: yup.string().required('O UF é obrigatório'),
  telefone: yup.string().required('O telefone é obrigatório'),

  // --- Aba: Histórico (Opcional) ---
  historia_patologica: yup.object().notRequired(),

  habitos_vida: yup.object().notRequired(),

  // --- Aba: Dados Clínicos ---
  historia_doenca: yup.object().shape({
    sinal_sintoma_principal: yup.string().notRequired(),
    data_sintomas: yup.date().notRequired().nullable().typeError('Forneça uma data válida'),
    idade_diagnostico: yup.string().notRequired(),
    lado_acometido: yup.string().notRequired(),
  }),


  // --- Aba: Modelos Preditores de Risco (Opcional) ---
  modelos_preditores: yup.object().shape({
    score_tyrer_cuzick: yup.string().notRequired(),
    score_canrisk: yup.string().notRequired(),
    score_gail: yup.string().notRequired(),
  }),

  // --- Aba: Tratamento e Evolução ---
  desfecho: yup.object().shape({
      data_morte: yup.date().nullable().when('morte', {
          is: true,
          then: (schema) => schema.required('A data do óbito é obrigatória').typeError('Forneça uma data válida'),
          otherwise: (schema) => schema.notRequired(),
      }),
      causa_morte: yup.string().when('morte', {
          is: true,
          then: (schema) => schema.required('A causa da morte é obrigatória'),
          otherwise: (schema) => schema.notRequired(),
      }),
  }),
});

// --- CONFIGURAÇÃO DAS ABAS DO FORMULÁRIO ---
export const tabs = [
  { key: 'identificacao', label: 'Identificação' },
  { key: 'historico', label: 'Histórico' },
  { key: 'dadosClinicos', label: 'Dados Clínicos' },
  { key: 'tratamento', label: 'Tratamento' },
  { key: 'evolucao', label: 'Evolução' },
];

// --- MAPEAMENTO DE ERROS PARA ABAS ---
// ATUALIZADO para refletir a nova estrutura e validações
export const errorFieldToTabMap = {
  // --- Aba: Identificação ---
  nome_completo: 'identificacao',
  data_nascimento: 'identificacao',
  genero: 'identificacao',
  endereco: 'identificacao',
  cep: 'identificacao',
  numero: 'identificacao',
  bairro: 'identificacao',
  cidade: 'identificacao',
  uf: 'identificacao',
  telefone: 'identificacao',
  email: 'identificacao',

  // --- Aba: Histórico ---
  'historia_patologica.neoplasia_previa.qual': 'historico',
  'habitos_vida.tabagismo_carga': 'historico',
  'habitos_vida.tabagismo_tempo_anos': 'historico',
  'familiares': 'historico',

  // --- Aba: Dados Clínicos ---
  'historia_doenca.sinal_sintoma_principal': 'dadosClinicos',
  'historia_doenca.data_sintomas': 'dadosClinicos',
  'historia_doenca.idade_diagnostico': 'dadosClinicos',
  'historia_doenca.lado_acometido': 'dadosClinicos',
  'histologia.tipo_histologico': 'dadosClinicos',
  'histologia.grau_histologico': 'dadosClinicos',
  'modelos_preditores.score_tyrer_cuzick': 'dadosClinicos',
  'modelos_preditores.score_canrisk': 'dadosClinicos',
  'modelos_preditores.score_gail': 'dadosClinicos',

  // --- Aba: Tratamento ---
  'tratamento': 'tratamento',
  
  // --- Aba: Evolução ---
  'desfecho.data_morte': 'evolucao',
  'desfecho.causa_morte': 'evolucao',
  'tempos_diagnostico': 'evolucao',
};


// --- OPÇÕES PARA CAMPOS SELECT ---
export const corEtniaOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'branca', label: 'Branca' },
  { value: 'preta', label: 'Preta' },
  { value: 'parda', label: 'Parda' },
  { value: 'amarela', label: 'Amarela' },
  { value: 'indigena', label: 'Indígena' },
  { value: 'nao_informado', label: 'Não informado' }
];

export const escolaridadeOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'analfabeto', label: 'Analfabeto' },
  { value: 'fundamental_incompleto', label: 'Fundamental Incompleto' },
  { value: 'fundamental_completo', label: 'Fundamental Completo' },
  { value: 'medio_incompleto', label: 'Médio Incompleto' },
  { value: 'medio_completo', label: 'Médio Completo' },
  { value: 'superior_incompleto', label: 'Superior Incompleto' },
  { value: 'superior_completo', label: 'Superior Completo' },
  { value: 'pos_graduacao', label: 'Pós-graduação' }
];

export const rendaFamiliarOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'ate_1_salario', label: 'Até 1 salário mínimo' },
  { value: '1_a_2_salarios', label: '1 a 2 salários mínimos' },
  { value: '2_a_3_salarios', label: '2 a 3 salários mínimos' },
  { value: '3_a_5_salarios', label: '3 a 5 salários mínimos' },
  { value: '5_a_10_salarios', label: '5 a 10 salários mínimos' },
  { value: 'acima_10_salarios', label: 'Acima de 10 salários mínimos' },
  { value: 'nao_informado', label: 'Não informado' }
];
