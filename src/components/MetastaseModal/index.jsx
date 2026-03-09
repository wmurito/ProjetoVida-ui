import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const MetastaseModal = ({ isOpen, onClose, onSubmit, metastaseData }) => {
    const initialState = { data_metastase: '', local_metastase: '' };
    const [currentMetastase, setCurrentMetastase] = useState(initialState);

    useEffect(() => {
        if (metastaseData) {
            setCurrentMetastase({
                data_metastase: metastaseData.data_metastase || '',
                local_metastase: metastaseData.local_metastase || '',
            });
        } else {
            setCurrentMetastase(initialState);
        }
    }, [metastaseData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentMetastase(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!currentMetastase.local_metastase || !currentMetastase.local_metastase.trim()) {
            alert('Por favor, informe o local da metástase.');
            return;
        }

        if (!currentMetastase.data_metastase) {
            alert('Por favor, informe a data da metástase.');
            return;
        }

        try {
            onSubmit(currentMetastase);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar metástase:', error);
            alert('Erro ao salvar os dados. Por favor, tente novamente.');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-[500px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-5">
                    <h2 className="m-0 text-slate-800 text-xl font-bold">
                        {metastaseData ? 'Editar' : 'Adicionar'} Metástase
                    </h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-slate-400 hover:text-slate-700 text-2xl p-1 cursor-pointer transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-slate-700 text-sm">Local da Metástase</label>
                        <input
                            name="local_metastase"
                            value={currentMetastase.local_metastase}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-slate-700 text-sm">Data da Metástase</label>
                        <input
                            type="date"
                            name="data_metastase"
                            value={currentMetastase.data_metastase}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 mt-6 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 border border-transparent rounded-lg text-white font-semibold bg-teal-600 hover:bg-teal-700 transition-colors cursor-pointer shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        <FaSave /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MetastaseModal;
