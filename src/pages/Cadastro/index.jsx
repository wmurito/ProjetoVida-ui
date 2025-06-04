import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import api, { getAuthToken } from '../../services/api'; // Ajuste o caminho se necessário
import {
  Container,
  FormContainer,
  Section,
  SectionTitle,
  FormGrid,
  FieldContainer,
  InputLabel,
  StyledInput,
  StyledCheckbox,
  // CheckboxContainer, // Less used now, but kept in styles for flexibility
  CheckboxLabel,
  Button,
  FixedSubmitButton,
  SuccessMessage,
  StyledSelect,
  ErrorText,
  ApiErrorContainer
} from './styles';

// Options and Validation Schema (NO CHANGES from your previous version)
const corEtniaOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'BRANCO', label: 'Branco' },
  { value: 'PARDO', label: 'Pardo' },
  { value: 'PRETO', label: 'Preto' },
  { value: 'INDÍGENA', label: 'Indígena' },
  { value: 'AMARELO', label: 'Amarelo' },
];

const escolaridadeOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'SEM_INSTRUCAO', label: 'Sem Instrução' },
  { value: 'ENSINO_FUNDAMENTAL_INCOMPLETO', label: 'Ensino Fundamental Incompleto' },
  { value: 'ENSINO_FUNDAMENTAL_COMPLETO', label: 'Ensino Fundamental Completo' },
  { value: 'ENSINO_MEDIO_INCOMPLETO', label: 'Ensino Médio Incompleto' },
  { value: 'ENSINO_MEDIO_COMPLETO', label: 'Ensino Médio Completo' },
  { value: 'ENSINO_SUPERIOR_INCOMPLETO', label: 'Ensino Superior Incompleto' },
  { value: 'ENSINO_SUPERIOR_COMPLETO', label: 'Ensino Superior Completo' },
];

const rendaFamiliarOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'SEM_RENDA', label: 'Sem Renda' },
  { value: 'ATE_1_SALARIO_MINIMO', label: 'Até 1 Salário Mínimo' },
  { value: '1_A_2_SALARIOS_MINIMOS', label: '1 a 2 Salários Mínimos' },
  { value: '2_A_5_SALARIOS_MINIMOS', label: '2 a 5 Salários Mínimos' },
  { value: 'MAIOR_QUE_5_SALARIOS_MINIMOS', label: 'Maior que 5 Salários Mínimos' },
];

