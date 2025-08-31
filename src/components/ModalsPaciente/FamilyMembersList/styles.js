// src/components/ModalsPaciente/FamilyMembersList/styles.js
import styled from 'styled-components';

export const Container = styled.div`
  margin: 20px 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #dee2e6;
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.6;
`;

export const EmptyText = styled.p`
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
`;

export const MemberCard = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-left: 5px solid #667eea;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MemberHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const MemberTitle = styled.h4`
  margin: 0 0 5px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const AgeInfo = styled.span`
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
`;

export const MemberActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: 2px solid transparent;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const EditButton = styled(ActionButton)`
  &:hover {
    background-color: #e3f2fd;
    border-color: #2196f3;
  }
`;

export const RemoveButton = styled(ActionButton)`
  &:hover {
    background-color: #ffebee;
    border-color: #f44336;
  }
`;

export const MemberInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
`;

export const InfoValue = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

export const StatusBadge = styled.span`
  background-color: ${props => props.color};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

