import * as yup from 'yup';

// AVISO: O schema de validação (yup) é um exemplo e precisa ser
// detalhadamente implementado para validar a nova e complexa estrutura de dados.
export const validationSchema = yup.object().shape({
  nome_completo: yup.string().required('O nome é obrigatório'),
  data_nascimento: yup.date().required('A data de nascimento é obrigatória').nullable(),
  cpf: yup.string().required('O CPF é obrigatório'),
  prontuario: yup.string().required('O prontuário é obrigatório'),
  // Adicione aqui as outras validações para todos os campos...
});

const tratamentoInitialState = {
  // ATUALIZADO: Cirurgia agora contém arrays para múltiplos registros
  cirurgia: {
    mamas: [],
    axilas: [],
    reconstrucoes: [],
  },
  quimioterapias: [],
  radioterapias: [],
  endocrinoterapias: [],
  imunoterapias: [],
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

// --- CONFIGURAÇÃO DAS ABAS DO FORMULÁRIO ---
export const tabs = [
  { key: 'identificacao', label: 'Identificação' },
  { key: 'historico', label: 'Histórico' },
  { key: 'dadosClinicos', label: 'Dados Clínicos' },
  { key: 'tratamentoEvolucao', label: 'Tratamento e Evolução' },
];

// --- MAPEAMENTO DE ERROS PARA ABAS ---
export const errorFieldToTabMap = {
  // --- Aba: Identificação ---
  nome_completo: 'identificacao',
  data_nascimento: 'identificacao',
  cpf: 'identificacao',
  prontuario: 'identificacao',
  genero: 'identificacao',
  estado_civil: 'identificacao',
  cor_etnia: 'identificacao',
  escolaridade: 'identificacao',
  renda_familiar: 'identificacao',
  naturalidade: 'identificacao',
  profissao: 'identificacao',
  cep: 'identificacao',
  logradouro: 'identificacao',
  numero: 'identificacao',
  complemento: 'identificacao',
  bairro: 'identificacao',
  cidade: 'identificacao',
  uf: 'identificacao',
  telefone: 'identificacao',
  email: 'identificacao',
  altura: 'identificacao',
  peso: 'identificacao',
  imc: 'identificacao',

  // --- Aba: Histórico ---
  'historia_patologica.comorbidades': 'historico',
  'historia_patologica.neoplasia_previa': 'historico',
  'historia_patologica.biopsia_mamaria_previa': 'historico',
  'historia_familiar.cancer_familia': 'historico',
  'familiares': 'historico',
  'habitos_vida.tabagismo': 'historico',
  'habitos_vida.etilismo': 'historico',
  'habitos_vida.atividade_fisica': 'historico',

  // --- Aba: Dados Clínicos ---
  'paridade.gesta': 'dadosClinicos',
  'paridade.para': 'dadosClinicos',
  'paridade.aborto': 'dadosClinicos',
  'paridade.teve_filhos': 'dadosClinicos',
  'paridade.amamentou': 'dadosClinicos',
  'paridade.menarca_idade': 'dadosClinicos',
  'paridade.menopausa': 'dadosClinicos',
  'paridade.uso_trh': 'dadosClinicos',
  'paridade.uso_aco': 'dadosClinicos',
  'historia_doenca.sinal_sintoma_principal': 'dadosClinicos',
  'historia_doenca.idade_diagnostico': 'dadosClinicos',
  'historia_doenca.ecog': 'dadosClinicos',
  'historia_doenca.lado_acometido': 'dadosClinicos',
  'histologia.biopsia_pre_tratamento': 'dadosClinicos',
  'histologia.tipo_histologico': 'dadosClinicos',
  'histologia.grau_histologico': 'dadosClinicos',

  // --- Aba: Tratamento e Evolução ---
  'tratamento': 'tratamentoEvolucao',
  'tratamento.cirurgia': 'tratamentoEvolucao',
  'tratamento.quimioterapias': 'tratamentoEvolucao',
  'tratamento.radioterapia': 'tratamentoEvolucao',
  'tratamento.endocrinoterapias': 'tratamentoEvolucao',
  'tratamento.imunoterapias': 'tratamentoEvolucao',
  'tratamento.imunohistoquimicas': 'tratamentoEvolucao',
  'tratamento.core_biopsy': 'tratamentoEvolucao',
  'tratamento.mamotomia': 'tratamentoEvolucao',
  'desfecho.status_vital': 'tratamentoEvolucao',
  'desfecho.recidiva_local': 'tratamentoEvolucao',
  'desfecho.recidiva_regional': 'tratamentoEvolucao',
  'desfecho.metastases': 'tratamentoEvolucao',
  'tempos_diagnostico.data_primeira_consulta': 'tratamentoEvolucao',
  'tempos_diagnostico.data_diagnostico': 'tratamentoEvolucao',
  'tempos_diagnostico.data_inicio_tratamento': 'tratamentoEvolucao',
  'tempos_diagnostico.data_cirurgia': 'tratamentoEvolucao',
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