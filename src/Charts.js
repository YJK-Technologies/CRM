import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Ensure you import the default chart.js
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin

const Charts = () => {
    const salesData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Sales',
            data: [1500, 2000, 1800, 2200, 1900, 2400],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.4, 
            pointRadius: 3,
            pointHoverRadius: 5,
            datalabels: {
                align: 'top',
                anchor: 'end',
                color: 'black',
                font: {
                    weight: 'bold'
                },
                formatter: (value) => `$${value}`,
            }
        }]
    };

    const usersData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'New Users',
            data: [50, 70, 60, 90, 80, 100],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            borderWidth: 1,
            barPercentage: 0.6, 
            categoryPercentage: 0.5,
            datalabels: {
                align: 'top',
                anchor: 'end',
                color: 'black',
                font: {
                    weight: 'bold'
                }
            }
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                display: true,
                formatter: (value, context) => {
                    if (context.chart.config.type === 'line') {
                        return `$${value}`;
                    }
                    return value;
                },
                align: 'top',
                anchor: 'end',
                color: 'black',
                font: {
                    weight: 'bold'
                }
            }
        }
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <Line data={salesData} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <Bar data={usersData} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charts;
