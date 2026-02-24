import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApexCharts from 'react-apexcharts';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; 
const config = require("../Apiconfig");

const ChartComponent = () => {
    const [purchaseTimeRange, setPurchaseTimeRange] = useState('TodayDate');
    const [chartType, setChartType] = useState('line');
    const [selectedVendor, setSelectedVendor] = useState('');
    const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
    const [purchaseChart, setPurchaseChart] = useState([]);
    const [perioddrop, setPerioddrop] = useState([]);
    const [period, setPeriod] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getDateRange`)
            .then((data) => data.json())
            .then((val) => {
                setPerioddrop(val);

                if (val.length > 0) {
                    const firstOption = {
                        value: val[0].Sno,
                        label: val[0].DateRangeDescription,
                    };
                    setSelectedPeriod(firstOption);
                    setPeriod(firstOption.value);
                }
            });
    }, []);

    const filteredOptionPeriod = perioddrop.map((option) => ({
        value: option.Sno,
        label: option.DateRangeDescription,
    }));

    const handleChangePeriod = (selectedPeriod) => {
        setSelectedPeriod(selectedPeriod);
        setPeriod(selectedPeriod ? selectedPeriod.value : '');
    };

    // const fetchPurchaseData = async (timeRange, vendor = '', customRange = {}) => {
    //     const endpoints = {
    //         lastMonth: 'getPurchaseAnalLM',
    //         last3Months: 'getPurchaseAnalL3M',
    //         lastYear: 'getPurchaseAnalLY',
    //         currentMonth: 'getPurchaseAnalCM',
    //         TodayDate: 'getPurchaseAnalTD',
    //         LastWeek: 'getPurchaseAnalLW',
    //         CFY: 'getPurchaseAnalCFY',
    //         CustomDate: 'getPurchaseAnalCD'
    //     };
    //     const endpoint = endpoints[timeRange] || 'getPurchaseAnalLM';
    //     let url = `${config.apiBaseUrl}/${endpoint}${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}?vendor=${vendor}`;

    //     if (timeRange === 'CD' && customRange.from && customRange.to) {
    //         url += `&from=${customRange.from}&to=${customRange.to}`;
    //     }

    //     try {
    //         const options = {
    //             method: timeRange === 'CustomDate' ? 'POST' : 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: timeRange === 'CustomDate' ? JSON.stringify({ vendor: vendor, StartDate: customRange.from, EndDate: customRange.to }) : undefined
    //         };

    //         const response = await fetch(url, options);

    //         if (response.ok) {
    //             const data = await response.json();
    //             setPurchaseChart(data);
    //             console.log("purchase Data :", data);
    //         } else {
    //             console.error('Failed to fetch purchase data:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching purchase data:', error.message);
    //     }
    // };
        const location = useLocation();
    const { type } = location.state || {}; 


    const fetchPurchaseData = async () => {
        try {
            const body = {
                mode: period.toString(),
                company_code:sessionStorage.getItem("selectedCompanyCode"),
                Type : type

            };

            if (selectedPeriod.label === "Custom Date") {
                body.StartDate = customDateRange.from;
                body.EndDate = customDateRange.to;
            }

            const response = await fetch(`${config.apiBaseUrl}/getPurchaseAnalysisChart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const searchData = await response.json();
                setPurchaseChart(searchData);
                console.log(searchData);
            } else if (response.status === 404) {
                console.log("Data Not found");
            } else {
                console.log("Bad request");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    };

    useEffect(() => {
        fetchPurchaseData();
    }, [period, selectedVendor, customDateRange]);

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleTimeRangeChange = (e) => {
        setPurchaseTimeRange(e.target.value);
        if (e.target.value !== 'CustomDate') {
            setCustomDateRange({ from: '', to: '' });
        }
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

    // Aggregate purchase data for series and categories
    const aggregatePurchaseData = () => {
        const aggregatedData = {};

        purchaseChart.forEach(item => {
            const dateKey = (selectedPeriod.label === 'Current Financial Year' || selectedPeriod.label === 'Last Three Months' || selectedPeriod.label === 'LastYear') ? (item.MonthYear) : formatDate(item.transaction_date);
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
        series: series,
        options: {
            chart: {
                type: chartType,
                height: 600,
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false,
                offsetY: -10,
                style: {
                    fontSize: '10px',
                    colors: ['#000'],
                    
                },
                background: {
                    enabled: false, // Disables background
                    foreColor: '#000', // Set foreground color for text if needed
                    borderRadius: 0,
                     // No border radius
                },
                formatter: function (value, { dataPoint, seriesIndex, dataPointIndex }) {
                    const item = purchaseChart[dataPointIndex];
                    const customLabel = `${item.vendor_code}, ${item.TotalPurchaseAmount}`;
                    return customLabel;
                }
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Vendor Purchased Report',
                align: 'left'
            },
            xaxis: {
                categories: categories,
                title: {
                    text: 'Date'
                }
            },
            yaxis: {
                title: {
                    text: 'Total Purchase Amount (₹)'
                },
                labels: {
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

    const goBack = () => {
        navigate(-1); 
      };


    return (
        <div className="container-fluid Topnav-screen">
            <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2 me-2">
            <div className="d-flex justify-content-between">
          <h1 className="purbut">Purchase Report</h1>
            <div className="mobileview">
          <div class="d-flex justify-content-between mt-2" >
          <h1 className="h1" style={{marginRight: "0"}}>Purchase Report</h1>
                
                <button onClick={goBack} class="btn btn-danger ms-5 me-5 mt-3 mb-3" required title="Close" >
                <i class="fa-solid fa-xmark"></i>
                </button>

            </div>
          </div>
            <div className="purbut">
            <div className="d-flex justify-content-end me-5">
            <div class="d-flex justify-content-end mb-2 ">
            <div class="">
              <button class="btn btn-danger " style={{cursor:"pointer"}} onClick={goBack}>
              <i class="fa-solid fa-xmark"></i>
              </button>
              </div>
              </div>
            </div>
          </div>
          </div>
          </div>
            <div className="row shadow-sm p-2 bg-body-tertiary rounded mb-2 me-2  ms-1 pt-4 me-1 justify-content-end">
                <div className="col-12 col-md-8 mb-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-3">
                            <label className="form-label">Select Chart</label>
                            <select className="form-select border-secondary" onChange={handleChartTypeChange} value={chartType}>
                                <option value="line">Line Chart</option>
                                <option value="bar">Bar Chart</option>
                                <option value="area">Area Chart</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-3">
                            <label className="form-label">Select Period</label>
                            {/* <select className="form-select border-secondary" onChange={handleTimeRangeChange} value={purchaseTimeRange}>
                                <option value="TodayDate">Today Date</option>
                                <option value="LastWeek">Last Week</option>
                                <option value="currentMonth">Current Month</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="last3Months">Last 3 Months</option>
                                <option value="lastYear">Last Year</option>
                                <option value="CFY">Current Financial Year</option>
                                <option value="CustomDate">Custom Date</option>
                            </select> */}
                            <Select
                                id="wcode"
                                value={selectedPeriod}
                                onChange={handleChangePeriod}
                                options={filteredOptionPeriod}
                                className="border-secondary"
                                placeholder=""
                                required title="Please select a item code"
                                maxLength={18}
                            />
                        </div>
                        {selectedPeriod.label === "Custom Date" && (
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
            <div className="me-1 ms-1">
                <div className="col-12 col-md-12 d-flex justify-content-center ">
                    <div className="chart" style={{ position: 'relative', width: '100%' }}>
                        <ApexCharts options={purchaseData.options} series={purchaseData.series} type={chartType} height={530} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;
