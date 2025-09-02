import React, { useState, useEffect } from 'react';
import { validationSchema, initialState } from './formConfig';
import api, { getAuthToken } from '../../services/api';

// --- Importação dos Componentes Reutilizáveis ---
import FamilyMemberModal from '../../components/Modal/FamilyMemberModal';
import PalliativeChemoModal from '../../components/PalliativeChemoModal';
import TargetedTherapyModal from '../../components/TargetedTherapyModal';
import MetastaseModal from '../../components/MetastaseModal';

// --- Importação dos Componentes de Seção ---
import DadosPessoaisSection from '../../components/FormSections/DadosPessoaisSection';
import HistoriaPatologicaSection from '../../components/FormSections/HistoriaPatologicaSection';
import HistoriaFamiliarSection from '../../components/FormSections/HistoriaFamiliarSection';
import HabitosDeVidaSection from '../../components/FormSections/HabitosDeVidaSection';
import ParidadeSection from '../../components/FormSections/ParidadeSection';
import HistoriaDoencaSection from '../../components/FormSections/HistoriaDoencaSection';
import HistologiaSection from '../../components/FormSections/HistologiaSection';
import TratamentoSection from '../../components/FormSections/TratamentoSection';
import DesfechoSection from '../../components/FormSections/DesfechoSection';
import TemposDiagnosticoSection from '../../components/FormSections/TemposDiagnosticoSection';

// --- Importação dos Estilos da Página ---
import {
    Container,
    FormContainer,
    Section,
    SectionTitle,
    Button,
    FixedSubmitButton,
    SuccessMessage,
    ApiErrorContainer,
    ErrorText,
    TabNav,
    TabButton
} from './styles';

// --- Funções Auxiliares ---
const toDateOrNull = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};
const toNumberOrNull = (value, isInteger = false) => {
    if (value === null || value === '' || isNaN(value)) return null;
    return isInteger ? parseInt(value) : parseFloat(value);
};

// --- Definição das Abas (Estrutura Consolidada) ---
const tabs = [
    { key: 'identificacao', label: 'Identificação e Social' },
    { key: 'historico', label: 'Histórico e Hábitos' },
    { key: 'dadosClinicos', label: 'Dados Clínicos e Doença' },
    { key: 'tratamentoEvolucao', label: 'Tratamento e Evolução' },
];

// Mapeamento de erros ATUALIZADO para as novas abas
const errorFieldToTabMap = {
    'nome_completo': 'identificacao', 'idade': 'identificacao', 'endereco': 'identificacao', 'cidade': 'identificacao', 'data_nascimento': 'identificacao', 'naturalidade': 'identificacao', 'cor_etnia': 'identificacao', 'escolaridade': 'identificacao', 'renda_familiar': 'identificacao',
    'historia_patologica': 'historico',
    'familiares': 'historico', 'historia_familiar': 'historico',
    'habitos_vida': 'historico',
    'paridade': 'dadosClinicos',
    'historia_doenca': 'dadosClinicos',
    'histologia': 'dadosClinicos',
    'tratamento': 'tratamentoEvolucao',
    'desfecho': 'tratamentoEvolucao',
    'tempos_diagnostico': 'tratamentoEvolucao',
};

