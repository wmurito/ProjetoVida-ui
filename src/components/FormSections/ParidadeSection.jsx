import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledCheckbox, CheckboxLabel, ErrorText, SectionContent } from '../../pages/Cadastro/styles';

const ParidadeSection = ({ formData, errors, handleInputChange, handleCheckboxChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_gesta">Gesta (Nº)</InputLabel><StyledInput id="par_gesta" type="number" name="gesta" value={formData.gesta} onChange={handleInputChange} />{errors['paridade.gesta'] && <ErrorText>{errors['paridade.gesta']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_para">Para (Nº)</InputLabel><StyledInput id="par_para" type="number" name="para" value={formData.para} onChange={handleInputChange} />{errors['paridade.para'] && <ErrorText>{errors['paridade.para']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_aborto">Aborto (Nº)</InputLabel><StyledInput id="par_aborto" type="number" name="aborto" value={formData.aborto} onChange={handleInputChange} />{errors['paridade.aborto'] && <ErrorText>{errors['paridade.aborto']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_idade_primeiro_filho">Idade 1º Filho</InputLabel><StyledInput id="par_idade_primeiro_filho" type="number" name="idade_primeiro_filho" value={formData.idade_primeiro_filho} onChange={handleInputChange} />{errors['paridade.idade_primeiro_filho'] && <ErrorText>{errors['paridade.idade_primeiro_filho']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_menarca_idade">Idade Menarca</InputLabel><StyledInput id="par_menarca_idade" type="number" name="menarca_idade" value={formData.menarca_idade} onChange={handleInputChange} />{errors['paridade.menarca_idade'] && <ErrorText>{errors['paridade.menarca_idade']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><CheckboxLabel><StyledCheckbox name="menopausa" checked={!!formData.menopausa} onChange={handleCheckboxChange} /> Menopausa</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_idade_menopausa">Idade Menopausa</InputLabel><StyledInput id="par_idade_menopausa" type="number" name="idade_menopausa" value={formData.idade_menopausa} onChange={handleInputChange} disabled={!formData.menopausa} />{errors['paridade.idade_menopausa'] && <ErrorText>{errors['paridade.idade_menopausa']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><CheckboxLabel><StyledCheckbox name="amamentou" checked={!!formData.amamentou} onChange={handleCheckboxChange} /> Amamentou</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_tempo_amamentacao_meses">Tempo Amamentação (meses)</InputLabel><StyledInput id="par_tempo_amamentacao_meses" type="number" name="tempo_amamentacao_meses" value={formData.tempo_amamentacao_meses} onChange={handleInputChange} disabled={!formData.amamentou} />{errors['paridade.tempo_amamentacao_meses'] && <ErrorText>{errors['paridade.tempo_amamentacao_meses']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><CheckboxLabel><StyledCheckbox name="trh_uso" checked={!!formData.trh_uso} onChange={handleCheckboxChange} /> Uso de TRH</CheckboxLabel></FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_tempo_uso_trh">Tempo Uso TRH (anos)</InputLabel><StyledInput id="par_tempo_uso_trh" type="number" name="tempo_uso_trh" value={formData.tempo_uso_trh} onChange={handleInputChange} disabled={!formData.trh_uso} />{errors['paridade.tempo_uso_trh'] && <ErrorText>{errors['paridade.tempo_uso_trh']}</ErrorText>}</FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel htmlFor="par_tipo_terapia">Tipo de Terapia</InputLabel><StyledInput id="par_tipo_terapia" name="tipo_terapia" value={formData.tipo_terapia} onChange={handleInputChange} disabled={!formData.trh_uso} />{errors['paridade.tipo_terapia'] && <ErrorText>{errors['paridade.tipo_terapia']}</ErrorText>}</FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default ParidadeSection;