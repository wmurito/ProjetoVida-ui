import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledCheckbox, CheckboxLabel, ErrorText, SectionContent, AddMoreButton } from '../../pages/Cadastro/styles';
import MetastaseList from '../MetastaseList';

const DesfechoSection = ({ 
    formData, 
    errors, 
    handleInputChange, 
    handleCheckboxChange,
    onAddMetastase,
    onEditMetastase,
    onRemoveMetastase
}) => {
    return (
        <SectionContent>
            <FormGrid>
                {/* --- Morte --- */}
                <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}><CheckboxLabel><StyledCheckbox name="morte" checked={!!formData.morte} onChange={handleCheckboxChange} />Morte</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Data da Morte</InputLabel><StyledInput type="date" name="data_morte" value={formData.data_morte} onChange={handleInputChange} disabled={!formData.morte} />{errors['desfecho.data_morte'] && <ErrorText>{errors['desfecho.data_morte']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Causa da Morte</InputLabel><StyledInput name="causa_morte" value={formData.causa_morte} onChange={handleInputChange} disabled={!formData.morte} />{errors['desfecho.causa_morte'] && <ErrorText>{errors['desfecho.causa_morte']}</ErrorText>}</FieldContainer>

                {/* --- Metástase (Seção Dinâmica) --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 6' }}>
                            <CheckboxLabel>
                                <StyledCheckbox name="metastase_ocorreu" checked={!!formData.metastase_ocorreu} onChange={handleCheckboxChange} />
                                Ocorreu Metástase
                            </CheckboxLabel>
                        </FieldContainer>
                        
                        {formData.metastase_ocorreu && (
                            <FieldContainer style={{ gridColumn: 'span 6', marginTop: '10px' }}>
                                <InputLabel style={{ fontSize: '1.1rem', fontWeight: 600, color: '#343a40' }}>Registros de Metástase</InputLabel>
                                <MetastaseList metastases={formData.metastases} onEdit={onEditMetastase} onRemove={onRemoveMetastase} />
                                <AddMoreButton type="button" onClick={onAddMetastase} style={{ marginTop: '15px' }}>
                                    + Adicionar Metástase
                                </AddMoreButton>
                                {errors['desfecho.metastases'] && <ErrorText>{errors['desfecho.metastases']}</ErrorText>}
                            </FieldContainer>
                        )}
                    </FormGrid>
                </FieldContainer>

                {/* --- Recidiva Local --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                           <CheckboxLabel>
                               <StyledCheckbox name="recidiva_local" checked={!!formData.recidiva_local} onChange={handleCheckboxChange} />
                               Recidiva Local
                           </CheckboxLabel>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Data Recidiva Local</InputLabel>
                            <StyledInput type="date" name="data_recidiva_local" value={formData.data_recidiva_local} onChange={handleInputChange} disabled={!formData.recidiva_local} />
                            {errors['desfecho.data_recidiva_local'] && <ErrorText>{errors['desfecho.data_recidiva_local']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Cirurgia Realizada</InputLabel>
                            <StyledInput name="cirurgia_recidiva_local" value={formData.cirurgia_recidiva_local} onChange={handleInputChange} disabled={!formData.recidiva_local} />
                            {errors['desfecho.cirurgia_recidiva_local'] && <ErrorText>{errors['desfecho.cirurgia_recidiva_local']}</ErrorText>}
                        </FieldContainer>
                    </FormGrid>
                </FieldContainer>
                
                {/* --- Recidiva Regional --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                           <CheckboxLabel>
                               <StyledCheckbox name="recidiva_regional" checked={!!formData.recidiva_regional} onChange={handleCheckboxChange} />
                               Recidiva Regional
                           </CheckboxLabel>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Data Recidiva Regional</InputLabel>
                            <StyledInput type="date" name="data_recidiva_regional" value={formData.data_recidiva_regional} onChange={handleInputChange} disabled={!formData.recidiva_regional} />
                            {errors['desfecho.data_recidiva_regional'] && <ErrorText>{errors['desfecho.data_recidiva_regional']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Cirurgia Realizada</InputLabel>
                            <StyledInput name="cirurgia_recidiva_regional" value={formData.cirurgia_recidiva_regional} onChange={handleInputChange} disabled={!formData.recidiva_regional} />
                             {errors['desfecho.cirurgia_recidiva_regional'] && <ErrorText>{errors['desfecho.cirurgia_recidiva_regional']}</ErrorText>}
                        </FieldContainer>
                    </FormGrid>
                </FieldContainer>
                
                {/* --- Status Vital --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}>
                    <InputLabel>Status Vital</InputLabel>
                    <StyledInput name="status_vital" value={formData.status_vital} onChange={handleInputChange} />
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default DesfechoSection;