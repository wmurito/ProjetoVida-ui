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

        const chartData = {
          estadiamento: estadiamento,
          sobrevida: sobrevida,
          recidiva: recidiva,
          deltaT: deltaT,
          months: estatisticasTemporais.months || [],
          newPatients: estatisticasTemporais.newPatients || [],
          consultations: estatisticasTemporais.consultations || []
        };

        setChartData(chartData);
        setError(null);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Erro:', sanitizeInput(err.message || 'Erro desconhecido'));
        }
        setError('Erro ao carregar dados dos gráficos');
        toast.error('Não foi possível carregar os gráficos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOption = () => {
    if (!chartData) return {};

    const hasData = chartData.months && chartData.months.length > 0;

    if (!hasData) {
      return {
        backgroundColor: 'transparent',
        title: {
          text: 'Estatísticas de Pacientes',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#334155', // text-slate-700
            fontSize: 16,
            fontWeight: '600'
          }
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: 'Nenhum dado disponível',
            fontSize: 14,
            fill: '#94a3b8', // text-slate-400
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
        borderColor: '#0f172a', // text-slate-900 border
        borderWidth: 1,
        textStyle: {
          color: '#334155'
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#cbd5e1'
          }
        }
      },
      legend: {
        data: ['Novos Pacientes', 'Consultas'],
        top: 10,
        textStyle: {
          color: '#475569',
          fontSize: 12
        }
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '5%',
        top: '15%',
        containLabel: true,
        backgroundColor: 'transparent'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.months || [],
        axisLine: {
          lineStyle: {
            color: '#e2e8f0'
          }
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 11
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 11
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'Novos Pacientes',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#0ea5e9', // sky-500
            width: 3
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(14, 165, 233, 0.2)' },
                { offset: 1, color: 'rgba(14, 165, 233, 0)' }
              ]
            }
          },
          data: chartData.newPatients || []
        },
        {
          name: 'Consultas',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#ff7bac', // pink-600
            width: 3
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 123, 172, 0.2)' },
                { offset: 1, color: 'rgba(255, 123, 172, 0)' }
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
      <div className="w-full h-96 flex justify-center items-center bg-white rounded-xl shadow-sm border border-slate-100 animate-pulse">
        <span className="text-slate-400 font-medium">Carregando gráficos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex justify-center items-center bg-red-50 rounded-xl border border-red-100">
        <span className="text-red-500 font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full mb-6">
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-5 border border-slate-100">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Estatísticas de Pacientes e Consultas</h2>
          <p className="text-sm text-slate-500">Acompanhamento temporal do volume de novos registros e retornos.</p>
        </div>
        <div className="w-full">
          <ReactECharts
            option={getOption()}
            style={{ height: '350px', width: '100%' }}
            opts={{ renderer: 'svg' }} // SVG is usually sharper for responsive charts
          />
        </div>
      </div>
    </div>
  );
};

export default AreaCharts;
