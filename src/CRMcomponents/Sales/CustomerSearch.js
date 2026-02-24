import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import NewCompanyModal from "./addCompany.js";
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from "xlsx";

const config = require("../../Apiconfig");

const CustomerSearch = () => {
  const gridRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const popupRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [selectedContactData, setSelectedContactData] = useState(null);
  const companyName = sessionStorage.getItem('selectedCompanyName');

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
      headerName: "Name",
      field: "FirstColumn",
      flex: 1,
      cellStyle: { cursor: "pointer" },
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
    { headerName: "Email",field: "Email",flex: true,cellStyle: { cursor: "pointer" },},
    { headerName: "Phone",field: "Phone", flex: true, cellStyle: { cursor: "pointer" },},
    { headerName: "Country", field: "Country", flex: true, cellStyle: { cursor: "pointer" },},
    { headerName: "Activities", field: "Type_of_Activity", flex: true, cellStyle: { cursor: "pointer" }, },
    { headerName: "Type", field: "Type",flex: true, hide: true, cellStyle: { cursor: "pointer" },},
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

      if (response.ok) {
        const searchData = await response.json();
        setSearchResults(searchData);
        console.log("data fetched successfully")

      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found")
        setSearchResults([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to Fetch data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    }
  };


  const handleCellClick = async (event) => {
    const rowData = event.data;

    try {
      const response = await fetch(`${config.apiBaseUrl}/GetContactInfoDetails`, {
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
        console.log("data fetched successfully");

      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setSelectedContactData(null);
        setShowNewContactModal(null);

      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }

    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Error fetching data: " + error.message);
    }

  };

  const handleExcelExport = () => {
    if (!gridRef.current) return;

     // CHECK IF DATA IS EMPTY
  if (!searchResults || searchResults.length === 0) {
    toast.error("Data is empty. Cannot generate report.");   // <-- Toast Message
    return;
  }

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
      ["Customer Analysis"], 
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer");

    XLSX.writeFile(workbook, "Customer.xlsx");
  };

  return (

    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="row align-items-center py-2 px-3">
          <div className="col-md-2">
            <h1 className="d-flex justify-content-start">Customer</h1>
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
                title="Search"
                onClick={handleSearch}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-search"></i>
              </span>
            </div>

            {/* Popup */}
            {showPopup && (
              <div
                ref={popupRef}
                className="popup-menu shadow bg-white border"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 10,
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
                  <div className="d-flex justify-content-center">
                    {/* <div className="flex-fill border-end pe-3">
                      <h6 className="fw-bold mb-3">Filters</h6>
                      <ul className="list-unstyled">
                        {filterOptions.map((item) => (
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
                      <ul className="list-unstyled mt-3">
                        <li>Archived</li>
                        <li className="text-primary">+ Add Custom Filter</li>
                      </ul>
                    </div> */}

                    <div className="flex-fill  px-3 text-center">
                      <h6 className="fw-bold mb-3">Filters</h6>
                      <ul className="list-unstyled ">
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

                    {/* <div className="flex-fill ps-3">
                      <h6 className="fw-bold mb-3">Favorites</h6>
                      <ul className="list-unstyled">
                        {["Save current search"].map((item) => (
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
                    </div> */}
                  </div>
                )}
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

export default CustomerSearch;
