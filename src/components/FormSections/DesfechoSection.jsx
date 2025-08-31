import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledCheckbox, CheckboxLabel, ErrorText, SectionContent, AddMoreButton } from '../../pages/Cadastro/styles';
import MetastaseList from '../MetastaseList'; // NOVO IMPORT

const DesfechoSection = ({ 
    formData, 
    errors, 
    handleInputChange, 
    handleCheckboxChange,
    onAddMetastase, // NOVAS PROPS
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
                                <MetastaseList
                                    metastases={formData.metastases}
                                    onEdit={onEditMetastase}
                                    onRemove={onRemoveMetastase}
                                />
                                <AddMoreButton type="button" onClick={onAddMetastase} style={{ marginTop: '15px' }}>
                                    + Adicionar Metástase
                                </AddMoreButton>
                                {errors['desfecho.metastases'] && <ErrorText>{errors['desfecho.metastases']}</ErrorText>}
                            </FieldContainer>
                        )}
                    </FormGrid>
                </FieldContainer>

                {/* --- Recorrência --- */}
                <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}><CheckboxLabel><StyledCheckbox name="recorrencia" checked={!!formData.recorrencia} onChange={handleCheckboxChange} />Recorrência</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}><InputLabel>Data da Recorrência</InputLabel><StyledInput type="date" name="data_recorrencia" value={formData.data_recorrencia} onChange={handleInputChange} disabled={!formData.recorrencia} />{errors['desfecho.data_recorrencia'] && <ErrorText>{errors['desfecho.data_recorrencia']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}><InputLabel>Local da Recorrência</InputLabel><StyledInput name="local_recorrencia" value={formData.local_recorrencia} onChange={handleInputChange} disabled={!formData.recorrencia} />{errors['desfecho.local_recorrencia'] && <ErrorText>{errors['desfecho.local_recorrencia']}</ErrorText>}</FieldContainer>
                
                {/* --- Status Vital --- */}
                <FieldContainer style={{ gridColumn: 'span 6' }}><InputLabel>Status Vital</InputLabel><StyledInput name="status_vital" value={formData.status_vital} onChange={handleInputChange} /></FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default DesfechoSection;