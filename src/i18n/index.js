const translations = {
  pt: {
    editPatient: 'Editar Paciente',
    name: 'Nome',
    cpf: 'CPF',
    email: 'Email',
    phone: 'Telefone',
    address: 'Endereço',
    birthDate: 'Data de Nascimento',
    cancel: 'Cancelar',
    save: 'Salvar',
    saving: 'Salvando...',
    required: 'obrigatório',
    invalid: 'inválido',
    success: 'Operação realizada com sucesso!',
    error: 'Erro ao realizar operação',
    loading: 'Carregando...'
  }
};

let currentLanguage = 'pt';

export const t = (key) => {
  if (!key || typeof key !== 'string') {
    console.warn('Invalid translation key:', key);
    return '';
  }
  
  try {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (!k || typeof value !== 'object') {
        return key;
      }
      value = value[k];
    }
    
    return value !== undefined && value !== null ? value : key;
  } catch (error) {
    console.error('Translation error:', error);
    return key;
  }
};

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
  }
};

export const getCurrentLanguage = () => currentLanguage;