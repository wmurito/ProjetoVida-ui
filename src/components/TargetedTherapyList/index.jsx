import React from 'react';
// Supondo que seus estilos estejam em um arquivo 'styles.js' na mesma pasta.
// Se não estiverem, você pode usar os estilos que sugeri em respostas anteriores.
import { ListContainer, ListItem, ListItemText, ActionButtons, EditButton, RemoveButton } from './styles';

const TargetedTherapyList = ({ therapies, onEdit, onRemove }) => {
    if (!therapies || therapies.length === 0) {
        return <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '10px' }}>Nenhuma terapia alvo adicionada.</p>;
    }

    return (
        <ListContainer>
            {therapies.map((therapy, index) => (
                <ListItem key={index}>
                    <ListItemText>
                        <strong>Tipo:</strong> {therapy.qual_terapia_alvo || 'Não informado'} <br />
                        <strong>Início:</strong> {therapy.inicio_terapia_alvo ? new Date(therapy.inicio_terapia_alvo + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'} |
                        <strong> Fim:</strong> {therapy.fim_terapia_alvo ? new Date(therapy.fim_terapia_alvo + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}
                    </ListItemText>
                    <ActionButtons>
                        <EditButton onClick={() => onEdit(therapy, index)}>Editar</EditButton>
                        <RemoveButton onClick={() => onRemove(index)}>Remover</RemoveButton>
                    </ActionButtons>
                </ListItem>
            ))}
        </ListContainer>
    );
};

export default TargetedTherapyList;