import React, { useState, useEffect } from 'react';
import './AreaCards.scss';
import { getDashboardKpis } from '../../services/api'; // ❗ Importe a função do seu api.js

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
        console.log('[AreaCards] Tentando buscar KPIs da API...');
        const response = await getDashboardKpis(); // Chama a função de api.js
        const kpiData = response.data; // response.data já é o objeto DashboardKpiResponse
        
        console.log('[AreaCards] KPIs recebidos da API:', kpiData);

        // Atualiza os estados com os dados recebidos da API
        // A verificação 'kpiData.nome_do_kpi !== undefined' é uma boa prática
        // para evitar que um NaN ou undefined quebre o .toFixed() depois.
        setTotalPacientes(kpiData.total_pacientes !== undefined ? kpiData.total_pacientes : 0);
        setTotalObitos(kpiData.total_obitos !== undefined ? kpiData.total_obitos : 0);
        setTaxaMortalidade(kpiData.taxa_mortalidade !== undefined ? kpiData.taxa_mortalidade : 0);
        setIdadeMediaDiagnostico(kpiData.idade_media_diagnostico !== undefined ? kpiData.idade_media_diagnostico : 0);
        setTamanhoMedioTumor(kpiData.tamanho_medio_tumor !== undefined ? kpiData.tamanho_medio_tumor : 0); // Confirmado
        setMediaRiscoGail(kpiData.media_risco_gail !== undefined ? kpiData.media_risco_gail : 0);
        setMediaRiscoTyrer(kpiData.media_risco_tyrer_cuzick !== undefined ? kpiData.media_risco_tyrer_cuzick : 0);

      } catch (err) {
        console.error('Erro ao carregar KPIs da API: [Erro sanitizado por segurança]');
        const errorMessage = err.response?.data?.detail ||
                             err.response?.data?.error ||
                             err.message ||
                             'Erro desconhecido ao buscar KPIs.';
        setError(errorMessage);
        // Opcional: resetar todos os KPIs para 0 ou valores padrão
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