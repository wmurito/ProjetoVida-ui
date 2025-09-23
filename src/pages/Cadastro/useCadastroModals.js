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
        const { tipo_procedimento, ...cirurgiaData } = procedimentoData;
        
        // Remove a propriedade `tipo_procedimento` do objeto a ser salvo, pois ela já foi usada.
        delete cirurgiaData.tipo_procedimento;

        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            // O `tipo_procedimento` (mamas, axilas, reconstrucoes) define em qual array salvar.
            const cirurgias = getNestedStateRef(newState, `tratamento.cirurgia.${tipo_procedimento}`);

            if (Array.isArray(cirurgias)) {
                 if (modalState.editingIndex !== null) {
                    // Modo de Edição
                    cirurgias[modalState.editingIndex] = cirurgiaData;
                } else {
                    // Modo de Adição
                    cirurgias.push(cirurgiaData);
                }
            }
            return newState;
        });
        closeModal('Cirurgia');
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