'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { timestampConvert } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface BasicNeedsChartProps {
  timestamps: string[]
  energy: number[]
  health: number[]
}

export function BasicNeedsChart({ timestamps, energy, health }: BasicNeedsChartProps) {
  const options = {
    responsive: true,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'system-ui',
            size: 14
          },
          color: '#1e293b'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#1e293b'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#1e293b'
        }
      }
    }
  }

  const data = {
    labels: timestamps.map((time) => timestampConvert(time)),
    datasets: [
      {
        label: 'Energy',
        data: energy,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Health',
        data: health,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Basic Needs Over Time</h3>
      <Line options={options} data={data} />
    </div>
  )
}
