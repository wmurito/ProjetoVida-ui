// src/services/qrcodeUpload.js
// Serviço simplificado para gerenciar upload via QR Code
import api from './api'; // Importe seu serviço de API (necessário para o polling)

class QRCodeUploadService {
  constructor() {
    this.sessionId = null;
    this.checkInterval = null;
  }

  generateSessionId() {
    return `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async checkUploadStatus() {
    // 1. O desktop pergunta ao servidor se o arquivo chegou para este sessionId
    try {
      // O endpoint abaixo deve ser implementado no seu backend.
      // Ele deve retornar os dados do arquivo (base64) se o upload móvel tiver sido concluído.
      const response = await api.get(`/upload-status/${this.sessionId}`); 
      return response.data; 

    } catch (error) {
      // Se a resposta for 404/400 ou vazia, significa que o arquivo ainda não chegou.
      // Console.error 'Erro na verificação'
      return null;
    }
  }

  startSession(onFileReceived) {
    if (this.checkInterval) this.endSession(); // Previne múltiplas sessões rodando

    this.sessionId = this.generateSessionId();
    
    // Verificar o status no servidor a cada 2 segundos
    this.checkInterval = setInterval(async () => {
      // **MUDANÇA AQUI: VERICANDO NO SERVIDOR (BACKEND) AO INVÉS DO localStorage**
      const fileData = await this.checkUploadStatus();

      if (fileData && fileData.base64Data) {
        try {
          // Os dados recebidos devem ser no formato { fileName, fileType, base64Data }
          const { fileName, fileType, base64Data } = fileData;
          
          // Converter base64 para File
          const byteString = atob(base64Data.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: fileType });
          const file = new File([blob], fileName, { type: fileType });
          
          onFileReceived(file);
          // O backend deve ter a lógica de remoção/expiração do arquivo após o download ou uso
          this.endSession();
        } catch (error) {
          console.error('Erro ao processar arquivo recebido do servidor:', error);
        }
      }
    }, 2000);

    return this.sessionId;
  }

  getUploadUrl() {
    const baseUrl = window.location.origin;
    // O SessionId será o identificador que a página móvel usará para enviar o arquivo ao servidor
    return `${baseUrl}/upload-mobile/${this.sessionId}`; 
  }

  endSession() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.sessionId = null;
  }
}

export default new QRCodeUploadService();