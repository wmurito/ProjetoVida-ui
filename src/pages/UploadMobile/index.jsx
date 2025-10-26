import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { validateFile, fileToBase64 } from '../../services/uploadService';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #ff7bac 0%, #ff6ba0 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    const validation = validateFile(selectedFile);
    if (!validation.isValid) {
      toast.error(validation.errors.join('. '));
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Selecione um arquivo');
      return;
    }
    
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      
      try {
        localStorage.setItem('termo_upload', JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileData: base64,
          timestamp: Date.now()
        }));
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          throw new Error('Arquivo muito grande. Tente um arquivo menor.');
        }
        throw new Error('Erro ao salvar arquivo. Verifique as configurações do navegador.');
      }
      
      toast.success('Termo enviado! Pode fechar esta janela.');
      setTimeout(() => window.close(), 2000);
    } catch (error) {
      console.error('Erro no upload:', { message: error.message, fileName: file.name });
      toast.error(error.message || 'Erro ao processar arquivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>📄 Enviar Termo de Consentimento</Title>
        <Subtitle>Selecione o arquivo assinado do seu dispositivo</Subtitle>
        
        
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#1976d2',
          textAlign: 'center'
        }}>
          ⚠️ Formatos aceitos: PDF, JPG, PNG (máximo 5MB)
        </div>
        
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
