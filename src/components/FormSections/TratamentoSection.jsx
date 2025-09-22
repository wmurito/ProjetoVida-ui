import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import {
    Section, FormGrid, FieldContainer, InputLabel, StyledInput, StyledSelect,
    CheckboxLabel, StyledCheckbox, SectionTitle,
    ListContainer, ActionButtons, RemoveButton,
    SubSectionTitle, SubSectionHeader, AddSubButton
} from '../../pages/Cadastro/styles';

import CirurgiaList from '../CirurgiaList';

// =================================================================================================
// FUNÇÃO AUXILIAR PARA NAVEGAR E ATUALIZAR ESTADO ANINHADO DE FORMA SEGURA
// =================================================================================================
const getNestedStateRef = (state, path) => {
    const pathKeys = path.split('.');
    let current = state;
    pathKeys.forEach(key => {
        if (current) {
            current = current[key];
        }
    });
    return current;
};


// =================================================================================================
// COMPONENTE GENÉRICO: TratamentoEmLista (Para listas que não usam modal)
// =================================================================================================
const TratamentoEmLista = ({ lista, path, setFormData, campos, title = "Adicionar Novo" }) => {
    const addTratamento = () => {
        const novoItem = campos.reduce((acc, campo) => ({ ...acc, [campo.name]: campo.initialValue || '' }), {});
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            const listRef = getNestedStateRef(newState, path);
            if (Array.isArray(listRef)) {
                listRef.push(novoItem);
            }
            return newState;
        });
    };

    const removeTratamento = (indexToRemove) => {
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            const listRef = getNestedStateRef(newState, path);
            if (Array.isArray(listRef)) {
                listRef.splice(indexToRemove, 1);
            }
            return newState;
        });
    };

    const handleTratamentoChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            const listRef = getNestedStateRef(newState, path);
            if (Array.isArray(listRef) && listRef[index]) {
                listRef[index][name] = val;
            }
            return newState;
        });
    };

    return (
        <>
            {lista && lista.map((item, index) => (
                <ListContainer key={index}>
                    <ActionButtons>
                        <RemoveButton type="button" onClick={() => removeTratamento(index)} title="Remover este item"><FaTrash /></RemoveButton>
                    </ActionButtons>
                    <FormGrid>
                        {campos.map(campo => {
                            if (campo.showIf && item[campo.showIf.field] !== campo.showIf.value) return null;
                            return (
                                <FieldContainer key={campo.name} style={{ gridColumn: `span ${campo.span || 2}` }}>
                                    <InputLabel>{campo.label}</InputLabel>
                                    {campo.type === 'select' ? (<StyledSelect name={campo.name} value={item[campo.name] || ''} onChange={e => handleTratamentoChange(e, index)}>{campo.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</StyledSelect>) : campo.type === 'checkbox' ? (<CheckboxLabel><StyledCheckbox type="checkbox" name={campo.name} checked={!!item[campo.name]} onChange={e => handleTratamentoChange(e, index)} /> {campo.checkboxLabel || ''}</CheckboxLabel>) : (<StyledInput type={campo.type || 'text'} name={campo.name} value={item[campo.name] || ''} onChange={e => handleTratamentoChange(e, index)} />)}
                                </FieldContainer>
                            );
                        })}
                    </FormGrid>
                </ListContainer>
            ))}
            <AddSubButton type="button" onClick={addTratamento}><FaPlus size={10} /> {title}</AddSubButton>
        </>
    );
};


