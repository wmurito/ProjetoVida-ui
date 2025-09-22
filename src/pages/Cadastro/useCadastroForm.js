import { useState, useEffect } from 'react';
import { initialState } from './formConfig';

export const useCadastroForm = () => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    // Efeito para calcular o IMC
    useEffect(() => {
        const alturaNum = parseFloat(formData.altura);
        const pesoNum = parseFloat(formData.peso);
        if (!isNaN(alturaNum) && !isNaN(pesoNum) && alturaNum > 0) {
            const imcCalculado = (pesoNum / (alturaNum * alturaNum)).toFixed(2);
            setFormData(prev => ({ ...prev, imc: imcCalculado }));
        } else {
            setFormData(prev => ({ ...prev, imc: '' }));
        }
    }, [formData.altura, formData.peso]);

    // Efeito para montar a linha do tempo de eventos
    useEffect(() => {
        const { tratamento, histologia, desfecho } = formData;
        const eventos = [];
        const addEvento = (data, titulo, descricao = '') => { if (data) eventos.push({ data, titulo, descricao }); };
        
        addEvento(tratamento.inicio_neoadjuvante, 'Início do Tratamento Neoadjuvante', tratamento.qual_neoadjuvante);
        addEvento(tratamento.termino_neoadjuvante, 'Término do Tratamento Neoadjuvante');
        addEvento(tratamento.inicio_adjuvante, 'Início do Tratamento Adjuvante', tratamento.qual_adjuvante);
        addEvento(tratamento.termino_adjuvante, 'Término do Tratamento Adjuvante');
        addEvento(tratamento.inicio_radioterapia, 'Início da Radioterapia');
        addEvento(tratamento.fim_radioterapia, 'Término da Radioterapia');
        addEvento(tratamento.inicio_endocrino, 'Início da Endocrinoterapia', tratamento.qual_endocrinoterapia);
        addEvento(tratamento.fim_endocrino, 'Término da Endocrinoterapia');
        (tratamento.quimioterapias_paliativas || []).forEach(qt => { addEvento(qt.inicio_quimioterapia_paliativa, `Início da Quimio Paliativa (${qt.linha_tratamento_paliativo})`, qt.qual_quimioterapia_paliativa); addEvento(qt.fim_quimioterapia_paliativa, `Fim da Quimio Paliativa (${qt.linha_tratamento_paliativo})`); });
        (tratamento.terapias_alvo || []).forEach(ta => { addEvento(ta.inicio_terapia_alvo, `Início da Terapia Alvo`, ta.qual_terapia_alvo); addEvento(ta.fim_terapia_alvo, `Fim da Terapia Alvo`); });
        (desfecho.metastases || []).forEach(meta => addEvento(meta.data_metastase, 'Diagnóstico de Metástase', meta.local_metastase));
        addEvento(desfecho.data_recidiva_local, 'Diagnóstico de Recidiva Local', desfecho.cirurgia_recidiva_local);
        addEvento(desfecho.data_recidiva_regional, 'Diagnóstico de Recidiva Regional', desfecho.cirurgia_recidiva_regional);
        addEvento(desfecho.data_morte, 'Data da Morte', desfecho.causa_morte);

        const dataInicioTratamento = eventos.length > 0 ? [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data))[0].data : '';
        
        setFormData(prev => {
            if (prev.tempos_diagnostico.data_inicio_tratamento !== dataInicioTratamento || JSON.stringify(prev.tempos_diagnostico.eventos) !== JSON.stringify(eventos)) {
                return { ...prev, tempos_diagnostico: { ...prev.tempos_diagnostico, data_inicio_tratamento: dataInicioTratamento, eventos: eventos } };
            }
            return prev;
        });
    }, [formData.tratamento, formData.histologia, formData.desfecho]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleNestedChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
        if (errors[`${section}.${name}`]) setErrors(prev => ({ ...prev, [`${section}.${name}`]: '' }));
    };

    const handleNestedCheckbox = (e, section) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: checked } }));
        if (errors[`${section}.${name}`]) setErrors(prev => ({ ...prev, [`${section}.${name}`]: '' }));
    };

    const resetForm = () => {
        setFormData(initialState);
        setErrors({});
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleChange,
        handleNestedChange,
        handleNestedCheckbox,
        resetForm
    };
};