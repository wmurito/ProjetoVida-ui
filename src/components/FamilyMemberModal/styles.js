import styled, { css } from 'styled-components';

// --- Cores ---
const primaryPink = '#e91e63';
const lightPink = '#fce4ec';
const textDark = '#333';
const textLight = '#666';
const borderColor = '#ddd';
const dangerRed = '#f44336';
const successGreen = '#4CAF50';
const greyButton = '#9e9e9e';

// --- Modal Base ---
export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
  backdrop-filter: blur(3px);
`;

export const ModalContent = styled.div`
  background: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid ${borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 { margin: 0; font-size: 1.5rem; color: ${textDark}; }
`;

export const CloseButton = styled.button`
  background: none; border: none; font-size: 2.5rem;
  cursor: pointer; color: ${textLight};
  transition: all 0.2s;
  &:hover { color: ${primaryPink}; transform: rotate(90deg); }
`;

export const ModalBody = styled.div`
  padding: 30px;
  overflow-y: auto;
  flex-grow: 1;
`;

export const ModalFooter = styled.div`
  display: flex; justify-content: flex-end; gap: 15px;
  padding: 20px 30px; border-top: 1px solid ${borderColor};
  background: #fff;
`;

// --- Grade de Parentes ---
export const RelativeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
`;

export const RelativeCard = styled.div`
  border: 2px solid ${borderColor};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);

  ${({ $isSelected }) => $isSelected && css`
    border-color: ${primaryPink};
    box-shadow: 0 4px 15px rgba(233, 30, 99, 0.2);
    transform: translateY(-5px);
  `}
`;

export const RelativeName = styled.h3`
  margin: 0;
  padding: 15px;
  font-size: 1.1rem;
  text-align: center;
  background-color: #f7f7f7;
  color: ${textDark};
  transition: all 0.3s ease;
  font-weight: 600;

  ${RelativeCard}:hover & {
    background-color: ${lightPink};
    color: ${primaryPink};
  }

  ${({ $isSelected }) => $isSelected && css`
    background-color: ${primaryPink};
    color: white;
  `}
`;

// --- Seção do Formulário dentro do Card ---
export const FormSection = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: default;
`;

export const InputGroup = styled.div``;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${props => props.$pinkTheme ? primaryPink : textDark};
  font-size: 0.9rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.$hasError ? dangerRed : borderColor};
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus {
    border-color: ${primaryPink};
    outline: none;
    box-shadow: 0 0 0 2px ${lightPink};
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

export const RadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  input { 
    margin-right: 6px; 
    accent-color: ${primaryPink};
  }
`;

export const ErrorText = styled.p`
  color: ${dangerRed};
  font-size: 0.8rem;
  margin: 5px 0 0;
`;

// --- Botões do Footer ---
const Button = styled.button`
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);

  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

export const SaveButton = styled(Button)`
  background-color: ${successGreen};
  color: white;
  &:hover { background-color: #45a049; }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const CancelButton = styled(Button)`
  background-color: ${greyButton};
  color: white;
  &:hover { background-color: #8e8e8e; }
`;

export const AddButton = styled(Button)`
  background-color: ${successGreen};
  color: white;
  &:hover { background-color: #45a049; }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Form components
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputLabel = styled.label`
  margin-bottom: 5px;
  font-weight: 600;
  color: ${textDark};
  font-size: 0.9rem;
`;

export const StyledInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${borderColor};
  border-radius: 4px;
  font-size: 0.9rem;
  &:focus {
    border-color: ${primaryPink};
    outline: none;
    box-shadow: 0 0 0 2px ${lightPink};
  }
`;

export const StyledSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${borderColor};
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  &:focus {
    border-color: ${primaryPink};
    outline: none;
    box-shadow: 0 0 0 2px ${lightPink};
  }
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;