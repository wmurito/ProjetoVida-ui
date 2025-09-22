import styled from 'styled-components';
import { tokens, Button as BaseButton, Input as BaseInput, Card } from '../../components/UI';

export const Container = styled.div`
  padding: ${tokens.spacing.xl};
  background-color: ${tokens.colors.surface};
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
  font-size: ${tokens.typography.xxl};
  color: ${tokens.colors.dark};
  font-weight: 600;
  margin: 0;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchInput = styled(BaseInput)`
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${tokens.colors.background};
  font-size: ${tokens.typography.sm};
  border-radius: ${tokens.radius.lg};
  overflow: hidden;
  box-shadow: ${tokens.shadows.sm};
`;

export const TableHeader = styled.thead`
  background-color: ${tokens.colors.light};
`;

export const TableRow = styled.tr``;

export const TableCell = styled.td`
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.border};
  vertical-align: middle;
`;

export const ActionButton = styled(BaseButton).attrs({ size: 'sm' })`
  margin-right: ${tokens.spacing.sm};
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: ${tokens.typography.lg};
  color: ${tokens.colors.muted};
`;

export const ErrorContainer = styled.div`
  text-align: center;
  margin-top: ${tokens.spacing.xxl};
  color: ${tokens.colors.danger};
  font-size: ${tokens.typography.lg};

  button {
    margin-top: ${tokens.spacing.md};
  }
`;

export const NoDataContainer = styled.div`
  text-align: center;
  margin-top: ${tokens.spacing.xl};
  font-size: ${tokens.typography.lg};
  color: ${tokens.colors.muted};
`;
