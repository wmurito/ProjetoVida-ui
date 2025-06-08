import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './AreaCharts.scss'; // Certifique-se de que o caminho está correto
import { getDashboardGraficos  } from '../../services/api'; // ❗ Importe a nova função do seu api.js
// Ou se não quiser adicionar a api.js, use diretamente a instância 'api':
// import api from './api';

const COLORS = ['#4f46e5', '#f87171', '#82ca9d', '#8884d8', '#ffc658', '#fb923c'];

const AreaCharts = () => {
  const [graficosData, setGraficosData] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  // Não precisamos mais do s3BaseUrl para este componente
  // const s3BaseUrl = '...'; 

  useEffect(() => {
    const fetchAllGraficosDataFromAPI = async () => {
      setLoading(true);
      setErro(null);
      try {
        console.log('[AreaCharts] Tentando buscar dados dos gráficos da API...');
        // Chama a função getDashboardData de api.js
        const response = await getDashboardData(); 
        // Se não adicionou a api.js, seria:
        // const response = await api.get('/dashboard/dados');
        
        console.log('[AreaCharts] Dados recebidos da API:', response.data);

        // A resposta.data já deve ter a estrutura { estadiamento: [...], sobrevida_global: [...], ... }
        // conforme definido no schema DashboardDataResponse e retornado pelo seu backend FastAPI.
        setGraficosData({
          estadiamento: response.data.estadiamento || [],
          sobrevida: response.data.sobrevida_global || [], // Chave corresponde ao schema
          recidiva: response.data.taxa_recidiva || [],   // Chave corresponde ao schema
          delta_t: response.data.media_delta_t || [],     // Chave corresponde ao schema
        });

      } catch (err) {
        console.error('Erro ao carregar dados dos gráficos da API:', err.response?.data || err.message || err);
        // Tenta pegar a mensagem de erro do corpo da resposta da API, se disponível
        const errorMessage = err.response?.data?.detail || // Erro do FastAPI HTTPException
                             err.response?.data?.error ||  // Erro genérico da sua Lambda
                             err.message ||                // Erro de rede ou outro
                             'Erro desconhecido ao buscar dados.';
        setErro(errorMessage);
        setGraficosData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGraficosDataFromAPI();
  }, []); // O array de dependências vazio significa que isso roda apenas uma vez na montagem do componente

  if (loading) {
    return <div className="dashboard-container loading-message">Carregando gráficos...</div>;
  }

  if (erro) {
    return <div className="dashboard-container error-message">Erro ao carregar dados dos gráficos: {erro}</div>;
  }

  if (!graficosData) {
    // Este estado pode ocorrer se a API retornar com sucesso, mas os dados internos estiverem vazios/nulos
    // ou se o setGraficosData(null) foi chamado no catch.
    return <div className="dashboard-container error-message">Não foi possível carregar os dados dos gráficos ou não há dados disponíveis.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-row">
        <div className="vertical-stack">
          {/* Estadiamento */}
          <div className="dashboard-card small-chart dashboard-card-1">
            <div className="card-header">Estadiamento no Diagnóstico</div>
            <div className="card-content">
              {/* Acessa diretamente graficosData.estadiamento, que é a lista */}
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
                      data={graficosData.sobrevida} // Agora é graficosData.sobrevida (antes sobrevida_global)
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