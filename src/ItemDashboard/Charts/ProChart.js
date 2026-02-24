import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApexCharts from 'react-apexcharts';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";  
const config = require("../../Apiconfig");

const ChartComponent = () => {
  const [itemWiseTimeRange, setItemWiseTimeRange] = useState('TodayDate');
  const [chartType, setChartType] = useState('line');
  const [itemWiseChart, setItemWiseChart] = useState([]);
  const [itemcodedrop, setitemcodedrop] = useState([]);
  const [perioddrop, setPerioddrop] = useState([]);
  const [selecteditemcode, setselecteditemcode] = useState('');
  const [item_code, setItem_code] = useState("");
  const [period, setPeriod] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });

  const navigate = useNavigate();

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/itemcode`)
      .then((data) => data.json())
      .then((val) => {
        setitemcodedrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].Item_code,
            label: val[0].Item_code,
          };
          setselecteditemcode(firstOption);
          setItem_code(firstOption.value);
        }
      });
  }, []);

  //   useEffect(() => {
  //     fetch(`${config.apiBaseUrl}/getDateRange`)
  //         .then((data) => data.json())
  //         .then((val) => {
  //             // Filter the fetched data to only include specific labels or values
  //             const filteredVal = val.filter(option => {
  //                 // Replace 'Custom Label' and 'Custom Value' with your desired criteria
  //                 return option.DateRangeDescription === 'Custom Label' || option.Sno === 'Custom Value';
  //             });

  //             setPerioddrop(filteredVal);

  //             if (filteredVal.length > 0) {
  //                 const firstOption = {
  //                     value: filteredVal[0].Sno,
  //                     label: filteredVal[0].DateRangeDescription,
  //                 };
  //                 setSelectedPeriod(firstOption);
  //                 setPeriod(firstOption.value);
  //             }
  //         });
  // }, []);

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

  //   useEffect(() => {
  //     fetch(`${config.apiBaseUrl}/getDateRange`)
  //         .then((data) => data.json())
  //         .then((val) => {
  //             // Filter out the option with DateRangeDescription "Custom Date"
  //             const filteredVal = val.filter(option => option.DateRangeDescription !== "Custom Date");

  //             setPerioddrop(filteredVal);

  //             if (filteredVal.length > 0) {
  //                 const firstOption = {
  //                     value: filteredVal[0].Sno,
  //                     label: filteredVal[0].DateRangeDescription,
  //                 };
  //                 setSelectedPeriod(firstOption);
  //                 setPeriod(firstOption.value);
  //             }
  //         });
  // }, []);

  const filteredOptionitemcode = itemcodedrop.map((option) => ({
    value: option.Item_code,
    label: option.Item_code,
  }));

  const filteredOptionPeriod = perioddrop.map((option) => ({
    value: option.Sno,
    label: option.DateRangeDescription,
  }));

  const handleChangeitemcode = (selecteditemcode) => {
    setselecteditemcode(selecteditemcode);
    setItem_code(selecteditemcode ? selecteditemcode.value : '');
  };

  const handleChangePeriod = (selectedPeriod) => {
    setSelectedPeriod(selectedPeriod);
    setPeriod(selectedPeriod ? selectedPeriod.value : '');
  };

  const fetchItemWiseData = async () => {
    try {
      const body = {
        Item_code: item_code,
        mode: period.toString(),
        company_code:sessionStorage.getItem("selectedCompanyCode")
      };
  
      if (selectedPeriod.label === "Custom Date") {
        body.start_date = customDateRange.from;
        body.End_Date = customDateRange.to;
      }
  
      const response = await fetch(`${config.apiBaseUrl}/gettransdetailchart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        const searchData = await response.json();
        setItemWiseChart(searchData);
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
  const handleItemWiseTimeRange = (e) => {
    setItemWiseTimeRange(e.target.value);
  };


  useEffect(() => {
    fetchItemWiseData();
  }, [item_code, period, customDateRange]);


  const aggregateItemWiseData = () => {
    const aggregatedData = {};

    itemWiseChart.forEach(item => {
      const dateKey = item.transaction_type;

      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = 0;
      }

      aggregatedData[dateKey] += item.total_qty;
    });

    const currentStockCategories = Object.keys(aggregatedData);
    const seriesData = Object.values(aggregatedData);

    const itemWiseSeries = [{
      name: 'Current Stock',
      data: seriesData,
      backgroundColor: '#a3d2ff'
    }];

    return { itemWiseSeries, currentStockCategories };
  };

  const { itemWiseSeries, currentStockCategories } = aggregateItemWiseData();

  const itemWiseData = {
    series: itemWiseSeries,
    options: {
      chart: {
        type: chartType,
        height: 350,
        width: 500,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -10,
        style: {
          fontSize: '10px',
          colors: ['#000'],
        },
        background: {
          enabled: false,
          foreColor: '#000',
          borderRadius: 0,
        },
        formatter: function (value, { dataPoint, seriesIndex, dataPointIndex }) {
          const item = itemWiseChart[dataPointIndex];
          const customLabel = `${item.total_qty}`;

          return customLabel;
        }
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: currentStockCategories,
        title: {
          text: 'Item Varient',
        },
      },
      yaxis: {
        title: {
          text: 'Current Stock (Qty)',
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
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(2)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(2)}K`;
            }
            return `${value} Qty`;
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
        },
      },
      labels: currentStockCategories,
    },
  };

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prevRange) => ({
      ...prevRange,
      [name]: value
    }));
  };

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow-lg p-3 rounded bg-body-tertiary mb-2 me-2">
            <div className="d-flex justify-content-between rounded">
            <div ><h1 className="PASA">Item Wise Report</h1></div>
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
      {/* <h1 className="shadow-sm p-2 bg-body-tertiary rounded">Item Wise Report</h1> */}
      <div className="row shadow-sm p-2 bg-body-tertiary rounded mb-2 me-2 ms-1 pt-4 me-1 row justify-content-center">
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
              <label className="form-label">Select Item Code</label>
              <Select
                id="wcode"
                value={selecteditemcode}
                onChange={handleChangeitemcode}
                options={filteredOptionitemcode}
                className="border-secondary"
                placeholder=""
                required title="Please select a item code"
                maxLength={18}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Select Period</label>
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
      <div class="d-flex justify-content-center">
        <div className="col-12 col-md-12 d-flex justify-content-center mb-3">
          <div className="chart" style={{ position: 'relative', width: '100%' }}>
            <ApexCharts options={itemWiseData.options} series={itemWiseData.series} type={chartType} height={530} />
          </div>
        </div></div>

    </div>
  );
};

export default ChartComponent;
