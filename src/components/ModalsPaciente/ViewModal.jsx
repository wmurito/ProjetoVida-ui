import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import api, { getAuthToken } from '../../services/api';
import styled from 'styled-components';

// --- Styled Components ---
const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px 25px;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px dotted #e0e0e0;
`;

const Label = styled.strong`
  display: block;
  color: #4A5568;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: capitalize;
`;

const Value = styled.span`
  color: #1A202C;
  word-break: break-word;
`;

const SectionTitle = styled.h3`
  margin-top: 10px;
  margin-bottom: 15px;
  color: #ff7bac;
  font-size: 1.25rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 10px;
  font-weight: 600;
`;
// --- Fim dos Styled Components ---

const ViewModal = ({ open, onClose, pacienteId }) => {
  const [pacienteData, setPacienteData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!open || !pacienteId) return;

      setLoading(true);
      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }
        const response = await api.get(`/pacientes/${pacienteId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPacienteData(response.data);
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        setPacienteData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [open, pacienteId]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return 'Data inválida';
    }
  };

  const formatBoolean = (value) => (value ? 'Sim' : 'Não');

  const renderDetails = (data) => {
    if (!data) return null;

    return (
      <DetailGrid>
        {Object.entries(data).map(([key, value]) => {
          if (['id', 'paciente_id'].includes(key)) return null;

          const label = key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());

          let displayValue = value;
          if (typeof value === 'boolean') {
            displayValue = formatBoolean(value);
          } else if (key.includes('data') && value) {
            displayValue = formatDate(value);
          } else if (value === null || value === '') {
            displayValue = 'N/A';
          }

          return (
            <DetailItem key={key}>
              <Label>{label}</Label>
              <Value>{displayValue}</Value>
            </DetailItem>
          );
        })}
      </DetailGrid>
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 1000,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : pacienteData ? (
          <>
            <SectionTitle>Dados do Paciente</SectionTitle>
            {renderDetails(pacienteData)}

            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button onClick={onClose} variant="contained" color="secondary">
                Fechar
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <p>Dados não encontrados.</p>
            <Button onClick={onClose} variant="contained" color="secondary">
              Fechar
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ViewModal;
