import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, ErrorText, SectionContent, AddMemberButton } from '../../pages/Cadastro/styles';
import FamilyMembersList from '../Modal/FamilyMemberModal';

const HistoriaFamiliarSection = ({ familiares, historiaFamiliar, errors, handleInputChange, onAddMember, onEditMember, onRemoveMember }) => {
    return (
        <SectionContent>
            <FamilyMembersList
                members={familiares}
                onEdit={onEditMember}
                onRemove={onRemoveMember}
            />
            <AddMemberButton type="button" onClick={onAddMember}>
                + Adicionar Membro da Família
            </AddMemberButton>
            <FormGrid style={{ marginTop: '30px' }}>
                <FieldContainer style={{ gridColumn: 'span 6' }}>
                    <InputLabel htmlFor="hf_outros">
                        Outras informações sobre histórico familiar
                    </InputLabel>
                    <StyledInput
                        id="hf_outros"
                        name="outros"
                        value={historiaFamiliar.outros}
                        onChange={handleInputChange}
                        placeholder="Descreva outras informações relevantes..."
                        as="textarea"
                        rows="3"
                    />
                    {errors['historia_familiar.outros'] && (
                        <ErrorText>{errors['historia_familiar.outros']}</ErrorText>
                    )}
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default HistoriaFamiliarSection;