import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getDashboardEstadiamento, getDashboardSobrevida, getDashboardRecidiva, getDashboardDeltaT } from '../../services/api';
import { sanitizeInput } from '../../services/securityConfig';
import { toast } from 'react-toastify';

const AreaCharts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
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

        // Preparar dados para os gráficos
        const chartData = {
          estadiamento: estadiamento,
          sobrevida: sobrevida,
          recidiva: recidiva,
          deltaT: deltaT,
          // Dados para gráficos de linha (exemplo)
          months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          newPatients: [10, 15, 12, 18, 20, 16],
          consultations: [25, 30, 28, 35, 40, 32]
        };

        setChartData(chartData);
        setError(null);
      } catch (err) {
        // Log de erro sanitizado para produção
        
        // Sanitizar mensagem de erro antes de exibir
        const sanitizedMessage = sanitizeInput(err.message || 'Erro desconhecido');
        setError('Erro ao carregar dados dos gráficos');
        
        // Notificação amigável ao usuário
        toast.error('Não foi possível carregar os gráficos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOption = () => {
    if (!chartData) return {};

    return {
      title: {
        text: 'Estatísticas de Pacientes',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Novos Pacientes', 'Consultas'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.months || []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Novos Pacientes',
          type: 'line',
          stack: 'Total',
          data: chartData.newPatients || []
        },
        {
          name: 'Consultas',
          type: 'line',
          stack: 'Total',
          data: chartData.consultations || []
        }
      ]
    };
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        Carregando gráficos...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: '#ff4444'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div className="area-charts">
      <ReactECharts 
        option={getOption()} 
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default AreaCharts;