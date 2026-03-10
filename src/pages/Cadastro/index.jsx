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

const SectionBlock = ({ title, children }) => (
    <div className="mb-6 pb-6 border-b border-slate-200 last:border-0 last:mb-2">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-1 border-b-2 border-pink-500 inline-block">{title}</h2>
        {children}
    </div>
);

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

    const currentTabIndex = tabs.findIndex(tab => tab.key === activeTab);
    const isLastTab = currentTabIndex === tabs.length - 1;
    const isFirstTab = currentTabIndex === 0;

    const handleNext = () => {
        if (currentTabIndex < tabs.length - 1) {
            setActiveTab(tabs[currentTabIndex + 1].key);
        }
    };

    const handlePrevious = () => {
        if (currentTabIndex > 0) {
            setActiveTab(tabs[currentTabIndex - 1].key);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLastTab) {
            await handleSave();
        }
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
        <div className="flex flex-col h-full animate-fadeIn max-w-[1400px] mx-auto w-full">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <FamilyMemberModal isOpen={modalState.isFamilyModalOpen} onClose={() => closeModal('Family')} onSubmit={handleSubmitMember} member={modalState.editingData} />
            <MetastaseModal isOpen={modalState.isMetastaseModalOpen} onClose={() => closeModal('Metastase')} onSubmit={handleSubmitMetastase} metastaseData={modalState.editingData} />
            <CirurgiaModal isOpen={modalState.isCirurgiaModalOpen} onClose={() => closeModal('Cirurgia')} onSubmit={handleSubmitCirurgia} initialData={modalState.editingData} />

            <form onSubmit={handleSubmit} noValidate className="bg-white p-4 md:p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex-grow relative flex flex-col">
                {successMessage && (
                    <div className="mb-6 p-4 bg-pink-50 border border-pink-200 text-pink-800 rounded-lg text-center font-medium">
                        {successMessage}
                    </div>
                )}
                {Object.keys(errors).length > 0 && !isLoading && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-left">
                        <span className="font-semibold block mb-1">Por favor, corrija os erros para continuar.</span>
                    </div>
                )}

                <div className="flex flex-wrap border-b-2 border-slate-200 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
                    {tabs.map(tab => {
                        const errorCount = getErrorCountForTab(tab.key);
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 -mb-[2px] 
                                    ${isActive ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-500 hover:text-pink-500 hover:bg-slate-50'}`}
                            >
                                {tab.label}
                                {errorCount > 0 && (
                                    <span className="ml-2 bg-rose-500 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow-sm">
                                        {errorCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('Tem certeza que deseja limpar todos os dados e começar do zero?')) {
                                localStorage.removeItem('cadastro_paciente_draft');
                                window.location.reload();
                            }
                        }}
                        className="ml-auto bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs px-3 py-1.5 rounded-md font-medium transition-colors my-auto"
                    >
                        Limpar Rascunho
                    </button>
                </div>

                {/* RENDERIZAÇÃO DAS ABAS */}
                {activeTab === 'identificacao' && (
                    <SectionBlock title="Identificação e Dados Sociais">
                        <DadosPessoaisSection formData={formData} errors={errors} handleChange={handleChange} setFormData={setFormData} />
                    </SectionBlock>
                )}

                {activeTab === 'historico' && (
                    <>
                        <SectionBlock title="História Patológica Pregressa">
                            <HistoriaPatologicaSection formData={formData.historia_patologica} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_patologica')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'historia_patologica')} />
                        </SectionBlock>
                        <SectionBlock title="História Familiar">
                            <HistoriaFamiliarSection familiares={formData.familiares} historiaFamiliar={formData.historia_familiar} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_familiar')} onAddMember={() => openModal('Family')} onEditMember={(member, index) => openModal('Family', member, index)} onRemoveMember={handleRemoveMember} />
                        </SectionBlock>
                        <SectionBlock title="Hábitos de Vida">
                            <HabitosDeVidaSection formData={formData.habitos_vida} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'habitos_vida')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'habitos_vida')} />
                        </SectionBlock>
                    </>
                )}

                {activeTab === 'dadosClinicos' && (
                    <>
                        <SectionBlock title="História Ginecológica e Obstétrica">
                            <ParidadeSection formData={formData.paridade} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'paridade')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'paridade')} />
                        </SectionBlock>
                        <SectionBlock title="História da Doença Atual">
                            <HistoriaDoencaSection formData={formData.historia_doenca} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'historia_doenca')} />
                        </SectionBlock>
                        <SectionBlock title="Modelos Preditores de Risco">
                            <ModelosPreditoresSection formData={formData.modelos_preditores} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'modelos_preditores')} />
                        </SectionBlock>
                    </>
                )}

                {activeTab === 'tratamento' && (
                    <SectionBlock title="Tratamento">
                        <TratamentoSection formData={formData} setFormData={setFormData} errors={errors} onOpenModal={openModal} onRemoveCirurgia={handleRemoveCirurgia} />
                    </SectionBlock>
                )}

                {activeTab === 'evolucao' && (
                    <>
                        <SectionBlock title="Desfecho">
                            <DesfechoSection formData={formData.desfecho} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'desfecho')} handleCheckboxChange={(e) => handleNestedCheckbox(e, 'desfecho')} onAddMetastase={() => openModal('Metastase')} onEditMetastase={(meta, index) => openModal('Metastase', meta, index)} onRemoveMetastase={handleRemoveMetastase} />
                        </SectionBlock>
                        <SectionBlock title="Data Diagnóstico">
                            <TemposDiagnosticoSection formData={formData.tempos_diagnostico} errors={errors} handleInputChange={(e) => handleNestedChange(e, 'tempos_diagnostico')} />
                        </SectionBlock>
                    </>
                )}

                {/* BOTÕES DE NAVEGAÇÃO FIXOS */}
                <div className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 mt-8 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-100 flex justify-between items-center rounded-b-xl z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                    <div>
                        {!isFirstTab && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors focus:ring-2 focus:ring-slate-300 focus:outline-none"
                            >
                                ← Anterior
                            </button>
                        )}
                    </div>

                    <div>
                        {!isLastTab ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 focus:outline-none"
                            >
                                Próximo →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:outline-none disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Cadastro'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CadastroPacientePage;
