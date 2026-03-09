import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadTermoAceite, validateFile } from '../../services/uploadService';

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
    <div className="p-5 bg-white rounded-lg shadow-sm border border-slate-100">
      <h3 className="text-slate-800 font-semibold mb-4 flex items-center gap-2">📄 Upload do Termo de Aceite</h3>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label
          htmlFor="file-upload"
          className="inline-block px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md cursor-pointer transition-colors shadow-sm"
        >
          {file ? '✓ Arquivo Selecionado' : '📎 Selecionar Arquivo'}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md cursor-pointer transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
        >
          {uploading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {file && <p className="mt-3 text-sm text-slate-600 font-medium">📎 {file.name}</p>}

      <div className="mt-4 p-3 bg-sky-50 border border-sky-100 rounded-md text-sm text-sky-700 flex items-center gap-2">
        <span className="text-lg">ℹ️</span> Formatos aceitos: PDF, JPG, PNG (máximo 5MB)
      </div>
    </div>
  );
};

export default UploadTermo;
