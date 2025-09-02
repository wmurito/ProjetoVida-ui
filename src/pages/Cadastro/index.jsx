import React, { useState, useEffect } from 'react';
import { validationSchema, initialState } from './formConfig';
import api, { getAuthToken } from '../../services/api';

// --- Importação dos Componentes Reutilizáveis ---
import FamilyMemberModal from '../../components/FamilyMemberModal';
import PalliativeChemoModal from '../../components/PalliativeChemoModal';
import TargetedTherapyModal from '../../components/TargetedTherapyModal';
import MetastaseModal from '../../components/MetastaseModal';
import TermoAceiteModal from '../../components/TermoAceiteModal';

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

// --- Definição das Abas ---
const tabs = [
    { key: 'identificacao', label: 'Identificação e Social' },
    { key: 'historico', label: 'Histórico e Hábitos' },
    { key: 'dadosClinicos', label: 'Dados Clínicos e Doença' },
    { key: 'tratamentoEvolucao', label: 'Tratamento e Evolução' },
];

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

    // Estados para o Termo de Aceite
    const [termoAceito, setTermoAceito] = useState(false);
    const [arquivoTermo, setArquivoTermo] = useState(null);
    const [erroTermo, setErroTermo] = useState('');
    const [acessoLiberado, setAcessoLiberado] = useState(false);

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
        const { tratamento, histologia, desfecho } = formData;
        const eventos = [];
        const addEvento = (data, titulo, descricao = '') => { if (data) eventos.push({ data, titulo, descricao }); };
        addEvento(tratamento.inicio_neoadjuvante, 'Início do Tratamento Neoadjuvante', tratamento.qual_neoadjuvante);
        addEvento(tratamento.termino_neoadjuvante, 'Término do Tratamento Neoadjuvante');
        tratamento.quimioterapias_paliativas.forEach(qt => addEvento(qt.inicio_quimioterapia_paliativa, `Início da Quimio Paliativa (${qt.linha_tratamento_paliativo})`, qt.qual_quimioterapia_paliativa));
        desfecho.metastases.forEach(meta => addEvento(meta.data_metastase, 'Diagnóstico de Metástase', meta.local_metastase));
        addEvento(desfecho.data_recidiva_local, 'Diagnóstico de Recidiva Local', desfecho.cirurgia_recidiva_local);
        addEvento(desfecho.data_morte, 'Data da Morte', desfecho.causa_morte);

        const dataInicioTratamento = eventos.length > 0 ? [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data))[0].data : '';

        setFormData(prev => {
            if (prev.tempos_diagnostico.data_inicio_tratamento !== dataInicioTratamento || JSON.stringify(prev.tempos_diagnostico.eventos) !== JSON.stringify(eventos)) {
                return { ...prev, tempos_diagnostico: { ...prev.tempos_diagnostico, data_inicio_tratamento: dataInicioTratamento, eventos: eventos } };
            }
            return prev;
        });
    }, [formData.tratamento, formData.histologia, formData.desfecho]);

    // --- Handlers ---
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

    // --- Handlers dos Modais ---
    const handleAddMember = () => { setIsFamilyModalOpen(true); };
    const handleEditMember = (member, index) => { setEditingMember(member); setEditingIndex(index); setIsFamilyModalOpen(true); };
    const handleRemoveMember = (indexToRemove) => { if (window.confirm('Tem certeza?')) setFormData(prev => ({ ...prev, familiares: prev.familiares.filter((_, index) => index !== indexToRemove) })); };
    const handleSubmitMember = (memberData) => {
        setFormData(prev => {
            const newFamiliares = [...prev.familiares];
            if (editingIndex !== null) { newFamiliares[editingIndex] = memberData; } else { newFamiliares.push(memberData); }
            return { ...prev, familiares: newFamiliares };
        });
    };
    const handleCloseFamilyModal = () => { setIsFamilyModalOpen(false); setEditingIndex(null); setEditingMember(null); };

    const handleAddPalliativeChemo = () => { setIsPalliativeChemoModalOpen(true); };
    const handleEditPalliativeChemo = (chemo, index) => { setEditingPalliativeChemo(chemo); setEditingPalliativeChemoIndex(index); setIsPalliativeChemoModalOpen(true); };
    const handleRemovePalliativeChemo = (indexToRemove) => { if (window.confirm('Tem certeza?')) setFormData(prev => ({ ...prev, tratamento: { ...prev.tratamento, quimioterapias_paliativas: prev.tratamento.quimioterapias_paliativas.filter((_, index) => index !== indexToRemove) } })); };
    const handleSubmitPalliativeChemo = (chemoData) => {
        setFormData(prev => {
            const newChemos = [...prev.tratamento.quimioterapias_paliativas];
            if (editingPalliativeChemoIndex !== null) { newChemos[editingPalliativeChemoIndex] = chemoData; } else { newChemos.push(chemoData); }
            return { ...prev, tratamento: { ...prev.tratamento, quimioterapias_paliativas: newChemos } };
        });
        setIsPalliativeChemoModalOpen(false);
    };
    const handleClosePalliativeChemoModal = () => setIsPalliativeChemoModalOpen(false);

    const handleAddTargetedTherapy = () => { setIsTargetedTherapyModalOpen(true); };
    const handleEditTargetedTherapy = (therapy, index) => { setEditingTargetedTherapy(therapy); setEditingTargetedTherapyIndex(index); setIsTargetedTherapyModalOpen(true); };
    const handleRemoveTargetedTherapy = (indexToRemove) => { if (window.confirm('Tem certeza?')) setFormData(prev => ({ ...prev, tratamento: { ...prev.tratamento, terapias_alvo: prev.tratamento.terapias_alvo.filter((_, index) => index !== indexToRemove) } })); };
    const handleSubmitTargetedTherapy = (therapyData) => {
        setFormData(prev => {
            const newTherapies = [...prev.tratamento.terapias_alvo];
            if (editingTargetedTherapyIndex !== null) { newTherapies[editingTargetedTherapyIndex] = therapyData; } else { newTherapies.push(therapyData); }
            return { ...prev, tratamento: { ...prev.tratamento, terapias_alvo: newTherapies } };
        });
        setIsTargetedTherapyModalOpen(false);
    };
    const handleCloseTargetedTherapyModal = () => { setIsTargetedTherapyModalOpen(false); setEditingTargetedTherapy(null); setEditingTargetedTherapyIndex(null); };

    const handleAddMetastase = () => { setIsMetastaseModalOpen(true); };
    const handleEditMetastase = (metastase, index) => { setEditingMetastase(metastase); setEditingMetastaseIndex(index); setIsMetastaseModalOpen(true); };
    const handleRemoveMetastase = (indexToRemove) => { if (window.confirm('Tem certeza?')) setFormData(prev => ({ ...prev, desfecho: { ...prev.desfecho, metastases: prev.desfecho.metastases.filter((_, index) => index !== indexToRemove) } })); };
    const handleSubmitMetastase = (metastaseData) => {
        setFormData(prev => {
            const newMetastases = [...prev.desfecho.metastases];
            if (editingMetastaseIndex !== null) { newMetastases[editingMetastaseIndex] = metastaseData; } else { newMetastases.push(metastaseData); }
            return { ...prev, desfecho: { ...prev.desfecho, metastases: newMetastases } };
        });
        setIsMetastaseModalOpen(false);
    };
    const handleCloseMetastaseModal = () => setIsMetastaseModalOpen(false);

    const handleConfirmarAceite = () => {
        if (!termoAceito || !arquivoTermo) {
            setErroTermo('É necessário aceitar os termos e anexar o arquivo para continuar.');
            return;
        }
        setErroTermo('');
        setAcessoLiberado(true);
    };

    // --- Submissão Principal ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiErrors([]);
        setErrors({});

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setIsLoading(true);
            const token = await getAuthToken();
            if (!token) throw new Error('Token de autenticação não encontrado.');

            const dataToSubmit = { /* ... objeto completo ... */ };

            const dadosFormulario = new FormData();
            dadosFormulario.append('termo_consentimento', arquivoTermo);
            dadosFormulario.append('data', JSON.stringify(dataToSubmit));

            const response = await api.post('/pacientes', dadosFormulario, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage('Paciente cadastrado com sucesso!');
                setFormData(initialState);
                setActiveTab(tabs[0].key);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        } catch (error) {
            // ... (tratamento de erros)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <TermoAceiteModal 
                isOpen={!acessoLiberado}
                onConfirm={handleConfirmarAceite}
                termoAceito={termoAceito}
                setTermoAceito={setTermoAceito}
                arquivoTermo={arquivoTermo}
                setArquivoTermo={setArquivoTermo}
                erroTermo={erroTermo}
            />

            {acessoLiberado && (
                <>
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
                                <TabButton key={tab.key} type="button" $isActive={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
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
                                <Section><SectionTitle>História Patológica Pregressa</SectionTitle><HistoriaPatologicaSection formData={formData.historia_patologica} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_patologica')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'historia_patologica')} /></Section>
                                <Section><SectionTitle>História Familiar</SectionTitle><HistoriaFamiliarSection familiares={formData.familiares} historiaFamiliar={formData.historia_familiar} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_familiar')} onAddMember={handleAddMember} onEditMember={handleEditMember} onRemoveMember={handleRemoveMember} /></Section>
                                <Section><SectionTitle>Hábitos de Vida</SectionTitle><HabitosDeVidaSection formData={formData.habitos_vida} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'habitos_vida')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'habitos_vida')} /></Section>
                            </>
                        )}
                        {activeTab === 'dadosClinicos' && (
                            <>
                                <Section><SectionTitle>Paridade</SectionTitle><ParidadeSection formData={formData.paridade} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'paridade')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'paridade')} /></Section>
                                <Section><SectionTitle>História da Doença Atual</SectionTitle><HistoriaDoencaSection formData={formData.historia_doenca} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_doenca')} /></Section>
                                <Section><SectionTitle>Histologia</SectionTitle><HistologiaSection formData={formData.histologia} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'histologia')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'histologia')} /></Section>
                            </>
                        )}
                        {activeTab === 'tratamentoEvolucao' && (
                            <>
                                <Section><SectionTitle>Tratamento</SectionTitle><TratamentoSection formData={formData.tratamento} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'tratamento')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'tratamento')} onAddPalliativeChemo={handleAddPalliativeChemo} onEditPalliativeChemo={handleEditPalliativeChemo} onRemovePalliativeChemo={handleRemovePalliativeChemo} onAddTargetedTherapy={handleAddTargetedTherapy} onEditTargetedTherapy={handleEditTargetedTherapy} onRemoveTargetedTherapy={handleRemoveTargetedTherapy} /></Section>
                                <Section><SectionTitle>Desfecho</SectionTitle><DesfechoSection formData={formData.desfecho} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'desfecho')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'desfecho')} onAddMetastase={handleAddMetastase} onEditMetastase={handleEditMetastase} onRemoveMetastase={handleRemoveMetastase} /></Section>
                                <Section><SectionTitle>Tempos de Diagnóstico</SectionTitle><TemposDiagnosticoSection formData={formData.tempos_diagnostico} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} /></Section>
                            </>
                        )}
                        
                        <FixedSubmitButton>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Salvando...' : 'Salvar Cadastro'}
                            </Button>
                        </FixedSubmitButton>
                    </FormContainer>
                </>
            )}
        </Container>
    );
};

export default CadastroPacientePage;