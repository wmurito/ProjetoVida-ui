import styled from 'styled-components';

// Fundo escuro que cobre a tela inteira
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// O container branco do modal
export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: min(90vw, 500px);
`;

// Cabeçalho do modal (título e botão de fechar)
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
  margin-bottom: 15px;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

// Botão de fechar (o "X")
export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #888;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #000;
  }
`;

// Corpo do modal, onde ficam os campos do formulário
export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Rodapé do modal (botão de salvar)
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
  margin-top: 20px;
`;

// Grupo de um Label + Input
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

// Etiqueta do campo (ex: "Qual Terapia Alvo?")
export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

// Campo de texto/data
export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

// Botão de Salvar
export const SaveButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff; // Azul
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;