import api, { getAuthToken } from '../../services/api';
import { validationSchema } from './formConfig';

const toDateOrNull = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

const toNumberOrNull = (value, isInteger = false) => {
    if (value === null || value === '' || isNaN(value)) return null;
    return isInteger ? parseInt(value, 10) : parseFloat(value);
};

const formatDataForApi = (formData) => {
    return {
        ...formData,
        data_nascimento: toDateOrNull(formData.data_nascimento),
        habitos_vida: { ...formData.habitos_vida, tabagismo_carga: toNumberOrNull(formData.habitos_vida.tabagismo_carga), tabagismo_tempo_anos: toNumberOrNull(formData.habitos_vida.tabagismo_tempo_anos), etilismo_tempo_anos: toNumberOrNull(formData.habitos_vida.etilismo_tempo_anos), tempo_atividade_semanal_min: toNumberOrNull(formData.habitos_vida.tempo_atividade_semanal_min, true) },
        paridade: { ...formData.paridade, gesta: toNumberOrNull(formData.paridade.gesta, true), para: toNumberOrNull(formData.paridade.para, true), aborto: toNumberOrNull(formData.paridade.aborto, true), idade_primeiro_filho: toNumberOrNull(formData.paridade.idade_primeiro_filho, true), tempo_amamentacao_meses: toNumberOrNull(formData.paridade.tempo_amamentacao_meses, true), menarca_idade: toNumberOrNull(formData.paridade.menarca_idade, true), idade_menopausa: toNumberOrNull(formData.paridade.idade_menopausa, true), tempo_uso_trh: toNumberOrNull(formData.paridade.tempo_uso_trh), },
        historia_doenca: { ...formData.historia_doenca, idade_diagnostico: toNumberOrNull(formData.historia_doenca.idade_diagnostico, true), score_tyrer_cuzick: toNumberOrNull(formData.historia_doenca.score_tyrer_cuzick), score_canrisk: toNumberOrNull(formData.historia_doenca.score_canrisk), score_gail: toNumberOrNull(formData.historia_doenca.score_gail), },
        histologia: { ...formData.histologia, tamanho_tumoral: toNumberOrNull(formData.histologia.tamanho_tumoral), bls_numerador: toNumberOrNull(formData.histologia.bls_numerador, true), bls_denominador: toNumberOrNull(formData.histologia.bls_denominador, true), ea_numerador: toNumberOrNull(formData.histologia.ea_numerador, true), ea_denominador: toNumberOrNull(formData.histologia.ea_denominador, true), },
        tratamento: { ...formData.tratamento, inicio_neoadjuvante: toDateOrNull(formData.tratamento.inicio_neoadjuvante), termino_neoadjuvante: toDateOrNull(formData.tratamento.termino_neoadjuvante), inicio_quimioterapia_neoadjuvante: toDateOrNull(formData.tratamento.inicio_quimioterapia_neoadjuvante), fim_quimioterapia_neoadjuvante: toDateOrNull(formData.tratamento.fim_quimioterapia_neoadjuvante), inicio_adjuvante: toDateOrNull(formData.tratamento.inicio_adjuvante), termino_adjuvante: toDateOrNull(formData.tratamento.termino_adjuvante), inicio_quimioterapia_adjuvante: toDateOrNull(formData.tratamento.inicio_quimioterapia_adjuvante), fim_quimioterapia_adjuvante: toDateOrNull(formData.tratamento.fim_quimioterapia_adjuvante), quimioterapias_paliativas: formData.tratamento.quimioterapias_paliativas.map(c => ({...c, inicio_quimioterapia_paliativa: toDateOrNull(c.inicio_quimioterapia_paliativa), fim_quimioterapia_paliativa: toDateOrNull(c.fim_quimioterapia_paliativa),})), terapias_alvo: formData.tratamento.terapias_alvo.map(t => ({...t, inicio_terapia_alvo: toDateOrNull(t.inicio_terapia_alvo), fim_terapia_alvo: toDateOrNull(t.fim_terapia_alvo),})), radioterapia_sessoes: toNumberOrNull(formData.tratamento.radioterapia_sessoes, true), inicio_radioterapia: toDateOrNull(formData.tratamento.inicio_radioterapia), fim_radioterapia: toDateOrNull(formData.tratamento.fim_radioterapia), inicio_endocrino: toDateOrNull(formData.tratamento.inicio_endocrino), fim_endocrino: toDateOrNull(formData.tratamento.fim_endocrino), },
        desfecho: { ...formData.desfecho, data_morte: toDateOrNull(formData.desfecho.data_morte), data_recidiva_local: toDateOrNull(formData.desfecho.data_recidiva_local), data_recidiva_regional: toDateOrNull(formData.desfecho.data_recidiva_regional), metastases: formData.desfecho.metastases.map(m => ({ ...m, data_metastase: toDateOrNull(m.data_metastase) })) },
        tempos_diagnostico: { ...formData.tempos_diagnostico, data_primeira_consulta: toDateOrNull(formData.tempos_diagnostico.data_primeira_consulta), data_diagnostico: toDateOrNull(formData.tempos_diagnostico.data_diagnostico), data_cirurgia: toDateOrNull(formData.tempos_diagnostico.data_cirurgia), data_inicio_tratamento: toDateOrNull(formData.tempos_diagnostico.data_inicio_tratamento), },
    };
};

export const submitCadastro = async (formData, arquivoTermo) => {
    // 1. Validação
    await validationSchema.validate(formData, { abortEarly: false });

    // 2. Autenticação
    const token = await getAuthToken();
    if (!token) throw new Error('Token de autenticação não encontrado.');

    // 3. Transformação dos dados
    const dataToSubmit = formatDataForApi(formData);
    
    // 4. Montagem do FormData
    const dadosFormulario = new FormData();
    dadosFormulario.append('termo_consentimento', arquivoTermo);
    dadosFormulario.append('data', JSON.stringify(dataToSubmit));

    // 5. Chamada à API
    const response = await api.post('/pacientes', dadosFormulario, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    
    return response;
};