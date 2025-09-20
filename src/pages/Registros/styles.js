// src/pages/ListaPacientes/StyledListaPacientes.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: #f5f7fa;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  color: #2c3e50;
  font-weight: 600;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 300px;

  &:focus {
    border-color: #d94c77;
    outline: none;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 0.95rem;
`;

export const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

export const TableRow = styled.tr``;

export const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
`;

export const ActionButton = styled.button`
  background-color: #d94c77;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c73a65;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: #6c757d;
`;

export const ErrorContainer = styled.div`
  text-align: center;
  margin-top: 3rem;
  color: #dc3545;
  font-size: 1.1rem;

  button {
    margin-top: 1rem;
  }
`;

export const NoDataContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #6c757d;
`;
