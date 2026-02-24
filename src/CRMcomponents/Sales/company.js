import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import NewCompanyModal from './addCompany.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { showConfirmationToast } from '../../ToastConfirmation';

const config = require('../../Apiconfig');

const AddContactModal = ({ showCompany, onCompanyClose, onSaveCompany, selectedColumnId,  screenType  }) => {
  const gridRef = useRef();
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const popupRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const navigate = useNavigate();

  const filterOptions = [
    "My Pipeline",
    "Active",
    "Inactive",
    "Won",
    "Lost"
  ];

  const dateFilterOptions = [
    "Created On",
    "Expected Closing",
    "Date Closed"
  ];

  const groupByOptions = [
    "Company or Person",
    "Email",
    "Company Name",
    "Phone No",
    "GSTIN",
    "Tags",
    "Stage",
    "Address 1",
    "Address 2",
    "Address 3",
    "City",
    "Zip Code",
    "State",
    "Country",
    "Notes",
    "Status",
    "Person Name",
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
      const parts = item.split(' for: ');
      const field = parts[0].replace('Search ', '');
      const query = parts[1];
      tagToSet = `${field}: ${query}`;
    }

    if (!selectedTags.includes(tagToSet)) {
      setSelectedTags([...selectedTags, tagToSet]);
    }
    setOpenDropdown(null);
    setShowPopup(false);
    setSearchQuery('');
  };
  if (!showCompany) return null;
  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowPopup(true);
  };

  const handleEditRow = (rowData) => {
    setSelectedRowData(rowData);
    setShowNewContactModal(true);
  };

  // const handleDeleteRow = (rowData) => {
  //   if (window.confirm(`Are you sure you want to delete contact ${rowData.ContactID}?`)) {
  //     console.log("Delete confirmed for:", rowData);
  //     // Call API or delete logic here
  //   }
  // };

  const handleDeleteRow = async (keyfield) => {
  if (!keyfield) {
    toast.warning("Invalid contact id");
    return;
  }
showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
  try {
    const response = await fetch(
      `${config.apiBaseUrl}/CRM_ContactInfoDelete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyfield: String(keyfield), // 🔥 force string
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      }
    );

    if (response.ok) {
  const result = await response.json();
  toast.success(result.message || "Deleted successfully");

  // 🔥 remove deleted row from grid
  setSearchResults(prev =>
    prev.filter(row => row.keyfield !== keyfield)
  );
}
else {
      let errorMessage = "Delete failed";
      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.message || errorMessage;
      } catch {
        errorMessage = await response.text();
      }
      toast.warning(errorMessage);
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Error deleting data: " + error.message);
  }
 },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const columnDefs = [
    {
      headerName: 'Actions',
      colId: "actions",
      field: 'actions',
      width: 120,
      cellRenderer: (params) => {
        const handleEdit = (e) => {
          e.stopPropagation();
          handleEditRow(params.data);
        };

        const handleDelete = (e) => {
          e.stopPropagation();
          handleDeleteRow(params.data.keyfield);
        };

        return (
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
            <FaEdit
              style={{ cursor: "pointer", color: "#007bff" }}
              title="Edit"
              onClick={handleEdit}
            />
            <FaTrash
              style={{ cursor: "pointer", color: "red" }}
              title="Delete"
              onClick={handleDelete}
            />
          </div>
        );
      },
    },
    {headerName: 'Contact Id', field: 'ContactID', },
    { headerName: 'Company Or Person', field: 'Company_or_Persona' },
    { headerName: 'Company Name', field: 'CompanyName' },
    // { headerName: 'Person Name', field: 'Person_name' },
    { headerName: 'Phone No', field: 'Phone' },
    { headerName: 'GSTIN', field: 'GSTIn' },
    { headerName: 'Address 1', field: 'Address1' },
    { headerName: 'Address 2', field: 'Address2' },
    { headerName: 'Address 3', field: 'Address3' },
    { headerName: 'Zip Code', field: 'Zip' },
    { headerName: 'City', field: 'City' },
    { headerName: 'State', field: 'State' },
    { headerName: 'Country', field: 'Country' },
    { headerName: 'keyfield', field: 'keyfield', hide : true },
  ];

  if (!showCompany) return null;

const handleSearch = async () => {
  try {
    const payload = {};
    const companyCode = sessionStorage.getItem("selectedCompanyCode");

    if (companyCode) {
      payload.company_code = companyCode;
    }

    const fieldMapping = {
      "Company or Person" : "Company_or_Persona",
      "Email"             : "Email",
      "Company Name"      : "CompanyName",
      "Phone No"          : "Phone",
      "GSTIN"             : "GSTIn",
      "Tags"              : "Tag",
      "Stage"             : "Stage",
      "Address 1"         : "Address1",
      "Address 2"         : "Address2",
      "Address 3"         : "Address3",
      "City"              : "City",
      "Zip Code"          : "Zip",
      "State"             : "State",
      "Country"           : "Country",
      "Notes"             : "Notes",
      "Status"            : "status",
      "Person Name"       : "Person_name",
   };

let groupByField = null;

    // clone tags
    const tagsToProcess = [...selectedTags];

    // SAME logic as CustomerSearch
    if (searchQuery && tagsToProcess.length > 0) {
      const lastTag = tagsToProcess[tagsToProcess.length - 1];

      if (fieldMapping[lastTag]) {
        tagsToProcess.pop();
        tagsToProcess.push(`${lastTag}: ${searchQuery}`);
      }
    }

    // build payload
    tagsToProcess.forEach(tag => {
      const trimmedTag = tag.trim();

      if (trimmedTag.includes(":")) {
        const [label, value] = trimmedTag.split(":").map(v => v.trim());
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

    console.log("FINAL COMPANY SEARCH PAYLOAD:", payload);

    const response = await fetch(`${config.apiBaseUrl}/CompanySearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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


  const handleRowClick = (params) => {
    const selectedCompanyID = params.data.ContactID;
    const selectedCompanyName = params.data.CompanyName;
    if (onSaveCompany) {
      onSaveCompany(selectedCompanyID, selectedCompanyName, );
    }
  };

  // const handleRowClick = (params) => {
  //   setSelectedRowData(params.data);
  //   setShowNewContactModal(true);
  // }


  return (
    <div
      className="modal d-block  popupadj  popup "
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", marginTop: "55px", marginLeft: "18px", width: "100%", minWidth: "520px" }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">Search Company</h5>
              <button
                className="btn btn-danger"
                onClick={onCompanyClose}
                aria-label="Close"
                title='Close'
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
                  >
                    <i className="bi bi-search" title='Search'></i>
                  </span>
                </div>
                {showPopup && (
                  <div
                    ref={popupRef}
                    className="popup-menu shadow ms-3 bg-white border"
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
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSelect(`Search ${option} for: ${searchQuery}`)}
                            >
                              Search {option} for: <strong>{searchQuery}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="d-flex">
                        <div className="flex-fill border-end pe-3">
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
                            {dateFilterOptions.map((item) => (
                              <li
                                key={item}
                                className="p-1"
                                style={{ cursor: "pointer", position: "relative" }}
                                onClick={() =>
                                  setOpenDropdown(openDropdown === item ? null : item)
                                }
                              >
                                {item} <i className="bi bi-caret-right"></i>
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
                                    {[
                                      "Today",
                                      "This Week",
                                      "This Month",
                                      "Last 30 Days",
                                      "Custom Date",
                                    ].map((subItem) => (
                                      <li
                                        key={subItem}
                                        className="p-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSelect(`${item}: ${subItem}`)}
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
                        </div>
                        <div className="flex-fill border-end px-3">
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
                          <ul className="list-unstyled mt-3">
                            <li><i className="bi bi-x text-danger"></i> Clear all</li>
                          </ul>
                        </div>
                        <div className="flex-fill ps-3">
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
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className='col-md-1 mt-1'>
                <button
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => setShowNewContactModal(true)}
                  aria-label="Add New"
                  style={{ width: '30px', height: '30px' }}
                  title='Add'
                >
                  <i className="bi bi-plus text-center" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
            </div>
            <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
              <AgGridReact
                ref={gridRef}
                rowData={searchResults}
                columnDefs={columnDefs}
                pagination={true}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
                onCellClicked={(params) => {
                  // prevent row click if user clicked inside the Actions column
                  if (params.column && params.column.getColId() === "actions") {
                    return;
                  }
                  handleRowClick(params);
                }}
              />
            </div>
          </div>
          {/* <div className="modal-footer justify-content-end ms-3">
            <button className="" onClick={() => setShowNewContactModal(false)}>
              Add Selected
            </button>
          </div> */}
        </div>
      </div>
      <NewCompanyModal
        selectedColumnId={selectedColumnId}
        showC={showNewContactModal}
        onCloseC={() => setShowNewContactModal(false)}
        onSaveC={() => setShowNewContactModal(false)}
        initialData={selectedRowData}
        mode={selectedRowData ? "update" : "create"}
        screenType="company"
        typeFromParent={screenType}
      />
    </div>
  );
};

export default AddContactModal;