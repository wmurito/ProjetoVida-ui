import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import {
    Section, FormGrid, FieldContainer, InputLabel, StyledInput, StyledSelect,
    CheckboxLabel, StyledCheckbox, SectionTitle,
    AddMoreButton, ListContainer, ActionButtons, RemoveButton,
    SubSectionTitle, SubSectionHeader, AddSubButton
} from '../../pages/Cadastro/styles';

// Componente Genérico para seções que podem ter múltiplos registros
const TratamentoEmLista = ({ lista, path, setFormData, campos }) => {
    const addTratamento = () => {
        const novoItem = campos.reduce((acc, campo) => ({ ...acc, [campo.name]: campo.initialValue || '' }), {});
        setFormData(prev => {
            const pathKeys = path.split('.');
            const newState = { ...prev };
            let current = newState;
            pathKeys.forEach((key, index) => {
                if (index === pathKeys.length - 1) {
                    current[key] = [...(current[key] || []), novoItem];
                } else {
                    current = current[key];
                }
            });
            return newState;
        });
    };

    const removeTratamento = (indexToRemove) => {
        setFormData(prev => {
            const pathKeys = path.split('.');
            const newState = { ...prev };
            let current = newState;
            pathKeys.forEach((key, index) => {
                if (index === pathKeys.length - 1) {
                    current[key] = current[key].filter((_, i) => i !== indexToRemove);
                } else {
                    current = current[key];
                }
            });
            return newState;
        });
    };

    const handleTratamentoChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => {
            const pathKeys = path.split('.');
            const newState = { ...prev };
            let currentList = newState;
            pathKeys.forEach(key => {
                currentList = currentList[key];
            });
            const newList = [...currentList];
            newList[index] = { ...newList[index], [name]: val };

            let finalState = newState;
            let current = finalState;
            pathKeys.forEach((key, i) => {
                if (i === pathKeys.length - 1) {
                    current[key] = newList;
                } else {
                    current = current[key];
                }
            });
            return finalState;
        });
    };

    return (
        <>
            {lista && lista.map((item, index) => (
                <ListContainer key={index}>
                    <ActionButtons>
                        <RemoveButton type="button" onClick={() => removeTratamento(index)} title="Remover este item">
                            <FaTrash />
                        </RemoveButton>
                    </ActionButtons>
                    <FormGrid>
                        {campos.map(campo => {
                            if (campo.showIf && item[campo.showIf.field] !== campo.showIf.value) return null;
                            return (
                                <FieldContainer key={campo.name} style={{ gridColumn: `span ${campo.span || 2}` }}>
                                    <InputLabel>{campo.label}</InputLabel>
                                    {campo.type === 'select' ? (
                                        <StyledSelect name={campo.name} value={item[campo.name] || ''} onChange={e => handleTratamentoChange(e, index)}>
                                            {campo.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </StyledSelect>
                                    ) : campo.type === 'checkbox' ? (
                                        <CheckboxLabel><StyledCheckbox type="checkbox" name={campo.name} checked={!!item[campo.name]} onChange={e => handleTratamentoChange(e, index)} /> {campo.checkboxLabel || ''}</CheckboxLabel>
                                    ) : (
                                        <StyledInput type={campo.type || 'text'} name={campo.name} value={item[campo.name] || ''} onChange={e => handleTratamentoChange(e, index)} />
                                    )}
                                </FieldContainer>
                            );
                        })}
                    </FormGrid>
                </ListContainer>
            ))}
            <AddSubButton type="button" onClick={addTratamento}>
                <FaPlus size={10} />
                Adicionar Novo
            </AddSubButton>
        </>
    );
};


