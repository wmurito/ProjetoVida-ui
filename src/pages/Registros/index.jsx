import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

import {
  Container, TableWrapper, TableTitle, Title, Search, TableContainer, Table, Th, Td, ActionIcons, StyledButton,
} from './styles';

import { FaSearch, FaEye, FaEdit, FaTrash, FaFileExcel, FaPlus } from 'react-icons/fa';

import Modal from '../../components/Modal';

// Importação dos modais de visualização e edição
import ViewPacienteModal from '../../components/ModalsPaciente/ViewModal';
import EditPacienteFormModal from "../../components/ModalsPaciente/EditModal";

const ListaPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // 🔄 Buscar lista de pacientes
  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/pacientes');
      setPacientes(response.data);
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
      const errorMessage = err.response?.data?.error || 'Erro ao carregar pacientes.';
      setError(errorMessage);
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // 🔍 Buscar detalhes do paciente
  const fetchPacienteDetailsForModal = async (pacienteId) => {
    setLoadingAction(true);
    setSelectedPaciente(null);
    try {
      const response = await api.get(`/pacientes/${pacienteId}`);
      setSelectedPaciente(response.data);
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar detalhes do paciente ${pacienteId}:`, err);
      alert(err.response?.data?.error || 'Erro ao carregar detalhes do paciente.');
      return null;
    } finally {
      setLoadingAction(false);
    }
  };

  // 📖 Ações de abrir/fechar modal
  const handleOpenViewModal = async (paciente) => {
    const detailed = await fetchPacienteDetailsForModal(paciente.paciente_id);
    if (detailed) setIsViewModalOpen(true);
  };

  const handleOpenEditModal = async (paciente) => {
    const detailed = await fetchPacienteDetailsForModal(paciente.paciente_id);
    if (detailed) setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedPaciente(null);
  };

  // 💾 Salvar alterações no paciente
  const handleSaveChanges = async (updatedPacienteData) => {
    if (!selectedPaciente?.paciente_id) return;
    setLoadingAction(true);
    try {
      const response = await api.put(`/pacientes/${selectedPaciente.paciente_id}`, updatedPacienteData);
      setPacientes(pacientes.map(p => 
        p.paciente_id === selectedPaciente.paciente_id 
          ? { ...p, ...response.data } 
          : p
      ));
      alert('Paciente atualizado com sucesso!');
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar paciente:', err);
      alert(err.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setLoadingAction(false);
    }
  };

  // ❌ Excluir paciente
  const excluirPaciente = async (pacienteId) => {
    if (window.confirm('Deseja realmente excluir este paciente?')) {
      setLoadingAction(true);
      try {
        await api.delete(`/pacientes/${pacienteId}`);
        setPacientes(pacientes.filter(p => p.paciente_id !== pacienteId));
        alert('Paciente excluído com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir paciente:', err);
        alert(err.response?.data?.error || 'Erro ao excluir paciente.');
      } finally {
        setLoadingAction(false);
      }
    }
  };

  // 📤 Exportar Excel
  const exportarParaExcelBackend = () => {
    const backendBaseUrl = api.defaults.baseURL;
    const exportUrl = `${backendBaseUrl}/pacientes/exportar_excel`;
    window.open(exportUrl, '_blank');
  };

  // 🔎 Filtro de busca
  const pacientesFiltrados = pacientes.filter(p =>
    (p.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.cidade?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.paciente_id?.toString().includes(searchTerm))
  );

  return (
    <Container>
      <TableWrapper>
        <TableTitle>
          <Title>Registro de Pacientes</Title>
          <Search>
            <StyledButton onClick={() => navigate('/pacientes/novo')}>
              <FaPlus style={{ marginRight: '0.5em' }} /> Novo Paciente
            </StyledButton>
            <StyledButton onClick={exportarParaExcelBackend} className="secondary">
              <FaFileExcel style={{ marginRight: '0.5em' }} /> Exportar
            </StyledButton>
          </Search>
        </TableTitle>

        <div style={{
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '0.5rem 0.75rem',
          maxWidth: '400px'
        }}>
          <FaSearch style={{ marginRight: '0.75rem', color: '#6c757d' }} />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              flexGrow: 1,
              background: 'transparent'
            }}
          />
        </div>

        {loading && pacientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando pacientes...</div>
        ) : error && pacientes.length === 0 ? (
          <>
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Erro: {error}</div>
            <div style={{ textAlign: 'center' }}>
              <StyledButton onClick={fetchPacientes}>Tentar Novamente</StyledButton>
            </div>
          </>
        ) : (
          <>
            {pacientesFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Nenhum paciente encontrado.
              </div>
            ) : (
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>ID</Th>
                      <Th>Nome Completo</Th>
                      <Th>Idade</Th>
                      <Th>Cidade</Th>
                      <Th>Ações</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientesFiltrados.map(p => (
                      <tr key={p.paciente_id}>
                        <Td>{p.paciente_id}</Td>
                        <Td>{p.nome_completo}</Td>
                        <Td>{p.idade || 'N/A'}</Td>
                        <Td>{p.cidade || 'N/A'}</Td>
                        <Td>
                          <ActionIcons>
                            <button title="Visualizar" onClick={() => handleOpenViewModal(p)}>
                              <FaEye size={18} />
                            </button>
                            <button title="Editar" onClick={() => handleOpenEditModal(p)}>
                              <FaEdit size={18} />
                            </button>
                            <button title="Excluir" onClick={() => excluirPaciente(p.paciente_id)}>
                              <FaTrash size={18} />
                            </button>
                          </ActionIcons>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </TableWrapper>

      {/* Modal de Visualização */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
        title="Detalhes do Paciente"
        maxWidth="850px"
      >
        {loadingAction ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>
        ) : (
          selectedPaciente && <ViewPacienteModal paciente={selectedPaciente} />
        )}
      </Modal>

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        title="Editar Paciente"
        maxWidth="950px"
      >
        {loadingAction ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando formulário...</div>
        ) : (
          selectedPaciente && (
            <EditPacienteFormModal
              paciente={selectedPaciente}
              onSave={handleSaveChanges}
              onClose={handleCloseModal}
            />
          )
        )}
      </Modal>
    </Container>
  );
};

export default ListaPacientes;
