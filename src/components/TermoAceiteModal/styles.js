import styled from 'styled-components';

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000; // Z-index alto para ficar sobre tudo
`;

export const ModalContent = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: min(90vw, 600px);
    text-align: center;
`;

export const ModalHeader = styled.div`
    margin-bottom: 20px;
    h2 {
        margin: 0;
        color: #333;
    }
`;

export const ModalBody = styled.div`
    p {
        text-align: justify;
        color: #555;
        line-height: 1.6;
    }
`;

export const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 25px 0;
    font-size: 1.1rem;
    cursor: pointer;
    
    input {
        margin-right: 10px;
        transform: scale(1.3);
    }
`;

export const FileInput = styled.input`
    display: none; // O input real fica escondido
`;

export const FileInputLabel = styled.label`
    display: block;
    padding: 12px 20px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 15px;

    &:hover {
        border-color: #ff7bac;
        background-color: #fce4ec;
    }
`;

export const ErrorMessage = styled.p`
    color: #e53935;
    font-weight: 500;
    margin: 10px 0;
`;

// NOVO: Container para os botões
export const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 25px;
`;

// NOVO: Estilo para o botão de cancelar/voltar
export const CancelButton = styled.button`
    flex: 1; /* Ocupa metade do espaço */
    padding: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e0e0e0;
    }
`;

// AJUSTE: ContinueButton agora ocupa a outra metade
export const ContinueButton = styled.button`
    flex: 1;
    padding: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    background-color: #4CAF50;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #45a049;
    }

    &:disabled {
        background-color: #bdbdbd;
        cursor: not-allowed;
    }
`;

export const QRCodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    margin: 20px 0;
    border: 2px solid #e0e0e0;
`;

export const QRCodeTitle = styled.h3`
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1rem;
`;

export const UploadOption = styled.div`
    margin: 10px 0;
`;

export const OrDivider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: #999;
    font-weight: 600;
    
    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #ddd;
    }
    
    &::before {
        margin-right: 15px;
    }
    
    &::after {
        margin-left: 15px;
    }
`;