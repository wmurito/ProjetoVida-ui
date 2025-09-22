import * as yup from 'yup';

// --- ESTRUTURA INICIAL PARA A SEÇÃO DE TRATAMENTO ---
// ATUALIZADO para refletir a nova estrutura (Neoadjuvante, Adjuvante, Paliativa)
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
  cpf: '',
  prontuario: '',
  genero: '',
  estado_civil: '',
  cor_etnia: '',
  escolaridade: '',
  renda_familiar: '',
  naturalidade: '',
  profissao: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  telefone: '',
  email: '',
  altura: '',
  peso: '',
  imc: '',
  idade: '',

  // --- HISTÓRIA PATOLÓGICA PREGRESSA ---
  historia_patologica: {
    comorbidades: {
      has: false,
      diabetes: false,
      hipertensao: false,
      doenca_cardiaca: false,
      doenca_renal: false,
      doenca_pulmonar: false,
      doenca_figado: false,
      avc: false,
      outra: '',
    },
    neoplasia_previa: {
      has: false,
      qual: '',
      idade_diagnostico: '',
    },
    biopsia_mamaria_previa: {
      has: false,
      resultado: '',
    },
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
    score_tyrer_cuzick: '',
    score_canrisk: '',
    score_gail: '',
  },

  // --- HISTOLOGIA ---
  histologia: {
    biopsia_pre_tratamento: false,
    tipo_histologico: '',
    grau_histologico: '',
    re: '',
    rp: '',
    ki67: '',
    her2: '',
    fish: '',
    brca: '',
    indice_oncotype: '',
    assinatura_genetica: '',
  },

  // --- TRATAMENTO E EVOLUÇÃO ---
  tratamento: tratamentoInitialState,
  desfecho: {
    status_vital: 'vivo',
    data_morte: '',
    causa_morte: '',
    recidiva_local: false,
    data_recidiva_local: '',
    cirurgia_recidiva_local: '',
    recidiva_regional: false,
    data_recidiva_regional: '',
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
// AVISO: Este schema é um exemplo e precisa ser expandido para cobrir
// todos os campos obrigatórios e condicionais do seu formulário.
export const validationSchema = yup.object().shape({
  nome_completo: yup.string().required('O nome é obrigatório'),
  data_nascimento: yup.date().required('A data de nascimento é obrigatória').nullable(),
  cpf: yup.string().required('O CPF é obrigatório'),
  prontuario: yup.string().required('O prontuário é obrigatório'),
  
  // Exemplo de como validar a nova estrutura de tratamento (pode ser refinado)
  tratamento: yup.object().shape({
    cirurgia: yup.object().shape({
      mamas: yup.array().of(
        yup.object().shape({
          data: yup.date().required('A data da cirurgia é obrigatória').nullable(),
          tecnica: yup.string().required('A técnica é obrigatória'),
          // ... outras validações para os campos da cirurgia de mama
        })
      )
    }),
    // Adicionar validações para quimioterapia, radioterapia, etc.
  }),
  // Adicione aqui as outras validações para todos os campos...
});

// --- CONFIGURAÇÃO DAS ABAS DO FORMULÁRIO ---
export const tabs = [
  { key: 'identificacao', label: 'Identificação' },
  { key: 'historico', label: 'Histórico' },
  { key: 'dadosClinicos', label: 'Dados Clínicos' },
  { key: 'tratamentoEvolucao', label: 'Tratamento e Evolução' },
];

// --- MAPEAMENTO DE ERROS PARA ABAS ---
// ATUALIZADO para refletir a nova estrutura do tratamento
export const errorFieldToTabMap = {
  // --- Aba: Identificação ---
  nome_completo: 'identificacao',
  data_nascimento: 'identificacao',
  cpf: 'identificacao',
  prontuario: 'identificacao',
  // ... (outros campos da aba 'identificacao')

  // --- Aba: Histórico ---
  'historia_patologica.comorbidades': 'historico',
  'familiares': 'historico',
  // ... (outros campos da aba 'historico')

  // --- Aba: Dados Clínicos ---
  'paridade.gesta': 'dadosClinicos',
  'historia_doenca.sinal_sintoma_principal': 'dadosClinicos',
  // ... (outros campos da aba 'dadosClinicos')

  // --- Aba: Tratamento e Evolução ---
  'tratamento': 'tratamentoEvolucao',
  'tratamento.cirurgia': 'tratamentoEvolucao',
  'tratamento.quimioterapia': 'tratamentoEvolucao',
  'tratamento.radioterapia': 'tratamentoEvolucao',
  'tratamento.endocrinoterapia': 'tratamentoEvolucao',
  'tratamento.imunoterapia': 'tratamentoEvolucao',
  // ... (outros campos da aba 'tratamentoEvolucao')
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