// =================================================================================================
// COMPONENTE GENÉRICO: TerapiaSection (Para Quimio, Radio, etc.)
// =================================================================================================
const TerapiaSection = ({ sectionTitle, formData, setFormData, basePath, paliativaCampos, paliativaListTitle }) => {
    const handleTerapiaChange = (e, tipo) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            const sectionRef = getNestedStateRef(newState, basePath);
            if (sectionRef && sectionRef[tipo]) { sectionRef[tipo][name] = value; }
            return newState;
        });
    };

    const getTerapiaData = (tipo) => getNestedStateRef(formData, `${basePath}.${tipo}`) || {};
    const neoadjuvanteData = getTerapiaData('neoadjuvante');
    const adjuvanteData = getTerapiaData('adjuvante');
    const paliativaData = getNestedStateRef(formData, `${basePath}.paliativa`) || [];
    const camposPadrao = [ { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 }, { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 }, { name: 'esquema', label: 'Esquema', span: 2 }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ];
    
    return (
        <Section>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <SubSectionHeader><SubSectionTitle>{sectionTitle} Neoadjuvante</SubSectionTitle></SubSectionHeader>
            <FormGrid>{camposPadrao.map(campo => (<FieldContainer key={`neo-${campo.name}`} style={{ gridColumn: `span ${campo.span || 2}` }}><InputLabel>{campo.label}</InputLabel><StyledInput type={campo.type || 'text'} name={campo.name} value={neoadjuvanteData[campo.name] || ''} onChange={(e) => handleTerapiaChange(e, 'neoadjuvante')} /></FieldContainer>))}</FormGrid>
            <SubSectionHeader style={{ marginTop: '2rem' }}><SubSectionTitle>{sectionTitle} Adjuvante</SubSectionTitle></SubSectionHeader>
            <FormGrid>{camposPadrao.map(campo => (<FieldContainer key={`adj-${campo.name}`} style={{ gridColumn: `span ${campo.span || 2}` }}><InputLabel>{campo.label}</InputLabel><StyledInput type={campo.type || 'text'} name={campo.name} value={adjuvanteData[campo.name] || ''} onChange={(e) => handleTerapiaChange(e, 'adjuvante')} /></FieldContainer>))}</FormGrid>
            <SubSectionHeader style={{ marginTop: '2rem' }}><SubSectionTitle>{sectionTitle} Paliativa</SubSectionTitle></SubSectionHeader>
            <TratamentoEmLista lista={paliativaData} path={`${basePath}.paliativa`} setFormData={setFormData} campos={paliativaCampos} title={paliativaListTitle} />
        </Section>
    );
};


