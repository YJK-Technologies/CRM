import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import NewCompanyModal from "./search_source_pop"
import CreateSourceModal from "./addSource"; // adjust path
import comapny from './company.png'
import { toast } from "react-toastify";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Select from "react-select";

const config = require('../../Apiconfig');

function Grid({ data, showCompany, onCompanyClose,  }) {
  const [activeStage, setActiveStage] = useState("New"); // current stage
  const [activeTab, setActiveTab] = useState("contacts"); // fix: added missing state
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const stages = ["New", "Qualified", "Proposition", "Won"];
    const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [condrop, setCondrop] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [country, setCountry] = useState('');
  const [showSourceModal, setshowSourceModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // track which item is expanded
  const popupRef = useRef(null);
  // const [rowData] = useState([]);
  const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
  const [showSalesModal, setshowSalesModal] = useState(false);
  const [showmodal3, setshowmodal3] = useState(false);
  


     const [Sales_Team, setSales_Team] = useState("");
  const [Team_Leader, setTeamLeader] = useState("");
  const [Email_alias, setEmailAlias] = useState("");
  const [Emails_From, setEmailsFrom] = useState("");
  const[Company_code,setCompany_code] = useState("");
  const[Created_by,setCreated_by] = useState("");
  const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [rowData, setRowData] = useState([]);

     const [salesDrop, setSalesDrop] = useState([]); 
  const [selectedSalesCode, setSelectedSalesCode] = useState("");
  const [SalesCode, setSalesCode] = useState(""); 
   const gridRef = useRef();

  const options2 = [
    "Search engine",
    "Lead Recall",
    "Newsletter",
    "Facebook",
    "X",
    "LinkedIn",
    "Monster",
    "Glassdoor",
  ];
  const options = [
    
  ];
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/crmlistpage");
  };

  const handleNavigate1 = () => {
    navigate("/CrmChart");
  };

  const handleNavigate3 = () => {
    navigate("/CrmScheduler");
  };

  const handleNavigate4 = () => {
    navigate("/CrmActivity");
  };

  const handleNavigate5 = () => {
    navigate("/CrmLocation");
  };

  const handleNavigateKanban = () => {
    navigate("/Crmworkspace");
  };


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
  // const columnDefsSales = [

   
  //   { headerName: 'Name', field: 'name' },
  //   { headerName: 'Login', field: 'name' },
  //   { headerName: 'Latest Authentication', field: 'name' },
  //   { headerName: 'Role', field: 'name' },
  //   { headerName: 'Status', field: 'name' },
    
  // ];

  const columnDefsSales = [

  //  { headerName: 'SalesCode', field: 'SalesCode' },
   {  headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: 'Name', field: 'SalesPersonName' },
    { headerName: 'Login', field: 'EmailID' },
    { headerName: 'Latest Authentication', field: 'Language' },
    { headerName: 'Role', field: 'Role' },
    { headerName: 'Status', field: 'status' },
    
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

const fetchSalesTeamData = async () => {
  try {
    const res = await fetch("/api/GetSalesTeams");
    
    const data = await res.json();
    setRowData(data);
  } catch (err) {
    console.error("Error fetching Sales Teams:", err);
  }
};

// Call this once on mount
useEffect(() => {
  fetchSalesTeamData();
}, []);

  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }
const handleSave = async () => {

  try {
    const response = await fetch(`${config.apiBaseUrl}/CRM_SalesTeam_HDRInsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Sales_ID: selectedSalesCode, 
        Sales_Team,
        Team_Leader:selectedSalesCode,
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

const filteredSalesTeam = Array.isArray(salesDrop)
    ? salesDrop.map((option) => ({
      value: option.SalesCode,
      label: `${option.SalesCode} - ${option.SalesPersonName}`,
    }))
    : [];
  //    const filteredSalesTeam = salesDrop.map((option) => ({
  //   value: option.SalesCode,
  //   label: `${option.SalesCode} - ${option.SalesPersonName}`,
  // }));

  //  const filteredSalesTeam = Array.isArray(salesDrop)
  //   ? salesDrop.map((option) => ({
  //     value: option.SalesCode,
  //     label: option.SalesCode,
  //   }))
  //   : [];

//   useEffect(() => {
//   const fetchSalespersons = async () => {
//     try {
//       const response = await fetch(`${config.apiBaseUrl}/GetSalesperson`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSalesDrop(data); 
        
//         if (data.length > 0) {
//           const defaultOption = { 
//             value: data[0].SalesCode, 
//             label: `${data[0].SalesCode} - ${data[0].SalesPersonName}` 
//           };
//           setSelectedSalesCode(defaultOption);
//           setSalesCode(defaultOption.value);
//         }
//       } else {
//         setSalesDrop([]);
//         setSalesCode("");
//       }
//     } catch (err) {
//       console.error("Error fetching salespersons:", err);
//     }
//   };

//   fetchSalespersons();
// }, [Company_code]);



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


 const handleSalesTeam = async (SelectedSalesCode) => {
    setSalesCode(SelectedSalesCode);
    setSelectedSalesCode(SelectedSalesCode ? SelectedSalesCode.value : '');
  };

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


  return (
    <div className="container-fluid Topnav-screen p-3">


        <div className="shadow-lg p-0 mb-2 bg-white rounded">
          <div className="d-flex justify-content-between flex-wrap p-1">
            <div className="d-flex justify-content-start">
              <h1 className="">CRM Workspace</h1>
            </div>
            <div className="d-flex justify-content-end">
              <addbutton className="mt-2 " onClick={handleNavigateKanban}>
                <i class="bi bi-kanban text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate}>
                <i class="bi bi-card-list text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate3}>
                <i class="bi bi-calendar3 text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate1}>
                <i class="bi bi-bar-chart-fill text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate4}>
                <i class="bi bi-stopwatch text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate5}>
                <i class="bi bi-geo-alt-fill text-dark fs-4"></i>
              </addbutton>
            </div>
          </div>
        </div>
      {/* Header */}
      {/* <div className="d-flex justify-content-between align-items-center mb-2 shadow-lg bg-white rounded-3 p-3">
       
        <ul className="nav nav-pills" style={{ gap: "10px" }}>
          {stages.map((stage, index) => (
            <li className="nav-item" key={index}>
              <button
                className="nav-link"
                style={{
                  backgroundColor:
                    activeStage === stage ? "#4CAF50" : "#f1f1f1",
                  color: activeStage === stage ? "#fff" : "#555",
                  borderRadius: "20px",
                  padding: "6px 18px",
                  fontWeight: activeStage === stage ? "600" : "400",
                  border: "1px solid #ddd",
                  boxShadow:
                    activeStage === stage
                      ? "0 2px 6px rgba(0,0,0,0.2)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
                onClick={() => setActiveStage(stage)}
              >
                {stage}
              </button>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Main Content */}
      <div className="row">
        {/* Left Panel */}
        <div className="col-md-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              {/* Title & Revenue */}
              <div className="d-flex justify-content-between align-items-start">
                <div
                  style={{
                    marginBottom: "50px",
                    borderRadius: "10px",
                    background: "#fff",
                  }}
                >
                  {/* Title Input */}
                  <div className="d-flex align-items-center" style={{ gap: "10px" }}>
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

                  {/* Info Row */}
                <button
    className="btn btn-light"
      onClick={handleSave}
    style={{
      fontWeight: "600",
      fontSize: "14px",
      borderRadius: "8px",
      padding: "6px 20px",
      marginLeft:"300px",
      whiteSpace: "nowrap", 
    }}
     
  >
    Save
  </button>
                </div>

               
              </div>
              </div>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
   
    
  }}
>
  {/* Left side */}
  <div style={{ flex: 1 }}>


    <h4 style={{ fontWeight: "700", fontSize: "20px", color: "#555", marginBottom: "20px"  }}  className="d-flex justify-content-start ms-0 mb-2">Team Details</h4>
    <div style={{ marginBottom: "20px" }}>

      <label style={{ fontWeight: "600", fontSize: "14px", color: "#555" }} className="d-flex justify-content-start">
        Team Leader
      </label>
      <Select
        type="email"
         value ={SalesCode}
          
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
        onFocus={(e) => (e.target.style.borderBottom = "2px solid #007bff")}
        onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
      />
    </div>

    <div style={{ marginBottom: "20px" }}>
      <label style={{ fontWeight: "600", fontSize: "14px", color: "#555" }} className="d-flex justify-content-start">
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
        onFocus={(e) => (e.target.style.borderBottom = "2px solid #28a745")}
        onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
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
        onFocus={(e) => (e.target.style.borderBottom = "2px solid #28a745")}
        onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
      /></div>
    </div>
     <div style={{ marginBottom: "20px" }}>
      <label style={{ fontWeight: "600", fontSize: "14px", color: "#555" }} className="d-flex justify-content-start">
        Accept Emails From
      </label>
      <div style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}>
  <input
    type="text"
    value={Emails_From}
      onChange={(e) =>setEmailsFrom(e.target.value)}
    on
    style={{
      flex: 1,
      border: "none",
      borderBottom: "2px solid #ccc",
      outline: "none",
      padding: "6px 8px",
      fontSize: "14px",
      transition: "border-color 0.2s ease",
    }}
    onFocus={(e) => (e.target.style.borderBottom = "2px solid #17a2b8")}
    onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
  />

 
</div>

    </div>
  </div>

  
  <div style={{ flex: 1 ,marginTop:"30px"}}>
    

 
    
  {showSalesModal && (
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
  onClick={()=> setshowSalesModal(false)}
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
                
                onFocus={() => setShowPopup(true)}
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
                   onClick={handleSearch}  
                >
              <i class="bi bi-search"></i>
            </button>
               </div>
                <div className='col-md-1 mt-1'>
               <button
                  className=""
                  type="button"
                    onClick={() => setshowmodal3(true)}
                >
                <i class="bi bi-plus"></i></button>
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
              </div>
    
              {/* Footer */}
              <div className="modal-footer justify-content-end ms-3">
                <button className="" 
                // onClick={handleAddSelected}
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
    
          {/* New Contact Modal */}
         
        </div>
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
              src={comapny}
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

             

               <div style={{ display: "flex", borderBottom: "1px solid #eeeeeeff" }}>
              <button
                onClick={() => setActiveTab("contacts")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 16px",
                  marginRight: "0px",
                  fontSize: "14px",
                  borderRadius:"0",
                  cursor: "pointer",
                  color: activeTab === "contacts" ? "#000" : "#444",
                  fontWeight: activeTab === "contacts" ? "700" : "500",
                  borderTop: activeTab === "contacts" ? "2px solid #5c2c6d" : "0px solid transparent",
                  borderBottom: activeTab === "contacts" ? "2px solid #ffffffff" : "2px solid transparent",
                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease-in-out"
                }}
              >
                Contacts
              </button>

              

             


            </div>

              {/* Tab Content */}
              <div className="mt-3">
                {activeTab === "notes" && (
                  <div>
                    <h6 className="fw-bold">Notes</h6>
                    <textarea
                      placeholder="Add your notes here..."
                      style={{
                        width: "100%",
                        minHeight: "120px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        padding: "10px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                {activeTab === "contacts" && (
                  <div className="row">
                    {/* Company Information */}
                    <div className="col-md-6">
                      
                      <div className="col">
                      <div className="card h-100 p-4 rounded-0 d-flex justify-content-center align-items-center" style={{cursor:'pointer'}} onClick={() => setshowSalesModal(true)}>
                        <span className="text-success">Add Salesperson</span>
                      </div>
                    </div>
                      
                    </div>

                 
                    

                    {/* Marketing */}
                    <div className="col-md-6">
                      
                     

                      
                       

                     

  {showModal && (
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
                    onClick={() => setShowModal(false)}
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
                <div className='col-md-1 mt-1'>
               <button
                  className=""
                  type="button"
                    onClick={() => setShowModal2(true)}
                >
                <i class="bi bi-plus"></i>            </button>
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
              )}


                       
                    </div>

                   
                      {/* Ownership */}
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Activity Panel */}
        <div className="col-md-4 ">
          <div className="card shadow-sm" style={{height:"82%"}}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Activity</span>
              <div>
                <button className="btn btn-sm btn-outline-secondary">
                  Log Note
                </button>
              </div>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "1000px", overflowY: "auto" }}
            >
              <div className="mb-2">
                <small className="text-muted">23 Jun 2025</small>
                <p className="mb-1">
                  <strong>VJK Balaji</strong> - Stage changed from{" "}
                  <em>Qualified → New</em>
                </p>
              </div>
              <div className="mb-2">
                <small className="text-muted">9 Jun 2025</small>
                <p className="mb-1">
                  <strong>Opportunity created by Odoo Lead Generation</strong>
                </p>
              </div>
              <hr />
              <p className="mb-0">
                <strong>Villgro</strong> funds and incubates early-stage,
                innovation-based, for-profit social enterprises...
              </p>
            </div>
          </div>
        </div>
      </div>
       {/* New Contact Modal */}
       {showModal2 && (
        <CreateSourceModal
          showC={showModal2}
          onCloseC={() => setShowModal2(false)}
          
        />
      )}
    </div>
  );
}

export default Grid;
