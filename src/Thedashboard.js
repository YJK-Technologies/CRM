import React, { useEffect, useState, useRef } from 'react';
import Chart, { Legend } from 'chart.js/auto';
import './Dashboard.css';

import { useNavigate } from "react-router-dom";
const config = require('./Apiconfig');

const Dashboard = () => {
  const navigate = useNavigate();
  const [salesChartType, setSalesChartType] = useState('bar');
  const [itemSalesChartType, setItemSalesChartType] = useState('bar');
  const [purchaseChartType, setPurchaseChartType] = useState('bar');
  const [currentStockChartType, setCurrentStockChartType] = useState('bar');
  const [negativeStockChartType, setNegativeStockChartType] = useState('bar');
  const [salesTimeRange, setSalesTimeRange] = useState('TodayDate');
  const [itemSalesTimeRange, setItemSalesTimeRange] = useState('TodayDate');
  const [receivedPendingTimeRange, setReceivedPendingTimeRange] = useState('TodayDate');
  const [purchaseTimeRange, setPurchaseTimeRange] = useState('TodayDate');
  const [currentStockTimeRange, setCurrentStockTimeRange] = useState('TodayDate');
  const [negativeStockTimeRange, setNegativeStockTimeRange] = useState('TodayDate');

  const salesValueChartRef = useRef(null);
  const itemSalesChartRef = useRef(null);
  const purchaseChartRef = useRef(null);
  const currentStockChartRef = useRef(null);
  const negativeStockChartRef = useRef(null);

  const [totalSales, setTotalSales] = useState('');
  const [totalPurchase, setTotalPurchase] = useState('');
  const [totalItem, setTotalItem] = useState('');
  const [totalCloseItem, setTotalCloseItem] = useState('');
  const [totalActiveItem, setTotalActiveItem] = useState('');
  const [stock, setStock] = useState('');

  const [salesChartData, setSalesChartData] = useState([]);
  const [purchaseChartData, setPurchaseChartData] = useState([]);
  const [itemWiseSalesChartData, setItemWiseSalesChartData] = useState([]);
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });

  const fetchSalesData = async (timeRange) => {
    try {
      let url = `http://localhost:5500/getDashboardSales${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`;
      if (timeRange === 'CustomDate' && customDateRange.from && customDateRange.to) {
        url += `?from=${customDateRange.from}&to=${customDateRange.to}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSalesChartData(data);
      } else {
        console.error('Failed to fetch sales data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error.message);
    }
  };
  
  const fetchPurchaseData = async (timeRange) => {
    try {
      let url = `http://localhost:5500/getDashboardPurchase${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`;
      if (timeRange === 'CustomDate' && customDateRange.from && customDateRange.to) {
        url += `?from=${customDateRange.from}&to=${customDateRange.to}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPurchaseChartData(data);
      } else {
        console.error('Failed to fetch Purchase data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Purchase data:', error.message);
    }
  };

  const fetchItemWiseSalesData = async (timeRange) => {
    try {
      let url = `http://localhost:5500/getDashboardItemSales${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`;
      if (timeRange === 'CustomDate' && customDateRange.from && customDateRange.to) {
        url += `?from=${customDateRange.from}&to=${customDateRange.to}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setItemWiseSalesChartData(data);
      } else {
        console.error('Failed to fetch Purchase data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Purchase data:', error.message);
    }
  };
  
  useEffect(() => {
    fetchSalesData(salesTimeRange); 
  }, [salesTimeRange]);

  useEffect(() => {
    fetchPurchaseData(purchaseTimeRange);
  }, [purchaseTimeRange]);

  useEffect(() => {
    fetchItemWiseSalesData(itemSalesTimeRange);
  }, [itemSalesTimeRange]);


  const getDataBasedOnTimeRange = (timeRange, data) => {
    switch (timeRange) {
      case 'year':
        return data;
      case 'month':
        return data.slice(0, 6);
      case 'week':
        return data.slice(0, 4);
      case 'day':
        return data.slice(0, 1);
      default:
        return data;
    }
  };

  const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

  useEffect(() => {
    const salesValueData = {
      labels: salesChartData.map(item => item.MonthYear), 
      datasets: [{
        label: 'Sales Value',
        data: salesChartData.map(item => item.TotalSaleAmount),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: 3,
        tension: 0.3,
        pointHoverRadius: 5,
        datalabels: {
          align: 'top',
          anchor: 'end',
          color: 'black',
          font: {
            weight: 'bold',
          },
          formatter: (value) => `$${value}`,
        },
      }],
    };

    const itemSalesData = {
      labels: itemWiseSalesChartData.map(item => item.item_code),
      datasets: [{
        label: 'Item-wise Sales',
        data: itemWiseSalesChartData.map(item => item.OverallTotalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: 3,
        tension: 0.3,
        pointHoverRadius: 5,
        datalabels: {
          align: 'top',
          anchor: 'end',
          color: 'black',
          font: {
            weight: 'bold',
          },
          formatter: (value) => `$${value}`,
        },
      }],
    };

    const purchaseData = {
      labels: purchaseChartData.map(item => item.MonthYear), 
      datasets: [{
        label: 'purchase Value',
        data: purchaseChartData.map(item => item.TotalPurchaseAmount),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: 3,
        tension: 0.3,
        pointHoverRadius: 5,
        datalabels: {
          align: 'top',
          anchor: 'end',
          color: 'black',
          font: {
            weight: 'bold',
          },
          formatter: (value) => `$${value}`,
        },
      }],
    };

    const currentStockData = {
      labels: ['Warehouse 1', 'Warehouse 2', 'Warehouse 3'],
      datasets: [{
        label: 'Current Stock',
        data: getDataBasedOnTimeRange(currentStockTimeRange, [200, 150, 100]),
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        borderColor: 'rgba(255, 205, 86, 1)',
        borderWidth: 1
      }]
    };

    const negativeStockData = {
      labels: ['Item A', 'Item B', 'Item C'],
      datasets: [{
        label: 'Negative Stock',
        data: getDataBasedOnTimeRange(negativeStockTimeRange, [5, 10, 8]),
        backgroundColor: 'rgba(201, 203, 207, 0.2)',
        borderColor: 'rgba(201, 203, 207, 1)',
        borderWidth: 1
      }]
    };

    // Function to create a chart
    const createChart = (ref, type, data) => {
      const ctx = ref.current.getContext('2d');
      if (ref.current.chart) {
        ref.current.chart.destroy();
      }
      
      // Configure 'area' chart as a 'line' chart with fill option
      const isAreaChart = type === 'area';
      const chartType = isAreaChart ? 'line' : type;
      
      ref.current.chart = new Chart(ctx, {
        type: chartType,
        data,
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            datalabels: {
              display: false // Ensure data labels are hidden if necessary
            }
          },
         grid: {
      show: false,      // you can either change hear to disable all grids
      xaxis: {
        lines: {
          show: false  //or just here to disable only x axis grids
         }
       },  
      yaxis: {
        lines: { 
          show: false  //or just here to disable only y axis
         }
       },  
    },
          elements: {
            line: {
              fill: isAreaChart // Fill the area for 'area' charts
            }
          }
        }
      });
    };

    createChart(salesValueChartRef, salesChartType, salesValueData);
    createChart(itemSalesChartRef, itemSalesChartType, itemSalesData);
    createChart(purchaseChartRef, purchaseChartType, purchaseData);
    createChart(currentStockChartRef, currentStockChartType, currentStockData);
    createChart(negativeStockChartRef, negativeStockChartType, negativeStockData);

  }, [salesChartData, salesTimeRange,salesChartType, itemSalesChartType, purchaseChartData, purchaseTimeRange, purchaseChartType, currentStockChartType, negativeStockChartType, salesTimeRange, itemSalesTimeRange, receivedPendingTimeRange, purchaseTimeRange, currentStockTimeRange, negativeStockTimeRange]); // Recreate charts when chartType or timeRange changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getAllDashboardData`);
        const data = await response.json();
        const [{TotalSales,TotalPurchase,Result}] = data;
        setTotalSales(TotalSales);
        setTotalPurchase(TotalPurchase);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/DashboardItemData`);
        const data = await response.json();
        const [{totalItem,totalCloseItem,totalActiveItem}] = data;
        setTotalItem(totalItem);
        setTotalCloseItem(totalCloseItem);
        setTotalActiveItem(totalActiveItem);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/DashboardStockData`);
        const data = await response.json();
        const [{overallStockValue}] = data;
        setStock(overallStockValue);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleNavigateToItem = (e) => {
    navigate("/ItemData");
    e.preventDefault();
  };

  const handleNavigateToSalesTrans = (e) => {
    navigate("/SalesAnalysis");
    e.preventDefault();
  };

  const handleNavigateToProductDash = (e) => {
    navigate("/PurchaseAnalysis");
    e.preventDefault();
  };
  const handleNavigateToTStockDash = (e) => {
    navigate("/TotalStock");
    e.preventDefault();
  };

  const formattedTotalSales = totalSales.toLocaleString('en-IN');
  const formattedTotalPurchase = totalPurchase.toLocaleString('en-IN');
  const formattedTotalStock = stock.toLocaleString('en-IN');


  const handleCustomDateRangeChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container-fluid mt-2">
    
      <div className="dashboard">
       
        <div className="card bg-primary shadow-lg rounded-4 border-primary" style={{cursor:"pointer"}} onClick={handleNavigateToSalesTrans}>
          <div class="text-white fw-bold">Total sales</div>
          <div className=' text-white fs-4 d-flex justify-content-center  mt-2' style={{fontFamily:"helvatica"}}>₹ {formattedTotalSales}</div>
      
        </div>
        <div className="card bg-success shadow-lg rounded-4 border-success"  style={{cursor:"pointer"}} onClick={handleNavigateToProductDash}>
          <div class="text-white fw-bold">Total Purchase</div>
          <div className=' text-white fs-4 d-flex justify-content-center mt-2' style={{fontFamily:"helvatica"}}>₹  {formattedTotalPurchase}</div>
          
        </div>
        <div className="card bg-danger shadow-lg rounded-4 border-danger"  style={{cursor:"pointer"}}  onClick={handleNavigateToItem}>
          <div class="text-white fw-bold">Total Items</div>
          <div className=' text-white fs-4 d-flex justify-content-center  mt-2' style={{fontFamily:"helvatica"}} > {totalActiveItem}/{totalItem}</div>
          
        </div>
        <div className="card bg-info shadow-lg rounded-4 border-info"  style={{cursor:"pointer"}} onClick={handleNavigateToTStockDash}>
          <div class="text-white fw-bold">Total Stock Values</div>
          <div className='text-white fs-4 d-flex justify-content-center  mt-2' style={{fontFamily:"helvatica"}} >₹  {formattedTotalStock}</div>
        
        </div>
      </div>
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="chart">
            <h3>Sales Value</h3>
            <div className="select-container">
            {/* <select className="form-select" onChange={(e) => setSalesChartType(e.target.value)} value={salesChartType}> */}
            <select  onChange={(e) => setSalesChartType(e.target.value)} value={salesChartType}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option> 
            </select>
            <select onChange={(e) => setSalesTimeRange(e.target.value)} value={salesTimeRange}>
            <option value="TodayDate">Today Date</option>
              <option value="LastWeek">Last Week</option>
              <option value="CurrentMonth">Current Month</option>
              <option value="LastThreeMonth">Last 3 Months</option>
              <option value="LastYear">Last Year</option>
              <option value="CurrentFinancialYear">Current Financial Year</option>
              <option value="CustomDate">Custom Date</option>
            </select>
            </div>
            <canvas ref={salesValueChartRef} id="salesValueChart"></canvas>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="chart">
            <h3>Item-wise Sales</h3>
            <div className="select-container">
            <select onChange={(e) => setItemSalesChartType(e.target.value)} value={itemSalesChartType}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option> 
            </select>
            <select onChange={(e) => setItemSalesTimeRange(e.target.value)} value={itemSalesTimeRange}>
            <option value="TodayDate">Today Date</option>
              <option value="LastMonth">Last Month</option>
              <option value="LastYear">Last Year</option>
              <option value="CurrentFinancialYear">Current Financial Year</option>
              <option value="CustomDate">Custom Date</option>
            </select>
            </div>
            <canvas ref={itemSalesChartRef} id="item-sales-chart"></canvas>
          </div>
        </div>
       
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="chart">
            <h3>Purchase</h3>
            <div className="select-container">
            <select onChange={(e) => setPurchaseChartType(e.target.value)} value={purchaseChartType}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option> 
            </select>
            <select onChange={(e) => setPurchaseTimeRange(e.target.value)} value={purchaseTimeRange}>
              <option value="TodayDate">Today Date</option>
              <option value="LastWeek">Last Week</option>
              <option value="CurrentMonth">Current Month</option>
              <option value="LastThreeMonth">Last 3 Months</option>
              <option value="LastYear">Last Year</option>
              <option value="CurrentFinancialYear">Current Financial Year</option>
              <option value="CustomDate">Custom Date</option>
            </select>
            </div>
            <canvas ref={purchaseChartRef} id="purchase-chart"></canvas>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="chart">
            <h3>Current Stock</h3>
            <div className="select-container">
            <select onChange={(e) => setCurrentStockChartType(e.target.value)} value={currentStockChartType}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option> 
            </select>
            <select onChange={(e) => setCurrentStockTimeRange(e.target.value)} value={currentStockTimeRange}>
            <option value="TodayDate">Today Date</option>
              <option value="LastWeek">Last Week</option>
              <option value="currentMonth">Current Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="CFY">Current Financial Year</option>
              <option value="CustomDate">Custom Date</option>
            </select>
            </div>
            <canvas ref={currentStockChartRef} id="current-stock-chart"></canvas>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="chart">
            <h3>Negative Stock</h3>
            <div className="select-container">
            <select onChange={(e) => setNegativeStockChartType(e.target.value)} value={negativeStockChartType}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="area">Area</option> 
            </select>
            </div>
            <canvas ref={negativeStockChartRef} id="negative-stock-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
