import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import "../apps.css";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'ag-grid-autocomplete-editor/dist/main.css';
import "../mobile.css";
import { ToastContainer, toast } from 'react-toastify';
import TaxInputPopup from '../TaskMasters/TaskInput.js'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select'
import Swal from 'sweetalert2';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, AtomicBlockUtils, SelectionState, convertToRaw } from "draft-js";
import { Modifier } from "draft-js";
import * as XLSX from "xlsx";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { useLocation } from "react-router-dom";  // ✅ Import useLoc
const config = require('../Apiconfig');

const AccountInformation = () => {
  const [open2, setOpen2] = React.useState(false);
  const [ProjectID, setProjectCode] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [ProjectName, setProjectName] = useState("");
  const [ProjectDescription, setDescriptions] = useState("");
  const [Manager, setManager] = useState("");
  const [StartDate, setstartdate] = useState("");
  const [EndDate, setEnddate] = useState("");
  const [TaskTitle, setTaskTitle] = useState("");
  const [EstimatedHours, setEstimatedHours] = useState("");
  const [userID, setuserID] = useState("");
  const [endDate, setendDate] = useState("");
  const [BufferHours, setBufferHours] = useState("");
  const [startdate, setStartdate] = useState("");
  const [Description, setDescription] = useState("");
  const [TaskStatus, setTaskStatus] = useState("");
  const [HourseTaken, setHourseTaken] = useState("");
  const [rowData, setRowData] = useState([]);
  const [text, setText] = useState('');
  const location = useLocation();
  const { selectedRow } = location.state || {};
  const [tasktitle, settasktitle] = useState("");
  const [usercode, setusercode] = useState("");
  const [estimatedhours, setestimatedhours] = useState("");
  const [selectedtstatusSC, setselectedtstatusSC] = useState('');
  const [status_typeSC, setstatus_typeSC] = useState('');
  const [taskid, settaskid] = useState('');
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedPriortyLeavel, setSelectedPriortyLeavel] = useState('');
  const [PriorityDrop, setPriorityDrop] = useState([]);
  const [PriorityLevel, setPriorityLevel] = useState('');
  const [error, setError] = useState("");
  const [dailytask, setdailytask] = useState("");
  const quillRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [usercodedrop, setusercodedrop] = useState([]);
  const [taskmasterid, settaskmasterid] = useState("");
  const [Tasktitle, setTasktitle] = useState("");
  const [priority, setpriority] = useState("");
  const [description, setdescription] = useState("");
  const [Ticketid, setTicketid] = useState("");
  const [selectedProject, setSelectedProject] = useState([]);
  const [projectDrop, setProjectDrop] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user_images, setuser_image] = useState("");
  const [fileType, setFileType] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [taskFiles, setTaskFiles] = useState({});
  const [fetchedFiles, setFetchedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);



  const TaskMasterID = location.state?.TaskMasterID || null;
  const projectid = location.state?.projectid || null;

  console.log(TaskMasterID)
  console.log(projectid)




  const [taskDetails, setTaskDetails] = useState([{ taskDate: '', taskMasterID: '', dailyTaskTitle: '', userId: '', userName: '', taskDescription: '', hoursTaken: '', PriorityLevel: '', TaskStauts: '', fileBuffer: '' }]);


  const handleRemove = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove selected image
  };

  const handleClickOpen = (params) => {
    setOpen2(true);
    console.log("Opening popup...");
  };

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setusercode(selectedUser ? selectedUser.value : "");
    setError(false);
  };

  const filteredOptionUser = usercodedrop.map((option) => ({
    value: option.user_code,
    label: `${option.user_code} - ${option.user_name}`,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((data) => data.json())
      .then((val) => setusercodedrop(val));
  }, []);

  const handleChangestatusSC = (selectedstatus) => {
    setselectedtstatusSC(selectedstatus);
    setstatus_typeSC(selectedstatus ? selectedstatus.value : '');
  };

  const filteredOptionTransactionSC = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


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
      .then((val) => setStatusdrop(val));
  }, []);

  const handleChangePriorityLevel = (selectedPriortyLeavel) => {
    setSelectedPriortyLeavel(selectedPriortyLeavel);
    setPriorityLevel(selectedPriortyLeavel ? selectedPriortyLeavel.value : '');
  };

  const filteredOptionPriorityLevel = PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));



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

 const handleTaskClick = async (taskMasterID) => {
  try {
    const body = {
      TaskMasterID: taskMasterID,
      company_code: sessionStorage.getItem("selectedCompanyCode"),
    };

    const response = await fetch(`${config.apiBaseUrl}/getTaskDetail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const fetchedData = await response.json();

      if (fetchedData.length > 0) {
        const task = fetchedData[0];

        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        };

        // Set basic task info
        setTaskTitle(task.TaskTitle);
        setEstimatedHours(task.EstimatedHours);
        setendDate(formatDate(task.EndDate));
        setStartdate(formatDate(task.StartDate));
        setuserID(task.userID);
        setBufferHours(task.BufferHours);
        setDescription(task.Description);
        setTaskStatus(task.TaskStatus);
        setHourseTaken(task.HourseTaken);

        // 🧠 Convert document buffer to previewable file
        if (task.Documents && task.Documents.data) {
          const byteArray = new Uint8Array(task.Documents.data);

          // Detect file type
          const firstByte = byteArray[0];
          let mimeType = "";
          let fileType = "";

          if (firstByte === 0x25) {
            // PDF (starts with %)
            mimeType = "application/pdf";
            fileType = "pdf";
          } else if (firstByte === 0xff) {
            // JPEG
            mimeType = "image/jpeg";
            fileType = "image";
          } else if (firstByte === 0x89) {
            // PNG
            mimeType = "image/png";
            fileType = "image";
          } else {
            mimeType = "application/octet-stream"; // fallback
            fileType = "unknown";
          }

          const blob = new Blob([byteArray], { type: mimeType });
          const blobUrl = URL.createObjectURL(blob);

          setFetchedFiles([
            {
              name: task.Documents.name,
              type: fileType,
              mimeType: mimeType,
              url: blobUrl,
              blob: blob,
            },
          ]);
        } else {
          setFetchedFiles([]);
        }
      }
    } else if (response.status === 404) {
      toast.warning("Data Not found");
      setManager("");
      setFetchedFiles([]);
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to fetch project details");
      setFetchedFiles([]);
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
    setFetchedFiles([]);
  }
};




  const formatDate = (dateString) => {
    if (typeof dateString === 'string' && dateString) {
      const dateParts = dateString.split('T')[0].split('-');
      if (dateParts.length === 3) {
        return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
      }
    }
    return '';
  };

  const getTaskDetailReport = async (taskMasterID) => {
    try {
      const body = { TaskMasterID: taskMasterID };

      const response = await fetch(`${config.apiBaseUrl}/getTaskDetailReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          const updatedTaskDetails = fetchedData.map((task) => ({
            taskDate: formatDate(task.TaskDate),
            taskMasterID: task.TaskMasterID,
            dailyTaskTitle: task.DailyTaskTiltle,
            userId: task.userID,
            userName: task.user_name,
            taskDescription: task.TaskDescription,
            hoursTaken: task.HourseTaken,
            PriorityLevel: task.PriorityLevel,
            TaskStauts: task.TaskStauts,
            fileBuffer: task.Files,
          }));

          setTaskDetails(updatedTaskDetails);
        } else {
          setTaskDetails([]);
          console.error("No task details found");
        }
      } else {
        console.error("Failed to fetch task details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const convertBufferToUrl = () => {
      const updatedFiles = {};

      taskDetails.forEach((task, taskIndex) => {
        if (task.fileBuffer && task.fileBuffer.data) {
          const byteArray = new Uint8Array(task.fileBuffer.data);

          // Detect File Type
          const firstByte = byteArray[0];
          let fileType = "unknown";
          let mimeType = "";

          if (firstByte === 0x25) { 
            fileType = "pdf";
            mimeType = "application/pdf";
          } else if (firstByte === 0xff || firstByte === 0x89) { 
            fileType = "image";
            mimeType = "image/jpeg"; 
          }

          const blob = new Blob([byteArray], { type: mimeType });
          const fileUrl = URL.createObjectURL(blob);

          updatedFiles[taskIndex] = { url: fileUrl, type: fileType, blob: blob };
        }
        console.log("Buffer Data:", task.fileBuffer?.data);
      });

      setTaskFiles(updatedFiles);
      console.log("Updated Files:", updatedFiles); 
    };

    if (taskDetails.length > 0) {
      convertBufferToUrl();
    }
  }, [taskDetails]);

