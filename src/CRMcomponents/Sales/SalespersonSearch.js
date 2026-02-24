import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddSalesperson from "./addSalesperson";
import { toast } from 'react-toastify';
const config = require("../../Apiconfig");

const SalespersonSearch = ({ showSpSearch, onSpSearchClose, onSalespersonSaved, onSaveSP, title, onSaveTeam }) => {
  const gridRef = useRef();
  const [showSpModal, setShowSpModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const popupRef = useRef(null);
  const [rowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const filterOptions = [
    // "My Pipeline",
    // "Active",
    // "Inactive",
    // "Won",
    // "Lost"
  ];

  const dateFilterOptions = [
    // "Created On",
    // "Expected Closing",
    // "Date Closed"
  ];

  const groupByOptions = [
    "Code",
    "Person Name",
    "Email Id",
    "Language",
    "Role",
    "Status",
    "Sales Team",
  ];

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

  if (!showSpSearch) return null;

  const columnDefs = [
    {
      headerName: "Code",
      field: "SalesCode",
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };

        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      }
    },
    { headerName: "Person Name", field: "SalesPersonName" },
    { headerName: "Email ID", field: "EmailID" },
    { headerName: "Language", field: "Language" },
    { headerName: "Role", field: "Role" },
    { headerName: "Sales Team", field: "SalesTeam" },
    { headerName: "Status", field: "status" },
  ];

  if (!showSpSearch) return null;

  const handleNavigateWithRowData = (selectedRow) => {
    setShowSpModal(true);
    setSelectedRowData(selectedRow);
  };

  const handleSearch = async () => {
    try {
      const payload = {};
      const companyCode = sessionStorage.getItem("selectedCompanyCode");

      if (companyCode) {
        payload.company_code = companyCode;
      }

      selectedTags.forEach((tag) => {
        const parts = tag.split(":");
        if (parts.length > 1) {
          const field = parts[0].trim().replace(/\s/g, "");
          const value = parts[1].trim();
          if (field === "Code") payload.SalesCode = value;
          if (field === "PersonName") payload.SalesPersonName = value;
          if (field === "EmailId") payload.EmailID = value;
          if (field === "Language") payload.Language = value;
          if (field === "Role") payload.Role = value;
          if (field === "Status") payload.status = value;
          if (field === "SalesTeam") payload.SalesTeam = value;
        }
      });

      const response = await fetch(`${config.apiBaseUrl}/SearchSalesperson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const searchData = await response.json();
        setSearchResults(searchData);
      } else if (response.status === 404) {
        console.log("Data not found");
        setSearchResults([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
  };

  // const handleRowClick = (params) => {
  //   if (onSaveTeam) {
  //     onSaveTeam(params.data);
  //   }

  //   // const selectedsetSalesperson = params.data.SalesCode;
  //   // if (onSaveSP) {
  //   //   onSaveSP(selectedsetSalesperson);
  //   // }

  //   // if (showSalesperson) {
  //   //   showSalesperson();
  //   // }
  // };

  const handleRowClick = (params) => {
    const selectedsetSalesperson = params.data.SalesCode;
    if (selectedsetSalesperson) {
      onSaveSP(selectedsetSalesperson);
    }
  };

  const handleSalespersonClose = () => {
    setShowSpModal(false);
    handleSearch();
  };

  return (
    <div
      className="modal d-block mt-5 popupadj Topnav-screen popup"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">{title || "Search Salesperson"}</h5>
              <button
                className="btn btn-danger"
                onClick={onSpSearchClose}
                aria-label="Close"
                title="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div className="modal-body">
            <div className="row mb-3 d-flex justify-content-center">
              <div className="col-md-7 position-relative">
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
                      className="border-0 p-0"
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
                    title="Search"
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
                              Search {option} for:{" "}
                              <strong>{searchQuery}</strong>
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
                            <li className="text-primary">
                              + Add Custom Filter
                            </li>
                          </ul>
                        </div> */}

                        {/* Group By */}
                        <div className="flex-fill px-3">
                          <h6 className="fw-bold mb-3">Filter</h6>
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
              <div className="col-md-1 mt-1">
                <button
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => setShowSpModal(true)}
                  aria-label="Add New"
                  style={{ width: "30px", height: "30px" }}
                  title="Add"
                >
                  <i
                    className="bi bi-plus text-center"
                    style={{ fontSize: "26px" }}
                  ></i>
                </button>
              </div>
            </div>
            {/* AG Grid Table */}
            <div
              className="ag-theme-alpine"
              style={{ height: 400, width: "100%" }}
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
                  cellStyle: { cursor: "pointer" }
                }}
                onRowClicked={(params) => handleRowClick(params)}
              />
            </div>
          </div>
          {showSpModal && (
            <AddSalesperson
              showSalesperson={showSpModal}
              onSalespersonClose={handleSalespersonClose}
              onSaveSalesperson={(name) => {
                if (onSalespersonSaved) onSalespersonSaved(name);
                setShowSpModal(false);
                onSpSearchClose?.();
              }}
              title={selectedRowData ? "Update Salesperson" : "Create Salesperson"}
              initialData={selectedRowData}
              mode={selectedRowData ? "update" : "create"}
            />
          )}
          {/* Footer */}
          {/* <div className="modal-footer justify-content-end ms-3">
                <button className="">
                    Add Selected
                </button>
              </div> */}
        </div>
      </div>
    </div>
  );
};

export default SalespersonSearch;
