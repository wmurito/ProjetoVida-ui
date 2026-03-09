import React, { useMemo } from 'react';


const containerStyle = { width: '100%', marginTop: '15px' };
const itemStyle = { border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px', marginBottom: '10px', background: '#f8f9fa' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #dee2e6', paddingBottom: '10px' };
const titleStyle = { color: '#495057' };
const editBtnStyle = { padding: '5px 10px', fontSize: '0.8rem', marginRight: '10px' };
const removeBtnStyle = { padding: '5px 10px', fontSize: '0.8rem', background: '#ff7bac' };
const textStyle = { margin: '5px 0' };

const PalliativeChemoList = ({ chemos, onEdit, onRemove }) => {
    if (!chemos || chemos.length === 0) {
        return <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px 0' }}>Nenhum registro de quimioterapia paliativa adicionado.</p>;
    }
    return (
        <div style={containerStyle}>
            {chemos.map((chemo, index) => (
                <div key={index} style={itemStyle}>
                    <div style={headerStyle}>
                        <strong style={titleStyle}>{chemo.linha_tratamento_paliativo}</strong>
                        <div>
                            <button type="button" onClick={() => onEdit(chemo, index)} className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium px-3 py-1 rounded text-xs transition-colors mr-2">Editar</button>
                            <button type="button" onClick={() => onRemove(index)} className="bg-rose-500 text-white hover:bg-rose-600 font-medium px-3 py-1 rounded text-xs transition-colors">Remover</button>
                        </div>
                    </div>
                    <div>
                        <p style={textStyle}><strong>Tipo:</strong> {chemo.qual_quimioterapia_paliativa}</p>
                        <p style={textStyle}><strong>Início:</strong> {chemo.inicio_quimioterapia_paliativa}</p>
                        <p style={textStyle}><strong>Fim:</strong> {chemo.fim_quimioterapia_paliativa || 'N/A'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PalliativeChemoList;
