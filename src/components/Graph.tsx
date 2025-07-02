import { Line } from 'react-chartjs-2'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale)

interface Props {
  fn: (x: number) => number
  onClose: () => void
}

export function Graph({ fn, onClose }: Props) {
  const xs = Array.from({ length: 200 }, (_, i) => -10 + (20 * i) / 199)
  const data = {
    labels: xs,
    datasets: [
      {
        data: xs.map(fn),
        borderColor: '#8ab4f8',
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  }
  const options = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { display: false } },
      y: { ticks: { display: false } },
    },
  }
  return (
    <div className="graph-overlay">
      <button onClick={onClose}>close</button>
      <Line data={data} options={options} />
    </div>
  )
}
