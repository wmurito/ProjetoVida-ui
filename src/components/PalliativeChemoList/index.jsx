import React from 'react';
import { Button } from '../../pages/Cadastro/styles'; // Reutilize seu botão

const PalliativeChemoList = ({ chemos, onEdit, onRemove }) => {
    if (!chemos || chemos.length === 0) {
        return <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px 0' }}>Nenhum registro de quimioterapia paliativa adicionado.</p>;
    }
    return (
        <div style={{ width: '100%', marginTop: '15px' }}>
            {chemos.map((chemo, index) => (
                <div key={index} style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px', marginBottom: '10px', background: '#f8f9fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #dee2e6', paddingBottom: '10px' }}>
                        <strong style={{ color: '#495057' }}>{chemo.linha_tratamento_paliativo}</strong>
                        <div>
                            <Button type="button" onClick={() => onEdit(chemo, index)} style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '10px' }}>Editar</Button>
                            <Button type="button" onClick={() => onRemove(index)} style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#ff7bac', hover: {background: '#ff6ba0'} }}>Remover</Button>
                        </div>
                    </div>
                    <div>
                        <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> {chemo.qual_quimioterapia_paliativa}</p>
                        <p style={{ margin: '5px 0' }}><strong>Início:</strong> {chemo.inicio_quimioterapia_paliativa}</p>
                        <p style={{ margin: '5px 0' }}><strong>Fim:</strong> {chemo.fim_quimioterapia_paliativa || 'N/A'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PalliativeChemoList;