const validationSchema = yup.object().shape({
  nome_completo: yup.string().required('Nome completo é obrigatório.'),
  idade: yup.number().required('Idade é obrigatória.').positive('Idade deve ser positiva.').integer('Idade deve ser um número inteiro.').typeError('Idade inválida (somente números).').max(150, 'Idade improvável.'),
  endereco: yup.string().required('Endereço é obrigatório.'),
  cidade: yup.string().required('Cidade é obrigatória.'),
  data_nascimento: yup.date().required('Data de nascimento é obrigatória.').max(new Date(), "Data de nascimento não pode ser no futuro.").typeError('Data inválida.'),
  telefone: yup.string().matches(/^(\d{10,11})?$/, 'Telefone inválido (10 ou 11 dígitos, apenas números).').transform(value => value === '' ? null : value).nullable(),
  naturalidade: yup.string().required('Naturalidade é obrigatória.'),
  altura: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).nullable().positive('Altura deve ser positiva.').min(0.3, "Altura mínima de 0.3m").max(3.0, "Altura máxima de 3.0m").typeError('Altura inválida se preenchida incorretamente.'),
  peso: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).nullable().positive('Peso deve ser positivo.').min(1, "Peso mínimo de 1kg").max(500, "Peso máximo de 500kg").typeError('Peso inválido se preenchido incorretamente.'),
  imc: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).nullable().typeError('IMC inválido se preenchido incorretamente.'),
  cor_etnia: yup.string().required('Cor/Etnia é obrigatória.'),
  escolaridade: yup.string().required('Escolaridade é obrigatória.'),
  renda_familiar: yup.string().required('Renda familiar é obrigatória.'),
  historia_patologica: yup.object().shape({
    hipertensao: yup.boolean().nullable(),
    hipotireoidismo: yup.boolean().nullable(),
    ansiedade: yup.boolean().nullable(),
    depressao: yup.boolean().nullable(),
    diabetes: yup.boolean().nullable(),
    outros: yup.string().transform(value => value === '' ? null : value).nullable(),
  }).nullable().default(undefined),
  historia_familiar: yup.object().shape({
    cancer_mama: yup.boolean().nullable(),
    parentesco_mama: yup.string().transform(value => value === '' ? null : value).when('cancer_mama', {is: true, then: (schema) => schema.required('Parentesco (mama) é obrigatório se Câncer de Mama for selecionado.'), otherwise: (schema) => schema.nullable()}),
    idade_diagnostico_mama: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value))
        .when('cancer_mama', {is: true, then: (schema) => schema.required('Idade diagnóstico (mama) é obrigatória.').positive().integer().typeError('Idade inválida.'), 
        otherwise: (schema) => schema.nullable().default(undefined)}),
    cancer_ovario: yup.boolean().nullable(),
    parentesco_ovario: yup.string().transform(value => value === '' ? null : value).when('cancer_ovario', {is: true, then: (schema) => schema.required('Parentesco (ovário) é obrigatório se Câncer de Ovário for selecionado.'), otherwise: (schema) => schema.nullable()}),
    idade_diagnostico_ovario: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value))
        .when('cancer_ovario', {is: true, then: (schema) => schema.required('Idade diagnóstico (ovário) é obrigatória.').positive().integer().typeError('Idade inválida.'), 
        otherwise: (schema) => schema.nullable().default(undefined)}),
    outros: yup.string().transform(value => value === '' ? null : value).nullable(),
  }).nullable().default(undefined),
  habitos_vida: yup.object().shape({
    tabagismo_carga: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0, "Deve ser positivo ou zero").nullable().typeError('Carga tabágica inválida.'),
    tabagismo_tempo_anos: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0, "Deve ser positivo ou zero").nullable().typeError('Tempo de tabagismo inválido.'),
    etilismo_dose_diaria: yup.string().transform(value => value === '' ? null : value).nullable(),
    etilismo_tempo_anos: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0, "Deve ser positivo ou zero").nullable().typeError('Tempo de etilismo inválido.'),
  }).nullable().default(undefined),
  paridade: yup.object().shape({ 
    gesta: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Nº de gestações inválido.'),
    para: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Nº de partos inválido.'),
    aborto: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Nº de abortos inválido.'),
    idade_primeiro_filho: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Idade inválida.'),
    amamentou: yup.boolean().nullable(),
    tempo_amamentacao_meses: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value))
        .when('amamentou', {is: true, then: (schema) => schema.required("Tempo de amamentação obrigatório.").min(0).integer().typeError('Tempo inválido.'), 
        otherwise: (schema) => schema.nullable().default(undefined)}),
    menarca_idade: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Idade da menarca inválida.'),
    menopausa: yup.boolean().nullable(),
    idade_menopausa: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value))
        .when('menopausa', {is: true, then: (schema) => schema.required("Idade da menopausa obrigatória.").min(0).integer().typeError('Idade inválida.'), 
        otherwise: (schema) => schema.nullable().default(undefined)}),
    trh_uso: yup.boolean().nullable(),
    tempo_uso_trh: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value))
        .when('trh_uso', {is: true, then: (schema) => schema.required("Tempo de uso TRH obrigatório.").min(0).typeError('Tempo inválido.'), 
        otherwise: (schema) => schema.nullable().default(undefined)}),
    tipo_terapia: yup.string().transform(value => value === '' ? null : value).when('trh_uso', {is: true, then: (schema) => schema.required("Tipo de terapia TRH obrigatório."), otherwise: (schema) => schema.nullable()}),
  }).nullable().default(undefined),
  historia_doenca: yup.object().shape({
      idade_diagnostico: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Idade ao diagnóstico inválida.'),
      score_tyrer_cuzick: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).nullable().typeError('Score inválido.'),
      score_canrisk: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).nullable().typeError('Score inválido.'),
      score_gail: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).nullable().typeError('Score inválido.')
  }).nullable().default(undefined),
  histologia: yup.object().shape({ 
    subtipo_core_re: yup.string().transform(value => value === '' ? null : value).nullable(),
    subtipo_core_rp: yup.string().transform(value => value === '' ? null : value).nullable(),
    subtipo_core_her2: yup.string().transform(value => value === '' ? null : value).nullable(),
    subtipo_core_ki67: yup.string().transform(value => value === '' ? null : value).nullable(),
    subtipo_cirurgia_re: yup.string().transform(value => value === '' ? null : value).nullable(),
    subtipo_cirurgia_rp: yup.string().transform(value => value === '' ? null : value).nullable(),
    subtipo_cirurgia_her2: yup.string().transform(value => value === '' ? null : value).nullable(),
    subtipo_cirurgia_ki67: yup.string().transform(value => value === '' ? null : value).nullable(),
    tamanho_tumoral: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).nullable().typeError('Tamanho tumoral inválido.'),
    grau_tumoral_cirurgia: yup.string().transform(value => value === '' ? null : value).nullable(),
    margens_comprometidas: yup.boolean().nullable(),
    margens_local: yup.string().transform(value => value === '' ? null : value).when('margens_comprometidas', {is: true, then: (schema) => schema.required('Local das margens é obrigatório.'), otherwise: (schema) => schema.nullable()}),
    biopsia_linfonodo_sentinela: yup.boolean().nullable(),
    bls_numerador: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Valor inválido.'),
    bls_denominador: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Valor inválido.'),
    linfadenectomia_axilar: yup.boolean().nullable(),
    ea_numerador: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Valor inválido.'),
    ea_denominador: yup.number().transform(value => (isNaN(value) || value === null || value === '' ? undefined : value)).min(0).integer().nullable().typeError('Valor inválido.'),
  }).nullable().default(undefined),
  tratamento: yup.object().shape({
    tratamento_neoadjuvante: yup.boolean().nullable(),
    inicio_neoadjuvante: yup.string()
      .nullable()
      .transform(value => (value === '' ? null : value))
      .test('is-date', 'Data de início neoadjuvante inválida se preenchida incorretamente.', (value) => {
        if (!value) return true; // Allow empty
        const date = new Date(value);
        return !isNaN(date.getTime());
      }),
    termino_neoadjuvante: yup.string()
      .nullable()
      .transform(value => (value === '' ? null : value))
      .test('is-date', 'Data de término neoadjuvante inválida se preenchida incorretamente.', (value) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      })
      .when('inicio_neoadjuvante', (inicio_neoadjuvante, schema) => {
        // In Yup 1.x, the value is often passed as an array: [actualValue, context]
        // For robust handling, check if it's an array and take the first element, or use directly.
        const inicioValue = Array.isArray(inicio_neoadjuvante) ? inicio_neoadjuvante[0] : inicio_neoadjuvante;
        if (inicioValue) {
          return schema.test('is-after', 'Término deve ser após o início.', (termino) => {
            if (!termino) return true;
            const inicioDate = new Date(inicioValue);
            const terminoDate = new Date(termino);
            return !isNaN(inicioDate.getTime()) && !isNaN(terminoDate.getTime()) ? terminoDate >= inicioDate : true;
          });
        }
        return schema;
      }),
    qual_neoadjuvante: yup.string().transform(value => value === '' ? null : value).nullable(),
    estagio_clinico_pre_qxt: yup.string().transform(value => value === '' ? null : value).nullable(),
    imunoterapia: yup.boolean().nullable(),
    adjuvancia: yup.boolean().nullable(),
    quimioterapia: yup.string().transform(value => value === '' ? null : value).nullable(),
    inicio_quimioterapia: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
    fim_quimioterapia: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
    radioterapia_tipo: yup.string().transform(value => value === '' ? null : value).nullable(),
    radioterapia_sessoes: yup.number().nullable()
      .transform(value => (value === '' || value === null || isNaN(value) ? undefined : value))
      .min(0, 'Número de sessões não pode ser negativo.')
      .integer('Número de sessões deve ser um número inteiro.'),
    inicio_radioterapia: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
    fim_radioterapia: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
    endocrinoterapia: yup.string().transform(value => value === '' ? null : value).nullable(),
    inicio_endocrino: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
    fim_endocrino: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
    terapia_alvo: yup.string().transform(value => value === '' ? null : value).nullable(),
    inicio_terapia_alvo: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
    fim_terapia_alvo: yup.string().nullable().transform(value => (value === '' ? null : value))
      .test('is-date', 'Data inválida se preenchida incorretamente.', value => !value || !isNaN(new Date(value).getTime())),
  }).nullable().default(undefined),
  desfecho: yup.object().shape({
    morte: yup.boolean().nullable(),
    data_morte: yup.string().nullable().transform(value => (value === '' ? null : value))
      .when('morte', {
        is: true,
        then: schema => schema.required('Data da morte é obrigatória.')
                             .test('is-date', 'Data inválida.', value => !value || !isNaN(new Date(value).getTime())),
        otherwise: schema => schema.test('is-date', 'Data inválida se preenchida incorretamente', value => !value || !isNaN(new Date(value).getTime())),
      }),
    causa_morte: yup.string().transform(value => (value === '' ? null : value))
      .when('morte', {
        is: true,
        then: schema => schema.required('Causa da morte é obrigatória.'),
        otherwise: schema => schema.nullable(),
      }),
    metastase: yup.boolean().nullable(),
    data_metastase: yup.string().nullable().transform(value => (value === '' ? null : value))
      .when('metastase', {
        is: true,
        then: schema => schema.required('Data da metástase é obrigatória.')
                               .test('is-date', 'Data inválida.', value => !value || !isNaN(new Date(value).getTime())),
        otherwise: schema => schema.test('is-date', 'Data inválida se preenchida incorretamente', value => !value || !isNaN(new Date(value).getTime())),
      }),
    local_metastase: yup.string().transform(value => (value === '' ? null : value))
      .when('metastase', {
        is: true,
        then: schema => schema.required('Local da metástase é obrigatório.'),
        otherwise: schema => schema.nullable(),
      }),
    recidiva_local: yup.boolean().nullable(),
    data_recidiva_local: yup.string().nullable().transform(value => (value === '' ? null : value))
      .when('recidiva_local', {
        is: true,
        then: schema => schema.required('Data da recidiva local é obrigatória.')
                                .test('is-date', 'Data inválida.', value => !value || !isNaN(new Date(value).getTime())),
        otherwise: schema => schema.test('is-date', 'Data inválida se preenchida incorretamente', value => !value || !isNaN(new Date(value).getTime())),
      }),
    recidiva_regional: yup.boolean().nullable(),
    data_recidiva_regional: yup.string().nullable().transform(value => (value === '' ? null : value))
      .when('recidiva_regional', {
        is: true,
        then: schema => schema.required('Data da recidiva regional é obrigatória.')
                                  .test('is-date', 'Data inválida.', value => !value || !isNaN(new Date(value).getTime())),
        otherwise: schema => schema.test('is-date', 'Data inválida se preenchida incorretamente', value => !value || !isNaN(new Date(value).getTime())),
      }),
    sitio_recidiva_regional: yup.string().transform(value => (value === '' ? null : value))
      .when('recidiva_regional', {
        is: true,
        then: schema => schema.required('Sítio da recidiva regional é obrigatório.'),
        otherwise: schema => schema.nullable(),
      }),
  }).nullable().default(undefined),
  tempos_diagnostico: yup.object().shape({
    data_mamografia: yup.date().transform((value, originalValue) => originalValue === "" || originalValue === null ? null : (value instanceof Date && !isNaN(value) ? value : new Date(NaN)) ).nullable().typeError("Data inválida se preenchida incorretamente"),
    data_usg: yup.date().transform((value, originalValue) => originalValue === "" || originalValue === null ? null : (value instanceof Date && !isNaN(value) ? value : new Date(NaN)) ).nullable().typeError("Data inválida se preenchida incorretamente"),
    data_rm: yup.date().transform((value, originalValue) => originalValue === "" || originalValue === null ? null : (value instanceof Date && !isNaN(value) ? value : new Date(NaN)) ).nullable().typeError("Data inválida se preenchida incorretamente"),
    data_primeira_consulta: yup.date().transform((value, originalValue) => originalValue === "" || originalValue === null ? null : (value instanceof Date && !isNaN(value) ? value : new Date(NaN)) ).nullable().typeError("Data inválida se preenchida incorretamente"),
    data_core_biopsy: yup.date().transform((value, originalValue) => originalValue === "" || originalValue === null ? null : (value instanceof Date && !isNaN(value) ? value : new Date(NaN)) ).nullable().typeError("Data inválida se preenchida incorretamente"),
    data_cirurgia: yup.date().transform((value, originalValue) => originalValue === "" || originalValue === null ? null : (value instanceof Date && !isNaN(value) ? value : new Date(NaN)) ).nullable().typeError("Data inválida se preenchida incorretamente"),
  }).nullable().default(undefined),
});

