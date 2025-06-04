import React, { useEffect, useState } from 'react';
// ... (imports de recharts e scss como antes)
import './AreaCharts.scss';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#f87171', '#82ca9d', '#8884d8', '#ffc658', '#fb923c'];


const AreaCharts = () => {
  const [graficosData, setGraficosData] = useState(null); // Estado para todos os dados dos gráficos
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  // ❗❗❗ ATUALIZE ESTA URL BASE COM A URL CORRETA PARA O SEU BUCKET E PREFIXO ❗❗❗
  // Deve corresponder ao S3_BUCKET e S3_KEY_PREFIX do script Python
  // const s3BaseUrl = 'https://projeto-vida-prd.s3.us-east-1.amazonaws.com/dashboard_app_data';
  const s3BaseUrl = 'https://projeto-vida-prd.s3.us-east-1.amazonaws.com/dashboard_files'; // Ajuste a região se não for us-east-1

  useEffect(() => {
    const fetchAllGraficosData = async () => {
      setLoading(true);
      setErro(null);
      try {
        // Os arquivos de gráficos agora estão em um subdiretório 'graficos'
        const graficosPath = `${s3BaseUrl}/graficos`;
        const fileNames = ['estadiamento.json', 'sobrevida.json', 'recidiva.json', 'delta_t.json'];
        
        const fetchPromises = fileNames.map(fileName =>
          fetch(`${graficosPath}/${fileName}`).then(res => {
            if (!res.ok) {
              throw new Error(`Falha ao buscar ${fileName} para gráficos: ${res.status} ${res.statusText}`);
            }
            return res.json();
          })
        );

        const [estadiamentoData, sobrevidaData, recidivaData, deltaTData] = await Promise.all(fetchPromises);

        setGraficosData({
          estadiamento: estadiamentoData || [],
          sobrevida: sobrevidaData || [],
          recidiva: recidivaData || [],
          delta_t: deltaTData || [],
        });

      } catch (err) {
        console.error('Erro ao carregar dados dos gráficos do S3:', err);
        setErro(err.message);
        setGraficosData(null);
      } finally {
        setLoading(false);
      }
    };

    if (s3BaseUrl) {
      fetchAllGraficosData();
    } else {
      setErro("URL base do S3 não configurada para gráficos.");
      setLoading(false);
    }
  }, [s3BaseUrl]);

  if (loading) {
    return <div className="dashboard-container loading-message">Carregando gráficos...</div>;
  }

  if (erro) {
    return <div className="dashboard-container error-message">Erro ao carregar dados dos gráficos: {erro}</div>;
  }

  if (!graficosData) {
    return <div className="dashboard-container error-message">Não foi possível carregar os dados dos gráficos.</div>;
  }

  // Renderiza os gráficos usando graficosData.estadiamento, graficosData.sobrevida, etc.
  // O restante do JSX para os gráficos permanece o mesmo da sua versão anterior que funcionava com múltiplos arquivos.
  // Apenas certifique-se de acessar os dados corretamente via `graficosData.nomeDaSecao`

  return (
    <div className="dashboard-container">
      <div className="dashboard-row">
        <div className="vertical-stack">
          {/* Estadiamento */}
          <div className="dashboard-card small-chart dashboard-card-1">
            <div className="card-header">Estadiamento no Diagnóstico</div>
            <div className="card-content">
              {graficosData.estadiamento && graficosData.estadiamento.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={graficosData.estadiamento}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estagio" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p>Sem dados de estadiamento disponíveis.</p>}
            </div>
          </div>

          {/* Sobrevida */}
          <div className="dashboard-card small-chart dashboard-card-2">
            <div className="card-header">Sobrevida Global</div>
            <div className="card-content">
              {graficosData.sobrevida && graficosData.sobrevida.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={graficosData.sobrevida}
                      dataKey="quantidade"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {graficosData.sobrevida.map((entry, index) => (
                        <Cell key={`cell-sobrevida-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p>Sem dados de sobrevida disponíveis.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="vertical-stack">
          {/* Taxa de Recidiva */}
          <div className="dashboard-card small-chart dashboard-card-1">
            <div className="card-header">Taxa de Recidiva</div>
            <div className="card-content">
              {graficosData.recidiva && graficosData.recidiva.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={graficosData.recidiva}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p>Sem dados de recidiva disponíveis.</p>}
            </div>
          </div>

          {/* Média dos Tempos */}
          <div className="dashboard-card small-chart dashboard-card-2">
            <div className="card-header">Média dos Tempos (Delta T)</div>
            <div className="card-content">
              {graficosData.delta_t && graficosData.delta_t.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={graficosData.delta_t}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="processo" interval={0} />
                    <YAxis label={{ value: 'Dias', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(1) : value} />
                    <Legend />
                    <Bar dataKey="media_dias" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p>Sem dados de média de tempos disponíveis.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCharts;