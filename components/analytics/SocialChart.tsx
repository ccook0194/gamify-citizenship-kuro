'use client'

import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

interface SocialRelationship {
  agent: string
  closeness: number
  interactions: number
}

interface SocialChartProps {
  relationships: SocialRelationship[]
}

export function SocialChart({ relationships }: SocialChartProps) {
  const options = {
    responsive: true,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const relationship = relationships[context.dataIndex]
            return [
              `Agent: ${relationship.agent}`,
              `Closeness: ${relationship.closeness}%`,
              `Interactions: ${relationship.interactions}`
            ]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Closeness Level',
          color: '#1e293b'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#1e293b'
        }
      },
      x: {
        beginAtZero: true,
        max: Math.max(...relationships.map(r => r.interactions)) + 10,
        title: {
          display: true,
          text: 'Number of Interactions',
          color: '#1e293b'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#1e293b'
        }
      }
    }
  }

  const data = {
    datasets: [{
      data: relationships.map(r => ({
        x: r.interactions,
        y: r.closeness
      })),
      backgroundColor: relationships.map((_, i) => [
        'rgba(255, 99, 132, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ][i % 4]),
      borderColor: relationships.map((_, i) => [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 206, 86)',
        'rgb(153, 102, 255)'
      ][i % 4]),
      borderWidth: 1,
      pointRadius: 10,
      pointHoverRadius: 12
    }]
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Social Relationships</h3>
      <Scatter options={options} data={data} />
    </div>
  )
}
