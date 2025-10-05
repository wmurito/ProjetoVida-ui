// Serviço simplificado para gerenciar upload via QR Code
class QRCodeUploadService {
  constructor() {
    this.sessionId = null;
    this.checkInterval = null;
  }

  generateSessionId() {
    return `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  startSession(onFileReceived) {
    this.sessionId = this.generateSessionId();
    
    // Verificar localStorage a cada 2 segundos
    this.checkInterval = setInterval(() => {
      const fileData = localStorage.getItem(`upload-${this.sessionId}`);
      if (fileData) {
        try {
          const { fileName, fileType, fileData: base64Data } = JSON.parse(fileData);
          
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
          localStorage.removeItem(`upload-${this.sessionId}`);
          this.endSession();
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
        }
      }
    }, 2000);

    return this.sessionId;
  }

  getUploadUrl() {
    const baseUrl = window.location.origin;
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
