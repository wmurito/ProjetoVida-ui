import * as yup from 'yup';

// --- ESTRUTURA INICIAL PARA A SEÇÃO DE TRATAMENTO ---
const tratamentoInitialState = {
  cirurgia: {
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
    realizada: false, data: '', especime: '', tecnica: '', tipo_lesao: '', anatomopatologico: '', tipo_histologico: '',
  },
  mamotomia: {
    realizada: false, data: '', especime: '', tecnica: '', tipo_lesao: '', anatomopatologico: '', tipo_histologico: '',
  },
  paaf: {
    realizada: false, data: '', especime: '', tecnica: '', achados: '',
  },
};

// --- ESTRUTURA COMPLETA DO ESTADO INICIAL DO FORMULÁRIO ---
export const initialState = {
  // --- IDENTIFICAÇÃO E DADOS SOCIAIS ---
  nome_completo: '', data_nascimento: '', cpf: '', prontuario: '', genero: '', estado_civil: '', cor_etnia: '', escolaridade: '', renda_familiar: '', naturalidade: '', profissao: '', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', telefone: '', email: '', altura: '', peso: '', imc: '', idade: '',

  // --- HISTÓRIA PATOLÓGICA PREGRESSA ---
  historia_patologica: {
    comorbidades: { has: false, diabetes: false, hipertensao: false, doenca_cardiaca: false, doenca_renal: false, doenca_pulmonar: false, doenca_figado: false, avc: false, outra: '', },
    neoplasia_previa: { has: false, qual: '', idade_diagnostico: '', },
    biopsia_mamaria_previa: { has: false, resultado: '', },
  },
  
  // --- HISTÓRIA FAMILIAR ---
  familiares: [],
  historia_familiar: { cancer_familia: false, observacoes: '', },

  // --- HÁBITOS DE VIDA ---
  habitos_vida: { tabagismo: 'nao', tabagismo_carga: '', tabagismo_tempo_anos: '', etilismo: 'nao', etilismo_tempo_anos: '', atividade_fisica: 'nao', tipo_atividade: '', tempo_atividade_semanal_min: '', },
  
  // --- PARIDADE ---
  paridade: { gesta: '', para: '', aborto: '', teve_filhos: false, idade_primeiro_filho: '', amamentou: false, tempo_amamentacao_meses: '', menarca_idade: '', menopausa: 'nao', idade_menopausa: '', uso_trh: false, tempo_uso_trh: '', uso_aco: false, tempo_uso_aco: '', },
  
  // --- HISTÓRIA DA DOENÇA ATUAL ---
  historia_doenca: { sinal_soma_principal: '', outro_sinal_sintoma: '', data_sintomas: '', idade_diagnostico: '', ecog: '', lado_acometido: '', tamanho_tumoral_clinico: '', linfonodos_palpaveis: 'nao', estadiamento_clinico: '', metastase_distancia: false, locais_metastase: '', score_tyrer_cuzick: '', score_canrisk: '', score_gail: '', },

  // --- HISTOLOGIA ---
  histologia: { biopsia_pre_tratamento: false, tipo_histologico: '', grau_histologico: '', re: '', rp: '', ki67: '', her2: '', fish: '', brca: '', indice_oncotype: '', assinatura_genetica: '', },

  // --- TRATAMENTO E EVOLUÇÃO ---
  tratamento: tratamentoInitialState,
  desfecho: { status_vital: 'vivo', data_morte: '', causa_morte: '', recidiva_local: false, data_recidiva_local: '', cirurgia_recidiva_local: '', recidiva_regional: false, data_recidiva_regional: '', cirurgia_recidiva_regional: '', metastases: [], },
  tempos_diagnostico: { data_primeira_consulta: '', data_diagnostico: '', data_inicio_tratamento: '', data_cirurgia: '', eventos: [], },
};

