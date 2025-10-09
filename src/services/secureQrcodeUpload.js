// 🔒 Serviço Seguro de Upload via QR Code
// Implementa melhorias de segurança baseadas na análise

import api from './api';
import { v4 as uuidv4 } from 'uuid';

class SecureQRCodeUploadService {
  constructor() {
    this.sessionId = null;
    this.checkInterval = null;
    this.maxRetries = 3;
    this.retryCount = 0;
  }

  /**
   * Gera um sessionId seguro usando UUID
   */
  generateSessionId() {
    return `upload-${uuidv4()}`;
  }

  /**
   * Valida se o arquivo é seguro para upload
   */
  validateFile(file) {
    const errors = [];

    // Validar tipo MIME
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('Tipo de arquivo não permitido. Use PDF, JPG ou PNG.');
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('Arquivo muito grande. Máximo 5MB.');
    }

    // Validar nome do arquivo
    if (!file.name || file.name.length > 255) {
      errors.push('Nome do arquivo inválido.');
    }

    // Verificar caracteres perigosos no nome
    const dangerousChars = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*'];
    if (dangerousChars.some(char => file.name.includes(char))) {
      errors.push('Nome do arquivo contém caracteres inválidos.');
    }

    // Verificar extensão
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      errors.push('Extensão de arquivo não permitida.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converte arquivo para base64 de forma segura
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const result = reader.result;
          
          // Validar se é um data URL válido
          if (!result.startsWith('data:')) {
            reject(new Error('Formato de arquivo inválido'));
            return;
          }

          // Verificar se tem dados
          const parts = result.split(',');
          if (parts.length !== 2) {
            reject(new Error('Formato de dados inválido'));
            return;
          }

          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Erro ao processar arquivo'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Verifica status do upload no servidor
   */
  async checkUploadStatus() {
    try {
      const response = await api.get(`/upload-status/${this.sessionId}`);
      return response.data;
    } catch (error) {
      // Se for 404, arquivo ainda não chegou
      if (error.response?.status === 404) {
        return null;
      }
      
      // Outros erros
      console.error('Erro ao verificar status do upload:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova sessão de upload
   */
  async createUploadSession() {
    try {
      const response = await api.post('/create-upload-session');
      this.sessionId = response.data.session_id;
      return this.sessionId;
    } catch (error) {
      console.error('Erro ao criar sessão de upload:', error);
      throw new Error('Falha ao criar sessão de upload');
    }
  }

  /**
   * Inicia uma sessão de upload segura
   */
  async startSession(onFileReceived, onError) {
    try {
      // Limpar sessão anterior se existir
      if (this.checkInterval) {
        this.endSession();
      }

      // Criar nova sessão
      await this.createUploadSession();
      
      // Verificar status a cada 2 segundos
      this.checkInterval = setInterval(async () => {
        try {
          const fileData = await this.checkUploadStatus();

          if (fileData && fileData.base64Data) {
            try {
              // Converter base64 para File
              const file = await this.base64ToFile(
                fileData.base64Data,
                fileData.fileName,
                fileData.fileType
              );
              
              // Validar arquivo recebido
              const validation = this.validateFile(file);
              if (!validation.isValid) {
                console.error('Arquivo recebido inválido:', validation.errors);
                if (onError) onError(validation.errors);
                return;
              }

              onFileReceived(file);
              this.endSession();
            } catch (error) {
              console.error('Erro ao processar arquivo recebido:', error);
              if (onError) onError(['Erro ao processar arquivo recebido']);
            }
          }
        } catch (error) {
          this.retryCount++;
          
          if (this.retryCount >= this.maxRetries) {
            console.error('Máximo de tentativas atingido');
            if (onError) onError(['Falha na comunicação com o servidor']);
            this.endSession();
          }
        }
      }, 2000);

      return this.sessionId;
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      if (onError) onError(['Falha ao iniciar sessão de upload']);
      throw error;
    }
  }

  /**
   * Converte base64 para File
   */
  async base64ToFile(base64Data, fileName, fileType) {
    try {
      // Extrair dados base64
      const parts = base64Data.split(',');
      if (parts.length !== 2) {
        throw new Error('Formato de dados inválido');
      }

      const byteString = atob(parts[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: fileType });
      return new File([blob], fileName, { type: fileType });
    } catch (error) {
      console.error('Erro ao converter base64 para arquivo:', error);
      throw error;
    }
  }

  /**
   * Retorna URL de upload
   */
  getUploadUrl() {
    if (!this.sessionId) {
      throw new Error('Sessão não iniciada');
    }
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/upload-mobile/${this.sessionId}`;
  }

  /**
   * Finaliza a sessão
   */
  endSession() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    this.sessionId = null;
    this.retryCount = 0;
  }

  /**
   * Verifica se há uma sessão ativa
   */
  hasActiveSession() {
    return this.sessionId !== null && this.checkInterval !== null;
  }
}

// Exportar instância singleton
export default new SecureQRCodeUploadService();

