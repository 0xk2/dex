import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const LPChart = function({pairName, labels, txns}){
  return <Line options={{
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Liquidity pool after a txn'
      }
    },
    scales: {
      'eth': {
        type: 'linear', position: 'left', display: true
      },
      'usdt': {
        type: 'linear', position: 'right', display: true, tension: 0.4,
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      }
    }
  }} data={{
    labels: labels,
    datasets: [
      {
        label: pairName.eth,
        data: txns.map((txn) => {return txn.nextPool.eth}),
        yAxisID: 'eth',
        borderColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: pairName.usdt,
        data: txns.map((txn) => {return txn.nextPool.usdt}),
        yAxisID: 'usdt',
        borderColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  }} height={200} width={1000} />
}

const PriceChart = function({pairName, labels, txns}){
  return <div style={{minHeight:'200px'}}><Line options={{
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${pairName.eth} price after transactions`,
      },
    },
  }} 
  data={{
    labels,
    datasets: [
      {
        label: `${pairName.eth} - ${pairName.usdt} price`,
        data: txns.map((txn) => {return txn.eth_price}),
        borderColor: 'yellow',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  }} height={200} width={1000} /></div>
}

const CustomChart = {
  LPChart, PriceChart
}

export default CustomChart;