// =================================================================================================
// COMPONENTE PRINCIPAL: TratamentoSection
// =================================================================================================
const TratamentoSection = ({ formData, setFormData, onOpenModal, onRemoveCirurgia }) => {
    
    const handleSimpleChange = (e, sectionPath) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            const sectionRef = getNestedStateRef(newState, sectionPath);
            if (sectionRef) {
                sectionRef[name] = val;
            }
            return newState;
        });
    };

    const handleEditCirurgia = (cirurgiaData, type, index) => {
        onOpenModal('Cirurgia', { data: cirurgiaData, type: type }, index);
    };

    return (
        <>
            {/* ======================= CIRURGIA ======================= */}
            <Section>
                <SectionTitle>Cirurgia</SectionTitle>
                <SubSectionHeader>
                    <SubSectionTitle>Procedimentos Cirúrgicos</SubSectionTitle>
                </SubSectionHeader>
                <CirurgiaList
                    formData={formData}
                    onEdit={handleEditCirurgia}
                    onRemove={onRemoveCirurgia}
                />
                <AddSubButton type="button" onClick={() => onOpenModal('Cirurgia')}>
                    <FaPlus size={10} />
                    Adicionar Procedimento Cirúrgico
                </AddSubButton>
            </Section>

            {/* ======================= TERAPIAS ======================= */}
            <TerapiaSection sectionTitle="Quimioterapia" formData={formData} setFormData={setFormData} basePath="tratamento.quimioterapia" paliativaListTitle="Adicionar Esquema Paliativo" paliativaCampos={[ { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 }, { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 }, { name: 'esquema', label: 'Esquema', span: 2 }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ]} />
            <TerapiaSection sectionTitle="Radioterapia" formData={formData} setFormData={setFormData} basePath="tratamento.radioterapia" paliativaListTitle="Adicionar Sítio Paliativo" paliativaCampos={[ { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 }, { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 }, { name: 'sitio', label: 'Sítio da Radioterapia', span: 2 }, { name: 'esquema', label: 'Esquema', span: 6 }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ]} />
            <TerapiaSection sectionTitle="Endocrinoterapia" formData={formData} setFormData={setFormData} basePath="tratamento.endocrinoterapia" paliativaListTitle="Adicionar Esquema Paliativo" paliativaCampos={[ { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 }, { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 }, { name: 'esquema', label: 'Esquema', span: 2 }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ]} />
            <TerapiaSection sectionTitle="Imunoterapia" formData={formData} setFormData={setFormData} basePath="tratamento.imunoterapia" paliativaListTitle="Adicionar Esquema Paliativo" paliativaCampos={[ { name: 'data_inicio', label: 'Data Início', type: 'date', span: 2 }, { name: 'data_termino', label: 'Data Término', type: 'date', span: 2 }, { name: 'esquema', label: 'Esquema', span: 2 }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 }, ]} />
            
            {/* ======================= IMUNOHISTOQUÍMICA ======================= */}
            <Section>
                <SectionTitle>Imunohistoquímica</SectionTitle>
                <TratamentoEmLista lista={formData.tratamento.imunohistoquimicas} path="tratamento.imunohistoquimicas" setFormData={setFormData} title="Adicionar Imunohistoquímica" campos={[ { name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'diagnostica', label: 'Diagnóstica' }, { value: 'prognostica', label: 'Prognóstica' }] }, { name: 'especime', label: 'Espécime', span: 2 }, { name: 'data_realizacao', label: 'Data Realização', type: 'date', span: 2 }, { name: 're', label: 'RE', span: 1 }, { name: 'rp', label: 'RP', span: 1 }, { name: 'ki67', label: 'Ki67', span: 1 }, { name: 'her2', label: 'Her2', span: 1 }, { name: 'fish', label: 'FISH', span: 2 }, { name: 'outras_informacoes', label: 'Outras Informações', span: 6 }, ]} />
            </Section>

            {/* ======================= CORE BIOPSY ======================= */}
            <Section>
                <SectionTitle>Core Biopsy</SectionTitle>
                <FormGrid>
                    <FieldContainer style={{ gridColumn: 'span 6' }}>
                        <CheckboxLabel>
                            <StyledCheckbox type="checkbox" name="realizada" checked={!!formData.tratamento.core_biopsy?.realizada} onChange={(e) => handleSimpleChange(e, 'tratamento.core_biopsy')} /> Core Biopsy Realizada?
                        </CheckboxLabel>
                    </FieldContainer>
                </FormGrid>
                {formData.tratamento.core_biopsy?.realizada && (
                    <FormGrid style={{ marginTop: '1.5rem' }}>
                        <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Data</InputLabel><StyledInput type="date" name="data" value={formData.tratamento.core_biopsy.data || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.core_biopsy')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel>Espécime</InputLabel><StyledInput name="especime" value={formData.tratamento.core_biopsy.especime || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.core_biopsy')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Técnica</InputLabel><StyledSelect name="tecnica" value={formData.tratamento.core_biopsy.tecnica || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.core_biopsy')}><option value="">Selecione...</option><option value="mao_livre">Mão Livre</option><option value="guiada_usg">Guiada por USG</option><option value="guiada_mmg">Guiada por MMG</option><option value="guiada_rm">Guiada por RM</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo de Lesão</InputLabel><StyledSelect name="tipo_lesao" value={formData.tratamento.core_biopsy.tipo_lesao || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.core_biopsy')}><option value="">Selecione...</option><option value="nodulo">Nódulo</option><option value="lesao_nao_nodular">Lesão não nodular</option><option value="assimetria">Assimetria</option><option value="calcificacao">Calcificação</option><option value="realce_suspeito">Realce Suspeito</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Anatomopatológico</InputLabel><StyledSelect name="anatomopatologico" value={formData.tratamento.core_biopsy.anatomopatologico || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.core_biopsy')}><option value="">Selecione...</option><option value="ausencia_malignidade">Ausência de Malignidade</option><option value="malignidade">Malignidade</option></StyledSelect></FieldContainer>
                        {formData.tratamento.core_biopsy.anatomopatologico === 'malignidade' && <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo Histológico</InputLabel><StyledInput name="tipo_histologico" value={formData.tratamento.core_biopsy.tipo_histologico || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.core_biopsy')} /></FieldContainer>}
                    </FormGrid>
                )}
            </Section>
            
            {/* ======================= MAMOTOMIA ======================= */}
            <Section>
                <SectionTitle>Mamotomia</SectionTitle>
                <FormGrid>
                    <FieldContainer style={{ gridColumn: 'span 6' }}>
                        <CheckboxLabel>
                            <StyledCheckbox type="checkbox" name="realizada" checked={!!formData.tratamento.mamotomia?.realizada} onChange={(e) => handleSimpleChange(e, 'tratamento.mamotomia')} /> Mamotomia Realizada?
                        </CheckboxLabel>
                    </FieldContainer>
                </FormGrid>
                {formData.tratamento.mamotomia?.realizada && (
                    <FormGrid style={{ marginTop: '1.5rem' }}>
                        <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Data</InputLabel><StyledInput type="date" name="data" value={formData.tratamento.mamotomia.data || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.mamotomia')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel>Espécime</InputLabel><StyledInput name="especime" value={formData.tratamento.mamotomia.especime || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.mamotomia')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Técnica</InputLabel><StyledSelect name="tecnica" value={formData.tratamento.mamotomia.tecnica || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.mamotomia')}><option value="">Selecione...</option><option value="guiada_usg">Guiada por USG</option><option value="guiada_mmg">Guiada por MMG</option><option value="guiada_rm">Guiada por RM</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo de Lesão</InputLabel><StyledSelect name="tipo_lesao" value={formData.tratamento.mamotomia.tipo_lesao || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.mamotomia')}><option value="">Selecione...</option><option value="nodulo">Nódulo</option><option value="lesao_nao_nodular">Lesão não nodular</option><option value="assimetria">Assimetria</option><option value="calcificacao">Calcificação</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Anatomopatológico</InputLabel><StyledSelect name="anatomopatologico" value={formData.tratamento.mamotomia.anatomopatologico || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.mamotomia')}><option value="">Selecione...</option><option value="ausencia_malignidade">Ausência de Malignidade</option><option value="malignidade">Malignidade</option></StyledSelect></FieldContainer>
                        {formData.tratamento.mamotomia.anatomopatologico === 'malignidade' && <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Tipo Histológico</InputLabel><StyledInput name="tipo_histologico" value={formData.tratamento.mamotomia.tipo_histologico || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.mamotomia')} /></FieldContainer>}
                    </FormGrid>
                )}
            </Section>

            {/* ======================= PAAF ======================= */}
            <Section>
                <SectionTitle>PAAF</SectionTitle>
                <FormGrid>
                    <FieldContainer style={{ gridColumn: 'span 6' }}>
                        <CheckboxLabel>
                            <StyledCheckbox type="checkbox" name="realizada" checked={!!formData.tratamento.paaf?.realizada} onChange={(e) => handleSimpleChange(e, 'tratamento.paaf')} /> PAAF Realizada?
                        </CheckboxLabel>
                    </FieldContainer>
                </FormGrid>
                {formData.tratamento.paaf?.realizada && (
                    <FormGrid style={{ marginTop: '1.5rem' }}>
                        <FieldContainer style={{ gridColumn: 'span 2' }}><InputLabel>Data</InputLabel><StyledInput type="date" name="data" value={formData.tratamento.paaf.data || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.paaf')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 4' }}><InputLabel>Espécime</InputLabel><StyledInput name="especime" value={formData.tratamento.paaf.especime || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.paaf')} /></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Técnica</InputLabel><StyledSelect name="tecnica" value={formData.tratamento.paaf.tecnica || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.paaf')}><option value="">Selecione...</option><option value="mao_livre">Mão Livre</option><option value="guiada_usg">Guiada por USG</option><option value="guiada_rnm">Guiada por RNM</option></StyledSelect></FieldContainer>
                        <FieldContainer style={{ gridColumn: 'span 3' }}><InputLabel>Citologia Oncótica (Achados)</InputLabel><StyledInput name="achados" value={formData.tratamento.paaf.achados || ''} onChange={(e) => handleSimpleChange(e, 'tratamento.paaf')} /></FieldContainer>
                    </FormGrid>
                )}
            </Section>
        </>
    );
};

export default TratamentoSection;