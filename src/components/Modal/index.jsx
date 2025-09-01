import React, { useState, useEffect } from 'react';
import { 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    CloseButton, 
    ModalBody,
    SelectionContainer,
    DegreeColumn,
    DegreeTitle,
    RelativeButton,
    FormContainer,
    FormHeader,
    RelativeTitle,
    RemoveButton,
    InputGroup,
    Label,
    Input,
    RadioGroup,
    RadioButtonLabel,
    ModalFooter,
    SaveButton,
    CancelButton
} from './styles';

const familyTiers = {
  '1º Grau': ['Mãe', 'Pai', 'Irmã', 'Filha', 'Irmão'],
  'Paterno': ['Avó Paterna', 'Tia Paterna', 'Meia-Irmã Paterna', 'Prima Paterna'],
  'Materno': ['Avó Materna', 'Tia Materna', 'Meia-Irmã Materna', 'Prima Materna']
};

const FamilyMemberModal = ({ isOpen, onClose, onSubmit, member }) => {
    const initialState = {
        parentesco: '',
        idade: '',
        tem_cancer_mama: false,
        tem_cancer_ovario: false,
        gene_brca: 'Desconhecido',
        tem_filha_com_historico: null,
    };

    const [formData, setFormData] = useState(initialState);
    const [selectedRelative, setSelectedRelative] = useState('');

    // Reset do estado quando o modal abre/fecha
    useEffect(() => {
        if (isOpen && member) {
            // Modo edição: carrega dados do membro
            setFormData(member);
            setSelectedRelative(member.parentesco);
        } else if (isOpen && !member) {
            // Modo adição: reset completo
            setFormData(initialState);
            setSelectedRelative('');
        } else if (!isOpen) {
            // Modal fechou: limpa tudo para próxima abertura
            setFormData(initialState);
            setSelectedRelative('');
        }
    }, [isOpen, member]);

    if (!isOpen) return null;

    const handleSelectRelative = (relative) => {
        setSelectedRelative(relative);
        setFormData(prev => ({ 
            ...initialState, 
            parentesco: relative 
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Trata campos booleanos especificamente
        if (name === 'tem_cancer_mama' || name === 'tem_cancer_ovario') {
            setFormData(prev => ({ 
                ...prev, 
                [name]: value === 'true' 
            }));
        } else {
            // Outros campos (texto/número)
            setFormData(prev => ({ 
                ...prev, 
                [name]: value 
            }));
        }
    };
    
    const handleSubmit = () => {
        // Validação básica
        if (!selectedRelative) {
            alert('Por favor, selecione um parente.');
            return;
        }

        // Envia os dados
        onSubmit(formData);
        
        // NÃO chama onClose() aqui - deixa o componente pai controlar
        // O componente pai deve chamar handleCloseFamilyModal após receber os dados
    };

    const handleBackToSelection = () => {
        setSelectedRelative('');
        setFormData(initialState);
    };

    const handleModalClose = () => {
        // Reset ao fechar
        setSelectedRelative('');
        setFormData(initialState);
        onClose();
    };

    return (
        <ModalOverlay onClick={handleModalClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2>{member ? 'Editar' : 'Adicionar'} Membro da Família</h2>
                    <CloseButton onClick={handleModalClose}>&times;</CloseButton>
                </ModalHeader>
                <ModalBody>
                    {!selectedRelative ? (
                        <SelectionContainer>
                            {Object.entries(familyTiers).map(([degree, relatives]) => (
                                <DegreeColumn key={degree}>
                                    <DegreeTitle>{degree}</DegreeTitle>
                                    {relatives.map(relative => (
                                        <RelativeButton 
                                            key={relative} 
                                            onClick={() => handleSelectRelative(relative)}
                                        >
                                            {relative.replace(' Paterna', '').replace(' Materna', '')}
                                        </RelativeButton>
                                    ))}
                                </DegreeColumn>
                            ))}
                        </SelectionContainer>
                    ) : (
                        <FormContainer>
                            <FormHeader>
                                <RelativeTitle>{selectedRelative}</RelativeTitle>
                                <RemoveButton onClick={handleBackToSelection}>Trocar</RemoveButton>
                            </FormHeader>

                            <InputGroup>
                                <Label>Idade atual ou da morte?</Label>
                                <Input 
                                    type="number" 
                                    name="idade" 
                                    value={formData.idade} 
                                    onChange={handleChange} 
                                    placeholder="Ex: 55" 
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Câncer de Mama?</Label>
                                <RadioGroup>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="tem_cancer_mama" 
                                            value="false" 
                                            checked={!formData.tem_cancer_mama} 
                                            onChange={handleChange} 
                                        /> Não
                                    </RadioButtonLabel>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="tem_cancer_mama" 
                                            value="true" 
                                            checked={!!formData.tem_cancer_mama} 
                                            onChange={handleChange} 
                                        /> Sim
                                    </RadioButtonLabel>
                                </RadioGroup>
                            </InputGroup>

                            <InputGroup>
                                <Label>Câncer de Ovário?</Label>
                                <RadioGroup>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="tem_cancer_ovario" 
                                            value="false" 
                                            checked={!formData.tem_cancer_ovario} 
                                            onChange={handleChange} 
                                        /> Não
                                    </RadioButtonLabel>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="tem_cancer_ovario" 
                                            value="true" 
                                            checked={!!formData.tem_cancer_ovario} 
                                            onChange={handleChange} 
                                        /> Sim
                                    </RadioButtonLabel>
                                </RadioGroup>
                            </InputGroup>

                            <InputGroup>
                                <Label>Gene BRCA:</Label>
                                <RadioGroup>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="gene_brca" 
                                            value="Desconhecido" 
                                            checked={formData.gene_brca === 'Desconhecido'} 
                                            onChange={handleChange} 
                                        /> Desconhecido
                                    </RadioButtonLabel>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="gene_brca" 
                                            value="Testado, Normal" 
                                            checked={formData.gene_brca === 'Testado, Normal'} 
                                            onChange={handleChange} 
                                        /> Normal
                                    </RadioButtonLabel>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="gene_brca" 
                                            value="BRCA1+" 
                                            checked={formData.gene_brca === 'BRCA1+'} 
                                            onChange={handleChange} 
                                        /> BRCA1+
                                    </RadioButtonLabel>
                                    <RadioButtonLabel>
                                        <input 
                                            type="radio" 
                                            name="gene_brca" 
                                            value="BRCA2+" 
                                            checked={formData.gene_brca === 'BRCA2+'} 
                                            onChange={handleChange} 
                                        /> BRCA2+
                                    </RadioButtonLabel>
                                </RadioGroup>
                            </InputGroup>
                        </FormContainer>
                    )}
                </ModalBody>
                <ModalFooter>
                    <CancelButton onClick={handleModalClose}>Cancelar</CancelButton>
                    <SaveButton 
                        onClick={handleSubmit} 
                        disabled={!selectedRelative}
                    >
                        Salvar
                    </SaveButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default FamilyMemberModal;