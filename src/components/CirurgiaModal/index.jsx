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
    CheckboxLabel,
    StyledCheckbox,
    AddButton,
    CancelButton
} from './styles';

// Componente genérico para os campos do formulário
const FormFields = ({ fields, data, handleChange }) => (
    <FormGrid>
        {fields.map(field => {
            // Lógica de renderização condicional
            if (field.showIf) {
                const conditionField = field.showIf.field;
                const conditionValue = field.showIf.value;
                if (data[conditionField] !== conditionValue) {
                    return null;
                }
            }
            return (
                <FieldContainer key={field.name} style={{ gridColumn: `span ${field.span || 2}` }}>
                    <InputLabel>{field.label}</InputLabel>
                    {field.type === 'select' ? (
                        <StyledSelect name={field.name} value={data[field.name] || ''} onChange={handleChange}>
                            {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </StyledSelect>
                    ) : field.type === 'checkbox' ? (
                        <CheckboxLabel>
                            <StyledCheckbox type="checkbox" name={field.name} checked={!!data[field.name]} onChange={handleChange} />
                            {field.checkboxLabel || ''}
                        </CheckboxLabel>
                    ) : (
                        <StyledInput type={field.type || 'text'} name={field.name} value={data[field.name] || ''} onChange={handleChange} />
                    )}
                </FieldContainer>
            );
        })}
    </FormGrid>
);

const CirurgiaModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [procedimentoData, setProcedimentoData] = useState({});

    // Define os campos para cada tipo de cirurgia
    const camposMama = [ { name: 'data', label: 'Data', type: 'date', span: 2 }, { name: 'tecnica', label: 'Técnica', span: 4 }, { name: 'ampliacao_margem', label: 'Ampliação de Margem', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'tipo_histologico', label: 'AP: Tipo Histológico', span: 2 }, { name: 'subtipo_histologico', label: 'AP: Subtipo Histológico', span: 2 }, { name: 'tamanho_tumor', label: 'AP: Tamanho do Tumor', span: 2 }, { name: 'grau_histologico', label: 'AP: Grau Histológico', span: 2 }, { name: 'invasao_angiolinfatica', label: 'AP: Invasão Angiolinfática', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'infiltrado_linfocitario', label: 'AP: Infiltrado Linfocitário', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'infiltrado_linfocitario_quanto', label: 'AP: Infiltrado Quanto (%)', span: 2, showIf: { field: 'infiltrado_linfocitario', value: true } }, { name: 'margens', label: 'AP: Margens', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'livres', label: 'Livres' }, { value: 'comprometidas', label: 'Comprometidas' }] }, { name: 'margens_comprometidas_dimensao', label: 'AP: Dimensão Comprometida', span: 2, showIf: { field: 'margens', value: 'comprometidas' } }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ];
    const camposAxila = [ { name: 'data', label: 'Data', type: 'date', span: 3 }, { name: 'tecnica', label: 'Técnica', span: 3 }, { name: 'tipo_histologico', label: 'AP: Tipo Histológico', span: 3 }, { name: 'subtipo_histologico', label: 'AP: Subtipo Histológico', span: 3 }, { name: 'n_linfonodos_excisados', label: 'AP: Linfonodos Excisados', type: 'number', span: 3 }, { name: 'n_linfonodos_comprometidos', label: 'AP: Linfonodos Comprometidos', type: 'number', span: 3 }, { name: 'invasao_extranodal', label: 'AP: Invasão Extranodal', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'invasao_extranodal_dimensao', label: 'AP: Dimensão da Invasão', span: 2, showIf: { field: 'invasao_extranodal', value: true } }, { name: 'imunohistoquimica', label: 'AP: Imunohistoquímica', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'imunohistoquimica_resultado', label: 'AP: Resultado Imuno', span: 6, showIf: { field: 'imunohistoquimica', value: true } }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ];
    const camposReconstrucao = [ { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'imediata', label: 'Imediata' }, { value: 'tardia', label: 'Tardia' }] }, { name: 'data', label: 'Data', type: 'date', span: 2 }, { name: 'tecnica', label: 'Técnica', span: 2 }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ];

    useEffect(() => {
        // Se há dados iniciais (edição), preenche o estado
        if (initialData && initialData.data) {
            setProcedimentoData({
                ...initialData.data,
                tipo_procedimento: initialData.type // Garante que o tipo esteja no estado
            });
        } else {
            // Limpa o estado ao abrir para um novo registro
            setProcedimentoData({
                contexto_cirurgico: '',
                tipo_procedimento: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setProcedimentoData(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = () => {
        if (!procedimentoData.tipo_procedimento) {
            alert('Por favor, selecione um tipo de procedimento.');
            return;
        }
        // Envia o objeto completo de volta
        onSubmit(procedimentoData);
        onClose();
    };

    if (!isOpen) return null;

    const renderFields = () => {
        switch (procedimentoData.tipo_procedimento) {
            case 'mamas':
                return <FormFields fields={camposMama} data={procedimentoData} handleChange={handleChange} />;
            case 'axilas':
                return <FormFields fields={camposAxila} data={procedimentoData} handleChange={handleChange} />;
            case 'reconstrucoes':
                return <FormFields fields={camposReconstrucao} data={procedimentoData} handleChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    {initialData ? 'Editar Procedimento Cirúrgico' : 'Adicionar Procedimento Cirúrgico'}
                    <button onClick={onClose}><FaTimes /></button>
                </ModalHeader>
                <ModalBody>
                    <FormGrid>
                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Contexto da Cirurgia</InputLabel>
                            <StyledSelect
                                name="contexto_cirurgico"
                                value={procedimentoData.contexto_cirurgico || ''}
                                onChange={handleChange}
                            >
                                <option value="">Não se aplica</option>
                                <option value="upfront">Upfront</option>
                                <option value="pos_neoadjuvante">Pós Tratamento Neoadjuvante</option>
                            </StyledSelect>
                        </FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}>
                            <InputLabel>Tipo de Procedimento</InputLabel>
                            <StyledSelect
                                name="tipo_procedimento"
                                value={procedimentoData.tipo_procedimento || ''}
                                onChange={handleChange}
                                disabled={!!initialData} // Desabilita se estiver editando para evitar mover entre listas
                            >
                                <option value="">Selecione...</option>
                                <option value="mamas">Cirurgia da Mama</option>
                                <option value="axilas">Cirurgia da Axila</option>
                                <option value="reconstrucoes">Reconstrução Mamária</option>
                            </StyledSelect>
                        </FieldContainer>
                    </FormGrid>
                    {renderFields()}
                </ModalBody>
                <ModalFooter>
                    <CancelButton type="button" onClick={onClose}><FaTimes /> Cancelar</CancelButton>
                    <AddButton type="button" onClick={handleSave}><FaSave /> Salvar</AddButton>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CirurgiaModal;