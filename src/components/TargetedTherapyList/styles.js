import styled from 'styled-components';

export const ListContainer = styled.div`
    width: 100%;
    margin-top: 15px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 10px;
    background-color: #f8f9fa;
`;

export const ListItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 10px;
    border-bottom: 1px solid #e9ecef;

    &:last-child {
        border-bottom: none;
    }
`;

export const ListItemText = styled.div`
    font-size: 0.9rem;
    color: #495057;
    line-height: 1.5;

    strong {
        color: #212529;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
`;

// Estilo base para os botões, para evitar repetição
const Button = styled.button`
    padding: 5px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: background-color 0.2s, transform 0.1s;

    &:hover {
        opacity: 0.9;
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const EditButton = styled(Button)`
    background-color: #ffc107; // Amarelo
    color: #212529;
`;

export const RemoveButton = styled(Button)`
    background-color: #ff7bac; // Rosa
    color: white;
`;