// ===============================================================================================
// --- SCHEMA DE VALIDAÇÃO (YUP) COMPLETO ---
// ===============================================================================================
export const validationSchema = yup.object().shape({
    // --- IDENTIFICAÇÃO E DADOS SOCIAIS ---
    nome_completo: yup.string().required('O nome completo é obrigatório.'),
    data_nascimento: yup.date().required('A data de nascimento é obrigatória.').nullable().typeError('Formato de data inválido.'),
    cpf: yup.string().required('O CPF é obrigatório.').matches(/^[0-9]{11}$/, 'CPF deve conter 11 dígitos.'),
    prontuario: yup.string().required('O número do prontuário é obrigatório.'),
    genero: yup.string().required('O gênero é obrigatório.'),
    estado_civil: yup.string().required('O estado civil é obrigatório.'),
    cor_etnia: yup.string().required('A cor/etnia é obrigatória.'),
    email: yup.string().email('Formato de e-mail inválido.').required('O e-mail é obrigatório.'),
    cep: yup.string().matches(/^[0-9]{8}$/, 'CEP deve conter 8 dígitos.'),
    altura: yup.number().positive('Altura deve ser um valor positivo.').typeError('Altura deve ser um número.'),
    peso: yup.number().positive('Peso deve ser um valor positivo.').typeError('Peso deve ser um número.'),

    // --- HISTÓRIA PATOLÓGICA PREGRESSA (com validação condicional) ---
    historia_patologica: yup.object().shape({
        neoplasia_previa: yup.object().shape({
            has: yup.boolean(),
            qual: yup.string().when('has', {
                is: true,
                then: () => yup.string().required('Especifique qual neoplasia prévia.')
            }),
            idade_diagnostico: yup.string().when('has', {
                is: true,
                then: () => yup.string().required('Informe a idade do diagnóstico.')
            }),
        }),
        biopsia_mamaria_previa: yup.object().shape({
            has: yup.boolean(),
            resultado: yup.string().when('has', {
                is: true,
                then: () => yup.string().required('Informe o resultado da biópsia.')
            })
        }),
    }),
    
    // --- HISTÓRIA FAMILIAR (valida a lista de familiares) ---
    familiares: yup.array().of(
        yup.object().shape({
            parentesco: yup.string().required('O parentesco é obrigatório.'),
            idade_diagnostico: yup.number().required('A idade do diagnóstico é obrigatória.').typeError('Idade deve ser um número.'),
        })
    ),

    // --- HÁBITOS DE VIDA (com validação condicional) ---
    habitos_vida: yup.object().shape({
        tabagismo: yup.string(),
        tabagismo_carga: yup.string().when('tabagismo', {
            is: 'sim',
            then: () => yup.string().required('Informe a carga tabágica.')
        }),
        etilismo: yup.string(),
        etilismo_tempo_anos: yup.string().when('etilismo', {
            is: 'sim',
            then: () => yup.string().required('Informe o tempo de etilismo.')
        }),
    }),
    
    // --- PARIDADE (com validação condicional) ---
    paridade: yup.object().shape({
        teve_filhos: yup.boolean(),
        idade_primeiro_filho: yup.string().when('teve_filhos', {
            is: true,
            then: () => yup.string().required('Informe a idade do primeiro filho.')
        }),
        amamentou: yup.boolean(),
        tempo_amamentacao_meses: yup.string().when('amamentou', {
            is: true,
            then: () => yup.string().required('Informe o tempo de amamentação.')
        }),
        uso_trh: yup.boolean(),
        tempo_uso_trh: yup.string().when('uso_trh', {
            is: true,
            then: () => yup.string().required('Informe o tempo de uso de TRH.')
        }),
        uso_aco: yup.boolean(),
        tempo_uso_aco: yup.string().when('uso_aco', {
            is: true,
            then: () => yup.string().required('Informe o tempo de uso de ACO.')
        }),
    }),
    
    // --- HISTÓRIA DA DOENÇA ATUAL (com validação condicional) ---
    historia_doenca: yup.object().shape({
        metastase_distancia: yup.boolean(),
        locais_metastase: yup.string().when('metastase_distancia', {
            is: true,
            then: () => yup.string().required('Informe os locais da metástase.')
        })
    }),

    // --- TRATAMENTO (valida a nova estrutura) ---
    tratamento: yup.object().shape({
        // Cirurgias agora são validadas como arrays de objetos
        cirurgia: yup.object().shape({
            mamas: yup.array().of(yup.object().shape({
                data: yup.date().required('A data é obrigatória.').nullable(),
                tecnica: yup.string().required('A técnica é obrigatória.'),
            })),
            axilas: yup.array().of(yup.object().shape({
                data: yup.date().required('A data é obrigatória.').nullable(),
                tecnica: yup.string().required('A técnica é obrigatória.'),
            })),
            reconstrucoes: yup.array().of(yup.object().shape({
                data: yup.date().required('A data é obrigatória.').nullable(),
                tecnica: yup.string().required('A técnica é obrigatória.'),
            })),
        }),
        // Validação condicional para procedimentos
        core_biopsy: yup.object().when('realizada', {
            is: true,
            then: () => yup.object().shape({
                data: yup.date().required('A data é obrigatória.').nullable(),
                especime: yup.string().required('O espécime é obrigatório.'),
            })
        }),
        mamotomia: yup.object().when('realizada', {
            is: true,
            then: () => yup.object().shape({
                data: yup.date().required('A data é obrigatória.').nullable(),
                especime: yup.string().required('O espécime é obrigatório.'),
            })
        }),
        paaf: yup.object().when('realizada', {
            is: true,
            then: () => yup.object().shape({
                data: yup.date().required('A data é obrigatória.').nullable(),
                especime: yup.string().required('O espécime é obrigatório.'),
            })
        }),
    }),

    // --- DESFECHO (com validação condicional) ---
    desfecho: yup.object().shape({
        status_vital: yup.string(),
        data_morte: yup.date().nullable().when('status_vital', {
            is: 'morto',
            then: () => yup.date().required('A data da morte é obrigatória.').typeError('Formato de data inválido.')
        }),
        causa_morte: yup.string().when('status_vital', {
            is: 'morto',
            then: () => yup.string().required('A causa da morte é obrigatória.')
        }),
    }),
});

