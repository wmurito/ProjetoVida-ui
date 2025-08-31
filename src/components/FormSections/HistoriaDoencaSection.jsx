import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, ErrorText, SectionContent } from '../../pages/Cadastro/styles';

const HistoriaDoencaSection = ({ formData, errors, handleInputChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="hd_idade_diagnostico">Idade ao Diagnóstico</InputLabel>
                    <StyledInput id="hd_idade_diagnostico" type="number" name="idade_diagnostico" value={formData.idade_diagnostico} onChange={handleInputChange} />
                    {errors['historia_doenca.idade_diagnostico'] && <ErrorText>{errors['historia_doenca.idade_diagnostico']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 4' }} />
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="hd_score_tyrer_cuzick">Score Tyrer-Cuzick</InputLabel>
                    <StyledInput id="hd_score_tyrer_cuzick" type="number" step="0.01" name="score_tyrer_cuzick" value={formData.score_tyrer_cuzick} onChange={handleInputChange} />
                    {errors['historia_doenca.score_tyrer_cuzick'] && <ErrorText>{errors['historia_doenca.score_tyrer_cuzick']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="hd_score_canrisk">Score CanRisk</InputLabel>
                    <StyledInput id="hd_score_canrisk" type="number" step="0.01" name="score_canrisk" value={formData.score_canrisk} onChange={handleInputChange} />
                    {errors['historia_doenca.score_canrisk'] && <ErrorText>{errors['historia_doenca.score_canrisk']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="hd_score_gail">Score Gail</InputLabel>
                    <StyledInput id="hd_score_gail" type="number" step="0.01" name="score_gail" value={formData.score_gail} onChange={handleInputChange} />
                    {errors['historia_doenca.score_gail'] && <ErrorText>{errors['historia_doenca.score_gail']}</ErrorText>}
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default HistoriaDoencaSection;