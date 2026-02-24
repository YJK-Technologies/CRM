import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import Select from 'react-select'
import axios from 'axios';
const config = require('../Apiconfig');

function Input({ }) {
  const [loanAction, setLoanAction] = useState('update'); // Default to 'add'
  const [ApprovedDrop, setApprovedDrop] = useState('');
  const [EmployeeId, setEmployeeId] = useState('');
  const [loanID, setLoanID] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [LoanEligibleAmount, setLoanEligibleAmount] = useState('');
  const [EffectiveDate, setEffectiveDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [HowManyMonth, setHowManyMonth] = useState('');
  const [EMIAmount, setEMIAmount] = useState('');
  const [selectedApprovedBy, setselectedApprovedBy] = useState('');
  const [SelectedUserName, setSelectedUserName] = useState('');

  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);


  const [selectedLoan, setselectedLoan] = useState('');
  const [open3, setOpen3] = React.useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [error, setError] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setselectedStatus] = useState('');
  const [selectedLocation, setselectedLocation] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const companycode = useRef(null);
  const companyname = useRef(null);
  const Address2 = useRef(null);
  const Address3 = useRef(null);
  const City = useRef(null);
  const WebsiteUrl = useRef(null);
  const found = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [companyImage, setCompanyImage] = useState("");
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [rowData, setrowData] = useState('');
  
  
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const options = [
    { value: 'add', label: 'Add' },
    { value: 'update', label: 'Update ' }
  ];
  const handleSelectChange = (selectedOption) => {
    setLoanAction(selectedOption.value);
  };

  console.log(selectedRow)

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  const [data, setData] = useState([]);  // State to store the fetched data
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // Function to fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getsearchEmpLoan`);  // Backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setrowData(result);  // Set the data in state
      } catch (error) {
        setError(error.message);  // Handle errors
      } finally {
        setLoading(false);  // Stop loading after fetch
      }
    };

    fetchData();  // Call the fetchData function
  }, []);  // Empty dependency array means this effect runs once when the component mounts


  const columnDefs = [
    { headerName: "Task Master ID", field: "EmployeeId",  minWidth:110, maxWidth:150},
    { headerName: "Project Code", field: "loanID", filter: 'agTextColumnFilter', minWidth:110, maxWidth:150 },
    { headerName: "Priority", field: "EMIAmount", filter: 'agNumberColumnFilter', minWidth:100, maxWidth:100 },

    { headerName: "User Code", field: "ApprovedBy", filter: 'agTextColumnFilter', minWidth:200, maxWidth:200 },
    { headerName: "Start Date", field: "LoanEligibleAmount", filter: 'agNumberColumnFilter', minWidth:200, maxWidth:200 },
    { headerName: "End Date", field: "EffetiveDate", filter: 'agDateColumnFilter', minWidth:140, maxWidth:140, valueFormatter: (params) => formatDate(params.value),  // Format the date for display
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // Format the cell value and filter value to compare
          const cellDate = new Date(cellValue.split('/').join('-')); // Convert DD/MM/YYYY to a Date object
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      }, },
    { headerName: "Estimated Hours", field: "EndDate", filter: 'agDateColumnFilter',  minWidth:130, maxWidth:120,
      valueFormatter: (params) => formatDate(params.value),  
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-')); 
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
     },
    { headerName: "Buffer Hours", field: "HowManyMonth", filter: 'agNumberColumnFilter', minWidth:200, maxWidth:200 },
    { headerName: "Task Status", field: "EMIAmount", filter: 'agNumberColumnFilter', minWidth:500, maxWidth:500 },
  ];
  const defaultColDef = {
    resizable: true,
    wrapText: true,
    sortable: true,
    editable: false,
    filter: true,
  };

 





  const handleSave = async (e) => {

    if (!EmployeeId || !selectedLoan || !selectedApprovedBy || !LoanEligibleAmount || !EffectiveDate || !EndDate || !HowManyMonth || !EMIAmount) {
      setError(" ");
      return;
    }
    e.preventDefault();
    
    setIsSaving(true);
    setMessage('');

    // Prepare the data to be sent to the backend
    const data = {
      EmployeeId,
      loanID: selectedLoan,
      ApprovedBy:selectedApprovedBy,
      LoanEligibleAmount: parseFloat(LoanEligibleAmount), // Convert to float for monetary values
      EffectiveDate,
      EndDate,
      HowManyMonth: parseInt(HowManyMonth, 10), // Convert to integer
      EMIAmount: parseFloat(EMIAmount), // Convert to float for monetary values
      created_by
     
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}/addEmployeeLoan`, data); // Replace with actual API endpoint
      setMessage('Data inserted successfully');
      setTimeout(() => {
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      }, 1000);
      
    } catch (error) {
      setMessage('Error inserting data: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };


  const handleDelete = async (e) => {
    e.preventDefault();
  
    setIsSaving(true);
    setMessage('');
  
    // Prepare the data to be sent to the backend (you can send just the ID needed for deletion)
    const data = {
      EmployeeId ,
        loanID: selectedLoan,
    };
  
    try {
   
      const response = await axios.post(`${config.apiBaseUrl}/deleteEmployeeLoan `, data); // Replace with actual API endpoint for deletion
      
      setMessage('Data deleted successfully');
      setTimeout(() => {
        toast.success("Data deleted successfully!", {
          onClose: () => window.location.reload(),
        });
      }, 1000);
  
    } catch (error) {
      setMessage('Error deleting data: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    
   


    // Prepare the data to be sent to the backend
    const data = {
      EmployeeId,
      loanID: selectedLoan,
      ApprovedBy:selectedApprovedBy,
      LoanEligibleAmount: parseFloat(LoanEligibleAmount), 
      EffetiveDate:EffectiveDate,
      EndDate,
      HowManyMonth: parseInt(HowManyMonth, 10),
      EMIAmount: parseFloat(EMIAmount)
    
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}/updateEmployeeLoan `, data); // Replace with actual API endpoint
      setMessage('Data updated successfully');
      setTimeout(() => {
        toast.success("Data updated successfully!", {
          onClose: () => window.location.reload(),
        });
      }, 1000);
    } catch (error) {
      setMessage('Error inserting data: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
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
   useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLoanID`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  const HandleLoan = (status) => {
    setLoanID(status);
    setselectedLoan(status ? status.value :'');
  };
  
  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getTeamManager`)
      .then((data) => data.json())
      .then((val) => setApprovedDrop(val));
  }, []);

  const HandleApproved = (ApprovedBy) => {
    setApprovedBy(ApprovedBy);
    setselectedApprovedBy(ApprovedBy.value);
  };
  
  const filteredOptionApproved = Array.isArray(ApprovedDrop) 
  ? ApprovedDrop.map((option) => ({
      value: option.manager,
      label: `${option.EmployeeId} - ${option.manager}`,  // Concatenate ApprovedBy and EmployeeId with ' - '
  }))
  : [];
  

  





  const handleEmpLoan= () => {
    setOpen3(true);
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleInsert = async () => {
    if (
      !EmployeeId ||
      !loanID||
      !selectedApprovedBy ||
      !LoanEligibleAmount ||
      !EffectiveDate ||
      !EndDate ||
      !HowManyMonth ||
      !EMIAmount 
     
    ) {
      setError("Please fill all required fields");
      return;
    }
  
    // if (!validateEmail(Email)) {
    //   setError("Please enter a valid email address");
    //   return;
    // }
  
    
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/addEmployeeLoan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmployeeId,
            loanID,
            ApprovedBy:selectedApprovedBy,
            LoanEligibleAmount,
            EffectiveDate,
            EndDate,
            HowManyMonth,
            EMIAmount ,
          }),
        }
      );
  
      if (response.status === 200) {
        const successMessage = isUpdateMode
          ? "Data updated successfully!"
          : "Data inserted successfully!";
        console.log(successMessage);
        setTimeout(() => {
          toast.success(successMessage, {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {});
      } else {
        console.error("Failed to process data");
        toast.error("Failed to process data", {});
      }
    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("Error processing data: " + error.message, {});
    }
  };
  
  
  
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
  
    const handleClose = () => {
      setOpen(false);
      
    };
    const handleClose1 = () => {
      setOpen1(false)
      
    };
    
  
    const handleEmployeeInfoor =()=>{
      setOpen1(true)
    }
    const handleEmployeeInfo= () => {
      setOpen(true);
    };
    const formatDate = (isoDateString) => {
      const date = new Date(isoDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    };

   
    const EmployeeInfo = async (data) => {
      if (data && data.length > 0) {
        setSaveButtonVisible(false);
        setUpdateButtonVisible(true);
        const [{ EmployeeId, loanID, ADDApproved ,ApprovedBy, LoanEligibleAmount, EffetiveDate, EndDate,HowManyMonth, EMIAmount}] = data; 
        console.log(data);
        
       
        const employeeId = document.getElementById('EmployeeId');
        if (employeeId) {
          employeeId.value = EmployeeId;
          setEmployeeId(EmployeeId);
        } else {
          console.error('EmployeeId  not found');
        }
  
  
      } else {
        console.log("Data not fetched...!");
      }
      console.log(data);
    };
    const applyFilter = (field, value) => {
      if (!gridApiRef.current) return;  // Check if gridApi is available
  
      const filterInstance = gridApiRef.current.getFilterInstance(field);
  
      if (value === "") {
        filterInstance.setModel(null);  // Clear the filter if input is empty
      } else {
        filterInstance.setModel({ type: 'contains', filter: value });
      }
  
      gridApiRef.current.onFilterChanged();  // Apply the filter change to the grid
    };
  
   
  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer
            position="top-right"
            className="toast-design" // Adjust this value as needed
            theme="colored"
          />
          <div className=" p-0 shadow-lg bg-white rounded">
          <div className="purbut mb-0 d-flex justify-content-between">
        <h1 align="left" className="">
          {loanAction === 'add' ? 'Employee Allocated Tasks' : 'Employee Allocated Tasks'}
        </h1>

        <div className="col-md-1 mt-3 me-5 purbut"> 

          <div class=" d-flex justify-content-start  me-5">
          <div className="me-1 ">
          {saveButtonVisible &&(
               <savebutton className="" onClick={handleSave}
                 required title="save"> <i class="fa-solid fa-floppy-disk"></i> </savebutton>
             )}
            {updateButtonVisible &&(
               <savebutton className="purbut" title='update' onClick={handleSave} >
                 <i class="fa-solid fa-floppy-disk"></i>
               </savebutton>
             )}

         </div>
         <div className="ms-1">
         <delbutton 
         // onClick={handleDelete} 
         title="Delete" onClick={handleDelete} >
        <i class="fa-solid fa-trash"></i>
         </delbutton>
         </div>
         <div className="col-md-1"> 
         <div className="ms-1">
         <reloadbutton
         className="purbut"
         onClick={reloadGridData}
         title="save" style={{cursor:"pointer"}}>
         <i className="fa-solid fa-arrow-rotate-right"></i> 
         </reloadbutton>
         </div>
         </div>
         </div>         
               </div>  

               <div class="dropdown mt-2 me-5 mobileview">
                  <button
                    class="btn btn-primary dropdown-toggle p-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu menu">
                    {/* <li class="iconbutton d-flex justify-content-center text-success">
                        <icon
                          class="icon"
                        >
                          <i class="fa-solid fa-user-plus"></i>
                          {" "}
                        </icon>
                      
                    </li> */}
                    <li class="iconbutton  d-flex justify-content-center text-success">
                        <icon
                          class="icon"
                        >

                <i class="fa-solid fa-floppy-disk"></i></icon>

                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-danger ">
                        <icon
                          class="icon"
                        >
        <i class="fa-solid fa-trash"></i>
        </icon>
                    </li>
                    <li class="iconbutton  d-flex justify-content-center">
                        <icon
                          class="icon"
                        >

                          <i className="fa-solid fa-arrow-rotate-right"></i> 
                        </icon>
                    </li>
                  </ul>
                </div> 
      </div>
          </div>

          <div className=" shadow-lg bg-white rounded  mt-2  p-3">

   


          <div class=" mb-4">
            <div className="    mb-2">
       
         
            <div class="row ms-3 me-3 mb-3">
       
     
    
       <div className="col-md-3 form-group mb-2">
         <div className="exp-form-floating">
           <div className="d-flex justify-content-start">
             <div>
               <label htmlFor="EmployeeId" className="exp-form-labels">
                  Task Master ID
               </label>
             </div>
             <div>
               <span className="text-danger">*</span>
             </div>
           </div>
           <div class="d-flex justify-content-end">
           <input
             id="EmployeeId"
             className="exp-input-field form-control p-2"
             type="text"
             placeholder=""
             required
             title="Please enter the company code"
             value={EmployeeId}
             onChange={(e) => setEmployeeId(e.target.value)}
             maxLength={20}
           />
          

       
          <div className="position-absolute mt-2 me-2">
                    <span className="icon searchIcon" onClick={handleEmployeeInfo} >
               <i className="fa fa-search"></i>
             </span>
         </div>
            
            
           </div>
          {error && !EmployeeId && <div className="text-danger">Employee ID should not be blank</div>}
           {error && <div className="text-danger">{error}</div>}
         </div>
       </div>

    
               
         
             



             
                
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="cname" class="exp-form-labels">
                          Project Code
                      </label></div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="loanID"
                      class="exp-input-field form-control"
                    />
                {error && !loanID && <div className="text-danger">loanID should not be blank</div>}

                   
                  </div>
                </div>

          
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">
                        User Code <div><span className="text-danger">*</span></div>
                        </label> </div>
                    </div>
                   
                    <input
                      id="Approvedby"
                      class="exp-input-field form-control"
                     
                      />
                     
                     {error && !approvedBy && <div className="text-danger">usercode should not be blank</div>}

                    
                  
                  </div>
                </div>
              

               
                
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" class="exp-form-labels">
                          Start Date
                      </label></div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="LoanEligibleAmount"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the address"
                      value={LoanEligibleAmount}
                      onChange={(e) => setLoanEligibleAmount(e.target.value.slice(0, 7))}
                      maxLength={30}

                    />
                    {error && !LoanEligibleAmount && <div className="text-danger">EligibleAmount should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add2" class="exp-form-labels">
                          End Date 
                      </label> </div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="EffetiveDate"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the address"
                      value={EffectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      maxLength={100}
                    
                    />
                    {error && !EffectiveDate && <div className="text-danger">EffectiveDate should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                        Estimated Hours <div><span className="text-danger">*</span></div>
                    </label><input
                      id="EndDate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={EndDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      maxLength={100}
                  
                    />
                                        {error && !EndDate && <div className="text-danger">EndDate should not be blank</div>}

                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label For="city" className="exp-form-labels">Buffer Hours</label>
                      </div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="HowManyMonth"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                    
                     
                    />
                    {error && !HowManyMonth && <div className="text-danger">Months should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                      Task Status <div><span className="text-danger">*</span></div>
                    </label>
                    <Select
                      id="EMIAmount"
                      class="exp-input-field "
                      type="text"
                      placeholder=""
             
                      
                     
                    />
          {error && !EMIAmount && <div className="text-danger">EMIAmount should not be blank</div>}

                  </div>
                </div>
           
              </div>      
              
              
              
              
              
              
              </div>
              <hr className="mt-5"></hr>
            {/* <h5 className="ms-4 mt-5">Search Criteria:</h5>

               <div class="row ms-3 me-3  ">
        
     

        
          <div className="col-md-2 mb-3">
        <input type="text" className="exp-input-field form-control" placeholder="Filter by Employee ID" onInput={(e) => applyFilter('EmployeeId', e.target.value)} />
        </div>
        <div className="col-md-2 mb-3">
        <input type="text" className="exp-input-field form-control"placeholder="Filter by Loan ID" onInput={(e) => applyFilter('loanID', e.target.value)} />
        </div>
        <div className="col-md-2 mb-3">
        <input type="text" className="exp-input-field form-control"placeholder="Filter by Approved By" onInput={(e) => applyFilter('ApprovedBy', e.target.value)} />
        </div>
        <div className="col-md-2 mb-3">
        <input type="number" className="exp-input-field form-control"placeholder="Filter by Loan Eligible Amount" onInput={(e) => applyFilter('LoanEligibleAmount', e.target.value)} />
        </div>
        <div className="col-md-2 mb-3">
        <input type="number" className="exp-input-field form-control"placeholder="Filter by EMI Amount" onInput={(e) => applyFilter('EMIAmount', e.target.value)} />
      </div>
              

               
                
                
             
               
                
           
              </div>       */}
              
              

              
              
              
          
              <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={rowData}  // Pass the rowData to AgGridReact
        pagination={true} 
        paginationAutoPageSize={true}  
       
        suppressRowClickSelection={true}
        onGridReady={(params) => {
          gridApiRef.current = params.api;
          gridColumnApiRef.current = params.columnApi;
        }}
      />
    </div>
              <div>
   

      
      </div>
            </div>
            
          </div>
        </div>
      </div>
      
     
    </div>

  );

  

}
export default Input;
