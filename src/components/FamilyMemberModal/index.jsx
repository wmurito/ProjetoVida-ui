import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGrid,
    FieldContainer,
    InputLabel,
    StyledInput,
    StyledSelect,
    AddButton,
    CancelButton
} from './styles';

// As opções de parentesco permanecem as mesmas
const parentescoMasculinoOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'pai', label: 'Pai' },
    { value: 'avo_paterno', label: 'Avô Paterno' },
    { value: 'avo_materno', label: 'Avô Materno' },
    { value: 'irmao', label: 'Irmão' },
    { value: 'tio_paterno', label: 'Tio Paterno' },
    { value: 'tio_materno', label: 'Tio Materno' },
    { value: 'primo_paterno', label: 'Primo Paterno' },
    { value: 'primo_materno', label: 'Primo Materno' },
    { value: 'sobrinho', label: 'Sobrinho' },
    { value: 'filho', label: 'Filho' },
];

const parentescoFemininoOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'mae', label: 'Mãe' },
    { value: 'avo_paterna', label: 'Avó Paterna' },
    { value: 'avo_materna', label: 'Avó Materna' },
    { value: 'irma', label: 'Irmã' },
    { value: 'tia_paterna', label: 'Tia Paterna' },
    { value: 'tia_materna', label: 'Tia Materna' },
    { value: 'prima_paterna', label: 'Prima Paterna' },
    { value: 'prima_materna', label: 'Prima Materna' },
    { value: 'sobrinha', label: 'Sobrinha' },
    { value: 'filha', label: 'Filha' },
];

const FamilyMemberModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [familiarData, setFamiliarData] = useState({});
    const [genero, setGenero] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (member) {
                // Converte os dados do membro (formato da lista) para o formato do modal
                const internalState = {
                    ...member,
                    cancer_mama: member.tem_cancer_mama ? 'sim' : 'nao',
                    cancer_ovario: member.tem_cancer_ovario ? 'sim' : 'nao',
                    bilateral: member.bilateral ? 'sim' : 'nao',
                };
                setFamiliarData(internalState);
                setGenero(member.genero || '');
            } else {
                // Define valores padrão para um novo membro
                setFamiliarData({
                    cancer_mama: 'nao',
                    cancer_ovario: 'nao',
                    bilateral: 'nao',
                    gene_brca: 'desconhecido',
                    parentesco: '',
                });
                setGenero('');
            }
        }
    }, [member, isOpen]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Validar campos numéricos
        if (type === 'number') {
            const numValue = parseInt(value, 10);
            if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 150)) {
                return;
            }
        }
        
        setFamiliarData(prev => ({ ...prev, [name]: value }));
    };

    const handleGeneroChange = (e) => {
        const newGenero = e.target.value;
        setGenero(newGenero);
        setFamiliarData(prev => ({ ...prev, genero: newGenero, parentesco: '' }));
    };

    const handleRadioChange = (name, value) => {
        setFamiliarData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validar campos obrigatórios
        if (!genero) {
            alert('Por favor, selecione o gênero do familiar.');
            return;
        }
        
        if (!familiarData.parentesco) {
            alert('Por favor, selecione o parentesco.');
            return;
        }

        try {
            // Converte os dados do modal para o formato da lista antes de submeter
            const dataToSubmit = {
                ...familiarData,
                genero: genero,
                tem_cancer_mama: familiarData.cancer_mama === 'sim',
                tem_cancer_ovario: familiarData.cancer_ovario === 'sim',
                bilateral: familiarData.bilateral === 'sim',
            };

            // Remove as propriedades internas do modal para não sujar o objeto final
            delete dataToSubmit.cancer_mama;
            delete dataToSubmit.cancer_ovario;

            onSubmit(dataToSubmit);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar membro familiar:', error);
            alert('Erro ao salvar os dados. Por favor, tente novamente.');
        }
    };

    if (!isOpen) return null;

    const parentescoOptions = genero === 'masculino'
        ? parentescoMasculinoOptions
        : genero === 'feminino'
            ? parentescoFemininoOptions
            : [{ value: '', label: 'Selecione o gênero primeiro...' }];

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    {member ? 'Editar Membro Familiar' : 'Adicionar Membro Familiar'}
                    <button onClick={onClose}><FaTimes /></button>
                </ModalHeader>
                <ModalBody>
                    <FormGrid>
                        {/* Gênero */}
                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Gênero do Familiar</InputLabel>
                            <StyledSelect name="genero" value={genero} onChange={handleGeneroChange}>
                                <option value="">Selecione...</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                            </StyledSelect>
                        </FieldContainer>

                        {/* Parentesco */}
                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Parentesco</InputLabel>
                            <StyledSelect
                                name="parentesco"
                                value={familiarData.parentesco || ''}
                                onChange={handleChange}
                                disabled={!genero}
                            >
                                {parentescoOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </StyledSelect>
                        </FieldContainer>

                        {/* Campos Femininos */}
                        {genero === 'feminino' && (
                            <>
                                {/* Câncer de mama */}
                                <FieldContainer style={{ gridColumn: 'span 3' }}>
                                    <InputLabel>Câncer de mama?</InputLabel>
                                    <label><input type="radio" name="cancer_mama" checked={familiarData.cancer_mama === 'nao'} onChange={() => handleRadioChange('cancer_mama', 'nao')} /> Não</label>
                                    <label><input type="radio" name="cancer_mama" checked={familiarData.cancer_mama === 'sim'} onChange={() => handleRadioChange('cancer_mama', 'sim')} /> Sim</label>
                                    {familiarData.cancer_mama === 'sim' && (
                                        <StyledInput type="number" name="idade_cancer_mama" placeholder="Idade no início" value={familiarData.idade_cancer_mama || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </FieldContainer>

                                {/* Bilateral */}
                                <FieldContainer style={{ gridColumn: 'span 3' }}>
                                    <InputLabel>Bilateral?</InputLabel>
                                    <label><input type="radio" name="bilateral" checked={familiarData.bilateral === 'nao'} onChange={() => handleRadioChange('bilateral', 'nao')} /> Não</label>
                                    <label><input type="radio" name="bilateral" checked={familiarData.bilateral === 'sim'} onChange={() => handleRadioChange('bilateral', 'sim')} /> Sim</label>
                                    {familiarData.bilateral === 'sim' && (
                                        <StyledInput type="number" name="idade_segunda_mama" placeholder="Idade 2ª mama" value={familiarData.idade_segunda_mama || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </FieldContainer>

                                {/* Câncer de ovário */}
                                <FieldContainer style={{ gridColumn: 'span 3' }}>
                                    <InputLabel>Câncer de ovário?</InputLabel>
                                    <label><input type="radio" name="cancer_ovario" checked={familiarData.cancer_ovario === 'nao'} onChange={() => handleRadioChange('cancer_ovario', 'nao')} /> Não</label>
                                    <label><input type="radio" name="cancer_ovario" checked={familiarData.cancer_ovario === 'sim'} onChange={() => handleRadioChange('cancer_ovario', 'sim')} /> Sim</label>
                                    {familiarData.cancer_ovario === 'sim' && (
                                        <StyledInput type="number" name="idade_cancer_ovario" placeholder="Idade no início" value={familiarData.idade_cancer_ovario || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </FieldContainer>
                                
                                {/* Gene BRCA */}
                                <FieldContainer style={{ gridColumn: 'span 3' }}>
                                    <InputLabel>Gene BRCA</InputLabel>
                                    {['desconhecido', 'normal', 'brca1', 'brca2'].map(opt => (
                                        <label key={opt}><input type="radio" name="gene_brca" checked={familiarData.gene_brca === opt} onChange={() => handleRadioChange('gene_brca', opt)} />{opt}</label>
                                    ))}
                                </FieldContainer>
                            </>
                        )}

                        {/* Campos Masculinos */}
                        {genero === 'masculino' && (
                            <>
                                {/* Câncer de mama */}
                                <FieldContainer style={{ gridColumn: 'span 3' }}>
                                    <InputLabel>Câncer de mama?</InputLabel>
                                    <label><input type="radio" name="cancer_mama" checked={familiarData.cancer_mama === 'nao'} onChange={() => handleRadioChange('cancer_mama', 'nao')} /> Não</label>
                                    <label><input type="radio" name="cancer_mama" checked={familiarData.cancer_mama === 'sim'} onChange={() => handleRadioChange('cancer_mama', 'sim')} /> Sim</label>
                                    {familiarData.cancer_mama === 'sim' && (
                                        <StyledInput type="number" name="idade_cancer_mama" placeholder="Idade no início" value={familiarData.idade_cancer_mama || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </FieldContainer>

                                {/* Gene BRCA */}
                                <FieldContainer style={{ gridColumn: 'span 3' }}>
                                    <InputLabel>Gene BRCA</InputLabel>
                                    {['desconhecido', 'normal', 'brca1', 'brca2'].map(opt => (
                                        <label key={opt}><input type="radio" name="gene_brca" checked={familiarData.gene_brca === opt} onChange={() => handleRadioChange('gene_brca', opt)} /> {opt} </label>
                                    ))}
                                </FieldContainer>
                            </>
                        )}
                    </FormGrid>
                </ModalBody>
                <ModalFooter>
                    <CancelButton type="button" onClick={onClose}><FaTimes /> Cancelar</CancelButton>
                    <AddButton type="button" onClick={handleSave}><FaSave /> Salvar</AddButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default FamilyMemberModal;