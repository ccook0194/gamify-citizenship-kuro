'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

interface Emotion {
  emotion: string
  percentage: number
}

interface EmotionsChartProps {
  emotions: Emotion[]
}

export function EmotionsChart({ emotions }: EmotionsChartProps) {
  const options = {
    responsive: true,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: 'system-ui',
            size: 14
          },
          color: '#1e293b',
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return ` ${context.label}: ${context.parsed}%`
          }
        }
      }
    },
    cutout: '60%'
  }

  const data = {
    labels: emotions.map(e => e.emotion),
    datasets: [{
      data: emotions.map(e => e.percentage),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(54, 162, 235, 0.8)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 206, 86)',
        'rgb(153, 102, 255)',
        'rgb(54, 162, 235)'
      ],
      borderWidth: 1,
      hoverOffset: 4
    }]
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Emotion Distribution</h3>
      <div className="w-full max-w-md mx-auto">
        <Doughnut options={options} data={data} />
      </div>
    </div>
  )
}
