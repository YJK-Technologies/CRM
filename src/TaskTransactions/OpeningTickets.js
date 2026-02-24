import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css';
import { useNavigate } from "react-router-dom";
import { publicIpv4 } from "public-ip";
import Select from 'react-select';
const config = require('../Apiconfig');

function Input({ }) {
  const [isCheckedIn, setIsCheckedIn] = useState(
    sessionStorage.getItem("isCheckedIn") === "true"
  );
  const user_code = sessionStorage.getItem('selectedUserCode');
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);
  const [rowData, setrowData] = useState('');
  const [deviceDetails, setDeviceDetails] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const [timer, setTimer] = useState("00:00:00");
  const [searchRowData, setSearchRowData] = useState('');
  const [userDrop, setUserDrop] = useState([]);
  const [statusDrop, setStatusDrop] = useState([]);
  const [priorityDrop, setPriorityDrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [user, setUser] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedproject, setSelectedproject] = useState([]);
  const [projectID, setprojectID] = useState('');
  const [projectDrop, setProjectDrop] = useState([]);
   

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        // Get Device Details
        const userAgent = navigator.userAgent;
        setDeviceDetails(userAgent);

        // Get IP Address
        const ip = await publicIpv4(); // Correct function
        setIpAddress(ip);

        // Get Location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude}, ${longitude}`);
            },
            (error) => {
              console.error("Error fetching location:", error);
              setLocation("Location unavailable");
            }
          );
        } else {
          setLocation("Geolocation not supported");
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);

  useEffect(() => {
    const fetchGstReport = async () => {
      try {
        const body = {
          userID: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem('selectedCompanyCode')
        };

        const response = await fetch(`${config.apiBaseUrl}/getDailyTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const fetchedData = await response.json();
          const newRows = fetchedData.map((matchedItem, index) => ({
            SNo: index + 1,
            StartDate: formatDate(matchedItem.StartDate),
            EndDate: formatDate(matchedItem.EndDate),
            TaskMasterID: matchedItem.TaskMasterID,
            TaskTitle: matchedItem.TaskTitle,
            ProjectName: matchedItem.ProjectName,
            ProjectID: matchedItem.ProjectID,
            userID: matchedItem.userID,
            TaskStatus: matchedItem.TaskStatus,
            PriorityLevel: matchedItem.PriorityLevel,
            EstimatedHours: matchedItem.EstimatedHours,
            BufferHours: matchedItem.BufferHours,
            Description: matchedItem.Description,
          }));
          setrowData(newRows);
        } else if (response.status === 404) {
          console.log("Data Not found");
          toast.warning("Data Not found");
          setrowData([]);
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to get data");
          console.error(errorResponse.details || errorResponse.message);
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };
    fetchGstReport();
  }, []);

  // Empty dependency array means this effect runs once when the component mounts

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const columnDefs = [
    {
      headerName: "S.No",
      field: "SNo",
      // minWidth: 70,
      // maxWidth: 70
    },
    {
      headerName: "Project ID",
      field: "ProjectID",
      filter: 'agNumberColumnFilter',
      // minWidth: 200,
      // maxWidth: 200
    },
    {
      headerName: "Project Name",
      field: "ProjectName",
      filter: 'agTextColumnFilter',
      // minWidth: 200,
    },
    {
      headerName: "Task Master ID",
      field: "TaskMasterID",
      filter: 'agTextColumnFilter',
      // minWidth: 200,
      // maxWidth: 200
    },
    {
      headerName: "Priority Level",
      field: "PriorityLevel",
      filter: 'agNumberColumnFilter',
      // minWidth: 150,
      // maxWidth: 150
    },
    {
      headerName: "Description",
      field: "Description",
      filter: 'agNumberColumnFilter',
      // minWidth: 200,
    },
    {
      headerName: "Links",
      field: "EMIAmount",
      filter: "agNumberColumnFilter",
      // minWidth: 400,
      // maxWidth: 400,
      hide: true,
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };
        return (
          <button
            onClick={handleClick}
            style={{
              cursor: "pointer",
              background: "0",
              color: "black",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              boxShadow: "0px 0px 0px 0px",
            }}
          >
            {params.value}
            Link
          </button>
        );
      },
    }
  ];

  // Function to handle navigation with row data
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/ProjectDetails", { state: { selectedRow } });
  };

  // const defaultColDef = {
  //   resizable: true,
  //   wrapText: true,
  //   sortable: true,
  //   editable: false,
  // };
  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isCheckedIn) {
      startTimer();
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [isCheckedIn]);

  const startTimer = () => {
    let storedElapsedTime = sessionStorage.getItem("elapsedTime")
      ? parseInt(sessionStorage.getItem("elapsedTime"))
      : 0;

    let startTime = parseInt(sessionStorage.getItem("startTime")) || Date.now() - storedElapsedTime * 1000;

    sessionStorage.setItem("startTime", startTime);

    if (intervalRef.current) clearInterval(intervalRef.current); // Clear any existing interval

    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      sessionStorage.setItem("elapsedTime", elapsedTime);

      const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, "0");
      const seconds = String(elapsedTime % 60).padStart(2, "0");

      setTimer(`${hours}:${minutes}:${seconds}`);

      // 🕒 Check if 8 hours (28800 seconds) completed
      if (elapsedTime === 28800 && !sessionStorage.getItem("mailSent")) {
        sendAutoMail(); // Call your email function
        sessionStorage.setItem("mailSent", "true"); // Ensure it's only sent once
      }

    }, 1000);
  };





  const sendAutoMail = async () => {
    const userEmail = sessionStorage.getItem("userEmailId");

    try {
      const response = await fetch(`${config.apiBaseUrl}/sendAutoMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending mail:", error.message);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    let lastElapsedTime = sessionStorage.getItem("elapsedTime") || "0";
    sessionStorage.setItem("lastElapsedTime", lastElapsedTime); // Save last elapsed time
    sessionStorage.removeItem("elapsedTime");
    sessionStorage.removeItem("startTime");
  };




  const handleTime = async () => {
    try {
      const route = isCheckedIn ? "/DailyLogOUT" : "/DailyLogin";
      const response = await fetch(`${config.apiBaseUrl}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: sessionStorage.getItem('selectedUserCode'),
          DeviceDetails: deviceDetails,
          IP_Address: ipAddress,
          Location: location,
        }),
      });

      if (response.status === 200) {
        setIsCheckedIn((prev) => {
          const newState = !prev;
          sessionStorage.setItem("isCheckedIn", newState);

          if (newState) {
            // When checking in, resume from last elapsed time
            let lastElapsedTime = sessionStorage.getItem("lastElapsedTime")
              ? parseInt(sessionStorage.getItem("lastElapsedTime"))
              : 0;
            sessionStorage.setItem("elapsedTime", lastElapsedTime);
            startTimer();
          } else {
            stopTimer();
          }
          return newState;
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      } else {
        toast.error("Failed to insert data");
      }
    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("elapsedTime")) {
      const storedTime = parseInt(sessionStorage.getItem("elapsedTime"));
      const hours = String(Math.floor(storedTime / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((storedTime % 3600) / 60)).padStart(2, "0");
      const seconds = String(storedTime % 60).padStart(2, "0");
      setTimer(`${hours}:${minutes}:${seconds}`);
    }
  }, []);

  // const startTimer = () => {
  //   const startTime = Date.now() - secondsPassed * 1000; // Start from where it left off
  //   const id = setInterval(() => {
  //     const elapsed = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
  //     setSecondsPassed(elapsed);
  //     setTimer(formatTime(elapsed));
  //   }, 1000);
  //   setIntervalId(id);
  // };

  // const stopTimer = () => {
  //   if (intervalId) {
  //     clearInterval(intervalId);
  //     setIntervalId(null);
  //   }
  // };

  //Code added by pavun on 18-06-25
  const searchColumnDefs = [
    {
      headerName: "S.No",
      field: "SNo",
      valueGetter: "node.rowIndex + 1",
      maxWidth:70
    },
    {
      headerName: "Project ID",
      field: "ProjectID",
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Project Name",
      field: "ProjectName",
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Task Master ID",
      field: "TaskMasterID",
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Task Title",
      field: "TaskTitle",
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Start Date",
      field: "StartDate",
      filter: 'agDateColumnFilter',
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
      headerName: "End Date",
      field: "EndDate",
      filter: 'agDateColumnFilter',
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
      headerName: "User ID",
      field: "userID",
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "User Name",
      field: "userName",
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Task Status",
      field: "TaskStatus",
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Priority Level",
      field: "PriorityLevel",
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Description",
      field: "Description",
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Links",
      field: "EMIAmount",
      filter: "agNumberColumnFilter",
      hide: true,
      // cellRenderer: (params) => {
      //   const handleClick = () => {
      //     handleNavigateWithRowData(params.data);
      //   };
      //   return (
      //     <button
      //       onClick={handleClick}
      //       style={{
      //         cursor: "pointer",
      //         background: "0",
      //         color: "black",
      //         border: "none",
      //         padding: "5px 10px",
      //         borderRadius: "5px",
      //         boxShadow: "0px 0px 0px 0px",
      //       }}
      //     >
      //      {params.value}
      //       Link
      //     </button>
      //   );
      // },
    }
  ];

  useEffect(() => {
       fetch(`${config.apiBaseUrl}/Usercode`)
         .then((data) => data.json())
         .then((val) => setUserDrop(val));
     }, []);
     

  // useEffect(() => {
  //   // const company_code = sessionStorage.getItem('selectedCompanyCode');
  //   fetch(`${config.apiBaseUrl}/getTaskUserID`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({  
  //        company_code: sessionStorage.getItem("selectedCompanyCode"), })
  //   })
    
  //         .then((response) => response.json())
  //         .then(setUserDrop)
  //         .catch((error) => console.error("Error fetching user codes:", error));
  //     }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setPriorityDrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTaskstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusDrop(val));
  }, []);

   const company_code = sessionStorage.getItem("selectedCompanyCode")
 useEffect(() => {
    if (!company_code) return; // Only run if company_code exists

    fetch(`${config.apiBaseUrl}/getProjectDrop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        setProjectDrop(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

    const handleChangeproject = async (selectedProject) => {
    setSelectedproject(selectedProject);
    setprojectID(selectedProject ? selectedProject.value : '');
  }


  const handleChangeUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    setUser(selectedUser ? selectedUser.value : '');
  };

  const handleChangeStatus = (selectedstatus) => {
    setSelectedStatus(selectedstatus);
    setStatus(selectedstatus ? selectedstatus.value : '');
  };

  const handleChangePriority = (selectedPriorty) => {
    setSelectedPriority(selectedPriorty);
    setPriority(selectedPriorty ? selectedPriorty.value : '');
  };

  const filteredOptionPriority = [{ value: 'All', label: 'All' }, ...priorityDrop.map(option => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

    const filteredOptionproject = Array.isArray(projectDrop)
    ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : [];

  const filteredOptionUser = [{ value: 'All', label: 'All' }, ...(
    Array.isArray(userDrop) ? userDrop.map(option => ({
      value: option.user_code,
      label: `${option.user_code} - ${option.user_name}`,
    })) : []
  )];

  const filteredOptionStatus = [{ value: 'All', label: 'All' }, ...statusDrop.map(option => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  useEffect(() => {
    searchHandler();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchHandler();
    }
  };

  const searchHandler = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/openingTicketSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user,
          TaskTitle: taskTitle,
          StartDate: startDate,
          EndDate: endDate,
          TaskStatus: status,
          PriorityLevel: priority,
          ProjectID:projectID,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.ok) {
        const searchData = await response.json();
        setSearchRowData(searchData);
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setSearchRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching search data:", err);
    }
  };

  const handleReload = () => {
    setUser('');
    setSelectedUser('');
    setPriority('');
    setSelectedPriority('');
    setEndDate('');
    setStartDate('');
    setStatus('');
    setSelectedStatus('');
    setTaskTitle('');
    setSearchRowData([]);
  }

  //Code ended by pavun on 18-06-25

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className=" p-0 shadow-lg bg-white rounded">
            <div className="purbut mb-0 d-flex justify-content-between">
              <h1 align="left" className="">Open Tickets</h1>
              {/* <div className="col-md-2 mt-1  purbut" >
                <div class=" d-flex justify-content-end  ">
                  <div className="col-md-6 form-group me-5">
                    <div className="mt-2 badge rounded-pill text-bg-success">
                      {user_code}
                    </div>
                  </div>
                  <div className="col-md-5 form-group mb-2">
                    <input
                      id="timing"
                      className="form-control mt-1"
                      type="text"
                      readOnly
                      value={timer}
                    />
                  </div>
                  <div className="col-md-12 ms-3">
                    <button
                      onClick={handleTime}
                      className="btn mt-1"
                      style={{
                        backgroundColor: isCheckedIn ? "red" : "green",
                        color: "white",
                      }}
                      title={isCheckedIn ? "Check OUT" : "Check IN"}
                    >
                      <i className="fa-solid fa-clock me-2"></i>
                      {isCheckedIn ? "Check OUT" : "Check IN"}
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className=" shadow-lg bg-white rounded  mt-2  p-3">
            <div class=" mb-4">
              <div className="mb-2">
              </div>
              {/* <hr className=""></hr> */}
              <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  // defaultColDef={defaultColDef}
                  rowData={rowData}
                  onCellClicked={(params) => handleNavigateWithRowData(params.data)}
                  pagination={true}
                  rowHeight={27}
                  headerHeight={27}
                  paginationAutoPageSize={true}
                  gridOptions={gridOptions}
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
          <div className=" shadow-lg bg-white rounded  mt-2  p-3">
            <div class="mb-4">
              <h4 className="ms-4">Search Criteria :</h4>
              <div className="mb-2">
                <div class="row ms-3 me-3 mb-3">
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div> <label for="add1" class="exp-form-labels">
                      Project 
                    </label></div>

                  </div>
                  <Select
                    id="LoanEligibleAmount"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the address"
                    onChange={handleChangeproject}
                    value={selectedproject}
                    options={filteredOptionproject}
                    maxLength={50}
                    onKeyDown={(e) => e.key === "Enter" && handleKeyPress()}
                  />
                </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <label for="add2" class="exp-form-labels">Task Title</label>
                      <input
                        id="EffetiveDate"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        onKeyDown={handleKeyPress}
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <label for="add3">Task Status</label>
                      <Select
                        id="taskstatus"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        value={selectedStatus}
                        onKeyDown={handleKeyPress}
                        onChange={handleChangeStatus}
                        options={filteredOptionStatus}
                      />
                    </div> </div>
                    <div className="col-md-3 form-group mb-2">
                     <div class="exp-form-floating">
                      <label for="add3">User </label>
                      <Select
                        id="LoanEligibleAmount"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        onChange={handleChangeUser}
                        value={selectedUser}
                        options={filteredOptionUser}
                        maxLength={30}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    </div>
                 
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <label for="sname" class="exp-form-labels">Start Date</label>
                      </div>
                      <input
                        id="date"
                        class="exp-input-field form-control"
                        type="date"
                        placeholder=""
                        value={startDate}
                        onKeyDown={handleKeyPress}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <label for="sname" class="exp-form-labels">End Date</label>
                      </div>
                      <input
                        id="date"
                        class="exp-input-field form-control"
                        type="date"
                        placeholder=""
                        value={endDate}
                        onKeyDown={handleKeyPress}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <label for="tcode">Priority Level</label>
                      <Select
                        id="PriorityLevel"
                        className="exp-input-field"
                        type="text"
                        placeholder=""
                        value={selectedPriority}
                        onChange={handleChangePriority}
                        options={filteredOptionPriority}
                        maxLength={15}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    
                  </div>
                  <div className="col-md-2 form-group mt-4">
                    <div class="exp-form-floating">
                      <div class=" d-flex justify-content-center ">
                        <div class="">
                          <icon
                            className="popups-btn fs-6 p-3"
                            required
                            title="Search"
                            onClick={searchHandler}
                          >
                            <i className="fas fa-search"></i>
                          </icon>
                        </div>
                        <div>
                          <icon
                            className="popups-btn fs-6 p-3"
                            required
                            title="Refresh"
                            onClick={handleReload}
                          >
                            <i class="fa-solid fa-rotate-right"></i>
                          </icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                <AgGridReact
                  columnDefs={searchColumnDefs}
                  rowData={searchRowData}
                  onCellClicked={(params) => handleNavigateWithRowData(params.data)}
                  pagination={true}
                  rowHeight={27}
                  headerHeight={27}
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
