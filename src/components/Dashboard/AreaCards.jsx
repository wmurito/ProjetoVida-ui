import React, { useState, useEffect } from 'react';
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
    const fetchAllKpiDataFromAPI = async () => {
      setLoading(true);
      setError(null);

      try {
        // Buscar dados de todos os endpoints do dashboard
        const [estadiamentoRes, sobrevidaRes, recidivaRes, deltaTRes] = await Promise.all([
          getDashboardEstadiamento(),
          getDashboardSobrevida(),
          getDashboardRecidiva(),
          getDashboardDeltaT()
        ]);

        const estadiamento = estadiamentoRes.data;
        const sobrevida = sobrevidaRes.data;
        const recidiva = recidivaRes.data;
        const deltaT = deltaTRes.data;

        // Calcular KPIs baseados nos dados recebidos
        const totalPacientes = estadiamento.reduce((sum, item) => sum + item.total, 0);
        const totalObitos = sobrevida.find(item => item.status === 'Óbito')?.total || 0;
        const taxaMortalidade = totalPacientes > 0 ? (totalObitos / totalPacientes) * 100 : 0;
        
        // Para idade média e tamanho médio, usar valores padrão por enquanto
        // (esses dados precisariam vir de endpoints específicos)
        setIdadeMediaDiagnostico(0);
        setTamanhoMedioTumor(0);
        setMediaRiscoGail(0);
        setMediaRiscoTyrer(0);

        setTotalPacientes(totalPacientes);
        setTotalObitos(totalObitos);
        setTaxaMortalidade(taxaMortalidade);

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
        setLoading(false);
      }
    };

    fetchAllKpiDataFromAPI();
  }, []); // Roda apenas uma vez na montagem

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
          <div className="metric-value">{(taxaMortalidade || 0).toFixed(1)}%</div>
          <div className="metric-label">Geral</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Idade Média Diagnóstico</div>
        <div className="card-content">
          <div className="metric-value">{(idadeMediaDiagnostico || 0).toFixed(0)}</div>
          <div className="metric-label">Anos</div>
        </div>
      </div>
      {/* Card Adicionado/Confirmado para Tamanho Médio do Tumor */}
      <div className="metric-card compact">
        <div className="card-header">Tamanho Médio Tumor</div>
        <div className="card-content">
          <div className="metric-value">{(tamanhoMedioTumor || 0).toFixed(1)}</div>
          <div className="metric-label">cm</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Risco Gail (Média)</div>
        <div className="card-content">
          <div className="metric-value">{(mediaRiscoGail || 0).toFixed(2)}%</div>
          <div className="metric-label">Em 5 anos</div>
        </div>
      </div>
      <div className="metric-card compact">
        <div className="card-header">Risco Tyrer-Cuzick (Média)</div>
        <div className="card-content">
          <div className="metric-value">{(mediaRiscoTyrer || 0).toFixed(2)}%</div>
          <div className="metric-label">Em 10 anos</div>
        </div>
      </div>
    </section>
  );
};

export default AreaCards;