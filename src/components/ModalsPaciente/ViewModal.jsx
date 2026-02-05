import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api, { getAuthToken } from '../../services/api';
import styled from 'styled-components';
import { Overlay, Button, Spinner } from '../UI';

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

const ModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1000px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
  text-align: right;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 32px;
`;
// --- Fim dos Styled Components ---

const ViewModal = ({ paciente, onClose }) => {
  const [pacienteData, setPacienteData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!paciente?.id_paciente) return;

      setLoading(true);
      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }
        const response = await api.get(`/pacientes/${paciente.id_paciente}`, {
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
  }, [paciente]);

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

    // Separar dados por seções
    const sections = {
      identificacao: {},
      historia_patologica: {},
      historia_familiar: {},
      habitos_vida: {},
      paridade: {},
      historia_doenca: {},
      modelos_preditores: {},
      outros: {}
    };

    // Organizar dados por seções baseado nos prefixos
    Object.entries(data).map(([key, value]) => {
      if (['id_paciente', 'familiares', 'tratamento', 'desfecho'].includes(key)) return;
      
      if (key.startsWith('hp_')) {
        sections.historia_patologica[key.replace('hp_', '')] = value;
      } else if (key.startsWith('hf_')) {
        sections.historia_familiar[key.replace('hf_', '')] = value;
      } else if (key.startsWith('hv_')) {
        sections.habitos_vida[key.replace('hv_', '')] = value;
      } else if (key.startsWith('p_')) {
        sections.paridade[key.replace('p_', '')] = value;
      } else if (key.startsWith('hd_')) {
        sections.historia_doenca[key.replace('hd_', '')] = value;
      } else if (key.startsWith('mp_')) {
        sections.modelos_preditores[key.replace('mp_', '')] = value;
      } else if (['nome_completo', 'data_nascimento', 'genero', 'estado_civil', 'cor_etnia', 'escolaridade', 'renda_familiar', 'naturalidade', 'endereco', 'cep', 'numero', 'complemento', 'bairro', 'cidade', 'uf', 'telefone', 'altura', 'peso', 'imc', 'idade'].includes(key)) {
        sections.identificacao[key] = value;
      } else {
        sections.outros[key] = value;
      }
    });

    const renderSection = (title, sectionData) => {
      const hasData = Object.values(sectionData).some(value => value !== null && value !== '' && value !== false);
      if (!hasData) return null;

      return (
        <div key={title}>
          <SectionTitle>{title}</SectionTitle>
          <DetailGrid>
            {Object.entries(sectionData).map(([key, value]) => {
              if (value === null || value === '' || (typeof value === 'boolean' && !value && !key.includes('has') && !key.includes('uso') && !key.includes('teve'))) return null;

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
        </div>
      );
    };

    return (
      <>
        {renderSection('Identificação e Dados Pessoais', sections.identificacao)}
        {renderSection('História Patológica', sections.historia_patologica)}
        {renderSection('História Familiar', sections.historia_familiar)}
        {renderSection('Hábitos de Vida', sections.habitos_vida)}
        {renderSection('Paridade', sections.paridade)}
        {renderSection('História da Doença', sections.historia_doenca)}
        {renderSection('Modelos Preditores', sections.modelos_preditores)}
        {renderSection('Outros Dados', sections.outros)}
        
        {/* Familiares */}
        {data.familiares && data.familiares.length > 0 && (
          <div>
            <SectionTitle>Familiares</SectionTitle>
            {data.familiares.map((familiar, index) => (
              <div key={index}>
                <h4 style={{ color: '#666', marginBottom: '10px' }}>Familiar {index + 1}</h4>
                <DetailGrid>
                  {Object.entries(familiar).map(([key, value]) => {
                    if (['id_familiar', 'id_paciente'].includes(key) || !value) return null;
                    
                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                    const displayValue = typeof value === 'boolean' ? formatBoolean(value) : value;
                    
                    return (
                      <DetailItem key={key}>
                        <Label>{label}</Label>
                        <Value>{displayValue}</Value>
                      </DetailItem>
                    );
                  })}
                </DetailGrid>
              </div>
            ))}
          </div>
        )}
        
        {/* Tratamento */}
        {data.tratamento && (
          <div>
            <SectionTitle>Tratamento</SectionTitle>
            <DetailGrid>
              {Object.entries(data.tratamento).map(([key, value]) => {
                if (['id_tratamento', 'id_paciente', 'cirurgias', 'quimio_paliativa', 'radio_paliativa', 'endo_paliativa', 'imuno_paliativa', 'imunohistoquimicas'].includes(key)) return null;
                if (!value || value === '') return null;
                
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                let displayValue = value;
                
                if (typeof value === 'boolean') {
                  displayValue = formatBoolean(value);
                } else if (key.includes('data') && value) {
                  displayValue = formatDate(value);
                }
                
                return (
                  <DetailItem key={key}>
                    <Label>{label}</Label>
                    <Value>{displayValue}</Value>
                  </DetailItem>
                );
              })}
            </DetailGrid>
          </div>
        )}
        
        {/* Desfecho */}
        {data.desfecho && (
          <div>
            <SectionTitle>Desfecho</SectionTitle>
            <DetailGrid>
              {Object.entries(data.desfecho).map(([key, value]) => {
                if (['id_desfecho', 'id_paciente', 'metastases', 'eventos'].includes(key)) return null;
                if (value === null || value === '' || (typeof value === 'boolean' && !value)) return null;
                
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                let displayValue = value;
                
                if (typeof value === 'boolean') {
                  displayValue = formatBoolean(value);
                } else if (key.includes('data') && value) {
                  displayValue = formatDate(value);
                }
                
                return (
                  <DetailItem key={key}>
                    <Label>{label}</Label>
                    <Value>{displayValue}</Value>
                  </DetailItem>
                );
              })}
            </DetailGrid>
          </div>
        )}
      </>
    );
  };

  if (!paciente) return null;

  return (
    <Overlay>
      <ModalBox>
        {loading ? (
          <LoadingContainer>
            <Spinner size="40px" />
          </LoadingContainer>
        ) : pacienteData ? (
          <>
            <h2 style={{ marginBottom: '20px', color: '#2D3748', borderBottom: '2px solid #ff7bac', paddingBottom: '10px' }}>
              Detalhes do Paciente: {pacienteData.nome_completo || 'N/A'}
            </h2>
            {renderDetails(pacienteData)}

            <ButtonContainer>
              <Button onClick={onClose} variant="secondary">
                Fechar
              </Button>
            </ButtonContainer>
          </>
        ) : (
          <ErrorContainer>
            <p>Dados não encontrados.</p>
            <Button onClick={onClose} variant="secondary">
              Fechar
            </Button>
          </ErrorContainer>
        )}
      </ModalBox>
    </Overlay>
  );
};

export default ViewModal;
