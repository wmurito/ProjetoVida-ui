import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const TargetedTherapyModal = ({ isOpen, onClose, onSubmit, therapyData }) => {
    const initialState = {
        qual_terapia_alvo: '',
        inicio_terapia_alvo: '',
        fim_terapia_alvo: '',
    };

    const [currentTherapy, setCurrentTherapy] = useState(initialState);

    useEffect(() => {
        if (therapyData) {
            setCurrentTherapy({
                qual_terapia_alvo: therapyData.qual_terapia_alvo || '',
                inicio_terapia_alvo: therapyData.inicio_terapia_alvo || '',
                fim_terapia_alvo: therapyData.fim_terapia_alvo || '',
            });
        } else {
            setCurrentTherapy(initialState);
        }
    }, [therapyData, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTherapy(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!currentTherapy.qual_terapia_alvo || !currentTherapy.qual_terapia_alvo.trim()) {
            alert('Por favor, informe qual terapia alvo.');
            return;
        }

        if (!currentTherapy.inicio_terapia_alvo) {
            alert('Por favor, informe a data de início.');
            return;
        }

        try {
            onSubmit(currentTherapy);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar terapia alvo:', error);
            alert('Erro ao salvar os dados. Por favor, tente novamente.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4 backdrop-blur-sm animate-fadeIn">
            <div
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-[500px] flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-5 shrink-0">
                    <h2 className="m-0 text-slate-800 text-xl font-bold">
                        {therapyData ? 'Editar' : 'Adicionar'} Terapia Alvo
                    </h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-slate-400 hover:text-slate-700 text-2xl p-1 cursor-pointer transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-5 overflow-y-auto pr-2 pb-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-slate-700 text-sm">Qual Terapia Alvo?</label>
                        <input
                            type="text"
                            name="qual_terapia_alvo"
                            value={currentTherapy.qual_terapia_alvo}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                            placeholder="Ex: Trastuzumabe"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-slate-700 text-sm">Data de Início</label>
                        <input
                            type="date"
                            name="inicio_terapia_alvo"
                            value={currentTherapy.inicio_terapia_alvo}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-slate-700 text-sm">Data de Término (opcional)</label>
                        <input
                            type="date"
                            name="fim_terapia_alvo"
                            value={currentTherapy.fim_terapia_alvo}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 mt-4 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 border border-transparent rounded-lg text-white font-semibold bg-pink-600 hover:bg-pink-700 transition-colors cursor-pointer shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        <FaSave /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TargetedTherapyModal;
