import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';


const config = require('../Apiconfig');


const MyAgGridComponent = () => {
  const today = new Date().toISOString().split("T")[0];
  const [rowDataEmployee, setRowDataEmployee] = useState([]);
  const [rowDataTask, setRowDataTask] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState("");
  const [Start_date, setStart_date] = useState(today);
  const [End_date, setEnd_date] = useState(today);
  const [userDrop, setUserDrop] = useState([]);
  const [Status, setstatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const navigate = useNavigate();


  const columnEmployee = [
    { headerName: 'Date', field: 'work_date', sort: 'asc', valueFormatter: (params) => formatDate(params.value) ,width:'110'},
    { headerName: 'Employee ID', field: 'user', editable: true,width:'170'},
    // { headerName: 'Employee Name', field: 'user' },
    { headerName: 'Status', field: 'Status',width:'90' },
    { headerName: 'Check In', field: 'First_CheckIn',width:'100' },
    { headerName: 'Check Out', field: 'Last_CheckOut',width:'110' },
    { headerName: 'Total Login  Hours', field: 'Total_login_Hours' ,width:'150'},
    { headerName: 'Total Worked Hours', field: 'total_worked_hours',width:'150' },
    { headerName: 'Balance Hours', field: 'Balance_Hours',width:'150' },
  ];

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const columnTask = [
    {
      headerName: 'Task Date', field: 'TaskDate',
      valueFormatter: (params) => formatDate(params.value),width:'150'
    },
    { headerName: 'Project ID', field: 'ProjectID',width:'150' },
    { headerName: 'Task Master ID', field: 'TaskMasterID',width:'150' },
    { headerName: 'Task ID', field: 'DailyTaskID',width:'150' },
    { headerName: 'Daily Task Title', field: 'DailyTaskTiltle',width:'150' },
    { headerName: 'Description', field: 'TaskDescription',width:'170' },
    { headerName: 'User', field: 'userID',width:'150' },
    { headerName: 'Spend Hours', field: 'HourseTaken',width:'150' },
    { headerName: 'Task Hours Per Ticket', field: 'TotalHours_per_Ticket',width:'150' },
    { headerName: 'Status', field: 'TaskStauts' },
  ];




  const handleChangeUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    setUser(selectedUser ? selectedUser.value : '');
  };

  //  useEffect(() => {
  //     const company_code = sessionStorage.getItem('selectedCompanyCode');
      
  //     fetch(`${config.apiBaseUrl}/status`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ company_code })
  //     })
  //       .then((data) => data.json())
  //       .then((val) => setStatusdrop(val))
  //       .catch((error) => console.error('Error fetching data:', error));
  //   }, []);

  //    useEffect(() => {
  //       fetch(`${config.apiBaseUrl}/status`)
  //         .then((data) => data.json())
  //         .then((val) => {
  //           setStatusdrop(val);
    
  //           if (val.length > 0) {
  //             const firstOption = {
  //               value: val[0].attributedetails_name,
  //               label: val[0].attributedetails_name,
  //             };
  //             setSelectedStatus(firstOption);
  //             setstatus(firstOption.value);
  //           }
  //         });
  //     }, []);

 useEffect(() => {
  const company_code = sessionStorage.getItem('selectedCompanyCode');

  fetch(`${config.apiBaseUrl}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ company_code }),
  })
    .then((response) => response.json())
    .then((val) => {
      setStatusdrop(val);

      if (val.length > 0) {
        const firstOption = {
          value: val[0].attributedetails_name,
          label: val[0].attributedetails_name,
        };
        setSelectedStatus(firstOption);
        setstatus(firstOption.value);
      }
    })
    .catch((error) => {
      console.error('Error fetching status data:', error);
    });
}, []);

    

   const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };

    const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChange = async () => {
    try {
      const body = {
        start_date: Start_date, // Assuming startDate is already available in state
        end_date: End_date,   // Assuming endDate is already available in state
        userid: user,
        Status: Status,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/getTaskHourReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const formattedRows = await response.json();

        if (formattedRows.length > 0) {
          const formatted = formattedRows.map((task) => ({
            First_CheckIn: task.First_CheckIn,
            Last_CheckOut: task.Last_CheckOut,
            total_worked_hours: task.total_worked_hours,
            Total_login_Hours: task.Total_login_Hours,
            user: `${task.user} - ${task.user_name}`, // Combine user and user_name
            userid: task.TaskTitle,
            work_date: task.work_date,
            Status: task.Status,
            Balance_Hours: task.Balance_Hours,
          }));

          setRowDataEmployee(formatted);
        }
      } else if (response.status === 404) {
        console.log("User details not found");
        toast.warning("User details not found");
        setRowDataEmployee([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch user details");
        console.error(errorResponse.details || errorResponse.message);
        setRowDataEmployee([]);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  // const filteredOptionUser = Array.isArray(userDrop)
  //   ? userDrop.map((option) => ({
  //     value: option.user_code,
  //     label: `${option.user_code} - ${option.user_name}`,
  //   }))
  //   : [];

  const filteredOptionUser = Array.isArray(userDrop)
    ? userDrop.map((option) => ({
      value: option.user_code,
      label: `${option.user_code} - ${option.user_name}`,
    }))
    : [];

  useEffect(() => {
    const fetchUserCodes = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/usercode`);
        const data = await response.json();
        console.log("Fetched user codes:", data);

        if (response.ok) {
          const updatedData = [{ user_code: "ALL", user_name: "All" }, ...data];
          setUserDrop(updatedData);

          const defaultOption = {
            value: "ALL",
            label: "All"
          };
          setSelectedUser(defaultOption); 
          setUser(defaultOption.value);  
        } else {
          console.warn("No data found for user codes");
          setUserDrop([]);
        }
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    };

    fetchUserCodes();
  }, []);

  // useEffect(() => {
  //   const fetchUserCodes = async () => {
  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/getTaskUserID`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') })
  //       });
  //       const data = await response.json();

  //       if (response.ok) {
  //         const updatedData = [{ user_code: "ALL", user_Name: "All" }, ...data];
  //         setUserDrop(updatedData);

  //         const defaultOption = {
  //           value: "ALL",
  //           label: "All"
  //         };
  //         setSelectedUser(defaultOption);
  //         setUser(defaultOption.value);
  //       } else {
  //         console.warn("No data found for user codes");
  //         setUserDrop([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user codes:", error);
  //     }
  //   };

  //   fetchUserCodes();
  // }, []);

  // const handleCellClick = async (params) => {
  //   const taskDate = params.data.work_date;
  //   const userID = params.data.user.split(" - ")[0]; // Extract only the userID

  //   try {
  //     const requestBody = {
  //       start_date: taskDate,
  //       userid: userID, // Send only userID
  //       company_code: sessionStorage.getItem('selectedCompanyCode')
  //     };

  //     const response = await fetch(`${config.apiBaseUrl}/getTaskHourReportDetail`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(requestBody),
  //     });

  //     if (response.ok) {
  //       const projectData = await response.json();

  //       if (projectData.length > 0) {
  //         const formatted = projectData.map((task) => ({
  //           DailyTaskID: task.DailyTaskID,
  //           ProjectID: `${task.ProjectID}-${task.ProjectName}`,
  //           DailyTaskTiltle: task.DailyTaskTiltle,
  //           TaskDescription: task.TaskDescription,
  //           userID: task.userID,
  //           HourseTaken: task.HourseTaken,
  //           TaskStauts: task.TaskStauts,
  //           TaskDate: task.TaskDate,
  //           TaskMasterID: task.TaskMasterID,
  //         }));
  //         setRowDataTask(formatted);
  //       }
  //     } else if (response.status === 404) {
  //       console.log("User details not found");
  //       toast.warning("User details not found");
  //     } else {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message || "Failed to fetch user details");
  //       console.error(errorResponse.details || errorResponse.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating user details:", error);
  //   }
  // };

  const handleCellClick = async (params) => {
    const taskDate = params.data.work_date;
    const userID = params.data.user.split(" - ")[0];
    const companyCode = sessionStorage.getItem('selectedCompanyCode');

    const requestBody = {
      start_date: taskDate,
      userid: userID,
      company_code: companyCode
    };

    try {
      const taskResponse = await fetch(`${config.apiBaseUrl}/getTaskHourReportDetail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (taskResponse.ok) {
        const projectData = await taskResponse.json();
        if (projectData.length > 0) {
          const formatted = projectData.map((task) => ({
            DailyTaskID: task.DailyTaskID,
            ProjectID: `${task.ProjectID}-${task.ProjectName}`,
            DailyTaskTiltle: task.DailyTaskTiltle,
            TaskDescription: task.TaskDescription,
            userID: task.userID,
            HourseTaken: task.HourseTaken,
            TaskStauts: task.TaskStauts,
            TaskDate: task.TaskDate,
            TaskMasterID: task.TaskMasterID,
            TotalHours_per_Ticket: task.TotalHours_per_Ticket,
          }));
          setRowDataTask(formatted);
        }
      } else if (taskResponse.status === 404) {
        toast.warning("Task details not found");
        setRowDataTask([]);
      } else {
        const errorResponse = await taskResponse.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        setRowDataTask([]);
      }

      const checkInResponse = await fetch(`${config.apiBaseUrl}/getEmployeeCheckInCheckOut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (checkInResponse.ok) {
        const checkInData = await checkInResponse.json();
        setRowDataEmployeeTime(checkInData); 
      } else if (checkInResponse.status === 404) {
        toast.warning("Check-in/out details not found");
        setRowDataEmployeeTime([]);
      } else {
        const errorResponse = await checkInResponse.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        setRowDataEmployeeTime([]);
      }

    } catch (error) {
      console.error("Error while handling cell click:", error);
      toast.error("Something went wrong while fetching details.");
    }
  };

const handleNavigateWithRowData = (selectedRow) => {
  if (!selectedRow || !selectedRow.ProjectID) {
    console.error("Invalid selected row");
    return;
  }

  const pureProjectID = selectedRow.ProjectID.split("-").slice(0, 2).join("-"); // "YJKT-1"

  const cleanedRow = {
    ...selectedRow,
    ProjectID: pureProjectID,
    TaskMasterID: selectedRow.TaskMasterID, // Add this line
  };

  navigate("/ProjectDetails", { state: { selectedRow: cleanedRow } });
};



  const transformRowData = (data) => {
    return data.map(row => ({
      "Date": new Date(row.work_date).toISOString().split('T')[0], 
      "Employee ID": row.user,
      "Check IN ": row.First_CheckIn,
      "Check Out": row.Last_CheckOut,
      "Total Login Hours": row.Total_login_Hours,
      "Total Worked Hours": row.total_worked_hours,
    }));
  };


  const handleExportToExcel = () => {
    if (rowDataEmployee.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [
      ['Task hours & Time Tracking'],
    ];

    const transformedData = transformRowData(rowDataEmployee);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Task hours & Time Tracking');
    XLSX.writeFile(workbook, 'Task Hours & Time Tracking.xlsx');
  };

  const getRowStyle = (params) => {
    if (params.data.Status?.toLowerCase() === 'Absent') {
      return { backgroundColor: 'red', color: 'white' };
    }
    return null;
  };

  const transformData = (data) => {
    return data.map(row => ({
      "Date": new Date(row.TaskDate).toISOString().split('T')[0], // 'YYYY-MM-DD'
      "Project ID": row.ProjectID,
      "Task Master ID": row.TaskMasterID,
      "Task ID": row.DailyTaskID,
      "Daily Task Title": row.DailyTaskTiltle,
      "Description": row.TaskDescription,
      "User": row.userID,
      "Spend Hours": row.HourseTaken,
      "Status": row.TaskStauts,
    }));
  };

  const handleExcel = () => {
    if (rowDataTask.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [
      ['Task hours & Time Tracking'],
    ];

    const transformedData = transformData(rowDataTask);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Task hours & Time Tracking');
    XLSX.writeFile(workbook, 'Task Hours & Time Tracking.xlsx');
  };

  // Code for how many times check in and check out per employee
  const [rowDataEmployeeTime, setRowDataEmployeeTime] = useState([]);

  const columnEmployeeTime = [
    { headerName: 'Date', field: 'DayofLogin', valueFormatter: (params) => formatDate(params.value),width:'110' },
    { headerName: 'Employee ID', field: 'userID',width:'120'},
    { headerName: 'Check In', field: 'Checkin' , sort:"asc",width:'120'},
    { headerName: 'Check Out', field: 'CheckOut',width:'120' },
    { headerName: 'Total Login  Hours', field: 'TotalHours',width:'150' }
  ];


  return (
    <div class="container-fluid Topnav-screen">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className=" p-0 shadow-lg bg-white mb-2 rounded-top  mt-2">
            <div className="mb-0 d-flex justify-content-between">
              <h1 align="left" className="">Task Hours & Time Tracking</h1>
              <div className="purbut">
                <div className="d-flex justify-content-end me-5">
                  <button className="btn btn-dark mt-2 mb-2 rounded-3" onClick={handleExportToExcel} title='Excel'>
                    <i class="fa-solid fa-file-excel"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-2 p-1 shadow-lg bg-white rounded">
            <div className='row ms-4 pt-3 mb-2'>
              <div className='col-md-3 form-group'>
                <div className='exp-form-floating'>
                  <label>Start Date</label>
                  <input
                    required title="Please Choose the Date"
                    type='date'
                    value={Start_date}
                    onChange={(e) => setStart_date(e.target.value)}
                    className='exp-input-field p-1'
                  />
                </div>
              </div>
              <div className='col-md-3 form-group'>
                <div className='exp-form-floating'>
                  <label>End Date</label>
                  <input
                    type='date'
                    required title="Please Choose the Date"
                    value={End_date}
                    onChange={(e) => setEnd_date(e.target.value)}
                    className='exp-input-field p-1'
                  />
                </div>
              </div>
              <div className='col-md-3 form-group'>
                <div className='exp-form-floating'>
                  <label>User</label>
                  <Select
                    type='Text'
                    className='exp p-1'
                    onChange={handleChangeUser}
                    value={selectedUser}
                    required title="Please Select the User ID"
                    options={filteredOptionUser}
                    onKeyDown={(e) => e.key === "Enter" && handleChange()}
                  />
                </div>
              </div>
               <div className='col-md-3 form-group'>
                <div className='exp-form-floating'>
                  <label>Status</label>
                  <Select
                    type='Text'
                    className='exp p-1'
                    onChange={handleChangeStatus}
                    value={selectedStatus}
                    required title="Please Select the User ID"
                    options={filteredOptionStatus}
                    onKeyDown={(e) => e.key === "Enter" && handleChange()}
                  />
                </div>
              </div>
              <div className="col-md-2 form-group mb-2 mt-4">
                <div class="exp-form-floating">
                  <div class=" d-flex  justify-content-center">
                    <div class=''>
                      <icon className="popups-btn fs-6 p-3" onClick={handleChange} required title="Search">
                        <i className="fas fa-search"></i>
                      </icon>
                    </div>
                    <div>
                      <icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Refresh">
                        <i className="fa-solid fa-arrow-rotate-right" />
                      </icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-1 p-3">
              <div className="ag-theme-alpine flex-grow-1" style={{ minWidth: '60%', height: 300 }}>
                <AgGridReact
                  columnDefs={columnEmployee}
                  getRowStyle={getRowStyle}
                  rowData={rowDataEmployee}
                  rowHeight={27}
                  headerHeight={27}
                  onCellClicked={handleCellClick}
                />
              </div>
              <div className="ag-theme-alpine" style={{ minWidth: '35%', height: 300 }}>
                <AgGridReact
                  columnDefs={columnEmployeeTime}
                  rowData={rowDataEmployeeTime}
                  rowHeight={27}
                  headerHeight={27}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" p-0 shadow-lg bg-white rounded">
          <div className="d-flex justify-content-end me-5">
            <button className="btn btn-dark mt-2 mb-2 rounded-3" onClick={handleExcel} title='Excel'>
              <i class="fa-solid fa-file-excel"></i>
            </button>
          </div>
          <div className=" p-0  bg-white  mb-2">
            <div className='pt-3 pb-3 ms-2'>
              <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnTask}
                  rowData={rowDataTask}
                  rowHeight={27}
                  headerHeight={27}
                  onCellClicked={(params) => handleNavigateWithRowData(params.data)}

                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAgGridComponent;
