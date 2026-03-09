import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

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
    console.log('Session ID recebido:', sessionId);
    if (!sessionId || !sessionId.startsWith('upload-')) {
      console.error('Session ID inválido:', sessionId);
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
    let progressInterval = null;

    try {
      // Simular progresso
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
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
            fileData: reader.result,
            paciente_id: 'temp'
          };

          console.log('Enviando arquivo:', { fileName: file.name, fileType: file.type, sessionId });

          // Enviar para o backend
          const response = await api.post(`/upload-mobile/${sessionId}`, fileData);

          console.log('Resposta do servidor:', response.data);

          if (progressInterval) clearInterval(progressInterval);
          setProgress(100);
          setSuccess(true);
          toast.success('Arquivo enviado com sucesso!');

          setTimeout(() => {
            window.close();
          }, 2000);
        } catch (error) {
          if (progressInterval) clearInterval(progressInterval);
          setProgress(0);

          if (import.meta.env.DEV) {
            console.error('Erro detalhado:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
          }

          if (error.response?.status === 404) {
            setError('Sessão expirada. Tente novamente.');
          } else if (error.response?.status === 413) {
            setError('Arquivo muito grande.');
          } else if (error.response?.status === 415) {
            setError('Tipo de arquivo não suportado.');
          } else if (error.response?.status === 422) {
            setError(error.response?.data?.detail || 'Arquivo inválido.');
          } else {
            setError(error.response?.data?.detail || 'Erro ao enviar arquivo. Tente novamente.');
          }

          setUploading(false);
        }
      };

      reader.onerror = () => {
        if (progressInterval) clearInterval(progressInterval);
        setProgress(0);
        setError('Erro ao processar arquivo');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gradient-to-br from-pink-400 to-pink-500 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-full max-w-[500px]">
        <h1 className="text-slate-800 mb-2.5 text-2xl text-center font-bold">📄 Enviar Termo de Consentimento</h1>
        <p className="text-slate-600 mb-6 text-center text-sm font-medium">Selecione o arquivo assinado do seu dispositivo</p>

        <label
          htmlFor="file-upload"
          className="block p-5 border-2 border-dashed border-pink-400 rounded-xl text-center cursor-pointer transition-all bg-pink-50 hover:bg-pink-100 hover:border-pink-500 text-pink-600 font-semibold shadow-sm"
        >
          {file ? '✓ Arquivo selecionado' : '📎 Toque para selecionar arquivo'}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        {file && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium leading-relaxed">
            <div><strong className="text-slate-800">Nome:</strong> {file.name}</div>
            <div><strong className="text-slate-800">Tamanho:</strong> {formatFileSize(file.size)}</div>
            <div><strong className="text-slate-800">Tipo:</strong> {file.type}</div>
          </div>
        )}

        {error && <div className="mt-4 p-3 bg-red-100/50 border border-red-200 text-red-600 rounded-md text-sm font-medium">{error}</div>}
        {success && <div className="mt-4 p-3 bg-emerald-100/50 border border-emerald-200 text-emerald-600 rounded-md text-sm font-medium">Arquivo enviado com sucesso!</div>}

        {uploading && (
          <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-pink-400 transition-[width] duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading || success}
          className="w-full p-4 mt-5 bg-pink-400 text-white border-none rounded-lg text-base font-bold cursor-pointer transition-colors shadow-sm hover:bg-pink-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {uploading ? 'Enviando...' : success ? 'Enviado!' : 'Enviar Arquivo'}
        </button>
      </div>
    </div>
  );
};

export default SecureUploadMobile;
