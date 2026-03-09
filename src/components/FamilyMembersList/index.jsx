import React from 'react';

const allParentescoOptions = [
    { value: 'pai', label: 'Pai' }, { value: 'avo_paterno', label: 'Avô Paterno' }, { value: 'avo_materno', label: 'Avô Materno' },
    { value: 'irmao', label: 'Irmão' }, { value: 'tio_paterno', label: 'Tio Paterno' }, { value: 'tio_materno', label: 'Tio Materno' },
    { value: 'primo_paterno', label: 'Primo Paterno' }, { value: 'primo_materno', label: 'Primo Materno' }, { value: 'sobrinho', label: 'Sobrinho' },
    { value: 'filho', label: 'Filho' }, { value: 'mae', label: 'Mãe' }, { value: 'avo_paterna', label: 'Avó Paterna' },
    { value: 'avo_materna', label: 'Avó Materna' }, { value: 'irma', label: 'Irmã' }, { value: 'tia_paterna', label: 'Tia Paterna' },
    { value: 'tia_materna', label: 'Tia Materna' }, { value: 'prima_paterna', label: 'Prima Paterna' }, { value: 'prima_materna', label: 'Prima Materna' },
    { value: 'sobrinha', label: 'Sobrinha' }, { value: 'filha', label: 'Filha' },
];

const parentescoLabelMap = new Map(allParentescoOptions.map(opt => [opt.value, opt.label]));

const getParentescoLabel = (value) => {
    return parentescoLabelMap.get(value) || value;
};

const FamilyMembersList = ({ members, onEdit, onRemove }) => {
    if (!members || members.length === 0) {
        return (
            <p className="text-slate-500 text-center py-5 italic font-medium">
                Nenhum membro da família adicionado.
            </p>
        );
    }

    return (
        <div className="w-full mt-4 flex flex-col gap-3">
            {members.map((member, index) => (
                <div key={member.id || index} className="border border-slate-200 rounded-lg p-4 bg-slate-50 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-3">
                        <strong className="text-slate-700 capitalize text-base">
                            {getParentescoLabel(member.parentesco)}
                        </strong>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(member, index)}
                                className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium px-4 py-1.5 rounded-md text-sm transition-colors cursor-pointer"
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="bg-rose-500 text-white hover:bg-rose-600 font-medium px-4 py-1.5 rounded-md text-sm transition-colors cursor-pointer shadow-sm shadow-rose-500/30"
                            >
                                Remover
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-slate-600 font-medium">
                        <p className="m-0">
                            <strong className="text-slate-800">Câncer de mama:</strong> {member.tem_cancer_mama ? `Sim (idade: ${member.idade_cancer_mama || 'N/I'})` : 'Não'}
                        </p>
                        {member.bilateral && (
                            <p className="m-0">
                                <strong className="text-slate-800">Bilateral:</strong> Sim (2ª mama aos {member.idade_segunda_mama || 'N/I'} anos)
                            </p>
                        )}
                        {member.genero === 'feminino' && (
                            <p className="m-0">
                                <strong className="text-slate-800">Câncer de ovário:</strong> {member.tem_cancer_ovario ? `Sim (idade: ${member.idade_cancer_ovario || 'N/I'})` : 'Não'}
                            </p>
                        )}
                        <p className="m-0">
                            <strong className="text-slate-800">Gene BRCA:</strong> <span className="capitalize">{member.gene_brca || 'Desconhecido'}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FamilyMembersList;
