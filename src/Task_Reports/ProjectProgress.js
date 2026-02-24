import React, { useState,useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import * as XLSX from 'xlsx';

const config = require("../Apiconfig");







const MyAgGridComponent = () => {
  // const [rowData, setrowData] = useState([{
  //   taskTitle: '', user: '', projectdescription: '', projectname: '',
  //   startdate: '', enddate: '', ProjectManager: '', estimatedhours: '', totalHours: '', prioritylevel: ''
  // }])
  const [rowData, setrowData] = useState([])
  const [rowDataReport, setrowDataReport] = useState(" ")
  const navigate = useNavigate();
    const [ProjectID, setProjectID] = useState("");
 const [ProjectName, setProjectName] = useState('');
 const [PriorityLevel, setPriorityLevel] = useState('');
 const [selectedPriortyLeavel, setSelectedPriortyLeavel] = useState('');
   const [StartDate, setStartDate] = useState("");
     const [PriorityDrop, setPriorityDrop] = useState([]);
   const [EndDate, setEndDate] = useState("");
   const [Priority, setPriority] = useState("");
     const [selectedmanager, setselectedmanager] = useState('');
      const [Managerdrop, setManagerdrop] = useState([]);
     const [manager, setmanager] = useState("");
    //  const [rowdata, setrowData] = useState([]); 
     const [error, setError] = useState('');
     const [projectDrop, setProjectDrop] = useState([]);
       const [project, setProject] = useState("");
         const [selectedProject, setSelectedProject] = useState([]);
  
   const [selectedPriorty, setSelectedPriorty] = useState("");
    const [ProjectManager, setProjectManager] = useState('');
    
    // const transformRowData = (data) => {
    //   return data.map(row => ({
    //     "S.No": row.Item_SNo,
    //     "Item Code": row.item_code,
    //     "Quantity ": row.qty.toString(),
    //   }));
    // };
    function generateData() {
      let data = [];
      for (let i = 1; i <= 100; i++) {
        data.push({
          SNo: i,
          name: `Person ${i}`,
          age: Math.floor(Math.random() * 50) + 20,  // Random age between 20 and 70
          country: `Country ${Math.floor(Math.random() * 10) + 1}` // Random countries
        });
      }
      return data;
    }

  const columnDefs = [
    { headerName: 'S.No', 
      field: 'SNo',
 
      rowData: generateData()  
      },
    { headerName: 'Project ID & Name',
       field: 'projectid',
      //  filter: 'agTextColumnFilter',
    
        valueGetter: (params) => params.data.projectid_display 
      },
    // { headerName: 'Project Name', field: 'projectname' },
    { 
      headerName: 'Priority', 
      field: 'prioritylevel' ,
      // filter: 'agTextColumnFilter'
    },

    {
       headerName: 'Start Date', 
       field: 'startdate',
          // filter: 'agTextColumnFilter',
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
    { headerName: 'End date',
       field: 'enddate',
          // filter: 'agTextColumnFilter',
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
       headerName: 'Manager', 
      field: 'ProjectManager',
      
        //  filter: 'agTextColumnFilter'
     },
    { 
      headerName: 'Estimated Hours', 
      field: 'estimatedhours' ,
        //  filter: 'agTextColumnFilter'
    },
    { 
      headerName: 'Actual Hours', 
      field: 'Actual_hours' ,   
      // filter: 'agTextColumnFilter'
    },
    { headerName: 'Project Description', 
      field: 'projectdescription' ,
        //  filter: 'agTextColumnFilter'
    },
  ];

  const columnDefs2 = [
    { headerName: 'S.No', field: 'sno',maxlength:'150',maxwidth:'150' },
    { headerName: 'Project ID', field: 'projectid' },
    { headerName: 'Task Master ID', field: 'TaskMasterID' },
    { headerName: 'Task Title', field: 'TaskTitle' },
    { headerName: 'User ID & User Name', field: 'userID' },
    // { headerName: 'User Name', field: 'user_name' },
    { headerName: 'Estimated Hours', field: 'EstimatedHours' },
    { headerName: 'Actual Hours', field: 'Actual_hours' },
    { headerName: 'Description', field: 'Description' },
    { headerName: 'Status', field: 'TaskStatus' }

  ];
  const handleSearch = async () => {
    try {
      // Preparing the body for the POST request
      const body = {
        ProjectID: project, 
        ProjectName: ProjectName, 
        ProjectManager: ProjectManager,
        startdate: StartDate, 
        enddate: EndDate, 
        PriorityLevel: PriorityLevel, 
        company_code:sessionStorage.getItem("selectedCompanyCode")
      };
  
      // Making the POST request to the backend API
      const response = await fetch(`${config.apiBaseUrl}/getprojectSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        const fetchedData = await response.json();
       console.log(fetchedData)
        const newRows = fetchedData.map((matchedItem,index) => ({
          SNo: index + 1,
          projectid_display: `${matchedItem.projectid} - ${matchedItem.projectname}`,
          ProjectManager: matchedItem.ProjectManager,
          startdate: matchedItem.startdate,
          enddate: matchedItem.enddate,
          prioritylevel: matchedItem.prioritylevel,
          estimatedhours: matchedItem.estimatedhours,
          projectdescription: matchedItem.projectdescription,
          Actual_hours:matchedItem.Actual_hours
        }));
  
        // Setting the row data in the state
        setrowData(newRows);
      } else if (response.status === 404) {
        // Handle case where no data is found
        console.log("Data Not found");
        toast.warning("Data Not found");
        setrowData([]);
      } else {
        // Handle other errors
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
        console.error(errorResponse.details || errorResponse.message);
        setrowData([]);
      }
    } catch (error) {
      // Catch any errors during the request
      console.error("Error fetching search data:", error);
      toast.error("Error occurred while fetching data");
    }
  };
  

 const reloadData = () => {
  window.location.reload()
   };
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleChangeProject = (selectedProject) => {
    setSelectedProject(selectedProject);
    setProject(selectedProject ? selectedProject.value : '');
  };

  const company_code =sessionStorage.getItem("selectedCompanyCode")

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

  const filteredOptionProject = [{ value: 'All', label: 'All' }, ...(
    Array.isArray(projectDrop) ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : []
  )]
 
    useEffect(() => {
      fetch(`${config.apiBaseUrl}/ESSManager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // user_code: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      })
        .then((response) => response.json())
        .then(setManagerdrop)
        .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

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

  const filteredOptionPriorityLevel = [{ value: 'All', label: 'All' }, ...PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const handleChangePriorityLevel = (selectedPriortyLeavel) => {
    setSelectedPriortyLeavel(selectedPriortyLeavel);
    setPriorityLevel(selectedPriortyLeavel ? selectedPriortyLeavel.value : '');
  };
  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setProjectManager(selectedOption ? selectedOption.value : '');
    setError(false);
  };

  const filteredOptionManager = [{ value: 'All', label: 'All' }, ...Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getProjectReport`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const updatedData = result.map((item, index) => ({
          ...item,
          SNo: index + 1,
          Terms_conditions: item.attributedetails_name,
          projectid_display: `${item.projectid} - ${item.projectname}`, // Display field
        }));
        setrowData(updatedData);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);
  

  const handleCellClick = async (params) => {
    const Projectid = params.data.projectid;
  
    try {
      const requestBody = {
        projectid: Projectid,
      };
  
      const response = await fetch(`${config.apiBaseUrl}/getProjectDetailReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const projectData = await response.json();
  
        if (projectData.length > 0) {
          const formatted = projectData.map((task, index) => ({
            sno: index + 1,
            projectid: task.projectid,
            TaskMasterID: task.TaskMasterID,
            TaskTitle: task.TaskTitle,
            userID: `${task.userID} - ${task.user_name}`, // Combine userID and user_name
            TaskDescription: task.TaskDescription,
            HourseTaken: task.HourseTaken,
            TaskStatus: task.TaskStatus, // Fixed potential typo
            Description: task.Description,
            EstimatedHours: task.EstimatedHours,
            Actual_hours: task.Actual_hours,
            TaskDate: task.TaskDate
          }));
  
          setrowDataReport(formatted);
        } else {
          console.log("No project details found");
          toast.warning("No project details found");
          setrowDataReport([]); // Clear data if no project details exist
        }
      } else if (response.status === 404) {
        console.log("User details not found");
        toast.warning("User details not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch user details");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };
  
  const handleNavigateWithRowData = (selectedRowS) => {
    if (!selectedRowS || !selectedRowS.TaskMasterID) {
      console.error("No TaskMasterID found in the selected row");
      return;
    }
  
    navigate("/ProjectDetails", { state: { TaskMasterID: selectedRowS.TaskMasterID, projectid:selectedRowS.projectid } });
  };
  
  const transformRowData = (data) => {
    return data.map(row => ({
      "Project ID": row.projectid,
      "Task Master ID": row.TaskMasterID,
      "Task Title ": row.TaskTitle,
      "User ID & User Name": row.userID,
      "Estimated Hours": row.EstimatedHours,
      "Actual Hours": row.Actual_hours,
      "Description": row.Description,
      "Status": row.TaskStatus,
 
    }));
  };

 const handleExportToExcel = () => {
    if (rowDataReport.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [
      ['Project Progress'], 
    ];

    const transformedData = transformRowData(rowDataReport);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

     XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Project_Progress');
    XLSX.writeFile(workbook, 'Project_Progress.xlsx');
  };

  

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className=" p-0 shadow-lg bg-white rounded mb-2">
            <div className="purbut mb-0 d-flex justify-content-between">
              <h1 align="left" className="ms-4">Project Progress</h1>
              <div className="purbut">
              <div className="d-flex justify-content-end me-5">             
                <button className="btn btn-dark mt-2 mb-1 rounded-3" onClick={handleExportToExcel} title='Excel'>
                  <i class="fa-solid fa-file-excel"></i>
                </button>
              </div>
            </div>
            </div>
        
          </div>
          <div className="shadow-lg bg-white rounded-bottom mt-2 mb-2 p-3">
                          <div class="row ms-3 me-3 ">
                            <div className="col-md-3 form-group mb-2">
                              <div className="exp-form-floating">
                                <div className="">
                                  <div>
                                    <label for="sname"> Project ID
                                      <span className="text-danger"></span></label>
          
                                  </div>
                                 
                                </div>
                                  <Select
                                    id="ProjectID"
                                    className="exp-input-field"
                                    type="text"
                                    placeholder=""
                                    required title="Please Select the Project ID"
                                    onChange={handleChangeProject}
                                    value={selectedProject}
                                    options={filteredOptionProject}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    maxLength={50}
                                    readOnly
                                  />
                              </div>
                            </div>
                            <div className="col-md-3 form-group mb-2">
                              <div class="exp-form-floating">
                                <div class="d-flex justify-content-start">
                                  <label htmlFor="EmployeeId" className={`${error && !ProjectName ? 'red' : ''}`}>
                                    Project Name
                                  </label>
                                  <div><span className="text-danger">*</span></div>
                                </div>
                                <input
                                  id="loanID"
                                  type="text"
                                  className="form-control exp-input-field p-2"
                                  required title="Please Enter the Project Name"
                                  maxLength={255}
                                  value={ProjectName}
                                  onChange={(e) => setProjectName(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 form-group mb-2">
                              <div class="exp-form-floating">
                                <div class="d-flex justify-content-start">
                                  <div> <label for="add1" className={`${error && !ProjectManager ? 'red' : ''}`}>
                                    Project Manager
                                  </label></div>
                                  <div><span className="text-danger">*</span></div>
                                </div>
                                <Select
                                  id="LoanEligibleAmount"
                                  class="exp-input-field form-control p-2"
                                  type="text"
                                  placeholder=""
                                  required title="Please Select the Project Manager"
                                  value={selectedmanager}
                                  options={filteredOptionManager}
                                  onChange={handleChangemanager}
                                  maxLength={18}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                              </div>
                            </div>
                            {/* <div className="col-md-3 form-group mb-2">
                              <div class="exp-form-floating">
                                <label for="add3" className={`${error && !EstimatedHours ? 'red' : ''}`}>
                                  Estimated Hours<span className="text-danger">*</span>
                                </label><input
                                  id="EndDate"
                                  class="exp-input-field form-control"
                                  type="text"
                                  placeholder=""
                                  required title="Please enter the address"
                                  value={EstimatedHours}
                                  onChange={(e) => setEstimatedHours(e.target.value)}
                                  maxLength={100}
          
                                />
                              </div>
                            </div> */}
                            {/* <div className="col-md-3 form-group mb-2">
                              <div class="exp-form-floating">
                                <div class="d-flex justify-content-start">
                                  <div>
                                    <label for="sname" className={`${error && !ProjectDescription ? 'red' : ''}`}>
                                      Project Description </label></div><div><span className="text-danger">*</span></div>
                                </div>
          
                                <textarea
                                  id="Approvedby"
                                  class="exp-input-field form-control "
                                  required title="Please enter the founded date"
                                  value={ProjectDescription}
                                  onChange={(e) => setProjectDescription(e.target.value)}
          
                                />
          
                                {/* {error && !approvedBy && <div className="text-danger">Project Description should not be blank</div>} */}
          
          
          
                              {/* </div>
                            </div> */}
           
                            <div className="col-md-3 form-group mb-2">
                              <div class="exp-form-floating">
                                <div class="d-flex justify-content-start">
                                  <div> <label for="add2" className={`${error && !StartDate ? 'red' : ''}`}>
                                    Start Date
                                  </label> </div>
                                  <div><span className="text-danger">*</span></div>
                                </div>
                                <input
                                  id="StartDate"
                                  class="exp-input-field form-control"
                                  type="date"
                                  placeholder=""
                                  required title="Please Choose the Date"
                                  value={StartDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  maxLength={100}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          
                                />
          
                              </div>
                            </div>
          
                            <div className="col-md-3 form-group mb-2">
                              <div class="exp-form-floating">
                                <div class="d-flex justify-content-start">
                                  <div>
                                    <label for="add3" className={`${error && !EndDate ? 'red' : ''}`}>
                                      End Date  </label></div>
                                  <div><span className="text-danger">*</span></div></div>
                                <input
                                  id="EndDate"
                                  class="exp-input-field form-control"
                                  type="date"
                                  placeholder=""
                                  required title="Please Choose the Date"
                                  value={EndDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  maxLength={100}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          
                                />
                              </div>
                            </div>
                            <div className="col-md-3 form-group mb-2">
                              <div class="exp-form-floating">
                                <div class="d-flex justify-content-start">
                                  <div> <label for="tcode" className={`${error && !PriorityLevel ? 'red' : ''}`}>
                                    Priority Level  </label></div>
                                  <div><span className="text-danger">*</span></div></div>
          
                                <Select
                                  id="PriorityLevel"
                                  className="exp-input-field"
                                  type="text"
                                  required title="Please Select the Priority Level"
                                  placeholder=""
                                  value={selectedPriortyLeavel}
                                  onChange={handleChangePriorityLevel}
                                  options={filteredOptionPriorityLevel}
                                  maxLength={15}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                              </div>
                            </div>
                           
                          

                            <div className="col-md-2 form-group mt-4">
                      <div class="exp-form-floating">
                        <div class=" d-flex justify-content-center ">
                          <div class="">
                            <icon
                              className="popups-btn fs-6 p-3"
                              onClick={handleSearch}
                              required
                              title="Search"
                            >
                              <i className="fas fa-search"></i>
                            </icon>
                          </div>
                          <div>
                            <icon
                              className="popups-btn fs-6 p-3"
                              required
                              onClick={reloadData}
                              title="Refresh"
                            >
                              <i class="fa-solid fa-rotate-right"></i>
                            </icon>
                          </div>
                        </div>{" "}
                      </div>
                    </div>
                    </div>
                            </div>
            
          <div className=" p-0 shadow-lg bg-white rounded">
            <div className='pt-3 pb-3 ms-4'>
              <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  rowHeight={27}
                  headerHeight={27}
                  onCellClicked={handleCellClick}

                />
              </div>
            </div>
            <div className='pt-3 pb-3 ms-4'>
              <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefs2}
                  rowData={rowDataReport}
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
