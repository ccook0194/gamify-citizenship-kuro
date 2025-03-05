'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { AgentActivity } from '@/lib/mock-analytics'
import { timestampConvert } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ActivitiesChartProps {
  timestamps: string[]
  activities: AgentActivity[]
}

export function ActivitiesChart({ timestamps, activities }: ActivitiesChartProps) {
  const activityColors = {
    Exploring: 'rgba(255, 99, 132, 0.8)',
    Resting: 'rgba(75, 192, 192, 0.8)',
    Playing: 'rgba(255, 206, 86, 0.8)',
    Socializing: 'rgba(153, 102, 255, 0.8)',
    Training: 'rgba(54, 162, 235, 0.8)',
    Teaching: 'rgba(255, 159, 64, 0.8)',
    Researching: 'rgba(201, 203, 207, 0.8)',
    Mentoring: 'rgba(255, 99, 132, 0.8)',
    Studying: 'rgba(75, 192, 192, 0.8)',
    Meditating: 'rgba(255, 206, 86, 0.8)',
    Stargazing: 'rgba(153, 102, 255, 0.8)',
    Dreaming: 'rgba(54, 162, 235, 0.8)',
    Creating: 'rgba(255, 159, 64, 0.8)',
    Dancing: 'rgba(201, 203, 207, 0.8)',
    Singing: 'rgba(255, 99, 132, 0.8)',
    Gardening: 'rgba(75, 192, 192, 0.8)',
    Healing: 'rgba(255, 206, 86, 0.8)',
    Nurturing: 'rgba(153, 102, 255, 0.8)',
    Inventing: 'rgba(54, 162, 235, 0.8)',
    Building: 'rgba(255, 159, 64, 0.8)',
    Testing: 'rgba(201, 203, 207, 0.8)',
    Analyzing: 'rgba(255, 99, 132, 0.8)',
    Adventuring: 'rgba(75, 192, 192, 0.8)',
    Mapping: 'rgba(255, 206, 86, 0.8)',
    Discovering: 'rgba(153, 102, 255, 0.8)',
    Documenting: 'rgba(54, 162, 235, 0.8)',
    Writing: 'rgba(255, 159, 64, 0.8)',
    Painting: 'rgba(201, 203, 207, 0.8)',
    Performing: 'rgba(255, 99, 132, 0.8)'
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            const activity = activities[context.dataIndex].category
            const intensity = activities[context.dataIndex].intensity
            return [`Activity: ${activity}`, `Intensity: ${intensity}%`]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false
        },
        ticks: {
          display: false
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#1e293b',
          callback: (value: any) => {
            const date = new Date(timestampConvert(timestamps[value]))
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }
        }
      }
    },
    barThickness: 30
  }

  const data = {
    labels: timestamps.map((time) => timestampConvert(time)),
    datasets: [{
      data: activities.map((i) => i.intensity),
      backgroundColor: activities.map(activity => activityColors[activity.category as keyof typeof activityColors] || 'rgba(156, 163, 175, 0.8)'),
      borderWidth: 0,
      borderRadius: 4
    }]
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold text-slate-900">Recent Activities</h3>
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        <div className="h-[220px]">
          <Bar options={options} data={data} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {Array.from(new Set(activities)).map((activity, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: activityColors[activity.category as keyof typeof activityColors] || 'rgba(156, 163, 175, 0.8)',
                color: 'white'
              }}
            >
              {activity.category}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
