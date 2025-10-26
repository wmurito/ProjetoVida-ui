import { useState } from 'react';

const getNestedStateRef = (state, path) => {
    const pathKeys = path.split('.');
    let current = state;
    pathKeys.forEach(key => { if (current) { current = current[key]; } });
    return current;
};

export const useCadastroModals = (setFormData) => {
    const [modalState, setModalState] = useState({
        isFamilyModalOpen: false,
        isPalliativeChemoModalOpen: false,
        isTargetedTherapyModalOpen: false,
        isMetastaseModalOpen: false,
        isCirurgiaModalOpen: false,
        editingData: null,
        editingIndex: null,
    });

    const openModal = (modalName, data = null, index = null) => {
        setModalState({ ...modalState, [`is${modalName}ModalOpen`]: true, editingData: data, editingIndex: index });
    };

    const closeModal = (modalName) => {
        setModalState({ ...modalState, [`is${modalName}ModalOpen`]: false, editingData: null, editingIndex: null });
    };

    const handleSubmitMember = (memberData) => {
        setFormData(prev => {
            const newFamiliares = [...prev.familiares];
            if (modalState.editingIndex !== null) { newFamiliares[modalState.editingIndex] = memberData; } else { newFamiliares.push(memberData); }
            return { ...prev, familiares: newFamiliares };
        });
        closeModal('Family');
    };

    const handleSubmitPalliativeChemo = (chemoData) => { /* ... sua lógica ... */ };
    const handleSubmitTargetedTherapy = (therapyData) => { /* ... sua lógica ... */ };
    const handleSubmitMetastase = (metastaseData) => {
        setFormData(prev => {
            const newMetastases = [...prev.desfecho.metastases];
            if (modalState.editingIndex !== null) { newMetastases[modalState.editingIndex] = metastaseData; } else { newMetastases.push(metastaseData); }
            return { ...prev, desfecho: { ...prev.desfecho, metastases: newMetastases } };
        });
        closeModal('Metastase');
    };

    // --- FUNÇÃO DE SUBMIT DA CIRURGIA ATUALIZADA ---
    const handleSubmitCirurgia = (procedimentoData) => {
        if (!procedimentoData || typeof procedimentoData !== 'object') {
            console.error('Dados de procedimento inválidos');
            return;
        }

        const { tipo_procedimento, ...cirurgiaData } = procedimentoData;
        
        if (!tipo_procedimento || !['mamas', 'axilas', 'reconstrucoes'].includes(tipo_procedimento)) {
            console.error('Tipo de procedimento inválido:', tipo_procedimento);
            return;
        }

        try {
            setFormData(prev => {
                const newState = { ...prev };
                
                // Garantir que a estrutura existe
                if (!newState.tratamento) newState.tratamento = {};
                if (!newState.tratamento.cirurgia) newState.tratamento.cirurgia = {};
                if (!newState.tratamento.cirurgia[tipo_procedimento]) {
                    newState.tratamento.cirurgia[tipo_procedimento] = [];
                }
                
                const cirurgias = [...newState.tratamento.cirurgia[tipo_procedimento]];

                if (modalState.editingIndex !== null && modalState.editingIndex >= 0) {
                    // Modo de Edição
                    cirurgias[modalState.editingIndex] = cirurgiaData;
                } else {
                    // Modo de Adição
                    cirurgias.push(cirurgiaData);
                }
                
                newState.tratamento.cirurgia[tipo_procedimento] = cirurgias;
                return newState;
            });
            closeModal('Cirurgia');
        } catch (error) {
            console.error('Erro ao salvar cirurgia:', error);
        }
    };

    return {
        modalState,
        openModal,
        closeModal,
        handleSubmitMember,
        handleSubmitPalliativeChemo,
        handleSubmitTargetedTherapy,
        handleSubmitMetastase,
        handleSubmitCirurgia,
    };
};