// src/pages/ListaPacientes/StyledListaPacientes.js (ou onde você colocar seus estilos)
import styled from 'styled-components';

export const Container = styled.div`
    padding: 2rem;
    background-color: #f5f7fa; /* Um cinza claro para o fundo */
    min-height: 100vh;
`;

export const TableWrapper = styled.div`
    background: white;
    border-radius: 12px; /* Bordas mais arredondadas */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08); /* Sombra um pouco mais pronunciada */
    padding: 2rem;
    margin: 0 auto; /* Centraliza se houver um max-width */
    max-width: 1200px; /* Limita a largura para melhor leitura em telas grandes */
`;

export const TableTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem; /* Mais espaço abaixo do título */
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9ecef;
`;

export const Title = styled.h1`
    font-size: 1.75rem; /* Título um pouco maior */
    color: #2c3e50; /* Azul escuro */
    margin: 0;
    font-weight: 600;
`;

export const Search = styled.div` // Reutilizado para botões de ação principais
    display: flex;
    gap: 1rem;
`;

// Se você quiser usar os estilos de input fornecidos:
export const SearchBox = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
`;

export const InputGroup = styled.div`
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 0.5rem;
    transition: all 0.3s ease;
    flex-grow: 1; /* Para ocupar o espaço disponível */

    &:hover, &:focus-within {
        border-color: #d94c77; /* Cor de destaque rosa */
        box-shadow: 0 0 0 2px rgba(217, 76, 119, 0.2);
    }
`;

export const InputGroupAddon = styled.span`
    padding: 0 0.75rem; /* Mais padding */
    color: #6c757d; /* Cinza mais escuro para ícone */
    display: flex;
    align-items: center;
`;

export const Input = styled.input`
    border: none;
    outline: none;
    padding: 0.6rem; /* Mais padding interno */
    font-size: 1rem;
    width: 100%;
    background: transparent;

    &::placeholder {
        color: #adb5bd; /* Placeholder mais claro */
    }
`;


export const TableContainer = styled.div`
    overflow-x: auto; /* Permite scroll horizontal se a tabela for muito larga */
    margin-top: 1.5rem;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    font-size: 0.95rem; /* Tamanho de fonte base para a tabela */
`;

export const Th = styled.th`
    padding: 1rem 1.25rem; /* Mais padding */
    text-align: left;
    background-color: #f8f9fa; /* Fundo do header da tabela */
    color: #343a40; /* Cor do texto do header */
    font-weight: 600; /* Negrito */
    border-bottom: 2px solid #dee2e6; /* Borda inferior mais grossa */
    text-transform: uppercase; /* Opcional: letras maiúsculas */
    font-size: 0.85rem; /* Tamanho de fonte menor para header */
    letter-spacing: 0.05em; /* Espaçamento entre letras */
`;

export const Td = styled.td`
    padding: 1rem 1.25rem; /* Consistente com Th */
    border-bottom: 1px solid #e9ecef; /* Linha separadora mais sutil */
    color: #495057; /* Cor do texto das células */
    vertical-align: middle; /* Alinha o conteúdo verticalmente */
`;

export const ActionIcons = styled.div`
    display: flex;
    gap: 0.75rem; /* Espaço entre ícones */
    
    button {
        background: none;
        border: none;
        color: #6c757d; /* Cor padrão dos ícones */
        cursor: pointer;
        padding: 0.3rem; /* Área de clique maior */
        border-radius: 4px; /* Leve arredondamento */
        transition: all 0.2s ease-in-out;
        display: inline-flex; /* Para alinhar ícones SVG corretamente */
        align-items: center;
        justify-content: center;

        &:hover {
            color: #d94c77; /* Cor de destaque no hover */
            background-color: #f8f0f3; /* Fundo sutil no hover */
        }
    }
`;
// Componente Botão Estilizado (pode ser movido para um arquivo de componentes comuns)
export const StyledButton = styled.button`
  background-color: #d94c77; /* Cor primária */
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c73a65; /* Cor primária mais escura */
  }

  &.secondary {
    background-color: #6c757d;
    &:hover {
      background-color: #5a6268;
    }
  }
  
  &.danger {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
`;

// Outros estilos que você forneceu (Filters, Tooltip) podem ser adicionados aqui se usados.