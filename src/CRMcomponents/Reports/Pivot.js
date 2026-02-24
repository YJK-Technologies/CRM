import React, { useState, useEffect } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import PlotlyRenderers from "react-pivottable/PlotlyRenderers"; // for charts
import "react-pivottable/pivottable.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

// Sample data with `date` field
const sampleData = [
  { status: "Lost", salesperson: "Alice", month: "January", investment: 3000, date: new Date("2024-01-05") },
  { status: "Lost", salesperson: "Bob", month: "February", investment: 3000, date: new Date("2024-02-10") },
  { status: "Won", salesperson: "Charlie", month: "January", investment: 7000, date: new Date("2024-01-15") },
];

// Custom table renderer with conditional styling
const CustomTableRenderer = (props) => {
  const DefaultTable = TableRenderers["Table"];
  const wrappedProps = {
    ...props,
    tableOptions: {
      ...props.tableOptions,
      tableClassName: "pvtTable table table-bordered",
      cellStyle: (value) => {
        if (typeof value === "number" && value < 5000) {
          return { backgroundColor: "#f8d7da", color: "#721c24" };
        }
        return {};
      },
    },
  };

  return <DefaultTable {...wrappedProps} />;
};

export default function PivotScreen({ data = sampleData }) {
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-12-31"));

  // Filter data by date range
  const filteredData = data.filter(
    (row) => row.date >= startDate && row.date <= endDate
  );

  const [pivotState, setPivotState] = useState({
    data: filteredData,
    rows: ["salesperson"],
    cols: ["month"],
    aggregatorName: "Sum",
    vals: ["investment"],
    rendererName: "Custom Table",
  });

  const renderers = {
    ...TableRenderers,
    ...PlotlyRenderers,
    "Custom Table": CustomTableRenderer,
  };

  useEffect(() => {
    setPivotState((prev) => ({
      ...prev,
      data: filteredData,
    }));
  }, [startDate, endDate]);

  // Export current pivot data to Excel
  const exportToExcel = () => {
    // Prepare data for export: flatten pivot data from pivotState
    // Here, we'll just export filtered raw data as example
    const exportData = filteredData.map(({ date, ...rest }) => ({
      ...rest,
      date: date.toISOString().split("T")[0], // format date as yyyy-mm-dd
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PivotData");
    XLSX.writeFile(workbook, "pivot_data.xlsx");
  };
  const navigate = useNavigate();

  // Toggle renderer between Table and Bar Chart for demo
  const toggleRenderer = () => {
    setPivotState((prev) => ({
      ...prev,
      rendererName:
        prev.rendererName === "Custom Table" ? "Bar Chart" : "Custom Table",
    }));
  };
const handleNavigate = () => {
    navigate("/crmlistpage"); // Pass selectedRows as props to the Input component
  };
const handleNavigate1 = () => {
    navigate("/RChart"); // Pass selectedRows as props to the Input component
  };

const handleNavigateKanban = () => {
    navigate("/Forcast"); // Pass selectedRows as props to the Input component
};

const handleNavigate6 = () => {
    navigate("/Rpivot"); // Pass selectedRows as props to the Input component
};
  
  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow-lg p-1 mb-2 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap align-items-center p-1">
          <h1>Pivot</h1>
          <div className="d-flex justify-content-end">
               <addbutton className="mt-2 " onClick={handleNavigateKanban} title="Crmworkspace">
              <i class="bi bi-kanban text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate} title="ListPage">
                <i class="bi bi-card-list text-dark fs-4"></i>
              </addbutton>
             
              <addbutton className="mt-2 " onClick={handleNavigate1} title="Report">
                <i class="bi bi-bar-chart-fill text-dark fs-4"></i>
              </addbutton>
             
              
              <addbutton className="mt-2 " onClick={handleNavigate6} title="Scheduler">
                <i class="bi bi-table text-success fs-4"></i>
              </addbutton>
             
            </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-lg p-3">

        <div className="d-flex justify-content-end gap-2">
            <div className="mt-2">
              <label className="me-1">From:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                
              />
            </div>
            <div className="mt-2">
              <label className="me-1">To:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="form-control"
              />
            </div>

            <addbutton className="mt-0" onClick={exportToExcel}>
              <i class="bi bi-file-earmark-excel-fill text-success fs-4" title="Excel"></i>
            </addbutton>
          </div>
        <PivotTableUI
          data={filteredData}
          onChange={(s) => setPivotState(s)}
          {...pivotState}
          renderers={renderers}
        />
      </div>
    </div>
  );
}
