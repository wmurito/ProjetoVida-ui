// src/components/ModalsPaciente/FamilyMembersList/index.js
import React from 'react';
import {
  Container,
  EmptyState,
  EmptyIcon,
  EmptyText,
  MemberCard,
  MemberHeader,
  MemberTitle,
  MemberActions,
  EditButton,
  RemoveButton,
  MemberInfo,
  InfoRow,
  InfoLabel,
  InfoValue,
  StatusBadge,
  AgeInfo
} from './styles';

const FamilyMembersList = ({ 
  members = [], 
  onEdit, 
  onRemove 
}) => {
  if (!members || members.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyText>
            Nenhum membro da família foi adicionado ainda.
            <br />
            Clique em "Adicionar Membro da Família" para começar.
          </EmptyText>
        </EmptyState>
      </Container>
    );
  }

  const formatAge = (age) => {
    if (!age) return 'Não informado';
    return `${age} anos`;
  };

  const getStatusColor = (hasCancer) => {
    return hasCancer ? '#e74c3c' : '#27ae60';
  };

  const getStatusText = (hasCancer) => {
    return hasCancer ? 'Sim' : 'Não';
  };

  const getBrcaColor = (brca) => {
    switch (brca) {
      case 'BRCA1+':
      case 'BRCA2+':
        return '#e74c3c';
      case 'Testado, Normal':
        return '#27ae60';
      default:
        return '#f39c12';
    }
  };

  return (
    <Container>
      {members.map((member, index) => (
        <MemberCard key={index}>
          <MemberHeader>
            <div>
              <MemberTitle>{member.parentesco}</MemberTitle>
              <AgeInfo>{formatAge(member.idade)}</AgeInfo>
            </div>
            <MemberActions>
              <EditButton 
                type="button" 
                onClick={() => onEdit(member, index)}
                title="Editar membro"
              >
                ✏️
              </EditButton>
              <RemoveButton 
                type="button" 
                onClick={() => onRemove(index)}
                title="Remover membro"
              >
                🗑️
              </RemoveButton>
            </MemberActions>
          </MemberHeader>

          <MemberInfo>
            <InfoRow>
              <InfoLabel>Câncer de Mama:</InfoLabel>
              <StatusBadge color={getStatusColor(member.tem_cancer_mama)}>
                {getStatusText(member.tem_cancer_mama)}
              </StatusBadge>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Câncer de Ovário:</InfoLabel>
              <StatusBadge color={getStatusColor(member.tem_cancer_ovario)}>
                {getStatusText(member.tem_cancer_ovario)}
              </StatusBadge>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Gene BRCA:</InfoLabel>
              <StatusBadge color={getBrcaColor(member.gene_brca)}>
                {member.gene_brca}
              </StatusBadge>
            </InfoRow>

            {member.tem_filha_com_historico !== undefined && (
              <InfoRow>
                <InfoLabel>Filha com histórico:</InfoLabel>
                <StatusBadge color={getStatusColor(member.tem_filha_com_historico)}>
                  {getStatusText(member.tem_filha_com_historico)}
                </StatusBadge>
              </InfoRow>
            )}
          </MemberInfo>
        </MemberCard>
      ))}
    </Container>
  );
};

export default FamilyMembersList;
