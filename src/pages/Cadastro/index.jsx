import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks e Serviços
import { useCadastroForm } from './useCadastroForm';
import { useCadastroModals } from './useCadastroModals';
import { submitCadastro } from './cadastroService';
import { errorFieldToTabMap, tabs } from './formConfig';

// Componentes Reutilizáveis e de Seção
import FamilyMemberModal from '../../components/FamilyMemberModal';
import MetastaseModal from '../../components/MetastaseModal';
import TermoAceiteModal from '../../components/TermoAceiteModal';
import CirurgiaModal from '../../components/CirurgiaModal';
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

// Estilos da Página
import {
    Container, FormContainer, Section, SectionTitle, Button,
    FixedSubmitButton, SuccessMessage, ApiErrorContainer, ErrorText, TabNav, TabButton, SectionContent
} from './styles';

const CadastroPacientePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [apiErrors, setApiErrors] = useState([]);
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const { formData, setFormData, errors, setErrors, handleChange, handleNestedChange, handleNestedCheckbox, resetForm } = useCadastroForm();
    
    const {
        modalState,
        openModal,
        closeModal,
        handleSubmitMember,
        handleSubmitMetastase,
        handleSubmitCirurgia,
    } = useCadastroModals(setFormData);
    
    // Lógica do Termo de Aceite (sem alterações)
    const [termoAceito, setTermoAceito] = useState(false);
    const [arquivoTermo, setArquivoTermo] = useState(null);
    const [erroTermo, setErroTermo] = useState('');
    const [acessoLiberado, setAcessoLiberado] = useState(false);
    const handleConfirmarAceite = () => {
        if (!termoAceito || !arquivoTermo) { setErroTermo('É necessário aceitar os termos e anexar o arquivo.'); return; }
        setErroTermo(''); setAcessoLiberado(true);
    };
    const handleCancelarAceite = () => navigate(-1);

    // Submissão Principal (sem alterações)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... sua lógica de submit aqui ...
    };
    
    // --- Handlers de Remoção ---
    const handleRemoveMember = (indexToRemove) => {
        if (window.confirm('Tem certeza?')) {
            setFormData(prev => ({ ...prev, familiares: prev.familiares.filter((_, index) => index !== indexToRemove) }));
        }
    };
    
    const handleRemoveMetastase = (indexToRemove) => {
        if (window.confirm('Tem certeza?')) {
            setFormData(prev => ({ ...prev, desfecho: { ...prev.desfecho, metastases: prev.desfecho.metastases.filter((_, index) => index !== indexToRemove) } }));
        }
    };
    
    // --- FUNÇÃO DE REMOVER CIRURGIA CORRIGIDA ---
    const handleRemoveCirurgia = (type, indexToRemove) => {
        if (window.confirm('Tem certeza que deseja remover este procedimento?')) {
            setFormData(prev => {
                const newState = JSON.parse(JSON.stringify(prev));
                const cirurgias = newState.tratamento.cirurgia[type];
                if (cirurgias && cirurgias.length > indexToRemove) {
                    cirurgias.splice(indexToRemove, 1);
                }
                return newState;
            });
        }
    };
    
    return (
        <Container>
            <TermoAceiteModal isOpen={!acessoLiberado} onConfirm={handleConfirmarAceite} onCancel={handleCancelarAceite} termoAceito={termoAceito} setTermoAceito={setTermoAceito} arquivoTermo={arquivoTermo} setArquivoTermo={setArquivoTermo} erroTermo={erroTermo} />

            {acessoLiberado && (
                <>
                    {/* --- RENDERIZAÇÃO DOS MODAIS --- */}
                    <FamilyMemberModal isOpen={modalState.isFamilyModalOpen} onClose={() => closeModal('Family')} onSubmit={handleSubmitMember} member={modalState.editingData} />
                    <MetastaseModal isOpen={modalState.isMetastaseModalOpen} onClose={() => closeModal('Metastase')} onSubmit={handleSubmitMetastase} metastaseData={modalState.editingData} />
                    <CirurgiaModal
                        isOpen={modalState.isCirurgiaModalOpen}
                        onClose={() => closeModal('Cirurgia')}
                        onSubmit={handleSubmitCirurgia}
                        initialData={modalState.editingData}
                    />

                    <FormContainer onSubmit={handleSubmit} noValidate>
                        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                        {apiErrors.length > 0 && (<ApiErrorContainer>{apiErrors.map((error, index) => <ErrorText key={index}>{error}</ErrorText>)}</ApiErrorContainer>)}

                        <TabNav>
                            {tabs.map(tab => (<TabButton key={tab.key} type="button" $isActive={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>))}
                        </TabNav>

                        {/* --- RENDERIZAÇÃO DAS ABAS --- */}
                        {activeTab === 'identificacao' && (<Section><SectionTitle>Identificação e Dados Sociais</SectionTitle><DadosPessoaisSection formData={formData} errors={errors} handleChange={handleChange} /></Section>)}
                        
                        {activeTab === 'historico' && (<><Section><SectionTitle>História Patológica Pregressa</SectionTitle><HistoriaPatologicaSection formData={formData.historia_patologica} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_patologica')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'historia_patologica')} /></Section><Section><SectionTitle>História Familiar</SectionTitle><HistoriaFamiliarSection familiares={formData.familiares} historiaFamiliar={formData.historia_familiar} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_familiar')} onAddMember={() => openModal('Family')} onEditMember={(member, index) => openModal('Family', member, index)} onRemoveMember={handleRemoveMember} /></Section><Section><SectionTitle>Hábitos de Vida</SectionTitle><HabitosDeVidaSection formData={formData.habitos_vida} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'habitos_vida')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'habitos_vida')} /></Section></>)}
                        
                        {activeTab === 'dadosClinicos' && (<><Section><SectionTitle>Paridade</SectionTitle><ParidadeSection formData={formData.paridade} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'paridade')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'paridade')} /></Section><Section><SectionTitle>História da Doença Atual</SectionTitle><HistoriaDoencaSection formData={formData.historia_doenca} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_doenca')} /></Section><Section><SectionTitle>Histologia</SectionTitle><HistologiaSection formData={formData.histologia} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'histologia')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'histologia')} /></Section></>)}
                        
                        {activeTab === 'tratamentoEvolucao' && (
                            <>
                                <Section>
                                    <SectionTitle>Tratamento</SectionTitle>
                                    <TratamentoSection
                                        formData={formData}
                                        setFormData={setFormData}
                                        errors={errors}
                                        onOpenModal={openModal}
                                        onRemoveCirurgia={handleRemoveCirurgia} // Corrigido
                                    />
                                </Section>
                                <Section>
                                    <SectionTitle>Desfecho</SectionTitle>
                                    <DesfechoSection
                                        formData={formData.desfecho}
                                        errors={errors}
                                        handleInputChange={(e) => handleNestedChange(e, 'desfecho')}
                                        handleCheckboxChange={(e) => handleNestedCheckbox(e, 'desfecho')}
                                        onAddMetastase={() => openModal('Metastase')}
                                        onEditMetastase={(meta, index) => openModal('Metastase', meta, index)}
                                        onRemoveMetastase={handleRemoveMetastase}
                                    />
                                </Section>
                                <Section>
                                    <SectionTitle>Tempos de Diagnóstico</SectionTitle>
                                    <TemposDiagnosticoSection
                                        formData={formData.tempos_diagnostico}
                                        errors={errors}
                                        handleInputChange={(e) => handleNestedChange(e, 'tempos_diagnostico')}
                                    />
                                </Section>
                            </>
                        )}
                        
                        <FixedSubmitButton>
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Cadastro'}</Button>
                        </FixedSubmitButton>
                    </FormContainer>
                </>
            )}
        </Container>
    );
};

export default CadastroPacientePage;