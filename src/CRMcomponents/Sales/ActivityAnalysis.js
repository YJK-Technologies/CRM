import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";

const config = require("../../Apiconfig.js");

const ActivityAnalysis = () => {
  const gridRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const popupRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const clickedData = location.state?.clickedData;
  const company_code = sessionStorage.getItem("selectedCompanyCode");
  const companyName = sessionStorage.getItem('selectedCompanyName');
  const navigate = useNavigate();

  const [groupByField, setGroupByField] = useState(null);

  const groupByOptions = [
    "Activity Type",
    "Due Date",
    "Assigned To",
    "Summary",
    "Notes",
  ];

  // --- Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Fetch Data for the selected chart
  useEffect(() => {
    if (!clickedData) return;

    const { TYPE, datasetLabel, fullData } = clickedData;
    const name = fullData?.name || clickedData.xLabel || "Unknown";
    let detail_name = "";

    if (datasetLabel === "Activity Count") detail_name = name;
    else {
      const formattedLabel = String(datasetLabel || "").replace(/\s*\/\s*/g, ",");
      detail_name = `${name},${formattedLabel}`;
    }

    detail_name = String(detail_name).replace(/,+$/, "").trim();

    const body = {
      mode: TYPE,
      company_code,
      detail_name,
    };

    const fetchDetails = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ActivityDetailChart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          const newRows = data.map((matchedItem, index) => ({
            serialNumber: index + 1,
            Opportunity_ID: matchedItem.Opportunity_ID,
            Type_of_Activity: matchedItem.Type_of_Activity,
            Due_date: matchedItem.Due_date,
            Assigned_To: matchedItem.Assigned_To,
            Summary: matchedItem.Summary,
            Notes: matchedItem.Notes,
          }));
          setSearchResults(newRows);
        } else if (response.status === 404) {
          toast.warning("Data not found");
          setSearchResults([]);
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to fetch data");
          setSearchResults([]);
        }
      } catch (error) {
        console.error("❌ Error fetching details:", error);
        setSearchResults([]);
      }
    };

    fetchDetails();
  }, [clickedData, company_code]);

  // --- Handle Group Selection
  const handleSelect = (item) => {
    setSelectedTags([item]);
    setGroupByField(item);
    setShowPopup(false);

    const fieldMap = {
      "Activity Type": "Type_of_Activity",
      "Due Date": "Due_date",
      "Assigned To": "Assigned_To",
      "Summary": "Summary",
      "Notes": "Notes",
    };

    const groupField = fieldMap[item];

    // Apply grouping dynamically
    if (gridRef.current?.api) {
      gridRef.current.columnApi.setRowGroupColumns([groupField]);
      gridRef.current.api.expandAll();
    }
  };

  // --- Remove Group
  const handleRemove = (item) => {
    setSelectedTags([]);
    setGroupByField(null);
    if (gridRef.current?.api) {
      gridRef.current.columnApi.setRowGroupColumns([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowPopup(true);
  };

  const columnDefs = [
    {
      headerName: "S.No",
      field: "serialNumber",
      width: 100,
    },
    {
      headerName: "Activity Type",
      field: "Type_of_Activity",
      enableRowGroup: true,
      hide: groupByField === "Activity Type",
    },
    {
      headerName: "Due Date",
      field: "Due_date",
      enableRowGroup: true,
      hide: groupByField === "Due Date",
    },
    {
      headerName: "Assigned To",
      field: "Assigned_To",
      enableRowGroup: true,
      hide: groupByField === "Assigned To",
    },
    {
      headerName: "Summary",
      field: "Summary",
      enableRowGroup: true,
      hide: groupByField === "Summary",
    },
    {
      headerName: "Notes",
      field: "Notes",
      enableRowGroup: true,
      hide: groupByField === "Notes",
    },
    {
      headerName: "Opportunity Id",
      field: "Opportunity_ID",
      hide: true
    },
  ];

  const handleClick = async (Opportunity_ID) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getOpportunityDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Opportunity_ID,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      const data = await response.json();
      if (response.ok) navigate("/pipeline", { state: { data } });
    } catch (err) {
      console.error("Error fetching opportunity details:", err);
    }
  };

  const onRowClicked = (params) => {
    if (!params.node.group) {
      const Opportunity_ID = params.data?.Opportunity_ID;
      if (Opportunity_ID) handleClick(Opportunity_ID);
    }
  };

  const handleExcelExport = () => {
    if (!gridRef.current) return;

    const headers = columnDefs
      .filter((col) => !col.hide)
      .map((col) => col.headerName);

    const rows = searchResults.map((row) => {
      const newRow = {};
      columnDefs.forEach((col) => {
        if (!col.hide) {
          newRow[col.headerName] = row[col.field] ?? "";
        }
      });
      return newRow;
    });

    const headerData = [
      ["Activity Analysis"],
      [`Company Name: ${companyName || "N/A"}`],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, rows, {
      origin: "A5",
      skipHeader: false,
      header: headers,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity");

    XLSX.writeFile(workbook, "Activity_Analysis.xlsx");
  };

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />

      {/* Header */}
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="row align-items-center py-2">
          <div className="col-md-4">
            <h1 className="d-flex justify-content-start">Activity Analysis</h1>
          </div>

          {/* Group Search */}
          <div className="col-md-5 position-relative">
            <div className="input-group">
              <div className="form-control border-start-1 d-flex flex-wrap align-items-center">
                {selectedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-primary me-1 mb-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemove(tag)}
                  >
                    {tag} <i className="bi bi-x"></i>
                  </span>
                ))}
                <input
                  type="text"
                  className="p-0 border-0 flex-grow-1"
                  placeholder="Search / Group By"
                  onFocus={() => setShowPopup(true)}
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
              </div>
              <span className="input-group-text bg-white border-end-1" style={{ cursor: "pointer" }}>
                <i className="bi bi-search"></i>
              </span>
            </div>

            {/* Popup for Group Options */}
            {showPopup && (
              <div
                ref={popupRef}
                className="popup-menu shadow bg-white border"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "400px",
                  zIndex: 1000,
                  padding: "15px",
                }}
              >
                <h6 className="fw-bold mb-3">Group By</h6>
                <ul className="list-unstyled">
                  {groupByOptions.map((item) => (
                    <li
                      key={item}
                      className={`p-1 ${selectedTags.includes(item) ? "bg-light fw-bold" : ""
                        }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="col-md-2 d-flex justify-content-end">
            <savebutton
              className="btn d-flex align-items-center"
              title="Export Excel"
              onClick={handleExcelExport}
            >
              <i class="fa-solid fa-file-excel"></i>
            </savebutton>
          </div>
        </div>
      </div>

      {/* ✅ AG GRID */}
      <div className="shadow-lg bg-white rounded-3 p-3">
        <div className="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={searchResults}
            columnDefs={columnDefs}
            animateRows={true}
            pagination={true}
            paginationAutoPageSize={true}
            groupDisplayType="multipleColumns"
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              enableRowGroup: true,
            }}
            autoGroupColumnDef={{
              headerName: "Group",
              minWidth: 300,
              cellRendererParams: {
                suppressCount: false,
                innerRenderer: (params) => {
                  return `${params.value}`;
                },
              },
            }}
            onRowClicked={onRowClicked}
            getRowStyle={() => ({ cursor: "pointer" })}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityAnalysis;