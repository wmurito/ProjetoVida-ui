import React from 'react';

const MetastaseList = ({ metastases, onEdit, onRemove }) => {
    if (!metastases || metastases.length === 0) {
        return <p className="text-slate-500 text-center mt-3 text-sm font-medium">Nenhuma metástase adicionada.</p>;
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr + 'T00:00:00');
            if (isNaN(date.getTime())) return 'Data inválida';
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return 'Data inválida';
        }
    };

    return (
        <div className="w-full mt-4 border border-slate-200 rounded-lg p-3 bg-slate-50">
            {metastases.map((meta, index) => {
                if (!meta || typeof meta !== 'object') return null;
                return (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border-b border-slate-200 last:border-b-0 gap-3 sm:gap-0">
                        <div className="text-sm text-slate-600 leading-relaxed">
                            <strong className="text-slate-800">Local:</strong> {meta.local_metastase || 'Não informado'} <br />
                            <strong className="text-slate-800">Data:</strong> {formatDate(meta.data_metastase)}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(meta, index)}
                                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-800 border-none rounded-md cursor-pointer text-[13px] font-medium transition-all active:scale-95 shadow-sm"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => onRemove(index)}
                                className="px-3 py-1.5 bg-pink-400 hover:bg-pink-500 text-white border-none rounded-md cursor-pointer text-[13px] font-medium transition-all active:scale-95 shadow-sm"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MetastaseList;
