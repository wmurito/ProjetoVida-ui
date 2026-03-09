import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

// Componente genérico para os campos do formulário
const FormFields = ({ fields, data, handleChange }) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 mb-4">
        {fields.map(field => {
            if (field.showIf) {
                const conditionField = field.showIf.field;
                const conditionValue = field.showIf.value;
                if (data[conditionField] !== conditionValue) {
                    return null;
                }
            }

            // span is converted from roughly a grid-column logic
            const colSpanClass = field.span === 6 ? 'col-span-full' :
                field.span === 4 ? 'col-span-4 sm:col-span-4' :
                    field.span === 3 ? 'col-span-3 sm:col-span-3' :
                        field.span === 2 ? 'col-span-2' :
                            'col-span-1 border-emerald-400';

            return (
                <div key={field.name} className={`flex flex-col gap-1.5 min-w-[120px] ${colSpanClass}`}>
                    <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">{field.label}</label>
                    {field.type === 'select' ? (
                        <select
                            name={field.name}
                            value={data[field.name] || ''}
                            onChange={handleChange}
                            className="p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 text-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[42px]"
                        >
                            {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    ) : field.type === 'checkbox' ? (
                        <label className="flex items-center gap-2 cursor-pointer mt-1 p-2 border border-slate-200 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors h-[42px]">
                            <input
                                type="checkbox"
                                name={field.name}
                                checked={!!data[field.name]}
                                onChange={handleChange}
                                className="w-4 h-4 text-teal-600 bg-white border border-slate-300 rounded cursor-pointer accent-teal-600 focus:ring-teal-500 focus:ring-2"
                            />
                            <span className="text-sm text-slate-700 select-none font-medium">{field.checkboxLabel || ''}</span>
                        </label>
                    ) : (
                        <input
                            type={field.type || 'text'}
                            name={field.name}
                            value={data[field.name] || ''}
                            onChange={handleChange}
                            step={field.step}
                            className="p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 text-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[42px] appearance-auto"
                        />
                    )}
                </div>
            );
        })}
    </div>
);

const CirurgiaModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [procedimentoData, setProcedimentoData] = useState({});

    // Define os campos para cada tipo de cirurgia
    const camposMama = [{ name: 'data', label: 'Data', type: 'date', span: 2 }, { name: 'tecnica', label: 'Técnica', span: 4 }, { name: 'ampliacao_margem', label: 'Ampliação de Margem', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'tipo_histologico', label: 'AP: Tipo Histológico', span: 3 }, { name: 'subtipo_histologico', label: 'AP: Subtipo Histológico', span: 3 }, { name: 'tamanho_tumor', label: 'AP: Tamanho do Tumor', type: 'number', step: '0.1', span: 2 }, { name: 'grau_histologico', label: 'AP: Grau Histológico', type: 'number', span: 1 }, { name: 'invasao_angiolinfatica', label: 'AP: Invasão Angiolinfática', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'infiltrado_linfocitario', label: 'AP: Infiltrado Linfocitário', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'infiltrado_linfocitario_quanto', label: 'AP: Infiltrado Quanto (%)', type: 'number', span: 2, showIf: { field: 'infiltrado_linfocitario', value: true } }, { name: 'margens', label: 'AP: Margens', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'livres', label: 'Livres' }, { value: 'comprometidas', label: 'Comprometidas' }] }, { name: 'margens_comprometidas_dimensao', label: 'Dimensão da Margem', type: 'number', step: '0.1', span: 2, showIf: { field: 'margens', value: 'livres' } }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 },];
    const camposAxila = [{ name: 'data', label: 'Data', type: 'date', span: 2 }, { name: 'tecnica', label: 'Técnica', span: 4 }, { name: 'tipo_histologico', label: 'AP: Tipo Histológico', span: 3 }, { name: 'subtipo_histologico', label: 'AP: Subtipo Histológico', span: 3 }, { name: 'n_linfonodos_excisados', label: 'AP: Linfonodos Excisados', type: 'number', span: 2 }, { name: 'n_linfonodos_comprometidos', label: 'AP: Linfonodos Comprometidos', type: 'number', span: 2 }, { name: 'invasao_extranodal', label: 'AP: Invasão Extranodal', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'invasao_extranodal_dimensao', label: 'AP: Dimensão da Invasão', type: 'number', step: '0.1', span: 2, showIf: { field: 'invasao_extranodal', value: true } }, { name: 'imunohistoquimica', label: 'AP: Imunohistoquímica', type: 'checkbox', checkboxLabel: 'Sim', span: 2 }, { name: 'imunohistoquimica_resultado', label: 'AP: Resultado Imuno', span: 6, showIf: { field: 'imunohistoquimica', value: true } }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 },];
    const camposReconstrucao = [{ name: 'tipo', label: 'Tipo', type: 'select', span: 2, options: [{ value: '', label: 'Selecione...' }, { value: 'imediata', label: 'Imediata' }, { value: 'tardia', label: 'Tardia' }] }, { name: 'data', label: 'Data', type: 'date', span: 2 }, { name: 'tecnica', label: 'Técnica', span: 2 }, { name: 'intercorrencias', label: 'Intercorrências', span: 6 },];

    useEffect(() => {
        // Se há dados iniciais (edição), preenche o estado
        if (initialData && initialData.data) {
            setProcedimentoData({
                ...initialData.data,
                tipo_procedimento: initialData.type
            });
        } else {
            setProcedimentoData({
                contexto_cirurgico: '',
                tipo_procedimento: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setProcedimentoData(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = () => {
        if (!procedimentoData.tipo_procedimento) {
            alert('Por favor, selecione um tipo de procedimento.');
            return;
        }
        onSubmit(procedimentoData);
        onClose();
    };

    if (!isOpen) return null;

    const renderFields = () => {
        switch (procedimentoData.tipo_procedimento) {
            case 'mamas':
                return <FormFields fields={camposMama} data={procedimentoData} handleChange={handleChange} />;
            case 'axilas':
                return <FormFields fields={camposAxila} data={procedimentoData} handleChange={handleChange} />;
            case 'reconstrucoes':
                return <FormFields fields={camposReconstrucao} data={procedimentoData} handleChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0 rounded-t-xl">
                    <h2 className="m-0 text-slate-800 text-lg font-bold">
                        {initialData ? 'Editar Procedimento Cirúrgico' : 'Adicionar Procedimento Cirúrgico'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none text-slate-400 hover:text-slate-700 text-2xl cursor-pointer transition-colors p-1"
                    >
                        <FaTimes />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex flex-col gap-1.5 col-span-3">
                            <label className="text-sm font-semibold text-slate-700">Contexto da Cirurgia</label>
                            <select
                                name="contexto_cirurgico"
                                value={procedimentoData.contexto_cirurgico || ''}
                                onChange={handleChange}
                                className="p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 text-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                                <option value="">Não se aplica</option>
                                <option value="upfront">Upfront</option>
                                <option value="pos_neoadjuvante">Pós Tratamento Neoadjuvante</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 col-span-3">
                            <label className="text-sm font-semibold text-slate-700">Tipo de Procedimento</label>
                            <select
                                name="tipo_procedimento"
                                value={procedimentoData.tipo_procedimento || ''}
                                onChange={handleChange}
                                disabled={!!initialData}
                                className="p-2.5 bg-white border border-slate-300 rounded-md text-slate-700 text-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                <option value="">Selecione...</option>
                                <option value="mamas">Cirurgia da Mama</option>
                                <option value="axilas">Cirurgia da Axila</option>
                                <option value="reconstrucoes">Reconstrução Mamária</option>
                            </select>
                        </div>
                    </div>

                    {renderFields()}
                </div>

                <footer className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 shrink-0 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-500 hover:bg-slate-600 text-white font-medium rounded-md transition-colors border-none cursor-pointer"
                    >
                        <FaTimes /> Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-md transition-colors border-none cursor-pointer shadow-sm"
                    >
                        <FaSave /> Salvar
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CirurgiaModal;
