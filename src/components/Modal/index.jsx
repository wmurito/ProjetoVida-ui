import {ModalBackdrop, ModalContent, ModalHeader, ModalTitle, CloseButton } from './styles';
import { FaTimes } from 'react-icons/fa';


const Modal = ({ isOpen, onClose, title, children, maxWidth }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}> {/* Fecha ao clicar no backdrop */}
      <ModalContent maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}> {/* Evita fechar ao clicar dentro do conteúdo */}
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Fechar modal">
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalBackdrop>
  );
};

export default Modal;