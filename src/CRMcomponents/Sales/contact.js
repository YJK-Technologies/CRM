import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import NewContactModal from './TypesofContacts2'; // Correct component here
import NewCompanyModal from './addCompany.js';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FaEdit, FaTrash } from "react-icons/fa";
import { showConfirmationToast } from '../../ToastConfirmation';
const config = require('../../Apiconfig');

const AddContactModal = ({ show, showCompany, onClose, showContact, onSaveCompany, selectedColumnId, onContactClose, showC, onCloseC, onSaveC }) => {
  const [condrop, setCondrop] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [country, setCountry] = useState('');
  const [rowData, setRowData] = useState("");
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // track which item is expanded
  const popupRef = useRef(null);
  const gridRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
   const [screenType, setScreenType] = useState("");
  const typeToSend = showCompany ? "company" : "person";



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
    "Contact Name",
    "Email",
    "Phone No",
    "Address",
    "Country",
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

  const handleDeleteRow = (rowData) => {
    if (window.confirm(`Are you sure you want to delete contact ${rowData.ContactID}?`)) {
      console.log("Delete confirmed for:", rowData);
      // Call API or delete logic here
    }
  };



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowPopup(true);
  };
  // const [rowData] = useState([
  //   { name: 'John Doe', email: 'john@example.com', phone: '+1 123 456 7890', activities: 5, country: 'USA' },
  //   { name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543210', activities: 3, country: 'India' },
  // ]);
  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };
  const handleSelect = (item) => {
    if (!selectedTags.includes(item)) {
      setSelectedTags([...selectedTags, item]);
    }
    setOpenDropdown(null); // close dropdown after selection
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
          handleDeleteRow(params.data);
        };
        const handleEditRow = (rowData) => {
          setSelectedRowData(rowData);
          setShowNewContactModal(true);
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
    {
      headerName: 'Contact Id',
      field: 'Contact_ID',
    },
    { headerName: 'Contact Name', field: 'Name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Phone No', field: 'contact_no' },
    { headerName: 'Aadhar', field: 'Aadhar' },
    { headerName: 'Address', field: 'Address' },
    { headerName: 'Pan No', field: 'Pan' },
    { headerName: 'Country', field: 'Country' },
  ];

  const handleSearch = async () => {
    try {
      const payload = {};
      const companyCode = sessionStorage.getItem("selectedCompanyCode");

      if (companyCode) {
        payload.company_code = companyCode;
      }

    selectedTags.forEach(tag => {
  const match = tag.match(/Search\s(.+?)\sfor:\s(.+)/i);

  if (match) {
    const field = match[1].trim();
    const value = match[2].trim();

    switch (field) {
      case "Email":
        payload.email = value;
        break;
      case "Company or Person":
        payload.type_of_contact = value;
        break;
      case "Company Name":
        payload.company_name = value;
        break;
      case "Contact Name":
        payload.Name = value;
        break;
      case "Phone No":
        payload.contact_no = value;
        break;
      case "Country":
        payload.Country = value;
        break;
      case "Status":
        payload.status = value;
        break;
      case "Address":
        payload.Address = value;
        break;
      default:
        console.log("Unknown filter:", field);
    }
  }
});

      const response = await fetch(`${config.apiBaseUrl}/ContactSearch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const searchData = await response.json();
        setSearchResults(searchData);
      } else if (response.status === 404) {
        setSearchResults([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || "Failed to fetch sales data");
      }
    } catch (error) {
      toast.error("Error fetching data: " + error.message);
    }
  };


  const handleRowClick = (params) => {
    const selectedCompanyID = params.data.Contact_ID;
    const selectedCompanyName = params.data.Name;
    const sourceType = params.data.sourceType;

    if (onSaveCompany) {
      onSaveCompany(selectedCompanyID, selectedCompanyName, sourceType);
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCondrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : '');
  };

  if (!showContact) return null;

  const handleOpenNewContactModal = () => setShowNewContactModal(true);
  const handleSaveNewContact = () => {
    // Save logic here
    setShowNewContactModal(false);
  };

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
              <h5 className="modal-title">Search Contact</h5>
              <button className="btn btn-danger" title='Close' onClick={onClose} aria-label="Close">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Body */}
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
                  <span className="input-group-text bg-white border-end-1" onClick={handleSearch} style={{ cursor: "pointer" }}>
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
                        </div> */}
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
              <div className='col-md-1 mt-1'>
                <button
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                  type="button"
                  title='Add'
                  onClick={() => { setSelectedRowData(null); setShowNewContactModal(true) }}
                  aria-label="Add New"
                  style={{ width: '30px', height: '30px' }}
                >
                  <i className="bi bi-plus text-center" style={{ fontSize: '26px' }}></i>
                </button>
              </div>
            </div>

            {/* Footer */}
            {/* <div className="modal-footer justify-content-end ms-3">
            <button  className="" onClick={handleSaveNewContact}>
              Add Selected
            </button>
          </div> */}


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
        </div>
      </div>
      {/* Correct Modal */}
      {/* <NewContactModal
        showC={showNewContactModal}
        onCloseC={() => setShowNewContactModal(false)}
        onSaveC={handleSaveNewContact}
      /> */}
      <NewCompanyModal
        selectedColumnId={selectedColumnId}
        showC={showNewContactModal}
        onCloseC={() => setShowNewContactModal(false)}
        onSaveC={() => setShowNewContactModal(false)}
        initialData={selectedRowData}
        mode={selectedRowData ? "update" : "create"}
        screenType="person"
      />
    </div>
  );
};

export default AddContactModal;
