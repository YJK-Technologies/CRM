import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import { useLocation } from "react-router-dom";
import axios from 'axios';
const config = require('../Apiconfig');

function AttriDetInput({ }) {

  const [TaskMaster, setTaskMaster] = useState('');

  const [Title, setTitle] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [HowManyMonth, setHowManyMonth] = useState('');
  const [EMIAmount, setEMIAmount] = useState('');
  const [selectedApprovedBy, setselectedApprovedBy] = useState('');




  const [selectedLoan, setselectedLoan] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [rowData, setrowData] = useState('');
  const [ProjectID, setProjectID] = useState('');
  const [UserID, setUserID] = useState('');
  const [Endtime, setEndtime] = useState('');
  const [StartDate, setStartDate] = useState('');
  const [selectedtstatus, setselectedtstatus] = useState('');
 const [status_type, setstatus_type] = useState("");
 const [statusdrop, setStatusdrop] = useState([]);  
 const [Descriptions, setDescriptions] = useState("");  
 const [buffer, setbuffer] = useState("");  


  const handleChangestatus = (selectedstatus) => {
    setselectedtstatus(selectedstatus);
    setstatus_type(selectedstatus ? selectedstatus.value : '');
  };

  const filteredOptionTransaction = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getTaskstatus`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);


  useEffect(() => {
    // Function to fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getDailyTasks`);  // Backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setrowData(result);  // Set the data in state
      } catch (error) {
        setError(error.message);  // Handle errors
      }
    };

    fetchData();  // Call the fetchData function
  }, []);  // Empty dependency array means this effect runs once when the component mounts


  const columnDefs = [
    { headerName: "Task Master ID", field: "TaskMasterID", minWidth: 170, maxWidth: 170 },
    { headerName: "Project ID", field: "ProjectID", filter: 'agNumberColumnFilter', minWidth: 200, maxWidth: 200 },
    {
      headerName: "User ID", field: "userID", filter: 'agDateColumnFilter', minWidth: 140, maxWidth: 140,   // Format the date for display  
    },
    {
      headerName: "Daily Task Title", field: "TaskTitle", filter: 'agDateColumnFilter', minWidth: 170, maxWidth: 170,
    },
    {
      headerName: "Start Date", field: "EndDate", filter: 'agDateColumnFilter', minWidth: 130, maxWidth: 120,
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
    {
      headerName: "End Date", field: "EndDate", filter: 'agDateColumnFilter', minWidth: 130, maxWidth: 120,
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
    { headerName: "Hours Taken", field: "EstimatedHours", filter: 'agNumberColumnFilter', minWidth: 130, maxWidth: 130 },
    { headerName: "Buffer Hours", field: "BufferHours", filter: 'agNumberColumnFilter', minWidth: 130, maxWidth: 130 },
    { headerName: "Task Description", field: "Description", filter: 'agNumberColumnFilter', minWidth: 400, maxWidth: 400 },
    { headerName: "Task Status", field: "TaskStatus", filter: 'agNumberColumnFilter', minWidth: 130, maxWidth: 130 },
  ];
  const defaultColDef = {
    resizable: true,
    wrapText: true,
    sortable: true,
    editable: false,
    filter: true,
  };

  const handleSave = async (e) => {

    if ( !ProjectID || !UserID || !Title || !StartDate ||!EndDate || !Endtime || !Descriptions) {
      setError(" ");
        toast.warning("Error: Missing required fields");
      return;
    }
    e.preventDefault();
    setSaveButtonVisible(true);
    setIsSaving(true);
    setMessage('');

    // Prepare the data to be sent to the backend
    const data = {
      // StartDate,
      // ProjectID,
      // UserID, 
      // EndDate,
      // Title,
      // Descriptions,
      // TaskStauts:status_type,
      // created_by
      TaskTitle:Title,
      Description:Descriptions,
      ProjectID:ProjectID,
      userID:UserID,
      StartDate:StartDate,
      EndDate:EndDate,
      EstimatedHours:Endtime,
      TaskStatus:status_type,
      BufferHours:buffer,
      created_by: sessionStorage.getItem('selectedUserCode')



    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/addTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      
            if (response.ok) {
              const searchData = await response.json();
              console.log(searchData);
              const [{ TaskMasterID }] = searchData;
              setTaskMaster(TaskMasterID);
              toast.success("Daily Tasks inserted Successfully")
            }

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
      TaskMaster,
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
      TaskMaster,
      loanID: selectedLoan,
      ApprovedBy: selectedApprovedBy,
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
    navigate("/Task");
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




  const reloadGridData = () => {
    window.location.reload();
  };




  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  
  return (
    <div class="container-fluid Topnav-screen ">
    <div className="">
    <div class="">
      <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      <div class="row ">
        <div class="col-md-12 text-center">
          <div >
          </div>
          <div>
            <div>
              <div className="shadow-lg p-0 bg-body-tertiary rounded">
                <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">Add Task Details</h1>
              <h1 align="left" class="mobileview fs-4">Add Task Details</h1>

              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">

              <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 mb-4">
          <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
          <div class="row ms-3 me-3 mb-3">



<div className="col-md-3 form-group mb-2">
  <div className="exp-form-floating">
    <div className="d-flex justify-content-start">
      <div>
        <label htmlFor="EmployeeId" className={`${error && !TaskMaster ? 'red' : ''}`}>
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
        className="exp-input-field form-control "
        type="text"
        placeholder=""
        required
        title="Please enter the company code"
        value={TaskMaster}
        onChange={(e) => setTaskMaster(e.target.value)}
        maxLength={20}
      />

      {/* <div className="position-absolute mt-2 me-2">
        <span className="icon searchIcon"  >
          <i className="fa fa-search"></i>
        </span>
      </div> */}


    </div>
    {error && <div className="text-danger">{error}</div>}
  </div>
</div>



<div className="col-md-3 form-group mb-2">
  <div class="exp-form-floating">
    <div class="d-flex justify-content-start">
      <div> <label for="add1" className={`${error && !ProjectID ? 'red' : ''}`}>
      Project ID
      </label></div>
      <div><span className="text-danger">*</span></div>
    </div>
    <input
      id="LoanEligibleAmount"
      class="exp-input-field form-control"
      type="text"
      placeholder=""
      required title="Please enter the address"
      value={ProjectID}
      onChange={(e) => setProjectID(e.target.value)}
      maxLength={50}
    />
  </div>
</div>

<div className="col-md-3 form-group mb-2">
  <div class="exp-form-floating">
    <div class="d-flex justify-content-start">
      <div> <label for="add1" className={`${error && !UserID ? 'red' : ''}`}>
    User ID
      </label></div>
      <div><span className="text-danger">*</span></div>
    </div>
    <input
      id="LoanEligibleAmount"
      class="exp-input-field form-control"
      type="text"
      placeholder=""
      required title="Please enter the address"
      value={UserID}
      onChange={(e) => setUserID(e.target.value)}
      maxLength={30}


    />
   
  </div>
</div>


<div className="col-md-3 form-group mb-2">
  <div class="exp-form-floating">
    <div class="d-flex justify-content-start">
      <div> <label for="add2" className={`${error && !Title ? 'red' : ''}`}>
        Daily Task Title
      </label> </div>
      <div><span className="text-danger">*</span></div>
    </div>
    <input
      id="EffetiveDate"
      class="exp-input-field form-control"
      type="text"
      placeholder=""
      required title="Please enter the address"
      value={Title}
      onChange={(e) => setTitle(e.target.value)}
      maxLength={100}

    />
   
  </div>
</div>

<div className="col-md-3 form-group mb-2">
<div class="exp-form-floating">
  <div class="d-flex justify-content-start">
    <div>
      <label for="sname" className={`${error && !StartDate ? 'red' : ''}`}>
      Start Date
      </label> </div>
      <div><span className="text-danger">*</span></div>
  </div>
  <input
    id="date"
    class="exp-input-field form-control"
    type="date"
    placeholder=""
    required title="Please enter the From Date"
    value={StartDate}
   
    onChange={(e) => setStartDate(e.target.value)}
   
  />
</div>
</div>

<div className="col-md-3 form-group mb-2">
<div class="exp-form-floating">
  <div class="d-flex justify-content-start">
    <div>
      <label for="sname" className={`${error && !EndDate ? 'red' : ''}`}>
        End Date
      </label> </div>
      <div><span className="text-danger">*</span></div>
  </div>
  <input
    id="date"
    class="exp-input-field form-control"
    type="date"
    placeholder=""
    required title="Please enter the From Date"
    value={EndDate}
   
    onChange={(e) => setEndDate(e.target.value)}
   
  />
  
</div>
</div>

<div className="col-md-3 form-group mb-2">
  <div class="exp-form-floating">
  <div class="d-flex justify-content-start">
    <div>
    <label for="add3" className={`${error && !Endtime ? 'red' : ''}`}>
      Hours Taken
    </label></div>
    <div><span className="text-danger">*</span></div>
    </div>
    <input
      id="EndDate"
      class="exp-input-field form-control"
      type="text"
      placeholder=""
      required title="Please enter the address"
      value={Endtime}
      onChange={(e) => setEndtime(e.target.value)}
      maxLength={100}

    />
  </div>
</div>

<div className="col-md-3 form-group mb-2">
  <div class="exp-form-floating">
  <div class="d-flex justify-content-start">
  <div>
    <label for="add3" className={`${error && !buffer ? 'red' : ''}`}>
      Buffer Hours 
    </label></div>
    <div><span className="text-danger">*</span></div>
    </div>
    <input
      id="EndDate"
      class="exp-input-field form-control"
      type="text"
      placeholder=""
      required title="Please enter the address"
      value={buffer}
      onChange={(e) => setbuffer(e.target.value)}
      maxLength={100}

    />
  </div>
</div>

<div className="col-md-3 form-group mb-2">
  <div class="exp-form-floating">
    <div class="d-flex justify-content-start">
      <div>
        <label For="city" className={`${error && !Descriptions ? 'red' : ''}`}>Task Description</label>
      </div>
      <div><span className="text-danger">*</span></div>
    </div>
    <textarea
      id="HowManyMonth"
      class="exp-input-field form-control"
      type="text"
      placeholder=""
      value={Descriptions}
      onChange={(e) => setDescriptions(e.target.value)}

      required title="Please enter the address"

    />
  </div>
</div>
<div className="col-md-3 form-group mb-2">
  <div class="exp-form-floating">
  <div class="d-flex justify-content-start">
  <div>
    <label for="add3" className={`${error && !selectedtstatus ? 'red' : ''}`}>
      Task Status 
    </label>
    </div>
      <div><span className="text-danger">*</span></div>
    </div>

    <Select
      id="taskstatus"
      class="exp-input-field form-control"
      type="text"
      placeholder=""
      value={selectedtstatus}
      onChange={handleChangestatus}
      options={filteredOptionTransaction}
    />
  </div>
</div>
<div className="col-md-3 form-group mb-2 mt-3">
  <div class="exp-form-floating">
<button class=" mt-2 " onClick={handleSave}><i class="fa-solid fa-floppy-disk"></i></button></div></div>

         </div>
          </div>
        </div>
        </div>
    </div>
    </div>
    
    </div>
  );
}
export default AttriDetInput;