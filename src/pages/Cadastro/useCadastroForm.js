import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { initialState, validationSchema, errorFieldToTabMap } from './formConfig';
import { submitCadastro } from './cadastroService';

export const useCadastroForm = (setActiveTab, navigate) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Efeito para calcular o IMC (Sua lógica original preservada)
    useEffect(() => {
        const alturaNum = parseFloat(formData.altura);
        const pesoNum = parseFloat(formData.peso);
        if (!isNaN(alturaNum) && !isNaN(pesoNum) && alturaNum > 0) {
            const imcCalculado = (pesoNum / (alturaNum * alturaNum)).toFixed(2);
            if (formData.imc !== imcCalculado) {
                setFormData(prev => ({ ...prev, imc: imcCalculado }));
            }
        } else if (formData.imc !== '') {
            setFormData(prev => ({ ...prev, imc: '' }));
        }
    }, [formData.altura, formData.peso, formData.imc]);

    // Efeito para montar a linha do tempo (Sua lógica original preservada)
    useEffect(() => {
        const { tratamento, histologia, desfecho } = formData;
        const eventos = [];
        const addEvento = (data, titulo, descricao = '') => { if (data) eventos.push({ data, titulo, descricao }); };
        
        addEvento(tratamento.inicio_neoadjuvante, 'Início do Tratamento Neoadjuvante', tratamento.qual_neoadjuvante);
        addEvento(tratamento.termino_neoadjuvante, 'Término do Tratamento Neoadjuvante');
        // ... (resto da sua lógica de eventos) ...

        const dataInicioTratamento = eventos.length > 0 ? [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data))[0].data : '';
        
        setFormData(prev => {
            if (prev.tempos_diagnostico.data_inicio_tratamento !== dataInicioTratamento || JSON.stringify(prev.tempos_diagnostico.eventos) !== JSON.stringify(eventos)) {
                return { ...prev, tempos_diagnostico: { ...prev.tempos_diagnostico, data_inicio_tratamento: dataInicioTratamento, eventos: eventos } };
            }
            return prev;
        });
    }, [formData.tratamento, formData.histologia, formData.desfecho]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }, [errors]);

    const handleNestedChange = useCallback((e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
        const errorKey = `${section}.${name}`;
        if (errors[errorKey]) setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
        });
    }, [errors]);

    const handleNestedCheckbox = useCallback((e, section) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: checked } }));
        const errorKey = `${section}.${name}`;
        if (errors[errorKey]) setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
        });
    }, [errors]);

    const resetForm = useCallback(() => {
        setFormData(initialState);
        setErrors({});
    }, []);

    // Função de salvar com validação integrada
    const handleSave = async (arquivoTermo) => {
        setErrors({});
        setIsLoading(true);
        setSuccessMessage('');

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            
            await submitCadastro(formData, arquivoTermo);
            
            setSuccessMessage('Paciente cadastrado com sucesso! Redirecionando...');
            toast.success('Paciente cadastrado com sucesso!');
            resetForm();
            setTimeout(() => navigate('/registros'), 2000);

        } catch (err) {
            if (err.inner) { // Erro de validação do Yup
                const validationErrors = {};
                let firstErrorTab = null;

                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                    if (!firstErrorTab) {
                        firstErrorTab = errorFieldToTabMap[error.path];
                    }
                });
                
                setErrors(validationErrors);
                toast.error('Por favor, corrija os erros indicados no formulário.');

                if (firstErrorTab) {
                    setActiveTab(firstErrorTab);
                }
            } else { // Erro de API ou outro erro inesperado
                console.error("Erro no cadastro:", err);
                toast.error(err.message || 'Ocorreu um erro ao salvar. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData, setFormData, errors, isLoading, successMessage,
        handleChange, handleNestedChange, handleNestedCheckbox, resetForm, handleSave
    };
};