// --- CONFIGURAÇÃO DAS ABAS DO FORMULÁRIO ---
export const tabs = [
  { key: 'identificacao', label: 'Identificação' },
  { key: 'historico', label: 'Histórico' },
  { key: 'dadosClinicos', label: 'Dados Clínicos' },
  { key: 'tratamentoEvolucao', label: 'Tratamento e Evolução' },
];

// --- MAPEAMENTO DE ERROS PARA ABAS ---
export const errorFieldToTabMap = {
  // Aba: Identificação
  nome_completo: 'identificacao', data_nascimento: 'identificacao', cpf: 'identificacao', prontuario: 'identificacao', genero: 'identificacao', estado_civil: 'identificacao', cor_etnia: 'identificacao', escolaridade: 'identificacao', renda_familiar: 'identificacao', naturalidade: 'identificacao', profissao: 'identificacao', cep: 'identificacao', logradouro: 'identificacao', numero: 'identificacao', complemento: 'identificacao', bairro: 'identificacao', cidade: 'identificacao', uf: 'identificacao', telefone: 'identificacao', email: 'identificacao', altura: 'identificacao', peso: 'identificacao',

  // Aba: Histórico
  'historia_patologica.neoplasia_previa.qual': 'historico', 'historia_patologica.biopsia_mamaria_previa.resultado': 'historico', 'familiares': 'historico', 'habitos_vida.tabagismo_carga': 'historico', 'habitos_vida.etilismo_tempo_anos': 'historico',

  // Aba: Dados Clínicos
  'paridade.idade_primeiro_filho': 'dadosClinicos', 'paridade.tempo_amamentacao_meses': 'dadosClinicos', 'paridade.tempo_uso_trh': 'dadosClinicos', 'paridade.tempo_uso_aco': 'dadosClinicos', 'historia_doenca.locais_metastase': 'dadosClinicos',

  // Aba: Tratamento e Evolução
  'tratamento': 'tratamentoEvolucao', 'desfecho.data_morte': 'tratamentoEvolucao', 'desfecho.causa_morte': 'tratamentoEvolucao',
};

// --- OPÇÕES PARA CAMPOS SELECT ---
export const corEtniaOptions = [ { value: '', label: 'Selecione...' }, { value: 'branca', label: 'Branca' }, { value: 'preta', label: 'Preta' }, { value: 'parda', label: 'Parda' }, { value: 'amarela', label: 'Amarela' }, { value: 'indigena', label: 'Indígena' }, { value: 'nao_informado', label: 'Não informado' } ];
export const escolaridadeOptions = [ { value: '', label: 'Selecione...' }, { value: 'analfabeto', label: 'Analfabeto' }, { value: 'fundamental_incompleto', label: 'Fundamental Incompleto' }, { value: 'fundamental_completo', label: 'Fundamental Completo' }, { value: 'medio_incompleto', label: 'Médio Incompleto' }, { value: 'medio_completo', label: 'Médio Completo' }, { value: 'superior_incompleto', label: 'Superior Incompleto' }, { value: 'superior_completo', label: 'Superior Completo' }, { value: 'pos_graduacao', label: 'Pós-graduação' } ];
export const rendaFamiliarOptions = [ { value: '', label: 'Selecione...' }, { value: 'ate_1_salario', label: 'Até 1 salário mínimo' }, { value: '1_a_2_salarios', label: '1 a 2 salários mínimos' }, { value: '2_a_3_salarios', label: '2 a 3 salários mínimos' }, { value: '3_a_5_salarios', label: '3 a 5 salários mínimos' }, { value: '5_a_10_salarios', label: '5 a 10 salários mínimos' }, { value: 'acima_10_salarios', label: 'Acima de 10 salários mínimos' }, { value: 'nao_informado', label: 'Não informado' } ];