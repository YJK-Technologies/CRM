import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApexCharts from 'react-apexcharts';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
const config = require("../../Apiconfig");

const ChartComponent = () => {
    const [chartType, setChartType] = useState('line');
    const [unitChart, setUnitChart] = useState([]);

    const navigate = useNavigate();

    const location = useLocation();
    const { unit } = location.state || {}; 

    // console.log(varient)

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };


    const fetchUnitData = async () => {
          try {
            const response = await fetch(`${config.apiBaseUrl}/UomChart`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ UOM: unit}),
            });
            if (response.ok) {
              const data = await response.json();
            //   console.table(data)
            setUnitChart(data);
            } else {
              const errorMessage = await response.text();
              console.error(`Server responded with error: ${errorMessage}`);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        
      };

    useEffect(() => {
        fetchUnitData();
    }, []);


    const aggregateUnitData = () => {
        const aggregatedData = {};

        unitChart.forEach(item => {
            const dateKey =item.Product_Name;
            
            if (!aggregatedData[dateKey]) {
                aggregatedData[dateKey] = 0;
            }

            aggregatedData[dateKey] += item.Stock_Value;
        });

       // Prepare categories and series data
    const unitCategories = Object.keys(aggregatedData);
    const seriesData = Object.values(aggregatedData);

    const unitSeries = [{
        name: 'Item Varient',
        data: seriesData,
        backgroundColor: '#a3d2ff'
      }];

        return { unitSeries, unitCategories };
    };


    const { unitSeries, unitCategories } = aggregateUnitData();

    const unitData = {
        series:unitSeries,
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
                offsetY: -10, 
                style: {
                    fontSize: '10px',
                    colors: ['#000']
                },
                background: {
                    enabled: false, 
                    foreColor: '#000',
                    borderRadius: 0 
                  },
                formatter: function (value, { dataPoint, seriesIndex, dataPointIndex }) {
                    const item = unitChart[dataPointIndex];
                    const customLabel = `${item.Stock_Value}`;
    
                    return customLabel; 
                }
            },
            stroke: {
                curve: 'smooth'
                
            },
            title: {
                text: 'Total Unit Report',
                align: 'left'
            },
            xaxis: {
                categories:unitCategories,
                title: {
                    text: `${unit}`
                }
            },
            yaxis: {
                title: {
                    text: 'Total Unit Amount (₹)'
                },
                labels: {
                    formatter: function (value) {
                        if (value >= 100000) {
                          return `₹${(value / 100000).toFixed(2)}L`; 
                        } else if (value >= 1000) {
                          return `₹${(value / 1000).toFixed(2)}K`;
                        }
                        return `${value} Qty`;
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
            labels: unitCategories, 
        }
    };


    const goBack = () => {
        navigate(-1); 
      };

    return (
        <div className="container-fluid Topnav-screen">
             <div className="shadow-lg p-0 rounded bg-body-tertiary mb-2 me-2">
            <div className="d-flex justify-content-between rounded">
            <div ><h1 className="PASA">Unit Wise Report</h1></div>
            <div className="mobileview">
          <div class="d-flex justify-content-between mt-2" >
           <button onClick={goBack} class="btn btn-danger" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
            </div>
          </div>
            <div className="purbut">
            <div className="d-flex justify-content-end me-5">
            <div class="d-flex justify-content-end mb-2 me-3 ms-3">
            <div class="mt-2">
              <button class="btn btn-danger" style={{cursor:"pointer"}} onClick={goBack}>
              <i class="fa-solid fa-xmark"></i>
              </button>
              </div>
              </div>
            </div>
          </div>
          </div>
          </div>
            {/* <h1 className="shadow-sm p-2 bg-body-tertiary rounded">Unit Wise Report</h1> */}
            <div className="row shadow-sm p-2 bg-body-tertiary rounded mb-2 me-2 ms-1 pt-4 me-1 row justify-content-end">
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
                        <ApexCharts options={unitData.options} series={unitData.series} type={chartType} height={530} />
                    </div>
                </div></div>
            
        </div>
    );
};

export default ChartComponent;
