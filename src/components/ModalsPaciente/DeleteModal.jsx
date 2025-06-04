// DeleteModal.js
import React from 'react';
import { Modal, Button, Box } from '@mui/material';
import api from '../../services/api';

const DeleteModal = ({ open, onClose, pacienteId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/pacientes/${pacienteId}`);
      onDelete(); // Atualiza a lista de pacientes após a exclusão
      onClose();
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
      // Lógica para exibir mensagem de erro ao usuário
    }
  };

    return (
      <Modal open={open} onClose={onClose}>
        <div
          style={{
            width: '30%',
            padding: '20px',
            background: 'white',
            margin: 'auto',
            marginTop: '10%',
            borderRadius: '8px'
          }}
        >
          <h2 
            style={{ 
            color: '#8a8a8a', 
            textAlign: 'center', 
            letterSpacing: '2px' 
            }}
            >
              EXCLUIR PACIENTE
          </h2>
  
          <p 
            style={{ 
            color: '#8a8a8a', 
            textAlign: 'center' 
            }}
            >
              Você tem certeza que deseja excluir este paciente?
          </p>
  
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#FF7BAC',
                borderColor: 'transparent',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={handleDelete}
            >
              Excluir
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                backgroundColor: '#FF7BAC',
                borderColor: 'transparent',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={onClose}
            >
              Cancelar
            </Button>
          </Box>
  
        </div>
      </Modal>
  );
};

export default DeleteModal;
