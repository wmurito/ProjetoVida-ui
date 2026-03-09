import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const parentescoMasculinoOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'pai', label: 'Pai' },
    { value: 'avo_paterno', label: 'Avô Paterno' },
    { value: 'avo_materno', label: 'Avô Materno' },
    { value: 'irmao', label: 'Irmão' },
    { value: 'tio_paterno', label: 'Tio Paterno' },
    { value: 'tio_materno', label: 'Tio Materno' },
    { value: 'primo_paterno', label: 'Primo Paterno' },
    { value: 'primo_materno', label: 'Primo Materno' },
    { value: 'sobrinho', label: 'Sobrinho' },
    { value: 'filho', label: 'Filho' },
];

const parentescoFemininoOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'mae', label: 'Mãe' },
    { value: 'avo_paterna', label: 'Avó Paterna' },
    { value: 'avo_materna', label: 'Avó Materna' },
    { value: 'irma', label: 'Irmã' },
    { value: 'tia_paterna', label: 'Tia Paterna' },
    { value: 'tia_materna', label: 'Tia Materna' },
    { value: 'prima_paterna', label: 'Prima Paterna' },
    { value: 'prima_materna', label: 'Prima Materna' },
    { value: 'sobrinha', label: 'Sobrinha' },
    { value: 'filha', label: 'Filha' },
];

const FamilyMemberModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [familiarData, setFamiliarData] = useState({});
    const [genero, setGenero] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (member) {
                const internalState = {
                    ...member,
                    cancer_mama: member.tem_cancer_mama ? 'sim' : 'nao',
                    cancer_ovario: member.tem_cancer_ovario ? 'sim' : 'nao',
                    bilateral: member.bilateral ? 'sim' : 'nao',
                };
                setFamiliarData(internalState);
                setGenero(member.genero || '');
            } else {
                setFamiliarData({
                    cancer_mama: 'nao',
                    cancer_ovario: 'nao',
                    bilateral: 'nao',
                    gene_brca: 'desconhecido',
                    parentesco: '',
                });
                setGenero('');
            }
        }
    }, [member, isOpen]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            const numValue = parseInt(value, 10);
            if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 150)) {
                return;
            }
        }

        setFamiliarData(prev => ({ ...prev, [name]: value }));
    };

    const handleGeneroChange = (e) => {
        const newGenero = e.target.value;
        setGenero(newGenero);
        setFamiliarData(prev => ({ ...prev, genero: newGenero, parentesco: '' }));
    };

    const handleRadioChange = (name, value) => {
        setFamiliarData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!genero) {
            alert('Por favor, selecione o gênero do familiar.');
            return;
        }

        if (!familiarData.parentesco) {
            alert('Por favor, selecione o parentesco.');
            return;
        }

        try {
            const dataToSubmit = {
                ...familiarData,
                genero: genero,
                tem_cancer_mama: familiarData.cancer_mama === 'sim',
                tem_cancer_ovario: familiarData.cancer_ovario === 'sim',
                bilateral: familiarData.bilateral === 'sim',
            };

            delete dataToSubmit.cancer_mama;
            delete dataToSubmit.cancer_ovario;

            onSubmit(dataToSubmit);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar membro familiar:', error);
            alert('Erro ao salvar os dados. Por favor, tente novamente.');
        }
    };

    if (!isOpen) return null;

    const parentescoOptions = genero === 'masculino'
        ? parentescoMasculinoOptions
        : genero === 'feminino'
            ? parentescoFemininoOptions
            : [{ value: '', label: 'Selecione o gênero primeiro...' }];

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-slate-800 m-0">
                        {member ? 'Editar Membro Familiar' : 'Adicionar Membro Familiar'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-6 gap-5">
                        {/* Gênero */}
                        <div className="col-span-6 md:col-span-3">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Gênero do Familiar</label>
                            <select
                                name="genero"
                                value={genero}
                                onChange={handleGeneroChange}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="">Selecione...</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                            </select>
                        </div>

                        {/* Parentesco */}
                        <div className="col-span-6 md:col-span-3">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Parentesco</label>
                            <select
                                name="parentesco"
                                value={familiarData.parentesco || ''}
                                onChange={handleChange}
                                disabled={!genero}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                {parentescoOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Campos Femininos */}
                        {genero === 'feminino' && (
                            <>
                                {/* Câncer de mama */}
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Câncer de mama?</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="cancer_mama" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.cancer_mama === 'nao'} onChange={() => handleRadioChange('cancer_mama', 'nao')} />
                                            Não
                                        </label>
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="cancer_mama" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.cancer_mama === 'sim'} onChange={() => handleRadioChange('cancer_mama', 'sim')} />
                                            Sim
                                        </label>
                                    </div>
                                    {familiarData.cancer_mama === 'sim' && (
                                        <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 mt-1" name="idade_cancer_mama" placeholder="Idade no início" value={familiarData.idade_cancer_mama || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </div>

                                {/* Bilateral */}
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bilateral?</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="bilateral" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.bilateral === 'nao'} onChange={() => handleRadioChange('bilateral', 'nao')} />
                                            Não
                                        </label>
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="bilateral" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.bilateral === 'sim'} onChange={() => handleRadioChange('bilateral', 'sim')} />
                                            Sim
                                        </label>
                                    </div>
                                    {familiarData.bilateral === 'sim' && (
                                        <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 mt-1" name="idade_segunda_mama" placeholder="Idade da 2ª mama" value={familiarData.idade_segunda_mama || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </div>

                                {/* Câncer de ovário */}
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Câncer de ovário?</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="cancer_ovario" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.cancer_ovario === 'nao'} onChange={() => handleRadioChange('cancer_ovario', 'nao')} />
                                            Não
                                        </label>
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="cancer_ovario" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.cancer_ovario === 'sim'} onChange={() => handleRadioChange('cancer_ovario', 'sim')} />
                                            Sim
                                        </label>
                                    </div>
                                    {familiarData.cancer_ovario === 'sim' && (
                                        <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 mt-1" name="idade_cancer_ovario" placeholder="Idade no início" value={familiarData.idade_cancer_ovario || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </div>

                                {/* Gene BRCA */}
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gene BRCA</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['desconhecido', 'normal', 'brca1', 'brca2'].map(opt => (
                                            <label key={opt} className="flex items-center text-sm text-slate-700 capitalize cursor-pointer">
                                                <input type="radio" name="gene_brca" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.gene_brca === opt} onChange={() => handleRadioChange('gene_brca', opt)} />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Campos Masculinos */}
                        {genero === 'masculino' && (
                            <>
                                {/* Câncer de mama */}
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Câncer de mama?</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="cancer_mama" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.cancer_mama === 'nao'} onChange={() => handleRadioChange('cancer_mama', 'nao')} />
                                            Não
                                        </label>
                                        <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                            <input type="radio" name="cancer_mama" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.cancer_mama === 'sim'} onChange={() => handleRadioChange('cancer_mama', 'sim')} />
                                            Sim
                                        </label>
                                    </div>
                                    {familiarData.cancer_mama === 'sim' && (
                                        <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 mt-1" name="idade_cancer_mama" placeholder="Idade no início" value={familiarData.idade_cancer_mama || ''} onChange={handleChange} min="0" max="150" />
                                    )}
                                </div>

                                {/* Gene BRCA */}
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gene BRCA</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['desconhecido', 'normal', 'brca1', 'brca2'].map(opt => (
                                            <label key={opt} className="flex items-center text-sm text-slate-700 capitalize cursor-pointer">
                                                <input type="radio" name="gene_brca" className="mr-1.5 text-teal-600 focus:ring-teal-500 cursor-pointer" checked={familiarData.gene_brca === opt} onChange={() => handleRadioChange('gene_brca', opt)} />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    >
                        <FaTimes /> Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        <FaSave /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FamilyMemberModal;
