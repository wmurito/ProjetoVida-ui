import React from 'react';
import { ListContainer, ListItem, ListItemText, ActionButtons, EditButton, RemoveButton } from './styles'; // Reutilize os estilos da TargetedTherapyList

const MetastaseList = ({ metastases, onEdit, onRemove }) => {
    if (!metastases || metastases.length === 0) {
        return <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '10px' }}>Nenhuma metástase adicionada.</p>;
    }

    return (
        <ListContainer>
            {metastases.map((meta, index) => (
                <ListItem key={index}>
                    <ListItemText>
                        <strong>Local:</strong> {meta.local_metastase || 'Não informado'} <br />
                        <strong>Data:</strong> {meta.data_metastase ? new Date(meta.data_metastase + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}
                    </ListItemText>
                    <ActionButtons>
                        <EditButton onClick={() => onEdit(meta, index)}>Editar</EditButton>
                        <RemoveButton onClick={() => onRemove(index)}>Remover</RemoveButton>
                    </ActionButtons>
                </ListItem>
            ))}
        </ListContainer>
    );
};

export default MetastaseList;