import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from "xlsx";
const config = require("../../Apiconfig");

const LeadsAnalysis = () => {
  const gridRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const popupRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const clickedData = location.state?.clickedData;
  const company_code = sessionStorage.getItem("selectedCompanyCode");
  const navigate = useNavigate();
  const [groupByField, setGroupByField] = useState(null);
  const companyName = sessionStorage.getItem('selectedCompanyName');

  const groupByOptions = [
    "Sales Team",
    "Salesperson",
    "City",
    "Country",
    "Stage",
    "Source",
    "Campaign",
    "Medium",
  ]

  useEffect(() => {
    if (!clickedData) return;

    console.log(clickedData);

    const { TYPE, datasetLabel, fullData } = clickedData;
    const name = fullData?.name || clickedData.xLabel || "Unknown";

    let detail_name = "";

    if (datasetLabel === "Opportunity Count") {
      detail_name = name;
    } else {
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
        const response = await fetch(`${config.apiBaseUrl}/SalesTeamDetailChart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          const newRows = data.map((matchedItem, index) => ({
            serialNumber: index + 1,
            Opportunity_ID: matchedItem.Opportunity_ID,
            OpportunityName: matchedItem.OpportunityName,
            Email_ID: matchedItem.Email_ID,
            ContactPhone: matchedItem.ContactPhone,
            Followup_City: matchedItem.Followup_City,
            Followup_State: matchedItem.Followup_State,
            Followup_Country: matchedItem.Followup_Country,
            SalesPersonName: matchedItem.SalesPersonName,
            Sales_Team: matchedItem.Sales_Team,
            CampaignName: matchedItem.CampaignName,
            MediumName: matchedItem.MediumName,
            SourceName: matchedItem.SourceName,
            Stage: matchedItem.Stage,
            ExpectedRevenue: matchedItem.ExpectedRevenue
          }));
          const totalAmount = newRows.reduce((sum, row) => sum + row.ExpectedRevenue, 0);

          const totalRow = {
            OpportunityName: "",
            Email_ID: "",
            ContactPhone: "",
            Followup_City: "",
            Followup_State: "",
            Followup_Country: "",
            SalesPersonName: "",
            Sales_Team: "",
            CampaignName: "",
            MediumName: "",
            SourceName: "",
            Stage: "Total Revenue",
            ExpectedRevenue: totalAmount
          };

          setSearchResults([...newRows, totalRow]);
        } else if (response.status === 404) {
          console.log("Data Not found");
          toast.warning("Data Not found");
          setSearchResults([])
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to insert sales data");
          console.error(errorResponse.details || errorResponse.message);
          setSearchResults([])
        }
      } catch (error) {
        console.error("❌ Error fetching SalesTeamDetailChart:", error);
        setSearchResults([]);
      }
    };

    fetchDetails();
  }, [clickedData, company_code]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handle Group Selection
  const handleSelect = (item) => {
    setSelectedTags([item]);
    setGroupByField(item);
    setShowPopup(false);

    const fieldMap = {
      "Sales Team": "Sales_Team",
      "Salesperson": "SalesPersonName",
      "City": "Followup_City",
      "Country": "Followup_Country",
      "Stage": "Stage",
      "Source": "SourceName",
      "Campaign": "CampaignName",
      "Medium": "MediumName",
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
    },
    {
      headerName: "Opportunity Id",
      field: "Opportunity_ID",
      hide: true
    },
    {
      headerName: "Opportunity Name",
      field: "OpportunityName",
    },
    {
      headerName: "Email",
      field: "Email_ID",
    },
    {
      headerName: "Phone",
      field: "ContactPhone",
    },
    {
      headerName: "City",
      field: "Followup_City",
      enableRowGroup: true,
      hide: groupByField === "City",
    },
    {
      headerName: "State",
      field: "Followup_State",
    },
    {
      headerName: "Country",
      field: "Followup_Country",
      enableRowGroup: true,
      hide: groupByField === "Country",
    },
    {
      headerName: "Salesperson",
      field: "SalesPersonName",
      enableRowGroup: true,
      hide: groupByField === "Salesperson",
    },
    {
      headerName: "Sales Team",
      field: "Sales_Team",
      enableRowGroup: true,
      hide: groupByField === "Sales Team",
    },
    {
      headerName: "Campaign",
      field: "CampaignName",
      enableRowGroup: true,
      hide: groupByField === "Campaign",
    },
    {
      headerName: "Medium",
      field: "MediumName",
      enableRowGroup: true,
      hide: groupByField === "Medium",
    },
    {
      headerName: "Source",
      field: "SourceName",
      enableRowGroup: true,
      hide: groupByField === "Source",
    },
    {
      headerName: "Stage",
      field: "Stage",
      enableRowGroup: true,
      hide: groupByField === "Stage",
    },
    {
      headerName: "Expected Revenue",
      field: "ExpectedRevenue",
    },
  ];

  // const handleSearch = async () => {
  //   try {
  //     const payload = {};
  //     const companyCode = sessionStorage.getItem("selectedCompanyCode");

  //     if (companyCode) {
  //       payload.company_code = companyCode;
  //     }

  //     const fieldMapping = {
  //       Name: "FirstColumn",
  //       Email: "Email",
  //       Phone: "Phone",
  //       Country: "Country",
  //       Activities: "Activities",
  //       CompanyName: "CompanyName",
  //       Person_name: "Person_name",
  //     };

  //     let groupByField = null;

  //     // Clone selectedTags for processing
  //     const tagsToProcess = [...selectedTags];

  //     // ?? If searchQuery is NOT empty & last tag is groupBy field
  //     if (searchQuery && tagsToProcess.length > 0) {
  //       const lastTag = tagsToProcess[tagsToProcess.length - 1];
  //       if (fieldMapping[lastTag]) {
  //         // Remove the last tag and replace with full filter
  //         tagsToProcess.pop();
  //         tagsToProcess.push(`${lastTag}: ${searchQuery}`);
  //       }
  //     }

  //     // Build payload
  //     tagsToProcess.forEach(tag => {
  //       const trimmedTag = tag.trim();

  //       if (trimmedTag.includes(":")) {
  //         const [label, value] = trimmedTag.split(":").map(x => x.trim());
  //         const field = fieldMapping[label];
  //         if (field && value) {
  //           payload[field] = value;
  //         }
  //       } else {
  //         const field = fieldMapping[trimmedTag];
  //         if (field) {
  //           groupByField = field;
  //         }
  //       }
  //     });

  //     if (groupByField) {
  //       payload.group_by = groupByField;
  //     }

  //     const response = await fetch(`${config.apiBaseUrl}/GetContactClient`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setSearchResults(data);
  //   } catch (error) {
  //     console.error("Error fetching company data:", error);
  //     setSearchResults([]);
  //   }
  // };

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

      if (response.ok) {
        navigate("/pipeline", { state: { data } });
      } else {
        console.error("Failed to fetch details:", data.message);
      }
    } catch (err) {
      console.error("Error fetching opportunity details:", err);
    }
  };

  const onRowClicked = (params) => {
    const Opportunity_ID = params.data?.Opportunity_ID;
    if (Opportunity_ID) {
      handleClick(Opportunity_ID);
    } else {
      console.warn("No Opportunity_ID found for selected row");
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
        ["Sales Team Analysis"], 
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Team");
  
      XLSX.writeFile(workbook, "Sales_Team_Analysis.xlsx");
    };

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="row align-items-center py-2">
          <div className="col-md-4">
            <h1 className="d-flex justify-content-start">Sales Team Analysis</h1>
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
              title = "Export Excel"
              onClick={handleExcelExport}
            >
              <i class="fa-solid fa-file-excel"></i>
            </savebutton>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2 shadow-lg bg-white rounded-3 p-3">
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
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

export default LeadsAnalysis;