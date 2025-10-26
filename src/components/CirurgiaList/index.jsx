import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
    ListContainer,
    ListItem,
    ListItemContent,
    ListItemActions,
    ListHeader,
    ListTitle,
    ActionButton,
    EmptyMessage,
    DetailsGrid,
    DetailItem
} from './styles';

// Função para formatar os nomes dos campos para exibição
const formatLabel = (key) => {
    const labels = {
        data: 'Data',
        tecnica: 'Técnica',
        ampliacao_margem: 'Ampliação de Margem',
        tipo_histologico: 'AP: Tipo Histológico',
        subtipo_histologico: 'AP: Subtipo Histológico',
        tamanho_tumor: 'AP: Tamanho do Tumor',
        grau_histologico: 'AP: Grau Histológico',
        invasao_angiolinfatica: 'AP: Invasão Angiolinfática',
        infiltrado_linfocitario: 'AP: Infiltrado Linfocitário',
        infiltrado_linfocitario_quanto: 'AP: Infiltrado Quanto (%)',
        margens: 'AP: Margens',
        margens_comprometidas_dimensao: 'AP: Dimensão Comprometida',
        intercorrencias: 'Intercorrências',
        n_linfonodos_excisados: 'AP: Linfonodos Excisados',
        n_linfonodos_comprometidos: 'AP: Linfonodos Comprometidos',
        invasao_extranodal: 'AP: Invasão Extranodal',
        invasao_extranodal_dimensao: 'AP: Dimensão da Invasão',
        imunohistoquimica: 'AP: Imunohistoquímica',
        imunohistoquimica_resultado: 'AP: Resultado Imuno',
        tipo: 'Tipo'
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const CirurgiaItem = ({ item, index, onEdit, onRemove, type }) => {
    return (
        <ListItem>
            <ListItemContent>
                <DetailsGrid>
                    {Object.entries(item).map(([key, value]) => {
                        // Não exibe campos vazios
                        if (value === '' || value === null || value === false) return null;
                        
                        return (
                            <DetailItem key={key}>
                                <strong>{formatLabel(key)}:</strong> 
                                <span>{typeof value === 'boolean' ? 'Sim' : value}</span>
                            </DetailItem>
                        );
                    })}
                </DetailsGrid>
            </ListItemContent>
            <ListItemActions>
                <ActionButton onClick={() => onEdit(item, type, index)} title="Editar">
                    <FaEdit />
                </ActionButton>
                <ActionButton onClick={() => onRemove(type, index)} title="Remover">
                    <FaTrash />
                </ActionButton>
            </ListItemActions>
        </ListItem>
    );
};


const CirurgiaList = ({ formData, onEdit, onRemove }) => {
    const { mamas = [], axilas = [], reconstrucoes = [] } = formData?.tratamento?.cirurgia || {};

    const hasCirurgias = mamas.length > 0 || axilas.length > 0 || reconstrucoes.length > 0;

    return (
        <ListContainer>
            {mamas.length > 0 && (
                <>
                    <ListHeader><ListTitle>Cirurgias da Mama</ListTitle></ListHeader>
                    {mamas.map((item, index) => <CirurgiaItem key={`mama-${index}`} item={item} index={index} onEdit={onEdit} onRemove={onRemove} type="mamas" />)}
                </>
            )}

            {axilas.length > 0 && (
                <>
                    <ListHeader><ListTitle>Cirurgias da Axila</ListTitle></ListHeader>
                    {axilas.map((item, index) => <CirurgiaItem key={`axila-${index}`} item={item} index={index} onEdit={onEdit} onRemove={onRemove} type="axilas" />)}
                </>
            )}

            {reconstrucoes.length > 0 && (
                <>
                    <ListHeader><ListTitle>Reconstruções Mamárias</ListTitle></ListHeader>
                    {reconstrucoes.map((item, index) => <CirurgiaItem key={`reconstrucao-${index}`} item={item} index={index} onEdit={onEdit} onRemove={onRemove} type="reconstrucoes" />)}
                </>
            )}
            
            {!hasCirurgias && (
                <EmptyMessage>Nenhum procedimento cirúrgico adicionado.</EmptyMessage>
            )}
        </ListContainer>
    );
};

export default CirurgiaList;