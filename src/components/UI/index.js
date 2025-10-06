// Sistema de Design Unificado - Styled Components
import styled, { css } from 'styled-components';

// === TOKENS DE DESIGN ===
export const tokens = {
  colors: {
    primary: '#ff7bac',
    primaryHover: '#ff6ba0',
    secondary: '#667eea',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    muted: '#6c757d',
    border: '#dee2e6',
    background: '#ffffff',
    surface: '#f5f7fa'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  typography: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem'
  },
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 25px rgba(0,0,0,0.15)'
  }
};

// === MIXINS ===
const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.sm};
  border: none;
  border-radius: ${tokens.radius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const inputBase = css`
  width: 100%;
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.sm};
  font-size: ${tokens.typography.sm};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 2px rgba(255, 123, 172, 0.1);
  }
  
  &:disabled {
    background-color: ${tokens.colors.light};
    cursor: not-allowed;
  }
`;

// === COMPONENTES BASE ===

// Botões
export const Button = styled.button`
  ${buttonBase}
  padding: ${props => {
    switch(props.size) {
      case 'sm': return '6px 12px';
      case 'lg': return '12px 24px';
      default: return '8px 16px';
    }
  }};
  font-size: ${props => {
    switch(props.size) {
      case 'sm': return tokens.typography.xs;
      case 'lg': return tokens.typography.base;
      default: return tokens.typography.sm;
    }
  }};
  background-color: ${props => {
    switch(props.variant) {
      case 'secondary': return tokens.colors.secondary;
      case 'success': return tokens.colors.success;
      case 'warning': return tokens.colors.warning;
      case 'danger': return tokens.colors.danger;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return tokens.colors.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'outline': return tokens.colors.primary;
      case 'ghost': return tokens.colors.primary;
      default: return 'white';
    }
  }};
  border: ${props => {
    switch(props.variant) {
      case 'outline': return `1px solid ${tokens.colors.primary}`;
      case 'ghost': return '1px solid transparent';
      default: return 'none';
    }
  }};
  
  &:hover:not(:disabled) {
    background-color: ${props => {
      switch(props.variant) {
        case 'secondary': return '#5a6fd8';
        case 'success': return '#218838';
        case 'warning': return '#e0a800';
        case 'danger': return '#c82333';
        case 'outline': return tokens.colors.primary;
        case 'ghost': return tokens.colors.light;
        default: return tokens.colors.primaryHover;
      }
    }};
    color: white;
  }
`;

// Inputs
export const Input = styled.input`
  ${inputBase}
  padding: ${props => props.size === 'sm' ? '6px 10px' : '8px 12px'};
  font-size: ${props => props.size === 'sm' ? tokens.typography.xs : tokens.typography.sm};
`;

export const Select = styled.select`
  ${inputBase}
  padding: ${props => props.size === 'sm' ? '6px 10px' : '8px 12px'};
  font-size: ${props => props.size === 'sm' ? tokens.typography.xs : tokens.typography.sm};
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path fill="%23495057" d="M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  padding-right: 30px;
  appearance: none;
`;

export const Textarea = styled.textarea`
  ${inputBase}
  padding: 8px 12px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
`;

// Checkbox e Radio
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  margin-right: ${tokens.spacing.sm};
  cursor: pointer;
  accent-color: ${tokens.colors.primary};
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 16px;
  height: 16px;
  margin-right: ${tokens.spacing.sm};
  cursor: pointer;
  accent-color: ${tokens.colors.primary};
`;

// Labels
export const Label = styled.label`
  display: block;
  margin-bottom: ${tokens.spacing.xs};
  font-weight: 500;
  font-size: ${tokens.typography.sm};
  color: ${tokens.colors.dark};
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${tokens.typography.sm};
  color: ${tokens.colors.dark};
  user-select: none;
`;

// Containers
export const Card = styled.div`
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.lg};
  padding: ${props => props.padding || tokens.spacing.lg};
  box-shadow: ${tokens.shadows.sm};
`;

export const Container = styled.div`
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${tokens.spacing.md};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 'auto-fit'}, ${props => props.cols ? '1fr' : 'minmax(250px, 1fr)'});
  gap: ${props => props.gap || tokens.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || tokens.spacing.md};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
`;

// Typography
export const Heading = styled.h1`
  font-size: ${props => {
    switch(props.level) {
      case 2: return tokens.typography.xl;
      case 3: return tokens.typography.lg;
      case 4: return tokens.typography.base;
      default: return tokens.typography.xxl;
    }
  }};
  font-weight: 600;
  color: ${tokens.colors.dark};
  margin: 0 0 ${tokens.spacing.md} 0;
`;

export const Text = styled.p`
  font-size: ${props => {
    switch(props.size) {
      case 'sm': return tokens.typography.sm;
      case 'lg': return tokens.typography.lg;
      default: return tokens.typography.base;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'muted': return tokens.colors.muted;
      case 'success': return tokens.colors.success;
      case 'warning': return tokens.colors.warning;
      case 'danger': return tokens.colors.danger;
      default: return tokens.colors.dark;
    }
  }};
  margin: 0 0 ${tokens.spacing.sm} 0;
`;

// Alerts
export const Alert = styled.div`
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.radius.md};
  margin-bottom: ${tokens.spacing.md};
  background-color: ${props => {
    switch(props.variant) {
      case 'success': return '#d4edda';
      case 'warning': return '#fff3cd';
      case 'danger': return '#f8d7da';
      case 'info': return '#d1ecf1';
      default: return tokens.colors.light;
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'success': return '#c3e6cb';
      case 'warning': return '#ffeaa7';
      case 'danger': return '#f5c6cb';
      case 'info': return '#bee5eb';
      default: return tokens.colors.border;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'success': return '#155724';
      case 'warning': return '#856404';
      case 'danger': return '#721c24';
      case 'info': return '#0c5460';
      default: return tokens.colors.dark;
    }
  }};
`;

// Loading
export const Spinner = styled.div`
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  border: 2px solid ${tokens.colors.border};
  border-top: 2px solid ${tokens.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Modal Overlay
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: ${tokens.colors.background};
  border-radius: ${tokens.radius.lg};
  padding: ${tokens.spacing.xl};
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${tokens.shadows.lg};
`;