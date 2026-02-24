import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const CurvedLineChart = () => {
  const data = {
    labels: ['3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun'],
    datasets: [
      {
        label: 'Total Vendors',
        data: [1000, 2000, 3000, 4000, 3000, 2000, 5000],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)', // Fill color with transparency
        fill: true,
        tension: 0.4, // Curved line
      },
      {
        label: 'Total Purchase',
        data: [1500, 1000, 2000, 3000, 2000, 1000, 1500],
        borderColor: 'purple',
        backgroundColor: 'rgba(0, 0, 255, 0.2)', // Fill color with transparency
        fill: true,
        tension: 0.4, // Curved line
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div class="shadow-lg bg-body-tertiary rounded  ps-5 pt-3  pb-3 me-3 pe-5">
    <div style={{ width: 500, height: 268 }}>
      <Line data={data} options={options} />
    </div></div>
  );
};

export default CurvedLineChart;
