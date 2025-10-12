import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getDashboardEstadiamento, getDashboardSobrevida, getDashboardRecidiva, getDashboardDeltaT, getDashboardEstatisticasTemporais } from '../../services/api';
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
        const [estadiamentoRes, sobrevidaRes, recidivaRes, deltaTRes, estatisticasTemporaisRes] = await Promise.all([
          getDashboardEstadiamento(),
          getDashboardSobrevida(),
          getDashboardRecidiva(),
          getDashboardDeltaT(),
          getDashboardEstatisticasTemporais()
        ]);

        const estadiamento = estadiamentoRes.data;
        const sobrevida = sobrevidaRes.data;
        const recidiva = recidivaRes.data;
        const deltaT = deltaTRes.data;
        const estatisticasTemporais = estatisticasTemporaisRes.data;

        // Preparar dados para o gráfico de estatísticas de pacientes
        const chartData = {
          estadiamento: estadiamento,
          sobrevida: sobrevida,
          recidiva: recidiva,
          deltaT: deltaT,
          // Dados reais do backend para gráfico de linha
          months: estatisticasTemporais.months || [],
          newPatients: estatisticasTemporais.newPatients || [],
          consultations: estatisticasTemporais.consultations || []
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

    // Verificar se há dados reais para exibir
    const hasData = chartData.months && chartData.months.length > 0;
    const hasRealData = chartData.estadiamento && chartData.estadiamento.length > 0;
    
    if (!hasData) {
      return {
        backgroundColor: 'white',
        title: {
          text: 'Estatísticas de Pacientes',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#2c3e50',
            fontSize: 18,
            fontWeight: '600'
          }
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: 'Nenhum dado disponível',
            fontSize: 16,
            fill: '#7f8c8d',
            fontWeight: '500'
          }
        }
      };
    }

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#d94c77',
        borderWidth: 1,
        textStyle: {
          color: '#2c3e50'
        },
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#d94c77'
          }
        }
      },
      legend: {
        data: ['Novos Pacientes', 'Consultas'],
        top: 50,
        textStyle: {
          color: '#2c3e50',
          fontSize: 12
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
        backgroundColor: 'transparent'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.months || [],
        axisLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        axisLabel: {
          color: '#7f8c8d',
          fontSize: 11
        },
        axisTick: {
          lineStyle: {
            color: '#e0e0e0'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        axisLabel: {
          color: '#7f8c8d',
          fontSize: 11
        },
        axisTick: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'Novos Pacientes',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#d94c77',
            width: 3
          },
          itemStyle: {
            color: '#d94c77',
            borderColor: '#fff',
            borderWidth: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(217, 76, 119, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(217, 76, 119, 0.05)'
                }
              ]
            }
          },
          data: chartData.newPatients || []
        },
        {
          name: 'Consultas',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: '#3498db',
            width: 3
          },
          itemStyle: {
            color: '#3498db',
            borderColor: '#fff',
            borderWidth: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(52, 152, 219, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(52, 152, 219, 0.05)'
                }
              ]
            }
          },
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

  const hasRealData = chartData && chartData.estadiamento && chartData.estadiamento.length > 0;

  return (
    <div className="area-charts">
      <div className="metric-card chart-card chart-full-width">
        <div className="card-header">Estatísticas de Pacientes</div>
        <div className="card-content">
          <ReactECharts 
            option={getOption()} 
            style={{ height: '350px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
      
    </div>
  );
};

export default AreaCharts;