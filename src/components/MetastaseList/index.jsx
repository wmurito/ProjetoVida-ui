import React from 'react';
import { ListContainer, ListItem, ListItemText, ActionButtons, EditButton, RemoveButton } from './styles'; // Reutilize os estilos da TargetedTherapyList

const MetastaseList = ({ metastases, onEdit, onRemove }) => {
    if (!metastases || metastases.length === 0) {
        return <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '10px' }}>Nenhuma metástase adicionada.</p>;
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr + 'T00:00:00');
            if (isNaN(date.getTime())) return 'Data inválida';
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return 'Data inválida';
        }
    };

    return (
        <ListContainer>
            {metastases.map((meta, index) => {
                if (!meta || typeof meta !== 'object') return null;
                return (
                    <ListItem key={index}>
                        <ListItemText>
                            <strong>Local:</strong> {meta.local_metastase || 'Não informado'} <br />
                            <strong>Data:</strong> {formatDate(meta.data_metastase)}
                        </ListItemText>
                        <ActionButtons>
                            <EditButton onClick={() => onEdit(meta, index)}>Editar</EditButton>
                            <RemoveButton onClick={() => onRemove(index)}>Remover</RemoveButton>
                        </ActionButtons>
                    </ListItem>
                );
            })}
        </ListContainer>
    );
};

export default MetastaseList;