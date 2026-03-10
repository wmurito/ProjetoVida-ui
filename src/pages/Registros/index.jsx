import React, { useState } from 'react';
import { usePacientes } from '../../hooks/usePacientes';
import { sanitizeInput } from '../../services/securityConfig';
import { toast } from 'react-toastify';
import EditModal from '../../components/ModalsPaciente/EditModal';
import ViewModal from '../../components/ModalsPaciente/ViewModal';
import { FiSearch, FiEye, FiEdit2, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const Registros = () => {
  const { data: pacientes = [], isLoading: loading, error: queryError, refetch: loadPacientes } = usePacientes(0, 100);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [modalType, setModalType] = useState(null);

  React.useEffect(() => {
    if (queryError) {
      if (queryError.response?.status === 403) {
        setError('Você não tem permissão para visualizar os registros de pacientes.');
        toast.error('Acesso negado aos registros de pacientes.');
      } else if (queryError.response?.status === 401) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
        toast.error('Sessão expirada. Redirecionando...');
      } else if (queryError.name === 'NetworkError') {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
        toast.error('Erro de conexão com o servidor.');
      } else {
        setError('Erro ao carregar registros. Tente novamente em alguns instantes.');
        toast.error('Erro ao carregar registros de pacientes.');
      }
    } else {
      setError(null);
    }
  }, [queryError]);

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

  const handleSave = () => {
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 animate-pulse">
        <FiRefreshCw className="w-8 h-8 animate-spin mb-4 text-teal-500" />
        <span className="text-lg font-medium">Carregando registros...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center mt-8">
        <FiAlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <p className="text-lg text-rose-600 font-medium mb-4">{error}</p>
        <button
          onClick={loadPacientes}
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <FiRefreshCw /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-fadeIn flex flex-col h-full bg-slate-50 relative pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Registros de Pacientes</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie os históricos e informações cadastrais na base.</p>
        </div>

        <div className="relative w-full md:w-80 lg:w-96 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            placeholder="Buscar por nome, telefone ou cidade..."
            value={searchTerm}
            onChange={handleSearch}
            maxLength={100}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden flex-grow flex flex-col">
        {filteredPacientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <FiSearch className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-lg font-medium">Nenhum paciente encontrado</p>
            <p className="text-sm">Tente ajustar seus termos de busca</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-sm text-slate-600">Nome do Paciente</th>
                  <th className="py-3 px-4 font-semibold text-sm text-slate-600">Data de Nascimento</th>
                  <th className="py-3 px-4 font-semibold text-sm text-slate-600">Cidade</th>
                  <th className="py-3 px-4 font-semibold text-sm text-slate-600">Telefone</th>
                  <th className="py-3 px-4 font-semibold text-sm text-slate-600 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente.id_paciente} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">
                      {sanitizeInput(paciente.nome_completo || '-')}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {paciente.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {sanitizeInput(paciente.cidade || '-')}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {sanitizeInput(paciente.telefone || '-')}
                    </td>
                    <td className="py-3 px-4 text-sm text-right align-middle">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(paciente, 'view')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-xs font-medium"
                        >
                          <FiEye className="w-3.5 h-3.5" /> Visualizar
                        </button>
                        <button
                          onClick={() => openModal(paciente, 'edit')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 rounded-md transition-colors text-xs font-medium"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" /> Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Registros;
