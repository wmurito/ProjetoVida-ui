import React, { useState, useEffect } from 'react';
import { FieldContainer, InputLabel, StyledInput, Button } from '../../pages/Cadastro/styles'; // Reutilize seus estilos!

const PalliativeChemoModal = ({ isOpen, onClose, onSubmit, chemoData }) => {
    const [formData, setFormData] = useState({
        linha_tratamento_paliativo: '',
        qual_quimioterapia_paliativa: '',
        inicio_quimioterapia_paliativa: '',
        fim_quimioterapia_paliativa: ''
    });

    useEffect(() => {
        if (chemoData) {
            setFormData(chemoData);
        } else {
            setFormData({
                linha_tratamento_paliativo: '',
                qual_quimioterapia_paliativa: '',
                inicio_quimioterapia_paliativa: '',
                fim_quimioterapia_paliativa: ''
            });
        }
    }, [chemoData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                <h2>{chemoData ? 'Editar' : 'Adicionar'} Quimioterapia Paliativa</h2>
                <form onSubmit={handleSubmit}>
                    <FieldContainer>
                        <InputLabel>Linha de Tratamento</InputLabel>
                        <StyledInput value={formData.linha_tratamento_paliativo} onChange={e => setFormData({...formData, linha_tratamento_paliativo: e.target.value})} />
                    </FieldContainer>
                    <FieldContainer>
                        <InputLabel>Qual Quimioterapia (Esquema)</InputLabel>
                        <StyledInput value={formData.qual_quimioterapia_paliativa} onChange={e => setFormData({...formData, qual_quimioterapia_paliativa: e.target.value})} />
                    </FieldContainer>
                    <FieldContainer>
                        <InputLabel>Data de Início</InputLabel>
                        <StyledInput type="date" value={formData.inicio_quimioterapia_paliativa} onChange={e => setFormData({...formData, inicio_quimioterapia_paliativa: e.target.value})} />
                    </FieldContainer>
                    <FieldContainer>
                        <InputLabel>Data de Fim</InputLabel>
                        <StyledInput type="date" value={formData.fim_quimioterapia_paliativa} onChange={e => setFormData({...formData, fim_quimioterapia_paliativa: e.target.value})} />
                    </FieldContainer>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="button" onClick={onClose} style={{ marginRight: '10px', background: '#6c757d' }}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PalliativeChemoModal;