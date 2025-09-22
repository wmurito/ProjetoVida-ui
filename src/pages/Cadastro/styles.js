import styled from 'styled-components';
import { tokens, Button as BaseButton, Input as BaseInput, Select as BaseSelect, Checkbox as BaseCheckbox, Label as BaseLabel, Card, Grid as BaseGrid } from '../../components/UI';

export const Container = styled.div`
  height: 100%; 
  display: flex;
  flex-direction: column;
`;

export const FormContainer = styled.form`
  background: white;
  padding: 25px 35px;
  border-radius: 10px;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  flex-grow: 1; 
  padding-bottom: 100px; /* Espaço para o botão fixo */
`;

export const Section = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 10px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #343a40;
  font-weight: 600;
  padding-bottom: 4px;
  border-bottom: 2px solid #b01950ff;
  display: inline-block;
`;

export const FormGrid = styled(BaseGrid).attrs({ cols: 6 })`
  gap: ${tokens.spacing.sm} ${tokens.spacing.md};
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; 
`;

export const InputLabel = styled(BaseLabel)`
  margin-bottom: ${tokens.spacing.xs};
  font-size: ${tokens.typography.sm};
`;

const inputStyles = `
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #b01950ff;
    box-shadow: 0 0 0 2px rgba(176, 25, 80, 0.1);
  }
`;
export const StyledInput = styled(BaseInput)`
  /* Herda do sistema base */
`;

export const StyledSelect = styled(BaseSelect)`
  /* Herda do sistema base */
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
`;

export const StyledCheckbox = styled(BaseCheckbox)`
  /* Herda do sistema base */
`;

export const Button = styled(BaseButton)`
  /* Herda do sistema base */
`;

export const FixedSubmitButton = styled.div`
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: center;
  z-index: 10;
`;

// --- Estilos para Listas Repetitivas (Quimio, Radio, etc.) ---
export const ListContainer = styled.div`
    width: 100%;
    margin-top: 0.5rem;
    position: relative;
    padding: 15px;
    border: 1px solid #eef0f2;
    background-color: #fcfdff;
    border-radius: 6px;
    margin-bottom: 10px;
`;

export const AddMoreButton = styled.button`
  background-color: #fce4ec;
  color: #b71550;
  border: 1px solid #f8bbd0;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;

  &:hover {
    background-color: #f8bbd0;
  }
`;

export const ActionButtons = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
`;

export const RemoveButton = styled.button`
    background: transparent;
    color: #adb5bd;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 5px;
    
    &:hover {
        color: #dc3545;
    }
`;

// --- Abas e Mensagens ---
export const TabNav = styled.div`
    display: flex;
    flex-wrap: wrap;
    border-bottom: 2px solid #dee2e6;
    margin-bottom: 10px;
`;

export const TabButton = styled.button`
    padding: 14px 22px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #6c757d;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease-in-out;
    margin-bottom: -2px;

    ${({ $isActive }) =>
        $isActive && `
        color: #b01950ff;
        border-bottom-color: #b01950ff;
        font-weight: 600;
    `}

    &:hover {
        background-color: #f8f9fa;
    }
`;

export const SuccessMessage = styled.div`
  margin-bottom: ${tokens.spacing.md};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  background-color: #d1e7dd;
  border: 1px solid #badbcc;
  color: #0f5132;
  border-radius: ${tokens.radius.lg};
  text-align: center;
`;

export const ApiErrorContainer = styled.div`
  margin-bottom: ${tokens.spacing.md};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
  border-radius: ${tokens.radius.lg};
  text-align: left;
`;

export const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.8em;
  margin-top: 5px;
`;

export const SectionContent = styled(Card)`
  background: ${tokens.colors.surface};
  padding: ${tokens.spacing.md};
  margin-top: ${tokens.spacing.sm};
`;

export const AddMemberButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
  }
`;

// --- Estilos específicos para Tratamento ---
export const TreatmentSection = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const TreatmentSubSection = styled.div`
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const TreatmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f3f4;
`;

export const TreatmentTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  margin: 0;
`;

export const CompactButton = styled.button`
  background-color: ${props => props.variant === 'danger' ? '#dc3545' : '#b71550'};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#c82333' : '#a01446'};
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const TreatmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 10px 0;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const InlineGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
`;

// Subtítulo menor para seções dentro de tratamento
export const SubSectionTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 10px;
  color: #495057;
  font-weight: 600;
  padding-bottom: 3px;
  border-bottom: 1px solid #dee2e6;
  display: inline-block;
`;

// Container para subtítulo + botão
export const SubSectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

// Botão de adicionar menor e mais discreto
export const AddSubButton = styled.button`
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  
  &:hover {
    background-color: #bbdefb;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #9e9e9e;
    cursor: not-allowed;
  }
`;