

import React, { useState, useEffect, useNavigate, useRef } from "react";
import './NewContactModal.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { AgGridReact } from 'ag-grid-react';


import SalespersonSearch from "./Sales/SalespersonSearch";
import { Navigate } from "react-router-dom";



const config = require('../Apiconfig');

const Theams = ({ showC, onCloseC, selectedColumnId }) => {
  const [Sales_Team, setSales_Team] = useState("");
  const [Team_Leader, setTeamLeader] = useState("");
  const [Email_alias, setEmailAlias] = useState("");
  const [Emails_From, setEmailsFrom] = useState("");
  const [Company_code, setCompany_code] = useState("");
  const [Created_by, setCreated_by] = useState("");
  const [loading, setLoading] = useState(false);
  const [ShowSalespersion, setShowSalespersion] = useState(false);
  const gridRef = useRef();
  const popupRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null); // track which item is expanded
  const [showmodal3, setshowmodal3] = useState(false);
  const [showAgGridPopup, setShowAgGridPopup] = useState(false);


  const [rowData, setRowData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const [salesDrop, setSalesDrop] = useState([]);
  const [selectedSalesCode, setSelectedSalesCode] = useState("");
  const [SalesCode, setSalesCode] = useState("");
  const [showModal2, setShowModal2] = useState(false);
  const [error, setError] = useState("");
  
  // const navigate = useNavigate();

  // const columnDefsSales = [

  //   //  { headerName: 'SalesCode', field: 'SalesCode' },
  //    {  headerCheckboxSelection: true,
  //       checkboxSelection: true,
  //       headerName: 'Name', field: 'SalesPersonName' },
  //     { headerName: 'Login', field: 'EmailID' },
  //     { headerName: 'Latest Authentication', field: 'Language' },
  //     { headerName: 'Role', field: 'Role' },
  //     { headerName: 'Status', field: 'status' },

  //   ];

  const columnDefsSales = [

    //  { headerName: 'SalesCode', field: 'SalesCode' },
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: 'SalesTeam', field: 'SalesPersonName'
    },
    { headerName: 'Alias', field: 'EmailID' },
    { headerName: 'Team leader', field: 'Language' },
    { headerName: 'Role', field: 'Role' },
    { headerName: 'Status', field: 'status' },

  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/GetSalespersonALL`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log("Fetched Data:", searchData);
        setRowData(searchData);
        toast.success("Data fetched successfully!");
      } else if (response.status === 404) {
        setRowData([]);
        toast.warning("No data found for this company");
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || "Failed to fetch sales data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    if (!selectedTags.includes(item)) {
      setSelectedTags([...selectedTags, item]);
    }
    setOpenDropdown(null); // close dropdown after selection
  };

  const handleSalesTeam = async (SelectedSalesCode) => {
    setSalesCode(SelectedSalesCode);
    setSelectedSalesCode(SelectedSalesCode ? SelectedSalesCode.value : '');
  };

  const filteredSalesTeam = Array.isArray(salesDrop)
    ? salesDrop.map((option) => ({
      value: option.SalesCode,
      label: `${option.SalesCode} - ${option.SalesPersonName}`,
    }))
    : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/GetSalesperson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSalesDrop(data); // Store the fetched gender options in state
        }
      })
      .catch((error) => {
        console.error('Error fetching gender data:', error);
      });
  }, []);
  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };
  // const handleAddSelected = () => {
  //   navigate("/SalespersonSearch")
  // }

  const fetchSalesTeamData = async () => {
    try {
      const res = await fetch("/api/GetSalesTeams");

      const data = await res.json();
      setRowData(data);
    } catch (err) {
      console.error("Error fetching Sales Teams:", err);
    }
  };

  const handleSave = async () => {

    if (
      !Sales_Team ||
      !Team_Leader ||
      !Email_alias ||
      !Emails_From
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_SalesTeam_HDRInsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Sales_ID: selectedSalesCode,
          Sales_Team,
          Team_Leader: selectedSalesCode,
          Email_alias,
          Emails_From,
          Company_code: sessionStorage.getItem("selectedCompanyCode"),
          Created_by: sessionStorage.getItem("selectedUserCode"),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Sales Team saved successfully!");

        // Reset form fields
        setSales_Team("");
        setTeamLeader("");
        setEmailAlias("");
        setEmailsFrom("");

        // Refresh list if function exists
        if (typeof fetchSalesTeamData === "function") {
          await fetchSalesTeamData();
        }
      } else {
        toast.warning(result.message || "Failed to save Sales Team!");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error(`Error inserting data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="modal d-block mt-5 popupadj popup"
      style={{ width: "100%", marginLeft: "10px", minWidth: "530px" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-2">
          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">Sales Team</h5>
              <button className="btn btn-danger" onClick={onCloseC}>
                <i className="bi bi-x-lg" ></i>
              </button>
            </div>
          </div>

          <div className="modal-body">
            <div className="col-md-9">
              {/* Sales Team + Save */}
              <div className="d-flex row mb-2">
                <div className="col-md-8">
                  <input
                    type="text"
                    placeholder="Sales Team"
                    value={Sales_Team}
                    onChange={(e) => setSales_Team(e.target.value)}
                    style={{
                      fontSize: "28px",
                      fontWeight: "600",
                      color: "#333",
                      border: "none",
                      borderBottom: "2px solid #ccc",
                      outline: "none",
                      width: "100%",
                      maxWidth: "400px",
                      padding: "4px 0",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderBottom = "2px solid #007bff")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottom = "2px solid #ccc")
                    }
                  />
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <button
                    className="btn btn-light"
                    onClick={handleSave}
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      borderRadius: "8px",
                      padding: "6px 20px",
                      marginLeft: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Team Leader */}
              <div className="d-flex row mb-2">
                <div className="col-md-12">
                  <label className="form-label d-flex justify-content-start">
                    Team Leader
                  </label>
                  <Select
                    type="email"
                    value={SalesCode}
                    onChange={handleSalesTeam}
                    options={filteredSalesTeam}
                    style={{
                      display: "block",
                      width: "100%",
                      border: "none",
                      borderBottom: "2px solid #ccc",
                      outline: "none",
                      padding: "6px 2px",
                      marginTop: "4px",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderBottom = "2px solid #007bff")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottom = "2px solid #ccc")
                    }
                  />
                </div>
              </div>

              {/* Email Alias */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{ fontWeight: "600", fontSize: "14px", color: "#555" }}
                  className="d-flex justify-content-start"
                >
                  Email Alias
                </label>
                <div className="d-flex justify-content-between gap-3">
                  <input
                    type="text"
                    placeholder="Alias"
                    value={Email_alias}
                    onChange={(e) => setEmailAlias(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      border: "none",
                      borderBottom: "2px solid #ccc",
                      outline: "none",
                      padding: "6px 2px",
                      marginTop: "4px",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderBottom = "2px solid #28a745")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottom = "2px solid #ccc")
                    }
                  />
                  <input
                    type="text"
                    placeholder="Enter Email"
                    style={{
                      display: "block",
                      width: "100%",
                      border: "none",
                      borderBottom: "2px solid #ccc",
                      outline: "none",
                      padding: "6px 2px",
                      marginTop: "4px",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderBottom = "2px solid #28a745")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottom = "2px solid #ccc")
                    }
                  />
                </div>
              </div>

              {/* Accept Emails From */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{ fontWeight: "600", fontSize: "14px", color: "#555" }}
                  className="d-flex justify-content-start"
                >
                  Accept Emails From
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    value={Emails_From}
                    onChange={(e) => setEmailsFrom(e.target.value)}
                    style={{
                      flex: 1,
                      border: "none",
                      borderBottom: "2px solid #ccc",
                      outline: "none",
                      padding: "6px 8px",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderBottom = "2px solid #17a2b8")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottom = "2px solid #ccc")
                    }
                  />
                </div>

                {/* Add Selected Button */}
                <div className="card h-100 p-4 rounded-0 d-flex justify-content-center align-items-center"
                // onClick={handleAddContacts}
                >

                  <span className="text-success" onClick={() => setShowAgGridPopup(true)}> Add Selected</span>




                </div>
              </div>
            </div>
          </div>

          {/* Popup Grid (only shows when Add Selected is clicked) */}
          {showAgGridPopup && (
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
                      <h5 className="modal-title">Search Salesperson</h5>
                      <button
                        className="btn btn-danger"
                        onClick={() => setShowAgGridPopup(false)}
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
                      <div className="col-md-7">
                        <div className="input-group">
                          {/* Input with tags */}
                          <div className="form-control d-flex flex-wrap align-items-center">
                            {selectedTags.map((tag, index) => (
                              <span
                                key={index}
                                className="badge bg-primary me-1 mb-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleRemove(tag)}
                              >
                                {tag} ✕
                              </span>
                            ))}
                            <input
                              type="text"
                              className="border-0 flex-grow-1"
                              placeholder="Search"
                              onFocus={() => setShowAgGridPopup(true)}
                              style={{ outline: "none" }}
                            />
                          </div>

                          {/* Search button */}
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleSearch}
                          >
                            <i className="bi bi-search"></i>
                          </button>

                          {/* Plus button */}
                          <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={() => setshowmodal3(true)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>




                  <div
                    className="ag-theme-alpine"
                    style={{ height: 400, width: "100%" }}
                  >
                    <AgGridReact
                      ref={gridRef}
                      rowData={rowData}
                      columnDefs={columnDefsSales}
                      pagination={true}
                      paginationPageSize={5}
                      defaultColDef={{
                        sortable: true,
                        filter: true,
                        resizable: true,
                      }}
                    />
                  </div>

                  <div className="modal-footer justify-content-end ms-3">
                    <button
                      className=""
                      onClick={() => {
                        // handle confirm action
                        setShowAgGridPopup(false);
                      }}
                    >
                      Add selected
                    </button>
                  </div>
                </div>
              </div></div>
          )}
          {showmodal3 && (

            <div
              className="modal d-block mt-5 popupadj Topnav-screen popup"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  {/* Header */}
                  <div className="modal-header">
                    <div className="d-flex justify-content-between w-100">
                      <h5 className="modal-title">Create Salesperson</h5>
                      <button
                        className="btn btn-danger"
                        onClick={() => setshowmodal3(false)}
                        aria-label="Close"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>

                  {/* Info Bar */}
                  <div
                    className="text-center"
                    style={{
                      backgroundColor: "#e6f4f9",
                      padding: "10px",
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    You are inviting a new user.
                  </div>

                  {/* Body */}
                  <div className="modal-body d-flex align-items-start" style={{ gap: "20px" }}>
                    {/* Avatar */}
                    <div>
                      <img
                        // src={comapny}
                        alt="User"
                        style={{ width: 120, height: 120 }}
                      />
                    </div>

                    {/* Form Fields */}
                    <div className="flex-grow-1">
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control border-0 border-bottom"
                          placeholder="e.g. John Doe"
                          style={{ boxShadow: "none" }}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="email"
                          className="form-control border-0 border-bottom"
                          placeholder="Email"
                          style={{ boxShadow: "none" }}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="tel"
                          className="form-control border-0 border-bottom"
                          placeholder="Phone"
                          style={{ boxShadow: "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="modal-footer">
                    <button className="" >
                      Save
                    </button>
                    <button className="">Discard</button>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>


    </div>

  );

}
{/* New Contact Modal */ }

{/* {showModal2 && (
          <SalespersonSearch
            showC={ShowSalespersion}
            onCloseC={() => setShowSalespersion(false)}
          />
        )} */}





export default Theams;