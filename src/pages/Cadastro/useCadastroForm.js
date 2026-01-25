import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { initialState, validationSchema, errorFieldToTabMap } from './formConfig';
import { submitCadastro } from './cadastroService';

const STORAGE_KEY = 'cadastro_paciente_draft';

// Função para salvar dados no localStorage
const saveToLocalStorage = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            data,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        console.warn('Erro ao salvar rascunho:', error);
    }
};

// Função para carregar dados do localStorage
const loadFromLocalStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const { data, timestamp } = JSON.parse(stored);
            // Verificar se o rascunho não é muito antigo (7 dias)
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            if (new Date(timestamp) > sevenDaysAgo) {
                return data;
            }
        }
    } catch (error) {
        console.warn('Erro ao carregar rascunho:', error);
    }
    return null;
};

// Função para limpar dados do localStorage
const clearLocalStorage = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Erro ao limpar rascunho:', error);
    }
};

export const useCadastroForm = (setActiveTab, navigate) => {
    // Carregar dados salvos ou usar estado inicial
    const [formData, setFormData] = useState(() => {
        const savedData = loadFromLocalStorage();
        if (savedData) {
            toast.info('Rascunho carregado! Você pode continuar de onde parou.');
            return savedData;
        }
        return initialState;
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Salvar automaticamente no localStorage sempre que formData mudar
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveToLocalStorage(formData);
        }, 1000); // Debounce de 1 segundo
        
        return () => clearTimeout(timeoutId);
    }, [formData]);

    // Efeito para calcular o IMC
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

    // Efeito para montar a linha do tempo
    useEffect(() => {
        const { tratamento, histologia, desfecho } = formData;
        const eventos = [];
        const addEvento = (data, titulo, descricao = '') => { if (data) eventos.push({ data, titulo, descricao }); };
        
        addEvento(tratamento.inicio_neoadjuvante, 'Início do Tratamento Neoadjuvante', tratamento.qual_neoadjuvante);
        addEvento(tratamento.termino_neoadjuvante, 'Término do Tratamento Neoadjuvante');

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
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [errors]);

    const handleNestedChange = useCallback((e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
        const errorKey = `${section}.${name}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    }, [errors]);

    const handleNestedCheckbox = useCallback((e, section) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: checked } }));
        const errorKey = `${section}.${name}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    }, [errors]);

    const resetForm = useCallback(() => {
        setFormData(initialState);
        setErrors({});
        clearLocalStorage();
    }, []);

    // Função de salvar com validação integrada
    const handleSave = async () => {
        setErrors({});
        setIsLoading(true);
        setSuccessMessage('');

        console.log('=== DADOS ANTES DA VALIDAÇÃO ===');
        console.log('Dados do formulário:', JSON.stringify(formData, null, 2));

        try {
            await validationSchema.validate(formData, { 
                abortEarly: false,
                context: { isSubmitting: true }
            });
            console.log('✅ Validação passou com sucesso!');
            
            console.log('=== ENVIANDO PARA API ===');
            const response = await submitCadastro(formData);
            console.log('✅ Resposta da API:', response.data);
            
            // Limpar rascunho após sucesso
            clearLocalStorage();
            
            setSuccessMessage('Paciente cadastrado com sucesso! Redirecionando...');
            toast.success('Paciente cadastrado com sucesso!');
            resetForm();
            setTimeout(() => navigate('/registros'), 2000);

        } catch (err) {
            console.log('❌ ERRO NO CADASTRO:', err);
            
            if (err.inner) { // Erro de validação do Yup
                const validationErrors = {};
                let firstErrorTab = null;

                console.log('Erros de validação encontrados:', err.inner);

                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                    console.log(`❌ Erro no campo: ${error.path} - ${error.message}`);
                    if (!firstErrorTab) {
                        firstErrorTab = errorFieldToTabMap[error.path];
                    }
                });
                
                setErrors(validationErrors);
                console.log('Todos os erros:', validationErrors);
                toast.error('Por favor, corrija os erros indicados no formulário.');

                if (firstErrorTab) {
                    setActiveTab(firstErrorTab);
                }
            } else { // Erro de API ou outro erro inesperado
                console.error("❌ Erro no cadastro:", err);
                console.error("Detalhes do erro:", err.message, err.response?.data);
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

