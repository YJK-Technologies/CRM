import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
const config = require("../../Apiconfig");

const PipelineAnalysis = () => {
  const gridRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const popupRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const company_code = sessionStorage.getItem("selectedCompanyCode");
  const companyName = sessionStorage.getItem('selectedCompanyName');
  const navigate = useNavigate();


  const location = useLocation();
  const clickedData = location.state?.clickedData;

  console.log("Clicked Chart Data:", clickedData);

  const filterOptions = [
    // "Active",
    // "Inactive",
    // "Won",
    // "Lost"
  ];

  const tagFieldMap = {
    "Opportunity Name": "OpportunityName",
    "Contact Name": "Contact",
    "Email": "Email_ID",
    "Sales Person": "SalesPerson",
    "Stage": "Stage",
    "Expected Revenue": "ExpectedRevenue",
  };

  const groupByOptions = ["Opportunity Name", "Contact Name", "Email", "Sales Person", "Stage", "Expected Revenue"];

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

  useEffect(() => {
    if (!clickedData) return;

    console.log(clickedData);

    const { TYPE, datasetLabel, fullData } = clickedData;
    const name = fullData?.name || clickedData.xLabel || "Unknown";

    let sales_team_name = "";

    if (datasetLabel === "Opportunity Count") {
      sales_team_name = name;
    } else {
      const formattedLabel = String(datasetLabel || "").replace(/\s*\/\s*/g, ",");
      sales_team_name = `${name},${formattedLabel}`;
    }

    sales_team_name = String(sales_team_name).replace(/,+$/, "").trim();

    const body = {
      mode: TYPE,
      company_code,
      sales_team_name,
    };

    const fetchPipelineAnalysisData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/PipelineDetailChart`, {
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
            Contact: matchedItem.Contact,
            Email_ID: matchedItem.Email_ID,
            SalesPerson: matchedItem.SalesPerson,
            ExpectedRevenue: matchedItem.ExpectedRevenue,
            Stage: matchedItem.Stage,
            Type: matchedItem.Type,
          }));
          const totalAmount = newRows.reduce((sum, row) => sum + row.ExpectedRevenue, 0);

          const totalRow = {
            OpportunityName: "",
            Contact: "",
            Email_ID: "",
            SalesPerson: "",
            Stage: "Total Revenue",
            Type: "",
            ExpectedRevenue: totalAmount
          };

          setOriginalData([...newRows, totalRow]);
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

    fetchPipelineAnalysisData();
  }, [clickedData, company_code]);


  const handleSelect = (item) => {
    let tagToSet = item;

    // Convert typing → tag
    if (item.startsWith("Search ")) {
      const parts = item.split(" for: ");
      const field = parts[0].replace("Search ", "");
      const query = parts[1];
      tagToSet = `Search ${field} for: ${query}`;
    }

    if (!selectedTags.includes(tagToSet)) {
      setSelectedTags([...selectedTags, tagToSet]);
    }

    setSearchQuery("");
    setShowPopup(false);
  };

  const handleRemove = (tag) => {
    const updatedTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(updatedTags);

    // Re-apply filter
    if (updatedTags.length === 0) {
      setSearchResults(originalData);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
      headerName: "Contact Name",
      field: "Contact",
    },
    {
      headerName: "Email",
      field: "Email_ID",
    },
    {
      headerName: "Sales Person",
      field: "SalesPerson",
    },
    {
      headerName: "Stage",
      field: "Stage",
    },
    {
      headerName: "Type",
      field: "Type",
      hide: true
    },
    {
      headerName: "Expected Revenue",
      field: "ExpectedRevenue",
    },
  ];

  const handleSearch = () => {
    if (selectedTags.length === 0) {
      setSearchResults([]);
      toast.warning("Please add at least one filter");
      return;
    }

    const filteredData = originalData.filter(row => {
      if (row.Stage === "Total Revenue") return false;

      return selectedTags.every(tag => {
        if (tag.startsWith("Search ")) {
          const match = tag.match(/Search (.+) for: (.+)/);
          if (!match) return false;

          const [, label, value] = match;
          const field = tagFieldMap[label];
          if (!field) return false;

          return String(row[field] || "")
            .toLowerCase()
            .includes(value.toLowerCase());
        }

        const field = tagFieldMap[tag];
        if (!field) return false;

        return String(row[field] || "").trim() !== "";
      });
    });

    if (filteredData.length === 0) {
      setSearchResults([]);
      toast.warning("Data not found");
      return;
    }

    const totalAmount = filteredData.reduce(
      (sum, r) => sum + (Number(r.ExpectedRevenue) || 0),
      0
    );

    setSearchResults([
      ...filteredData,
      {
        OpportunityName: "",
        Contact: "",
        Email_ID: "",
        SalesPerson: "",
        Stage: "Total Revenue",
        ExpectedRevenue: totalAmount,
      },
    ]);
  };

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
      ["Pipeline Analysis"],
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pipeline");

    XLSX.writeFile(workbook, "Pipeline_Analysis.xlsx");
  };

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="row align-items-center py-2">
          <div className="col-md-4">
            <h1 className="d-flex justify-content-start">Pipeline Analysis</h1>
          </div>

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
                  placeholder="Search"
                  onFocus={() => setShowPopup(true)}
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
              </div>
              <span
                className="input-group-text bg-white border-end-1"
                onClick={handleSearch}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-search"></i>
              </span>
            </div>

            {showPopup && (
              <div
                ref={popupRef}
                className="popup-menu shadow bg-white border"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "600px",
                  zIndex: 1000,
                  padding: "15px",
                }}
              >
                {searchQuery.length > 0 ? (
                  <div>
                    <h6 className="fw-bold mb-3">Search for: {searchQuery}</h6>
                    <ul className="list-unstyled">
                      {groupByOptions.map((option, index) => (
                        <li
                          key={index}
                          className="p-1"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleSelect(`Search ${option} for: ${searchQuery}`)
                          }
                        >
                          Search {option} for: <strong>{searchQuery}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="d-flex">
                    {/* Filters */}
                    {/* <div className="flex-fill border-end pe-3">
                      <h6 className="fw-bold mb-3">Filters</h6>
                      <ul className="list-unstyled">
                        {filterOptions.map((item) => (
                          <li
                            key={item}
                            className={`p-1 ${selectedTags.includes(item)
                              ? "bg-light fw-bold"
                              : ""
                              }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSelect(item)}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                       <ul className="list-unstyled mt-3">
                            {[
                              "Created On",
                              "Expected Closing",
                              "Date Closed",
                            ].map((item) => (
                              <li
                                key={item}
                                className="p-1"
                                style={{
                                  cursor: "pointer",
                                  position: "relative",
                                }}
                                onClick={() =>
                                  setOpenDropdown(
                                    openDropdown === item ? null : item
                                  )
                                }
                              >
                                {item} ?
                                {openDropdown === item && (
                                  <ul
                                    className="list-unstyled shadow bg-white border rounded mt-1 p-2"
                                    style={{
                                      position: "absolute",
                                      left: "100%",
                                      top: 0,
                                      zIndex: 2000,
                                      minWidth: "180px",
                                    }}
                                  >
                                    {dateFilterOptions.map((subItem) => (
                                      <li
                                        key={subItem}
                                        className="p-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          handleSelect(`${item}: ${subItem}`)
                                        }
                                      >
                                        {subItem}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                      <ul className="list-unstyled mt-3">
                        <li>Archived</li>
                        <li className="text-primary">+ Add Custom Filter</li>
                      </ul>
                    </div> */}

                    {/* Group By */}
                    <div className="flex-fill text-center px-3">
                      <h6 className="fw-bold mb-3">Group By</h6>
                      <ul className="list-unstyled">
                        {groupByOptions.map((item) => (
                          <li
                            key={item}
                            className={`p-1 ${selectedTags.includes(item)
                              ? "bg-light fw-bold"
                              : ""
                              }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSelect(item)}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Favorites */}
                    {/* <div className="flex-fill ps-3">
                      <h6 className="fw-bold mb-3">Favorites</h6>
                      <ul className="list-unstyled">
                        {["Save current search"].map((item) => (
                          <li
                            key={item}
                            className={`p-1 ${selectedTags.includes(item)
                              ? "bg-light fw-bold"
                              : ""
                              }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSelect(item)}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                )}
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

      <div className="d-flex flex-column mb-2 shadow-lg bg-white rounded-3 p-3 pb-4">
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={searchResults}
            columnDefs={columnDefs}
            pagination={true}
            paginationAutoPageSize={true}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            onRowClicked={onRowClicked}
            getRowStyle={() => ({ cursor: "pointer" })}
          />
        </div>
      </div>
    </div>
  );
};

export default PipelineAnalysis;