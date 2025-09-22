import styled from 'styled-components';

export const ListContainer = styled.div`
  margin-top: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fdfdfd;
`;

export const ListHeader = styled.div`
  padding: 0.75rem 1rem;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
`;

export const ListTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: 600;
`;

export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Alinha no topo para o botão de remover ficar alinhado */
  padding: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

export const ListItemContent = styled.div`
  flex-grow: 1;
`;

export const ListItemActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-left: 1rem; /* Espaçamento entre os dados e os botões */
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 1.1rem;
  padding: 0.2rem;

  &:hover {
    color: #007bff;
  }
`;

export const EmptyMessage = styled.p`
    text-align: center;
    padding: 2rem;
    color: #888;
`;

// --- NOVOS ESTILOS PARA EXIBIR TODOS OS DADOS ---
export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.5rem 1.5rem; /* Espaçamento vertical e horizontal */
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;

  strong {
    font-weight: 500;
    color: #444;
    margin-bottom: 2px;
  }

  span {
    color: #666;
  }
`;