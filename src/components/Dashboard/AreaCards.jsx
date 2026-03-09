import React, { useState, useEffect, useMemo } from 'react';
import { getDashboardEstadiamento, getDashboardSobrevida, getDashboardRecidiva, getDashboardDeltaT } from '../../services/api';

const AreaCards = () => {
  // Estados para cada KPI
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [totalObitos, setTotalObitos] = useState(0);
  const [taxaMortalidade, setTaxaMortalidade] = useState(0);
  const [idadeMediaDiagnostico, setIdadeMediaDiagnostico] = useState(0);
  const [tamanhoMedioTumor, setTamanhoMedioTumor] = useState(0);
  const [mediaRiscoGail, setMediaRiscoGail] = useState(0);
  const [mediaRiscoTyrer, setMediaRiscoTyrer] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAllKpiDataFromAPI = async () => {
      setLoading(true);
      setError(null);

      try {
        const [estadiamentoRes, sobrevidaRes] = await Promise.all([
          getDashboardEstadiamento(),
          getDashboardSobrevida()
        ]);

        if (!isMounted) return;

        const estadiamento = estadiamentoRes.data || [];
        const sobrevida = sobrevidaRes.data || [];

        const totalPac = estadiamento.reduce((sum, item) => sum + (item.total || 0), 0);
        const totalObt = sobrevida.find(item => item.status === 'Óbito')?.total || 0;
        const taxaMort = totalPac > 0 ? (totalObt / totalPac) * 100 : 0;

        if (isMounted) {
          setTotalPacientes(totalPac);
          setTotalObitos(totalObt);
          setTaxaMortalidade(taxaMort);
          setIdadeMediaDiagnostico(0);
          setTamanhoMedioTumor(0);
          setMediaRiscoGail(0);
          setMediaRiscoTyrer(0);
        }

      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Erro ao carregar KPIs:', err);
        }
        setError('Erro ao carregar dados. Tente novamente.');
        setTotalPacientes(0);
        setTotalObitos(0);
        setTaxaMortalidade(0);
        setIdadeMediaDiagnostico(0);
        setTamanhoMedioTumor(0);
        setMediaRiscoGail(0);
        setMediaRiscoTyrer(0);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllKpiDataFromAPI();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const formattedTaxaMortalidade = useMemo(() =>
    (taxaMortalidade || 0).toFixed(1), [taxaMortalidade]
  );

  const formattedIdadeMedia = useMemo(() =>
    (idadeMediaDiagnostico || 0).toFixed(0), [idadeMediaDiagnostico]
  );

  const formattedTamanhoMedio = useMemo(() =>
    (tamanhoMedioTumor || 0).toFixed(1), [tamanhoMedioTumor]
  );

  const formattedRiscoGail = useMemo(() =>
    (mediaRiscoGail || 0).toFixed(2), [mediaRiscoGail]
  );

  const formattedRiscoTyrer = useMemo(() =>
    (mediaRiscoTyrer || 0).toFixed(2), [mediaRiscoTyrer]
  );

  if (loading) {
    return <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4 animate-pulse">Carregando KPIs...</section>;
  }

  if (error && !loading) {
    return <section className="p-4 text-red-600 bg-red-50 rounded-lg">Erro ao carregar KPIs: {error}</section>;
  }

  const MetricCard = ({ title, value, label }) => (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-5 border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-slate-500 mb-2 truncate">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
    </div>
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 mb-6">
      <MetricCard title="Total de Casos" value={totalPacientes} label="Pacientes" />
      <MetricCard title="Total de Óbitos" value={totalObitos} label="Registrados" />
      <MetricCard title="Mortalidade" value={`${formattedTaxaMortalidade}%`} label="Geral" />
      <MetricCard title="Idade Média Diagnóstico" value={formattedIdadeMedia} label="Anos" />
      <MetricCard title="Tamanho Médio Tumor" value={formattedTamanhoMedio} label="cm" />
      <MetricCard title="Risco Gail (Média)" value={`${formattedRiscoGail}%`} label="Em 5 anos" />
      <MetricCard title="Risco Tyrer-Cuzick" value={`${formattedRiscoTyrer}%`} label="Em 10 anos" />
    </section>
  );
};

export default AreaCards;
