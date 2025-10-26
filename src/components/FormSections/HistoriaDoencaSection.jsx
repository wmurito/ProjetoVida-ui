import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, ErrorText, SectionContent } from '../../pages/Cadastro/styles';

const HistoriaDoencaSection = ({ formData, errors, handleInputChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="hd_idade_diagnostico">Idade ao Diagnóstico</InputLabel>
                    <StyledInput id="hd_idade_diagnostico" type="number" name="idade_diagnostico" value={formData.idade_diagnostico} onChange={handleInputChange} min="0" max="150" />
                    {errors['historia_doenca.idade_diagnostico'] && <ErrorText>{errors['historia_doenca.idade_diagnostico']}</ErrorText>}
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default HistoriaDoencaSection;