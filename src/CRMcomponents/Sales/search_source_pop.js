import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import NewSourceModal from './addSource.js';
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown'; // Bootstrap dropdown
import Form from 'react-bootstrap/Form';         // Bootstrap checkbox
const config = require('../../Apiconfig');

const AddContactModal = ({ showCompany, onCompanyClose }) => {
  const gridRef = useRef();

  const [condrop, setCondrop] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [country, setCountry] = useState('');
  const [showSourceModal, setshowSourceModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // track which item is expanded
  const popupRef = useRef(null);
  const [rowData] = useState([]);
 // Close popup if clicked outside
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

  // Handle tag selection
  const handleSelect = (item) => {
    if (!selectedTags.includes(item)) {
      setSelectedTags([...selectedTags, item]);
    }
    setOpenDropdown(null); // close dropdown after selection
  };

  // Handle tag removal
  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };
  const columnDefs = [
    { headerName: 'Source', field: 'name' },
    
  ];
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // track visibility states
  const [columnVisibility, setColumnVisibility] = useState(
    columnDefs.reduce((acc, col) => {
      acc[col.field] = true;
      return acc;
    }, {})
  );

  // fetch countries
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  // toggle column visibility
  const handleToggleColumn = (field) => {
    const newVisibility = !columnVisibility[field];
    setColumnVisibility({ ...columnVisibility, [field]: newVisibility });
    gridRef.current.api.setColumnVisible(field, newVisibility);
  };

  if (!showCompany) return null;


  // Close popup if clicked outside

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
              <h5 className="modal-title">Search Source</h5>
              <button
                className="btn btn-danger"
                onClick={onCompanyClose}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Search Filters */}
            <div className="row mb-3 d-flex justify-content-center">
           <div className="col-md-5 position-relative">
      <div className="input-group flex-wrap">
        {/* Render selected tags inside input */}
        <div className="d-flex flex-wrap align-items-center p-1 border rounded w-100">
          {selectedTags.map((tag, index) => (
            <span
              key={index}
              className="badge bg-primary me-1 mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => handleRemove(tag)}
            >
              {tag} ?
            </span>
          ))}
          <input
            type="text"
            className="form-control border-0"
            placeholder="Search"
            
            // onFocus={() => setShowPopup(true)}
          />
        </div>
       
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
          <div className="d-flex">
            {/* Filters */}
            <div className="flex-fill border-end pe-3">
              <h6 className="fw-bold mb-3">Filters</h6>
              <ul className="list-unstyled">
                {["My Pipeline", "Active", "Inactive", "Won", "Lost"].map(
                  (item) => (
                    <li
                      key={item}
                      className={`p-1 ${
                        selectedTags.includes(item) ? "bg-light fw-bold" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
              <ul className="list-unstyled mt-3">
                {["Created On", "Expected Closing", "Date Closed"].map(
                  (item) => (
                    <li
                      key={item}
                      className="p-1"
                      style={{ cursor: "pointer", position: "relative" }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === item ? null : item)
                      }
                    >
                      {item} ?
                      {/* Nested dropdown */}
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
                  )
                )}
              </ul>
              <ul className="list-unstyled mt-3">
                <li>Archived</li>
                <li className="text-primary">+ Add Custom Filter</li>
              </ul>
            </div>

            {/* Group By */}
            <div className="flex-fill border-end px-3">
              <h6 className="fw-bold mb-3">Group By</h6>
              <ul className="list-unstyled">
                {[
                  "Salesperson",
                  "Sales Team",
                  "City",
                  "Country",
                  "Stage",
                  "Campaign",
                  "Medium",
                  "Source",
                ].map((item) => (
                  <li
                    key={item}
                    className={`p-1 ${
                      selectedTags.includes(item) ? "bg-light fw-bold" : ""
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
              <h6 className="fw-bold mb-3">? Favorites</h6>
              <ul className="list-unstyled">
                {["Save current search"].map((item) => (
                  <li
                    key={item}
                    className={`p-1 ${
                      selectedTags.includes(item) ? "bg-light fw-bold" : ""
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
        </div>
      )}
    </div>
    <div className='col-md-1 mt-1'>
           <button
              className=""
              type="button"
             
            >
          <i class="bi bi-search"></i>
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
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={5}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer justify-content-end ms-3">
            <button className="">
              Add Selected
            </button>
          </div>
        </div>
      </div>

      {/* New Contact Modal */}
     
    </div>
  );
};

export default AddContactModal;
