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
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    text-align: center;
`;

export const ModalHeader = styled.div`
    padding: 20px 30px;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
    h2 {
        margin: 0;
        color: #333;
        font-size: 1.3rem;
    }
`;

export const ModalBody = styled.div`
    padding: 20px 30px;
    overflow-y: auto;
    flex: 1;
    
    p {
        text-align: justify;
        color: #555;
        line-height: 1.5;
        font-size: 0.9rem;
        margin: 10px 0;
    }
`;

export const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
    font-size: 1rem;
    cursor: pointer;
    
    input {
        margin-right: 10px;
        transform: scale(1.2);
    }
`;

export const FileInput = styled.input`
    display: none; // O input real fica escondido
`;

export const FileInputLabel = styled.label`
    display: block;
    padding: 10px 15px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;

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

export const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    padding: 20px 30px;
    border-top: 1px solid #eee;
    background: white;
    flex-shrink: 0;
`;

export const CancelButton = styled.button`
    flex: 1;
    padding: 12px;
    font-size: 1rem;
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

export const ContinueButton = styled.button`
    flex: 1;
    padding: 12px;
    font-size: 1rem;
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
    padding: 15px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    margin: 15px 0;
    border: 2px solid #ff7bac;
    box-shadow: 0 4px 12px rgba(255, 123, 172, 0.1);
    animation: fadeIn 0.3s ease-in;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

export const QRCodeTitle = styled.h3`
    margin: 0 0 10px 0;
    color: #ff7bac;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
`;

export const UploadOption = styled.div`
    margin: 10px 0;
`;

export const OrDivider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 15px 0;
    color: #999;
    font-weight: 600;
    font-size: 0.9rem;
    
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