// --- Componente Principal da Página ---
const CadastroPacientePage = () => {
    // --- Estados do Formulário e UI ---
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [apiErrors, setApiErrors] = useState([]);
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    // Estados dos Modais
    const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isPalliativeChemoModalOpen, setIsPalliativeChemoModalOpen] = useState(false);
    const [editingPalliativeChemo, setEditingPalliativeChemo] = useState(null);
    const [editingPalliativeChemoIndex, setEditingPalliativeChemoIndex] = useState(null);
    const [isTargetedTherapyModalOpen, setIsTargetedTherapyModalOpen] = useState(false);
    const [editingTargetedTherapy, setEditingTargetedTherapy] = useState(null);
    const [editingTargetedTherapyIndex, setEditingTargetedTherapyIndex] = useState(null);
    const [isMetastaseModalOpen, setIsMetastaseModalOpen] = useState(false);
    const [editingMetastase, setEditingMetastase] = useState(null);
    const [editingMetastaseIndex, setEditingMetastaseIndex] = useState(null);

    // --- Efeitos ---
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

    useEffect(() => {
        const { tratamento, histologia } = formData;
        
        const datasDeTratamento = [
            tratamento.inicio_neoadjuvante,
            tratamento.inicio_adjuvante,
            tratamento.inicio_radioterapia,
            tratamento.inicio_endocrino,
            tratamento.quimioterapias_paliativas?.[0]?.inicio_quimioterapia_paliativa,
            tratamento.terapias_alvo?.[0]?.inicio_terapia_alvo,
        ].filter(Boolean);

        let dataInicioTratamento = '';
        if (datasDeTratamento.length > 0) {
            const datasComoObjetos = datasDeTratamento.map(d => new Date(d));
            const dataMaisAntiga = new Date(Math.min.apply(null, datasComoObjetos));
            dataInicioTratamento = dataMaisAntiga.toISOString().split('T')[0];
        }

        setFormData(prev => {
            if (prev.tempos_diagnostico.data_inicio_tratamento !== dataInicioTratamento) {
                return {
                    ...prev,
                    tempos_diagnostico: {
                        ...prev.tempos_diagnostico,
                        data_inicio_tratamento: dataInicioTratamento,
                    }
                };
            }
            return prev;
        });
    }, [
        formData.tratamento.inicio_neoadjuvante,
        formData.tratamento.inicio_adjuvante,
        formData.tratamento.inicio_radioterapia,
        formData.tratamento.inicio_endocrino,
        formData.tratamento.quimioterapias_paliativas,
        formData.tratamento.terapias_alvo,
    ]);

    // --- Manipuladores de Eventos (Handlers) ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNestedChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
        if (errors[`${section}.${name}`]) {
            setErrors(prev => ({ ...prev, [`${section}.${name}`]: '' }));
        }
    };

    const handleNestedCheckbox = (e, section) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: checked } }));
        if (errors[`${section}.${name}`]) {
            setErrors(prev => ({ ...prev, [`${section}.${name}`]: '' }));
        }
    };

    // --- Funções dos Modais ---
    const handleAddMember = () => {
        setEditingMember(null);
        setEditingIndex(null);
        setIsFamilyModalOpen(true);
    };
    const handleEditMember = (member, index) => {
        setEditingMember(member);
        setEditingIndex(index);
        setIsFamilyModalOpen(true);
    };
    const handleRemoveMember = (indexToRemove) => {
        if (window.confirm('Tem certeza que deseja remover este membro da família?')) {
            setFormData(prev => ({
                ...prev,
                familiares: prev.familiares.filter((_, index) => index !== indexToRemove)
            }));
        }
    };
    const handleSubmitMember = (memberData) => {
        setFormData(prev => {
            const newFamiliares = [...prev.familiares];
            if (editingIndex !== null) {
                newFamiliares[editingIndex] = memberData;
            } else {
                newFamiliares.push(memberData);
            }
            return { ...prev, familiares: newFamiliares };
        });
    };
    const handleCloseFamilyModal = () => {
        setIsFamilyModalOpen(false);
        setEditingIndex(null);
        setEditingMember(null);
    };

    const handleAddPalliativeChemo = () => {
        setEditingPalliativeChemo(null);
        setEditingPalliativeChemoIndex(null);
        setIsPalliativeChemoModalOpen(true);
    };
    const handleEditPalliativeChemo = (chemo, index) => {
        setEditingPalliativeChemo(chemo);
        setEditingPalliativeChemoIndex(index);
        setIsPalliativeChemoModalOpen(true);
    };
    const handleRemovePalliativeChemo = (indexToRemove) => {
        if (window.confirm('Tem certeza que deseja remover este registro?')) {
            setFormData(prev => ({ ...prev, tratamento: { ...prev.tratamento, quimioterapias_paliativas: prev.tratamento.quimioterapias_paliativas.filter((_, index) => index !== indexToRemove) } }));
        }
    };
    const handleSubmitPalliativeChemo = (chemoData) => {
        setFormData(prev => {
            const newChemos = [...prev.tratamento.quimioterapias_paliativas];
            if (editingPalliativeChemoIndex !== null) { newChemos[editingPalliativeChemoIndex] = chemoData; } else { newChemos.push(chemoData); }
            return { ...prev, tratamento: { ...prev.tratamento, quimioterapias_paliativas: newChemos } };
        });
        setIsPalliativeChemoModalOpen(false);
    };
    const handleClosePalliativeChemoModal = () => setIsPalliativeChemoModalOpen(false);

    const handleAddTargetedTherapy = () => {
        setEditingTargetedTherapy(null);
        setEditingTargetedTherapyIndex(null);
        setIsTargetedTherapyModalOpen(true);
    };
    const handleEditTargetedTherapy = (therapy, index) => {
        setEditingTargetedTherapy(therapy);
        setEditingTargetedTherapyIndex(index);
        setIsTargetedTherapyModalOpen(true);
    };
    const handleRemoveTargetedTherapy = (indexToRemove) => {
        if (window.confirm('Tem certeza que deseja remover este registro?')) {
            setFormData(prev => ({ ...prev, tratamento: { ...prev.tratamento, terapias_alvo: prev.tratamento.terapias_alvo.filter((_, index) => index !== indexToRemove) } }));
        }
    };
    const handleSubmitTargetedTherapy = (therapyData) => {
        setFormData(prev => {
            const newTherapies = [...prev.tratamento.terapias_alvo];
            if (editingTargetedTherapyIndex !== null) { newTherapies[editingTargetedTherapyIndex] = therapyData; } else { newTherapies.push(therapyData); }
            return { ...prev, tratamento: { ...prev.tratamento, terapias_alvo: newTherapies } };
        });
        setIsTargetedTherapyModalOpen(false);
    };
    const handleCloseTargetedTherapyModal = () => {
        setIsTargetedTherapyModalOpen(false);
        setEditingTargetedTherapy(null);
        setEditingTargetedTherapyIndex(null);
    };

    const handleAddMetastase = () => {
        setEditingMetastase(null);
        setEditingMetastaseIndex(null);
        setIsMetastaseModalOpen(true);
    };
    const handleEditMetastase = (metastase, index) => {
        setEditingMetastase(metastase);
        setEditingMetastaseIndex(index);
        setIsMetastaseModalOpen(true);
    };
    const handleRemoveMetastase = (indexToRemove) => {
        if (window.confirm('Tem certeza que deseja remover este registro de metástase?')) {
            setFormData(prev => ({ ...prev, desfecho: { ...prev.desfecho, metastases: prev.desfecho.metastases.filter((_, index) => index !== indexToRemove) } }));
        }
    };
    const handleSubmitMetastase = (metastaseData) => {
        setFormData(prev => {
            const newMetastases = [...prev.desfecho.metastases];
            if (editingMetastaseIndex !== null) { newMetastases[editingMetastaseIndex] = metastaseData; } else { newMetastases.push(metastaseData); }
            return { ...prev, desfecho: { ...prev.desfecho, metastases: newMetastases } };
        });
        setIsMetastaseModalOpen(false);
    };
    const handleCloseMetastaseModal = () => setIsMetastaseModalOpen(false);

    // --- Submissão Principal do Formulário ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors([]);
        setErrors({});

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setIsLoading(true);
            const token = await getAuthToken();
            if (!token) {
                setApiErrors(['Token de autenticação não encontrado. Faça login novamente.']);
                setIsLoading(false);
                return;
            }

            const dataToSubmit = {
                ...formData,
                data_nascimento: toDateOrNull(formData.data_nascimento),
                habitos_vida: {
                    ...formData.habitos_vida,
                    tabagismo_carga: toNumberOrNull(formData.habitos_vida.tabagismo_carga),
                    tabagismo_tempo_anos: toNumberOrNull(formData.habitos_vida.tabagismo_tempo_anos),
                    etilismo_tempo_anos: toNumberOrNull(formData.habitos_vida.etilismo_tempo_anos),
                    tempo_atividade_semanal_min: toNumberOrNull(formData.habitos_vida.tempo_atividade_semanal_min, true)
                },
                paridade: { ...formData.paridade, gesta: toNumberOrNull(formData.paridade.gesta, true), para: toNumberOrNull(formData.paridade.para, true), aborto: toNumberOrNull(formData.paridade.aborto, true), idade_primeiro_filho: toNumberOrNull(formData.paridade.idade_primeiro_filho, true), tempo_amamentacao_meses: toNumberOrNull(formData.paridade.tempo_amamentacao_meses, true), menarca_idade: toNumberOrNull(formData.paridade.menarca_idade, true), idade_menopausa: toNumberOrNull(formData.paridade.idade_menopausa, true), tempo_uso_trh: toNumberOrNull(formData.paridade.tempo_uso_trh), },
                historia_doenca: { ...formData.historia_doenca, idade_diagnostico: toNumberOrNull(formData.historia_doenca.idade_diagnostico, true), score_tyrer_cuzick: toNumberOrNull(formData.historia_doenca.score_tyrer_cuzick), score_canrisk: toNumberOrNull(formData.historia_doenca.score_canrisk), score_gail: toNumberOrNull(formData.historia_doenca.score_gail), },
                histologia: { ...formData.histologia, tamanho_tumoral: toNumberOrNull(formData.histologia.tamanho_tumoral), bls_numerador: toNumberOrNull(formData.histologia.bls_numerador, true), bls_denominador: toNumberOrNull(formData.histologia.bls_denominador, true), ea_numerador: toNumberOrNull(formData.histologia.ea_numerador, true), ea_denominador: toNumberOrNull(formData.histologia.ea_denominador, true), },
                tratamento: {
                    ...formData.tratamento,
                    inicio_neoadjuvante: toDateOrNull(formData.tratamento.inicio_neoadjuvante),
                    termino_neoadjuvante: toDateOrNull(formData.tratamento.termino_neoadjuvante),
                    inicio_quimioterapia_neoadjuvante: toDateOrNull(formData.tratamento.inicio_quimioterapia_neoadjuvante),
                    fim_quimioterapia_neoadjuvante: toDateOrNull(formData.tratamento.fim_quimioterapia_neoadjuvante),
                    inicio_adjuvante: toDateOrNull(formData.tratamento.inicio_adjuvante),
                    termino_adjuvante: toDateOrNull(formData.tratamento.termino_adjuvante),
                    inicio_quimioterapia_adjuvante: toDateOrNull(formData.tratamento.inicio_quimioterapia_adjuvante),
                    fim_quimioterapia_adjuvante: toDateOrNull(formData.tratamento.fim_quimioterapia_adjuvante),
                    quimioterapias_paliativas: formData.tratamento.quimioterapias_paliativas.map(chemo => ({
                        ...chemo,
                        inicio_quimioterapia_paliativa: toDateOrNull(chemo.inicio_quimioterapia_paliativa),
                        fim_quimioterapia_paliativa: toDateOrNull(chemo.fim_quimioterapia_paliativa),
                    })),
                    terapias_alvo: formData.tratamento.terapias_alvo.map(therapy => ({
                        ...therapy,
                        inicio_terapia_alvo: toDateOrNull(therapy.inicio_terapia_alvo),
                        fim_terapia_alvo: toDateOrNull(therapy.fim_terapia_alvo),
                    })),
                    radioterapia_sessoes: toNumberOrNull(formData.tratamento.radioterapia_sessoes, true),
                    inicio_radioterapia: toDateOrNull(formData.tratamento.inicio_radioterapia),
                    fim_radioterapia: toDateOrNull(formData.tratamento.fim_radioterapia),
                    inicio_endocrino: toDateOrNull(formData.tratamento.inicio_endocrino),
                    fim_endocrino: toDateOrNull(formData.tratamento.fim_endocrino),
                },
                desfecho: {
                    ...formData.desfecho,
                    data_morte: toDateOrNull(formData.desfecho.data_morte),
                    data_recidiva_local: toDateOrNull(formData.desfecho.data_recidiva_local),
                    data_recidiva_regional: toDateOrNull(formData.desfecho.data_recidiva_regional),
                    metastases: formData.desfecho.metastases.map(m => ({
                        ...m,
                        data_metastase: toDateOrNull(m.data_metastase)
                    }))
                },
                tempos_diagnostico: { ...formData.tempos_diagnostico, data_primeira_consulta: toDateOrNull(formData.tempos_diagnostico.data_primeira_consulta), data_diagnostico: toDateOrNull(formData.tempos_diagnostico.data_diagnostico), data_cirurgia: toDateOrNull(formData.tempos_diagnostico.data_cirurgia), data_inicio_tratamento: toDateOrNull(formData.tempos_diagnostico.data_inicio_tratamento), },
            };

            console.log('Dados Prontos para Enviar:', JSON.stringify(dataToSubmit, null, 2));
            const response = await api.post('/pacientes', dataToSubmit, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage('Paciente cadastrado com sucesso!');
                setFormData(initialState);
                setActiveTab(tabs[0].key);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach(err => { validationErrors[err.path] = err.message; });
                setErrors(validationErrors);

                if (error.inner.length > 0) {
                    const firstErrorPath = error.inner[0].path.split('.')[0];
                    const tabWithError = errorFieldToTabMap[firstErrorPath] || tabs[0].key;
                    setActiveTab(tabWithError);
                }
            } else if (error.response) {
                const errorMessage = error.response.data?.detail || error.response.data?.message || `Erro ${error.response.status || ''}: Falha ao comunicar com o servidor.`;
                setApiErrors([errorMessage]);
            } else {
                setApiErrors(['Ocorreu um erro inesperado. Verifique sua conexão.']);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <FamilyMemberModal isOpen={isFamilyModalOpen} onClose={handleCloseFamilyModal} onSubmit={handleSubmitMember} member={editingMember} />
            <PalliativeChemoModal isOpen={isPalliativeChemoModalOpen} onClose={handleClosePalliativeChemoModal} onSubmit={handleSubmitPalliativeChemo} chemoData={editingPalliativeChemo} />
            <TargetedTherapyModal isOpen={isTargetedTherapyModalOpen} onClose={handleCloseTargetedTherapyModal} onSubmit={handleSubmitTargetedTherapy} therapyData={editingTargetedTherapy} />
            <MetastaseModal isOpen={isMetastaseModalOpen} onClose={handleCloseMetastaseModal} onSubmit={handleSubmitMetastase} metastaseData={editingMetastase} />

            <FormContainer onSubmit={handleSubmit} noValidate>
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                {apiErrors.length > 0 && (
                    <ApiErrorContainer>
                        {apiErrors.map((error, index) => <ErrorText key={index}>{error}</ErrorText>)}
                    </ApiErrorContainer>
                )}

                <TabNav>
                    {tabs.map(tab => (
                        <TabButton
                            key={tab.key}
                            type="button"
                            $isActive={activeTab === tab.key}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </TabButton>
                    ))}
                </TabNav>
                
                {activeTab === 'identificacao' && (
                    <Section>
                        <SectionTitle>Identificação e Dados Sociais</SectionTitle>
                        <DadosPessoaisSection formData={formData} errors={errors} handleChange={handleChange} />
                    </Section>
                )}

                {activeTab === 'historico' && (
                    <>
                        <Section>
                            <SectionTitle>História Patológica Pregressa</SectionTitle>
                            <HistoriaPatologicaSection formData={formData.historia_patologica} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_patologica')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'historia_patologica')} />
                        </Section>
                        <Section>
                            <SectionTitle>História Familiar</SectionTitle>
                            <HistoriaFamiliarSection familiares={formData.familiares} historiaFamiliar={formData.historia_familiar} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_familiar')} onAddMember={handleAddMember} onEditMember={handleEditMember} onRemoveMember={handleRemoveMember} />
                        </Section>
                        <Section>
                            <SectionTitle>Hábitos de Vida</SectionTitle>
                            <HabitosDeVidaSection formData={formData.habitos_vida} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'habitos_vida')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'habitos_vida')} />
                        </Section>
                    </>
                )}

                {activeTab === 'dadosClinicos' && (
                    <>
                        <Section>
                            <SectionTitle>Paridade</SectionTitle>
                            <ParidadeSection formData={formData.paridade} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'paridade')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'paridade')} />
                        </Section>
                        <Section>
                            <SectionTitle>História da Doença Atual</SectionTitle>
                            <HistoriaDoencaSection formData={formData.historia_doenca} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_doenca')} />
                        </Section>
                        <Section>
                            <SectionTitle>Histologia</SectionTitle>
                            <HistologiaSection formData={formData.histologia} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'histologia')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'histologia')} />
                        </Section>
                    </>
                )}

                {activeTab === 'tratamentoEvolucao' && (
                    <>
                        <Section>
                            <SectionTitle>Tratamento</SectionTitle>
                            <TratamentoSection formData={formData.tratamento} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'tratamento')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'tratamento')} onAddPalliativeChemo={handleAddPalliativeChemo} onEditPalliativeChemo={handleEditPalliativeChemo} onRemovePalliativeChemo={handleRemovePalliativeChemo} onAddTargetedTherapy={handleAddTargetedTherapy} onEditTargetedTherapy={handleEditTargetedTherapy} onRemoveTargetedTherapy={handleRemoveTargetedTherapy} />
                        </Section>
                        <Section>
                            <SectionTitle>Desfecho</SectionTitle>
                            <DesfechoSection formData={formData.desfecho} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'desfecho')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'desfecho')} onAddMetastase={handleAddMetastase} onEditMetastase={handleEditMetastase} onRemoveMetastase={handleRemoveMetastase} />
                        </Section>
                        <Section>
                            <SectionTitle>Tempos de Diagnóstico</SectionTitle>
                            <TemposDiagnosticoSection formData={formData.tempos_diagnostico} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />
                        </Section>
                    </>
                )}

                <FixedSubmitButton>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar Cadastro'}
                    </Button>
                </FixedSubmitButton>
            </FormContainer>
        </Container>
    );
};

export default CadastroPacientePage;