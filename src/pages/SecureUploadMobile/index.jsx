import React, { useState, useEffect } from 'react';
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

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #ff7bac;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin-top: 15px;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 10px;
  margin-top: 15px;
  font-size: 0.9rem;
`;

const FileInfo = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
`;

const SecureUploadMobile = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Validar sessionId
  useEffect(() => {
    if (!sessionId || !sessionId.startsWith('upload-')) {
      toast.error('Sessão inválida');
      navigate('/');
    }
  }, [sessionId, navigate]);

  const validateFile = (selectedFile) => {
    const errors = [];

    // Validar tipo MIME
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      errors.push('Formato inválido. Use PDF, JPG ou PNG');
    }

    // Validar tamanho (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      errors.push('Arquivo muito grande. Máximo 5MB');
    }

    // Validar nome do arquivo
    if (!selectedFile.name || selectedFile.name.length > 255) {
      errors.push('Nome do arquivo inválido');
    }

    // Verificar caracteres perigosos
    const dangerousChars = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*'];
    if (dangerousChars.some(char => selectedFile.name.includes(char))) {
      errors.push('Nome do arquivo contém caracteres inválidos');
    }

    // Verificar extensão
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const hasValidExtension = allowedExtensions.some(ext => 
      selectedFile.name.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      errors.push('Extensão de arquivo não permitida');
    }

    return errors;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const errors = validateFile(selectedFile);
      
      if (errors.length > 0) {
        setError(errors.join('. '));
        setFile(null);
        return;
      }

      setError(null);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo primeiro');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileData = {
            fileName: file.name,
            fileType: file.type,
            fileData: reader.result
          };
          
          // Enviar para o backend
          await api.post(`/upload-mobile/${sessionId}`, fileData);
          
          setProgress(100);
          setSuccess(true);
          toast.success('Arquivo enviado com sucesso!');
          
          setTimeout(() => {
            window.close();
          }, 2000);
        } catch (error) {
          clearInterval(progressInterval);
          setProgress(0);
          
          if (error.response?.status === 404) {
            setError('Sessão expirada. Tente novamente.');
          } else if (error.response?.status === 413) {
            setError('Arquivo muito grande.');
          } else if (error.response?.status === 415) {
            setError('Tipo de arquivo não suportado.');
          } else {
            setError('Erro ao enviar arquivo. Tente novamente.');
          }
          
          setUploading(false);
        }
      };
      
      reader.onerror = () => {
        clearInterval(progressInterval);
        setProgress(0);
        setError('Erro ao processar arquivo');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setProgress(0);
      setError('Erro inesperado. Tente novamente.');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          disabled={uploading}
        />
        
        {file && (
          <FileInfo>
            <div><strong>Nome:</strong> {file.name}</div>
            <div><strong>Tamanho:</strong> {formatFileSize(file.size)}</div>
            <div><strong>Tipo:</strong> {file.type}</div>
          </FileInfo>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>Arquivo enviado com sucesso!</SuccessMessage>}
        
        {uploading && (
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
        )}
        
        <UploadButton 
          onClick={handleUpload} 
          disabled={!file || uploading || success}
        >
          {uploading ? 'Enviando...' : success ? 'Enviado!' : 'Enviar Arquivo'}
        </UploadButton>
      </Card>
    </Container>
  );
};

export default SecureUploadMobile;

