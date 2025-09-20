import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  box-sizing: border-box;
  height: 100%; /* Usa altura disponível sem forçar 100vh */
`;

export const FormContainer = styled.form`
  background: white;
  padding: 10px 35px;
  border-radius: 10px;
  max-width: 100%;
  margin-bottom: 20px; /* Espaço no final para scroll */
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
`;

export const Section = styled.div`
  margin-bottom: 35px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 15px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.45rem; // Slightly smaller
  margin-bottom: 20px;
  color: #343a40; // Dark gray
  font-weight: 600;
  padding-bottom: 6px;
  border-bottom: 2px solid #b01950ff;
  display: inline-block;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); // 6 columns for fine control
  gap: 18px 20px; // Row gap, Column gap

  @media (max-width: 1200px) { // Larger tablets / Small desktops
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 768px) { // Tablets
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  @media (max-width: 576px) { // Mobile
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; 
  justify-content: center; // Better for checkbox alignment when it's the only child
`;

export const InputLabel = styled.label`
  margin-bottom: 6px; // Reduced margin
  font-weight: 500;
  font-size: 0.85rem; // Smaller label
  color: #495057;
`;

const inputStyles = `
  padding: 9px 12px; // Adjusted padding
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 0.95rem; // Slightly smaller input text
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
  }

  &::placeholder {
    color: #adb5bd;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    color: #6c757d;
  }
`;
const inputStyles2 = `
  padding: 9px 12px; // Adjusted padding
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 0.95rem; // Slightly smaller input text
  box-sizing: border-box;
  width: 40%;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
  }

  &::placeholder {
    color: #adb5bd;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    color: #6c757d;
  }
`;

export const StyledInput = styled.input`
  ${inputStyles}
`;

export const StyledInput2 = styled.input`
  ${inputStyles2}
`;

export const StyledSelect = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23495057%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.4-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: .6em auto;
  padding-right: 28px;
`;

export const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 8px;
  width: 17px;
  height: 17px;
  cursor: pointer;
  accent-color: #4f46e5;
  vertical-align: middle; // Better alignment with text

  &:focus {
    outline: 2px solid rgba(79, 70, 229, 0.25);
    outline-offset: 1px;
  }
`;

export const CheckboxContainer = styled.div`
  /* This container might be less used if checkboxes are direct grid items */
  /* Kept for flexibility if needed for a specific group */
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-bottom: 12px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  user-select: none;
  height: 100%; // Fill FieldContainer height
`;

export const Button = styled.button`
  background-color: #b71550;
  color: white;
  padding: 11px 26px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease;

  &:hover {
    background-color: #d81b60;
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const FixedSubmitButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  padding-bottom: 15px;
`;

export const SuccessMessage = styled.div`
  margin-top: 18px;
  padding: 10px 14px;
  background-color: #d1e7dd; // Bootstrap success background
  border: 1px solid #badbcc; // Bootstrap success border
  color: #0a3622; // Bootstrap success text
  border-radius: 5px;
  text-align: center;
`;

export const ErrorText = styled.div`
  color: #dc3545; // Bootstrap danger color
  font-size: 0.8em;
  margin-top: 5px;
  width: 100%;
`;

export const ApiErrorContainer = styled.div`
  grid-column: 1 / -1;
  margin-top: 18px;
  padding: 10px 14px;
  background-color: #f8d7da; // Bootstrap danger background
  border: 1px solid #f5c2c7; // Bootstrap danger border
  color: #58151c; // Bootstrap danger text
  border-radius: 5px;
  text-align: left;
`;

export const SectionContent = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  margin-top: 20px; /* Adicionado para separar do título */
  border: 1px solid #e9ecef;
`;

export const AddMemberButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
  min-height: 50px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 18px 20px;
    font-size: 1.1rem;
  }
`;

// Estilos para campos de textarea
export const TextAreaInput = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#e74c3c' : '#e1e5e9'};
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e74c3c' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

// Atualização do StyledInput para suportar textarea
export const StyledInputUpdated = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#e74c3c' : '#e1e5e9'};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#e74c3c' : '#667eea'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(231, 76, 60, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }

  &::placeholder {
    color: #a0a0a0;
  }

  /* Suporte para textarea */
  ${props => props.as === 'textarea' && `
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  `}
`;

// Estilos para indicadores de status
export const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.status) {
      case 'success':
        return `
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      case 'warning':
        return `
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        `;
      case 'danger':
        return `
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      default:
        return `
          background-color: #e2e3e5;
          color: #383d41;
          border: 1px solid #d6d8db;
        `;
    }
  }}
`;

// Estilos para loading states
export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Estilos responsivos adicionais
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    padding: 15px;
    
    ${FormGrid} {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    ${FieldContainer} {
      grid-column: span 1 !important;
    }
  }
`;

// Estilos para animações
export const FadeIn = styled.div`
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Estilos para tooltips (se necessário)
export const Tooltip = styled.div`
  position: relative;
  display: inline-block;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    white-space: nowrap;
    z-index: 1000;
    opacity: 1;
    transition: opacity 0.3s;
  }

  &:hover::before {
    content: '';
    position: absolute;
    bottom: 115%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #333;
    z-index: 1000;
  }
`;




export const AddMoreButton = styled.button`
  background-color: #fce4ec; /* Rosa bem claro */
  color: #d81b60; /* Rosa principal */
  border: 1px solid #f8bbd0; /* Borda rosa clara */
  padding: 8px 16px; /* Menor que o botão principal */
  border-radius: 20px; /* Mais arredondado */
  font-size: 0.9rem; /* Fonte menor */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;

  &:hover {
    background-color: #f8bbd0;
    color: #b71550;
    box-shadow: 0 2px 8px rgba(216, 27, 96, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const ListContainer = styled.div`
    width: 100%;
    margin-top: 15px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 10px;
`;

export const ListItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #e9ecef;

    &:last-child {
        border-bottom: none;
    }
`;

export const ListItemText = styled.div`
    font-size: 0.9rem;
    color: #495057;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
`;

export const EditButton = styled(Button)`
    background-color: #ffc107;
    color: #212529;

    &:hover {
        background-color: #e0a800;
    }
`;

export const RemoveButton = styled(Button)`
    background-color: #dc3545;
    color: white;

    &:hover {
        background-color: #c82333;
    }
`;

export const TabNav = styled.div`
    display: flex;
    flex-wrap: wrap; // Permite que as abas quebrem a linha em telas menores
    border-bottom: 2px solid #dee2e6;
    margin-bottom: 25px;
`;

export const TabButton = styled.button`
    padding: 12px 20px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #6c757d;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease-in-out;

    /* Estilo da aba ativa */
    ${({ $isActive }) =>
        $isActive &&
        `
        color: #e91e63; /* Cor rosa do tema */
        border-bottom-color: #e91e63;
        font-weight: 600;
    `}

    &:hover {
        background-color: #f8f9fa;
        color: #343a40;
    }
`;