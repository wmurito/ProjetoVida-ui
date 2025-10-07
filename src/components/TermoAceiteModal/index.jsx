import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
    ModalOverlay, ModalContent, ModalHeader, ModalBody, 
    CheckboxLabel, FileInput, FileInputLabel,
    ContinueButton, ErrorMessage, ButtonGroup, CancelButton,
    QRCodeContainer, QRCodeTitle, UploadOption, OrDivider
} from './styles';
import qrcodeUploadService from '../../services/qrcodeUpload';

const TermoAceiteModal = ({ isOpen, onConfirm, onCancel, termoAceito, setTermoAceito, arquivoTermo, setArquivoTermo, erroTermo }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && showQRCode) {
            console.log('Iniciando sessão de upload via QR Code...');
            
            qrcodeUploadService.startSession(
                (file) => {
                    console.log('✅ Arquivo recebido via QR Code:', file.name);
                    setArquivoTermo(file);
                    setShowQRCode(false);
                },
                (errors) => {
                    console.error('❌ Erro no upload via QR Code:', errors);
                }
            ).then((sessionId) => {
                const url = qrcodeUploadService.getUploadUrl();
                console.log('✅ Sessão criada:', sessionId);
                console.log('📱 URL do QR Code:', url);
                setQrCodeUrl(url);
            }).catch((error) => {
                console.error('❌ Erro ao iniciar sessão:', error);
                alert('Erro ao gerar QR Code. Verifique se o backend está rodando.');
                setShowQRCode(false);
            });

            return () => {
                console.log('Finalizando sessão de upload');
                qrcodeUploadService.endSession();
            };
        }
    }, [isOpen, showQRCode, setArquivoTermo]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArquivoTermo(file);
        }
    };

    const toggleQRCode = async () => {
        if (showQRCode) {
            setShowQRCode(false);
            setQrCodeUrl('');
        } else {
            setLoading(true);
            setShowQRCode(true);
            // O useEffect cuidará da criação da sessão
            setTimeout(() => setLoading(false), 1000);
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <h2>Termo de Consentimento Livre e Esclarecido</h2>
                </ModalHeader>
                <ModalBody>
                    <p>Eu, [Nome do Paciente], declaro que fui devidamente informado(a) sobre a natureza e os objetivos da coleta de dados para o projeto de pesquisa. Compreendo que minha participação é voluntária e que os dados serão tratados com confidencialidade, sendo utilizados exclusivamente para fins de pesquisa acadêmica.</p>
                    <p>Autorizo o uso dos meus dados anonimizados para as finalidades descritas.</p>
                    
                    <CheckboxLabel>
                        <input type="checkbox" checked={termoAceito} onChange={(e) => setTermoAceito(e.target.checked)} />
                        Li e concordo com os termos.
                    </CheckboxLabel>

                    <UploadOption>
                        <FileInputLabel htmlFor="upload-termo">
                            {arquivoTermo ? `Arquivo: ${arquivoTermo.name}` : 'Anexar Termo Assinado (PDF, JPG, PNG)'}
                        </FileInputLabel>
                        <FileInput id="upload-termo" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    </UploadOption>

                    <OrDivider>OU</OrDivider>

                    <UploadOption>
                        <ContinueButton 
                            type="button" 
                            onClick={toggleQRCode}
                            disabled={loading}
                            style={{
                                backgroundColor: showQRCode ? '#ff7bac' : '#4CAF50',
                                border: showQRCode ? '2px solid #ff6ba0' : '2px solid #45a049'
                            }}
                        >
                            {loading ? '⏳ Gerando QR Code...' : showQRCode ? '📱 Ocultar QR Code' : '📱 Enviar via Celular (QR Code)'}
                        </ContinueButton>
                    </UploadOption>

                    {showQRCode && qrCodeUrl && (
                        <QRCodeContainer>
                            <QRCodeTitle>📱 Escaneie com seu celular:</QRCodeTitle>
                            <QRCodeSVG value={qrCodeUrl} size={200} level="H" />
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>
                                1. Aponte a câmera do celular para o QR Code<br/>
                                2. Será aberta uma página para enviar o arquivo<br/>
                                3. Selecione o termo assinado (PDF, JPG ou PNG)<br/>
                                4. O arquivo aparecerá automaticamente aqui
                            </p>
                            <div style={{ 
                                marginTop: '15px', 
                                padding: '10px', 
                                backgroundColor: '#e3f2fd', 
                                borderRadius: '5px',
                                fontSize: '0.8rem',
                                color: '#1976d2'
                            }}>
                                ⏱️ O QR Code expira em 5 minutos
                            </div>
                        </QRCodeContainer>
                    )}
                    
                    {erroTermo && <ErrorMessage>{erroTermo}</ErrorMessage>}

                    {/* Grupo de botões para melhor alinhamento */}
                    <ButtonGroup>
                        <CancelButton type="button" onClick={onCancel}>
                            Voltar
                        </CancelButton>
                        <ContinueButton onClick={onConfirm} disabled={!termoAceito || !arquivoTermo}>
                            Iniciar Cadastro
                        </ContinueButton>
                    </ButtonGroup>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TermoAceiteModal;