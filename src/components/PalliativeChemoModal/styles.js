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
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 15px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;

  &:hover {
    color: #000;
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
  margin-top: 25px;
  gap: 10px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

export const Button = styled.button`
    padding: 10px 25px;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
`;

export const SaveButton = styled(Button)`
  background-color: #28a745; // Verde

  &:hover {
    background-color: #218838;
  }
`;

export const CancelButton = styled(Button)`
  background-color: #6c757d; // Cinza

  &:hover {
    background-color: #5a6268;
  }
`;