import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";

const config = require("../../Apiconfig");

const CRMSalesActivity = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState("");
  const [Loading, setLoading] = useState("");
  const [stage, setStage] = useState("");
  const [Company, setCompany] = useState("");
  const [OpportunityName, setOpportunityName] = useState("");
  const [ContactName, setContactName] = useState("");
  const [ExpectedRevenue, setExpectedRevenue] = useState("");
  const [showPopupPipeline, setShowPopupPipeline] = useState(false);
  const [Payment, setPayment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSpModal, setShowSpModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("OpportunityName");
  const [searchValue, setSearchValue] = useState("");
  const [currentGroupField, setCurrentGroupField] = useState("");
  const [opportunityList, setOpportunityList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [EmailList, setEmailList] = useState([]);
  const [StageList, setStageList] = useState([]);
  const companyName = sessionStorage.getItem("selectedCompanyName");

  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };

 const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  setShowPopup(true);
};


  const groupByOptions = [
  "Stage",
  "Company",
  "Opportunity Name",
  "Contact Name",
  "Expected Revenue",
  "Payment"
];


  const filterOptions = ["OpportunityName", "ContactName", "Email", "stage"];

  const modeMap = {
    // Normal filters
    OpportunityName: "OpportunityName",
    ContactName: "ContactName",
    Email: "Email",
    "Expected Revenue": "Expected Revenue",
    Satage: "Satage",
  };

  // When a grouped row is clicked: add tag and search filtered data
  const handleGroupFilter = async (field, value) => {
    const backendField = modeMap[field];
    if (!backendField) return;

    const tag = `${field}: ${value}`;

    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));

    await handleSearch();
  };

  // const handleRowClick = (params) => {
  // const selectedRevenue = params.data.ExpectedRevenue;
  // if (onSaveRevenue) {
  //   onSaveRevenue(selectedRevenue);
  //   }
  // };
  const handleGroupBy = (field) => {
    setCurrentGroupField(field);
    if (!gridRef.current) return;
    const api = gridRef.current.api;

    const updatedDefs = columnDefs.map((col) =>
      col.field === field ? { ...col, rowGroup: true, hide: false } : col
    );

    api.setColumnDefs(updatedDefs);
    api.setGroupDisplayType("multipleColumns");
  };

  const handleSelect = (item) => {
    setSearchQuery("");
    setShowPopup(false);
    setOpenDropdown(null);

    if (selectedTags.includes(item)) {
      setSelectedTags(selectedTags.filter((p) => p !== item));
    } else {
      setSelectedTags([...selectedTags, item]);
    }
  };

  const columnDefs = [
    {
      headerName: "Opportunity",
      field: "OpportunityName",
      flex: 1,
    },
    {
      headerName: "Contact Name",
      field: "Contact",
      flex: 1,
    },
    {
      headerName: "Email",
      field: "Type_of_Activity",
      flex: 1,
    },
    {
      headerName: "Expected Revenue",
      field: "ExpectedRevenue",
      flex: 1,
    },
    {
      headerName: "Stage",
      field: "Stage",
      flex: 1,
    },
  ];

  const handleFilterSearch = async (filterOption, searchValue) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/GetActive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("company_code"),
          FilterOption: filterOption,
          OpportunityName:
            filterOption === "OpportunityName" ? searchValue : "",
          ContactName: filterOption === "ContactName" ? searchValue : "",
          Company: filterOption === "Company" ? searchValue : "",
        }),
      });

      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error during filter search:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = async () => {
  //   setLoading(true);

  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/activitySearch`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         company_code: sessionStorage.getItem("selectedCompanyCode") || "C001",
  //         stage: stage || "",
  //         Company: Company || "",
  //         OpportunityName: OpportunityName || "",
  //         ContactName: ContactName || "",
  //         ExpectedRevenue: ExpectedRevenue || 0,
  //         Payment: Payment || 0,
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSearchResults(data);
  //       if (data.length === 0) toast.info("No records found");
  //     } else {
  //       const error = await response.json();
  //       toast.warning(error.message || "Failed to fetch data");
  //     }
  //   } catch (err) {
  //     toast.error("Error fetching data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (popupRef.current && !popupRef.current.contains(event.target)) {
  //       setShowPopupPipeline(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
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
    const company_code = sessionStorage.getItem("company_code");
    if (!company_code) return;

    fetch(`${config.apiBaseUrl}/GetActive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "FS",
        company_code: company_code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setOpportunityList(
            [...new Set(data.data.map((x) => x.OpportunityName))].filter(
              Boolean
            )
          );

          setContactList(
            [...new Set(data.data.map((x) => x.ContactName))].filter(Boolean)
          );
          setEmailList(
            [...new Set(data.data.map((x) => x.Email))].filter(Boolean)
          );
          setEmailList(
            [...new Set(data.data.map((x) => x.stage))].filter(Boolean)
          );
        }
      })
      .catch((err) => console.error("Error fetching dropdown data", err));
  }, []);

  // const handleSearch = async () => {
  //   try {
  //     const payload = {};
  //     const company_code = sessionStorage.getItem("selectedCompanyCode");
  //     if (company_code) payload.company_code = company_code;

  //     selectedTags.forEach((tag) => {
  //       const [label, ...rest] = tag.split(":");
  //       const value = rest.join(":").trim();
  //       const backendField = modeMap[label.trim()];
  //       if (backendField) payload[backendField] = value;
  //     });

  //     const response = await fetch(`${config.apiBaseUrl}/activitySearch`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.ok) {
  //       const searchData = await response.json();
  //       setSearchResults(searchData);
  //       console.log("data fetched successfully")

  //     } else if (response.status === 404) {
  //       console.log("Data not found");
  //       toast.warning("Data not found")
  //       setSearchResults([]);
  //     } else {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message || "Failed to Fetch data");
  //     }
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //     toast.error("Error updating data: " + error.message);
  //   }
  // };

  const handleSearch = async () => {
  try {
    const payload = {};
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    if (company_code) {
      payload.company_code = company_code;
    }

    selectedTags.forEach(tag => {
      const match = tag.match(/Search\s(.+?)\sfor:\s(.+)/i);

      if (match) {
        const field = match[1].trim();
        const value = match[2].trim();

        switch (field) {
          case "Stage":
            payload.stage = value;
            break;
          case "Company":
            payload.Company = value;
            break;
          case "Opportunity Name":
            payload.OpportunityName = value;
            break;
          case "Contact Name":
            payload.ContactName = value;
            break;
          case "Expected Revenue":
            payload.ExpectedRevenue = value;
            break;
          case "Payment":
            payload.Payment = value;
            break;
          default:
            console.log("Unknown filter:", field);
        }
      }
    });

    const response = await fetch(`${config.apiBaseUrl}/activitySearch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
      if (data.length === 0) toast.info("No records found");
    } 
    else if (response.status === 404) {
      setSearchResults([]);
      toast.warning("Data not found");
    } 
    else {
      const error = await response.json();
      toast.error(error.message || "Failed to fetch data");
    }
  } catch (err) {
    toast.error("Error fetching data: " + err.message);
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

    // ?? CHECK IF NO DATA
    if (rows.length === 0) {
      toast.error("No data available to export!", {
        position: "top-right",
      });
      return;
    }

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
      <ToastContainer position="top-right"className="toast-design"theme="colored"/>
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="row align-items-center py-2 px-3">
          <div className="col-md-2">
            <h1 className="d-flex justify-content-start">Activity</h1>
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
                className="p-2 input-group-text bg-white border-end-1"
                title="Search"
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
                      <h6 className="fw-bold mb-3">
                        Search for: {searchQuery}
                      </h6>
                      <ul className="list-unstyled">
                        {groupByOptions.map((option, index) => (
                          <li
                            key={index}
                            className="p-1"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleSelect(
                                `Search ${option} for: ${searchQuery}`
                              )
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
                              className={`p-1 ${
                                selectedTags.includes(item)
                                  ? "bg-light fw-bold"
                                  : ""
                              }`}
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
                              {item} <i className="bi bi-caret-right"></i>
                              {openDropdown === item && (
                                <ul
                                  className="list-unstyled shadow bg-white border rounded mt-1 p-2"
                                  style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: 0,
                                    zIndex: 2000,
                                    minWidth: "180px",
                                  }}
                                >
                                  {item === "OpportunityName" && (
                                    <>
                                      {[
                                        "RVP Tech's Opportunity",
                                        "Singam's Opportunity",
                                        "POTHESWARAN TEXTILE's",
                                        "Apollo Lab Test's Opportunity",
                                      ].map((staticItem, index) => (
                                        <li
                                          key={`static-${index}`}
                                          className="p-1"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleSelect(
                                              `${item}: ${staticItem}`
                                            )
                                          }
                                        >
                                          {staticItem}
                                        </li>
                                      ))}

                                      {opportunityList.length > 0 ? (
                                        opportunityList.map((sub, index) => (
                                          <li
                                            key={`dynamic-${index}`}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              handleSelect(`${item}: ${sub}`)
                                            }
                                          >
                                            {sub}
                                          </li>
                                        ))
                                      ) : (
                                        <li className="p-1 text-muted">
                                          Loading...
                                        </li>
                                      )}
                                    </>
                                  )}

                                  {item === "ContactName" && (
                                    <>
                                      {[
                                        "Balaji",
                                        "Raavanan",
                                        "bala",
                                        "Malai",
                                      ].map((staticName, index) => (
                                        <li
                                          key={`static-contact-${index}`}
                                          className="p-1"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleSelect(
                                              `${item}: ${staticName}`
                                            )
                                          }
                                        >
                                          {staticName}
                                        </li>
                                      ))}

                                      {contactList.length > 0 ? (
                                        contactList.map((sub, index) => (
                                          <li
                                            key={`dynamic-contact-${index}`}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              handleSelect(`${item}: ${sub}`)
                                            }
                                          >
                                            {sub}
                                          </li>
                                        ))
                                      ) : (
                                        <li className="p-1 text-muted">
                                          Loading...
                                        </li>
                                      )}
                                    </>
                                  )}

                                  {item === "Email" && (
                                    <>
                                      {[
                                        "Email",
                                        "meeting",
                                        "call",
                                        "Document",
                                      ].map((staticEmail, index) => (
                                        <li
                                          key={`static-email-${index}`}
                                          className="p-1"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleSelect(
                                              `${item}: ${staticEmail}`
                                            )
                                          }
                                        >
                                          {staticEmail}
                                        </li>
                                      ))}

                                      {EmailList && EmailList.length > 0 ? (
                                        EmailList.map((email, index) => (
                                          <li
                                            key={`dynamic-email-${index}`}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              handleSelect(`${item}: ${email}`)
                                            }
                                          >
                                            {email}
                                          </li>
                                        ))
                                      ) : (
                                        <li className="p-1 text-muted">
                                          No Email data found
                                        </li>
                                      )}
                                    </>
                                  )}
                                  {item === "stage" && (
                                    <>
                                      {["ProPosal", "qualified", "won"].map(
                                        (staticStage, index) => (
                                          <li
                                            key={`static-stage-${index}`}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              handleSelect(
                                                `${item}: ${staticStage}`
                                              )
                                            }
                                          >
                                            {staticStage}
                                          </li>
                                        )
                                      )}

                                      {StageList.length > 0 ? (
                                        StageList.map((sub, index) => (
                                          <li
                                            key={`dynamic-stage-${index}`}
                                            className="p-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              handleSelect(`${item}: ${sub}`)
                                            }
                                          >
                                            {sub}
                                          </li>
                                        ))
                                      ) : (
                                        <li className="p-1 text-muted">
                                          Loading...
                                        </li>
                                      )}
                                    </>
                                  )}
                                </ul>
                              )}
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
                              <li className="text-primary">
                                + Add Custom Filter
                              </li>
                            </ul> 
                      </div> */}

                      {/* Group By */}
                      <div className="flex-fill  px-3">
                        <h6 className="fw-bold mb-3">Group By</h6>
                        <ul className="list-unstyled">
                          {groupByOptions.map((item) => (
                            <li
                              key={item}
                              className={`p-1 ${
                                selectedTags.includes(item) ? "bg-light fw-bold" : ""
                              }`}
                              style={{ cursor: "pointer" }}
                              onRowClicked={(params) => {
                                if (params.node && params.node.group) {
                                  handleGroupFilter(
                                    currentGroupField,
                                    params.node.key
                                  ); // << now works
                                }
                                // else {
                                //   handleRowClick(params);
                                // }
                              }}
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
                                  className={`p-1 ${
                                    selectedTags.includes(item)
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
      <div className="shadow-lg p-3 mb-2 bg-white rounded">
        <div className="modal-body">
          <div className="row align-items-center">
            {/* Button Column */}
            {/* <div className="col-md-3 d-flex justify-content-start mb-2 mb-md-2">
          <button className="btn btn-outline-secondary px-4 fw-semibold w-100"title="Generate Leads">
            <i className="bi bi-lightning-charge me-2"></i> Generate Leads
          </button>
        </div> */}

            {/* Input Column */}

            {/* <div className="col-md-1 mt-1">
                  {/* <button
                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                    type="button"
                    onClick={() => setShowSpModal(true)}
                    aria-label="Add New"
                    style={{ width: "30px", height: "30px" }}
                  >
                    {/* <i
                      className="bi bi-plus text-center"
                      style={{ fontSize: "26px" }}
                    ></i> */}
            {/* </button> */}
            {/* </div>  */}
          </div>
          {/* AG Grid Table */}
          {/* Grid Section */}
          <div
            className="ag-theme-alpine "
            style={{ height: 400, width: "100%", marginTop: "5px" }}
          >
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
              onRowClicked={(params) => {
                if (params.node && params.node.group) {
                  // This means user clicked grouped row
                  handleGroupFilter(currentGroupField, params.node.key);
                  // } else {
                  //   handleRowClick(params);
                  // }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMSalesActivity;
