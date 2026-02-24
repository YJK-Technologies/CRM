import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select'

const config = require('../Apiconfig');

function Input({ }) {
  const [House_rent_Allowance, setHouse_rent_Allowance] = useState("");
  const [Medical_allowance, setMedical_allowance] = useState("");
  const [Overtime_allowance, setOvertime_allowance] = useState("");
  const [Conveyance_allowance, setConveyance_allowance] = useState("");
  const [Mobile_reimbursement, setMobile_reimbursement] = useState("");
  const [Meal_allowance, setMeal_allowance] = useState("");
  const [Education_Allowance, setEducation_Allowance] = useState("");
  const [company_code, setcompany_code] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [email_id, setEmail_id] = useState("");
  const [status, setStatus] = useState("");
  const [foundedDate, setFoundedDate] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [location_no, setlocation_no] = useState("");
  const [annualreportURL, setAnnualReportURL] = useState("");
  const [error, setError] = useState("");
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [locationnodrop, setLocationdrop] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setselectedState] = useState('');
  const [selectedCountry, setselectedCountry] = useState('');
  const [selectedStatus, setselectedStatus] = useState('');
  const [selectedLocation, setselectedLocation] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [EmployeeId, setEmployeeId] = useState("");
  const [open3, setOpen3] = React.useState(false);
  const navigate = useNavigate();

  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [companyImage, setCompanyImage] = useState("");
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [Start_Year, setStart_Year] = useState('');
  const [End_Year, setEnd_Year] = useState('');
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const [rowData, setRowData] = useState([]);
  const [startyear, setstartyear] = useState(" ");
  const [Endyear, setEndyear] = useState("");
  const [House, setHouse] = useState("");
  const [Education, setEducation] = useState("");
  const [Meal, setMeal] = useState([]);
  const [Mobile, setMobile] = useState([]);
  const [Conveyance, setConveyance] = useState([]);
  const [Overtime, setOvertime] = useState([]);
  const [Medical, setMedical] = useState([]);
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);


  const modified_by = sessionStorage.getItem("selectedUserCode");

  // const clearInputFields = () => {
  //   setCompany_no("");
  //   setCompany_name("");
  //   setShort_name("");
  //   setAddress1("");
  //   setAddress2("");
  //   setAddress3("");
  //   setSelectedCity(null);
  //   setselectedState(null);
  //   setselectedCountry(null);
  //   setselectedStatus(null);
  //   setselectedLocation(null);
  //   setPincode("");
  //   setEmail_id("");
  //   setFoundedDate("");
  //   setWebsiteURL("");
  //   setContact_no("");
  //   setAnnualReportURL("");
  //   setSelectedImage("")
  // };

  console.log(selectedRow)

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // useEffect(() => {
  //   if (mode === "update" && selectedRow && !isUpdated) {
  //     setCompany_no(selectedRow.company_no || "");
  //     setCompany_name(selectedRow.company_name || "");
  //     setShort_name(selectedRow.short_name || "");
  //     setAddress1(selectedRow.address1 || "");
  //     setAddress2(selectedRow.address2 || "");
  //     setAddress3(selectedRow.address3 || "");
  //     setSelectedCity({
  //       label: selectedRow.city,
  //       value: selectedRow.city,
  //     });
  //     setselectedState({
  //       label: selectedRow.state,
  //       value: selectedRow.state,
  //     });
  //     setselectedCountry({
  //       label: selectedRow.country,
  //       value: selectedRow.country,
  //     });
  //     setselectedStatus({
  //       label: selectedRow.status,
  //       value: selectedRow.status,
  //     });
  //     setselectedLocation({
  //       label: selectedRow.location_no,
  //       value: selectedRow.location_no,
  //     });
  //     setPincode(selectedRow.pincode || "");
  //     setEmail_id(selectedRow.email_id || "");
  //     setWebsiteURL(selectedRow.websiteURL || "");
  //     setContact_no(selectedRow.contact_no || "");
  //     setAnnualReportURL(selectedRow.annualReportURL || "");

  //     if (selectedRow.foundedDate) {
  //       const formattedDate = new Date(selectedRow.foundedDate).toISOString().split("T")[0];
  //       setFoundedDate(formattedDate);
  //     } else {
  //       setFoundedDate("");
  //     }

  //     if (selectedRow.company_logo && selectedRow.company_logo.data) {
  //       const base64Image = arrayBufferToBase64(selectedRow.company_logo.data);
  //       const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'company_logo.jpg');
  //       setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
  //       setCompanyImage(file)
  //     } else {
  //       setSelectedImage(null); // No image found, reset
  //     }

  //   } else if (mode === "create") {
  //     clearInputFields();
  //   }
  // }, [mode, selectedRow, isUpdated]);


  // const base64ToFile = (base64Data, fileName) => {
  //   if (!base64Data || !base64Data.startsWith("data:")) {
  //     throw new Error("Invalid base64 string");
  //   }

  //   const parts = base64Data.split(',');
  //   if (parts.length !== 2) {
  //     throw new Error("Base64 string is not properly formatted");
  //   }

  //   const mimePart = parts[0];
  //   const dataPart = parts[1];

  //   const mime = mimePart.match(/:(.*?);/);
  //   if (!mime || !mime[1]) {
  //     throw new Error("Could not extract MIME type");
  //   }

  //   const binaryString = atob(dataPart);
  //   const len = binaryString.length;
  //   const uint8Array = new Uint8Array(len);

  //   for (let i = 0; i < len; i++) {
  //     uint8Array[i] = binaryString.charCodeAt(i);
  //   }

  //   const fileBlob = new Blob([uint8Array], { type: mime[1] });
  //   return new File([fileBlob], fileName, { type: mime[1] });
  // };

  const Employeecol = [
    // { headerName: "EmployeeId", field: "EmployeeId", sortable: true,  minWidth:50, maxWidth:50, cellStyle: { textAlign: "left" }},

    {
      headerName: "Actions",
      field: "action",
      minWidth: 120,
      maxWidth: 130,
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => handleUpdate(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>
                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Start Year",
      field: "Start_Year",
      filter: 'agTextColumnFilter',
      minWidth: 120,
      maxWidth: 130,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "End Year",
      field: "End_year",
      filter: 'agTextColumnFilter',
      sortable: true,
      textAlign: "center",
      filter: true,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "House Rent Allowance",
      field: "House_rent_Allowance",
      filter: 'agTextColumnFilter',
      sortable: true,
      filter: true,
      editable: true,

      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Medical Allowance",
      field: "Medical_allowance",
      filter: 'agTextColumnFilter',
      sortable: true,
      filter: true,
      cellStyle: { textAlign: "left" },
      editable: true,
    },
    {
      headerName: "Overtime Reimbursement",
      field: "Overtime_allowance",
      sortable: true,
      filter: 'agTextColumnFilter',
      filter: true,
      cellStyle: { textAlign: "left" },
      editable: true
    },
    {
      headerName: "Conveyance Allowance",
      field: "Conveyance_allowance",
      sortable: true,
      filter: 'agTextColumnFilter',
      filter: true,
      cellStyle: { textAlign: "left" },
      editable: true
    },
    {
      headerName: "Mobile Reimbursement",
      field: "Mobile_reimbursement",
      sortable: true,
      filter: 'agTextColumnFilter',
      filter: true,
      cellStyle: { textAlign: "left" },
      editable: true
    },
    {
      headerName: " Meal Allowance",
      field: "Meal_allowance",
      sortable: true,
      filter: 'agTextColumnFilter',
      filter: true,
      cellStyle: { textAlign: "left" },
      editable: true
    },
    {
      headerName: "Education Allowance",
      field: "Education_Allowance",
      sortable: true,
      filter: 'agTextColumnFilter',
      filter: true,
      cellStyle: { textAlign: "left" },
      editable: true
    },


    { headerName: "Keyfield", field: "keyfield", hide: false, editable: true },
  ]



  useEffect(() => {
    fetch(`${config.apiBaseUrl}/city`)
      .then((data) => data.json())
      .then((val) => setDrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/country`)
      .then((data) => data.json())
      .then((values) => setCondrop(values));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/state`)
      .then((data) => data.json())
      .then((val) => setStatedrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((data) => data.json())
      .then((val) => setLocationdrop(val));
  }, []);

  const filteredOptionCity = drop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionState = statedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionLocation = locationnodrop.map((option) => ({
    value: option.location_no,
    label: `${option.location_no} - ${option.location_name}`,
  }));

  // const handleChangeCity = (selectedCity) => {
  //   setSelectedCity(selectedCity);
  //   setCity(selectedCity ? selectedCity.value : '');
  //   setError(false);
  // };

  // const handleChangeState = (selectedState) => {
  //   setselectedState(selectedState);
  //   setState(selectedState ? selectedState.value : '');
  //   setError(false);
  // };

  // const handleChangeCountry = (selectedCountry) => {
  //   setselectedCountry(selectedCountry);
  //   setCountry(selectedCountry ? selectedCountry.value : '');
  //   setError(false);
  // };

  // const handleChangeStatus = (selectedStatus) => {
  //   setselectedStatus(selectedStatus);
  //   setStatus(selectedStatus ? selectedStatus.value : '');
  //   setError(false);
  // };

  // const handleChangeLocation = (selectedLocation) => {
  //   setselectedLocation(selectedLocation);
  //   setlocation_no(selectedLocation ? selectedLocation.value : '');
  //   setError(false);
  // };

  const handleInsert = async () => {
    if (
      !Medical_allowance ||
      !House_rent_Allowance ||
      !Start_Year ||
      !End_Year ||
      !Overtime_allowance
    ) {
      setError(" ");
        toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/addOtherAllowence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Start_Year,
          End_Year,
          House_rent_Allowance,
          Medical_allowance,
          Overtime_allowance,
          Conveyance_allowance,
          Mobile_reimbursement,
          Meal_allowance,
          Education_Allowance,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });

      if (response.status === 200) {
        console.log("Data Inserted successfully");
        setTimeout(() => {
          toast.success("Data Inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        //setError(errorResponse.error);
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        toast.error('Failed to insert data', {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert
      toast.error('Error inserting data: ' + error.message, {

      });
    }
  };
  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/Company");
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      if (hasValueChanged) {
        await handleKeyDownStatus(e);
        setHasValueChanged(false);
      }

      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false);
    }
  };


  const handleUpdate = async (rowData) => {

    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const modified_by = sessionStorage.getItem('selectedUserCode');

      const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

      const response = await fetch(`${config.apiBaseUrl}/updateOtherAllowence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code,
          "modified-by": modified_by
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => handleSearch(), // Runs handleSearch when toast closes
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
    }
  };


  const NavigatecomDet = () => {
    navigate("/CompanyDetails");
  };


  const FinanceDet = () => {
    navigate("/FinanceDet");
  };
  const BankAccDet = () => {
    navigate("/BankAccDet");
  };
  const IdentDoc = () => {
    navigate("/IdentDoc");
  };

  const AcademicDet = () => {
    navigate("/AcademicDet");
  };

  const Documents = () => {
    navigate("/Documents");
  };

  const Insurance1 = () => {
    navigate("/Family");
  };

  const handlePaySlip = () => {
    setOpen3(true);
  };
  const reloadGridData = () => {
    window.location.reload();
  };
  const handleDelete = async (rowData) => {
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');

      const dataToSend = { deletedData: Array.isArray(rowData) ? rowData : [rowData] };

      const response = await fetch(`${config.apiBaseUrl}/deleteOtherAllowence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code,
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        toast.success("Data deleted successfully", {
          onClose: () => handleSearch(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to Delete data");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
    }
  };


  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = async () => {
    try {
      const body = {
        startyear,
        Endyear,
        House,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/OtherAllowanceSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          Start_Year: formatDate(matchedItem.Start_Year),
          End_year: formatDate(matchedItem.End_year),
          Conveyance_allowance: matchedItem.Conveyance_allowance,
          Education_Allowance: matchedItem.Education_Allowance,
          House_rent_Allowance: matchedItem.House_rent_Allowance,
          Meal_allowance: matchedItem.Meal_allowance,
          Medical_allowance: matchedItem.Medical_allowance,
          Mobile_reimbursement: matchedItem.Mobile_reimbursement,
          Overtime_allowance: matchedItem.Overtime_allowance,
          keyfield: matchedItem.keyfield,
        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  }

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">Employee Other Allowance</h1>
            </div>
          </div>

          <div className="shadow-lg  bg-light rounded-top mt-2  pt-3">
            <button className=" p-2 ms-2 shadow-sm addTab" > Allowance Details</button>
          </div>
          <div class=" mb-4">
            <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
              <div class="row">

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">
                          Start Year
                        </label> </div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the From Date"
                      value={Start_Year}
                      onChange={(e) => setStart_Year(e.target.value)}

                    />
                   
                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">
                          End Year
                        </label> </div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the From Date"
                      value={End_Year}
                      onChange={(e) => setEnd_Year(e.target.value)}

                    />
                   
                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !House_rent_Allowance ? 'red' : ''}`}>
                          House Rent Allowance<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required
                      title="Please enter the founded date"
                      value={House_rent_Allowance}
                      maxLength={18}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setHouse_rent_Allowance(value);
                      }}
                    />
                  </div>

                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" className={`${error && !Medical_allowance ? 'red' : ''}`}>
                        Medical Allowance<span className="text-danger">*</span>
                      </label></div>
                     
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the founded date"
                      value={Medical_allowance}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setMedical_allowance(value);
                      }}

                    />
                   
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" className={`${error && !Overtime_allowance ? 'red' : ''}`}>
                        Overtime Allowance<span className="text-danger">*</span>
                      </label></div>
                     
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the address"
                      value={Overtime_allowance}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setOvertime_allowance(value);
                      }}
                      maxLength={250}


                    />
                 
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add2" className={`${error && !Conveyance_allowance ? 'red' : ''}`}>
                        Conveyance Allowance<span className="text-danger">*</span>
                      </label> </div>
                     
                    </div>
                    <input
                      id="add2"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the address"
                      value={Conveyance_allowance}
                      maxLength={250}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setConveyance_allowance(value);
                      }}
                    />
                   
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <label for="add3" className={`${error && !Mobile_reimbursement ? 'red' : ''}`}>
                        Mobile Reimbursement<span className="text-danger">*</span>
                      </label>
                   
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the address"
                      value={Mobile_reimbursement}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setMobile_reimbursement(value);
                      }}
                      maxLength={250}

                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label For="city" className={`${error && !Meal_allowance ? 'red' : ''}`}>Meal Allowance<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the address"
                      value={Meal_allowance}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setMeal_allowance(value);
                      }}
                      maxLength={250}

                    />
                  
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label For="city" className={`${error && !Education_Allowance ? 'red' : ''}`}>Education Allowance<span className="text-danger">*</span></label>
                      </div>
                     
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the address"
                      value={Education_Allowance}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setEducation_Allowance(value);
                      }}
                      maxLength={250}
                    />
                  </div>
                </div>

                <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                  <button onClick={handleInsert} className="" title="Save">
                    Save
                  </button>
                </div>
              </div>

              <hr className="mt-2"></hr>
              <h5 className="ms-4 mt-2">Search Criteria:</h5>
              <div className="row ms-3 me-3">
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">
                      Start Year
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"
                      placeholder="Employee Salary From"
                      value={startyear}
                      onChange={(e) => setstartyear(Number(e.target.value))}
                      type="Date"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">
                      End year
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"
                      type="date"
                      value={Endyear}
                      onChange={(e) => setEndyear(Number(e.target.value))}
                      placeholder="Employee Salary To"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">
                      House Rent Allowance
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"

                      value={House}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setHouse(Number(value)); // Convert the sliced value to a number
                      }}
                      type="number"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">
                      Medical Allowance
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"

                      value={Medical}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setMedical(Number(value)); // Convert the sliced value to a number
                      }}
                      type="number"
                      
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">
                      Overtime Allowance
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"

                      value={Overtime}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setOvertime(Number(value)); // Convert the sliced value to a number
                      }}
                      type="number"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">
                      Conveyance Allowance
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"

                      value={Conveyance}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setConveyance(Number(value)); // Convert the sliced value to a number
                      }}
                      type="number"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">

                      Mobile Reimbursement
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"

                      value={Mobile}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setMobile(Number(value)); // Convert the sliced value to a number
                      }}
                      type="number"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">

                      Meal Allowance
                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"

                      value={Meal}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setMeal(Number(value)); // Convert the sliced value to a number
                      }}
                      type="number"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div className="exp-form-floating">
                    <div> <label for="add1" class="exp-form-labels">
                      Education Allowance

                    </label></div>
                    <input id="status"
                      className="exp-input-field form-control"

                      value={Education}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 18); // Limit to 18 characters
                        setEducation(Number(value)); // Convert the sliced value to a number
                      }}
                      
                      type="number"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mt-4">
                  <div class="exp-form-floating">
                    <div class=" d-flex  justify-content-center">

                      <div class=''><icon className="popups-btn fs-6 p-3" onClick={handleSearch} required title="Search"><i className="fas fa-search"></i></icon></div>
                      <div><icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Refresh"><FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" /></icon></div>
                    </div> </div></div>
              </div>
              <div className="card-body">
                <div className="ag-theme-alpine mt-2 rounded-4" style={{ height: 540, width: '100%' }}>
                  <AgGridReact
                    columnDefs={Employeecol}
                    rowData={rowData}


                    suppressRowClickSelection={true}
                    onGridReady={(params) => {
                      gridApiRef.current = params.api;
                      gridColumnApiRef.current = params.columnApi;
                    }}

                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
export default Input;
