import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Seu arquivo api.js
// Se você tiver funções específicas em api.js, pode importá-las também:
// import { getPacientes, getPacienteById, updatePaciente, deletePaciente, exportPacientesExcel } from '../../services/api';

import {
  Container, TableWrapper, TableTitle, Title, Search, TableContainer, Table, Th, Td, ActionIcons, StyledButton,
} from './styles'; // Seus estilos

import { FaSearch, FaEye, FaEdit, FaTrash, FaFileExcel, FaPlus } from 'react-icons/fa';

import Modal from '../../components/Modal'; // Seu componente Modal genérico

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/pacientes/');
      setPacientes(response.data);
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
      const errorMessage = err.response?.data?.detail ||
                           err.response?.data?.error ||
                           err.message ||
                           'Falha ao carregar a lista de pacientes.';
      setError(errorMessage);
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  const fetchPacienteDetailsForModal = async (pacienteId) => {
    setLoadingAction(true);
    setSelectedPaciente(null);
    try {
      const response = await api.get(`/paciente/view/${pacienteId}`);
      setSelectedPaciente(response.data);
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar detalhes do paciente ${pacienteId}:`, err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erro ao carregar detalhes do paciente.';
      alert(errorMsg);
      return null;
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenViewModal = async (paciente) => {
    const detailedPaciente = await fetchPacienteDetailsForModal(paciente.paciente_id);
    if (detailedPaciente) {
      setIsViewModalOpen(true);
    }
  };

  const handleOpenEditModal = async (paciente) => {
    const detailedPaciente = await fetchPacienteDetailsForModal(paciente.paciente_id);
    if (detailedPaciente) {
      setIsEditModalOpen(true);
    }
  };
  
  const handleOpenDeleteModal = (paciente) => {
    setPacienteParaExcluir(paciente);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPaciente(null);
    setPacienteParaExcluir(null);
  };

  const handleSaveChanges = async (updatedPacienteData) => {
    if (!selectedPaciente?.paciente_id) {
        alert("Nenhum paciente selecionado para edição.");
        return;
    }
    setLoadingAction(true);
    try {
      const response = await api.put(`/pacientes/${selectedPaciente.paciente_id}`, updatedPacienteData);
      setPacientes(prevPacientes => 
        prevPacientes.map(p => 
          p.paciente_id === selectedPaciente.paciente_id 
            ? { ...p, ...response.data }
            : p
        )
      );
      alert('Paciente atualizado com sucesso!');
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar paciente:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erro ao salvar as alterações.';
      alert(errorMsg);
    } finally {
      setLoadingAction(false);
    }
  };

  const confirmarExclusaoPaciente = async () => {
    if (!pacienteParaExcluir?.paciente_id) return;

    setLoadingAction(true);
    try {
      await api.delete(`/pacientes/${pacienteParaExcluir.paciente_id}`);
      setPacientes(prevPacientes => prevPacientes.filter(p => p.paciente_id !== pacienteParaExcluir.paciente_id));
      alert('Paciente excluído com sucesso!');
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao excluir paciente:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erro ao excluir paciente.';
      alert(errorMsg);
    } finally {
      setLoadingAction(false);
    }
  };

  const exportarParaExcelBackend = async () => { // Tornada async para o setLoadingAction
    console.log("Tentando exportar Excel via API com token...");
    setLoadingAction(true);
    try {

      const response = await api.get('/pacientes/exportar_excel', {
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      let filename = 'relatorio_pacientes.xlsx';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Erro ao exportar Excel:', err.response || err);
      const errorMsg = err.response?.data?.detail ||
                       (err.response?.data instanceof Blob ? "Erro ao processar arquivo do servidor. Verifique o console do backend." : err.response?.data?.error) || 
                       err.message || 
                       'Erro ao gerar o relatório Excel.';
      alert(errorMsg);
    } finally {
      setLoadingAction(false);
    }
  };

  const pacientesFiltrados = pacientes.filter(p =>
    (p.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.cidade?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.paciente_id?.toString().includes(searchTerm))
  );

  if (loading && pacientes.length === 0) {
    return <Container><div style={{ textAlign: 'center', padding: '2rem' }}>Carregando pacientes...</div></Container>;
  }

  if (error && pacientes.length === 0) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Erro: {error}
        </div>
        <div style={{ textAlign: 'center' }}>
          <StyledButton onClick={fetchPacientes} disabled={loading}>
            {loading ? 'Carregando...' : 'Tentar Novamente'}
          </StyledButton>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <TableWrapper>
        <TableTitle>
          <Title>Registro de Pacientes</Title>
          <Search>
            <StyledButton onClick={() => navigate('/novo-cadastro')} className="primary">
              <FaPlus style={{ marginRight: '0.5em' }} /> Novo Paciente
            </StyledButton>
            <StyledButton onClick={exportarParaExcelBackend} className="secondary" disabled={loadingAction}>
              <FaFileExcel style={{ marginRight: '0.5em' }} /> 
              {loadingAction && pacientesFiltrados.length > 0 ? 'Gerando...' : 'Exportar'}
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

        {pacientesFiltrados.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Nenhum paciente encontrado com os critérios de busca ou nenhum paciente cadastrado.
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
                        <button title="Visualizar" onClick={() => handleOpenViewModal(p)} disabled={loadingAction}>
                          <FaEye size={18} />
                        </button>
                        <button title="Editar" onClick={() => handleOpenEditModal(p)} disabled={loadingAction}>
                          <FaEdit size={18} />
                        </button>
                        <button title="Excluir" onClick={() => handleOpenDeleteModal(p)} disabled={loadingAction}>
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
      </TableWrapper>

      {/* Modal de Visualização */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
        title="Detalhes do Paciente"
        maxWidth="850px"
      >
        {loadingAction && !selectedPaciente ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando detalhes...</div>
        ) : (
          selectedPaciente && <ViewPacienteModal paciente={selectedPaciente} onClose={handleCloseModal} />
        )}
      </Modal>

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        title="Editar Paciente"
        maxWidth="950px"
      >
        {loadingAction && !selectedPaciente ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando formulário...</div>
        ) : (
          selectedPaciente && (
            <EditPacienteFormModal
              pacienteInitialData={selectedPaciente}
              onSave={handleSaveChanges}
              onClose={handleCloseModal}
            />
          )
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal} 
        title="Confirmar Exclusão"
        maxWidth="450px"
      >
        {pacienteParaExcluir && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Deseja realmente excluir o paciente:</p>
            <p><strong>{pacienteParaExcluir.nome_completo}</strong> (ID: {pacienteParaExcluir.paciente_id})?</p>
            <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <StyledButton onClick={handleCloseModal} className="secondary" disabled={loadingAction}>
                Cancelar
              </StyledButton>
              <StyledButton 
                onClick={confirmarExclusaoPaciente} 
                className="danger"
                disabled={loadingAction}
              >
                {loadingAction ? 'Excluindo...' : 'Confirmar Exclusão'}
              </StyledButton>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default ListaPacientes;