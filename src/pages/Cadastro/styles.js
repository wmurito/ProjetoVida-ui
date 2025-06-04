import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background-color: #f8f9fa; // Lighter, cleaner background
  min-height: 100vh;
  box-sizing: border-box;
`;

export const FormContainer = styled.form`
  background: white;
  padding: 25px 35px; // Slightly adjusted padding
  border-radius: 10px;
  max-width: 1200px; // Max width for large forms
  margin: 20px auto;
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
  border-bottom: 2px solid #4f46e5;
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

export const StyledInput = styled.input`
  ${inputStyles}
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
  background-color: #4f46e5;
  color: white;
  padding: 11px 26px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease;

  &:hover {
    background-color: #3730a3;
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