import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const LPChart = function(props){
  return <Line options={{
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: props.title
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
    labels: props.labels,
    datasets: props.datasets,
  }} height={200} width={1000} />
}

const PriceChart = function(props){
  return <Line options={{
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: props.title,
      },
    },
  }} 
  data={{
    labels: props.labels,
    datasets: props.datasets,
  }} height={200} width={1000} />
}

const CustomChart = {
  LPChart, PriceChart
}

export default CustomChart;