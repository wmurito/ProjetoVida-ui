import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hooks e Serviços
import { useCadastroForm } from './useCadastroForm';
import { useCadastroModals } from './useCadastroModals';
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
import ModelosPreditoresSection from '../../components/FormSections/ModelosPreditoresSection';
import TratamentoSection from '../../components/FormSections/TratamentoSection';
import DesfechoSection from '../../components/FormSections/DesfechoSection';
import TemposDiagnosticoSection from '../../components/FormSections/TemposDiagnosticoSection';

// Estilos da Página
import {
    Container, FormContainer, Section, SectionTitle, Button,
    FixedSubmitButton, SuccessMessage, ApiErrorContainer, ErrorText, TabNav, TabButton
} from './styles';

const CadastroPacientePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const { 
        formData, setFormData, errors, isLoading, successMessage,
        handleChange, handleNestedChange, handleNestedCheckbox, handleSave 
    } = useCadastroForm(setActiveTab, navigate);
    
    const {
        modalState, openModal, closeModal,
        handleSubmitMember, handleSubmitMetastase, handleSubmitCirurgia,
    } = useCadastroModals(setFormData);
    
    const [termoAceito, setTermoAceito] = useState(false);
    const [arquivoTermo, setArquivoTermo] = useState(null);
    const [erroTermo, setErroTermo] = useState('');
    const [acessoLiberado, setAcessoLiberado] = useState(false);
    
    const handleConfirmarAceite = () => {
        if (!termoAceito || !arquivoTermo) { 
            setErroTermo('É necessário aceitar os termos e anexar o arquivo.'); 
            return; 
        }
        setErroTermo(''); 
        setAcessoLiberado(true);
    };
    
    const handleCancelarAceite = () => navigate(-1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSave(arquivoTermo);
    };
    
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

    const getErrorCountForTab = (tabKey) => {
        return Object.keys(errors).filter(key => errorFieldToTabMap[key] === tabKey).length;
    };
    
    return (
        <Container>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <TermoAceiteModal isOpen={!acessoLiberado} onConfirm={handleConfirmarAceite} onCancel={handleCancelarAceite} termoAceito={termoAceito} setTermoAceito={setTermoAceito} arquivoTermo={arquivoTermo} setArquivoTermo={setArquivoTermo} erroTermo={erroTermo} />

            {acessoLiberado && (
                <>
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
                        {Object.keys(errors).length > 0 && !isLoading && (
                            <ApiErrorContainer>
                                <ErrorText>Por favor, corrija os erros para continuar.</ErrorText>
                            </ApiErrorContainer>
                        )}

                        <TabNav>
                            {tabs.map(tab => (
                                <TabButton key={tab.key} type="button" $isActive={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                                    {tab.label}
                                    {getErrorCountForTab(tab.key) > 0 && (
                                        <span style={{ marginLeft: '8px', backgroundColor: '#ff7bac', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.75em' }}>
                                            {getErrorCountForTab(tab.key)}
                                        </span>
                                    )}
                                </TabButton>
                            ))}
                        </TabNav>

                        {/* RENDERIZAÇÃO DAS ABAS (Sua lógica original preservada) */}
                        {activeTab === 'identificacao' && (<Section><SectionTitle>Identificação e Dados Sociais</SectionTitle><DadosPessoaisSection formData={formData} errors={errors} handleChange={handleChange} /></Section>)}
                        
                        {activeTab === 'historico' && (<><Section><SectionTitle>História Patológica Pregressa</SectionTitle><HistoriaPatologicaSection formData={formData.historia_patologica} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_patologica')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'historia_patologica')} /></Section><Section><SectionTitle>História Familiar</SectionTitle><HistoriaFamiliarSection familiares={formData.familiares} historiaFamiliar={formData.historia_familiar} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_familiar')} onAddMember={() => openModal('Family')} onEditMember={(member, index) => openModal('Family', member, index)} onRemoveMember={handleRemoveMember} /></Section><Section><SectionTitle>Hábitos de Vida</SectionTitle><HabitosDeVidaSection formData={formData.habitos_vida} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'habitos_vida')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'habitos_vida')} /></Section></>)}
                        
                        {activeTab === 'dadosClinicos' && (<><Section><SectionTitle>História Ginecológica e Obstétrica</SectionTitle><ParidadeSection formData={formData.paridade} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'paridade')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'paridade')} /></Section><Section><SectionTitle>História da Doença Atual</SectionTitle><HistoriaDoencaSection formData={formData.historia_doenca} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_doenca')} /></Section><Section><SectionTitle>Modelos Preditores de Risco</SectionTitle><ModelosPreditoresSection formData={formData.modelos_preditores} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'modelos_preditores')} /></Section></>)}
                        
                        {activeTab === 'tratamento' && (
                            <Section>
                                <SectionTitle>Tratamento</SectionTitle>
                                <TratamentoSection formData={formData} setFormData={setFormData} errors={errors} onOpenModal={openModal} onRemoveCirurgia={handleRemoveCirurgia} />
                            </Section>
                        )}
                        
                        {activeTab === 'evolucao' && (
                            <>
                                <Section>
                                    <SectionTitle>Desfecho</SectionTitle>
                                    <DesfechoSection formData={formData.desfecho} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'desfecho')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'desfecho')} onAddMetastase={() => openModal('Metastase')} onEditMetastase={(meta, index) => openModal('Metastase', meta, index)} onRemoveMetastase={handleRemoveMetastase} />
                                </Section>
                                <Section>
                                    <SectionTitle>Data Diagnóstico</SectionTitle>
                                    <TemposDiagnosticoSection formData={formData.tempos_diagnostico} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />
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