useEffect(() => {
  const fetchTaskDetailReport = async () => {
    try {
      const taskMasterID = selectedRow?.TaskMasterID;

      if (!taskMasterID) return; // Ensure TaskMasterID is available

      const body = {
        TaskMasterID: taskMasterID,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/getTaskDetailReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();

                 if (fetchedData.length > 0) {
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            };

            setTaskDetails(
              fetchedData.map((task) => ({
                taskDate: formatDate(task.TaskDate),
                taskMasterID: task.TaskMasterID,
                dailyTaskTitle: task.DailyTaskTiltle,
                userId: task.userID,
                userName: task.user_name,
                taskDescription: task.TaskDescription,
                hoursTaken: task.HourseTaken,
                PriorityLevel: task.PriorityLevel,
                TaskStauts: task.TaskStauts,
                fileBuffer: task.Files,
              }))
            );
          }
      } else if (response.status === 404) {
        toast.warning("No task details found");
        setTaskDetails([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch task details");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Unexpected error occurred while fetching task details.");
    }
  };

  fetchTaskDetailReport();
}, [selectedRow]); // Watch for changes to selectedRow

  useEffect(() => {
    const fetchTaskDetailReport = async () => {
      try {
        if (!TaskMasterID) return; // Ensure TaskMasterID is available

        const body = { TaskMasterID: TaskMasterID };

        const response = await fetch(`${config.apiBaseUrl}/getTaskDetailReport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const fetchedData = await response.json();

          if (fetchedData.length > 0) {
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            };

            setTaskDetails(
              fetchedData.map((task) => ({
                taskDate: formatDate(task.TaskDate),
                taskMasterID: task.TaskMasterID,
                dailyTaskTitle: task.DailyTaskTiltle,
                userId: task.userID,
                userName: task.user_name,
                taskDescription: task.TaskDescription,
                hoursTaken: task.HourseTaken,
                PriorityLevel: task.PriorityLevel,
                TaskStauts: task.TaskStauts,
                fileBuffer: task.Files,
              }))
            );
          }
        } else if (response.status === 404) {
          console.log("No task details found");
          toast.warning("No task details found");
          setTaskDetails([]); // Reset if no data
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to fetch task details");
          console.error(errorResponse.details || errorResponse.message);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetailReport();
  }, [TaskMasterID]); // Runs when TaskMasterID changes

  useEffect(() => {
    const fetchTaskDetailReport = async () => {
      try {
        if (!projectid) return; // Ensure TaskMasterID is available

        const body = { ProjectID: projectid, company_code: sessionStorage.getItem('selectedCompanyCode') };

        const detailResponse = await fetch(`${config.apiBaseUrl}/getProjectDetail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (detailResponse.ok) {
          const fetchedData = await detailResponse.json();

          if (fetchedData.length > 0) {
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            };

            // Update project details state
            setManager(fetchedData[0].ProjectManager);
            setProjectCode(fetchedData[0].ProjectID);
            setstartdate(formatDate(fetchedData[0].StartDate));
            setEnddate(formatDate(fetchedData[0].EndDate));
            setDescriptions(fetchedData[0].ProjectDescription);
            setProjectName(fetchedData[0].ProjectName);
            setSelectedProject({
              value: fetchedData[0].ProjectID,
              label: fetchedData[0].ProjectID,
            });
          }
        } else if (detailResponse.status === 404) {
          console.log("Project details not found");
          toast.warning("Project details not found");
          setManager("");
        } else {
          const errorResponse = await detailResponse.json();
          toast.warning(errorResponse.message || "Failed to fetch project details");
          console.error(errorResponse.details || errorResponse.message);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchTaskDetailReport();
  }, [projectid]);

  const handleClose = () => {
    setOpen2(false);
  };

  const columnDefs = [
    {
      headerName: "Task Master ID",
      field: "TaskMasterID",
      // minWidth: 200,
      // maxWidth: 200,
      editable: false,
      cellRenderer: (params) => (
        <span
          onClick={() => {
            handleTaskClick(params.data.TaskMasterID);
            getTaskDetailReport(params.data.TaskMasterID);
            settaskid(params.data.TaskMasterID);
          }}
          style={{ cursor: "pointer" }}
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Task Title",
      field: "TaskTitle",
      filter: 'agTextColumnFilter',
      // minWidth: 200,
      // maxWidth: 200,
      cellRenderer: (params) => (
        <span
          onClick={() => {
            handleTaskClick(params.data.TaskMasterID);
            getTaskDetailReport(params.data.TaskMasterID);
            settaskid(params.data.TaskMasterID);
          }}
          style={{ cursor: "pointer" }}
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Priority",
      field: "PriorityLevel",
      filter: 'agNumberColumnFilter',
      // minWidth: 100,
      // maxWidth: 100,
      cellRenderer: (params) => (
        <span
          onClick={() => {
            handleTaskClick(params.data.TaskMasterID);
            getTaskDetailReport(params.data.TaskMasterID);
            settaskid(params.data.TaskMasterID);
          }}
          style={{ cursor: "pointer" }}
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Description",
      field: "Description",
      filter: 'agNumberColumnFilter',
      // minWidth: 700,
      // maxWidth: 700,
      cellRenderer: (params) => (
        <span
          onClick={() => {
            handleTaskClick(params.data.TaskMasterID);
            getTaskDetailReport(params.data.TaskMasterID);
            settaskid(params.data.TaskMasterID);
          }}
          style={{ cursor: "pointer" }}
        >
          {params.value}
        </span>
      ),
    }
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  useEffect(() => {
    const fetchProjectTasksAndDetails = async () => {
      try {
        if (!selectedRow?.ProjectID || !selectedRow?.TaskMasterID) return;
        // Ensure both values exist before making requests

        const projectBody = { ProjectID: selectedRow.ProjectID, company_code: sessionStorage.getItem('selectedCompanyCode') };

        // Fetch Project Tasks
        const projectResponse = await fetch(`${config.apiBaseUrl}/getProjectTask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectBody),
        });

        if (projectResponse.ok) {
          const projectData = await projectResponse.json();

          if (projectData.length > 0) {
            const formattedRows = projectData.map((task) => ({
              TaskMasterID: task.TaskMasterID,
              ProjectID: selectedRow.ProjectID, 
              ProjectName: task.ProjectName,
              TaskTitle: task.TaskTitle,
              EstimatedHours: task.EstimatedHours,
              StartDate: task.StartDate,
              EndDate: task.EndDate,
              TaskStatus: task.TaskStatus,
              Description: task.Description,
              PriorityLevel: task.PriorityLevel,
            }));

            setRowData(formattedRows);

            if (selectedRow?.TaskMasterID) {
              // Send TaskMasterID from the other screen
              const taskBody = {
                TaskMasterID: selectedRow.TaskMasterID,
                company_code: sessionStorage.getItem('selectedCompanyCode')// Passed from the other screen
              };

              const taskResponse = await fetch(`${config.apiBaseUrl}/getTaskDetail`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskBody),
              });

              if (taskResponse.ok) {
                const taskData = await taskResponse.json();

                if (taskData.length > 0) {
                  const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                  };

                  setTaskTitle(taskData[0].TaskTitle);
                  setEstimatedHours(taskData[0].EstimatedHours);
                  setendDate(formatDate(taskData[0].EndDate));
                  setStartdate(formatDate(taskData[0].StartDate));
                  setuserID(taskData[0].userID);
                  setBufferHours(taskData[0].BufferHours);
                  setDescription(taskData[0].Description);
                  setTaskStatus(taskData[0].TaskStatus);
                  settaskid(taskData[0].TaskMasterID);
                }
              } else if (taskResponse.status === 404) {
                console.log("Task details not found");
                toast.warning("Task details not found");
              } else {
                const taskErrorResponse = await taskResponse.json();
                toast.warning(taskErrorResponse.message || "Failed to fetch task details");
                console.error(taskErrorResponse.details || taskErrorResponse.message);
              }
            }
          } else {
            toast.warning("No tasks found");
            setRowData([]);
          }
        } else if (projectResponse.status === 404) {
          console.log("No tasks found");
          toast.warning("No tasks found");
          setRowData([]);
        } else {
          const projectErrorResponse = await projectResponse.json();
          toast.warning(projectErrorResponse.message || "Failed to fetch tasks");
          console.error(projectErrorResponse.details || projectErrorResponse.message);
        }
      } catch (error) {
        console.error("Error fetching project tasks and details:", error);
      }
    };

    fetchProjectTasksAndDetails();
  }, [selectedRow]); // Runs when selectedRow changes
  // Runs when selectedRow changes

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const body = { ProjectID: selectedRow.ProjectID, company_code: sessionStorage.getItem('selectedCompanyCode') };

        const response = await fetch(`${config.apiBaseUrl}/getProjectDetail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const fetchedData = await response.json();

          if (fetchedData.length > 0) {
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            };
            setManager(fetchedData[0].ProjectManager);
            setProjectCode(fetchedData[0].ProjectID);
            setstartdate(formatDate(fetchedData[0].StartDate));
            setEnddate(formatDate(fetchedData[0].EndDate));
            setDescriptions(fetchedData[0].ProjectDescription);
            setProjectName(fetchedData[0].ProjectName);
            setSelectedProject({ value: fetchedData[0].ProjectID, label: fetchedData[0].ProjectID });
          }
        } else if (response.status === 404) {
          console.log("Data Not found");
          toast.warning("Data Not found");
          setManager(""); // Reset if no data
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to fetch project details");
          console.error(errorResponse.details || errorResponse.message);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchReport();
  }, [selectedRow]);




  const handleEditorStateChange = (state) => {
    setEditorState(state);

    // Convert to plain text
    const contentState = state.getCurrentContent();
    const plainText = contentState.getPlainText(); // 👈 This gives raw text (no HTML or tags)

    setText(plainText);
  };
  // const handlesave = async () => {
  //   if (!tasktitle || !usercode || !estimatedhours || !status_typeSC || !taskid || !text || !PriorityLevel) {
  //     setError(" ");
  //     toast.warning("Error: Missing Required Fields");
  //     return;
  //   }

  //   // Ensure estimatedhours is valid
  //   if (!/^\d{1,2}:\d{2}$/.test(estimatedhours)) {
  //     toast.warning("Invalid time format. Please use HH:MM format.");
  //     return;
  //   }

  //   const formatedHoursTaken = estimatedhours.replace(":", ".")

  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/addDailyTask`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         DailyTaskTiltle: tasktitle,
  //         userID: usercode,
  //         HourseTaken: formatedHoursTaken,
  //         TaskStauts: status_typeSC,
  //         TaskMasterID: taskid,
  //         TaskDescription: text.trim(),
  //         PriorityLevel: PriorityLevel,
  //         created_by: sessionStorage.getItem("selectedUserCode")

  //       }),
  //     });

  //     if (response.ok) {
  //       const searchData = await response.json();
  //       console.log(searchData);
  //       const [{ DailyTaskID }] = searchData;
  //       setdailytask(DailyTaskID);
  //       toast.success("Data inserted successfully");
  //     } else {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message);
  //     }
  //   } catch (error) {
  //     toast.error("Error inserting data: " + error.message);
  //   }
  // };

const handlesave = async () => {
  const isFeedback = selectedtstatusSC?.value === "Feedback";

  if (
    !tasktitle ||
    !usercode ||
    (!estimatedhours && !isFeedback) ||
    !status_typeSC ||
    !taskid ||
    !text ||
    !PriorityLevel
  ) {
    setError(" ");
    toast.warning("Error: Missing required fields");
    return;
  }

  if (!isFeedback && !/^\d{1,2}:\d{2}$/.test(estimatedhours)) {
    toast.warning("Invalid time format. Please use HH:MM format.");
    return;
  }

  const formattedHoursTaken = isFeedback
    ? "00.00"
    : estimatedhours.replace(":", ".");

  try {
    const formData = new FormData();
    formData.append("DailyTaskTiltle", tasktitle);
    formData.append("userID", usercode);
    formData.append("HourseTaken", formattedHoursTaken);
    formData.append("TaskStauts", status_typeSC);
    formData.append("TaskMasterID", taskid);
    formData.append("TaskDescription", text.trim());
    formData.append("PriorityLevel", PriorityLevel);
    formData.append("created_by", sessionStorage.getItem("selectedUserCode"));
    formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));

    // Save daily task
    const response = await fetch(`${config.apiBaseUrl}/addDailyTask`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const searchData = await response.json();
      const [{ DailyTaskID }] = searchData;
      setdailytask(DailyTaskID);
      toast.success("Data inserted successfully");

      // 🔹 Upload stored files from localStorage
      const storedFiles = JSON.parse(localStorage.getItem("taskFiles")) || [];
      if (storedFiles.length > 0) {
        const fileFormData = new FormData();
        fileFormData.append("TaskMasterID", taskid);
        fileFormData.append("DailyTaskID", DailyTaskID);
        fileFormData.append("created_by", sessionStorage.getItem("selectedUserCode"));

        storedFiles.forEach((base64, idx) => {
          const blob = dataURLtoBlob(base64);
          fileFormData.append("Files", blob, `image_${idx}.png`);
        });

        const fileResponse = await fetch(
          `${config.apiBaseUrl}/AddFileAttachment`,
          {
            method: "POST",
            body: fileFormData,
          }
        );

        if (fileResponse.ok) {
          toast.success("Files uploaded successfully");
          localStorage.removeItem("taskFiles"); // clear after upload
        } else {
          const fileError = await fileResponse.json();
          toast.warning(fileError.message || "Failed to upload files");
        }
      }
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to save data");
    }
  } catch (error) {
    toast.error("Error inserting data: " + error.message);
  }
};

// Utility: Convert Base64 → Blob
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}



  const handleSearch = async () => {

    try {
      const response = await fetch(`${config.apiBaseUrl}/TaskMasterSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // TaskMasterID: taskmasterid,
          TaskTitle: Tasktitle,
          PriorityLevel: priority,
          Description: description,
          ProjectID: ProjectID,
          company_code: sessionStorage.getItem('selectedCompanyCode')

        }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const resultData = await response.json();
        setRowData(resultData); // Set the row data for AG-Grid

      } else if (response.status === 404) {
        setRowData([]); // Clear AG-Grid data if no results are found
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleTicket = async () => {
    try {
      const body = { TaskMasterID: taskmasterid, company_code: sessionStorage.getItem('selectedCompanyCode') };

      const response = await fetch(`${config.apiBaseUrl}/Getticketandproject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        if (fetchedData.length > 0) {
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          };
          console.log(fetchedData)

          settaskid(fetchedData[0].TaskMasterID);
          setTaskStatus(fetchedData[0].TaskStatus);
          setStartdate(formatDate(fetchedData[0].TaskStartDate));
          setendDate(formatDate(fetchedData[0].TaskEndDate));
          setuserID(fetchedData[0].userID);
          setBufferHours(fetchedData[0].BufferHours);
          setEnddate(formatDate(fetchedData[0].EndDate));
          setstartdate(formatDate(fetchedData[0].StartDate));
          setDescription(fetchedData[0].Description);
          setEstimatedHours(fetchedData[0].EstimatedHours);
          setTaskTitle(fetchedData[0].TaskTitle);
          setManager(fetchedData[0].ProjectManager);
          setProjectName(fetchedData[0].ProjectName);
          setDescriptions(fetchedData[0].ProjectDescription);
          setSelectedProject({ value: fetchedData[0].ProjectID, label: fetchedData[0].ProjectID });


        }
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setManager(""); // Reset if no data
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch project details");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const handleChangeProject = async (selectedProject) => {
    // Update state with selected project
    setSelectedProject(selectedProject);
    setProjectCode(selectedProject ? selectedProject.value : '');

    // Ensure a valid project selection
    if (!selectedProject?.value) return;

    try {
      const projectBody = { ProjectID: selectedProject.value, company_code: sessionStorage.getItem('selectedCompanyCode') };

      // Fetch Project Tasks
      const taskResponse = await fetch(`${config.apiBaseUrl}/getProjectTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectBody),
      });

      if (taskResponse.ok) {
        const projectData = await taskResponse.json();

        if (projectData.length > 0) {
          const formattedRows = projectData.map((task) => ({
            TaskMasterID: task.TaskMasterID,
            ProjectID: selectedProject.value, // Use selected Project ID
            ProjectName: task.ProjectName,
            TaskTitle: task.TaskTitle,
            EstimatedHours: task.EstimatedHours,
            StartDate: task.StartDate,
            EndDate: task.EndDate,
            TaskStatus: task.TaskStatus,
            Description: task.Description,
            PriorityLevel: task.PriorityLevel,
          }));

          setRowData(formattedRows); // Update state with task data
        }
      } else {
        console.error("Failed to fetch project tasks.");
      }

      // Now Fetch Project Details
      const detailResponse = await fetch(`${config.apiBaseUrl}/getProjectDetail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectBody),
      });

      if (detailResponse.ok) {
        const fetchedData = await detailResponse.json();

        if (fetchedData.length > 0) {
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          };

          // Update project details state
          setManager(fetchedData[0].ProjectManager);
          setProjectCode(fetchedData[0].ProjectID);
          setstartdate(formatDate(fetchedData[0].StartDate));
          setEnddate(formatDate(fetchedData[0].EndDate));
          setDescriptions(fetchedData[0].ProjectDescription);
          setProjectName(fetchedData[0].ProjectName);
          setSelectedProject({
            value: fetchedData[0].ProjectID,
            label: fetchedData[0].ProjectID,
          });
        }
      } else if (detailResponse.status === 404) {
        console.log("Project details not found");
        toast.warning("Project details not found");
        setManager(""); // Reset if no data
      } else {
        const errorResponse = await detailResponse.json();
        toast.warning(errorResponse.message || "Failed to fetch project details");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };



  const filteredOptionProject = Array.isArray(projectDrop)
    ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : [];

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



  const handleDownload = (file) => {
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(fileURL);
  };


  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height); // Get square size

          canvas.width = 50;
          canvas.height = 50;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            50,
            50
          );

          canvas.toBlob((blob) => {
            const newFile = new File([blob], file.name, { type: file.type });

            // Now simulate an upload to a server or return base64
            resolve({ data: { link: URL.createObjectURL(blob) } });
          }, file.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  // Optional: Automatically insert image when user pastes or drags
  // Utility: Convert File → Base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const handleDroppedFiles = async (selection, files) => {
  if (files.length > 0) {
    const file = files[0];

    // Convert to Base64 and store in localStorage
    const base64File = await toBase64(file);
    const storedFiles = JSON.parse(localStorage.getItem("taskFiles")) || [];
    storedFiles.push(base64File);
    localStorage.setItem("taskFiles", JSON.stringify(storedFiles));

    toast.success("File stored locally (will be saved on submit)");

    return "handled";
  }
  return "not-handled";
};




  const MediaBlock = (props) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
    const { src, width = "50px" } = entity.getData();

    const [hovered, setHovered] = useState(false);

    const handleRemove = () => {
      const { editorState, setEditorState } = props.blockProps;
      const contentState = editorState.getCurrentContent();
      const blockKey = props.block.getKey();

      const block = contentState.getBlockForKey(blockKey);

      // Create a selection that covers the whole block
      const selection = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: 0,
        focusOffset: block.getLength(),
        isBackward: false,
      });

      const newContentState = Modifier.removeRange(contentState, selection, 'backward');
      const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');

      setEditorState(EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter()));
    };


    return (
      <div
        style={{ position: "relative", display: "inline-block", maxWidth: width }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(true)}
      >
        <img src={src} style={{ maxWidth: width, borderRadius: "4px" }} alt="Dropped" />
        {hovered && (
          <button
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: "4px",
              left: "5px",
              backgroundColor: "rgba(255, 0, 0, 0.6)",
              border: "none",
              color: "white",
              borderRadius: "50%",
              cursor: "pointer",
              padding: "2px 6px",
              marginLeft: "120px",
              fontSize: "12px"
            }}
          >
            ✕
          </button>
        )}
      </div>
    );
  };
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes

    const validFiles = [];
    const oversizedFiles = [];

    files.forEach((file) => {
      if (file.size > maxSize) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      alert(`The following files exceed the 1MB limit:\n\n${oversizedFiles.join("\n")}`);
    }

    setSelectedFile((prevFiles) => [...prevFiles, ...validFiles]); // Append only valid files
  };


  const handleExport = () => {
    if (taskDetails.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [
      ['Task History'],
      [`Company Code: ${sessionStorage.getItem('selectedCompanyCode')}`],
      []
    ];

    const transformedData = taskDetails.map(task => ({
      "Task Date": task.taskDate,
      "Task Master ID": task.taskMasterID,
      "Daily Task Title": task.dailyTaskTitle,
      "User ID": task.userId,
      "User Name": task.userName,
      "Hours Taken": task.hoursTaken,
      "Priority Level": task.PriorityLevel,
      "Task Status": task.TaskStauts,
      "Task Description": task.taskDescription
    }));

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);
    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Task History');
    XLSX.writeFile(workbook, 'Task_History.xlsx');
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div>
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-body-tertiary rounded mt-2 mb-2">
          <div className="d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut  ">Project Details</h1>
            </div>

            <div className='purbut'>
              <div className="d-flex justify-content-end me-3">

                <div align="left" class="d-flex justify-content-end purbut" style={{ marginRight: "100px" }}>
                  <button className="toggle-btn p-2 pt-0 pb-0 mt-2 mb-2 purbut" required title="ADD" onClick={handleClickOpen}                    >
                    Add
                  </button>
                </div>
              </div></div>
            <div className="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start me-4">
                  <h1 align="left" className="h1 ">Project Details</h1>
                </div>
                <div class="dropdown mt-1 me-5">
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2">
          <div className="row ms-4 mt-2 mb-3">
            <div className="col-md-4 form-group mb-3">
              <div className="exp-form-floating d-flex justify-content-start">
                <div class=" mt-2">
                  <div>
                    <label className="exp-form-labels partyName me-3">
                      Project :
                    </label>
                  </div>
                </div>
                <div class="col-md-5 ">
                  <Select
                    id="Approvedby"
                    className='exp-input-field'
                    required title="Please Select the Project ID"
                    value={selectedProject}
                    onChange={handleChangeProject}
                    options={filteredOptionProject}
                  />
                </div>
              </div>

            </div>
            <div className="col-md-4 form-group  mb-3">
              <div className="exp-form-floating">
                <label className="exp-form-labels partyName">
                  Project Name:<strong>{ProjectName}</strong>
                </label>
              </div>
            </div>
            <div className="col-md-4 form-group mb-3">
              <div className="exp-form-floating">
                <label className="exp-form-labels partyName">
                  Project Description:<strong>{ProjectDescription}</strong>
                </label>
              </div>
            </div>
            <div className="col-md-4 form-group mb-3">
              <div className="exp-form-floating">
                <label className="exp-form-labels partyName">
                  Project Manager:<strong>{Manager}</strong>
                </label>
              </div>
            </div>
            <div className="col-md-4 form-group mb-3">
              <div className="exp-form-floating">
                <label className="exp-form-labels partyName">
                  Start Date:<strong>{StartDate}</strong>
                </label>
              </div>
            </div>
            <div className="col-md-4 form-group mb-3">
              <div className="exp-form-floating">
                <label className="exp-form-labels partyName">
                  End Date:<strong> {EndDate}</strong>
                </label>
              </div>
            </div>
          </div>
          <div>
            <div className="  mt-2  p-3">
              <h4 className="ms-4">Search Criteria :</h4>
              <div class="row ms-3 me-3 mb-3">
                <div className="col-md-3 form-group mb-2">
                  <label htmlFor="taskmasterid" className="exp-form-labels">
                    Task Master ID
                  </label>
                  <div className="position-relative">
                    <input
                      id="taskmasterid"
                      className="exp-input-field form-control pe-3"
                      type="text"
                      placeholder=""
                      required title="Please Select the Task Master ID"
                      value={taskmasterid}
                      onChange={(e) => settaskmasterid(e.target.value)}
                      maxLength={50}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleTicket();
                        }
                      }}
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y me-1">
                      <icon className="icon searchIcon" onClick={handleTicket}><i className="fa fa-search " style={{ cursor: "pointer" }}></i></icon>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div className="exp-form-floating">
                    <div className="d-flex justify-content-start">
                      <div>
                        <label htmlFor="EmployeeId" className="exp-form-labels">
                          Task Title
                        </label>
                      </div>
                      <div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-end">
                      <input
                        id="EmployeeId"
                        className="exp-input-field form-control p-2"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the Task Title"
                        value={Tasktitle}
                        onChange={(e) => setTasktitle(e.target.value)}
                        maxLength={20}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" class="exp-form-labels">
                        Priority
                      </label></div>
                    </div>
                    <input
                      id="LoanEligibleAmount"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the Priority"
                      value={priority}
                      onChange={(e) => setpriority(e.target.value)}
                      maxLength={30}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" class="exp-form-labels">
                        Description
                      </label></div>
                    </div>
                    <input
                      id="LoanEligibleAmount"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the Description"
                      value={description}
                      onChange={(e) => setdescription(e.target.value)}
                      maxLength={30}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                          onClick={reloadGridData}
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
            <div className="ag-theme-alpine mb-2" style={{ height: 220, width: "100%" }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                gridOptions={gridOptions}
                // defaultColDef={{ editable: true, resizable: true }}
                rowSelection="single"
                rowHeight={27}
                headerHeight={27}
              />
            </div>
          </div>
          <div class="row ms-5 mt-3">
            <div class="col-lg-4 col-md-4 col-sm-12 mb-3">
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    Task Master ID :<strong strong className='ms-3'>{taskid}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    Task Title:<strong strong className='ms-3'>{TaskTitle}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    User:<strong strong className='ms-3'>{userID}</strong>
                  </label>
                </div>
              </div>
              <div class=" form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels  partyName">
                    Task Description:<strong className='ms-3  col-md-12'> {Description}</strong>
                  </label>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between col-md-6">
                <div className="col-md-4">
                  <label>Files :</label>
                </div>

                {fetchedFiles.length > 0 && (
                  <div
                    className="col-md-8 ms-3 mt-3 d-flex flex-wrap justify-content-end"
                    style={{ flexDirection: "row-reverse" }}
                  >
                    {fetchedFiles.map((file, index) => (
                      <div key={index} className="position-relative m-1">
                        {/* Close/Remove button (optional) */}
                        {/* <button className="btn btn-danger btn-sm position-absolute" style={{ ... }}>×</button> */}

                        {/* Preview area */}
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="img-thumbnail"
                            onClick={() => window.open(file.url, "_blank")}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          // onClick={() => setPreviewFile(file)} // Optional: to show enlarged preview
                          />
                        ) : file.type === "pdf" ? (
                          <iframe
                            src={file.url}
                            title={file.name}
                            className="img-thumbnail"
                            onClick={() => window.open(file.url, "_blank")}
                            style={{
                              width: "100px",
                              height: "100px",
                              border: "1px solid #ddd",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <div
                            className="img-thumbnail d-flex align-items-center justify-content-center"
                            style={{
                              width: "100px",
                              height: "100px",
                              backgroundColor: "#eee",
                              fontSize: "10px",
                              textAlign: "center",
                            }}
                          >
                            No preview available
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {selectedPreviewFile && (
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 1050 }}
                    onClick={() => setSelectedPreviewFile(null)} // click outside to close
                  >
                    <div
                      className="bg-white p-3 rounded shadow"
                      style={{ maxWidth: "80%", maxHeight: "80%", overflow: "auto" }}
                      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    >
                      <div className="text-end">
                        <button className="btn btn-sm btn-danger" onClick={() => setSelectedPreviewFile(null)}>×</button>
                      </div>
                      {selectedPreviewFile.type === "image" ? (
                        <img
                          src={selectedPreviewFile.url}
                          alt={selectedPreviewFile.name}
                          className="img-fluid"
                        />
                      ) : selectedPreviewFile.type === "pdf" ? (
                        <iframe
                          src={selectedPreviewFile.url}
                          title={selectedPreviewFile.name}
                          style={{ width: "100%", height: "500px", border: "none" }}
                        />
                      ) : (
                        <p>No preview available</p>
                      )}
                    </div>
                  </div>
                )}


              </div>

            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 mb-3">
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    Start Date:<strong strong className='ms-3'>{startdate}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    End Date:<strong strong className='ms-3'>{endDate}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    Status:<strong strong className='ms-3'>{TaskStatus}</strong>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 mb-3">
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    Estimated Hours:<strong strong className='ms-3'>{EstimatedHours}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    Buffer Hours:<strong strong className='ms-3'>{BufferHours}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-6 form-group mb-3">
                <div class="exp-form-floating">
                  <label class="exp-form-labels partyName">
                    Total Hours Spent:<strong strong className='ms-3'>{HourseTaken}</strong>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 ms-4 form-group mb-2">
            <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                  <label for="cname" >Daily Task ID : <strong>{dailytask}</strong></label>
                </div>
              </div>
            </div>
          </div>
          <div class="row ms-3 me-3 mb-3">

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="cname" className={`${error && !tasktitle ? 'red' : ''}`}>Task Title<span className="text-danger">*</span></label>
                  </div>
                </div>
                <input
                  id="loanID"
                  class="exp-input-field form-control"
                  required title="Please Enter the Task Title"
                  value={tasktitle}
                  onChange={(e) => settasktitle(e.target.value)}

                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="sname" className={`${error && !usercode ? 'red' : ''}`}>User Code <span className="text-danger">*</span></label>
                  </div>
                </div>
                <Select
                  id="Approvedby"
                  class="exp-input-field form-control"
                  value={selectedUser}
                  required title="Please Select the User Code"
                  onChange={handleChangeUser}
                  options={filteredOptionUser}
                />
              </div>
            </div>
            {selectedtstatusSC?.value !== "Feedback" && (
              <div className="col-md-3 form-group mb-2">
                <div className="exp-form-floating">
                  <label htmlFor="EndDate" className={`${error && !estimatedhours ? 'red' : ''}`}>
                    Hours Taken <span className="text-danger">*</span>
                  </label>
                  <input
                    id="EndDate"
                    className="exp-input-field form-control"
                    type="time"
                    placeholder=""
                    required
                    title="Please Choose the Hours"
                    value={estimatedhours}
                    onChange={(e) => setestimatedhours(e.target.value)}
                    maxLength={100}
                  />
                </div>
              </div>
            )}
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="add3" className={`${error && !selectedtstatusSC ? 'red' : ''}`}>Task Status<span className="text-danger">*</span></label>
                <Select
                  id="EMIAmount"
                  class="exp-input-field "
                  type="text"
                  required title="Please Select the Task Status"
                  placeholder=""
                  value={selectedtstatusSC}
                  onChange={handleChangestatusSC}
                  options={filteredOptionTransactionSC}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="tcode" className={`${error && !selectedPriortyLeavel ? 'red' : ''}`}>Priority Level <span className="text-danger">*</span></label>
                <Select
                  id="PriorityLevel"
                  className="exp-input-field"
                  required title="Please Select the Priority Level"
                  type="text"
                  placeholder=""
                  value={selectedPriortyLeavel}
                  onChange={handleChangePriorityLevel}
                  options={filteredOptionPriorityLevel}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between col-md-6">
              <div className="col-md-4">
                <label htmlFor="file-upload">Files</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".png, .jpg, .jpeg, .gif, .pdf, .xls, .xlsx, .csv, .txt"
                  multiple
                  onChange={handleFileSelect}
                />
              </div>

              {selectedFile.length > 0 && (
                <div
                  className="col-md-8 ms-3 mt-3 d-flex flex-wrap justify-content-end"
                  style={{ flexDirection: "row-reverse" }}
                >
                  {selectedFile.map((file, index) => {
                    const fileURL = URL.createObjectURL(file);
                    const fileType = file.type;

                    return (
                      <div key={index} className="position-relative m-1">
                        <button
                          className="btn btn-danger btn-sm position-absolute"
                          style={{
                            top: "-5px",
                            right: "-5px",
                            borderRadius: "50%",
                            padding: "2px 6px",
                            fontSize: "12px",
                          }}
                          onClick={() => handleRemove(index)}
                        >
                          ×
                        </button>

                        {fileType.startsWith("image") ? (
                          <img
                            src={fileURL}
                            alt={file.name}
                            className="img-thumbnail"
                            style={{
                              width: "50px",
                              height: "50px",
                              cursor: "pointer",
                              objectFit: "cover",
                            }}
                            onClick={() => handleDownload(file)}
                          />
                        ) : fileType === "application/pdf" ? (
                          <iframe
                            src={fileURL}
                            title={file.name}
                            className="img-thumbnail"
                            style={{
                              width: "50px",
                              height: "50px",
                              cursor: "pointer",
                              border: "1px solid #ddd",
                            }}
                            onClick={() => handleDownload(file)}
                          ></iframe>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


            <div className="col-md-3 form-group mb-2 mt-3">
              <div class="exp-form-floating">
                <button className='' onClick={handlesave} required title="Submit" >
                  <i class="fa-brands fa-instalod"></i> Submit
                </button>
              </div>
            </div>
            <div>
              <TaxInputPopup open={open2} handleClose={handleClose} ProjectID={ProjectID} />
            </div>
          </div>

          <div className="col-md-9 form-group mb-2 mt-3 ms-4 mb-5">
            <div className="exp-form-floating">
              <label htmlFor="tcode" className={`${error && editorState.getCurrentContent().hasText() === false ? 'red' : ''}`}>
                Description<span className="text-danger">*</span>
              </label>

              <Editor
                required title="Please Enter the Description"
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor editor-content"
                editorStyle={{
                  height: "200px",
                  border: "1px solid #ccc",
                  padding: "5px",
                  direction: "ltr",
                  textAlign: "left",
                  backgroundColor: "#ffffff"
                }}
                toolbar={{
                  options: ['inline', 'list', 'textAlign', 'link', 'history', 'image'],
                  inline: { options: ['bold', 'italic', 'underline'] },
                  image: {
                    uploadCallback: uploadImageCallBack,
                    previewImage: true,
                    alt: { present: true, mandatory: false },
                    inputAccept: "image/*",
                  }
                }}
                handleDroppedFiles={handleDroppedFiles}
                handlePastedFiles={(files) => {
                  if (files.length > 0) {
                    handleDroppedFiles(null, files);
                    return true;
                  }
                  return false;
                }}
              />
            </div>
          </div>
        </div>
        <div className="shadow-lg p-2 bg-body-tertiary mb-2 rounded mt-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="fs-5 mb-0">Task History:</p>
            <button class="btn btn-success d-flex align-items-center me-5" onClick={handleExport} title='Excel'>
              <i class="fa-solid fa-file-excel"></i>
            </button>
          </div>
          {taskDetails.map((task, taskIndex) => (
            <div key={taskIndex} className="row ms-4 mt-2 mb-3">
              {taskIndex !== 0 && <hr />}
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>Task Date:</strong> {task.taskDate}
                </label>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>Task Master ID:</strong> {task.taskMasterID}
                </label>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>Daily Task Title:</strong> {task.dailyTaskTitle}
                </label>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>User ID:</strong> {task.userId}
                </label>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>User Name:</strong> {task.userName}
                </label>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>Hours Taken:</strong> {task.hoursTaken}
                </label>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>Priority Level:</strong> {task.PriorityLevel}
                </label>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>Task Status:</strong> {task.TaskStauts}
                </label>
              </div>
              <div>
                  <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>File:</strong>
                </label>
                <div>
                  {taskFiles[taskIndex] ? (
                    taskFiles[taskIndex].type === "pdf" ? (
                      <iframe
                        src={taskFiles[taskIndex].url}
                        width="100%"
                        height="200px"
                        title="PDF Preview"
                      ></iframe>
                    ) : taskFiles[taskIndex].type === "image" ? (
                      <img
                        src={taskFiles[taskIndex].url}
                        alt="Task Attachment"
                        className="img-thumbnail me-2"
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <p>Unsupported File Format</p>
                    )
                  ) : (
                    <p>No File Available</p>
                  )}
                </div>
              </div>
              <div className="col-md-4 form-group mb-3">
                <label className="exp-form-labels">
                  <strong>Task Description:</strong> {task.taskDescription}
                </label>
              </div>
              </div>
            

            </div>
          ))
          }
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
