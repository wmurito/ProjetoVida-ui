import styled from 'styled-components';

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

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: min(90vw, 800px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.header`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
    &:hover {
      color: #333;
    }
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
`;

export const ModalFooter = styled.footer`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

// CORREÇÃO: O caminho do import foi ajustado de '../../../' para '../../'
export { FormGrid, FieldContainer, InputLabel, StyledInput, StyledSelect, CheckboxLabel, StyledCheckbox } from '../../pages/Cadastro/styles';

const BaseButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.2s ease-in-out;
`;

export const AddButton = styled(BaseButton)`
    background-color: #ff7bac;
    color: white;

    &:hover {
        background-color: #ff6ba0;
    }
`;

export const CancelButton = styled(BaseButton)`
    background-color: #6c757d;
    color: white;

    &:hover {
        background-color: #5a6268;
    }
`;