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

    useEffect(() => {
        if (isOpen && showQRCode) {
            qrcodeUploadService.startSession((file) => {
                setArquivoTermo(file);
                setShowQRCode(false);
            });
            
            const url = qrcodeUploadService.getUploadUrl();
            setQrCodeUrl(url);

            return () => {
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

    const toggleQRCode = () => {
        setShowQRCode(!showQRCode);
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
                        <ContinueButton type="button" onClick={toggleQRCode}>
                            {showQRCode ? 'Ocultar QR Code' : 'Enviar via Celular (QR Code)'}
                        </ContinueButton>
                    </UploadOption>

                    {showQRCode && qrCodeUrl && (
                        <QRCodeContainer>
                            <QRCodeTitle>Escaneie com seu celular:</QRCodeTitle>
                            <QRCodeSVG value={qrCodeUrl} size={200} level="H" />
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px' }}>
                                Aponte a câmera do celular para o QR Code e envie o arquivo
                            </p>
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