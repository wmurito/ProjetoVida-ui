import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, ErrorText, SectionContent } from '../../pages/Cadastro/styles';

const ModelosPreditoresSection = ({ formData, errors, handleInputChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="mp_score_tyrer_cuzick">Tyrer-Cuzick</InputLabel>
                    <StyledInput id="mp_score_tyrer_cuzick" type="number" step="0.01" name="score_tyrer_cuzick" value={formData.score_tyrer_cuzick} onChange={handleInputChange} />
                    {errors['modelos_preditores.score_tyrer_cuzick'] && <ErrorText>{errors['modelos_preditores.score_tyrer_cuzick']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="mp_score_canrisk">Score CanRisk</InputLabel>
                    <StyledInput id="mp_score_canrisk" type="number" step="0.01" name="score_canrisk" value={formData.score_canrisk} onChange={handleInputChange} />
                    {errors['modelos_preditores.score_canrisk'] && <ErrorText>{errors['modelos_preditores.score_canrisk']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="mp_score_gail">Score Gail</InputLabel>
                    <StyledInput id="mp_score_gail" type="number" step="0.01" name="score_gail" value={formData.score_gail} onChange={handleInputChange} />
                    {errors['modelos_preditores.score_gail'] && <ErrorText>{errors['modelos_preditores.score_gail']}</ErrorText>}
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default ModelosPreditoresSection;
