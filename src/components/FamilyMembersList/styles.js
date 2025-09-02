import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;
`;

export const EmptyState = styled.p`
    color: #6c757d;
    text-align: center;
    padding: 20px 0;
    font-style: italic;
    grid-column: 1 / -1;
`;

export const MemberCard = styled.div`
    border: 1px solid #e9ecef;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    overflow: hidden;
`;

export const MemberHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
`;

export const MemberTitle = styled.h3`
    margin: 0;
    color: #343a40;
    font-size: ${props => props.isNiece ? '1rem' : '1.15rem'};
`;

export const AgeInfo = styled.span`
    font-size: 0.85rem;
    color: #6c757d;
    margin-left: 10px;
`;

export const MemberActions = styled.div`
    display: flex;
    gap: 10px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    transition: transform 0.2s;
    &:hover { transform: scale(1.2); }
`;

export const EditButton = styled(ActionButton)`
    color: #007bff;
`;

export const RemoveButton = styled(ActionButton)`
    color: #dc3545;
`;

export const MemberInfo = styled.div`
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 8px 15px;
`;

export const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
`;

export const InfoLabel = styled.span`
    color: #6c757d;
    font-weight: 500;
`;

export const InfoValue = styled.span`
    color: #212529;
    font-weight: 600;
`;

export const StatusBadge = styled.span`
    background-color: ${props => props.color};
    color: white;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
`;

export const NieceContainer = styled.div`
    padding: 0 15px 15px 15px;
    margin-top: 10px;
    border-top: 1px dashed #ccc;
    padding-top: 15px;
`;

export const NieceCard = styled.div`
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    & + & {
        margin-top: 10px;
    }
`;