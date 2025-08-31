// src/components/Modal/FamilyMemberModal/index.js
import React, { useState, useEffect } from 'react';
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormContainer,
  FormGroup,
  Label,
  Input,
  Select,
  RadioGroup,
  RadioOption,
  RadioInput,
  RadioLabel,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  ErrorText,
  RemoveButton
} from './styles';

const parentescoOptions = [
  "Mãe", "Pai", "Irmã", "Irmão", "Filha", "Filho",
  "Avó Paterna", "Avô Paterno", "Avó Materna", "Avô Materno",
  "Tia Paterna", "Tio Paterno", "Tia Materna", "Tio Materno",
  "Meia-irmã", "Meio-irmão", "Prima", "Primo", "Filha do Tio", "Filho do Tio"
];

const geneBrcaOptions = [
  "Desconhecido",
  "Testado, Normal", 
  "BRCA1+",
  "BRCA2+"
];

const FamilyMemberModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  member = null,
  onRemove = null 
}) => {
  const [formData, setFormData] = useState({
    parentesco: '',
    idade: '',
    tem_cancer_mama: false,
    tem_cancer_ovario: false,
    gene_brca: 'Desconhecido',
    tem_filha_com_historico: false
  });

  const [errors, setErrors] = useState({});
  const isEditing = member !== null;

  // Preenche o formulário quando está editando
  useEffect(() => {
    if (isEditing && member) {
      setFormData({
        parentesco: member.parentesco || '',
        idade: member.idade || '',
        tem_cancer_mama: member.tem_cancer_mama || false,
        tem_cancer_ovario: member.tem_cancer_ovario || false,
        gene_brca: member.gene_brca || 'Desconhecido',
        tem_filha_com_historico: member.tem_filha_com_historico || false
      });
    } else {
      // Reset para novo membro
      setFormData({
        parentesco: '',
        idade: '',
        tem_cancer_mama: false,
        tem_cancer_ovario: false,
        gene_brca: 'Desconhecido',
        tem_filha_com_historico: false
      });
    }
    setErrors({});
  }, [isEditing, member, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Remove erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.parentesco.trim()) {
      newErrors.parentesco = 'O parentesco é obrigatório';
    }

    if (formData.idade && (isNaN(formData.idade) || formData.idade < 0 || formData.idade > 150)) {
      newErrors.idade = 'Idade deve ser um número válido entre 0 e 150';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const memberData = {
      ...formData,
      idade: formData.idade ? parseInt(formData.idade) : null
    };

    onSubmit(memberData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      parentesco: '',
      idade: '',
      tem_cancer_mama: false,
      tem_cancer_ovario: false,
      gene_brca: 'Desconhecido',
      tem_filha_com_historico: false
    });
    setErrors({});
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm('Tem certeza que deseja remover este membro da família?')) {
      onRemove();
      handleClose();
    }
  };

  // Verifica se deve mostrar a pergunta sobre filha com histórico
  const shouldShowFilhaQuestion = () => {
    const parentescoComFilha = ['Tia Paterna', 'Tia Materna', 'Irmã', 'Prima'];
    return parentescoComFilha.includes(formData.parentesco);
  };

  return (
    <ModalBackdrop onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isEditing ? 'Editar Membro da Família' : 'Adicionar Membro da Família'}
          </ModalTitle>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </ModalHeader>

        <FormContainer onSubmit={handleSubmit}>
              <div  style={{ display: 'flex', flexDirection: 'row', gap: '60px' }}>
          <FormGroup>
            <Label>Parentesco *</Label>
            <Select 
              name="parentesco" 
              value={formData.parentesco} 
              onChange={handleChange}
              $hasError={!!errors.parentesco}
            >
              <option value="">Selecione o parentesco...</option>
              {parentescoOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
            {errors.parentesco && <ErrorText>{errors.parentesco}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Idade atual ou idade no momento da morte</Label>
            <Input 
              type="number" 
              name="idade" 
              value={formData.idade} 
              onChange={handleChange}
              placeholder="Ex: 45"
              min="0"
              max="150"
              $hasError={!!errors.idade}
            />
            {errors.idade && <ErrorText>{errors.idade}</ErrorText>}
          </FormGroup>
           </div>
              <div  style={{ display: 'flex', flexDirection: 'row', gap: '45px' }}>
          <FormGroup>
            <Label>Câncer de mama?</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput 
                  type="radio" 
                  name="cancer_mama_radio"
                  checked={!formData.tem_cancer_mama}
                  onChange={() => handleRadioChange('tem_cancer_mama', false)}
                />
                <RadioLabel>Não</RadioLabel>
              </RadioOption>
              <RadioOption>
                <RadioInput 
                  type="radio" 
                  name="cancer_mama_radio"
                  checked={formData.tem_cancer_mama}
                  onChange={() => handleRadioChange('tem_cancer_mama', true)}
                />
                <RadioLabel>Sim</RadioLabel>
              </RadioOption>
            </RadioGroup>
          </FormGroup>

          <FormGroup>
            <Label>Câncer de ovário?</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput 
                  type="radio" 
                  name="cancer_ovario_radio"
                  checked={!formData.tem_cancer_ovario}
                  onChange={() => handleRadioChange('tem_cancer_ovario', false)}
                />
                <RadioLabel>Não</RadioLabel>
              </RadioOption>
              <RadioOption>
                <RadioInput 
                  type="radio" 
                  name="cancer_ovario_radio"
                  checked={formData.tem_cancer_ovario}
                  onChange={() => handleRadioChange('tem_cancer_ovario', true)}
                />
                <RadioLabel>Sim</RadioLabel>
              </RadioOption>
            </RadioGroup>
          </FormGroup>
              </div>
          <FormGroup>
            <Label>Gene BRCA:</Label>
            <RadioGroup>
              {geneBrcaOptions.map(option => (
                <RadioOption key={option}>
                  <RadioInput 
                    type="radio" 
                    name="gene_brca_radio"
                    checked={formData.gene_brca === option}
                    onChange={() => handleRadioChange('gene_brca', option)}
                  />
                  <RadioLabel>{option}</RadioLabel>
                </RadioOption>
              ))}
            </RadioGroup>
          </FormGroup>

          {shouldShowFilhaQuestion() && (
            <FormGroup>
              <Label>Esta {formData.parentesco.toLowerCase()} tem uma filha com histórico de câncer de mama ou de ovário?</Label>
              <RadioGroup>
                <RadioOption>
                  <RadioInput 
                    type="radio" 
                    name="filha_historico_radio"
                    checked={!formData.tem_filha_com_historico}
                    onChange={() => handleRadioChange('tem_filha_com_historico', false)}
                  />
                  <RadioLabel>Não</RadioLabel>
                </RadioOption>
                <RadioOption>
                  <RadioInput 
                    type="radio" 
                    name="filha_historico_radio"
                    checked={formData.tem_filha_com_historico}
                    onChange={() => handleRadioChange('tem_filha_com_historico', true)}
                  />
                  <RadioLabel>Sim</RadioLabel>
                </RadioOption>
              </RadioGroup>
            </FormGroup>
          )}

          <ButtonGroup>
            <CancelButton type="button" onClick={handleClose}>
              Cancelar
            </CancelButton>
            {isEditing && onRemove && (
              <RemoveButton type="button" onClick={handleRemove}>
                Remover
              </RemoveButton>
            )}
            <SubmitButton type="submit">
              {isEditing ? 'Salvar Alterações' : 'Adicionar Membro'}
            </SubmitButton>
          </ButtonGroup>
        </FormContainer>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default FamilyMemberModal;
