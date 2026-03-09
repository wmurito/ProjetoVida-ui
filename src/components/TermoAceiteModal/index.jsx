import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { validateFile } from '../../services/uploadService';
import api from '../../services/api';

const TermoAceiteModal = ({ isOpen, onConfirm, onCancel, termoAceito, setTermoAceito, arquivoTermo, setArquivoTermo, erroTermo }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        if (isOpen && showQRCode && !sessionId) {
            createUploadSession();
        }
    }, [isOpen, showQRCode, sessionId, createUploadSession]);

    useEffect(() => {
        if (!sessionId) return;

        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/upload-status/${sessionId}`);
                if (response.data) {
                    const { fileName, fileType, fileData } = response.data;
                    const blob = await fetch(fileData).then(res => res.blob());
                    const file = new File([blob], fileName, { type: fileType });
                    setArquivoTermo(file);
                    setShowQRCode(false);
                    setSessionId(null);
                }
            } catch (error) {
                // Arquivo ainda não foi enviado
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [sessionId, setArquivoTermo]);

    const createUploadSession = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/create-upload-session');
            const { session_id } = response.data;
            setSessionId(session_id);
            const uploadUrl = `${window.location.origin}/secure-upload/${session_id}`;
            setQrCodeUrl(uploadUrl);
        } catch (error) {
            console.error('Erro ao criar sessão:', error);
            alert('Erro ao gerar QR Code. Tente novamente.');
            setShowQRCode(false);
        } finally {
            setLoading(false);
        }
    }, []);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            alert(validation.errors.join('. '));
            return;
        }

        setArquivoTermo(file);
    };

    const toggleQRCode = () => {
        if (showQRCode) {
            setShowQRCode(false);
            setSessionId(null);
        } else {
            setShowQRCode(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[2000] p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col text-center shadow-2xl">
                <div className="px-8 py-5 border-b border-slate-200 shrink-0">
                    <h2 className="m-0 text-slate-800 text-xl font-semibold">Termo de Consentimento Livre e Esclarecido</h2>
                </div>

                <div className="px-8 py-5 overflow-y-auto flex-1">
                    <p className="text-justify text-slate-600 leading-relaxed text-sm my-3 font-medium">
                        Eu, [Nome do Paciente], declaro que fui devidamente informado(a) sobre a natureza e os objetivos da coleta de dados para o projeto de pesquisa. Compreendo que minha participação é voluntária e que os dados serão tratados com confidencialidade, sendo utilizados exclusivamente para fins de pesquisa acadêmica.
                    </p>
                    <p className="text-justify text-slate-600 leading-relaxed text-sm my-3 font-medium">
                        Autorizo o uso dos meus dados anonimizados para as finalidades descritas.
                    </p>

                    <label className="flex items-center justify-center my-4 text-base cursor-pointer text-slate-700 hover:text-slate-900 transition-colors">
                        <input
                            type="checkbox"
                            className="mr-3 scale-125 accent-pink-500 cursor-pointer"
                            checked={termoAceito}
                            onChange={(e) => setTermoAceito(e.target.checked)}
                        />
                        Li e concordo com os termos.
                    </label>

                    <div className="my-3">
                        <label
                            htmlFor="upload-termo"
                            className="block px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 cursor-pointer transition-all duration-200 text-sm font-medium text-slate-700 hover:border-pink-400 hover:bg-pink-50"
                        >
                            {arquivoTermo ? `Arquivo: ${arquivoTermo.name}` : 'Anexar Termo Assinado (PDF, JPG, PNG)'}
                        </label>
                        <input
                            id="upload-termo"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex items-center text-center my-4 text-slate-400 font-semibold text-sm before:content-[''] before:flex-1 before:border-b before:border-slate-200 before:mr-4 after:content-[''] after:flex-1 after:border-b after:border-slate-200 after:ml-4">
                        OU
                    </div>

                    <div className="my-3">
                        <button
                            type="button"
                            onClick={toggleQRCode}
                            disabled={loading}
                            className={`w-full py-3 px-4 text-white font-semibold rounded-lg cursor-pointer transition-colors border-2 disabled:bg-slate-400 disabled:border-slate-400 disabled:cursor-not-allowed
                                ${showQRCode
                                    ? 'bg-pink-400 border-pink-400 hover:bg-pink-500'
                                    : 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600'
                                }`}
                        >
                            {loading ? '⏳ Gerando QR Code...' : showQRCode ? '📱 Ocultar QR Code' : '📱 Enviar via Celular (QR Code)'}
                        </button>
                    </div>

                    {showQRCode && qrCodeUrl && (
                        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl my-4 border-2 border-pink-400 shadow-[0_4px_12px_rgba(255,123,172,0.1)] animate-[fadeIn_0.3s_ease-in]">
                            <h3 className="m-0 mb-3 text-pink-400 text-base font-semibold text-center">📱 Escaneie com seu celular:</h3>
                            <QRCodeSVG value={qrCodeUrl} size={200} level="H" className="bg-white p-2 rounded-lg shadow-sm" />
                            <p className="text-[13.5px] text-slate-500 mt-4 text-center font-medium leading-relaxed">
                                1. Aponte a câmera do celular para o QR Code<br />
                                2. Será aberta uma página para enviar o arquivo<br />
                                3. Selecione o termo assinado (PDF, JPG ou PNG)<br />
                                4. O arquivo aparecerá automaticamente aqui
                            </p>
                            <div className="mt-4 p-2.5 bg-sky-50 rounded-md text-xs font-semibold text-sky-600 border border-sky-100 w-full text-center tracking-wide">
                                ⏱️ O QR Code expira em 5 minutos
                            </div>
                        </div>
                    )}

                    {erroTermo && <p className="text-rose-500 font-semibold my-3 animate-pulse">{erroTermo}</p>}

                    <div className="flex gap-4 pt-5 mt-5 border-t border-slate-200 bg-white shrink-0">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 text-base font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors hover:bg-slate-200"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!termoAceito || !arquivoTermo}
                            className="flex-1 py-3 text-base font-semibold text-white bg-emerald-500 border-none rounded-lg cursor-pointer transition-colors hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm shadow-emerald-500/30"
                        >
                            Iniciar Cadastro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermoAceiteModal;
