import React from 'react';
import { Button } from '../../pages/Cadastro/styles';

const allParentescoOptions = [
    { value: 'pai', label: 'Pai' }, { value: 'avo_paterno', label: 'Avô Paterno' }, { value: 'avo_materno', label: 'Avô Materno' },
    { value: 'irmao', label: 'Irmão' }, { value: 'tio_paterno', label: 'Tio Paterno' }, { value: 'tio_materno', label: 'Tio Materno' },
    { value: 'primo_paterno', label: 'Primo Paterno' }, { value: 'primo_materno', label: 'Primo Materno' }, { value: 'sobrinho', label: 'Sobrinho' },
    { value: 'filho', label: 'Filho' }, { value: 'mae', label: 'Mãe' }, { value: 'avo_paterna', label: 'Avó Paterna' },
    { value: 'avo_materna', label: 'Avó Materna' }, { value: 'irma', label: 'Irmã' }, { value: 'tia_paterna', label: 'Tia Paterna' },
    { value: 'tia_materna', label: 'Tia Materna' }, { value: 'prima_paterna', label: 'Prima Paterna' }, { value: 'prima_materna', label: 'Prima Materna' },
    { value: 'sobrinha', label: 'Sobrinha' }, { value: 'filha', label: 'Filha' },
];

// Cria um mapa para busca rápida do label a partir do value
const parentescoLabelMap = new Map(allParentescoOptions.map(opt => [opt.value, opt.label]));

const getParentescoLabel = (value) => {
    return parentescoLabelMap.get(value) || value; // Retorna o label ou o próprio valor se não for encontrado
};


const FamilyMembersList = ({ members, onEdit, onRemove }) => {
    if (!members || members.length === 0) {
        return (
            <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
                Nenhum membro da família adicionado.
            </p>
        );
    }

    return (
        <div style={{ width: '100%', marginTop: '15px' }}>
            {members.map((member, index) => (
                <div key={member.id || index} style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px', marginBottom: '10px', background: '#f8f9fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #dee2e6', paddingBottom: '10px' }}>
                        <strong style={{ color: '#495057', textTransform: 'capitalize' }}>
                            {/* Usa a função para obter o nome formatado */}
                            {getParentescoLabel(member.parentesco)}
                        </strong>
                        <div>
                            <Button type="button" onClick={() => onEdit(member, index)} style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '10px' }}>
                                Editar
                            </Button>
                            <Button type="button" onClick={() => onRemove(index)} style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#dc3545', borderColor: '#dc3545' }}>
                                Remover
                            </Button>
                        </div>
                    </div>
                    <div>
                        {member.idade && (
                            <p style={{ margin: '5px 0' }}>
                                <strong>Idade:</strong> {member.idade} anos
                            </p>
                        )}
                        <p style={{ margin: '5px 0' }}>
                            <strong>Câncer de mama:</strong> {member.tem_cancer_mama ? 'Sim' : 'Não'}
                        </p>
                        <p style={{ margin: '5px 0' }}>
                            <strong>Câncer de ovário:</strong> {member.tem_cancer_ovario ? 'Sim' : 'Não'}
                        </p>
                        <p style={{ margin: '5px 0' }}>
                            <strong>Gene BRCA:</strong> {member.gene_brca || 'Desconhecido'}
                        </p>
                        {member.tem_filha_com_historico !== null && (
                            <p style={{ margin: '5px 0' }}>
                                <strong>Filha com histórico:</strong> {member.tem_filha_com_historico ? 'Sim' : 'Não'}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FamilyMembersList;