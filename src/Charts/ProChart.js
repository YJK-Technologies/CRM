import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApexCharts from 'react-apexcharts';
const config = require("../../Apiconfig");

const ChartComponent = () => {
    const [purchaseTimeRange, setPurchaseTimeRange] = useState('TodayDate');
    const [chartType, setChartType] = useState('line');
    const [selectedVendor, setSelectedVendor] = useState('');
    const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
    const [purchaseChart, setPurchaseChart] = useState([]);

    const fetchPurchaseData = async (timeRange, vendor = '', customRange = {}) => {
        const endpoints = {
            lastMonth: 'getPurchaseAnalLM',
            last3Months: 'getPurchaseAnalL3M',
            lastYear: 'getPurchaseAnalLY',
            currentMonth: 'getPurchaseAnalCM',
            TodayDate: 'getPurchaseAnalTD',
            LastWeek: 'getPurchaseAnalLW',
            CFY: 'getPurchaseAnalCFY',
            CustomDate: 'getPurchaseAnalCD'
        };
        const endpoint = endpoints[timeRange] || 'getPurchaseAnalLM';
        let url = `${config.apiBaseUrl}/${endpoint}${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}?vendor=${vendor}`;

        if (timeRange === 'CD' && customRange.from && customRange.to) {
            url += `&from=${customRange.from}&to=${customRange.to}`;
        }

        try {
            const options = {
                method: timeRange === 'CustomDate' ? 'POST' : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: timeRange === 'CustomDate' ? JSON.stringify({ vendor: vendor, StartDate: customRange.from, EndDate: customRange.to }) : undefined
            };

            const response = await fetch(url, options);

            if (response.ok) {
                const data = await response.json();
                setPurchaseChart(data);
            } else {
                console.error('Failed to fetch purchase data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching purchase data:', error.message);
        }
    };
    

    useEffect(() => {
        fetchPurchaseData(purchaseTimeRange, selectedVendor, customDateRange);
    }, [purchaseTimeRange, selectedVendor, customDateRange]);

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleTimeRangeChange = (e) => {
        setPurchaseTimeRange(e.target.value);
        if (e.target.value !== 'CustomDate') {
            setCustomDateRange({ from: '', to: '' });
        }
    };

    const handleVendorChange = (e) => {
        setSelectedVendor(e.target.value);
    };

    const handleCustomDateChange = (e) => {
        const { name, value } = e.target;
        setCustomDateRange((prevRange) => ({
            ...prevRange,
            [name]: value
        }));
    };

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const aggregatePurchaseData = () => {
        const aggregatedData = {};

        purchaseChart.forEach(item => {
            const dateKey = (purchaseTimeRange === 'CFY' || purchaseTimeRange === 'last3Months' || purchaseTimeRange === 'lastYear') ? (item.MonthYear) : formatDate(item.transaction_date);
            if (!aggregatedData[dateKey]) {
                aggregatedData[dateKey] = {};
            }
            aggregatedData[dateKey][item.vendor_code] = item.TotalPurchaseAmount;
        });

        const categories = [];
        const seriesData = {};

        for (const date in aggregatedData) {
            categories.push(date);
            for (const vendor in aggregatedData[date]) {
                if (!seriesData[vendor]) {
                    seriesData[vendor] = [];
                }
                seriesData[vendor].push(aggregatedData[date][vendor]);
            }
        }

        const series = Object.keys(seriesData).map(vendor => ({
            name: vendor,
            data: seriesData[vendor],
            backgroundColor: '#a3d2ff'
        }));

        return { series, categories };
    };


    const { series, categories } = aggregatePurchaseData();

    const purchaseData = {
        series:series,
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
                    const item = purchaseChart[dataPointIndex];
                    const customLabel = `${item.vendor_code},${item.TotalPurchaseAmount}`;
    
                    return customLabel; // Customize label text
                }
            },
            stroke: {
                curve: 'smooth'
                
            },
            title: {
                text: 'Total Item Sales Report',
                align: 'left'
            },
            xaxis: {
                categories:categories,
                title: {
                    text: 'Date'
                }
            },
            yaxis: {
                title: {
                    text: 'Total Item Amount (₹)'
                },
                labels: {
                    formatter: function (value) {
                        return `₹${value / 10000000}L`;
                    }
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
            }
        }
    };

    return (
        <div className="container-fluid col-md-12">
            <h1 className="shadow-sm p-2 bg-body-tertiary rounded">Item Wise Report</h1>
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
                        <div className="col-12 col-md-3">
                            <label className="form-label">Select Period</label>
                            <select className="form-select border-secondary" onChange={handleTimeRangeChange} value={purchaseTimeRange}>
                                <option value="TodayDate">Today Date</option>
                                <option value="LastWeek">Last Week</option>
                                <option value="currentMonth">Current Month</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="last3Months">Last 3 Months</option>
                                <option value="lastYear">Last Year</option>
                                <option value="CFY">Current Financial Year</option>
                                <option value="CustomDate">Custom Date</option>
                            </select>
                        </div>
                        {purchaseTimeRange === "CustomDate" && (
                             <div className="row">
                        <div className="col-12 col-md-3">
                            <label className="form-label">From</label>
                            <input
                                type="date"
                                className="form-control border-secondary"
                                name="from"
                                value={customDateRange.from}
                                onChange={handleCustomDateChange}
                            />
                        </div>
                        <div className="col-12 col-md-3">
                            <label className="form-label">To</label>
                            <input
                                type="date"
                                className="form-control border-secondary"
                                name="to"
                                value={customDateRange.to}
                                onChange={handleCustomDateChange}
                            />
                        </div>
                    </div>
                )}
                </div>
                </div>
                </div>
                <div class="d-flex justify-content-center">
                <div className="col-12 col-md-12 d-flex justify-content-center mb-3">
                    <div className="chart" style={{ position: 'relative',  width: '100%' }}>
                        <ApexCharts options={purchaseData.options} series={purchaseData.series} type={chartType} height={530} />
                    </div>
                </div></div>
            
        </div>
    );
};

export default ChartComponent;
