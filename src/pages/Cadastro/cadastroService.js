import api, { getAuthToken } from '../../services/api';
import { validationSchema } from './formConfig';

const toDateOrNull = (dateString) => {
    if (!dateString || dateString === '' || dateString === 'Invalid Date') return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

const formatDataForApi = (formData) => {
    if (!formData || typeof formData !== 'object') {
        throw new Error('Dados do formulário inválidos');
    }
    
    try {
        const data = { ...formData };
        
        // ACHATAR DADOS ANINHADOS PARA CORRESPONDER AO SCHEMA DO BACKEND
        
        // História Patológica (historia_patologica -> hp_*)
        if (data.historia_patologica) {
            const hp = data.historia_patologica;
            data.hp_has = hp.has;
            data.hp_diabetes = hp.diabetes;
            data.hp_hipertensao = hp.hipertensao;
            data.hp_hipotireoidismo = hp.hipotireoidismo;
            data.hp_ansiedade = hp.ansiedade;
            data.hp_depressao = hp.depressao;
            data.hp_doenca_cardiaca = hp.doenca_cardiaca;
            data.hp_doenca_renal = hp.doenca_renal;
            data.hp_doenca_pulmonar = hp.doenca_pulmonar;
            data.hp_doenca_figado = hp.doenca_figado;
            data.hp_avc = hp.avc;
            data.hp_outra = hp.outra;
            data.hp_neoplasia_previa = hp.neoplasia_previa;
            data.hp_qual_neoplasia = hp.qual_neoplasia;
            data.hp_idade_diagnostico_neoplasia = hp.idade_diagnostico_neoplasia;
            data.hp_biopsia_mamaria_previa = hp.biopsia_mamaria_previa;
            data.hp_resultado_biopsia = hp.resultado_biopsia;
            delete data.historia_patologica;
        }
        
        // História Familiar (historia_familiar -> hf_*)
        if (data.historia_familiar) {
            const hf = data.historia_familiar;
            data.hf_cancer_familia = hf.cancer_familia;
            data.hf_observacoes = hf.observacoes;
            delete data.historia_familiar;
        }
        
        // Hábitos de Vida (habitos_vida -> hv_*)
        if (data.habitos_vida) {
            const hv = data.habitos_vida;
            data.hv_tabagismo = hv.tabagismo;
            data.hv_tabagismo_carga = hv.tabagismo_carga;
            data.hv_tabagismo_tempo_anos = hv.tabagismo_tempo_anos;
            data.hv_etilismo = hv.etilismo;
            data.hv_etilismo_tempo_anos = hv.etilismo_tempo_anos;
            data.hv_etilismo_dose_diaria = hv.etilismo_dose_diaria;
            data.hv_atividade_fisica = hv.atividade_fisica;
            data.hv_tipo_atividade = hv.tipo_atividade;
            data.hv_tempo_atividade_semanal_min = hv.tempo_atividade_semanal_min;
            delete data.habitos_vida;
        }
        
        // Paridade (paridade -> p_*)
        if (data.paridade) {
            const p = data.paridade;
            data.p_gesta = p.gesta;
            data.p_para = p.para;
            data.p_aborto = p.aborto;
            data.p_teve_filhos = p.teve_filhos;
            data.p_idade_primeiro_filho = p.idade_primeiro_filho;
            data.p_amamentou = p.amamentou;
            data.p_tempo_amamentacao_meses = p.tempo_amamentacao_meses;
            data.p_menarca_idade = p.menarca_idade;
            data.p_menopausa = p.menopausa;
            data.p_idade_menopausa = p.idade_menopausa;
            data.p_uso_trh = p.uso_trh;
            data.p_tempo_uso_trh = p.tempo_uso_trh;
            data.p_tipo_terapia = p.tipo_terapia;
            data.p_uso_aco = p.uso_aco;
            data.p_tempo_uso_aco = p.tempo_uso_aco;
            delete data.paridade;
        }
        
        // História da Doença (historia_doenca -> hd_*)
        if (data.historia_doenca) {
            const hd = data.historia_doenca;
            data.hd_sinal_sintoma_principal = hd.sinal_sintoma_principal;
            data.hd_outro_sinal_sintoma = hd.outro_sinal_sintoma;
            data.hd_data_sintomas = toDateOrNull(hd.data_sintomas);
            data.hd_idade_diagnostico = hd.idade_diagnostico ? parseInt(hd.idade_diagnostico) : null;
            data.hd_ecog = hd.ecog;
            data.hd_lado_acometido = hd.lado_acometido;
            data.hd_tamanho_tumoral_clinico = hd.tamanho_tumoral_clinico ? parseFloat(hd.tamanho_tumoral_clinico) : null;
            data.hd_linfonodos_palpaveis = hd.linfonodos_palpaveis;
            data.hd_estadiamento_clinico = hd.estadiamento_clinico;
            data.hd_metastase_distancia = hd.metastase_distancia;
            data.hd_locais_metastase = hd.locais_metastase;
            delete data.historia_doenca;
        }
        
        // Modelos Preditores (modelos_preditores -> mp_*)
        if (data.modelos_preditores) {
            const mp = data.modelos_preditores;
            data.mp_score_tyrer_cuzick = mp.score_tyrer_cuzick;
            data.mp_score_canrisk = mp.score_canrisk;
            data.mp_score_gail = mp.score_gail;
            delete data.modelos_preditores;
        }
        
        // TRATAMENTO - Transformar estrutura aninhada para schema do backend
        if (data.tratamento) {
            const tratamento = { ...data.tratamento };
            
            // Converter cirurgias de arrays separados para array unificado
            const cirurgias = [];
            if (tratamento.cirurgia?.mamas) {
                tratamento.cirurgia.mamas.forEach(item => {
                    cirurgias.push({
                        tipo_procedimento: 'mama',
                        procedimento: item.procedimento,
                        data_cirurgia: toDateOrNull(item.data)
                    });
                });
            }
            if (tratamento.cirurgia?.axilas) {
                tratamento.cirurgia.axilas.forEach(item => {
                    cirurgias.push({
                        tipo_procedimento: 'axila',
                        procedimento: item.procedimento,
                        data_cirurgia: toDateOrNull(item.data)
                    });
                });
            }
            if (tratamento.cirurgia?.reconstrucoes) {
                tratamento.cirurgia.reconstrucoes.forEach(item => {
                    cirurgias.push({
                        tipo_procedimento: 'reconstrucao',
                        procedimento: item.procedimento,
                        data_cirurgia: toDateOrNull(item.data)
                    });
                });
            }
            tratamento.cirurgias = cirurgias;
            
            // Mapear campos de tratamento para schema do backend
            if (tratamento.quimioterapia) {
                const qt = tratamento.quimioterapia;
                tratamento.qt_neoadj_data_inicio = toDateOrNull(qt.neoadjuvante?.data_inicio);
                tratamento.qt_neoadj_data_termino = toDateOrNull(qt.neoadjuvante?.data_termino);
                tratamento.qt_neoadj_esquema = qt.neoadjuvante?.esquema;
                tratamento.qt_neoadj_intercorrencias = qt.neoadjuvante?.intercorrencias;
                tratamento.qt_adj_data_inicio = toDateOrNull(qt.adjuvante?.data_inicio);
                tratamento.qt_adj_data_termino = toDateOrNull(qt.adjuvante?.data_termino);
                tratamento.qt_adj_esquema = qt.adjuvante?.esquema;
                tratamento.qt_adj_intercorrencias = qt.adjuvante?.intercorrencias;
                tratamento.quimio_paliativa = (qt.paliativa || []).map(q => ({
                    ...q,
                    data_inicio: toDateOrNull(q.data_inicio),
                    data_termino: toDateOrNull(q.data_termino)
                }));
                delete tratamento.quimioterapia;
            }
            
            // Formatar outros campos de tratamento...
            if (tratamento.core_biopsy?.realizada) {
                tratamento.t_core_biopsy_realizada = tratamento.core_biopsy.realizada;
                tratamento.t_core_biopsy_data = toDateOrNull(tratamento.core_biopsy.data);
                tratamento.t_core_biopsy_especime = tratamento.core_biopsy.especime;
                tratamento.t_core_biopsy_tecnica = tratamento.core_biopsy.tecnica;
                tratamento.t_core_biopsy_tipo_lesao = tratamento.core_biopsy.tipo_lesao;
                tratamento.t_core_biopsy_anatomopatologico = tratamento.core_biopsy.anatomopatologico;
                tratamento.t_core_biopsy_tipo_histologico = tratamento.core_biopsy.tipo_histologico;
                delete tratamento.core_biopsy;
            }
            
            data.tratamento = tratamento;
        }
        
        // DESFECHO - Mapear campos aninhados
        if (data.desfecho) {
            data.desfecho.data_morte = toDateOrNull(data.desfecho.data_morte);
            data.desfecho.data_recidiva_local = toDateOrNull(data.desfecho.data_recidiva_local);
            data.desfecho.data_recidiva_regional = toDateOrNull(data.desfecho.data_recidiva_regional);
            if (Array.isArray(data.desfecho.metastases)) {
                data.desfecho.metastases = data.desfecho.metastases.map(m => ({
                    local: m.local
                }));
            }
        }
        
        // TEMPOS DE DIAGNÓSTICO - Mapear para campos do desfecho
        if (data.tempos_diagnostico && data.desfecho) {
            data.desfecho.td_data_primeira_consulta = toDateOrNull(data.tempos_diagnostico.data_primeira_consulta);
            data.desfecho.td_data_diagnostico = toDateOrNull(data.tempos_diagnostico.data_diagnostico);
            data.desfecho.td_data_inicio_tratamento = toDateOrNull(data.tempos_diagnostico.data_inicio_tratamento);
            data.desfecho.td_data_cirurgia = toDateOrNull(data.tempos_diagnostico.data_cirurgia);
            delete data.tempos_diagnostico;
        }
        
        // Formatar data de nascimento
        if (data.data_nascimento) {
            data.data_nascimento = toDateOrNull(data.data_nascimento);
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao formatar dados:', error.message);
        throw new Error('Erro ao processar dados do formulário');
    }
};
export const submitCadastro = async (formData) => {
    console.log('=== SUBMIT CADASTRO INICIADO ===');
    
    // 1. Validação
    console.log('🔍 Validando dados...');
    await validationSchema.validate(formData, { 
        abortEarly: false,
        context: { isSubmitting: true }
    });
    console.log('✅ Validação concluída');

    // 2. Autenticação
    console.log('🔐 Verificando autenticação...');
    const token = await getAuthToken();
    if (!token) {
        console.error('❌ Token não encontrado');
        throw new Error('Token de autenticação não encontrado.');
    }
    console.log('✅ Token obtido:', token.substring(0, 20) + '...');

    // 3. Transformação dos dados
    console.log('🔄 Formatando dados para API...');
    const dataToSubmit = formatDataForApi(formData);
    console.log('✅ Dados formatados:', JSON.stringify(dataToSubmit, null, 2));

    // 4. Chamada à API
    console.log('🚀 Enviando para API...');
    try {
        const response = await api.post('/pacientes', dataToSubmit, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Resposta da API recebida:', response.status, response.data);
        return response;
    } catch (error) {
        console.error('❌ Erro na chamada da API:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};