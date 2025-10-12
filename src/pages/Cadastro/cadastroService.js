import api, { getAuthToken } from '../../services/api';
import { validationSchema } from './formConfig';

const toDateOrNull = (dateString) => {
    if (!dateString || dateString === '' || dateString === 'Invalid Date') return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

const formatDataForApi = (formData) => {
    const data = { ...formData };
    const tratamento = data.tratamento;

    if (tratamento) {
        // Formata os arrays de cirurgia
        tratamento.cirurgia.mamas = tratamento.cirurgia.mamas.map(item => ({
            ...item,
            data: toDateOrNull(item.data)
        }));
        tratamento.cirurgia.axilas = tratamento.cirurgia.axilas.map(item => ({
            ...item,
            data: toDateOrNull(item.data)
        }));
        tratamento.cirurgia.reconstrucoes = tratamento.cirurgia.reconstrucoes.map(item => ({
            ...item,
            data: toDateOrNull(item.data)
        }));

        // Formata os outros arrays de tratamento
        tratamento.quimioterapias = (tratamento.quimioterapias || []).map(q => ({...q, data_inicio: toDateOrNull(q.data_inicio), data_termino: toDateOrNull(q.data_termino) }));
        tratamento.radioterapias = (tratamento.radioterapias || []).map(r => ({...r, data_inicio: toDateOrNull(r.data_inicio), data_termino: toDateOrNull(r.data_termino) }));
        tratamento.endocrinoterapias = (tratamento.endocrinoterapias || []).map(e => ({...e, data_inicio: toDateOrNull(e.data_inicio), data_termino: toDateOrNull(e.data_termino) }));
        tratamento.imunoterapias = (tratamento.imunoterapias || []).map(im => ({...im, data_inicio: toDateOrNull(im.data_inicio), data_termino: toDateOrNull(im.data_termino) }));
        tratamento.imunohistoquimicas = (tratamento.imunohistoquimicas || []).map(i => ({...i, data_realizacao: toDateOrNull(i.data_realizacao) }));

        // Formata os objetos individuais
        if (tratamento.core_biopsy.realizada) {
            tratamento.core_biopsy.data = toDateOrNull(tratamento.core_biopsy.data);
        }
        if (tratamento.mamotomia.realizada) {
            tratamento.mamotomia.data = toDateOrNull(tratamento.mamotomia.data);
        }
        if (tratamento.paaf.realizada) {
            tratamento.paaf.data = toDateOrNull(tratamento.paaf.data);
        }
    }

    // Formata o resto dos dados...
    data.data_nascimento = toDateOrNull(data.data_nascimento);
    data.desfecho.data_morte = toDateOrNull(data.desfecho.data_morte);
    data.desfecho.data_recidiva_local = toDateOrNull(data.desfecho.data_recidiva_local);
    data.desfecho.data_recidiva_regional = toDateOrNull(data.desfecho.data_recidiva_regional);
    data.desfecho.metastases = data.desfecho.metastases.map(m => ({ ...m, data_metastase: toDateOrNull(m.data_metastase) }));
    data.tempos_diagnostico.data_primeira_consulta = toDateOrNull(data.tempos_diagnostico.data_primeira_consulta);
    data.tempos_diagnostico.data_diagnostico = toDateOrNull(data.tempos_diagnostico.data_diagnostico);
    data.tempos_diagnostico.data_cirurgia = toDateOrNull(data.tempos_diagnostico.data_cirurgia);
    data.tempos_diagnostico.data_inicio_tratamento = toDateOrNull(data.tempos_diagnostico.data_inicio_tratamento);

    return data;
};
export const submitCadastro = async (formData, arquivoTermo) => {
    // 1. Validação (Lembre-se de atualizar o schema)
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