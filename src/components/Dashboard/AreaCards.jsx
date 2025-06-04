import React, { useState, useEffect } from 'react';
import './AreaCards.scss';

// Função helper para buscar dados de KPI e extrair o valor
const fetchKpiDataHelper = async (url, dataKey, errorMessage, defaultValue = 0) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data && data[dataKey] !== undefined ? data[dataKey] : defaultValue;
    } else {
      console.error(`${errorMessage}: ${response.status} ${response.statusText} (URL: ${url})`);
      return defaultValue;
    }
  } catch (error) {
    console.error(`${errorMessage} (catch):`, error, `(URL: ${url})`);
    return defaultValue;
  }
};


const AreaCards = () => {
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [totalObitos, setTotalObitos] = useState(0);
  const [taxaMortalidade, setTaxaMortalidade] = useState(0);
  const [idadeMediaDiagnostico, setIdadeMediaDiagnostico] = useState(0);
  const [tamanhoMedioTumor, setTamanhoMedioTumor] = useState(0);
  const [mediaRiscoGail, setMediaRiscoGail] = useState(0);
  const [mediaRiscoTyrer, setMediaRiscoTyrer] = useState(0);
  // Adicione estados para outros KPIs aqui, se necessário

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ❗❗❗ ATUALIZE ESTA URL BASE COM A URL CORRETA PARA O SEU BUCKET E PREFIXO ❗❗❗
  // Deve corresponder ao S3_BUCKET e S3_KEY_PREFIX do script Python
  // Exemplo: const s3BaseUrl = 'https://projeto-vida-prd.s3.us-east-1.amazonaws.com/dashboard_app_data';
  const s3BaseUrl = 'https://projeto-vida-prd.s3.amazonaws.com/dashboard_files'; // Ajuste a região se não for us-east-1

  useEffect(() => {
    const fetchAllKpiData = async () => {
      setLoading(true);
      setError(null);
      let kpiFetchError = false;

      try {
        const kpiRequests = [
          fetchKpiDataHelper(`${s3BaseUrl}/kpis/total_pacientes.json`, 'total_casos', 'Erro ao buscar total de pacientes'),
          fetchKpiDataHelper(`${s3BaseUrl}/kpis/total_obitos.json`, 'total_obitos', 'Erro ao buscar total de óbitos'),
          fetchKpiDataHelper(`${s3BaseUrl}/kpis/taxa_mortalidade.json`, 'taxa_mortalidade', 'Erro ao buscar taxa de mortalidade'),
          fetchKpiDataHelper(`${s3BaseUrl}/kpis/idade_media_diagnostico.json`, 'idade_media', 'Erro ao buscar idade média no diagnóstico'),
          fetchKpiDataHelper(`${s3BaseUrl}/kpis/tamanho_medio_tumor.json`, 'tamanho_medio_cm', 'Erro ao buscar tamanho médio do tumor'),
          fetchKpiDataHelper(`${s3BaseUrl}/kpis/media_risco_gail.json`, 'media_risco_5_anos', 'Erro ao buscar média risco Gail'),
          fetchKpiDataHelper(`${s3BaseUrl}/kpis/media_risco_tyrer_cuzick.json`, 'media_risco_10_anos', 'Erro ao buscar média risco Tyrer-Cuzick'),
          // Adicione mais chamadas fetchKpiDataHelper para outros KPIs
        ];

        const results = await Promise.allSettled(kpiRequests);

        const [
          pacientesRes,
          obitosRes,
          taxaMortalidadeRes,
          idadeMediaRes,
          tamanhoTumorRes,
          riscoGailRes,
          riscoTyrerRes,
          // ... outros resultados
        ] = results;

        // Função para pegar o valor do resultado ou 0 se falhou
        const getValueOrDefault = (promiseResult, defaultValue = 0) => {
            if (promiseResult.status === 'fulfilled') {
                return promiseResult.value;
            } else {
                kpiFetchError = true; // Marca que houve um erro
                console.error("Falha em uma das requisições de KPI:", promiseResult.reason);
                return defaultValue;
            }
        };

        setTotalPacientes(getValueOrDefault(pacientesRes));
        setTotalObitos(getValueOrDefault(obitosRes));
        setTaxaMortalidade(getValueOrDefault(taxaMortalidadeRes));
        setIdadeMediaDiagnostico(getValueOrDefault(idadeMediaRes));
        setTamanhoMedioTumor(getValueOrDefault(tamanhoTumorRes));
        setMediaRiscoGail(getValueOrDefault(riscoGailRes));
        setMediaRiscoTyrer(getValueOrDefault(riscoTyrerRes));
        // ... setar outros estados

        if (kpiFetchError) {
            setError('Alguns KPIs podem não ter sido carregados corretamente. Verifique o console.');
        }

      } catch (err) { // Erro geral do Promise.allSettled (improvável aqui) ou erro de lógica
        console.error('Erro inesperado ao buscar todos os dados de KPI:', err);
        setError('Falha ao carregar KPIs. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (s3BaseUrl) {
      fetchAllKpiData();
    } else {
      setError("URL base do S3 não configurada para KPIs.");
      setLoading(false);
    }
  }, [s3BaseUrl]);

  if (loading) {
    return <section className="content-area-cards loading">Carregando KPIs...</section>;
  }

  // Não mostramos erro principal se apenas alguns KPIs falharam,
  // o console já terá o aviso, e os cards mostrarão 0 ou o valor padrão.
  // if (error && !loading) {
  //   return <section className="content-area-cards error">Erro: {error}</section>;
  // }


  return (
    <section className="content-area-cards">
      {/* Cards como antes, usando os estados populados */}
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
      {/* Adicione mais cards para outros KPIs aqui */}
    </section>
  );
};

export default AreaCards;