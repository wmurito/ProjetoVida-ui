import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledSelect, ErrorText, SectionContent } from '../../pages/Cadastro/styles';
import { corEtniaOptions, escolaridadeOptions, rendaFamiliarOptions } from '../../pages/Cadastro/formConfig';

const DadosPessoaisSection = ({ formData, errors, handleChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 6' }}>
                    <InputLabel htmlFor="nome_completo">Nome Completo</InputLabel>
                    <StyledInput id="nome_completo" name="nome_completo" value={formData.nome_completo} onChange={handleChange} />
                    {errors.nome_completo && <ErrorText>{errors.nome_completo}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="idade">Idade</InputLabel>
                    <StyledInput id="idade" name="idade" type="number" value={formData.idade} onChange={handleChange} />
                    {errors.idade && <ErrorText>{errors.idade}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="data_nascimento">Data de Nascimento</InputLabel>
                    <StyledInput id="data_nascimento" name="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} />
                    {errors.data_nascimento && <ErrorText>{errors.data_nascimento}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="telefone">Telefone</InputLabel>
                    <StyledInput id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="11999998888" />
                    {errors.telefone && <ErrorText>{errors.telefone}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 6' }}>
                    <InputLabel htmlFor="endereco">Endereço</InputLabel>
                    <StyledInput id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} />
                    {errors.endereco && <ErrorText>{errors.endereco}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 3' }}>
                    <InputLabel htmlFor="cidade">Cidade</InputLabel>
                    <StyledInput id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
                    {errors.cidade && <ErrorText>{errors.cidade}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 3' }}>
                    <InputLabel htmlFor="naturalidade">Naturalidade</InputLabel>
                    <StyledInput id="naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} />
                    {errors.naturalidade && <ErrorText>{errors.naturalidade}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="altura">Altura (m)</InputLabel>
                    <StyledInput id="altura" name="altura" type="number" step="0.01" value={formData.altura} onChange={handleChange} placeholder="Ex: 1.75" />
                    {errors.altura && <ErrorText>{errors.altura}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="peso">Peso (kg)</InputLabel>
                    <StyledInput id="peso" name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} placeholder="Ex: 70.5"/>
                    {errors.peso && <ErrorText>{errors.peso}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="imc">IMC</InputLabel>
                    <StyledInput id="imc" name="imc" type="text" value={formData.imc} readOnly disabled />
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="cor_etnia">Cor/Etnia</InputLabel>
                    <StyledSelect id="cor_etnia" name="cor_etnia" value={formData.cor_etnia} onChange={handleChange}>
                        {corEtniaOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </StyledSelect>
                    {errors.cor_etnia && <ErrorText>{errors.cor_etnia}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="escolaridade">Escolaridade</InputLabel>
                    <StyledSelect id="escolaridade" name="escolaridade" value={formData.escolaridade} onChange={handleChange}>
                        {escolaridadeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </StyledSelect>
                    {errors.escolaridade && <ErrorText>{errors.escolaridade}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="renda_familiar">Renda Familiar</InputLabel>
                    <StyledSelect id="renda_familiar" name="renda_familiar" value={formData.renda_familiar} onChange={handleChange}>
                        {rendaFamiliarOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </StyledSelect>
                    {errors.renda_familiar && <ErrorText>{errors.renda_familiar}</ErrorText>}
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default DadosPessoaisSection;