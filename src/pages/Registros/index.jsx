import React, { useState, useEffect } from 'react';
import { getPacientes, testPacientesEndpoint } from '../../services/api';
import { sanitizeInput } from '../../services/securityConfig';
import { toast } from 'react-toastify';
import EditModal from '../../components/ModalsPaciente/EditModal';
import ViewModal from '../../components/ModalsPaciente/ViewModal';
import {
  Container,
  Header,
  Title,
  SearchContainer,
  SearchInput,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ActionButton,
  LoadingContainer,
  ErrorContainer,
  NoDataContainer
} from './styles';

const Registros = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando carregamento de pacientes...');
      const response = await getPacientes(0, 100);
      
      console.log('Dados recebidos:', response.data);
      const pacientesData = response.data || [];
      
      // Verificar se os dados estão no formato esperado
      if (Array.isArray(pacientesData)) {
        setPacientes(pacientesData);
        console.log(`${pacientesData.length} pacientes carregados com sucesso`);
      } else {
        console.warn('Formato de dados inesperado:', pacientesData);
        setPacientes([]);
      }
      
    } catch (err) {
      // Log seguro com sanitização
      console.error('Erro ao carregar pacientes:', {
        message: sanitizeInput(err.message || 'Erro desconhecido'),
        timestamp: new Date().toISOString(),
        status: err.response?.status,
        data: err.response?.data
      });
      
      // Tratamento específico de erros
      if (err.response?.status === 403) {
        setError('Você não tem permissão para visualizar os registros de pacientes.');
        toast.error('Acesso negado aos registros de pacientes.');
      } else if (err.response?.status === 401) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
        toast.error('Sessão expirada. Redirecionando...');
      } else if (err.name === 'NetworkError') {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
        toast.error('Erro de conexão com o servidor.');
      } else {
        setError('Erro ao carregar registros. Tente novamente em alguns instantes.');
        toast.error('Erro ao carregar registros de pacientes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = sanitizeInput(event.target.value);
    setSearchTerm(value);
  };

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.telefone?.includes(searchTerm) ||
    paciente.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (paciente, type) => {
    setSelectedPaciente(paciente);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedPaciente(null);
    setModalType(null);
  };

  const handleSave = async (updatedPaciente) => {
    try {
      // Aqui você implementaria a lógica de salvar
      // await updatePaciente(updatedPaciente.id, updatedPaciente);
      toast.success('Paciente atualizado com sucesso!');
      closeModal();
      loadPacientes(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao salvar paciente:', sanitizeInput(error.message));
      toast.error('Erro ao salvar alterações. Tente novamente.');
    }
  };

  const handleTestEndpoint = async () => {
    try {
      console.log('Testando endpoint de pacientes...');
      const response = await testPacientesEndpoint();
      
      if (response.data.status === 'success') {
        toast.success(`Teste bem-sucedido! ${response.data.total_pacientes} pacientes encontrados na tabela.`);
        console.log('Dados do teste:', response.data);
      } else {
        toast.error(`Erro no teste: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erro no teste de endpoint:', error);
      toast.error('Erro ao testar endpoint. Verifique o console para mais detalhes.');
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div>Carregando registros...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <div>{error}</div>
        <ActionButton onClick={loadPacientes}>
          Tentar Novamente
        </ActionButton>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Registros de Pacientes</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Buscar por nome, telefone ou cidade..."
            value={searchTerm}
            onChange={handleSearch}
            maxLength={100}
          />
          <ActionButton onClick={handleTestEndpoint} style={{ marginLeft: '10px' }}>
            Testar Conexão
          </ActionButton>
        </SearchContainer>
      </Header>

      {filteredPacientes.length === 0 ? (
        <NoDataContainer>
          <div>Nenhum paciente encontrado</div>
        </NoDataContainer>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Data Nascimento</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {filteredPacientes.map((paciente) => (
              <TableRow key={paciente.id_paciente}>
                <TableCell>{sanitizeInput(paciente.nome_completo || '')}</TableCell>
                <TableCell>{paciente.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString('pt-BR') : ''}</TableCell>
                <TableCell>{sanitizeInput(paciente.cidade || '')}</TableCell>
                <TableCell>{sanitizeInput(paciente.telefone || '')}</TableCell>
                <TableCell>
                  <ActionButton onClick={() => openModal(paciente, 'view')}>
                    Visualizar
                  </ActionButton>
                  <ActionButton onClick={() => openModal(paciente, 'edit')}>
                    Editar
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}

      {modalType === 'view' && selectedPaciente && (
        <ViewModal
          paciente={selectedPaciente}
          onClose={closeModal}
        />
      )}

      {modalType === 'edit' && selectedPaciente && (
        <EditModal
          paciente={selectedPaciente}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </Container>
  );
};

export default Registros;