import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import api from '../../services/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #ff7bac 0%, #ff6ba0 100%);
`;

const Card = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 25px;
  text-align: center;
  font-size: 0.9rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: block;
  padding: 20px;
  border: 2px dashed #ff7bac;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fce4ec;
  
  &:hover {
    border-color: #ff6ba0;
    background: #f8bbd0;
  }
`;

const UploadButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background: #ff7bac;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #ff6ba0;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const FileName = styled.p`
  margin-top: 15px;
  color: #ff7bac;
  font-weight: 500;
  text-align: center;
`;

const UploadMobile = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Formato inválido. Use PDF, JPG ou PNG');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Selecione um arquivo primeiro');
      return;
    }

    setUploading(true);

    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          fileName: file.name,
          fileType: file.type,
          fileData: reader.result
        };
        
        // Salvar no localStorage
        localStorage.setItem(`upload-${sessionId}`, JSON.stringify(fileData));
        
        toast.success('Arquivo enviado com sucesso!');
        setTimeout(() => {
          window.close();
        }, 1500);
      };
      
      reader.onerror = () => {
        toast.error('Erro ao processar arquivo');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erro ao enviar arquivo. Tente novamente.');
      setUploading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>📄 Enviar Termo de Consentimento</Title>
        <Subtitle>Selecione o arquivo assinado do seu dispositivo</Subtitle>
        
        <FileLabel htmlFor="file-upload">
          {file ? '✓ Arquivo selecionado' : '📎 Toque para selecionar arquivo'}
        </FileLabel>
        <FileInput 
          id="file-upload" 
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        
        {file && <FileName>{file.name}</FileName>}
        
        <UploadButton 
          onClick={handleUpload} 
          disabled={!file || uploading}
        >
          {uploading ? 'Enviando...' : 'Enviar Arquivo'}
        </UploadButton>
      </Card>
    </Container>
  );
};

export default UploadMobile;
