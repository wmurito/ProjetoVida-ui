import React, { useState, useEffect } from 'react';

const PalliativeChemoModal = ({ isOpen, onClose, onSubmit, chemoData }) => {
    const initialState = {
        linha_tratamento_paliativo: '',
        qual_quimioterapia_paliativa: '',
        inicio_quimioterapia_paliativa: '',
        fim_quimioterapia_paliativa: ''
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (chemoData) {
            setFormData(chemoData);
        } else {
            setFormData(initialState);
        }
    }, [chemoData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.linha_tratamento_paliativo || !formData.linha_tratamento_paliativo.trim()) {
            alert('Por favor, informe a linha de tratamento.');
            return;
        }

        if (!formData.qual_quimioterapia_paliativa || !formData.qual_quimioterapia_paliativa.trim()) {
            alert('Por favor, informe o esquema de quimioterapia.');
            return;
        }

        if (!formData.inicio_quimioterapia_paliativa) {
            alert('Por favor, informe a data de início.');
            return;
        }

        try {
            onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar quimioterapia paliativa:', error);
            alert('Erro ao salvar os dados. Por favor, tente novamente.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-5">
                    <h2 className="m-0 text-slate-800 text-xl font-bold">
                        {chemoData ? 'Editar' : 'Adicionar'} Quimio Paliativa
                    </h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-slate-500 hover:text-slate-900 text-3xl cursor-pointer leading-none transition-colors"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-slate-600 text-sm">Linha de Tratamento</label>
                        <input
                            name="linha_tratamento_paliativo"
                            value={formData.linha_tratamento_paliativo}
                            onChange={handleChange}
                            className="p-2.5 border border-slate-300 rounded-md text-base transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-slate-600 text-sm">Qual Quimioterapia (Esquema)</label>
                        <input
                            name="qual_quimioterapia_paliativa"
                            value={formData.qual_quimioterapia_paliativa}
                            onChange={handleChange}
                            className="p-2.5 border border-slate-300 rounded-md text-base transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-slate-600 text-sm">Data de Início</label>
                        <input
                            type="date"
                            name="inicio_quimioterapia_paliativa"
                            value={formData.inicio_quimioterapia_paliativa}
                            onChange={handleChange}
                            className="p-2.5 border border-slate-300 rounded-md text-base transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-slate-600 text-sm">Data de Fim (opcional)</label>
                        <input
                            type="date"
                            name="fim_quimioterapia_paliativa"
                            value={formData.fim_quimioterapia_paliativa}
                            onChange={handleChange}
                            className="p-2.5 border border-slate-300 rounded-md text-base transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-md transition-colors cursor-pointer border-none"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-md transition-colors cursor-pointer border-none shadow-sm"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PalliativeChemoModal;