const initialState = { /* NO CHANGES from your previous version */
    nome_completo: '',
    idade: '',
    endereco: '',
    cidade: '',
    data_nascimento: '',
    telefone: '',
    naturalidade: '',
    altura: '',
    peso: '',
    imc: '',
    cor_etnia: '',
    escolaridade: '',
    renda_familiar: '',
    historia_patologica: {
      hipertensao: false, hipotireoidismo: false, ansiedade: false,
      depressao: false, diabetes: false, outros: ''
    },
    historia_familiar: {
      cancer_mama: false, parentesco_mama: '', idade_diagnostico_mama: '',
      cancer_ovario: false, parentesco_ovario: '', idade_diagnostico_ovario: '', outros: ''
    },
    habitos_vida: {
      tabagismo_carga: '', tabagismo_tempo_anos: '',
      etilismo_dose_diaria: '', etilismo_tempo_anos: ''
    },
    paridade: {
      gesta: '', para: '', aborto: '', idade_primeiro_filho: '', amamentou: false,
      tempo_amamentacao_meses: '', menarca_idade: '', menopausa: false,
      idade_menopausa: '', trh_uso: false, tempo_uso_trh: '', tipo_terapia: ''
    },
    historia_doenca: { 
      idade_diagnostico: '', score_tyrer_cuzick: '', score_canrisk: '', score_gail: ''
    },
    histologia: {
      subtipo_core_re: '', subtipo_core_rp: '', subtipo_core_her2: '', subtipo_core_ki67: '',
      subtipo_cirurgia_re: '', subtipo_cirurgia_rp: '', subtipo_cirurgia_her2: '', subtipo_cirurgia_ki67: '',
      tamanho_tumoral: '', grau_tumoral_cirurgia: '', margens_comprometidas: false, margens_local: '',
      biopsia_linfonodo_sentinela: false, bls_numerador: '', bls_denominador: '',
      linfadenectomia_axilar: false, ea_numerador: '', ea_denominador: ''
    },
    tratamento: {
      tratamento_neoadjuvante: false, inicio_neoadjuvante: '', termino_neoadjuvante: '', qual_neoadjuvante: '',
      estagio_clinico_pre_qxt: '', imunoterapia: false, adjuvancia: false, quimioterapia: '',
      inicio_quimioterapia: '', fim_quimioterapia: '', radioterapia_tipo: '', radioterapia_sessoes: '',
      inicio_radioterapia: '', fim_radioterapia: '', endocrinoterapia: '', inicio_endocrino: '',
      fim_endocrino: '', terapia_alvo: '', inicio_terapia_alvo: '', fim_terapia_alvo: ''
    },
    desfecho: {
      morte: false, data_morte: '', causa_morte: '', metastase: false, data_metastase: '',
      local_metastase: '', recidiva_local: false, data_recidiva_local: '',
      recidiva_regional: false, data_recidiva_regional: '', sitio_recidiva_regional: ''
    },
    tempos_diagnostico: {
      data_mamografia: '', data_usg: '', data_rm: '', data_primeira_consulta: '',
      data_core_biopsy: '', data_cirurgia: ''
    }
  };