const TratamentoSection = ({ formData, setFormData }) => {
    const handleSimpleChange = (e, section) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            tratamento: { ...prev.tratamento, [section]: { ...prev.tratamento[section], [name]: val } }
        }));
    };

    return (
        <>
            <Section>
                <SectionTitle>Cirurgia</SectionTitle>

                <SubSectionHeader>
                    <SubSectionTitle>Cirurgia da Mama</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.cirurgia.mamas}
                    path="tratamento.cirurgia.mamas"
                    setFormData={setFormData}
                    campos={[
                        { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'upfront', label: 'Upfront' }, { value: 'pos_neoadjuvante', label: 'Pós Neoadjuvante' }] },
                        { name: 'data', label: 'Data', type: 'date', span: 2 },
                        { name: 'tecnica', label: 'Técnica', span: 2 },
                        { name: 'ampliacao_margem', label: 'Ampliação de Margem', type: 'checkbox', checkboxLabel: 'Sim', span: 2 },
                        { name: 'tipo_histologico', label: 'AP: Tipo Histológico', span: 2 },
                        { name: 'subtipo_histologico', label: 'AP: Subtipo Histológico', span: 2 },
                        { name: 'tamanho_tumor', label: 'AP: Tamanho do Tumor', span: 2 },
                        { name: 'grau_histologico', label: 'AP: Grau Histológico', span: 2 },
                        { name: 'invasao_angiolinfatica', label: 'AP: Invasão Angiolinfática', type: 'checkbox', checkboxLabel: 'Sim', span: 2 },
                        { name: 'infiltrado_linfocitario', label: 'AP: Infiltrado Linfocitário', type: 'checkbox', checkboxLabel: 'Sim', span: 2 },
                        { name: 'infiltrado_linfocitario_quanto', label: 'AP: Infiltrado Quanto (%)', span: 2, showIf: { field: 'infiltrado_linfocitario', value: true } },
                        { name: 'margens_livres', label: 'AP: Margens', type: 'select', span: 2, options: [{ value: true, label: 'Livres' }, { value: false, label: 'Comprometidas' }] },
                        { name: 'margens_comprometidas_dimensao', label: 'AP: Dimensão Comprometida', span: 2, showIf: { field: 'margens_livres', value: false } },
                        { name: 'intercorrencias', label: 'Intercorrências', span: 6 },
                    ]}
                />

                <SubSectionHeader>
                    <SubSectionTitle>Cirurgia da Axila</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.cirurgia.axilas}
                    path="tratamento.cirurgia.axilas"
                    setFormData={setFormData}
                    campos={[
                        { name: 'data', label: 'Data', type: 'date', span: 3 },
                        { name: 'tecnica', label: 'Técnica', span: 3 },
                        { name: 'tipo_histologico', label: 'AP: Tipo Histológico', span: 3 },
                        { name: 'subtipo_histologico', label: 'AP: Subtipo Histológico', span: 3 },
                        { name: 'n_linfonodos_excisados', label: 'AP: Linfonodos Excisados', type: 'number', span: 3 },
                        { name: 'n_linfonodos_comprometidos', label: 'AP: Linfonodos Comprometidos', type: 'number', span: 3 },
                        { name: 'invasao_extranodal', label: 'AP: Invasão Extranodal', type: 'checkbox', checkboxLabel: 'Sim', span: 2 },
                        { name: 'invasao_extranodal_dimensao', label: 'AP: Dimensão da Invasão', span: 2, showIf: { field: 'invasao_extranodal', value: true } },
                        { name: 'imunohistoquimica', label: 'AP: Imunohistoquímica', type: 'checkbox', checkboxLabel: 'Sim', span: 2 },
                        { name: 'imunohistoquimica_resultado', label: 'AP: Resultado Imuno', span: 6, showIf: { field: 'imunohistoquimica', value: true } },
                        { name: 'intercorrencias', label: 'Intercorrências', span: 6 },
                    ]}
                />

                <SubSectionHeader>
                    <SubSectionTitle>Reconstrução Mamária</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.cirurgia.reconstrucoes}
                    path="tratamento.cirurgia.reconstrucoes"
                    setFormData={setFormData}
                    campos={[
                        { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'imediata', label: 'Imediata' }, { value: 'tardia', label: 'Tardia' }] },
                        { name: 'data', label: 'Data', type: 'date', span: 2 },
                        { name: 'tecnica', label: 'Técnica', span: 2 },
                        { name: 'intercorrencias', label: 'Intercorrências', span: 6 },
                    ]}
                />
            </Section>

            <Section>
                <SectionTitle>Quimioterapia</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Quimioterapia</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.quimioterapias}
                    path="tratamento.quimioterapias"
                    setFormData={setFormData}
                    campos={[
                        { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'neoadjuvante', label: 'Neoadjuvante' }, { value: 'adjuvante', label: 'Adjuvante' }, { value: 'paliativa', label: 'Paliativa' }] },
                        { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 },
                        { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 },
                        { name: 'esquema', label: 'Esquema', span: 3 },
                        { name: 'intercorrencias', label: 'Intercorrências', span: 3 },
                    ]}
                />
            </Section>

            <Section>
                <SectionTitle>Radioterapia</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Radioterapia</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.radioterapias}
                    path="tratamento.radioterapias"
                    setFormData={setFormData}
                    campos={[
                        { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'neoadjuvante', label: 'Neoadjuvante' }, { value: 'adjuvante', label: 'Adjuvante' }, { value: 'paliativa', label: 'Paliativa' }] },
                        { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 },
                        { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 },
                        { name: 'sitio', label: 'Sítio da Radioterapia', span: 2, showIf: { field: 'tipo', value: 'paliativa' } },
                        { name: 'esquema', label: 'Esquema', span: 4 },
                        { name: 'intercorrencias', label: 'Intercorrências', span: 6 },
                    ]}
                />
            </Section>

            <Section>
                <SectionTitle>Endocrinoterapia</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Endocrinoterapia</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.endocrinoterapias}
                    path="tratamento.endocrinoterapias"
                    setFormData={setFormData}
                    campos={[
                        { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'neoadjuvante', label: 'Neoadjuvante' }, { value: 'adjuvante', label: 'Adjuvante' }, { value: 'paliativa', label: 'Paliativa' }] },
                        { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 },
                        { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 },
                        { name: 'esquema', label: 'Esquema', span: 3 },
                        { name: 'intercorrencias', label: 'Intercorrências', span: 3 },
                    ]}
                />
            </Section>

            <Section>
                <SectionTitle>Imunoterapia</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Imunoterapia</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.imunoterapias}
                    path="tratamento.imunoterapias"
                    setFormData={setFormData}
                    campos={[
                        { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'neoadjuvante', label: 'Neoadjuvante' }, { value: 'adjuvante', label: 'Adjuvante' }, { value: 'paliativa', label: 'Paliativa' }] },
                        { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 },
                        { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 },
                        { name: 'esquema', label: 'Esquema', span: 3 },
                        { name: 'intercorrencias', label: 'Intercorrências', span: 3 },
                    ]}
                />
            </Section>

            <Section>
                <SectionTitle>Imunohistoquímica</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Imunohistoquímica</SubSectionTitle>
                </SubSectionHeader>
                <TratamentoEmLista
                    lista={formData.tratamento.imunohistoquimicas}
                    path="tratamento.imunohistoquimicas"
                    setFormData={setFormData}
                    campos={[
                        { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'diagnostica', label: 'Diagnóstica' }, { value: 'prognostica', label: 'Prognóstica' }] },
                        { name: 'especime', label: 'Espécime', span: 2 },
                        { name: 'data_realizacao', label: 'Data Realização', type: 'date', span: 2 },
                        { name: 're', label: 'RE', span: 1 },
                        { name: 'rp', label: 'RP', span: 1 },
                        { name: 'ki67', label: 'Ki67', span: 1 },
                        { name: 'her2', label: 'Her2', span: 1 },
                        { name: 'fish', label: 'FISH', span: 2 },
                        { name: 'outras_informacoes', label: 'Outras Informações', span: 6 },
                    ]}
                />
            </Section>

            <Section>
                <SectionTitle>Core Biopsy</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Core Biopsy</SubSectionTitle>
                </SubSectionHeader>
                <FormGrid>
                    <FieldContainer style={{ gridColumn: 'span 6' }}>
                        <CheckboxLabel>
                            <StyledCheckbox type="checkbox" name="realizada" checked={formData.tratamento.core_biopsy.realizada} onChange={(e) => handleSimpleChange(e, 'core_biopsy')} />
                            Core Biopsy Realizada?
                        </CheckboxLabel>
                    </FieldContainer>
                </FormGrid>
                {formData.tratamento.core_biopsy.realizada && (
                    <FormGrid style={{ marginTop: '1.5rem' }}>
                        <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Data</InputLabel><StyledInput type="date" name="data" value={formData.tratamento.core_biopsy.data} onChange={(e) => handleSimpleChange(e, 'core_biopsy')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel>Espécime</InputLabel><StyledInput name="especime" value={formData.tratamento.core_biopsy.especime} onChange={(e) => handleSimpleChange(e, 'core_biopsy')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Técnica</InputLabel><StyledSelect name="tecnica" value={formData.tratamento.core_biopsy.tecnica} onChange={(e) => handleSimpleChange(e, 'core_biopsy')}><option value="">Selecione...</option><option value="mao_livre">Mão Livre</option><option value="guiada_usg">Guiada por USG</option><option value="guiada_mmg">Guiada por MMG</option><option value="guiada_rm">Guiada por RM</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo de Lesão</InputLabel><StyledSelect name="tipo_lesao" value={formData.tratamento.core_biopsy.tipo_lesao} onChange={(e) => handleSimpleChange(e, 'core_biopsy')}><option value="">Selecione...</option><option value="nodulo">Nódulo</option><option value="lesao_nao_nodular">Lesão não nodular</option><option value="assimetria">Assimetria</option><option value="calcificacao">Calcificação</option><option value="realce_suspeito">Realce Suspeito</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Anatomopatológico</InputLabel><StyledSelect name="anatomopatologico" value={formData.tratamento.core_biopsy.anatomopatologico} onChange={(e) => handleSimpleChange(e, 'core_biopsy')}><option value="">Selecione...</option><option value="ausencia_malignidade">Ausência de Malignidade</option><option value="malignidade">Malignidade</option></StyledSelect></FieldContainer>
                        {formData.tratamento.core_biopsy.anatomopatologico === 'malignidade' && <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo Histológico</InputLabel><StyledInput name="tipo_histologico" value={formData.tratamento.core_biopsy.tipo_histologico} onChange={(e) => handleSimpleChange(e, 'core_biopsy')} /></FieldContainer>}
                    </FormGrid>
                )}
            </Section>

            <Section>
                <SectionTitle>Mamotomia</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Mamotomia</SubSectionTitle>
                </SubSectionHeader>
                <FormGrid>
                    <FieldContainer style={{ gridColumn: 'span 6' }}>
                        <CheckboxLabel>
                            <StyledCheckbox type="checkbox" name="realizada" checked={formData.tratamento.mamotomia.realizada} onChange={(e) => handleSimpleChange(e, 'mamotomia')} />
                            Mamotomia Realizada?
                        </CheckboxLabel>
                    </FieldContainer>
                </FormGrid>
                {formData.tratamento.mamotomia.realizada && (
                    <FormGrid style={{ marginTop: '1.5rem' }}>
                        <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Data</InputLabel><StyledInput type="date" name="data" value={formData.tratamento.mamotomia.data} onChange={(e) => handleSimpleChange(e, 'mamotomia')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel>Espécime</InputLabel><StyledInput name="especime" value={formData.tratamento.mamotomia.especime} onChange={(e) => handleSimpleChange(e, 'mamotomia')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Técnica</InputLabel><StyledSelect name="tecnica" value={formData.tratamento.mamotomia.tecnica} onChange={(e) => handleSimpleChange(e, 'mamotomia')}><option value="">Selecione...</option><option value="guiada_usg">Guiada por USG</option><option value="guiada_mmg">Guiada por MMG</option><option value="guiada_rm">Guiada por RM</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo de Lesão</InputLabel><StyledSelect name="tipo_lesao" value={formData.tratamento.mamotomia.tipo_lesao} onChange={(e) => handleSimpleChange(e, 'mamotomia')}><option value="">Selecione...</option><option value="nodulo">Nódulo</option><option value="lesao_nao_nodular">Lesão não nodular</option><option value="assimetria">Assimetria</option><option value="calcificacao">Calcificação</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Anatomopatológico</InputLabel><StyledSelect name="anatomopatologico" value={formData.tratamento.mamotomia.anatomopatologico} onChange={(e) => handleSimpleChange(e, 'mamotomia')}><option value="">Selecione...</option><option value="ausencia_malignidade">Ausência de Malignidade</option><option value="malignidade">Malignidade</option></StyledSelect></FieldContainer>
                        {formData.tratamento.mamotomia.anatomopatologico === 'malignidade' && <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo Histológico</InputLabel><StyledInput name="tipo_histologico" value={formData.tratamento.mamotomia.tipo_histologico} onChange={(e) => handleSimpleChange(e, 'mamotomia')} /></FieldContainer>}
                    </FormGrid>
                )}
            </Section>

            <Section>
                <SectionTitle>PAAF</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>PAAF</SubSectionTitle>
                </SubSectionHeader>
                <FormGrid>
                    <FieldContainer style={{ gridColumn: 'span 6' }}>
                        <CheckboxLabel>
                            <StyledCheckbox type="checkbox" name="realizada" checked={formData.tratamento.paaf.realizada} onChange={(e) => handleSimpleChange(e, 'paaf')} />
                            PAAF Realizada?
                        </CheckboxLabel>
                    </FieldContainer>
                </FormGrid>
                {formData.tratamento.paaf.realizada && (
                    <FormGrid style={{ marginTop: '1.5rem' }}>
                        <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Data</InputLabel><StyledInput type="date" name="data" value={formData.tratamento.paaf.data} onChange={(e) => handleSimpleChange(e, 'paaf')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel>Espécime</InputLabel><StyledInput name="especime" value={formData.tratamento.paaf.especime} onChange={(e) => handleSimpleChange(e, 'paaf')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Técnica</InputLabel><StyledSelect name="tecnica" value={formData.tratamento.paaf.tecnica} onChange={(e) => handleSimpleChange(e, 'paaf')}><option value="">Selecione...</option><option value="mao_livre">Mão Livre</option><option value="guiada_usg">Guiada por USG</option><option value="guiada_rnm">Guiada por RNM</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Citologia Oncótica (Achados)</InputLabel><StyledInput name="achados" value={formData.tratamento.paaf.achados} onChange={(e) => handleSimpleChange(e, 'paaf')} /></FieldContainer>
                    </FormGrid>
                )}
            </Section>
        </>
    );
};

export default TratamentoSection;
