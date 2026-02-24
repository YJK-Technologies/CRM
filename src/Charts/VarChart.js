import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApexCharts from 'react-apexcharts';
import { useLocation } from 'react-router-dom';
const config = require("../../Apiconfig");

const ChartComponent = () => {
    const [chartType, setChartType] = useState('line');
    const [varientChart, setVarientChart] = useState([]);

    const location = useLocation();
    const { varient } = location.state || {}; 


    const fetchVarientData = async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/varientChart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Item_variant: varient}),
          });
          if (response.ok) {
            const data = await response.json();
          //   console.table(data)
          setVarientChart(data);
          } else {
            const errorMessage = await response.text();
            console.error(`Server responded with error: ${errorMessage}`);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      
    };

    useEffect(() => {
        fetchVarientData();
    }, []);

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const aggregateVarientData = () => {
        const aggregatedData = {};

        varientChart.forEach(item => {
            const dateKey = item.Product_Name;

            if (!aggregatedData[dateKey]) {
                aggregatedData[dateKey] = 0;
            }

            aggregatedData[dateKey] += item.Stock_Value;
        });

        // Prepare categories and series data
        const varientCategories = Object.keys(aggregatedData);
        const seriesData = Object.values(aggregatedData);

        const varientSeries = [{
            name: 'Item Varient',
            data: seriesData,
            backgroundColor: '#a3d2ff'
          }];

        return { varientSeries, varientCategories };
    };


    const { varientSeries, varientCategories } = aggregateVarientData();

    const varientData = {
        series:varientSeries,
        options: {
            chart: {
                type: chartType,
                height: 350,
                width: 500,
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: true,
                offsetY: -10, // Position labels above the data points
                style: {
                    fontSize: '10px',
                    colors: ['#000'] // Label text color
                },
                background: {
                    enabled: false, // Disables background
                    foreColor: '#000', // Set foreground color for text if needed
                    borderRadius: 0 // No border radius
                  },
                formatter: function (value, { dataPoint, seriesIndex, dataPointIndex }) {
                    // Use data from your chart data or custom logic
                    const item = varientChart[dataPointIndex];
                    const customLabel = `${item.Stock_Value}`;
    
                    return customLabel; // Customize label text
                }
            },
            stroke: {
                curve: 'smooth'
                
            },
            title: {
                text: 'Total Varient Report',
                align: 'left'
            },
            xaxis: {
                categories:varientCategories,
                title: {
                    text: 'Date'
                }
            },
            yaxis: {
                title: {
                    text: 'Total Varient Amount (₹)'
                },
                labels: {
                    formatter: function (value) {
                        if (value >= 100000) {
                          return `₹${(value / 100000).toFixed(2)}L`; 
                        } else if (value >= 1000) {
                          return `₹${(value / 1000).toFixed(2)}K`;
                        }
                        return `${value}`;
                      },
                }
            },
            tooltip: {
                y: {
                    formatter: function (value) {
                        if (value >= 100000) {
                            return `₹${(value / 100000).toFixed(2)}L`; // For lakhs
                        } else if (value >= 1000) {
                            return `₹${(value / 1000).toFixed(2)}K`; // For thousands
                        }
                        return `₹${value}`; // For values less than a thousand
                    }
                }
            },
            plotOptions: {
                bar: {
                  distributed: true,
                },
            },
            labels: varientCategories, 
        }
    };

    return (
        <div className="container-fluid col-md-12">
            <h1 className="shadow-sm p-2 bg-body-tertiary rounded">Varient Wise Report</h1>
            <div className="row justify-content-end">
                <div className="col-12 col-md-8 mb-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-3">
                            <label className="form-label">Select Chart</label>
                            <select className="form-select border-secondary" onChange={handleChartTypeChange} value={chartType}>
                                <option value="bar">Bar Chart</option>
                                <option value="area">Area Chart</option>
                                <option value="line">Line Chart</option>
                            </select>
                        </div>
                </div>
                </div>
                </div>
                <div class="d-flex justify-content-center">
                <div className="col-12 col-md-12 d-flex justify-content-center mb-3">
                    <div className="chart" style={{ position: 'relative',  width: '100%' }}>
                        <ApexCharts options={varientData.options} series={varientData.series} type={chartType} height={530} />
                    </div>
                </div></div>
            
        </div>
    );
};

export default ChartComponent;
