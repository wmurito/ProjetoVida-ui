import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api, { getAuthToken } from '../../services/api';
import { FiX, FiActivity } from 'react-icons/fi';

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
        <div key={title} className="mb-6">
          <h3 className="text-lg font-semibold text-teal-600 border-b border-slate-200 pb-2 mb-4">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
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
                <div key={key} className="pb-2 border-b border-dotted border-slate-200 flex flex-col">
                  <strong className="text-sm font-semibold text-slate-500 mb-1 capitalize">{label}</strong>
                  <span className="text-sm text-slate-800 break-words">{displayValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="px-6 py-4">
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-600 border-b border-slate-200 pb-2 mb-4">Familiares</h3>
            {data.familiares.map((familiar, index) => (
              <div key={index} className="mb-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-600 mb-3">Familiar {index + 1}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  {Object.entries(familiar).map(([key, value]) => {
                    if (['id_familiar', 'id_paciente'].includes(key) || !value) return null;

                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                    const displayValue = typeof value === 'boolean' ? formatBoolean(value) : value;

                    return (
                      <div key={key} className="flex flex-col">
                        <strong className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">{label}</strong>
                        <span className="text-sm text-slate-800">{displayValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tratamento */}
        {data.tratamento && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-600 border-b border-slate-200 pb-2 mb-4">Tratamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {Object.entries(data.tratamento).map(([key, value]) => {
                const hiddenKeys = ['id_tratamento', 'id_paciente', 'cirurgias', 'quimioterapia', 'radioterapia', 'endocrinoterapia', 'imunoterapia', 'imunohistoquimicas', 'core_biopsy', 'mamotomia', 'paaf'];
                if (hiddenKeys.includes(key) || !value || value === '') return null;

                const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                let displayValue = value;

                if (typeof value === 'boolean') {
                  displayValue = formatBoolean(value);
                } else if (key.includes('data') && value) {
                  displayValue = formatDate(value);
                }

                return (
                  <div key={key} className="pb-2 border-b border-dotted border-slate-200 flex flex-col">
                    <strong className="text-sm font-semibold text-slate-500 mb-1 capitalize">{label}</strong>
                    <span className="text-sm text-slate-800 break-words">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Desfecho */}
        {data.desfecho && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-teal-600 border-b border-slate-200 pb-2 mb-4">Desfecho</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
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
                  <div key={key} className="pb-2 border-b border-dotted border-slate-200 flex flex-col">
                    <strong className="text-sm font-semibold text-slate-500 mb-1 capitalize">{label}</strong>
                    <span className="text-sm text-slate-800 break-words">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!paciente) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiActivity className="text-teal-500" /> Detalhes do Paciente: <span className="text-teal-700">{pacienteData ? pacienteData.nome_completo : 'Carregando...'}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          ) : pacienteData ? (
            renderDetails(pacienteData)
          ) : (
            <div className="flex justify-center items-center h-64 text-slate-500 flex-col">
              <p className="text-lg">Dados não encontrados.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
