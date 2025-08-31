import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledCheckbox, CheckboxLabel, ErrorText, SectionContent } from '../../pages/Cadastro/styles';

const HistologiaSection = ({ formData, errors, handleInputChange, handleCheckboxChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Core RE</InputLabel><StyledInput name="subtipo_core_re" value={formData.subtipo_core_re} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Core RP</InputLabel><StyledInput name="subtipo_core_rp" value={formData.subtipo_core_rp} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Core HER2</InputLabel><StyledInput name="subtipo_core_her2" value={formData.subtipo_core_her2} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Core Ki67</InputLabel><StyledInput name="subtipo_core_ki67" value={formData.subtipo_core_ki67} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 4' }} />
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Cirurgia RE</InputLabel><StyledInput name="subtipo_cirurgia_re" value={formData.subtipo_cirurgia_re} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Cirurgia RP</InputLabel><StyledInput name="subtipo_cirurgia_rp" value={formData.subtipo_cirurgia_rp} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Cirurgia HER2</InputLabel><StyledInput name="subtipo_cirurgia_her2" value={formData.subtipo_cirurgia_her2} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Subtipo Cirurgia Ki67</InputLabel><StyledInput name="subtipo_cirurgia_ki67" value={formData.subtipo_cirurgia_ki67} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 4' }} />
                <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tamanho Tumoral (cm)</InputLabel><StyledInput type="number" step="0.1" name="tamanho_tumoral" value={formData.tamanho_tumoral} onChange={handleInputChange} />{errors['histologia.tamanho_tumoral'] && <ErrorText>{errors['histologia.tamanho_tumoral']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Grau Tumoral Cirurgia</InputLabel><StyledInput name="grau_tumoral_cirurgia" value={formData.grau_tumoral_cirurgia} onChange={handleInputChange} /></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}><CheckboxLabel><StyledCheckbox name="margens_comprometidas" checked={!!formData.margens_comprometidas} onChange={handleCheckboxChange} />Margens Comprometidas</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel>Local Margens Comprometidas</InputLabel><StyledInput name="margens_local" value={formData.margens_local} onChange={handleInputChange} disabled={!formData.margens_comprometidas} />{errors['histologia.margens_local'] && <ErrorText>{errors['histologia.margens_local']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}><CheckboxLabel><StyledCheckbox name="biopsia_linfonodo_sentinela" checked={!!formData.biopsia_linfonodo_sentinela} onChange={handleCheckboxChange} />Biópsia Linfonodo Sentinela</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>BLS Numerador</InputLabel><StyledInput type="number" name="bls_numerador" value={formData.bls_numerador} onChange={handleInputChange} />{errors['histologia.bls_numerador'] && <ErrorText>{errors['histologia.bls_numerador']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>BLS Denominador</InputLabel><StyledInput type="number" name="bls_denominador" value={formData.bls_denominador} onChange={handleInputChange} />{errors['histologia.bls_denominador'] && <ErrorText>{errors['histologia.bls_denominador']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2', justifyContent: 'center' }}><CheckboxLabel><StyledCheckbox name="linfadenectomia_axilar" checked={!!formData.linfadenectomia_axilar} onChange={handleCheckboxChange} />Linfadenectomia Axilar</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>EA Numerador</InputLabel><StyledInput type="number" name="ea_numerador" value={formData.ea_numerador} onChange={handleInputChange} />{errors['histologia.ea_numerador'] && <ErrorText>{errors['histologia.ea_numerador']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>EA Denominador</InputLabel><StyledInput type="number" name="ea_denominador" value={formData.ea_denominador} onChange={handleInputChange} />{errors['histologia.ea_denominador'] && <ErrorText>{errors['histologia.ea_denominador']}</ErrorText>}</FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default HistologiaSection;