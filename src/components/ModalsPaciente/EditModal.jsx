import React, { useState, useEffect, memo } from 'react';
import { sanitizeInput, detectAttack } from '../../services/securityConfig';
import { toast } from 'react-toastify';
import { rateLimiter } from '../../services/rateLimiter';
import { FiX, FiEdit3 } from 'react-icons/fi';

const EditModal = ({ paciente, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paciente) {
      setFormData({
        nome: sanitizeInput(paciente.nome_completo || ''),
        cpf: sanitizeInput(paciente.cpf || ''),
        email: sanitizeInput(paciente.email || ''),
        telefone: sanitizeInput(paciente.telefone || ''),
        endereco: sanitizeInput(paciente.endereco || ''),
        dataNascimento: paciente.data_nascimento || '',
      });
    }
  }, [paciente]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (detectAttack(formData.nome)) {
      newErrors.nome = 'Nome contém caracteres não permitidos';
    }

    if (formData.email && detectAttack(formData.email)) {
      newErrors.email = 'Email contém caracteres não permitidos';
    }

    Object.keys(formData).forEach(key => {
      if (formData[key] && detectAttack(formData[key])) {
        newErrors[key] = `${key} contém caracteres não permitidos`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value);

    if (detectAttack(value)) {
      toast.error('Entrada contém caracteres não permitidos');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem('userId') || 'anonymous';
    if (rateLimiter.isBlocked(userId)) {
      toast.error('Muitas tentativas. Aguarde antes de tentar novamente.');
      return;
    }

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      const sanitizedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = sanitizeInput(formData[key]);
        return acc;
      }, {});

      await onSave({
        ...paciente,
        ...sanitizedData
      });

      onClose();
    } catch (error) {
      console.error('Erro ao salvar paciente:', sanitizeInput(error.message));

      if (error.response?.status === 403) {
        toast.error('Você não tem permissão para editar este paciente');
      } else if (error.response?.status === 409) {
        toast.error('Conflito de dados. Verifique se CPF ou email já estão em uso');
      } else if (error.response?.status === 422) {
        toast.error('Dados inválidos. Verifique as informações inseridas');
      } else {
        toast.error('Erro ao salvar alterações. Tente novamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      toast.warning('Aguarde a conclusão da operação');
      return;
    }
    onClose();
  };

  if (!paciente) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiEdit3 className="text-teal-500" /> Editar Paciente
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
          <div className="mb-5">
            <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1.5">
              Nome Completo *
            </label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              maxLength={100}
              required
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-white border ${errors.nome ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 transition-colors`}
            />
            {errors.nome && <span className="block mt-1.5 text-xs font-medium text-rose-500">{errors.nome}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-slate-700 mb-1.5">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                maxLength={14}
                disabled={loading}
                className={`w-full px-4 py-2.5 bg-white border ${errors.cpf ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 transition-colors`}
              />
              {errors.cpf && <span className="block mt-1.5 text-xs font-medium text-rose-500">{errors.cpf}</span>}
            </div>

            <div>
              <label htmlFor="dataNascimento" className="block text-sm font-medium text-slate-700 mb-1.5">
                Data de Nascimento
              </label>
              <input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                maxLength={255}
                disabled={loading}
                className={`w-full px-4 py-2.5 bg-white border ${errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 transition-colors`}
              />
              {errors.email && <span className="block mt-1.5 text-xs font-medium text-rose-500">{errors.email}</span>}
            </div>

            <div className="lg:col-span-1">
              <label htmlFor="telefone" className="block text-sm font-medium text-slate-700 mb-1.5">
                Telefone
              </label>
              <input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                maxLength={15}
                disabled={loading}
                className={`w-full px-4 py-2.5 bg-white border ${errors.telefone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 transition-colors`}
              />
              {errors.telefone && <span className="block mt-1.5 text-xs font-medium text-rose-500">{errors.telefone}</span>}
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="endereco" className="block text-sm font-medium text-slate-700 mb-1.5">
              Endereço
            </label>
            <textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              maxLength={500}
              rows={3}
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-white border ${errors.endereco ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 transition-colors resize-y`}
            />
            {errors.endereco && <span className="block mt-1.5 text-xs font-medium text-rose-500">{errors.endereco}</span>}
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(EditModal);
