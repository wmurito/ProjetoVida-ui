import React, { useState, useEffect, memo } from 'react';
import { sanitizeInput, validateInput, detectAttack } from '../../services/securityConfig';
import { toast } from 'react-toastify';
import { rateLimiter } from '../../services/rateLimiter';

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
      
      toast.success('Paciente atualizado com sucesso!');
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
    <div onClick={handleClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827'
          }}>Editar Paciente</h2>
          <button 
            onClick={handleClose}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#6b7280',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="nome" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>Nome Completo *</label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              maxLength={100}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: loading ? '#f9fafb' : 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff7bac'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            {errors.nome && <span style={{
              display: 'block',
              marginTop: '6px',
              fontSize: '13px',
              color: '#ef4444'
            }}>{errors.nome}</span>}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <label htmlFor="cpf" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>CPF</label>
              <input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                maxLength={14}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff7bac'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              {errors.cpf && <span style={{
                display: 'block',
                marginTop: '6px',
                fontSize: '13px',
                color: '#ef4444'
              }}>{errors.cpf}</span>}
            </div>

            <div>
              <label htmlFor="dataNascimento" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>Data de Nascimento</label>
              <input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff7bac'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                maxLength={255}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff7bac'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              {errors.email && <span style={{
                display: 'block',
                marginTop: '6px',
                fontSize: '13px',
                color: '#ef4444'
              }}>{errors.email}</span>}
            </div>

            <div>
              <label htmlFor="telefone" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>Telefone</label>
              <input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                maxLength={15}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: loading ? '#f9fafb' : 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff7bac'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              {errors.telefone && <span style={{
                display: 'block',
                marginTop: '6px',
                fontSize: '13px',
                color: '#ef4444'
              }}>{errors.telefone}</span>}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="endereco" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>Endereço</label>
            <textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              maxLength={500}
              rows={3}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: loading ? '#f9fafb' : 'white',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff7bac'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            {errors.endereco && <span style={{
              display: 'block',
              marginTop: '6px',
              fontSize: '13px',
              color: '#ef4444'
            }}>{errors.endereco}</span>}
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button 
              type="button" 
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '500',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '12px 32px',
                fontSize: '15px',
                fontWeight: '500',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#ff7bac',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#ff5a94')}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff7bac'}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(EditModal);
