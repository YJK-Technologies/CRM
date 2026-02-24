import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import Select from 'react-select';

const config = require('./Apiconfig');

const ChartComponent = () => {
  const [currentStockChart, setCurrentStockChart] = useState([]);
  const [currentStockChartType, setCurrentStockChartType] = useState('bar');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  // Fetch warehouses for the dropdown
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/getwarehousedrop`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        const data = await response.json();

        const warehouseOptions = data.map((warehouse) => ({
          value: warehouse.warehouse_code,
          label: warehouse.warehouse_code,
        }));

        setWarehouses(warehouseOptions);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };

    fetchWarehouses();
  }, []);

  // Fetch stock data based on selected warehouse
  useEffect(() => {
    const fetchCurrentStockData = async () => {
      if (!selectedWarehouse) return; // Do nothing if no warehouse is selected

      try {
        const response = await fetch(`${config.apiBaseUrl}/warehouseDashboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ warehouse_code: selectedWarehouse.value }),
        });

        const data = await response.json();
        setCurrentStockChart(data);

        setIsDataEmpty(data.length === 0); // Update empty data state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCurrentStockData();
  }, [selectedWarehouse]); // Trigger when `selectedWarehouse` changes

  // Aggregate stock data for the chart
  const aggregateCurrentStockData = () => {
    const aggregatedData = {};

    currentStockChart.forEach((item) => {
      const item_variant = item.item_variant;

      if (!aggregatedData[item_variant]) {
        aggregatedData[item_variant] = 0;
      }

      aggregatedData[item_variant] += item.current_stock_qty;
    });

    const currentStockCategories = Object.keys(aggregatedData);
    const seriesData = currentStockCategories.map((item_variant) => aggregatedData[item_variant]);

    const currentStockSeries = [
      {
        name: 'Current Stock',
        data: seriesData,
      },
    ];

    return { currentStockSeries, currentStockCategories };
  };

  const { currentStockSeries, currentStockCategories } = aggregateCurrentStockData();
  const currentStockData = {
    series:
      currentStockChartType === 'pie' || currentStockChartType === 'donut'
        ? [{ data: currentStockSeries[0].data }]
        : currentStockSeries,
    options: {
      chart: {
        type: currentStockChartType,
        height: 400,
        zoom: { enabled: false },
      },
      xaxis: {
        categories: currentStockCategories,
        labels: {
          rotate: -45,
          style: { fontSize: '12px', color: "#0e0d0d" }, // x-axis label color
        },
      },
      yaxis: {
        title: {
          text: 'Quantity',
          style: { color: "#000" }, // y-axis title color
        },
        labels: {
          formatter: (value) => `${value} Qty`,
          style: { color: "#000" }, // y-axis label color
        },
      },
      tooltip: {
        y: {
          formatter: (value) => `${value} Qty`,
        },
      },
      plotOptions: {
        bar: { distributed: true },
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                style: {
                  color: "#0e0d0d", // Inner chart value color (black)
                  fontSize: '16px', // Adjust font size if needed
                  fontWeight: 600, // Optional: bold text
                },
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
            },
          },
        },
      },
      labels: currentStockCategories,
    },
  };
  

  return (
    <div>
      <div className="select-container">
        <select
          onChange={(e) => setCurrentStockChartType(e.target.value)}
          value={currentStockChartType}
        >
          <option value="bar">Bar</option>
          <option value="area">Area</option>
          <option value="line">Line</option>
          <option value="donut">Donut</option>
          <option value="pie">Pie</option>
        </select>

        <Select
          id="warehouse-select"
          value={selectedWarehouse}
          onChange={(selectedOption) => setSelectedWarehouse(selectedOption)}
          options={warehouses}
          placeholder="Select WC"
        />
      </div>

      {isDataEmpty ? (
        <p>No data available for the selected warehouse.</p>
      ) : (
        <ApexCharts
          options={currentStockData.options}
          series={currentStockData.series}
          type={currentStockChartType}
          height={400}
        />
      )}
    </div>
  );
};

export default ChartComponent;
