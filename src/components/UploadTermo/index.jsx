import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { uploadTermoAceite, validateFile } from '../../services/uploadService';

const Container = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 15px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-block;
  padding: 12px 24px;
  background: #d94c77;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #c43d66;
  }
`;

const UploadButton = styled.button`
  padding: 12px 24px;
  margin-left: 10px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #229954;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const FileName = styled.p`
  margin: 10px 0;
  color: #666;
  font-size: 14px;
`;

const Info = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: #e3f2fd;
  border-radius: 6px;
  font-size: 13px;
  color: #1976d2;
`;

const UploadTermo = ({ pacienteId, onSuccess }) => {
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
      await uploadTermoAceite(pacienteId, file);
      toast.success('Termo enviado com sucesso!');
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erro ao enviar termo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Title>📄 Upload do Termo de Aceite</Title>
      
      <div>
        <FileLabel htmlFor="file-upload">
          {file ? '✓ Arquivo Selecionado' : '📎 Selecionar Arquivo'}
        </FileLabel>
        <FileInput 
          id="file-upload" 
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        
        <UploadButton 
          onClick={handleUpload} 
          disabled={!file || uploading}
        >
          {uploading ? 'Enviando...' : 'Enviar'}
        </UploadButton>
      </div>
      
      {file && <FileName>📎 {file.name}</FileName>}
      
      <Info>
        ℹ️ Formatos aceitos: PDF, JPG, PNG (máximo 5MB)
      </Info>
    </Container>
  );
};

export default UploadTermo;
