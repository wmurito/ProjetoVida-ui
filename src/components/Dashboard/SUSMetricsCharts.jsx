import React, { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { getPacientes } from '../../services/api';

const SUSMetricsCharts = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchPacientesExtra = async () => {
            try {
                setLoading(true);
                // Busca um lote grande o suficiente para a amostragem analítica local
                const res = await getPacientes(0, 1000);
                if (isMounted) {
                    setPacientes(Array.isArray(res.data) ? res.data : []);
                    setError(null);
                }
            } catch (err) {
                console.error("Erro ao buscar dados para SUSMetrics:", err);
                if (isMounted) setError("Não foi possível carregar os dados analíticos");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchPacientesExtra();
        return () => { isMounted = false; };
    }, []);

    // Aggregation Logic
    const analyticsData = useMemo(() => {
        if (!pacientes.length) return null;

        // 1. Delta T (Tempo de Espera Diagnóstico -> Tratamento)
        let under30 = 0, under60 = 0, under90 = 0, over90 = 0, validDeltaTFound = 0;

        // 2. Estadiamento Clínico
        const stagingCount = { '0': 0, 'I': 0, 'II': 0, 'III': 0, 'IV': 0, 'Não Avaliado': 0 };

        // 3. Perfil Molecular Aproximado (Imunohistoquímica)
        const molecularCount = { 'Luminal (RH+)': 0, 'HER2 Enriquecido': 0, 'Triplo Negativo': 0, 'Indeterminado': 0 };

        pacientes.forEach(p => {
            // Process Delta T
            if (p.tempos_diagnostico?.data_diagnostico && p.tempos_diagnostico?.data_inicio_tratamento) {
                const diagData = new Date(p.tempos_diagnostico.data_diagnostico);
                const tratData = new Date(p.tempos_diagnostico.data_inicio_tratamento);
                const diffTime = Math.abs(tratData - diagData);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 30) under30++;
                else if (diffDays <= 60) under60++;
                else if (diffDays <= 90) under90++;
                else over90++;
                validDeltaTFound++;
            }

            // Process Staging
            let stage = p.historia_doenca?.estadiamento_clinico?.trim()?.toUpperCase() || '';
            if (stage.includes('EC 0') || stage === '0') stagingCount['0']++;
            else if (stage.includes('EC I') && !stage.includes('II') && !stage.includes('IV') || stage === 'I') stagingCount['I']++;
            else if (stage.includes('EC II') && !stage.includes('III') || stage === 'II') stagingCount['II']++;
            else if (stage.includes('EC III') || stage === 'III') stagingCount['III']++;
            else if (stage.includes('EC IV') || stage === 'IV') stagingCount['IV']++;
            else stagingCount['Não Avaliado']++;

            // Process Molecular Profile
            let luminal = false, her2 = false, tneg = false, validIhq = false;
            const ihqs = p.imunohistoquimicas || [];
            if (ihqs.length > 0) {
                // Usa a primeira biópsia como referência principal
                const ihq = ihqs[0];
                const rhPositivo = (ihq.re && ihq.re.toLowerCase().includes('pos')) || (ihq.rp && ihq.rp.toLowerCase().includes('pos')) || ihq.re === 'P' || ihq.rp === 'P';
                let her2Positivo = (ihq.her2 && (ihq.her2.includes('3+') || ihq.her2.toLowerCase().includes('pos')));
                const rhNegativo = (ihq.re && ihq.re.toLowerCase().includes('neg')) && (ihq.rp && ihq.rp.toLowerCase().includes('neg'));
                const her2Negativo = (ihq.her2 && (ihq.her2.includes('0') || ihq.her2.includes('1+') || ihq.her2.toLowerCase().includes('neg')));

                if (rhPositivo) luminal = true;
                if (her2Positivo) her2 = true;
                if (rhNegativo && her2Negativo) {
                    tneg = true;
                }

                if (luminal) molecularCount['Luminal (RH+)']++;
                else if (her2 && !luminal) molecularCount['HER2 Enriquecido']++;
                else if (tneg) molecularCount['Triplo Negativo']++;
                else molecularCount['Indeterminado']++;
            } else {
                molecularCount['Indeterminado']++;
            }
        });

        return {
            deltaT: [
                { name: '0 a 30 dias', value: under30, itemStyle: { color: '#10b981' } }, // emerald
                { name: '31 a 60 dias\n(Alvo SUS)', value: under60, itemStyle: { color: '#0ea5e9' } }, // sky
                { name: '61 a 90 dias\n(Atraso Moderado)', value: under90, itemStyle: { color: '#f59e0b' } }, // amber
                { name: '> 90 dias\n(Atraso Grave)', value: over90, itemStyle: { color: '#e11d48' } }, // rose
            ],
            staging: [
                { name: 'EC 0', value: stagingCount['0'] },
                { name: 'EC I', value: stagingCount['I'] },
                { name: 'EC II', value: stagingCount['II'] },
                { name: 'EC III', value: stagingCount['III'] },
                { name: 'EC IV', value: stagingCount['IV'] }
            ],
            molecular: [
                { name: 'Luminal (RH+)', value: molecularCount['Luminal (RH+)'] },
                { name: 'HER2+', value: molecularCount['HER2 Enriquecido'] },
                { name: 'Triplo Negativo', value: molecularCount['Triplo Negativo'] },
                { name: 'Desconhecido', value: molecularCount['Indeterminado'] }
            ],
            validDeltaTFound
        };
    }, [pacientes]);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-48 bg-white border border-slate-100 rounded-xl animate-pulse shadow-sm">
                <span className="text-pink-400 font-medium">Extraindo inteligência dos prontuários...</span>
            </div>
        );
    }

    if (error || !analyticsData) {
        return null;
    }

    // Delta T Chart Option
    const getDeltaTOption = () => ({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            data: analyticsData.deltaT.map(r => r.name),
            axisLabel: { color: '#64748b', fontSize: 10, interval: 0 }
        },
        yAxis: { type: 'value', axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
        series: [
            {
                type: 'bar',
                barWidth: '50%',
                data: analyticsData.deltaT,
                label: { show: true, position: 'top', color: '#475569' }
            }
        ]
    });

    // Staging Chart Option
    const getStagingOption = () => ({
        tooltip: { trigger: 'item' },
        grid: { left: '3%', right: '5%', bottom: '5%', top: '10%', containLabel: true },
        xAxis: { type: 'value', axisLabel: { show: false }, splitLine: { show: false } },
        yAxis: {
            type: 'category',
            data: analyticsData.staging.map(s => s.name).reverse(),
            axisLabel: { color: '#475569', fontWeight: 500 }
        },
        series: [
            {
                type: 'bar',
                data: analyticsData.staging.map(s => s.value).reverse(),
                itemStyle: { color: '#ff7bac', borderRadius: [0, 4, 4, 0] },
                label: { show: true, position: 'right', color: '#475569', fontWeight: 'bold' }
            }
        ]
    });

    // Molecular Profile Chart Option
    const getMolecularOption = () => ({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: '0%', left: 'center', textStyle: { fontSize: 11, color: '#64748b' } },
        series: [
            {
                name: 'Perfil Molecular',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                color: ['#ff7bac', '#0ea5e9', '#8b5cf6', '#cbd5e1'],
                data: analyticsData.molecular
            }
        ]
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-slate-800 border-l-4 border-pink-500 pl-3">Inteligência SUS & Saúde Pública</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Gráfico 1: Delta T (Tempo de Espera) */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-5 border border-slate-100 flex flex-col items-center">
                    <div className="w-full mb-3 text-center">
                        <h3 className="font-semibold text-slate-700">Atraso Diagnóstico → Início (Delta T)</h3>
                        <p className="text-xs text-slate-500 mt-1">Conformidade com a <span className="text-pink-600 font-medium">Lei dos 60 dias (Lei 12.732)</span></p>
                    </div>
                    {analyticsData.validDeltaTFound === 0 ? (
                        <div className="flex-1 flex justify-center items-center text-slate-400 text-sm py-16">Dados insuficientes de datas</div>
                    ) : (
                        <ReactECharts option={getDeltaTOption()} style={{ height: '280px', width: '100%' }} opts={{ renderer: 'svg' }} />
                    )}
                </div>

                {/* Gráfico 2: Estadiamento */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-5 border border-slate-100 flex flex-col items-center">
                    <div className="w-full mb-3 text-center">
                        <h3 className="font-semibold text-slate-700">Estadiamentos ao Diagnóstico</h3>
                        <p className="text-xs text-slate-500 mt-1">Sinaliza se a atenção básica falha na prevenção</p>
                    </div>
                    <ReactECharts option={getStagingOption()} style={{ height: '280px', width: '100%' }} opts={{ renderer: 'svg' }} />
                </div>

                {/* Gráfico 3: Perfil Molecular */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-5 border border-slate-100 flex flex-col items-center">
                    <div className="w-full mb-3 text-center">
                        <h3 className="font-semibold text-slate-700">Perfil Molecular da População</h3>
                        <p className="text-xs text-slate-500 mt-1">Direciona previsão de custos farmacêuticos e IHQ</p>
                    </div>
                    <ReactECharts option={getMolecularOption()} style={{ height: '280px', width: '100%' }} opts={{ renderer: 'svg' }} />
                </div>

            </div>
        </div>
    );
};

export default SUSMetricsCharts;
