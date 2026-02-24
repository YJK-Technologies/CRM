import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import NewCompanyModal from "./addCompany.js";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";

const config = require("../../Apiconfig");

const ActivityChart = () => {
  const gridRef = useRef();
  const [addSourceModal, setAddSourceModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const popupRef = useRef(null);
  const [rowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [selectedContactData, setSelectedContactData] = useState(null);

  const filterOptions = [

    // "Active",
    // "Inactive",
    // "Won",
    // "Lost"
  ];

  const groupByOptions = ["CompanyName", "Person_name", "Email", "Phone",];

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

  const handleSelect = (item) => {
    let tagToSet = item;
    if (item.startsWith("Search ")) {
      const parts = item.split(" for: ");
      const field = parts[0].replace("Search ", "");
      const query = parts[1];
      tagToSet = `${field}: ${query}`;
    }

    if (!selectedTags.includes(tagToSet)) {
      setSelectedTags([...selectedTags, tagToSet]);
    }
    setOpenDropdown(null);
    setShowPopup(false);
    setSearchQuery("");
  };

  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowPopup(true);
  };

  const columnDefs = [
    {
      headerName: "Completion Date",
      field: "CompletionDate",
      flex: 1,
      cellRenderer: (params) => {
        const name = params.value || "";
        const secondName = params.data?.SecondColumn || "";
        const displayName = secondName ? `${name} - ${secondName}` : name;
        const firstLetter = name.charAt(0).toUpperCase();

        const type = params.data?.Type?.toLowerCase();
        let bgColor = "#ccc";
        if (type === "company") bgColor = "#007bff";
        else if (type === "person") bgColor = "#28a745";
        else if (type === "contact") bgColor = "#ffc107";

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                minHeight: "28px",
                minWidth: "28px",
                borderRadius: "6px",
                backgroundColor: bgColor,
                color: "white",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
                fontSize: "14px",
              }}
            >
              {firstLetter}
            </div>
            <span>{displayName}</span>
          </div>
        );
      },
    },
    {
      headerName: "Assigned To",
      field: "AssignedTo",
      flex: true
    },
    {
      headerName: "Activity Type",
      field: "ActivityType",
      flex: true
    },
    {
      headerName: "Lead Tags",
      field: "LeadTags",
      flex: true
    },
    // {
    //   headerName: "Activities",
    //   field: "Activities",
    //   flex: true
    // },
    {
      headerName: "Type",
      field: "Type",
      flex: true,
      hide: true
    },
  ];

  const handleSearch = async () => {
    try {
      const payload = {};
      const companyCode = sessionStorage.getItem("selectedCompanyCode");

      if (companyCode) {
        payload.company_code = companyCode;
      }

      const fieldMapping = {
        Name: "FirstColumn",
        Email: "Email",
        Phone: "Phone",
        Country: "Country",
        Activities: "Activities",
        CompanyName: "CompanyName",
        Person_name: "Person_name",
      };

      let groupByField = null;

      // Clone selectedTags for processing
      const tagsToProcess = [...selectedTags];

      // ?? If searchQuery is NOT empty & last tag is groupBy field
      if (searchQuery && tagsToProcess.length > 0) {
        const lastTag = tagsToProcess[tagsToProcess.length - 1];
        if (fieldMapping[lastTag]) {
          // Remove the last tag and replace with full filter
          tagsToProcess.pop();
          tagsToProcess.push(`${lastTag}: ${searchQuery}`);
        }
      }

      // Build payload
      tagsToProcess.forEach(tag => {
        const trimmedTag = tag.trim();

        if (trimmedTag.includes(":")) {
          const [label, value] = trimmedTag.split(":").map(x => x.trim());
          const field = fieldMapping[label];
          if (field && value) {
            payload[field] = value;
          }
        } else {
          const field = fieldMapping[trimmedTag];
          if (field) {
            groupByField = field;
          }
        }
      });

      if (groupByField) {
        payload.group_by = groupByField;
      }

      const response = await fetch(`${config.apiBaseUrl}/GetContactClient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setSearchResults([]);
    }
  };

  


  const handleCellClick = async (event) => {
    const rowData = event.data;

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_Activity_Chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ContactID: rowData.ID,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          sourceType: rowData.sourceType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedContactData(data);
        setShowNewContactModal(true);
      } else {
        console.error('Error fetching contact info:', await response.text());
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (

    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="row align-items-center py-2 px-3">
          <div className="col-md-2">
            <h1 className="d-flex justify-content-start">Activities</h1>
          </div>

          <div className="col-md-8 position-relative">
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
                    <div className="flex-fill border-end pe-3">
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
                      {/* <ul className="list-unstyled mt-3">
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
                          </ul> */}
                      <ul className="list-unstyled mt-3">
                        <li>Archived</li>
                        <li className="text-primary">+ Add Custom Filter</li>
                      </ul>
                    </div>

                    {/* Group By */}
                    <div className="flex-fill border-end px-3">
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
                    <div className="flex-fill ps-3">
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
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2 shadow-lg bg-white rounded-3 p-3">
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={searchResults}
            columnDefs={columnDefs}
            onCellClicked={handleCellClick}
            pagination={true}
            paginationAutoPageSize={true}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
          <NewCompanyModal
            selectedColumnId={selectedColumnId}
            showC={showNewContactModal}
            onCloseC={() => setShowNewContactModal(false)}
            onSaveC={() => setShowNewContactModal(false)}
            contactData={selectedContactData}
            source="Customer"  // ✅ Added
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
