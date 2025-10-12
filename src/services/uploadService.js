import api from './api';

/**
 * Upload do termo de aceite via FormData (Desktop)
 */
export const uploadTermoAceite = async (pacienteId, file) => {
  const formData = new FormData();
  formData.append('paciente_id', pacienteId);
  formData.append('termo', file);
  
  return await api.post('/upload-termo-aceite', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * Upload do termo de aceite via Base64 (Mobile)
 */
export const uploadTermoAceiteBase64 = async (pacienteId, fileBase64) => {
  return await api.post('/upload-termo-aceite-base64', {
    paciente_id: pacienteId,
    file_data: fileBase64
  });
};

/**
 * Converte arquivo para base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Valida arquivo antes do upload
 */
export const validateFile = (file) => {
  const errors = [];
  
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Tipo não permitido. Use PDF, JPG ou PNG');
  }
  
  if (file.size > 5 * 1024 * 1024) {
    errors.push('Arquivo muito grande (máximo 5MB)');
  }
  
  return { isValid: errors.length === 0, errors };
};
