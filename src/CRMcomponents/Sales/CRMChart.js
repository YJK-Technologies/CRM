import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Select from 'react-select';
import { useState, useRef, useEffect } from 'react';
import './Column.css';
import config from '../../Apiconfig';
import { toast, ToastContainer } from "react-toastify";
import './Column.css';
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const pieColors = [
  '#0088FE', // Blue
  '#00C49F', // Cyan/Green
  '#FFBB28', // Yellow/Orange
  '#FF8042', // Orange/Red
  '#AF19FF', // Violet
  '#FF0054', // Raspberry

  '#30D5C8', // Turquoise
  '#8A2BE2', // BlueViolet
  '#FFD700', // Gold

  '#E60049', // Strong Red
  '#00FF00', // Lime Green
  '#00FFFF', // Aqua
  '#9932CC', // Dark Orchid
  '#FF4500', // Orange Red

  '#228B22', // Forest Green
  '#87CEEB', // Sky Blue
  '#FF69B4', // Hot Pink
  '#D2B48C', // Tan
  '#F08080'  // Light Coral
];

const chartOptions = [
  { value: 'pie', label: 'Pie Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' }
];

export default function CRMCharts() {
  const navigate = useNavigate();

  const [leadChartType, setLeadChartType] = useState('bar');
  const [stageChartType, setStageChartType] = useState('bar');
  const [salesChartType, setSalesChartType] = useState('bar');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupActivity, setShowPopupActivity] = useState(false);
  const [showPopupPipeline, setShowPopupPipeline] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryActivity, setSearchQueryActivity] = useState("");
  const [searchQueryPipeline, setSearchQueryPipeline] = useState("");
  const [leadSources, setLeadSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [FromDate, setFromdate] = useState("");
  const [ToDate, settoDate] = useState("");
  const [revenueBySalesperson, setRevenueBySalesperson] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openDropdownPipeline, setOpenDropdownPipeline] = useState(null);
  const [start_date, setStart_date] = useState(null);
  const [end_date, setEnd_date] = useState(null);
  const pipelinePopupRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const yearOptions = [2025, 2026];
  const [activeTab, setActiveTab] = useState('Sales Team');

  const pipelinePeriodOptions = [
    "Sales Team",
    "Salesperson",
    "City",
    "Country",
    "Stage",
    "Source",
    "Campaign",
    "Medium",
  ];

  const handleActivityChartClick = (clickedData) => {
    navigate("/ActivityAnalysis", { state: { clickedData } });
  };

  const handleSalesTeamChart = (clickedData) => {
    navigate("/LeadsAnalysis", { state: { clickedData } });
  };

  const handleSearchPipeline = () => {
    fetchPipelineChart();
  };

  const fetchPipelineChart = async () => {
    if (selectedPipeline.length === 0) {
      toast.warning("Please select at least one period before searching.");
      return;
    }

    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const selectedModes = selectedPipeline.map((p) => modeMapPipeline[p]).filter(Boolean);
    const mode = selectedModes.join(",");

    const mappedKeys = selectedModes.map(m => {
      if (m === 'TEAM') return 'Sales_Team_Name';
      if (m === 'SALESMAN') return 'SalesPerson_Name';
      if (m === 'CITY') return 'City';
      if (m === 'COUNTRY') return 'Country';
      if (m === 'STAGE') return 'Stage';
      if (m === 'SOURCE') return 'SourceName';
      if (m === 'CAMPAIGN') return 'CampaignName';
      if (m === 'MEDIUM') return 'MediumName';
      if (m.endsWith('CDYEAR')) return 'Year';
      if (m.endsWith('CDQUARTER')) return 'Quarter';
      if (m.endsWith('CDMONTH')) return 'Month';
      if (m.endsWith('CDDATE')) return 'Date';
      if (m.endsWith('ECYEAR')) return 'Year';
      if (m.endsWith('ECQUARTER')) return 'Quarter';
      if (m.endsWith('ECMONTH')) return 'Month';
      if (m.endsWith('ECDATE')) return 'Date';
      if (m.endsWith('EXPCLOSING_YEAR')) return 'Stage';
      return null;
    });

    const primaryKey = mappedKeys[0];
    const secondaryKey = mappedKeys[1];

    const allGroupingKeys = mappedKeys.filter(Boolean);
    const allModeNames = selectedModes.filter(Boolean).map(m => m);

    if (!mode) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${config.apiBaseUrl}/Pipelinechart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          From_Date: FromDate,
          To_Date: ToDate,
          company_code: company_code,
          mode,
          DynamicYear: selectedYear || 2025
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch pipeline chart data");
      const data = await response.json();

      if (primaryKey && secondaryKey) {
        const transformedDataMap = new Map();
        const allSecondaryKeys = new Set();

        const tertiaryKeys = allGroupingKeys.slice(2);

        data.forEach(item => {
          const primaryName = item[primaryKey] || 'None';
          const count = item.OpportunityCount || 0;

          let uniqueStackSegmentName = item[secondaryKey] || 'None';

          tertiaryKeys.forEach(key => {
            uniqueStackSegmentName += ` / ${item[key] || 'None'}`;
          });

          if (!transformedDataMap.has(primaryName)) {
            transformedDataMap.set(primaryName, {
              name: primaryName,
              OpportunityCountSum: 0,
            });
          }

          const currentEntry = transformedDataMap.get(primaryName);

          currentEntry[uniqueStackSegmentName] = (currentEntry[uniqueStackSegmentName] || 0) + count;
          currentEntry.OpportunityCountSum += count;

          if (!currentEntry.rawItems) {
            currentEntry.rawItems = [];
          }
          currentEntry.rawItems.push({ ...item, uniqueStackSegmentName: uniqueStackSegmentName, TYPE: item.TYPE || "UNKNOWN", });

          allSecondaryKeys.add(uniqueStackSegmentName);
        });

        const chartData = Array.from(transformedDataMap.values());

        setRevenueBySalesperson({
          data: chartData,
          xKey: 'name',
          yKeys: Array.from(allSecondaryKeys),
          isStacked: true,
          allModeNames: allModeNames,
          allGroupingKeys: allGroupingKeys
        });
      } else {
        const formattedData = data.map((item) => ({
          name:
            item.City ||
            item.Country ||
            item.Sales_Team_Name ||
            item.SalesPerson_Name ||
            item.Stage ||
            item.SourceName ||
            item.CampaignName ||
            item.MediumName ||
            item.Year ||
            item.Quarter ||
            item.Month ||
            item.Date ||
            item.Total_Expected_Revenue ||
            "Unknown",
          value: item.OpportunityCount || 0,
          TYPE: item.TYPE || "UNKNOWN",
          rawItem: item
        }));

        setRevenueBySalesperson({
          data: formattedData,
          xKey: 'name',
          yKeys: 'value',
          isStacked: false,
          allModeNames: allModeNames,
          allGroupingKeys: allGroupingKeys
        });
      }

    } catch (err) {
      console.error("Error fetching pipeline chart:", err);
      toast.error("Failed to load pipeline chart data!");
      setRevenueBySalesperson({ data: [], xKey: 'name', yKeys: 'value', isStacked: false });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (selectedPipeline.length === 0) return;

  //   const lastSelected = selectedPipeline[selectedPipeline.length - 1];
  //   const isDayMode = lastSelected.includes("Day");
  //   const isCreationOn = lastSelected === "Creation On";

  //   if (isCreationOn) {
  //     if (selectedYear) {
  //       fetchPipelineChart("EXPCLOSING_YEAR", selectedYear);
  //     }
  //     return;
  //   }

  //   if (isDayMode) {
  //     if (FromDate && ToDate) {
  //       fetchPipelineChart(lastSelected);
  //     }
  //   } else {
  //     fetchPipelineChart(lastSelected);
  //   }
  // }, [selectedPipeline, FromDate, ToDate, selectedYear]);

  useEffect(() => {
    const lastSelected = selectedPipeline[selectedPipeline.length - 1];
    const isDayMode = lastSelected?.includes("Day");

      if (isDayMode && FromDate && ToDate) {
        fetchPipelineChart(lastSelected);
      }

  }, [FromDate, ToDate]);

  const handleChartClick = (clickedData) => {
    navigate("/PipelineAnalysis", { state: { clickedData } });
  };

  const periodOptions = [
    "Sales Team",
    "Salesperson",
    "City",
    "Country",
    "Stage",
    "Source",
    "Campaign",
    "Medium",
  ]

  const ActivityOptions = [
    "Activity",
    "Type",
    "Stage",
  ];

  const dateFilterOptions = [
    "Creation Date",
    "Expected Closing"
  ];

  const dateFilterOptionsActivity = [
    "Creation Date"
  ];

  const dateFilterOptionsPipeline = [
    "Creation Date",
    "Expected Closing",
    "Creation On"
  ];

  const modeMap = {
    // Normal filters
    "Sales Team": "TEAM",
    "Salesperson": "SALESMAN",
    "City": "CITY",
    "Country": "COUNTRY",
    "Stage": "STAGE",
    "Source": "SOURCE",
    "Campaign": "CAMPAIGN",
    "Medium": "MEDIUM",

    // Creation Date Filters
    "Creation Date: Year": "CDYEAR",
    "Creation Date: Quarter": "CDQUARTER",
    "Creation Date: Month": "CDMONTH",
    "Creation Date: Day": "CDDATE",

    // Expected Closing Filters
    "Expected Closing: Year": "ECYEAR",
    "Expected Closing: Quarter": "ECQUARTER",
    "Expected Closing: Month": "ECMONTH",
    "Expected Closing: Day": "ECDATE",

  };

  const modeMapActivity = {
    // Normal filters
    "Activity": "ACTIVITY",
    "Type": "TYPE",
    "Stage": "STAGE",

    // Creation Date Filters
    "Creation Date: Year": "CDYEAR",
    "Creation Date: Quarter": "CDQUARTER",
    "Creation Date: Month": "CDMONTH",
    "Creation Date: Day": "CDDATE",

  };

  const modeMapPipeline = {
    // Normal filters
    "Sales Team": "TEAM",
    "Salesperson": "SALESMAN",
    "City": "CITY",
    "Country": "COUNTRY",
    "Stage": "STAGE",
    "Source": "SOURCE",
    "Campaign": "CAMPAIGN",
    "Medium": "MEDIUM",

    // Creation Date Filters
    "Creation Date: Year": "CDYEAR",
    "Creation Date: Quarter": "CDQUARTER",
    "Creation Date: Month": "CDMONTH",
    "Creation Date: Day": "CDDATE",

    // Expected Closing Filters
    "Expected Closing: Year": "ECYEAR",
    "Expected Closing: Quarter": "ECQUARTER",
    "Expected Closing: Month": "ECMONTH",
    "Expected Closing: Day": "ECDATE",

    "Creation On": "EXPCLOSING_YEAR"
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopupActivity(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopupPipeline(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSearchQuery("");
    // setShowPopup(false);
    setOpenDropdown(null);

    if (selectedPeriods.includes(item)) {
      setSelectedPeriods(selectedPeriods.filter((p) => p !== item));
    } else {
      setSelectedPeriods([...selectedPeriods, item]);
    }
  };

  const handleSelectActivity = (item) => {
    setSearchQueryActivity("");
    // setShowPopupActivity(false);
    setOpenDropdown(null);

    if (selectedActivity.includes(item)) {
      setSelectedActivity(selectedActivity.filter((p) => p !== item));
    } else {
      setSelectedActivity([...selectedActivity, item]);
    }
  };

  const handleSelectPipeline = (item) => {
    setSearchQueryPipeline("");
    // setShowPopupPipeline(false);
    setOpenDropdownPipeline(null);

    if (selectedPipeline.includes(item)) {
      setSelectedPipeline(selectedPipeline.filter((p) => p !== item));
    } else {
      setSelectedPipeline([...selectedPipeline, item]);
    }
  };

  const handleRemove = (option) => {
    setSelectedPeriods(selectedPeriods.filter((item) => item !== option));
  };

  const handleRemoveActivity = (option) => {
    setSelectedActivity(selectedActivity.filter((item) => item !== option));
  };

  const handleRemovePipeline = (option) => {
    setSelectedPipeline(selectedPipeline.filter((item) => item !== option));
  };

  const handleSearchSales = () => {
    fetchSalesTeamChart();
  };

  const fetchSalesTeamChart = async () => {
    if (selectedPeriods.length === 0) {
      toast.warning("Please select at least one period before searching.");
      return;
    }

    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const selectedModes = selectedPeriods.map((p) => modeMap[p]).filter(Boolean);
    const mode = selectedModes.join(",");

    const mappedKeys = selectedModes.map(m => {
      if (m === 'TEAM') return 'Sales_Team_Name';
      if (m === 'SALESMAN') return 'SalesPerson_Name';
      if (m === 'CITY') return 'City';
      if (m === 'COUNTRY') return 'Country';
      if (m === 'STAGE') return 'Stage';
      if (m === 'SOURCE') return 'SourceName';
      if (m === 'CAMPAIGN') return 'CampaignName';
      if (m === 'MEDIUM') return 'MediumName';
      if (m.endsWith('CDYEAR')) return 'Year';
      if (m.endsWith('CDQUARTER')) return 'Quarter';
      if (m.endsWith('CDMONTH')) return 'Month';
      if (m.endsWith('CDDATE')) return 'Date';
      if (m.endsWith('ECYEAR')) return 'Year';
      if (m.endsWith('ECQUARTER')) return 'Quarter';
      if (m.endsWith('ECMONTH')) return 'Month';
      if (m.endsWith('ECDATE')) return 'Date';
      return null;
    });

    const primaryKey = mappedKeys[0];
    const secondaryKey = mappedKeys[1];

    const allGroupingKeys = mappedKeys.filter(Boolean);
    const allModeNames = selectedModes.filter(Boolean).map(m => m);

    if (!mode) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${config.apiBaseUrl}/SalesTeamChart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, company_code, start_date, end_date }),
      });

      if (!response.ok) throw new Error("Failed to fetch chart data");
      const data = await response.json();

      if (primaryKey && secondaryKey) {
        const transformedDataMap = new Map();
        const allSecondaryKeys = new Set();

        const tertiaryKeys = allGroupingKeys.slice(2);

        data.forEach(item => {
          const primaryName = item[primaryKey] || 'None';
          const count = item.OpportunityCount || 0;

          let uniqueStackSegmentName = item[secondaryKey] || 'None';

          tertiaryKeys.forEach(key => {
            uniqueStackSegmentName += ` / ${item[key] || 'None'}`;
          });

          if (!transformedDataMap.has(primaryName)) {
            transformedDataMap.set(primaryName, {
              name: primaryName,
              OpportunityCountSum: 0,
            });
          }

          const currentEntry = transformedDataMap.get(primaryName);

          currentEntry[uniqueStackSegmentName] = (currentEntry[uniqueStackSegmentName] || 0) + count;
          currentEntry.OpportunityCountSum += count;

          if (!currentEntry.rawItems) {
            currentEntry.rawItems = [];
          }
          currentEntry.rawItems.push({ ...item, uniqueStackSegmentName: uniqueStackSegmentName });

          allSecondaryKeys.add(uniqueStackSegmentName);
        });

        const chartData = Array.from(transformedDataMap.values());

        console.log(chartData)

        setLeadSources({
          data: chartData,
          xKey: 'name',
          yKeys: Array.from(allSecondaryKeys),
          isStacked: true,
          allModeNames: allModeNames,
          allGroupingKeys: allGroupingKeys
        });
      } else {
        const formattedData = data.map((item) => ({
          name:
            item.City ||
            item.Country ||
            item.Sales_Team_Name ||
            item.SalesPerson_Name ||
            item.Stage ||
            item.SourceName ||
            item.CampaignName ||
            item.MediumName ||
            item.Year ||
            item.Quarter ||
            item.Month ||
            item.Date ||
            "Unknown",
          value: item.OpportunityCount || 0,
          TYPE: item.TYPE || "UNKNOWN",
          rawItem: item
        }));

        setLeadSources({
          data: formattedData,
          xKey: 'name',
          yKeys: 'value',
          isStacked: false,
          allModeNames: allModeNames,
          allGroupingKeys: allGroupingKeys
        });
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setLeadSources({ data: [], xKey: 'name', yKeys: 'value', isStacked: false });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (selectedPeriods.length === 0) return;

  //   const lastSelected = selectedPeriods[selectedPeriods.length - 1];
  //   const isDayMode = lastSelected.includes("Day");

  //   if (isDayMode) {
  //     if (start_date && end_date) {
  //       fetchSalesTeamChart(lastSelected);
  //     }
  //   } else {
  //     fetchSalesTeamChart(lastSelected);
  //   }
  // }, [selectedPeriods, start_date, end_date]);

  useEffect(() => {
    const lastSelected = selectedPeriods[selectedPeriods.length - 1];
    const isDayMode = lastSelected?.includes("Day");

    if (isDayMode && start_date && end_date) {
      fetchSalesTeamChart();
    }
  }, [start_date, end_date]);

  const handleSearchActivity = () => {
    fetchActivityChart();
  };

  const fetchActivityChart = async () => {
    if (selectedActivity.length === 0) {
      toast.warning("Please select at least one period before searching.");
      return;
    }

    const company_code = sessionStorage.getItem("selectedCompanyCode");

    const selectedModes = selectedActivity.map((p) => modeMapActivity[p]).filter(Boolean);
    const mode = selectedModes.join(",");

    const mappedKeys = selectedModes.map(m => {
      if (m === 'ACTIVITY') return 'Activity';
      if (m === 'TYPE') return 'TypeCategory';
      if (m === 'STAGE') return 'Stage';
      if (m.endsWith('CDYEAR')) return 'Year';
      if (m.endsWith('CDQUARTER')) return 'Quarter';
      if (m.endsWith('CDMONTH')) return 'Month';
      if (m.endsWith('CDDATE')) return 'Date';
      return null;
    });

    const primaryKey = mappedKeys[0];
    const secondaryKey = mappedKeys[1];

    const allGroupingKeys = mappedKeys.filter(Boolean);
    const allModeNames = selectedModes.filter(Boolean).map(m => m);

    if (!mode) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${config.apiBaseUrl}/ActivityChart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, company_code, From_Date: fromDate, To_Date: toDate }),
      });

      if (!response.ok) throw new Error("Failed to fetch activity chart data");
      const data = await response.json();

      if (primaryKey && secondaryKey) {
        const transformedDataMap = new Map();
        const allSecondaryKeys = new Set();

        const tertiaryKeys = allGroupingKeys.slice(2);

        data.forEach(item => {
          const primaryName = item[primaryKey] || 'None';
          const count = item.ActivityCount || 0;

          let uniqueStackSegmentName = item[secondaryKey] || 'None';

          tertiaryKeys.forEach(key => {
            uniqueStackSegmentName += ` / ${item[key] || 'None'}`;
          });

          if (!transformedDataMap.has(primaryName)) {
            transformedDataMap.set(primaryName, {
              name: primaryName,
              OpportunityCountSum: 0,
            });
          }

          const currentEntry = transformedDataMap.get(primaryName);

          currentEntry[uniqueStackSegmentName] = (currentEntry[uniqueStackSegmentName] || 0) + count;
          currentEntry.OpportunityCountSum += count;

          if (!currentEntry.rawItems) {
            currentEntry.rawItems = [];
          }
          currentEntry.rawItems.push({ ...item, uniqueStackSegmentName: uniqueStackSegmentName });

          allSecondaryKeys.add(uniqueStackSegmentName);
        });

        const chartData = Array.from(transformedDataMap.values());

        setActivityData({
          data: chartData,
          xKey: 'name',
          yKeys: Array.from(allSecondaryKeys),
          isStacked: true,
          allModeNames: allModeNames,
          allGroupingKeys: allGroupingKeys
        });
      } else {
        const formattedData = data.map((item) => ({
          name:
            item.Activity ||
            item.TypeCategory ||
            item.Stage ||
            item.Year ||
            item.Quarter ||
            item.Month ||
            item.Date ||
            "Unknown",
          value: item.ActivityCount || 0,
          TYPE: item.TYPE || "UNKNOWN",
          rawItem: item
        }));

        setActivityData({
          data: formattedData,
          xKey: 'name',
          yKeys: 'value',
          isStacked: false,
          allModeNames: allModeNames,
          allGroupingKeys: allGroupingKeys
        });
      }

    } catch (err) {
      console.error("Error fetching CRM activity chart:", err);
      toast.error("Failed to load activity chart data!");
      setActivityData({ data: [], xKey: 'name', yKeys: 'value', isStacked: false });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (selectedActivity.length === 0) return;

  //   const lastSelected = selectedActivity[selectedActivity.length - 1];
  //   const isDayMode = lastSelected.includes("Day");

  //   if (isDayMode) {
  //     if (fromDate && toDate) {
  //       fetchActivityChart(lastSelected);
  //     }
  //   } else {
  //     fetchActivityChart(lastSelected);
  //   }
  // }, [selectedActivity, fromDate, toDate]);

  useEffect(() => {
    const lastSelected = selectedActivity[selectedActivity.length - 1];
    const isDayMode = lastSelected?.includes("Day");

    if (isDayMode && fromDate && toDate) {
      fetchActivityChart(lastSelected);
    }
  }, [fromDate, toDate]);

  const renderChart = (type, data, chartCategory) => {
    const chartData = data.data;
    const xAxisKey = data.xKey;
    const yAxisKeys = data.yKeys;
    const isStacked = data.isStacked;

    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No Data Available for Selected Modes.
        </div>
      );
    }

    const labels = chartData.map((d) => d[xAxisKey]);
    let datasets = [];

    if (isStacked) {
      datasets = yAxisKeys.map((key, i) => ({
        label: key,
        data: chartData.map((d) => d[key] || 0),
        backgroundColor: pieColors[i % pieColors.length],
        borderWidth: 1,
      }));
    } else {
      let datasetLabel = "Opportunity Count";

      if (chartCategory === "Activities") {
        datasetLabel = "Activity Count";
      } else if (chartCategory === "Pipeline" || chartCategory === "Sales Team") {
        datasetLabel = `Opportunity Count`;
      }

      datasets = [
        {
          label: datasetLabel,
          data: chartData.map((d) => d[yAxisKeys] || 0),
          backgroundColor: pieColors,
          borderWidth: 1,
        },
      ];
    }

    const chartJsData = { labels, datasets };

    const commonAnimation = {
      duration: 800,
      easing: "easeInOutCubic",
    };

    const handleChartClickByType = (event, elements, chart) => {
      if (elements.length > 0) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const index = element.index;
        const dataset = chart.data.datasets[datasetIndex];
        const label = chart.data.labels[index];
        const value = dataset.data[index];
        const datasetLabel = dataset.label;

        if (chartCategory === "Pipeline") {
          const clickedItem =
            revenueBySalesperson.data.find((d) => d.name === label) || {};
          let clickedType =
            clickedItem.rawItems?.[0]?.TYPE ||
            clickedItem.TYPE ||
            "UNKNOWN";

          if (Array.isArray(clickedType)) {
            clickedType = clickedType.join(',')
          }

          handleChartClick({
            xLabel: label,
            yValue: value,
            datasetLabel,
            TYPE: clickedType,
            fullData: clickedItem,
          });
        }
        else if (chartCategory === "Sales Team") {
          const clickedItem =
            leadSources.data.find((d) => d.name === label) || {};
          let clickedType =
            clickedItem.rawItems?.[0]?.TYPE ||
            clickedItem.TYPE ||
            "UNKNOWN";

          if (Array.isArray(clickedType)) {
            clickedType = clickedType.join(',')
          }

          handleSalesTeamChart({
            xLabel: label,
            yValue: value,
            datasetLabel,
            TYPE: clickedType,
            fullData: clickedItem,
          });
        }
        else if (chartCategory === "Activities") {
          const clickedItem =
            activityData.data.find((d) => d.name === label) || {};
          let clickedType =
            clickedItem.rawItems?.[0]?.TYPE ||
            clickedItem.TYPE ||
            "UNKNOWN";

          if (Array.isArray(clickedType)) {
            clickedType = clickedType.join(',')
          }

          handleActivityChartClick({
            xLabel: label,
            yValue: value,
            datasetLabel,
            TYPE: clickedType,
            fullData: clickedItem,
          });
        }
      }
    };

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: commonAnimation,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const dataItem = chartData[context.dataIndex];
              const value = context.dataset.data[context.dataIndex];
              const label = context.dataset.label;
              let totalValue = 0;

              if (Array.isArray(dataItem.rawItems)) {
                const matchedItems = dataItem.rawItems.filter(
                  (r) => r.uniqueStackSegmentName === label
                );
                totalValue = matchedItems.reduce(
                  (sum, item) => sum + (Number(item.Total_Expected_Revenue) || 0),
                  0
                );
              } else {
                totalValue = Number(dataItem?.rawItem?.Total_Expected_Revenue) || 0;
              }

              if ((chartCategory === "Pipeline" || chartCategory === "Sales Team") && totalValue > 0) {
                return [
                  `${label}: ${value}`,
                  `Total: ₹${totalValue.toLocaleString("en-IN")}`
                ];
              }

              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: { stacked: isStacked },
        y: { stacked: isStacked, beginAtZero: true },
      },
      onClick: handleChartClickByType,
    };

    const lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: commonAnimation,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const dataItem = chartData[context.dataIndex];
              const value = context.dataset.data[context.dataIndex];
              const label = context.dataset.label;
              let totalValue = 0;

              if (Array.isArray(dataItem.rawItems)) {
                const matchedItems = dataItem.rawItems.filter(
                  (r) => r.uniqueStackSegmentName === label
                );
                totalValue = matchedItems.reduce(
                  (sum, item) => sum + (Number(item.Total_Expected_Revenue) || 0),
                  0
                );
              } else {
                totalValue = Number(dataItem?.rawItem?.Total_Expected_Revenue) || 0;
              }

              if ((chartCategory === "Pipeline" || chartCategory === "Sales Team") && totalValue > 0) {
                return [
                  `${label}: ${value}`,
                  `Total: ₹${totalValue.toLocaleString("en-IN")}`
                ];
              }

              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      scales: {
        y: { beginAtZero: true },
      },
      onClick: handleChartClickByType,
    };

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: commonAnimation,
      plugins: {
        legend: { position: "right" },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const dataItem = chartData[context.dataIndex];
              const value = context.dataset.data[context.dataIndex];
              const label = context.dataset.label;
              let totalValue = 0;

              if (Array.isArray(dataItem.rawItems)) {
                const matchedItems = dataItem.rawItems.filter(
                  (r) => r.uniqueStackSegmentName === label
                );
                totalValue = matchedItems.reduce(
                  (sum, item) => sum + (Number(item.Total_Expected_Revenue) || 0),
                  0
                );
              } else {
                totalValue = Number(dataItem?.rawItem?.Total_Expected_Revenue) || 0;
              }

              if ((chartCategory === "Pipeline" || chartCategory === "Sales Team") && totalValue > 0) {
                return [
                  `${label}: ${value}`,
                  `Total: ₹${totalValue.toLocaleString("en-IN")}`
                ];
              }

              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      onClick: handleChartClickByType,
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${chartCategory}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            width: "85%",
            height: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {type === "bar" && <Bar data={chartJsData} options={barOptions} />}
          {type === "line" && <Line data={chartJsData} options={lineOptions} />}
          {type === "pie" && <Pie data={chartJsData} options={pieOptions} />}
        </motion.div>
      </AnimatePresence>
    );
  };

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate1 = () => { navigate("/CrmChart"); };
  const handleNavigate3 = () => { navigate("/CrmScheduler"); };
  const handleNavigate4 = () => { navigate("/CrmActivity"); };
  const handleNavigate5 = () => { navigate("/CrmLocation"); };
  const handleNavigateKanban = () => { navigate("/Crmworkspace"); };

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />

      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap p-0">
          <div className="d-flex justify-content-start align-items-center">
            <h1 className="h4 mb-0">CRM Analytics</h1>
          </div>
          <div className="d-flex justify-content-end flex-wrap p-2">
            <addbutton className={`nav-btn-container nav-btn-kanban ${isActive('/Crmworkspace') ? 'active' : ''}`} onClick={handleNavigateKanban} title='crmworkspace'>
              <i className="bi bi-kanban nav-btn-icon"></i>
            </addbutton>
            {/* <addbutton className={`nav-btn-container nav-btn-list ${isActive('/crmlistpage') ? 'active' : ''}`} onClick={handleNavigate} title='crmlistpage'>
              <i className="bi bi-card-list nav-btn-icon"></i>
            </addbutton> */}
            <addbutton className={`nav-btn-container nav-btn-calendar ${isActive('/CrmScheduler') ? 'active' : ''}`} onClick={handleNavigate3} title='CrmScheduler'>
              <i className="bi bi-calendar3 nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-chart ${isActive('/CrmChart') ? 'active' : ''}`} onClick={handleNavigate1} title='CrmChart'>
              <i className="bi bi-bar-chart-fill nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-location ${isActive('/CrmLocation') ? 'active' : ''}`} onClick={handleNavigate5} title='CrmLocation'>
              <i className="bi bi-geo-alt-fill nav-btn-icon"></i>
            </addbutton>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'Sales Team' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('Sales Team')}
        >
          Sales Team Analysis
        </button>
        <button
          className={`tab-button ${activeTab === 'Activities' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('Activities')}
        >
          Activity Analysis
        </button>
        <button
          className={`tab-button ${activeTab === 'Pipeline' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('Pipeline')}
        >
          Pipeline Status
        </button>
      </div>

      <div className="row g-4">

        {activeTab === 'Sales Team' && (
          <div className="col-md-12">
            <div className="bg-white p-3 rounded" style={{ height: '680px', border: '1px solid #ddd' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold">Sales Team</h5>

                <div className="position-relative me-3" style={{ width: "830px" }}>
                  <div className="form-control d-flex flex-wrap align-items-center" onClick={() => setShowPopup(true)} style={{ cursor: "text" }}>
                    {selectedPeriods.map((period, index) => (
                      <span
                        key={index}
                        className="badge bg-primary me-1 mb-1"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(period);
                        }}
                      >
                        {period} <i className="bi bi-x"></i>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="border-0 flex-grow-1 border-end border-dark"
                      placeholder={selectedPeriods.length ? "" : "Select Period to Search..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowPopup(true)}
                    />
                    <span className=" ms-2 bg-white cursor-pointer-on-hover" onClick={(e) => {
                      e.stopPropagation();
                      handleSearchSales();
                    }}>
                      <FaSearch className="text-muted" />
                    </span>
                  </div>
                  {selectedPeriods.some((p) => p.includes("Day")) && (
                    <div className="mt-1 row">
                      <div className="col-lg-6 col-md-6 mb-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label mb-0 me-3" style={{ minWidth: '50px' }}>From:</label>
                          <input type="date" className="form-control flex-grow-1" value={start_date} onChange={(e) => setStart_date(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 mb-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label mb-0 me-3" style={{ minWidth: '50px' }}>To:</label>
                          <input type="date" className="form-control flex-grow-1" value={end_date} onChange={(e) => setEnd_date(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                  {showPopup && (
                    <div
                      ref={popupRef}
                      className="shadow bg-white border rounded p-2 position-absolute"
                      style={{
                        top: "100%", left: 0, width: "100%", maxHeight: "280px", overflow: "auto", zIndex: 1000,
                      }}
                    >
                      {searchQuery.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {periodOptions.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase())).map((option) => (
                            <li key={option} className={`p-2 rounded ${selectedPeriods.includes(option) ? "bg-light fw-bold" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSelect(option)}>
                              {option}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="d-flex">
                          <div className="flex-fill border-end">
                            <h6 className="fw-bold mb-3">Date Range Filters</h6>
                            <ul className="list-unstyled mt-3">
                              {dateFilterOptions.map((item) => (
                                <li key={item} className="p-1" style={{ cursor: "pointer", position: "relative" }} onClick={() => setOpenDropdown(openDropdown === item ? null : item)}>
                                  {item} <i className="bi bi-caret-right"></i>
                                  {openDropdown === item && (
                                    <ul className="list-unstyled shadow bg-white border rounded mt-1 p-2" style={{ position: "absolute", left: "100%", top: 0, zIndex: 2000, minWidth: "180px", }}>
                                      {["Year", "Quarter", "Month", "Day",].map((subItem) => (
                                        <li key={subItem} className="p-1" style={{ cursor: "pointer" }} onClick={() => handleSelect(`${item}: ${subItem}`)}>
                                          {subItem}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex-fill px-3">
                            <h6 className="fw-bold mb-3">Filters</h6>
                            <ul className="list-unstyled">
                              {periodOptions.map((item) => (
                                <li key={item} className={`p-1 ${selectedPeriods.includes(item) ? "bg-light fw-bold" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSelect(item)}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Select
                  options={chartOptions}
                  defaultValue={chartOptions[1]}
                  onChange={(e) => setLeadChartType(e.value)}
                  className="col-md-3"
                  styles={{ container: (base) => ({ ...base, width: "150px" }) }}
                />
              </div>

              <div
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  position: "relative",
                  height: "calc(100% - 100px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {renderChart(leadChartType, leadSources, "Sales Team")}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Activities' && (
          <div className="col-md-12">
            <div className="bg-white p-3 rounded" style={{ height: '680px', border: '1px solid #ddd' }}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                <h5 className="fw-bold">Activity</h5>

                <div className="position-relative me-3" style={{ width: "830px" }}>
                  <div className="form-control d-flex flex-wrap align-items-center" onClick={() => setShowPopup(true)} style={{ cursor: "text" }}>
                    {selectedActivity.map((period, index) => (
                      <span
                        key={index}
                        className="badge bg-primary me-1 mb-1"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveActivity(period);
                        }}
                      >
                        {period} <i className="bi bi-x"></i>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="border-0 flex-grow-1 border-end border-dark"
                      placeholder={selectedActivity.length ? "" : "Select Period to Search..."}
                      value={searchQueryActivity}
                      onChange={(e) => setSearchQueryActivity(e.target.value)}
                      onFocus={() => setShowPopupActivity(true)}
                    />
                    <span className="ms-2 bg-white cursor-pointer-on-hover" onClick={(e) => {
                      e.stopPropagation();
                      handleSearchActivity();
                    }}>
                      <FaSearch className="text-muted" />
                    </span>
                  </div>
                  {selectedActivity.some((p) => p.includes("Day")) && (
                    <div className="mt-1 row">
                      <div className="col-lg-6 col-md-6 mb-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label mb-0 me-3" style={{ minWidth: '50px' }}>From:</label>
                          <input type="date" className="form-control flex-grow-1" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 mb-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label mb-0 me-3" style={{ minWidth: '50px' }}>To:</label>
                          <input type="date" className="form-control flex-grow-1" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                  {showPopupActivity && (
                    <div
                      ref={popupRef}
                      className="shadow bg-white border rounded p-2 position-absolute"
                      style={{
                        top: "100%", left: 0, width: "100%", maxHeight: "280px", overflow: "auto", zIndex: 1000,
                      }}
                    >
                      {searchQueryActivity.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {ActivityOptions.filter((option) => option.toLowerCase().includes(searchQueryActivity.toLowerCase())).map((option) => (
                            <li key={option} className={`p-2 rounded ${selectedActivity.includes(option) ? "bg-light fw-bold" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSelectActivity(option)}>
                              {option}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="d-flex">
                          <div className="flex-fill border-end">
                            <h6 className="fw-bold mb-3">Date Range Filters</h6>
                            <ul className="list-unstyled mt-3">
                              {dateFilterOptionsActivity.map((item) => (
                                <li key={item} className="p-1" style={{ cursor: "pointer", position: "relative" }} onClick={() => setOpenDropdown(openDropdown === item ? null : item)}>
                                  {item} <i className="bi bi-caret-right"></i>
                                  {openDropdown === item && (
                                    <ul className="list-unstyled shadow bg-white border rounded p-2" style={{ position: "absolute", left: "30%", top: 0, zIndex: 2000, minWidth: "180px", }}>
                                      {["Year", "Quarter", "Month", "Day",].map((subItem) => (
                                        <li key={subItem} className="p-1" style={{ cursor: "pointer" }} onClick={() => handleSelectActivity(`${item}: ${subItem}`)}>
                                          {subItem}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex-fill px-3">
                            <h6 className="fw-bold mb-3">Filters</h6>
                            <ul className="list-unstyled">
                              {ActivityOptions.map((item) => (
                                <li key={item} className={`p-1 ${selectedActivity.includes(item) ? "bg-light fw-bold" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSelectActivity(item)}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Select
                  options={chartOptions}
                  defaultValue={chartOptions[1]}
                  onChange={(e) => setStageChartType(e.value)}
                  className="col-md-3"
                  styles={{ container: (base) => ({ ...base, width: "150px" }) }}
                />
              </div>
              <div
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  position: "relative",
                  height: "calc(100% - 100px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {renderChart(stageChartType, activityData, "Activities")}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Pipeline' && (
          <div className="col-md-12">
            <div className="bg-white p-3 rounded" style={{ height: '680px', border: '1px solid #ddd' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold">Pipeline</h5>

                <div className="position-relative me-3" style={{ width: "830px" }}>
                  <div
                    className="form-control d-flex flex-wrap align-items-center"
                    onClick={() => setShowPopupPipeline(true)}
                    style={{ cursor: "text" }}
                  >
                    {selectedPipeline.map((period, index) => (
                      <span
                        key={index}
                        className="badge bg-primary me-1 mb-1"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePipeline(period);
                        }}
                      >
                        {period} <i className="bi bi-x"></i>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="border-0 flex-grow-1 border-end border-dark"
                      placeholder={selectedPipeline.length ? "" : "Select Period"}
                      value={searchQueryPipeline}
                      onChange={(e) => setSearchQueryPipeline(e.target.value)}
                      onFocus={() => setShowPopupPipeline(true)}
                    />
                    <span className=" ms-2 bg-white cursor-pointer-on-hover" onClick={(e) => {
                      e.stopPropagation();
                      handleSearchPipeline();
                    }}>
                      <FaSearch className="text-muted" />
                    </span>
                  </div>

                  {showPopupPipeline && (
                    <div
                      ref={popupRef}
                      className="shadow bg-white border rounded p-2 position-absolute"
                      style={{
                        top: "100%", left: 0, width: "100%", maxHeight: "280px", overflow: "auto", zIndex: 1000,
                      }}
                    >
                      {searchQueryPipeline.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {pipelinePeriodOptions.filter((option) => option.toLowerCase().includes(searchQueryPipeline.toLowerCase())).map((option) => (
                            <li key={option} className={`p-2 rounded ${selectedPipeline.includes(option) ? "bg-light fw-bold" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSelectPipeline(option)}>
                              {option}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="d-flex">
                          <div className="flex-fill border-end">
                            <h6 className="fw-bold mb-3">Date Range Filters</h6>
                            <ul className="list-unstyled mt-3">
                              {dateFilterOptionsPipeline.map((item) => (
                                <li key={item} className="p-1" style={{ cursor: "pointer", position: "relative" }} onClick={() => setOpenDropdownPipeline(openDropdownPipeline === item ? null : item)}>
                                  {item} <i className="bi bi-caret-right"></i>
                                  {openDropdownPipeline === item && (
                                    <ul className="list-unstyled shadow bg-white border rounded mt-1 p-2" style={{ position: "absolute", left: "100%", top: 0, zIndex: 2000, minWidth: "180px", }}>
                                      {item === "Creation On" ? (
                                        yearOptions.map((year) => (
                                          <li key={year} className="p-1" style={{ cursor: "pointer" }} onClick={() => { setSelectedYear(year); handleSelectPipeline(`${item}: ${year}`); }}>
                                            {year}
                                          </li>
                                        ))
                                      ) : (
                                        ["Year", "Quarter", "Month", "Day"].map((subItem) => (
                                          <li key={subItem} className="p-1" style={{ cursor: "pointer" }} onClick={() => handleSelectPipeline(`${item}: ${subItem}`)}>
                                            {subItem}
                                          </li>
                                        ))
                                      )}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex-fill px-3">
                            <h6 className="fw-bold mb-3">Filters</h6>
                            <ul className="list-unstyled">
                              {pipelinePeriodOptions.map((item) => (
                                <li key={item} className={`p-1 ${selectedPipeline.includes(item) ? "bg-light fw-bold" : ""}`} style={{ cursor: "pointer" }} onClick={() => handleSelectPipeline(item)}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Select
                  options={chartOptions}
                  defaultValue={chartOptions[1]}
                  onChange={(e) => setSalesChartType(e.value)}
                  className="col-md-3"
                  styles={{ container: (base) => ({ ...base, width: "150px" }) }}
                />
              </div>

              {selectedPipeline.some((p) => p.includes("Day")) && (
                <div className="mt-1 row">
                  <div className="col-lg-3 col-md-6 mb-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label mb-0 me-3" style={{ minWidth: "50px" }}>
                        From:
                      </label>
                      <input
                        type="date"
                        className="form-control flex-grow-1"
                        value={FromDate}
                        onChange={(e) => setFromdate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label mb-0 me-3" style={{ minWidth: "50px" }}>
                        To:
                      </label>
                      <input
                        type="date"
                        className="form-control flex-grow-1"
                        value={ToDate}
                        onChange={(e) => settoDate(e.target.value)}
                        disabled={!FromDate}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div style={{
                cursor: "pointer",
                userSelect: "none",
                position: "relative",
                height: "calc(100% - 100px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}>
                {renderChart(salesChartType, revenueBySalesperson, "Pipeline")}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}