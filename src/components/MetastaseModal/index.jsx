import React, { useState, useEffect } from 'react';
import { ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, CloseButton, Input, InputGroup, Label, SaveButton } from './styles'; // Reutilize os estilos do TargetedTherapyModal

const MetastaseModal = ({ isOpen, onClose, onSubmit, metastaseData }) => {
    const initialState = { data_metastase: '', local_metastase: '' };
    const [currentMetastase, setCurrentMetastase] = useState(initialState);

    useEffect(() => {
        if (metastaseData) {
            setCurrentMetastase({
                data_metastase: metastaseData.data_metastase || '',
                local_metastase: metastaseData.local_metastase || '',
            });
        } else {
            setCurrentMetastase(initialState);
        }
    }, [metastaseData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentMetastase(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!currentMetastase.local_metastase || !currentMetastase.local_metastase.trim()) {
            alert('Por favor, informe o local da metástase.');
            return;
        }
        
        if (!currentMetastase.data_metastase) {
            alert('Por favor, informe a data da metástase.');
            return;
        }
        
        try {
            onSubmit(currentMetastase);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar metástase:', error);
            alert('Erro ao salvar os dados. Por favor, tente novamente.');
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2>{metastaseData ? 'Editar' : 'Adicionar'} Metástase</h2>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <InputGroup>
                        <Label>Local da Metástase</Label>
                        <Input name="local_metastase" value={currentMetastase.local_metastase} onChange={handleChange} />
                    </InputGroup>
                    <InputGroup>
                        <Label>Data da Metástase</Label>
                        <Input type="date" name="data_metastase" value={currentMetastase.data_metastase} onChange={handleChange} />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <SaveButton onClick={handleSubmit}>Salvar</SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default MetastaseModal;