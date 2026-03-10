import React, { useEffect, memo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiX, FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { usePaciente, useUpdatePaciente } from '../../hooks/usePaciente';

// Schema de validação dos procedimentos
const procedimentoSchema = z.object({
  tipo: z.string().min(1, 'Tipo de procedimento obrigatório'),
  data: z.string().min(1, 'Data obrigatória'),
  observacoes: z.string().optional()
});

// Schema de validação do paciente
const pacienteSchema = z.object({
  id_paciente: z.string().optional(),
  nome_completo: z.string().min(1, 'Nome é obrigatório').max(100),
  cpf: z.string().max(14).optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().max(15).optional().or(z.literal('')),
  endereco: z.string().max(500).optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
  historico_procedimentos: z.array(procedimentoSchema).default([])
});

const EditModal = ({ paciente, onClose, onSave }) => {
  // Buscar os dados completos do paciente pelo ID para preencher os procedimentos
  const { data: pacienteCompleto, isLoading: isFetching } = usePaciente(paciente?.id_paciente);
  const { mutateAsync: updatePacienteApi, isPending: isUpdating } = useUpdatePaciente();

  const loading = isFetching || isUpdating;

  // Inicializar React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      id_paciente: paciente?.id_paciente || '',
      nome_completo: paciente?.nome_completo || '',
      cpf: paciente?.cpf || '',
      email: paciente?.email || '',
      telefone: paciente?.telefone || '',
      endereco: paciente?.endereco || '',
      data_nascimento: paciente?.data_nascimento ? paciente.data_nascimento.split('T')[0] : '',
      historico_procedimentos: []
    }
  });

  // Array dinâmico para os procedimentos (Data, Tipo, etc)
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'historico_procedimentos'
  });

  // Preencher os dados quando vier da API local (query de paciente individual)
  useEffect(() => {
    if (pacienteCompleto) {
      reset({
        id_paciente: pacienteCompleto.id_paciente || '',
        nome_completo: pacienteCompleto.nome_completo || '',
        cpf: pacienteCompleto.cpf || '',
        email: pacienteCompleto.email || '',
        telefone: pacienteCompleto.telefone || '',
        endereco: pacienteCompleto.endereco || '',
        data_nascimento: pacienteCompleto.data_nascimento ? pacienteCompleto.data_nascimento.split('T')[0] : '',
        historico_procedimentos: pacienteCompleto.historico_procedimentos || []
      });
    }
  }, [pacienteCompleto, reset]);

  const onSubmit = async (data) => {
    try {
      // Usaremos o hook de mutation para fazer a chamada no back, caso não passe para o handler do pai
      await updatePacienteApi({
        id: paciente.id_paciente,
        data: data
      });

      // Chamar onSave para lidar com o sucesso visual (toasts, close)
      if (onSave) {
        onSave(data);
      } else {
        toast.success('Paciente atualizado com sucesso!');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      if (error.response?.status === 403) {
        toast.error('Você não tem permissão para editar este paciente');
      } else if (error.response?.status === 409) {
        toast.error('Conflito de dados. Verifique se CPF ou email já estão em uso');
      } else {
        toast.error('Erro ao salvar alterações. Tente novamente');
      }
    }
  };

  if (!paciente) return null;

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiEdit3 className="text-teal-500" /> Editar Paciente
          </h2>
          <button
            onClick={() => onClose()}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Loader visível enquanto busca os dados detalhados */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Dados Gerais</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo *</label>
              <input
                {...register('nome_completo')}
                disabled={loading}
                className={`w-full px-4 py-2.5 bg-white border ${errors.nome_completo ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'} rounded-lg text-sm shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50`}
              />
              {errors.nome_completo && <span className="text-xs text-rose-500 mt-1">{errors.nome_completo.message}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">CPF</label>
                <input
                  {...register('cpf')}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-white border ${errors.cpf ? 'border-rose-500' : 'border-slate-300'} rounded-lg text-sm`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Data de Nascimento</label>
                <input
                  type="date"
                  {...register('data_nascimento')}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-white border ${errors.email ? 'border-rose-500' : 'border-slate-300'} rounded-lg text-sm`}
                />
                {errors.email && <span className="text-xs text-rose-500 mt-1">{errors.email.message}</span>}
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
                <input
                  type="tel"
                  {...register('telefone')}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço</label>
              <textarea
                {...register('endereco')}
                rows={2}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm resize-y"
              />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-slate-800">Histórico de Procedimentos</h3>
              <button
                type="button"
                onClick={() => append({ tipo: '', data: '', observacoes: '' })}
                className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md transition-colors"
              >
                <FiPlus /> Novo Procedimento
              </button>
            </div>

            <div className="space-y-4">
              {fields.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  Nenhum procedimento registrado para este paciente. Clique em "Novo Procedimento" para adicionar.
                </p>
              ) : (
                fields.map((field, index) => (
                  <div key={field.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative group">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Tipo de Procedimento *</label>
                        <select
                          {...register(`historico_procedimentos.${index}.tipo`)}
                          className={`w-full px-3 py-2 bg-white border ${errors.historico_procedimentos?.[index]?.tipo ? 'border-rose-500' : 'border-slate-300'} rounded-md text-sm`}
                        >
                          <option value="">Selecione...</option>
                          <option value="Mamografia">Mamografia</option>
                          <option value="Radioterapia">Radioterapia</option>
                          <option value="Endocrinoterapia">Endocrinoterapia</option>
                          <option value="Quimioterapia">Quimioterapia</option>
                          <option value="Cirurgia">Cirurgia</option>
                          <option value="Outro">Outro</option>
                        </select>
                        {errors.historico_procedimentos?.[index]?.tipo && (
                          <span className="text-xs text-rose-500 mt-1">{errors.historico_procedimentos[index].tipo.message}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Data *</label>
                        <input
                          type="date"
                          {...register(`historico_procedimentos.${index}.data`)}
                          className={`w-full px-3 py-2 bg-white border ${errors.historico_procedimentos?.[index]?.data ? 'border-rose-500' : 'border-slate-300'} rounded-md text-sm`}
                        />
                        {errors.historico_procedimentos?.[index]?.data && (
                          <span className="text-xs text-rose-500 mt-1">{errors.historico_procedimentos[index].data.message}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Observações</label>
                      <input
                        type="text"
                        placeholder="Detalhes adicionais..."
                        {...register(`historico_procedimentos.${index}.observacoes`)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onClose()}
              disabled={loading}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px]"
            >
              {isUpdating ? (
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
