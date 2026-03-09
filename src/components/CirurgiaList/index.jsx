import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const formatLabel = (key) => {
    const labels = {
        data: 'Data',
        tecnica: 'Técnica',
        ampliacao_margem: 'Ampliação de Margem',
        tipo_histologico: 'AP: Tipo Histológico',
        subtipo_histologico: 'AP: Subtipo Histológico',
        tamanho_tumor: 'AP: Tamanho do Tumor',
        grau_histologico: 'AP: Grau Histológico',
        invasao_angiolinfatica: 'AP: Invasão Angiolinfática',
        infiltrado_linfocitario: 'AP: Infiltrado Linfocitário',
        infiltrado_linfocitario_quanto: 'AP: Infiltrado Quanto (%)',
        margens: 'AP: Margens',
        margens_comprometidas_dimensao: 'AP: Dimensão Comprometida',
        intercorrencias: 'Intercorrências',
        n_linfonodos_excisados: 'AP: Linfonodos Excisados',
        n_linfonodos_comprometidos: 'AP: Linfonodos Comprometidos',
        invasao_extranodal: 'AP: Invasão Extranodal',
        invasao_extranodal_dimensao: 'AP: Dimensão da Invasão',
        imunohistoquimica: 'AP: Imunohistoquímica',
        imunohistoquimica_resultado: 'AP: Resultado Imuno',
        tipo: 'Tipo'
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const CirurgiaItem = ({ item, index, onEdit, onRemove, type }) => {
    return (
        <div className="flex justify-between items-start p-4 border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
            <div className="flex-grow">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-6 gap-y-2">
                    {Object.entries(item).map(([key, value]) => {
                        if (value === '' || value === null || value === false) return null;

                        return (
                            <div key={key} className="flex flex-col text-sm">
                                <strong className="font-semibold text-slate-700 mb-0.5">{formatLabel(key)}:</strong>
                                <span className="text-slate-600 font-medium">{typeof value === 'boolean' ? 'Sim' : value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex gap-3 ml-4 shrink-0">
                <button
                    onClick={() => onEdit(item, type, index)}
                    title="Editar"
                    className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-amber-500 text-lg p-1 transition-colors"
                >
                    <FaEdit />
                </button>
                <button
                    onClick={() => onRemove(type, index)}
                    title="Remover"
                    className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-rose-500 text-lg p-1 transition-colors"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

const CirurgiaList = ({ formData, onEdit, onRemove }) => {
    const { mamas = [], axilas = [], reconstrucoes = [] } = formData?.tratamento?.cirurgia || {};

    const hasCirurgias = mamas.length > 0 || axilas.length > 0 || reconstrucoes.length > 0;

    return (
        <div className="mt-6 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
            {mamas.length > 0 && (
                <>
                    <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
                        <h4 className="m-0 text-base font-semibold text-slate-800">Cirurgias da Mama</h4>
                    </div>
                    {mamas.map((item, index) => <CirurgiaItem key={`mama-${index}`} item={item} index={index} onEdit={onEdit} onRemove={onRemove} type="mamas" />)}
                </>
            )}

            {axilas.length > 0 && (
                <>
                    <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
                        <h4 className="m-0 text-base font-semibold text-slate-800">Cirurgias da Axila</h4>
                    </div>
                    {axilas.map((item, index) => <CirurgiaItem key={`axila-${index}`} item={item} index={index} onEdit={onEdit} onRemove={onRemove} type="axilas" />)}
                </>
            )}

            {reconstrucoes.length > 0 && (
                <>
                    <div className="px-4 py-3 bg-slate-100 border-b border-slate-200">
                        <h4 className="m-0 text-base font-semibold text-slate-800">Reconstruções Mamárias</h4>
                    </div>
                    {reconstrucoes.map((item, index) => <CirurgiaItem key={`reconstrucao-${index}`} item={item} index={index} onEdit={onEdit} onRemove={onRemove} type="reconstrucoes" />)}
                </>
            )}

            {!hasCirurgias && (
                <p className="text-center p-8 text-slate-500 font-medium italic">Nenhum procedimento cirúrgico adicionado.</p>
            )}
        </div>
    );
};

export default CirurgiaList;
