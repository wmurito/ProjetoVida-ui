import React from 'react';
import { FormGrid, FieldContainer, InputLabel, StyledInput, StyledCheckbox, CheckboxLabel, ErrorText, SectionContent } from '../../pages/Cadastro/styles';

const HistoriaPatologicaSection = ({ formData, errors, handleInputChange, handleCheckboxChange }) => {
    const patologias = [
        { label: 'Hipertensão', name: 'hipertensao' },
        { label: 'Hipotireoidismo', name: 'hipotireoidismo' },
        { label: 'Distúrbio de Ansiedade', name: 'ansiedade' },
        { label: 'Síndrome Depressiva', name: 'depressao' },
        { label: 'Diabetes', name: 'diabetes' }
    ];

    return (
        <SectionContent>
            <FormGrid>
                {patologias.map((item) => (
                    <FieldContainer key={item.name} style={{ gridColumn: 'span 2' }}>
                        <CheckboxLabel htmlFor={`hp_${item.name}`}>
                            <StyledCheckbox
                                id={`hp_${item.name}`}
                                name={item.name}
                                checked={!!formData[item.name]}
                                onChange={handleCheckboxChange}
                            />
                            {item.label}
                        </CheckboxLabel>
                    </FieldContainer>
                ))}
                <FieldContainer style={{ gridColumn: 'span 6', marginTop: '10px' }}>
                    <InputLabel htmlFor="hp_outros">Outros (Hist. Patológica)</InputLabel>
                    <StyledInput
                        id="hp_outros"
                        name="outros"
                        value={formData.outros}
                        onChange={handleInputChange}
                    />
                    {errors['historia_patologica.outros'] && <ErrorText>{errors['historia_patologica.outros']}</ErrorText>}
                </FieldContainer>
            </FormGrid>
        </SectionContent>
    );
};

export default HistoriaPatologicaSection;