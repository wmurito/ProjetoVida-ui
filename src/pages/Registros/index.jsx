import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Seu arquivo api.js
// Se getPacientes estiver em api.js, pode ser:
// import { getPacientes, getPacienteById, updatePaciente, deletePaciente } from '../../services/api';

import {
  Container, TableWrapper, TableTitle, Title, Search, TableContainer, Table, Th, Td, ActionIcons, StyledButton,
} from './styles'; // Seus estilos

import { FaSearch, FaEye, FaEdit, FaTrash, FaFileExcel, FaPlus } from 'react-icons/fa';

import Modal from '../../components/Modal'; // Seu componente Modal genérico

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Novo estado para modal de exclusão
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState(null); // Novo estado
  const [loadingAction, setLoadingAction] = useState(false); // Para ações como delete, save, fetch details

  // 🔄 Buscar lista de pacientes
  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Para paginação, você passaria skip e limit aqui
      // Ex: const response = await api.get('/pacientes/?skip=0&limit=20');
      const response = await api.get('/pacientes/'); // Busca os primeiros 100 por padrão (ou o que seu backend definir)
      setPacientes(response.data);
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
      const errorMessage = err.response?.data?.detail || // Erro do FastAPI HTTPException
                           err.response?.data?.error ||  // Erro genérico
                           err.message ||                // Erro de rede ou outro
                           'Falha ao carregar a lista de pacientes.';
      setError(errorMessage);
      setPacientes([]); // Limpa pacientes em caso de erro
    } finally {
      setLoading(false);
    }
  }, []); // useCallback com array de dependências vazio

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]); // fetchPacientes é agora uma dependência estável

  // 🔍 Buscar detalhes do paciente para modais
  const fetchPacienteDetailsForModal = async (pacienteId) => {
    setLoadingAction(true); // Usar um loading específico para esta ação
    setSelectedPaciente(null); // Limpa o paciente selecionado anterior
    try {
      // Use o endpoint que retorna todos os detalhes necessários
      const response = await api.get(`/paciente/view/${pacienteId}`); 
      setSelectedPaciente(response.data);
      return response.data; // Retorna para uso imediato
    } catch (err) {
      console.error(`Erro ao buscar detalhes do paciente ${pacienteId}:`, err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erro ao carregar detalhes do paciente.';
      alert(errorMsg); // Ou use um sistema de notificação melhor
      return null;
    } finally {
      setLoadingAction(false);
    }
  };

  // 📖 Ações de abrir/fechar modal
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
    setPacienteParaExcluir(paciente); // Define qual paciente será excluído
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false); // Fecha o modal de exclusão também
    setSelectedPaciente(null);
    setPacienteParaExcluir(null); // Limpa o paciente para excluir
  };

  // 💾 Salvar alterações no paciente
  const handleSaveChanges = async (updatedPacienteData) => {
    if (!selectedPaciente?.paciente_id) {
        alert("Nenhum paciente selecionado para edição.");
        return;
    }
    setLoadingAction(true);
    try {
      const response = await api.put(`/pacientes/${selectedPaciente.paciente_id}`, updatedPacienteData);
      // Atualiza a lista de pacientes no frontend
      setPacientes(prevPacientes => 
        prevPacientes.map(p => 
          p.paciente_id === selectedPaciente.paciente_id 
            ? { ...p, ...response.data } // response.data deve ser o paciente atualizado
            : p
        )
      );
      alert('Paciente atualizado com sucesso!');
      handleCloseModal(); // Fecha o modal de edição
    } catch (err) {
      console.error('Erro ao salvar paciente:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erro ao salvar as alterações.';
      alert(errorMsg);
    } finally {
      setLoadingAction(false);
    }
  };

  // ❌ Confirmar e Excluir paciente
  const confirmarExclusaoPaciente = async () => {
    if (!pacienteParaExcluir?.paciente_id) return;

    setLoadingAction(true);
    try {
      await api.delete(`/pacientes/${pacienteParaExcluir.paciente_id}`);
      // Remove o paciente da lista local
      setPacientes(prevPacientes => prevPacientes.filter(p => p.paciente_id !== pacienteParaExcluir.paciente_id));
      alert('Paciente excluído com sucesso!');
      handleCloseModal(); // Fecha o modal de confirmação de exclusão
    } catch (err) {
      console.error('Erro ao excluir paciente:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erro ao excluir paciente.';
      alert(errorMsg);
    } finally {
      setLoadingAction(false);
    }
  };

  // 📤 Exportar Excel
  const exportarParaExcelBackend = () => {
    // Assume que api.defaults.baseURL está definido corretamente em api.js
    const backendBaseUrl = api.defaults.baseURL;
    // Certifique-se que seu backend tem o endpoint /pacientes/exportar_excel
    const exportUrl = `${backendBaseUrl}/pacientes/exportar_excel`; 
    console.log("Tentando exportar Excel de:", exportUrl);
    window.open(exportUrl, '_blank'); // Abre em uma nova aba para download
  };

  // 🔎 Filtro de busca (local)
  const pacientesFiltrados = pacientes.filter(p =>
    (p.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.cidade?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.paciente_id?.toString().includes(searchTerm)) // Busca por ID também
  );

  // Feedback inicial de carregamento ou erro
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
            <StyledButton onClick={() => navigate('/novo-cadastro')} className="primary"> {/* Ajuste o caminho se necessário */}
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

        {pacientesFiltrados.length === 0 && !loading ? ( // Adicionado !loading aqui
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
        maxWidth="850px" // Ajuste conforme o conteúdo do ViewPacienteModal
      >
        {loadingAction ? (
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
        maxWidth="950px" // Ajuste conforme o conteúdo do EditPacienteFormModal
      >
        {loadingAction ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando formulário...</div>
        ) : (
          selectedPaciente && (
            <EditPacienteFormModal
              pacienteInitialData={selectedPaciente} // Renomeado para clareza
              onSave={handleSaveChanges}
              onClose={handleCloseModal}
            />
          )
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirmar Exclusão"
        maxWidth="450px" // Um modal menor para confirmação
      >
        {pacienteParaExcluir && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Deseja realmente excluir o paciente:</p>
            <p><strong>{pacienteParaExcluir.nome_completo}</strong> (ID: {pacienteParaExcluir.paciente_id})?</p>
            <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <StyledButton onClick={handleCloseDeleteModal} className="secondary">
                Cancelar
              </StyledButton>
              <StyledButton 
                onClick={confirmarExclusaoPaciente} 
                className="danger" // Você precisará de um estilo para .danger ou use uma prop de cor
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