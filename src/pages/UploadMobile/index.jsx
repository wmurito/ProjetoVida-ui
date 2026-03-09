import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { validateFile, fileToBase64 } from '../../services/uploadService';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gradient-to-br from-pink-400 to-pink-500 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-full max-w-[500px]">
        <h1 className="text-slate-800 mb-2.5 text-2xl text-center font-bold">📄 Enviar Termo de Consentimento</h1>
        <p className="text-slate-600 mb-6 text-center text-sm font-medium">Selecione o arquivo assinado do seu dispositivo</p>

        <div className="mb-5 p-3 bg-sky-50 rounded-lg text-sm text-sky-700 text-center font-medium border border-sky-100 shadow-sm">
          ⚠️ Formatos aceitos: PDF, JPG, PNG (máximo 5MB)
        </div>

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
          className="hidden"
        />

        {file && <p className="mt-4 text-pink-500 font-semibold text-center">{file.name}</p>}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full p-4 mt-5 bg-pink-400 text-white border-none rounded-lg text-base font-bold cursor-pointer transition-colors shadow-sm hover:bg-pink-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {uploading ? 'Enviando...' : 'Enviar Arquivo'}
        </button>
      </div>
    </div>
  );
};

export default UploadMobile;
