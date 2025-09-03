import React, { useState, useEffect } from 'react';
import { 
    ModalOverlay, ModalContent, ModalHeader, CloseButton, ModalBody,
    RelativeGrid, RelativeCard, RelativeName,
    FormSection, InputGroup, Label, Input, RadioGroup, RadioButtonLabel,
    ModalFooter, SaveButton, CancelButton, ErrorText
} from './styles';

// --- Estrutura de Dados dos Parentes ---
const RELATIVES = {
  '1º Grau': ['Mãe', 'Pai', 'Irmã', 'Irmão', 'Filha', 'Filho'],
  'Paterno': ['Avó Paterna', 'Tia Paterna', 'Meia-Irmã Paterna', 'Filha do Tio Paterna'],
  'Materno': ['Avó Materna', 'Tia Materna', 'Meia-Irmã Materna', 'Filha do Tio Materna'],
};

const MALE_RELATIVES = new Set([
    'Pai', 'Irmão', 'Filho', 'Filho do Tio Paterna', 'Filho do Tio Materna'
]);

const FamilyMemberModal = ({ isOpen, onClose, onSubmit, member }) => {
    const initialState = {
        parentesco: '',
        idade: '',
        tem_cancer_mama: false,
        tem_cancer_ovario: false,
        gene_brca: 'Desconhecido',
    };

    const [formData, setFormData] = useState(initialState);
    const [selectedRelative, setSelectedRelative] = useState(null);
    const [errors, setErrors] = useState({});

    // Popula o formulário se estiver em modo de edição
    useEffect(() => {
        if (isOpen && member) {
            setFormData(member);
            setSelectedRelative(member.parentesco);
        } else {
            setFormData(initialState);
            setSelectedRelative(null);
        }
        setErrors({});
    }, [member, isOpen]);

    if (!isOpen) return null;

    const isMale = (relative) => MALE_RELATIVES.has(relative);

    // Função para selecionar/desselecionar um parente
    const handleSelectRelative = (relative) => {
        if (selectedRelative === relative) {
            setSelectedRelative(null); // Desseleciona se clicar no mesmo
            setFormData(initialState);
        } else {
            setSelectedRelative(relative);
            const newFormData = { ...initialState, parentesco: relative };
            if (isMale(relative)) {
                newFormData.tem_cancer_ovario = false;
            }
            setFormData(newFormData);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleRadioChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const validate = () => {
        if (!selectedRelative) return false; // Não pode salvar sem selecionar
        const newErrors = {};
        if (formData.idade && (isNaN(formData.idade) || formData.idade < 0 || formData.idade > 150)) {
            newErrors.idade = 'Idade inválida.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = () => {
        if (!validate()) return;
        onSubmit(formData);
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2>Adicionar Histórico Familiar</h2>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <RelativeGrid>
                        {Object.entries(RELATIVES).map(([degree, relatives]) => (
                            <div key={degree}>
                                {relatives.map(relative => (
                                    <RelativeCard 
                                        key={relative} 
                                        $isSelected={selectedRelative === relative}
                                        onClick={() => handleSelectRelative(relative)}
                                    >
                                        <RelativeName>{relative.replace(' Paterna', '').replace(' Materna', '')}</RelativeName>
                                        {selectedRelative === relative && (
                                            <FormSection onClick={(e) => e.stopPropagation()}>
                                                <InputGroup>
                                                    <Label>Idade atual ou da morte?</Label>
                                                    <Input type="number" name="idade" value={formData.idade} onChange={handleChange} placeholder="Ex: 55" $hasError={!!errors.idade}/>
                                                    {errors.idade && <ErrorText>{errors.idade}</ErrorText>}
                                                </InputGroup>
                                                
                                                <InputGroup>
                                                    <Label $pinkTheme={true}>Câncer de Mama?</Label>
                                                    <RadioGroup>
                                                        <RadioButtonLabel><input type="radio" name="tem_cancer_mama" value={false} checked={!formData.tem_cancer_mama} onChange={() => handleRadioChange('tem_cancer_mama', false)} /> Não</RadioButtonLabel>
                                                        <RadioButtonLabel><input type="radio" name="tem_cancer_mama" value={true} checked={!!formData.tem_cancer_mama} onChange={() => handleRadioChange('tem_cancer_mama', true)} /> Sim</RadioButtonLabel>
                                                    </RadioGroup>
                                                </InputGroup>

                                                {!isMale(relative) && (
                                                    <InputGroup>
                                                        <Label>Câncer de Ovário?</Label>
                                                        <RadioGroup>
                                                            <RadioButtonLabel><input type="radio" name="tem_cancer_ovario" value={false} checked={!formData.tem_cancer_ovario} onChange={() => handleRadioChange('tem_cancer_ovario', false)} /> Não</RadioButtonLabel>
                                                            <RadioButtonLabel><input type="radio" name="tem_cancer_ovario" value={true} checked={!!formData.tem_cancer_ovario} onChange={() => handleRadioChange('tem_cancer_ovario', true)} /> Sim</RadioButtonLabel>
                                                        </RadioGroup>
                                                    </InputGroup>
                                                )}

                                                <InputGroup>
                                                    <Label>Gene BRCA:</Label>
                                                    <RadioGroup>
                                                        {['Desconhecido', 'Testado, Normal', 'BRCA1+', 'BRCA2+'].map(option => (
                                                          <RadioButtonLabel key={option}>
                                                            <input type="radio" name="gene_brca" value={option} checked={formData.gene_brca === option} onChange={handleChange} />
                                                            {option}
                                                          </RadioButtonLabel>  
                                                        ))}
                                                    </RadioGroup>
                                                </InputGroup>
                                            </FormSection>
                                        )}
                                    </RelativeCard>
                                ))}
                            </div>
                        ))}
                    </RelativeGrid>
                </ModalBody>
                <ModalFooter>
                    <CancelButton onClick={onClose}>Cancelar</CancelButton>
                    <SaveButton onClick={handleSubmit} disabled={!selectedRelative}>Salvar</SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default FamilyMemberModal;