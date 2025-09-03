import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledCheckbox, CheckboxLabel, ErrorText, SectionContent } from '../../pages/Cadastro/styles';

const HabitosDeVidaSection = ({ formData, errors, handleInputChange, handleCheckboxChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 3' }}>
                    <InputLabel htmlFor="hv_tabagismo_carga">Tabagismo Carga (maços/ano)</InputLabel>
                    <StyledInput id="hv_tabagismo_carga" type="number" name="tabagismo_carga" value={formData.tabagismo_carga} onChange={handleInputChange} />
                    {errors['habitos_vida.tabagismo_carga'] && <ErrorText>{errors['habitos_vida.tabagismo_carga']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}>
                    <InputLabel htmlFor="hv_tabagismo_tempo_anos">Tabagismo Tempo (anos)</InputLabel>
                    <StyledInput id="hv_tabagismo_tempo_anos" type="number" name="tabagismo_tempo_anos" value={formData.tabagismo_tempo_anos} onChange={handleInputChange} />
                    {errors['habitos_vida.tabagismo_tempo_anos'] && <ErrorText>{errors['habitos_vida.tabagismo_tempo_anos']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}>
                    <InputLabel htmlFor="hv_etilismo_dose_diaria">Etilismo Dose Diária</InputLabel>
                    <StyledInput id="hv_etilismo_dose_diaria" name="etilismo_dose_diaria" value={formData.etilismo_dose_diaria} onChange={handleInputChange} />
                    {errors['habitos_vida.etilismo_dose_diaria'] && <ErrorText>{errors['habitos_vida.etilismo_dose_diaria']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}>
                    <InputLabel htmlFor="hv_etilismo_tempo_anos">Etilismo Tempo (anos)</InputLabel>
                    <StyledInput id="hv_etilismo_tempo_anos" type="number" name="etilismo_tempo_anos" value={formData.etilismo_tempo_anos} onChange={handleInputChange} />
                    {errors['habitos_vida.etilismo_tempo_anos'] && <ErrorText>{errors['habitos_vida.etilismo_tempo_anos']}</ErrorText>}
                </FieldContainer>
                
                <FieldContainer style={{ gridColumn: 'span 2', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <CheckboxLabel>
                        <StyledCheckbox 
                            name="atividade_fisica" 
                            checked={!!formData.atividade_fisica} 
                            onChange={handleCheckboxChange} 
                        />
                        Pratica Atividade Física
                    </CheckboxLabel>
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="hv_modalidade_atividade">Modalidade da Atividade</InputLabel>
                    <StyledInput 
                        id="hv_modalidade_atividade" 
                        name="modalidade_atividade" 
                        value={formData.modalidade_atividade} 
                        onChange={handleInputChange}
                        disabled={!formData.atividade_fisica}
                    />
                    {errors['habitos_vida.modalidade_atividade'] && <ErrorText>{errors['habitos_vida.modalidade_atividade']}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="hv_tempo_atividade">Tempo semanal (minutos)</InputLabel>
                    <StyledInput 
                        id="hv_tempo_atividade"
                        type="number" 
                        name="tempo_atividade_semanal_min" 
                        value={formData.tempo_atividade_semanal_min} 
                        onChange={handleInputChange}
                        disabled={!formData.atividade_fisica}
                    />
                    {errors['habitos_vida.tempo_atividade_semanal_min'] && <ErrorText>{errors['habitos_vida.tempo_atividade_semanal_min']}</ErrorText>}
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default HabitosDeVidaSection;