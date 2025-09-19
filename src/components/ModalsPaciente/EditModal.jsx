import React, { useState, useEffect, memo } from 'react';
import { sanitizeInput, validateInput, detectAttack } from '../../services/securityConfig';
import { toast } from 'react-toastify';
import { t } from '../../i18n';

const EditModal = ({ paciente, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    // Adicione outros campos conforme necessário
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paciente) {
      // Sanitizar dados do paciente antes de carregar no formulário
      setFormData({
        nome: sanitizeInput(paciente.nome || ''),
        cpf: sanitizeInput(paciente.cpf || ''),
        email: sanitizeInput(paciente.email || ''),
        telefone: sanitizeInput(paciente.telefone || ''),
        endereco: sanitizeInput(paciente.endereco || ''),
        dataNascimento: paciente.dataNascimento || '',
      });
    }
  }, [paciente]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (!validateInput(formData.nome, 'name', 100)) {
      newErrors.nome = 'Nome inválido (apenas letras e espaços, 2-100 caracteres)';
    } else if (detectAttack(formData.nome)) {
      newErrors.nome = 'Nome contém caracteres não permitidos';
    }

    // Validar CPF
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateInput(formData.cpf, 'cpf')) {
      newErrors.cpf = 'CPF inválido';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateInput(formData.email, 'email', 255)) {
      newErrors.email = 'Email inválido';
    } else if (detectAttack(formData.email)) {
      newErrors.email = 'Email contém caracteres não permitidos';
    }

    // Validar telefone
    if (formData.telefone && !validateInput(formData.telefone, 'phone')) {
      newErrors.telefone = 'Telefone inválido';
    }

    // Validar outros campos
    Object.keys(formData).forEach(key => {
      if (formData[key] && detectAttack(formData[key])) {
        newErrors[key] = `${key} contém caracteres não permitidos`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Sanitizar entrada em tempo real
    const sanitizedValue = sanitizeInput(value);
    
    // Detectar tentativas de ataque
    if (detectAttack(value)) {
      toast.error('Entrada contém caracteres não permitidos');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // Limpar erro do campo se existir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    
    try {
      // Sanitizar todos os dados antes de enviar
      const sanitizedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = sanitizeInput(formData[key]);
        return acc;
      }, {});

      await onSave({
        ...paciente,
        ...sanitizedData
      });
      
      toast.success('Paciente atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar paciente:', sanitizeInput(error.message));
      
      // Tratamento específico de erros
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

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('editPatient')}</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nome">{t('name')} *</label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              maxLength={100}
              required
              disabled={loading}
            />
            {errors.nome && <span className="error">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cpf">{t('cpf')} *</label>
            <input
              id="cpf"
              type="text"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              maxLength={14}
              required
              disabled={loading}
            />
            {errors.cpf && <span className="error">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('email')} *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              maxLength={255}
              required
              disabled={loading}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefone">{t('phone')}</label>
            <input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              maxLength={15}
              disabled={loading}
            />
            {errors.telefone && <span className="error">{errors.telefone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endereco">{t('address')}</label>
            <textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              maxLength={500}
              rows={3}
              disabled={loading}
            />
            {errors.endereco && <span className="error">{errors.endereco}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">{t('birthDate')}</label>
            <input
              id="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose}
              disabled={loading}
              className="cancel-button"
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="save-button"
            >
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(EditModal);