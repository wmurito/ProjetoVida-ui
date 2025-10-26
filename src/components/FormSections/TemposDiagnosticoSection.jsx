import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, SectionContent } from '../../pages/Cadastro/styles';

const TemposDiagnosticoSection = ({ formData, handleInputChange }) => {
    if (!formData || !handleInputChange) {
        console.error('TemposDiagnosticoSection: Props obrigatórias ausentes');
        return null;
    }
    
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel>Data da Primeira Consulta</InputLabel>
                    <StyledInput type="date" name="data_primeira_consulta" value={formData?.data_primeira_consulta || ''} onChange={handleInputChange} />
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel>Data do Diagnóstico</InputLabel>
                    <StyledInput type="date" name="data_diagnostico" value={formData?.data_diagnostico || ''} onChange={handleInputChange} />
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel>Data da Cirurgia</InputLabel>
                    <StyledInput type="date" name="data_cirurgia" value={formData?.data_cirurgia || ''} onChange={handleInputChange} />
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel>Data do Início do Tratamento</InputLabel>
                    <StyledInput type="date" name="data_inicio_tratamento" value={formData?.data_inicio_tratamento || ''} onChange={handleInputChange} />
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default TemposDiagnosticoSection;