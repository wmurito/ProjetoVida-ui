import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledSelect, ErrorText, SectionContent } from '../../pages/Cadastro/styles';
import { corEtniaOptions, escolaridadeOptions, rendaFamiliarOptions } from '../../pages/Cadastro/formConfig';

const DadosPessoaisSection = ({ formData, errors, handleChange }) => {
    return (
        <SectionContent>
            <FormGrid>
                <FieldContainer style={{ gridColumn: 'span 4' }}>
                    <InputLabel htmlFor="nome_completo">Nome Completo</InputLabel>
                    <StyledInput id="nome_completo" name="nome_completo" value={formData.nome_completo} onChange={handleChange} />
                    {errors.nome_completo && <ErrorText>{errors.nome_completo}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 1' }}>
                    <InputLabel htmlFor="idade">Idade</InputLabel>
                    <StyledInput id="idade" name="idade" type="number" value={formData.idade} onChange={handleChange} min="0" max="150" />
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

                <FieldContainer style={{ gridColumn: 'span 1' }}>
                    <InputLabel htmlFor="cep">CEP</InputLabel>
                    <StyledInput id="cep" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" />
                    {errors.cep && <ErrorText>{errors.cep}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 1' }}>
                    <InputLabel htmlFor="numero">Número</InputLabel>
                    <StyledInput id="numero" name="numero" value={formData.numero} onChange={handleChange} />
                    {errors.numero && <ErrorText>{errors.numero}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="complemento">Complemento</InputLabel>
                    <StyledInput id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} />
                    {errors.complemento && <ErrorText>{errors.complemento}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="bairro">Bairro</InputLabel>
                    <StyledInput id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
                    {errors.bairro && <ErrorText>{errors.bairro}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 1' }}>
                    <InputLabel htmlFor="uf">UF</InputLabel>
                    <StyledInput id="uf" name="uf" value={formData.uf} onChange={handleChange} maxLength="2" placeholder="SP" />
                    {errors.uf && <ErrorText>{errors.uf}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="cidade">Cidade</InputLabel>
                    <StyledInput id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
                    {errors.cidade && <ErrorText>{errors.cidade}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 1' }}>
                    <InputLabel htmlFor="genero">Gênero</InputLabel>
                    <StyledSelect id="genero" name="genero" value={formData.genero} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option value="feminino">Feminino</option>
                        <option value="masculino">Masculino</option>
                        <option value="outro">Outro</option>
                        <option value="nao_informado">Não informado</option>
                    </StyledSelect>
                    {errors.genero && <ErrorText>{errors.genero}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="estado_civil">Estado Civil</InputLabel>
                    <StyledSelect id="estado_civil" name="estado_civil" value={formData.estado_civil} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option value="solteiro">Solteiro(a)</option>
                        <option value="casado">Casado(a)</option>
                        <option value="divorciado">Divorciado(a)</option>
                        <option value="viuvo">Viúvo(a)</option>
                        <option value="uniao_estavel">União Estável</option>
                        <option value="nao_informado">Não informado</option>
                    </StyledSelect>
                    {errors.estado_civil && <ErrorText>{errors.estado_civil}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 2' }}>
                    <InputLabel htmlFor="naturalidade">Naturalidade</InputLabel>
                    <StyledInput id="naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} />
                    {errors.naturalidade && <ErrorText>{errors.naturalidade}</ErrorText>}
                </FieldContainer>

                <FieldContainer style={{ gridColumn: 'span 1' }}>
                    <InputLabel htmlFor="altura">Altura (m)</InputLabel>
                    <StyledInput id="altura" name="altura" type="number" step="0.01" value={formData.altura} onChange={handleChange} placeholder="Ex: 1.75" min="0.5" max="3.0" />
                    {errors.altura && <ErrorText>{errors.altura}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 1' }}>
                    <InputLabel htmlFor="peso">Peso (kg)</InputLabel>
                    <StyledInput id="peso" name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} placeholder="Ex: 70.5" min="1" max="500" />
                    {errors.peso && <ErrorText>{errors.peso}</ErrorText>}
                </FieldContainer>
                <FieldContainer style={{ gridColumn: 'span 1' }}>
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