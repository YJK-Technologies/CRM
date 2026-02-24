import Select from "react-select";
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
const config = require('../Apiconfig');

const ProjectProductivityChart = ({ minY = 1, maxY = 50 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  const [rowData] = useState([
    { taskTitle: 'Task 1', user: 'User 1', description: 'Task 1 description', startDate: '2025-02-01', endDate: '2025-02-05', estimatedHours: 8, bufferHours: 2, totalHours: 10, taskStatus: 'Completed' },
    { taskTitle: 'Task 2', user: 'User 2', description: 'Task 2 description', startDate: '2025-02-02', endDate: '2025-02-06', estimatedHours: 10, bufferHours: 3, totalHours: 13, taskStatus: 'In Progress' },
    { taskTitle: 'Task 3', user: 'User 3', description: 'Task 3 description', startDate: '2025-02-03', endDate: '2025-02-07', estimatedHours: 5, bufferHours: 1, totalHours: 6, taskStatus: 'Not Started' },
  ]);

  const columnDefs = [
    { headerName: 'S.No', field: 'taskTitle' },
    { headerName: 'Project Code', field: 'user' },
    { headerName: 'Project Name', field: 'description' },
    { headerName: 'Estimated Hours', field: 'estimatedHours' },
    { headerName: 'Hours Taken', field: 'totalHours' },
    { headerName: 'Project Description', field: 'description' },
  ];

  const [projectDrop, setProjectDrop] = useState([]);
  const [employeeProjectDrop, setEmployeeProjectDrop] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEmployeeProject, setSelectedEmployeeProject] = useState('');
  const [project, setProject] = useState("");
  const [employeeProject, setEmployeeProject] = useState("");
  const [userDrop, setUserDrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState("");

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getProjectDrop`)
  //     .then((data) => data.json())
  //     .then((val) => setProjectDrop(val));
  // }, []);

  useEffect(() => {
    const fetchProjectCode = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getProjectDrop`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"), // Or pass from props/state if needed
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          const updatedData = [{ ProjectID: "All", ProjectName: "All" }, ...data];
          setProjectDrop(updatedData);
          setEmployeeProjectDrop(updatedData);
  
          if (updatedData.length > 0) {
            const defaultProject = {
              value: updatedData[0].ProjectID,
              label: `${updatedData[0].ProjectID} - ${updatedData[0].ProjectName}`,
            };
  
            setSelectedProject(defaultProject);
            setSelectedEmployeeProject(defaultProject);
            setProject(defaultProject.value);
            setEmployeeProject(defaultProject.value);
          }
        } else {
          console.warn("No data found");
          setProjectDrop([]);
          setEmployeeProjectDrop([]);
        }
      } catch (error) {
        console.error("Error fetching project codes:", error);
      }
    };
  
    fetchProjectCode();
  }, []);
  

  useEffect(() => {
    const fetchUserCode = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/usercode`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) {
          const updatedData = [{ user_code: "All", user_name: "All" }, ...data];
          setUserDrop(updatedData);

          // ✅ Automatically select the first value ("All") on load
          if (updatedData.length > 0) {
            const defaultProject = {
              value: updatedData[0].user_code,
              label: `${updatedData[0].user_code} - ${updatedData[0].user_name}`,
            };

            setSelectedUser(defaultProject);
            setUser(defaultProject.value);
          }
        } else {
          console.warn("No data found");
          setUserDrop([]);
        }
      } catch (error) {
        console.error("Error fetching item codes:", error);
      }
    };

    fetchUserCode();
  }, []);

  const filteredOptionUser = Array.isArray(userDrop)
  ? userDrop.map((option) => ({
    value: option.user_code,
    label: `${option.user_code} - ${option.user_name}`,
  }))
  : [];

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUser(selectedUser ? selectedUser.value : '');
  };

  const filteredOptionProject = Array.isArray(projectDrop)
    ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : [];

  const filteredProject = Array.isArray(projectDrop)
    ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : [];

  const handleChangeProject = (selectedProject) => {
    setSelectedProject(selectedProject);
    setProject(selectedProject ? selectedProject.value : '');
  };

  const handleProject = (selectedProject) => {
    setSelectedEmployeeProject(selectedProject);
    setEmployeeProject(selectedProject ? selectedProject.value : '');
  };

  useEffect(() => {
    handleProjectChart();
  }, [project])

  const handleProjectChart = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/PMSDashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ProjectID: project }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Data Not Found");
        const errorResponse = await response.json();
        throw new Error(errorResponse.details || errorResponse.message);
      }

      const fetchedData = await response.json();
      console.log("Fetched Data:", fetchedData);

      const chartData = fetchedData.map((item) => ({
        name: item.ProjectID,
        Planned: item.EstimatedHours || 0,
        Actual: item.TimeTaken || 0,
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching search data:", error.message);
      setError(error.message);
      setData([]);
    }
  };
  
  useEffect(() => {
    handleEmployeeProjectChart();
  }, [employeeProject,user])

  const handleEmployeeProjectChart = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/PMSEmployeechart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ProjectID: employeeProject, userid:user }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Data Not Found");
        const errorResponse = await response.json();
        throw new Error(errorResponse.details || errorResponse.message);
      }

      const fetchedData = await response.json();
      console.log("Fetched Data:", fetchedData);

      const chartData = fetchedData.map((item) => ({
        name: item.projectID,
        Actual: item.timetaken || 0,
      }));

      setData1(chartData);
    } catch (error) {
      console.error("Error fetching search data:", error.message);
      setError(error.message);
      setData1([]);
    }
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div className="row" >
        <div className="p-0  shadow-lg bg-white rounded-3 mb-2 ms-2">
          <div className="purbut mb-0 d-flex justify-content-between ">
            <h1 align="left" >Project Chart Report</h1>
          </div>
        </div>
        <div className="" >
      <div className="d-flex justify-content-between" >
        <div className="p-0  shadow-lg bg-white rounded-3 mb-2 ms-0 col-lg-6 col-12">
          <div className="">
            <div className=" rounded p-4 mb-2">
              <div className="d-flex justify-content-between">
                <h2 className="h5 mb-3">Project Analysis</h2>
                <div className="col-5  form-group mb-1  d-flex justify-content-end">
                  <Select
                    id="transactionType"
                    className="border-secondary col-md-10"
                    placeholder=""
                    onChange={handleChangeProject}
                    value={selectedProject}
                    options={filteredOptionProject}
                    required
                  />
                </div>
              </div>
              <div style={{ width: "100%", height: "350px", overflow: "hidden", marginTop: "20px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Planned" fill="#ffa833" />
                    <Bar dataKey="Actual" fill="#d45cfe" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="p-0  shadow-lg bg-white rounded-3 mb-2 col-lg-6 ms-2 col-12">
          <div className="">
            <div className=" rounded p-4 mb-2 col-10">
              <div className="d-flex justify-content-between">
                <h2 className="h5 mb-3">Employee Based Analysis</h2>
                <div className="col-5  form-group mb-1 d-flex justify-content-end col-md-5">
                  <Select 
                  id="transactionType" 
                  className="border-secondary col-md-8 me-1" 
                  placeholder="" 
                  required 
                  onChange={handleProject}
                  value={selectedEmployeeProject}
                  options={filteredProject}
                  />
                  <Select 
                  id="transactionType" 
                  className="border-secondary col-md-8" 
                  placeholder="" 
                  required 
                  onChange={handleChangeUser}
                  value={selectedUser}
                  options={filteredOptionUser}
                  />
                </div>
              </div>
              <div style={{ width: "100%", height: "350px", overflow: "hidden", marginTop: "20px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data1}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* <Bar dataKey="Planned" fill="#ffa833" /> */}
                    <Bar dataKey="Actual" fill="#d45cfe" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
     {/*  <div className="shadow-lg bg-white rounded pb-4 pt-3  ">
          <h5 className="d-flex justify-content-start">Search Criteria:</h5>
         <div className="ag-theme-alpine" style={{ height: 250, width: '100%' }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
              />
            </div>
            </div>
            */}
      </div>
    </div>
  );
};

export default ProjectProductivityChart;