// Component Logic (handleChange, handleNestedChange, etc. NO CHANGES from your previous version)
const FormPaciente = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const alturaMetros = parseFloat(formData.altura);
    const pesoKg = parseFloat(formData.peso);

    if (alturaMetros > 0 && pesoKg > 0) {
      const imcCalculado = pesoKg / (alturaMetros * alturaMetros);
      setFormData(prev => ({ ...prev, imc: imcCalculado.toFixed(2) }));
    } else if (formData.imc !== '' && formData.imc !== null && (formData.altura === '' || formData.peso === '')) {
        if (formData.imc !== '' && formData.imc !== null && (formData.altura === '' || formData.peso === '')) {
             if (parseFloat(formData.imc) !== 0) { 
                setFormData(prev => ({ ...prev, imc: '' }));
             }
        }
    }
  }, [formData.altura, formData.peso, formData.imc]);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (errors[name]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: undefined, _api: undefined }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' && value === '' ? '' : value 
    }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value, type } = e.target;
    const fieldPath = `${section}.${name}`;
     if (errors[fieldPath]) {
        setErrors(prevErrors => ({ ...prevErrors, [fieldPath]: undefined, _api: undefined }));
    }
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === 'number' && value === '' ? '' : value
      }
    }));
  };

  const handleNestedCheckbox = (e, section) => {
    const { name, checked } = e.target;
    const fieldPath = `${section}.${name}`;
    if (errors[fieldPath]) {
        setErrors(prevErrors => ({ ...prevErrors, [fieldPath]: undefined, _api: undefined }));
    }
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 
    setSubmitted(false);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      
      const dataToSubmit = JSON.parse(JSON.stringify(formData));

      const toNumberOrNull = (val, isInt = false) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = isInt ? parseInt(val, 10) : parseFloat(val);
        return isNaN(num) ? null : num;
      };
       const toNumberOrZeroIfEmpty = (val, isInt = false) => {
        if (val === '' || val === null || val === undefined) return 0; 
        const num = isInt ? parseInt(val, 10) : parseFloat(val);
        return isNaN(num) ? 0 : num;
      };
      
      const toDateOrNull = (dateStr) => {
          if (dateStr === '' || dateStr === null || dateStr === undefined) return null;
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? null : dateStr; 
      }

      dataToSubmit.idade = toNumberOrZeroIfEmpty(formData.idade, true);
      dataToSubmit.altura = toNumberOrNull(formData.altura);
      dataToSubmit.peso = toNumberOrNull(formData.peso);
      dataToSubmit.imc = toNumberOrNull(formData.imc);
      dataToSubmit.data_nascimento = toDateOrNull(formData.data_nascimento);

      if (dataToSubmit.historia_familiar) {
        dataToSubmit.historia_familiar.idade_diagnostico_mama = toNumberOrNull(formData.historia_familiar.idade_diagnostico_mama, true);
        dataToSubmit.historia_familiar.idade_diagnostico_ovario = toNumberOrNull(formData.historia_familiar.idade_diagnostico_ovario, true);
      }
      
      if (dataToSubmit.habitos_vida) {
        dataToSubmit.habitos_vida.tabagismo_carga = toNumberOrNull(formData.habitos_vida.tabagismo_carga);
        dataToSubmit.habitos_vida.tabagismo_tempo_anos = toNumberOrNull(formData.habitos_vida.tabagismo_tempo_anos);
        dataToSubmit.habitos_vida.etilismo_tempo_anos = toNumberOrNull(formData.habitos_vida.etilismo_tempo_anos);
      }
      
      if (dataToSubmit.paridade) {
        dataToSubmit.paridade.gesta = toNumberOrNull(formData.paridade.gesta, true);
        dataToSubmit.paridade.para = toNumberOrNull(formData.paridade.para, true);
        dataToSubmit.paridade.aborto = toNumberOrNull(formData.paridade.aborto, true);
        dataToSubmit.paridade.idade_primeiro_filho = toNumberOrNull(formData.paridade.idade_primeiro_filho, true);
        dataToSubmit.paridade.tempo_amamentacao_meses = toNumberOrNull(formData.paridade.tempo_amamentacao_meses, true);
        dataToSubmit.paridade.menarca_idade = toNumberOrNull(formData.paridade.menarca_idade, true);
        dataToSubmit.paridade.idade_menopausa = toNumberOrNull(formData.paridade.idade_menopausa, true);
        dataToSubmit.paridade.tempo_uso_trh = toNumberOrNull(formData.paridade.tempo_uso_trh);
      }
      
      if (dataToSubmit.historia_doenca) {
        dataToSubmit.historia_doenca.idade_diagnostico = toNumberOrNull(formData.historia_doenca.idade_diagnostico, true);
        dataToSubmit.historia_doenca.score_tyrer_cuzick = toNumberOrNull(formData.historia_doenca.score_tyrer_cuzick);
        dataToSubmit.historia_doenca.score_canrisk = toNumberOrNull(formData.historia_doenca.score_canrisk);
        dataToSubmit.historia_doenca.score_gail = toNumberOrNull(formData.historia_doenca.score_gail);
      }
      
      if (dataToSubmit.histologia) {
        dataToSubmit.histologia.tamanho_tumoral = toNumberOrNull(formData.histologia.tamanho_tumoral);
        dataToSubmit.histologia.bls_numerador = toNumberOrNull(formData.histologia.bls_numerador, true);
        dataToSubmit.histologia.bls_denominador = toNumberOrNull(formData.histologia.bls_denominador, true);
        dataToSubmit.histologia.ea_numerador = toNumberOrNull(formData.histologia.ea_numerador, true);
        dataToSubmit.histologia.ea_denominador = toNumberOrNull(formData.histologia.ea_denominador, true);
      }
            
      if (dataToSubmit.tratamento) {
        Object.keys(dataToSubmit.tratamento).forEach(key => {
          if (key.startsWith('inicio_') || key.startsWith('termino_') || key.startsWith('fim_')) {
            dataToSubmit.tratamento[key] = toDateOrNull(formData.tratamento[key]);
          }
        });
        dataToSubmit.tratamento.radioterapia_sessoes = toNumberOrNull(formData.tratamento.radioterapia_sessoes, true);
      }

      if (dataToSubmit.desfecho) {
        Object.keys(dataToSubmit.desfecho).forEach(key => {
          if (key.startsWith('data_')) {
            dataToSubmit.desfecho[key] = toDateOrNull(formData.desfecho[key]);
          }
        });
      }
       if (dataToSubmit.tempos_diagnostico) {
         Object.keys(dataToSubmit.tempos_diagnostico).forEach(key => {
          if (key.startsWith('data_')) {
            dataToSubmit.tempos_diagnostico[key] = toDateOrNull(formData.tempos_diagnostico[key]);
          }
        });
       }

      Object.keys(dataToSubmit).forEach(sectionKey => {
        if (typeof dataToSubmit[sectionKey] === 'object' && dataToSubmit[sectionKey] !== null) {
            Object.keys(dataToSubmit[sectionKey]).forEach(fieldKey => {
                if (dataToSubmit[sectionKey][fieldKey] === '') {
                    const fieldSchema = validationSchema.fields[sectionKey]?.fields?.[fieldKey];
                    if (fieldSchema && fieldSchema.type !== 'boolean') {
                         dataToSubmit[sectionKey][fieldKey] = null;
                    } else if (typeof dataToSubmit[sectionKey][fieldKey] === 'string' && dataToSubmit[sectionKey][fieldKey] === '') {
                        dataToSubmit[sectionKey][fieldKey] = null;
                    }
                }
            });
        }
      });

      console.log('Dados Prontos para Enviar (Validados e Convertidos):', JSON.stringify(dataToSubmit, null, 2));
      
      const currentTokenForSubmit = await getAuthToken();
      // console.log('Token ANTES da chamada Axios para /pacientes/:', currentTokenForSubmit ? currentTokenForSubmit.substring(0, 30) + "..." : "Nenhum token");

      const response = await api.post('/pacientes/', dataToSubmit); 
      
      console.log('Paciente criado com sucesso:', response.data);
      setSubmitted(true);
      setFormData(initialState);
      window.scrollTo(0, 0);

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        console.log("Erros de validação:", newErrors);
        if (err.inner.length > 0 && err.inner[0].path) {
            const firstErrorField = document.getElementsByName(err.inner[0].path)[0];
            if (firstErrorField) {
                firstErrorField.focus({ preventScroll: true });
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
      } else if (err.isAxiosError) {
        console.error("Erro ao salvar paciente (API):", err.response?.status, err.response?.data || err.message);
        const apiErrorMessage = err.response?.data?.detail || err.response?.data?.message || `Erro ${err.response?.status || ''}: Falha ao comunicar com o servidor.`;
        setErrors(prev => ({...prev, _api: apiErrorMessage }));
      } else {
        console.error("Erro inesperado no submit:", err);
        setErrors(prev => ({...prev, _api: "Ocorreu um erro inesperado ao processar sua solicitação." }));
      }
    }
  };


  return (
    <Container>
      <FormContainer onSubmit={handleSubmit} noValidate>
        {/* Dados Pessoais */}
        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 6' }}>
              <InputLabel htmlFor="nome_completo">Nome Completo</InputLabel>
              <StyledInput id="nome_completo" name="nome_completo" value={formData.nome_completo} onChange={handleChange} />
              {errors.nome_completo && <ErrorText>{errors.nome_completo}</ErrorText>}
            </FieldContainer>

            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="idade">Idade</InputLabel>
              <StyledInput id="idade" name="idade" type="number" value={formData.idade} onChange={handleChange} />
              {errors.idade && <ErrorText>{errors.idade}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="data_nascimento">Data de Nascimento</InputLabel>
              <StyledInput id="data_nascimento" name="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} />
              {errors.data_nascimento && <ErrorText>{errors.data_nascimento}</ErrorText>}
            </FieldContainer>
             <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="telefone">Telefone</InputLabel>
              <StyledInput id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="11999998888" />
              {errors.telefone && <ErrorText>{errors.telefone}</ErrorText>}
            </FieldContainer>

            <FieldContainer style={{ gridColumn: 'span 6' }}>
              <InputLabel htmlFor="endereco">Endereço</InputLabel>
              <StyledInput id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} />
              {errors.endereco && <ErrorText>{errors.endereco}</ErrorText>}
            </FieldContainer>

            <FieldContainer style={{ gridColumn: 'span 3' }}>
              <InputLabel htmlFor="cidade">Cidade</InputLabel>
              <StyledInput id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
              {errors.cidade && <ErrorText>{errors.cidade}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}>
              <InputLabel htmlFor="naturalidade">Naturalidade</InputLabel>
              <StyledInput id="naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} />
              {errors.naturalidade && <ErrorText>{errors.naturalidade}</ErrorText>}
            </FieldContainer>

            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="altura">Altura (m)</InputLabel>
              <StyledInput id="altura" name="altura" type="number" step="0.01" value={formData.altura} onChange={handleChange} placeholder="Ex: 1.75" />
              {errors.altura && <ErrorText>{errors.altura}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="peso">Peso (kg)</InputLabel>
              <StyledInput id="peso" name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} placeholder="Ex: 70.5"/>
              {errors.peso && <ErrorText>{errors.peso}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="imc">IMC</InputLabel>
              <StyledInput id="imc" name="imc" type="text" value={formData.imc} readOnly disabled />
            </FieldContainer>

            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="cor_etnia">Cor/Etnia</InputLabel>
              <StyledSelect id="cor_etnia" name="cor_etnia" value={formData.cor_etnia} onChange={handleChange}>
                {corEtniaOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </StyledSelect>
              {errors.cor_etnia && <ErrorText>{errors.cor_etnia}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="escolaridade">Escolaridade</InputLabel>
              <StyledSelect id="escolaridade" name="escolaridade" value={formData.escolaridade} onChange={handleChange}>
                {escolaridadeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </StyledSelect>
              {errors.escolaridade && <ErrorText>{errors.escolaridade}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="renda_familiar">Renda Familiar</InputLabel>
              <StyledSelect id="renda_familiar" name="renda_familiar" value={formData.renda_familiar} onChange={handleChange}>
                {rendaFamiliarOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </StyledSelect>
              {errors.renda_familiar && <ErrorText>{errors.renda_familiar}</ErrorText>}
            </FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>História Patológica</SectionTitle>
          <FormGrid>
            {[
              { label: 'Hipertensão', name: 'hipertensao' }, { label: 'Hipotireoidismo', name: 'hipotireoidismo' },
              { label: 'Ansiedade', name: 'ansiedade' }, { label: 'Depressão', name: 'depressao' },
              { label: 'Diabetes', name: 'diabetes' }
            ].map((item) => (
              <FieldContainer key={item.name} style={{ gridColumn: 'span 2' }}> {/* 3 checkboxes per row on 6-col grid */}
                <CheckboxLabel htmlFor={`hp_${item.name}`}>
                  <StyledCheckbox
                    id={`hp_${item.name}`} name={item.name}
                    checked={!!formData.historia_patologica[item.name]}
                    onChange={(e) => handleNestedCheckbox(e, 'historia_patologica')}
                  />
                  {item.label}
                </CheckboxLabel>
              </FieldContainer>
            ))}
             {/* Empty container to push 'Outros' to new line if an odd number of checkboxes */}
            {( [{ label: 'Hipertensão', name: 'hipertensao' }].length % 3 !== 0) && <FieldContainer style={{ gridColumn: `span ${6 - (([{ label: 'Hipertensão', name: 'hipertensao' }].length % 3) * 2) }` }} />}

            <FieldContainer style={{ gridColumn: 'span 6', marginTop: '10px' }}>
              <InputLabel htmlFor="hp_outros">Outros (Hist. Patológica)</InputLabel>
              <StyledInput id="hp_outros" name="outros" value={formData.historia_patologica.outros}
                onChange={(e) => handleNestedChange(e, 'historia_patologica')} />
              {errors['historia_patologica.outros'] && <ErrorText>{errors['historia_patologica.outros']}</ErrorText>}
            </FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>História Familiar</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="hf_cancer_mama">
                <StyledCheckbox id="hf_cancer_mama" name="cancer_mama" checked={!!formData.historia_familiar.cancer_mama} onChange={(e) => handleNestedCheckbox(e, 'historia_familiar')} />
                Câncer de Mama na Família
                </CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="hf_parentesco_mama">Parentesco (Câncer de Mama)</InputLabel>
              <StyledInput id="hf_parentesco_mama" name="parentesco_mama" value={formData.historia_familiar.parentesco_mama} onChange={(e) => handleNestedChange(e, 'historia_familiar')} disabled={!formData.historia_familiar.cancer_mama}/>
              {errors['historia_familiar.parentesco_mama'] && <ErrorText>{errors['historia_familiar.parentesco_mama']}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}>
              <InputLabel htmlFor="hf_idade_diagnostico_mama">Idade ao Diagnóstico (Mama)</InputLabel>
              <StyledInput id="hf_idade_diagnostico_mama" type="number" name="idade_diagnostico_mama" value={formData.historia_familiar.idade_diagnostico_mama} onChange={(e) => handleNestedChange(e, 'historia_familiar')} disabled={!formData.historia_familiar.cancer_mama} />
              {errors['historia_familiar.idade_diagnostico_mama'] && <ErrorText>{errors['historia_familiar.idade_diagnostico_mama']}</ErrorText>}
            </FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center', marginTop: '10px' }}>
                <CheckboxLabel htmlFor="hf_cancer_ovario">
                <StyledCheckbox id="hf_cancer_ovario" name="cancer_ovario" checked={!!formData.historia_familiar.cancer_ovario} onChange={(e) => handleNestedCheckbox(e, 'historia_familiar')} />
                Câncer de Ovário na Família
                </CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2', marginTop: '10px'  }}>
              <InputLabel htmlFor="hf_parentesco_ovario">Parentesco (Câncer de Ovário)</InputLabel>
              <StyledInput id="hf_parentesco_ovario" name="parentesco_ovario" value={formData.historia_familiar.parentesco_ovario} onChange={(e) => handleNestedChange(e, 'historia_familiar')} disabled={!formData.historia_familiar.cancer_ovario}/>
              {errors['historia_familiar.parentesco_ovario'] && <ErrorText>{errors['historia_familiar.parentesco_ovario']}</ErrorText>}
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2', marginTop: '10px'  }}>
              <InputLabel htmlFor="hf_idade_diagnostico_ovario">Idade ao Diagnóstico (Ovário)</InputLabel>
              <StyledInput id="hf_idade_diagnostico_ovario" type="number" name="idade_diagnostico_ovario" value={formData.historia_familiar.idade_diagnostico_ovario} onChange={(e) => handleNestedChange(e, 'historia_familiar')} disabled={!formData.historia_familiar.cancer_ovario}/>
              {errors['historia_familiar.idade_diagnostico_ovario'] && <ErrorText>{errors['historia_familiar.idade_diagnostico_ovario']}</ErrorText>}
            </FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 6', marginTop: '10px' }}>
              <InputLabel htmlFor="hf_outros">Outros (Hist. Familiar)</InputLabel>
              <StyledInput id="hf_outros" name="outros" value={formData.historia_familiar.outros} onChange={(e) => handleNestedChange(e, 'historia_familiar')} />
              {errors['historia_familiar.outros'] && <ErrorText>{errors['historia_familiar.outros']}</ErrorText>}
            </FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Hábitos de Vida</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="hv_tabagismo_carga">Tabagismo Carga (maços/ano)</InputLabel><StyledInput id="hv_tabagismo_carga" type="number" name="tabagismo_carga" value={formData.habitos_vida.tabagismo_carga} onChange={(e) => handleNestedChange(e, 'habitos_vida')} />{errors['habitos_vida.tabagismo_carga'] && <ErrorText>{errors['habitos_vida.tabagismo_carga']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="hv_tabagismo_tempo_anos">Tabagismo Tempo (anos)</InputLabel><StyledInput id="hv_tabagismo_tempo_anos" type="number" name="tabagismo_tempo_anos" value={formData.habitos_vida.tabagismo_tempo_anos} onChange={(e) => handleNestedChange(e, 'habitos_vida')} />{errors['habitos_vida.tabagismo_tempo_anos'] && <ErrorText>{errors['habitos_vida.tabagismo_tempo_anos']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="hv_etilismo_dose_diaria">Etilismo Dose Diária</InputLabel><StyledInput id="hv_etilismo_dose_diaria" name="etilismo_dose_diaria" value={formData.habitos_vida.etilismo_dose_diaria} onChange={(e) => handleNestedChange(e, 'habitos_vida')} />{errors['habitos_vida.etilismo_dose_diaria'] && <ErrorText>{errors['habitos_vida.etilismo_dose_diaria']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="hv_etilismo_tempo_anos">Etilismo Tempo (anos)</InputLabel><StyledInput id="hv_etilismo_tempo_anos" type="number" name="etilismo_tempo_anos" value={formData.habitos_vida.etilismo_tempo_anos} onChange={(e) => handleNestedChange(e, 'habitos_vida')} />{errors['habitos_vida.etilismo_tempo_anos'] && <ErrorText>{errors['habitos_vida.etilismo_tempo_anos']}</ErrorText>}</FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Paridade</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_gesta">Gesta (Nº)</InputLabel><StyledInput id="par_gesta" type="number" name="gesta" value={formData.paridade.gesta} onChange={(e) => handleNestedChange(e, 'paridade')} />{errors['paridade.gesta'] && <ErrorText>{errors['paridade.gesta']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_para">Para (Nº)</InputLabel><StyledInput id="par_para" type="number" name="para" value={formData.paridade.para} onChange={(e) => handleNestedChange(e, 'paridade')} />{errors['paridade.para'] && <ErrorText>{errors['paridade.para']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_aborto">Aborto (Nº)</InputLabel><StyledInput id="par_aborto" type="number" name="aborto" value={formData.paridade.aborto} onChange={(e) => handleNestedChange(e, 'paridade')} />{errors['paridade.aborto'] && <ErrorText>{errors['paridade.aborto']}</ErrorText>}</FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_idade_primeiro_filho">Idade 1º Filho</InputLabel><StyledInput id="par_idade_primeiro_filho" type="number" name="idade_primeiro_filho" value={formData.paridade.idade_primeiro_filho} onChange={(e) => handleNestedChange(e, 'paridade')} />{errors['paridade.idade_primeiro_filho'] && <ErrorText>{errors['paridade.idade_primeiro_filho']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_menarca_idade">Idade Menarca</InputLabel><StyledInput id="par_menarca_idade" type="number" name="menarca_idade" value={formData.paridade.menarca_idade} onChange={(e) => handleNestedChange(e, 'paridade')} />{errors['paridade.menarca_idade'] && <ErrorText>{errors['paridade.menarca_idade']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }} /> {/* Spacer */}


            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="par_amamentou"><StyledCheckbox id="par_amamentou" name="amamentou" checked={!!formData.paridade.amamentou} onChange={(e) => handleNestedCheckbox(e, 'paridade')} />Amamentou</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel htmlFor="par_tempo_amamentacao_meses">Tempo Amamentação (meses)</InputLabel><StyledInput id="par_tempo_amamentacao_meses" type="number" name="tempo_amamentacao_meses" value={formData.paridade.tempo_amamentacao_meses} onChange={(e) => handleNestedChange(e, 'paridade')} disabled={!formData.paridade.amamentou}/>{errors['paridade.tempo_amamentacao_meses'] && <ErrorText>{errors['paridade.tempo_amamentacao_meses']}</ErrorText>}</FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="par_menopausa"><StyledCheckbox id="par_menopausa" name="menopausa" checked={!!formData.paridade.menopausa} onChange={(e) => handleNestedCheckbox(e, 'paridade')} />Menopausa</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel htmlFor="par_idade_menopausa">Idade Menopausa</InputLabel><StyledInput id="par_idade_menopausa" type="number" name="idade_menopausa" value={formData.paridade.idade_menopausa} onChange={(e) => handleNestedChange(e, 'paridade')} disabled={!formData.paridade.menopausa}/>{errors['paridade.idade_menopausa'] && <ErrorText>{errors['paridade.idade_menopausa']}</ErrorText>}</FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="par_trh_uso"><StyledCheckbox id="par_trh_uso" name="trh_uso" checked={!!formData.paridade.trh_uso} onChange={(e) => handleNestedCheckbox(e, 'paridade')} />Uso TRH</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_tempo_uso_trh">Tempo Uso TRH (anos)</InputLabel><StyledInput id="par_tempo_uso_trh" type="number" step="0.1" name="tempo_uso_trh" value={formData.paridade.tempo_uso_trh} onChange={(e) => handleNestedChange(e, 'paridade')} disabled={!formData.paridade.trh_uso}/>{errors['paridade.tempo_uso_trh'] && <ErrorText>{errors['paridade.tempo_uso_trh']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_tipo_terapia">Tipo Terapia (TRH)</InputLabel><StyledInput id="par_tipo_terapia" name="tipo_terapia" value={formData.paridade.tipo_terapia} onChange={(e) => handleNestedChange(e, 'paridade')} disabled={!formData.paridade.trh_uso}/>{errors['paridade.tipo_terapia'] && <ErrorText>{errors['paridade.tipo_terapia']}</ErrorText>}</FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>História da Doença</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="hd_idade_diagnostico">Idade ao Diagnóstico</InputLabel><StyledInput id="hd_idade_diagnostico" type="number" name="idade_diagnostico" value={formData.historia_doenca.idade_diagnostico} onChange={(e) => handleNestedChange(e, 'historia_doenca')} />{errors['historia_doenca.idade_diagnostico'] && <ErrorText>{errors['historia_doenca.idade_diagnostico']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 4' }} /> {/* Spacer */}
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="hd_score_tyrer_cuzick">Score Tyrer-Cuzick</InputLabel><StyledInput id="hd_score_tyrer_cuzick" type="number" step="0.01" name="score_tyrer_cuzick" value={formData.historia_doenca.score_tyrer_cuzick} onChange={(e) => handleNestedChange(e, 'historia_doenca')} />{errors['historia_doenca.score_tyrer_cuzick'] && <ErrorText>{errors['historia_doenca.score_tyrer_cuzick']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="hd_score_canrisk">Score CanRisk</InputLabel><StyledInput id="hd_score_canrisk" type="number" step="0.01" name="score_canrisk" value={formData.historia_doenca.score_canrisk} onChange={(e) => handleNestedChange(e, 'historia_doenca')} />{errors['historia_doenca.score_canrisk'] && <ErrorText>{errors['historia_doenca.score_canrisk']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="hd_score_gail">Score Gail</InputLabel><StyledInput id="hd_score_gail" type="number" step="0.01" name="score_gail" value={formData.historia_doenca.score_gail} onChange={(e) => handleNestedChange(e, 'historia_doenca')} />{errors['historia_doenca.score_gail'] && <ErrorText>{errors['historia_doenca.score_gail']}</ErrorText>}</FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Histologia</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_core_re">Subtipo Core RE</InputLabel><StyledInput id="his_subtipo_core_re" name="subtipo_core_re" value={formData.histologia.subtipo_core_re} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_core_rp">Subtipo Core RP</InputLabel><StyledInput id="his_subtipo_core_rp" name="subtipo_core_rp" value={formData.histologia.subtipo_core_rp} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_core_her2">Subtipo Core HER2</InputLabel><StyledInput id="his_subtipo_core_her2" name="subtipo_core_her2" value={formData.histologia.subtipo_core_her2} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_core_ki67">Subtipo Core Ki67</InputLabel><StyledInput id="his_subtipo_core_ki67" name="subtipo_core_ki67" value={formData.histologia.subtipo_core_ki67} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 4' }} /> {/* Spacer */}
            
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_cirurgia_re">Subtipo Cirurgia RE</InputLabel><StyledInput id="his_subtipo_cirurgia_re" name="subtipo_cirurgia_re" value={formData.histologia.subtipo_cirurgia_re} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_cirurgia_rp">Subtipo Cirurgia RP</InputLabel><StyledInput id="his_subtipo_cirurgia_rp" name="subtipo_cirurgia_rp" value={formData.histologia.subtipo_cirurgia_rp} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_cirurgia_her2">Subtipo Cirurgia HER2</InputLabel><StyledInput id="his_subtipo_cirurgia_her2" name="subtipo_cirurgia_her2" value={formData.histologia.subtipo_cirurgia_her2} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_subtipo_cirurgia_ki67">Subtipo Cirurgia Ki67</InputLabel><StyledInput id="his_subtipo_cirurgia_ki67" name="subtipo_cirurgia_ki67" value={formData.histologia.subtipo_cirurgia_ki67} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 4' }} /> {/* Spacer */}

            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="his_tamanho_tumoral">Tamanho Tumoral (cm)</InputLabel><StyledInput id="his_tamanho_tumoral" type="number" step="0.1" name="tamanho_tumoral" value={formData.histologia.tamanho_tumoral} onChange={(e) => handleNestedChange(e, 'histologia')} />{errors['histologia.tamanho_tumoral'] && <ErrorText>{errors['histologia.tamanho_tumoral']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="his_grau_tumoral_cirurgia">Grau Tumoral Cirurgia</InputLabel><StyledInput id="his_grau_tumoral_cirurgia" name="grau_tumoral_cirurgia" value={formData.histologia.grau_tumoral_cirurgia} onChange={(e) => handleNestedChange(e, 'histologia')} /></FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="his_margens_comprometidas"><StyledCheckbox id="his_margens_comprometidas" name="margens_comprometidas" checked={!!formData.histologia.margens_comprometidas} onChange={(e) => handleNestedCheckbox(e, 'histologia')} />Margens Comprometidas</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel htmlFor="his_margens_local">Local Margens Comprometidas</InputLabel><StyledInput id="his_margens_local" name="margens_local" value={formData.histologia.margens_local} onChange={(e) => handleNestedChange(e, 'histologia')} disabled={!formData.histologia.margens_comprometidas}/>{errors['histologia.margens_local'] && <ErrorText>{errors['histologia.margens_local']}</ErrorText>}</FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="his_biopsia_linfonodo_sentinela"><StyledCheckbox id="his_biopsia_linfonodo_sentinela" name="biopsia_linfonodo_sentinela" checked={!!formData.histologia.biopsia_linfonodo_sentinela} onChange={(e) => handleNestedCheckbox(e, 'histologia')} />Biópsia Linfonodo Sentinela</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_bls_numerador">BLS Numerador</InputLabel><StyledInput id="his_bls_numerador" type="number" name="bls_numerador" value={formData.histologia.bls_numerador} onChange={(e) => handleNestedChange(e, 'histologia')} />{errors['histologia.bls_numerador'] && <ErrorText>{errors['histologia.bls_numerador']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_bls_denominador">BLS Denominador</InputLabel><StyledInput id="his_bls_denominador" type="number" name="bls_denominador" value={formData.histologia.bls_denominador} onChange={(e) => handleNestedChange(e, 'histologia')} />{errors['histologia.bls_denominador'] && <ErrorText>{errors['histologia.bls_denominador']}</ErrorText>}</FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="his_linfadenectomia_axilar"><StyledCheckbox id="his_linfadenectomia_axilar" name="linfadenectomia_axilar" checked={!!formData.histologia.linfadenectomia_axilar} onChange={(e) => handleNestedCheckbox(e, 'histologia')} />Linfadenectomia Axilar</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_ea_numerador">EA Numerador</InputLabel><StyledInput id="his_ea_numerador" type="number" name="ea_numerador" value={formData.histologia.ea_numerador} onChange={(e) => handleNestedChange(e, 'histologia')} />{errors['histologia.ea_numerador'] && <ErrorText>{errors['histologia.ea_numerador']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="his_ea_denominador">EA Denominador</InputLabel><StyledInput id="his_ea_denominador" type="number" name="ea_denominador" value={formData.histologia.ea_denominador} onChange={(e) => handleNestedChange(e, 'histologia')} />{errors['histologia.ea_denominador'] && <ErrorText>{errors['histologia.ea_denominador']}</ErrorText>}</FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Tratamento</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="trt_tratamento_neoadjuvante"><StyledCheckbox id="trt_tratamento_neoadjuvante" name="tratamento_neoadjuvante" checked={!!formData.tratamento.tratamento_neoadjuvante} onChange={(e) => handleNestedCheckbox(e, 'tratamento')} />Trat. Neoadjuvante</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="trt_inicio_neoadjuvante">Início Neoadjuvante</InputLabel><StyledInput id="trt_inicio_neoadjuvante" type="date" name="inicio_neoadjuvante" value={formData.tratamento.inicio_neoadjuvante} onChange={(e) => handleNestedChange(e, 'tratamento')} disabled={!formData.tratamento.tratamento_neoadjuvante}/>{errors['tratamento.inicio_neoadjuvante'] && <ErrorText>{errors['tratamento.inicio_neoadjuvante']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="trt_termino_neoadjuvante">Término Neoadjuvante</InputLabel><StyledInput id="trt_termino_neoadjuvante" type="date" name="termino_neoadjuvante" value={formData.tratamento.termino_neoadjuvante} onChange={(e) => handleNestedChange(e, 'tratamento')} disabled={!formData.tratamento.tratamento_neoadjuvante}/>{errors['tratamento.termino_neoadjuvante'] && <ErrorText>{errors['tratamento.termino_neoadjuvante']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 6' }}><InputLabel htmlFor="trt_qual_neoadjuvante">Qual Neoadjuvante</InputLabel><StyledInput id="trt_qual_neoadjuvante" name="qual_neoadjuvante" value={formData.tratamento.qual_neoadjuvante} onChange={(e) => handleNestedChange(e, 'tratamento')} disabled={!formData.tratamento.tratamento_neoadjuvante}/></FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_estagio_clinico_pre_qxt">Estágio Clínico Pré-QXT</InputLabel><StyledInput id="trt_estagio_clinico_pre_qxt" name="estagio_clinico_pre_qxt" value={formData.tratamento.estagio_clinico_pre_qxt} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 1', alignSelf: 'center' }}><CheckboxLabel htmlFor="trt_imunoterapia"><StyledCheckbox id="trt_imunoterapia" name="imunoterapia" checked={!!formData.tratamento.imunoterapia} onChange={(e) => handleNestedCheckbox(e, 'tratamento')} />Imuno</CheckboxLabel></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}><CheckboxLabel htmlFor="trt_adjuvancia"><StyledCheckbox id="trt_adjuvancia" name="adjuvancia" checked={!!formData.tratamento.adjuvancia} onChange={(e) => handleNestedCheckbox(e, 'tratamento')} />Adjuvância</CheckboxLabel></FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 6' }}><InputLabel htmlFor="trt_quimioterapia">Quimioterapia (Tipo/Esquema)</InputLabel><StyledInput id="trt_quimioterapia" name="quimioterapia" value={formData.tratamento.quimioterapia} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_inicio_quimioterapia">Início Quimioterapia</InputLabel><StyledInput id="trt_inicio_quimioterapia" type="date" name="inicio_quimioterapia" value={formData.tratamento.inicio_quimioterapia} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_fim_quimioterapia">Fim Quimioterapia</InputLabel><StyledInput id="trt_fim_quimioterapia" type="date" name="fim_quimioterapia" value={formData.tratamento.fim_quimioterapia} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_radioterapia_tipo">Radioterapia Tipo</InputLabel><StyledInput id="trt_radioterapia_tipo" name="radioterapia_tipo" value={formData.tratamento.radioterapia_tipo} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_radioterapia_sessoes">Radioterapia Sessões</InputLabel><StyledInput id="trt_radioterapia_sessoes" type="number" name="radioterapia_sessoes" value={formData.tratamento.radioterapia_sessoes} onChange={(e) => handleNestedChange(e, 'tratamento')} />{errors['tratamento.radioterapia_sessoes'] && <ErrorText>{errors['tratamento.radioterapia_sessoes']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_inicio_radioterapia">Início Radioterapia</InputLabel><StyledInput id="trt_inicio_radioterapia" type="date" name="inicio_radioterapia" value={formData.tratamento.inicio_radioterapia} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_fim_radioterapia">Fim Radioterapia</InputLabel><StyledInput id="trt_fim_radioterapia" type="date" name="fim_radioterapia" value={formData.tratamento.fim_radioterapia} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 6' }}><InputLabel htmlFor="trt_endocrinoterapia">Endocrinoterapia</InputLabel><StyledInput id="trt_endocrinoterapia" name="endocrinoterapia" value={formData.tratamento.endocrinoterapia} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_inicio_endocrino">Início Endocrinoterapia</InputLabel><StyledInput id="trt_inicio_endocrino" type="date" name="inicio_endocrino" value={formData.tratamento.inicio_endocrino} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_fim_endocrino">Fim Endocrinoterapia</InputLabel><StyledInput id="trt_fim_endocrino" type="date" name="fim_endocrino" value={formData.tratamento.fim_endocrino} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 6' }}><InputLabel htmlFor="trt_terapia_alvo">Terapia Alvo</InputLabel><StyledInput id="trt_terapia_alvo" name="terapia_alvo" value={formData.tratamento.terapia_alvo} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_inicio_terapia_alvo">Início Terapia Alvo</InputLabel><StyledInput id="trt_inicio_terapia_alvo" type="date" name="inicio_terapia_alvo" value={formData.tratamento.inicio_terapia_alvo} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="trt_fim_terapia_alvo">Fim Terapia Alvo</InputLabel><StyledInput id="trt_fim_terapia_alvo" type="date" name="fim_terapia_alvo" value={formData.tratamento.fim_terapia_alvo} onChange={(e) => handleNestedChange(e, 'tratamento')} /></FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Desfecho</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 1', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="des_morte"><StyledCheckbox id="des_morte" name="morte" checked={!!formData.desfecho.morte} onChange={(e) => handleNestedCheckbox(e, 'desfecho')} />Morte</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="des_data_morte">Data da Morte</InputLabel><StyledInput id="des_data_morte" type="date" name="data_morte" value={formData.desfecho.data_morte} onChange={(e) => handleNestedChange(e, 'desfecho')} disabled={!formData.desfecho.morte}/>{errors['desfecho.data_morte'] && <ErrorText>{errors['desfecho.data_morte']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="des_causa_morte">Causa da Morte</InputLabel><StyledInput id="des_causa_morte" name="causa_morte" value={formData.desfecho.causa_morte} onChange={(e) => handleNestedChange(e, 'desfecho')} disabled={!formData.desfecho.morte}/>{errors['desfecho.causa_morte'] && <ErrorText>{errors['desfecho.causa_morte']}</ErrorText>}</FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 1', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="des_metastase"><StyledCheckbox id="des_metastase" name="metastase" checked={!!formData.desfecho.metastase} onChange={(e) => handleNestedCheckbox(e, 'desfecho')} />Metástase</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="des_data_metastase">Data da Metástase</InputLabel><StyledInput id="des_data_metastase" type="date" name="data_metastase" value={formData.desfecho.data_metastase} onChange={(e) => handleNestedChange(e, 'desfecho')} disabled={!formData.desfecho.metastase}/>{errors['desfecho.data_metastase'] && <ErrorText>{errors['desfecho.data_metastase']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="des_local_metastase">Local da Metástase</InputLabel><StyledInput id="des_local_metastase" name="local_metastase" value={formData.desfecho.local_metastase} onChange={(e) => handleNestedChange(e, 'desfecho')} disabled={!formData.desfecho.metastase}/></FieldContainer>

            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="des_recidiva_local"><StyledCheckbox id="des_recidiva_local" name="recidiva_local" checked={!!formData.desfecho.recidiva_local} onChange={(e) => handleNestedCheckbox(e, 'desfecho')} />Recidiva Local</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel htmlFor="des_data_recidiva_local">Data Recidiva Local</InputLabel><StyledInput id="des_data_recidiva_local" type="date" name="data_recidiva_local" value={formData.desfecho.data_recidiva_local} onChange={(e) => handleNestedChange(e, 'desfecho')} disabled={!formData.desfecho.recidiva_local}/>{errors['desfecho.data_recidiva_local'] && <ErrorText>{errors['desfecho.data_recidiva_local']}</ErrorText>}</FieldContainer>
            
            <FieldContainer style={{ gridColumn: 'span 2', alignSelf: 'center' }}>
                <CheckboxLabel htmlFor="des_recidiva_regional"><StyledCheckbox id="des_recidiva_regional" name="recidiva_regional" checked={!!formData.desfecho.recidiva_regional} onChange={(e) => handleNestedCheckbox(e, 'desfecho')} />Recidiva Regional</CheckboxLabel>
            </FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="des_data_recidiva_regional">Data Recidiva Regional</InputLabel><StyledInput id="des_data_recidiva_regional" type="date" name="data_recidiva_regional" value={formData.desfecho.data_recidiva_regional} onChange={(e) => handleNestedChange(e, 'desfecho')} disabled={!formData.desfecho.recidiva_regional}/>{errors['desfecho.data_recidiva_regional'] && <ErrorText>{errors['desfecho.data_recidiva_regional']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="des_sitio_recidiva_regional">Sítio Recidiva Regional</InputLabel><StyledInput id="des_sitio_recidiva_regional" name="sitio_recidiva_regional" value={formData.desfecho.sitio_recidiva_regional} onChange={(e) => handleNestedChange(e, 'desfecho')} disabled={!formData.desfecho.recidiva_regional}/></FieldContainer>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Tempos Diagnóstico</SectionTitle>
          <FormGrid>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="td_data_mamografia">Data Mamografia</InputLabel><StyledInput id="td_data_mamografia" type="date" name="data_mamografia" value={formData.tempos_diagnostico.data_mamografia} onChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />{errors['tempos_diagnostico.data_mamografia'] && <ErrorText>{errors['tempos_diagnostico.data_mamografia']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="td_data_usg">Data USG</InputLabel><StyledInput id="td_data_usg" type="date" name="data_usg" value={formData.tempos_diagnostico.data_usg} onChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />{errors['tempos_diagnostico.data_usg'] && <ErrorText>{errors['tempos_diagnostico.data_usg']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="td_data_rm">Data RM</InputLabel><StyledInput id="td_data_rm" type="date" name="data_rm" value={formData.tempos_diagnostico.data_rm} onChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />{errors['tempos_diagnostico.data_rm'] && <ErrorText>{errors['tempos_diagnostico.data_rm']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="td_data_primeira_consulta">Data Primeira Consulta</InputLabel><StyledInput id="td_data_primeira_consulta" type="date" name="data_primeira_consulta" value={formData.tempos_diagnostico.data_primeira_consulta} onChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />{errors['tempos_diagnostico.data_primeira_consulta'] && <ErrorText>{errors['tempos_diagnostico.data_primeira_consulta']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="td_data_core_biopsy">Data Core Biopsy</InputLabel><StyledInput id="td_data_core_biopsy" type="date" name="data_core_biopsy" value={formData.tempos_diagnostico.data_core_biopsy} onChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />{errors['tempos_diagnostico.data_core_biopsy'] && <ErrorText>{errors['tempos_diagnostico.data_core_biopsy']}</ErrorText>}</FieldContainer>
            <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel htmlFor="td_data_cirurgia">Data Cirurgia</InputLabel><StyledInput id="td_data_cirurgia" type="date" name="data_cirurgia" value={formData.tempos_diagnostico.data_cirurgia} onChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />{errors['tempos_diagnostico.data_cirurgia'] && <ErrorText>{errors['tempos_diagnostico.data_cirurgia']}</ErrorText>}</FieldContainer>
          </FormGrid>
        </Section>

        {errors._api && 
            <ApiErrorContainer>
                <ErrorText>{errors._api}</ErrorText>
            </ApiErrorContainer>
        }
        
        <FixedSubmitButton>
          <Button type="submit">Salvar Cadastro</Button>
        </FixedSubmitButton>

        {submitted && Object.keys(errors).filter(k => k !== '_api').length === 0 && 
            <SuccessMessage>Cadastro realizado com sucesso!</SuccessMessage>
        }
      </FormContainer>
    </Container>
  );
};

export default FormPaciente;