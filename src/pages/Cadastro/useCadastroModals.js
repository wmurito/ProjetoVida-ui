import { useState } from 'react';

export const useCadastroModals = (setFormData) => {
    const [modalState, setModalState] = useState({
        isFamilyModalOpen: false,
        isPalliativeChemoModalOpen: false,
        isTargetedTherapyModalOpen: false,
        isMetastaseModalOpen: false,
        editingData: null,
        editingIndex: null,
    });

    const openModal = (modalName, data = null, index = null) => {
        setModalState({ ...modalState, [`is${modalName}ModalOpen`]: true, editingData: data, editingIndex: index });
    };

    const closeModal = (modalName) => {
        setModalState({ ...modalState, [`is${modalName}ModalOpen`]: false, editingData: null, editingIndex: null });
    };

    // --- Handlers de Submissão dos Modais ---
    const handleSubmitMember = (memberData) => {
        setFormData(prev => {
            const newFamiliares = [...prev.familiares];
            if (modalState.editingIndex !== null) { newFamiliares[modalState.editingIndex] = memberData; } else { newFamiliares.push(memberData); }
            return { ...prev, familiares: newFamiliares };
        });
        closeModal('Family');
    };

    const handleSubmitPalliativeChemo = (chemoData) => {
        setFormData(prev => {
            const newChemos = [...prev.tratamento.quimioterapias_paliativas];
            if (modalState.editingIndex !== null) { newChemos[modalState.editingIndex] = chemoData; } else { newChemos.push(chemoData); }
            return { ...prev, tratamento: { ...prev.tratamento, quimioterapias_paliativas: newChemos } };
        });
        closeModal('PalliativeChemo');
    };
    
    const handleSubmitTargetedTherapy = (therapyData) => {
        setFormData(prev => {
            const newTherapies = [...prev.tratamento.terapias_alvo];
            if (modalState.editingIndex !== null) { newTherapies[modalState.editingIndex] = therapyData; } else { newTherapies.push(therapyData); }
            return { ...prev, tratamento: { ...prev.tratamento, terapias_alvo: newTherapies } };
        });
        closeModal('TargetedTherapy');
    };

    const handleSubmitMetastase = (metastaseData) => {
        setFormData(prev => {
            const newMetastases = [...prev.desfecho.metastases];
            if (modalState.editingIndex !== null) { newMetastases[modalState.editingIndex] = metastaseData; } else { newMetastases.push(metastaseData); }
            return { ...prev, desfecho: { ...prev.desfecho, metastases: newMetastases } };
        });
        closeModal('Metastase');
    };


    return {
        modalState,
        openModal,
        closeModal,
        handleSubmitMember,
        handleSubmitPalliativeChemo,
        handleSubmitTargetedTherapy,
        handleSubmitMetastase
    };
};