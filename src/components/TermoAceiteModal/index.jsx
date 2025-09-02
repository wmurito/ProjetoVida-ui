import React from 'react';
import { 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    CheckboxLabel, 
    FileInput,
    FileInputLabel,
    ContinueButton,
    ErrorMessage
} from './styles';

const TermoAceiteModal = ({ isOpen, onConfirm, termoAceito, setTermoAceito, arquivoTermo, setArquivoTermo, erroTermo }) => {
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Você pode adicionar validação de tamanho ou tipo aqui se desejar
            setArquivoTermo(file);
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
                        <input 
                            type="checkbox" 
                            checked={termoAceito} 
                            onChange={(e) => setTermoAceito(e.target.checked)}
                        />
                        Li e concordo com os termos.
                    </CheckboxLabel>

                    <FileInputLabel htmlFor="upload-termo">
                        {arquivoTermo ? `Arquivo selecionado: ${arquivoTermo.name}` : 'Anexar Termo Assinado (PDF, JPG, PNG)'}
                    </FileInputLabel>
                    <FileInput 
                        id="upload-termo"
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                    
                    {erroTermo && <ErrorMessage>{erroTermo}</ErrorMessage>}

                    <ContinueButton onClick={onConfirm} disabled={!termoAceito || !arquivoTermo}>
                        Iniciar Cadastro
                    </ContinueButton>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TermoAceiteModal;