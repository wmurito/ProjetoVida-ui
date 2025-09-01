import React, { useState, useEffect } from 'react';
import { ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, CloseButton, Input, InputGroup, Label, SaveButton, CancelButton } from './styles';

const PalliativeChemoModal = ({ isOpen, onClose, onSubmit, chemoData }) => {
    const initialState = {
        linha_tratamento_paliativo: '',
        qual_quimioterapia_paliativa: '',
        inicio_quimioterapia_paliativa: '',
        fim_quimioterapia_paliativa: ''
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (chemoData) {
            setFormData(chemoData);
        } else {
            setFormData(initialState);
        }
    }, [chemoData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData); // Envia os dados para a página principal
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2>{chemoData ? 'Editar' : 'Adicionar'} Quimio Paliativa</h2>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <InputGroup>
                        <Label>Linha de Tratamento</Label>
                        <Input 
                            name="linha_tratamento_paliativo" 
                            value={formData.linha_tratamento_paliativo} 
                            onChange={handleChange} 
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Qual Quimioterapia (Esquema)</Label>
                        <Input 
                            name="qual_quimioterapia_paliativa" 
                            value={formData.qual_quimioterapia_paliativa} 
                            onChange={handleChange} 
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Data de Início</Label>
                        <Input 
                            type="date" 
                            name="inicio_quimioterapia_paliativa" 
                            value={formData.inicio_quimioterapia_paliativa} 
                            onChange={handleChange} 
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Data de Fim (opcional)</Label>
                        <Input 
                            type="date" 
                            name="fim_quimioterapia_paliativa" 
                            value={formData.fim_quimioterapia_paliativa} 
                            onChange={handleChange} 
                        />
                    </InputGroup>
                </ModalBody>
                <ModalFooter>
                    <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                    <SaveButton type="button" onClick={handleSubmit}>Salvar</SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default PalliativeChemoModal;