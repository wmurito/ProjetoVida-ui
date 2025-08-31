import React, { useState, useEffect } from 'react';
// Você precisará criar estilos para o Modal, como ModalOverlay, ModalContent, etc.
// Use os estilos dos seus outros modais como base.
import { ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, CloseButton, Input, InputGroup, Label, SaveButton } from './styles';

const TargetedTherapyModal = ({ isOpen, onClose, onSubmit, therapyData }) => {
    const initialState = {
        qual_terapia_alvo: '',
        inicio_terapia_alvo: '',
        fim_terapia_alvo: '',
    };

    const [currentTherapy, setCurrentTherapy] = useState(initialState);

    useEffect(() => {
        // Se 'therapyData' for fornecido (modo de edição), preenche o formulário.
        // Se não (modo de adição), reseta para o estado inicial.
        if (therapyData) {
            setCurrentTherapy({
                qual_terapia_alvo: therapyData.qual_terapia_alvo || '',
                inicio_terapia_alvo: therapyData.inicio_terapia_alvo || '',
                fim_terapia_alvo: therapyData.fim_terapia_alvo || '',
            });
        } else {
            setCurrentTherapy(initialState);
        }
    }, [therapyData, isOpen]); // Roda o efeito quando os dados ou a visibilidade do modal mudam

    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTherapy(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(currentTherapy);
        onClose(); // Fecha o modal após submeter
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2>{therapyData ? 'Editar' : 'Adicionar'} Terapia Alvo</h2>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <InputGroup>
                        <Label>Qual Terapia Alvo?</Label>
                        <Input
                            name="qual_terapia_alvo"
                            value={currentTherapy.qual_terapia_alvo}
                            onChange={handleChange}
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Data de Início</Label>
                        <Input
                            type="date"
                            name="inicio_terapia_alvo"
                            value={currentTherapy.inicio_terapia_alvo}
                            onChange={handleChange}
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Data de Término (opcional)</Label>
                        <Input
                            type="date"
                            name="fim_terapia_alvo"
                            value={currentTherapy.fim_terapia_alvo}
                            onChange={handleChange}
                        />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <SaveButton onClick={handleSubmit}>Salvar</SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TargetedTherapyModal;