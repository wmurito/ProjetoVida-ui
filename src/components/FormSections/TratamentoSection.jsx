import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledCheckbox, CheckboxLabel, ErrorText, SectionContent, AddMoreButton } from '../../pages/Cadastro/styles';
import PalliativeChemoList from '../PalliativeChemoList';
import TargetedTherapyList from '../TargetedTherapyList';

const TratamentoSection = ({
    formData,
    errors,
    handleInputChange,
    handleCheckboxChange,
    onAddPalliativeChemo,
    onEditPalliativeChemo,
    onRemovePalliativeChemo,
    onAddTargetedTherapy,
    onEditTargetedTherapy,
    onRemoveTargetedTherapy
}) => {
    return (
        <SectionContent>
            <FormGrid>
                {/* --- Neoadjuvante --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '15px' }}>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                            <CheckboxLabel>
                                <StyledCheckbox name="tratamento_neoadjuvante" checked={!!formData.tratamento_neoadjuvante} onChange={handleCheckboxChange} />
                                Trat. Neoadjuvante
                            </CheckboxLabel>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Início Neoadjuvante</InputLabel>
                            <StyledInput type="date" name="inicio_neoadjuvante" value={formData.inicio_neoadjuvante} onChange={handleInputChange} disabled={!formData.tratamento_neoadjuvante} />
                            {errors['tratamento.inicio_neoadjuvante'] && <ErrorText>{errors['tratamento.inicio_neoadjuvante']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Término Neoadjuvante</InputLabel>
                            <StyledInput type="date" name="termino_neoadjuvante" value={formData.termino_neoadjuvante} onChange={handleInputChange} disabled={!formData.tratamento_neoadjuvante} />
                            {errors['tratamento.termino_neoadjuvante'] && <ErrorText>{errors['tratamento.termino_neoadjuvante']}</ErrorText>}
                        </FieldContainer>

                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Qual Neoadjuvante</InputLabel>
                            <StyledInput name="qual_neoadjuvante" value={formData.qual_neoadjuvante} onChange={handleInputChange} disabled={!formData.tratamento_neoadjuvante} />
                            {errors['tratamento.qual_neoadjuvante'] && <ErrorText>{errors['tratamento.qual_neoadjuvante']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Estágio Clínico Pré-QXT</InputLabel>
                            <StyledInput name="estagio_clinico_pre_qxt" value={formData.estagio_clinico_pre_qxt} onChange={handleInputChange} disabled={!formData.tratamento_neoadjuvante} />
                            {errors['tratamento.estagio_clinico_pre_qxt'] && <ErrorText>{errors['tratamento.estagio_clinico_pre_qxt']}</ErrorText>}
                        </FieldContainer>

                        <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}>
                            <FormGrid>
                                <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                                    <CheckboxLabel>
                                        <StyledCheckbox name="quimioterapia_neoadjuvante_realizada" checked={!!formData.quimioterapia_neoadjuvante_realizada} onChange={handleCheckboxChange} disabled={!formData.tratamento_neoadjuvante} />
                                        Realizou Quimio
                                    </CheckboxLabel>
                                </FieldContainer>
                                <FieldContainer style={{ gridColumn: 'span 2' }}>
                                    <InputLabel>Início Quimio Neo</InputLabel>
                                    <StyledInput type="date" name="inicio_quimioterapia_neoadjuvante" value={formData.inicio_quimioterapia_neoadjuvante} onChange={handleInputChange} disabled={!formData.quimioterapia_neoadjuvante_realizada} />
                                    {errors['tratamento.inicio_quimioterapia_neoadjuvante'] && <ErrorText>{errors['tratamento.inicio_quimioterapia_neoadjuvante']}</ErrorText>}
                                </FieldContainer>
                                <FieldContainer style={{ gridColumn: 'span 2' }}>
                                    <InputLabel>Fim Quimio Neo</InputLabel>
                                    <StyledInput type="date" name="fim_quimioterapia_neoadjuvante" value={formData.fim_quimioterapia_neoadjuvante} onChange={handleInputChange} disabled={!formData.quimioterapia_neoadjuvante_realizada} />
                                    {errors['tratamento.fim_quimioterapia_neoadjuvante'] && <ErrorText>{errors['tratamento.fim_quimioterapia_neoadjuvante']}</ErrorText>}
                                </FieldContainer>
                                <FieldContainer style={{ gridColumn: 'span 6' }}>
                                    <InputLabel>Qual Quimio Neoadjuvante</InputLabel>
                                    <StyledInput name="qual_quimioterapia_neoadjuvante" value={formData.qual_quimioterapia_neoadjuvante} onChange={handleInputChange} disabled={!formData.quimioterapia_neoadjuvante_realizada} />
                                    {errors['tratamento.qual_quimioterapia_neoadjuvante'] && <ErrorText>{errors['tratamento.qual_quimioterapia_neoadjuvante']}</ErrorText>}
                                </FieldContainer>
                            </FormGrid>
                        </FieldContainer>

                        <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                            <CheckboxLabel>
                                <StyledCheckbox name="imunoterapia_neoadjuvante" checked={!!formData.imunoterapia_neoadjuvante} onChange={handleCheckboxChange} disabled={!formData.tratamento_neoadjuvante} />
                                Imunoterapia
                            </CheckboxLabel>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}>
                            <InputLabel>Qual tipo de Imuno (Neoadjuvante)</InputLabel>
                            <StyledInput name="qual_imunoterapia_neoadjuvante" value={formData.qual_imunoterapia_neoadjuvante} onChange={handleInputChange} disabled={!formData.imunoterapia_neoadjuvante} />
                            {errors['tratamento.qual_imunoterapia_neoadjuvante'] && <ErrorText>{errors['tratamento.qual_imunoterapia_neoadjuvante']}</ErrorText>}
                        </FieldContainer>
                    </FormGrid>
                </FieldContainer>

                {/* --- Adjuvante --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '15px' }}>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                            <CheckboxLabel>
                                <StyledCheckbox name="adjuvancia_realizada" checked={!!formData.adjuvancia_realizada} onChange={handleCheckboxChange} />
                                Trat. Adjuvante
                            </CheckboxLabel>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Início Adjuvante</InputLabel>
                            <StyledInput type="date" name="inicio_adjuvante" value={formData.inicio_adjuvante} onChange={handleInputChange} disabled={!formData.adjuvancia_realizada} />
                            {errors['tratamento.inicio_adjuvante'] && <ErrorText>{errors['tratamento.inicio_adjuvante']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Término Adjuvante</InputLabel>
                            <StyledInput type="date" name="termino_adjuvante" value={formData.termino_adjuvante} onChange={handleInputChange} disabled={!formData.adjuvancia_realizada} />
                            {errors['tratamento.termino_adjuvante'] && <ErrorText>{errors['tratamento.termino_adjuvante']}</ErrorText>}
                        </FieldContainer>

                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Qual Adjuvante</InputLabel>
                            <StyledInput name="qual_adjuvante" value={formData.qual_adjuvante} onChange={handleInputChange} disabled={!formData.adjuvancia_realizada} />
                            {errors['tratamento.qual_adjuvante'] && <ErrorText>{errors['tratamento.qual_adjuvante']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Estágio Clínico Adjuvante</InputLabel>
                            <StyledInput name="estagio_clinico_adjuvante" value={formData.estagio_clinico_adjuvante} onChange={handleInputChange} disabled={!formData.adjuvancia_realizada} />
                            {errors['tratamento.estagio_clinico_adjuvante'] && <ErrorText>{errors['tratamento.estagio_clinico_adjuvante']}</ErrorText>}
                        </FieldContainer>

                        <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e9ecef', marginTop: '15px', paddingTop: '15px' }}>
                            <FormGrid>
                                <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                                    <CheckboxLabel>
                                        <StyledCheckbox name="quimioterapia_adjuvante_realizada" checked={!!formData.quimioterapia_adjuvante_realizada} onChange={handleCheckboxChange} disabled={!formData.adjuvancia_realizada} />
                                        Realizou Quimio
                                    </CheckboxLabel>
                                </FieldContainer>
                                <FieldContainer style={{ gridColumn: 'span 2' }}>
                                    <InputLabel>Início Quimio Adj</InputLabel>
                                    <StyledInput type="date" name="inicio_quimioterapia_adjuvante" value={formData.inicio_quimioterapia_adjuvante} onChange={handleInputChange} disabled={!formData.quimioterapia_adjuvante_realizada} />
                                    {errors['tratamento.inicio_quimioterapia_adjuvante'] && <ErrorText>{errors['tratamento.inicio_quimioterapia_adjuvante']}</ErrorText>}
                                </FieldContainer>
                                <FieldContainer style={{ gridColumn: 'span 2' }}>
                                    <InputLabel>Fim Quimio Adj</InputLabel>
                                    <StyledInput type="date" name="fim_quimioterapia_adjuvante" value={formData.fim_quimioterapia_adjuvante} onChange={handleInputChange} disabled={!formData.quimioterapia_adjuvante_realizada} />
                                    {errors['tratamento.fim_quimioterapia_adjuvante'] && <ErrorText>{errors['tratamento.fim_quimioterapia_adjuvante']}</ErrorText>}
                                </FieldContainer>
                                <FieldContainer style={{ gridColumn: 'span 6' }}>
                                    <InputLabel>Qual Quimio Adjuvante</InputLabel>
                                    <StyledInput name="qual_quimioterapia_adjuvante" value={formData.qual_quimioterapia_adjuvante} onChange={handleInputChange} disabled={!formData.quimioterapia_adjuvante_realizada} />
                                    {errors['tratamento.qual_quimioterapia_adjuvante'] && <ErrorText>{errors['tratamento.qual_quimioterapia_adjuvante']}</ErrorText>}
                                </FieldContainer>
                            </FormGrid>
                        </FieldContainer>

                        <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                            <CheckboxLabel>
                                <StyledCheckbox name="imunoterapia_adjuvante" checked={!!formData.imunoterapia_adjuvante} onChange={handleCheckboxChange} disabled={!formData.adjuvancia_realizada} />
                                Imunoterapia
                            </CheckboxLabel>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}>
                            <InputLabel>Qual tipo de Imuno (Adjuvante)</InputLabel>
                            <StyledInput name="qual_imunoterapia_adjuvante" value={formData.qual_imunoterapia_adjuvante} onChange={handleInputChange} disabled={!formData.imunoterapia_adjuvante} />
                            {errors['tratamento.qual_imunoterapia_adjuvante'] && <ErrorText>{errors['tratamento.qual_imunoterapia_adjuvante']}</ErrorText>}
                        </FieldContainer>
                    </FormGrid>
                </FieldContainer>

                {/* --- Quimioterapia Paliativa --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '15px' }}>
                    <InputLabel style={{ fontSize: '1.1rem', fontWeight: 600, color: '#343a40' }}>Quimioterapia Paliativa</InputLabel>
                    <PalliativeChemoList
                        chemos={formData.quimioterapias_paliativas}
                        onEdit={onEditPalliativeChemo}
                        onRemove={onRemovePalliativeChemo}
                    />
                    <AddMoreButton type="button" onClick={onAddPalliativeChemo}>
                        + Adicionar Linha Paliativa
                    </AddMoreButton>
                </FieldContainer>

                {/* --- Radioterapia --- */}
                <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Radioterapia Tipo</InputLabel><StyledInput name="radioterapia_tipo" value={formData.radioterapia_tipo} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Radioterapia Sessões</InputLabel><StyledInput type="number" name="radioterapia_sessoes" value={formData.radioterapia_sessoes} onChange={handleInputChange} />{errors['tratamento.radioterapia_sessoes'] && <ErrorText>{errors['tratamento.radioterapia_sessoes']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Início Radioterapia</InputLabel><StyledInput type="date" name="inicio_radioterapia" value={formData.inicio_radioterapia} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Fim Radioterapia</InputLabel><StyledInput type="date" name="fim_radioterapia" value={formData.fim_radioterapia} onChange={handleInputChange} /></FieldContainer>

                {/* --- Endocrinoterapia --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e0e0e0', paddingTop: '15px', marginTop: '15px' }}>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
                            <CheckboxLabel>
                                <StyledCheckbox name="endocrinoterapia_realizada" checked={!!formData.endocrinoterapia_realizada} onChange={handleCheckboxChange} />
                                Endocrinoterapia
                            </CheckboxLabel>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Início Endocrinoterapia</InputLabel>
                            <StyledInput type="date" name="inicio_endocrino" value={formData.inicio_endocrino} onChange={handleInputChange} disabled={!formData.endocrinoterapia_realizada} />
                            {errors['tratamento.inicio_endocrino'] && <ErrorText>{errors['tratamento.inicio_endocrino']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 2' }}>
                            <InputLabel>Fim Endocrinoterapia</InputLabel>
                            <StyledInput type="date" name="fim_endocrino" value={formData.fim_endocrino} onChange={handleInputChange} disabled={!formData.endocrinoterapia_realizada} />
                            {errors['tratamento.fim_endocrino'] && <ErrorText>{errors['tratamento.fim_endocrino']}</ErrorText>}
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 6' }}>
                            <InputLabel>Qual Endocrinoterapia</InputLabel>
                            <StyledInput name="qual_endocrinoterapia" value={formData.qual_endocrinoterapia} onChange={handleInputChange} disabled={!formData.endocrinoterapia_realizada} />
                            {errors['tratamento.qual_endocrinoterapia'] && <ErrorText>{errors['tratamento.qual_endocrinoterapia']}</ErrorText>}
                        </FieldContainer>
                    </FormGrid>
                </FieldContainer>

                {/* --- Terapia Alvo (Seção Corrigida) --- */}
                <FieldContainer style={{ gridColumn: 'span 6', borderTop: '1px solid #e0e0e0', paddingTop: '15px', marginTop: '15px' }}>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 6' }}>
                            <CheckboxLabel>
                                <StyledCheckbox
                                    name="terapia_alvo_realizada"
                                    checked={!!formData.terapia_alvo_realizada}
                                    onChange={handleCheckboxChange}
                                />
                                Realizou Terapia Alvo
                            </CheckboxLabel>
                        </FieldContainer>

                        {formData.terapia_alvo_realizada && (
                            <FieldContainer style={{ gridColumn: 'span 6', marginTop: '10px' }}>
                                <InputLabel style={{ fontSize: '1.1rem', fontWeight: 600, color: '#343a40' }}>Terapias Alvo Realizadas</InputLabel>
                                <TargetedTherapyList
                                    therapies={formData.terapias_alvo}
                                    onEdit={onEditTargetedTherapy}
                                    onRemove={onRemoveTargetedTherapy}
                                />
                                <AddMoreButton type="button" onClick={onAddTargetedTherapy} style={{ marginTop: '15px' }}>
                                    + Adicionar Terapia Alvo
                                </AddMoreButton>
                            </FieldContainer>
                        )}
                    </FormGrid>
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default TratamentoSection;