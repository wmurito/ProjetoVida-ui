import React, { useState, useEffect, useMemo } from 'react';
import './AreaCards.scss';
import { getDashboardEstadiamento, getDashboardSobrevida, getDashboardRecidiva, getDashboardDeltaT } from '../../services/api';

const AreaCards = () => {
  // Estados para cada KPI
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [totalObitos, setTotalObitos] = useState(0);
  const [taxaMortalidade, setTaxaMortalidade] = useState(0);
  const [idadeMediaDiagnostico, setIdadeMediaDiagnostico] = useState(0);
  const [tamanhoMedioTumor, setTamanhoMedioTumor] = useState(0); // Já estava aqui!
  const [mediaRiscoGail, setMediaRiscoGail] = useState(0);
  const [mediaRiscoTyrer, setMediaRiscoTyrer] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Não precisamos mais do s3BaseUrl
  // const s3BaseUrl = '...';

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAllKpiDataFromAPI = async () => {
      setLoading(true);
      setError(null);

      try {
        // Buscar dados de todos os endpoints do dashboard com timeout
        const [estadiamentoRes, sobrevidaRes] = await Promise.all([
          getDashboardEstadiamento(),
          getDashboardSobrevida()
        ]);

        if (!isMounted) return;

        const estadiamento = estadiamentoRes.data || [];
        const sobrevida = sobrevidaRes.data || [];

        // Calcular KPIs baseados nos dados recebidos
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
        // Log seguro para produção
        if (import.meta.env.DEV) {
          console.error('Erro ao carregar KPIs:', err);
        }
        setError('Erro ao carregar dados. Tente novamente.');
        // Resetar todos os KPIs para 0
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
    return <section className="content-area-cards loading">Carregando KPIs...</section>;
  }

  if (error && !loading) { 
     return <section className="content-area-cards error">Erro ao carregar KPIs: {error}</section>;
  }

  return (
    <section className="content-area-cards">
      <div className="metric-card compact">
        <div className="card-header">Total de Casos</div>
        <div className="card-content">
          <div className="metric-value">{totalPacientes}</div>
          <div className="metric-label">Pacientes</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Total de Óbitos</div>
        <div className="card-content">
          <div className="metric-value">{totalObitos}</div>
          <div className="metric-label">Óbitos Registrados</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Taxa de Mortalidade</div>
        <div className="card-content">
          <div className="metric-value">{formattedTaxaMortalidade}%</div>
          <div className="metric-label">Geral</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Idade Média Diagnóstico</div>
        <div className="card-content">
          <div className="metric-value">{formattedIdadeMedia}</div>
          <div className="metric-label">Anos</div>
        </div>
      </div>
      {/* Card Adicionado/Confirmado para Tamanho Médio do Tumor */}
      <div className="metric-card compact">
        <div className="card-header">Tamanho Médio Tumor</div>
        <div className="card-content">
          <div className="metric-value">{formattedTamanhoMedio}</div>
          <div className="metric-label">cm</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Risco Gail (Média)</div>
        <div className="card-content">
          <div className="metric-value">{formattedRiscoGail}%</div>
          <div className="metric-label">Em 5 anos</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Risco Tyrer-Cuzick (Média)</div>
        <div className="card-content">
          <div className="metric-value">{formattedRiscoTyrer}%</div>
          <div className="metric-label">Em 10 anos</div>
        </div>
      </div>
    </section>
  );
};

export default AreaCards;