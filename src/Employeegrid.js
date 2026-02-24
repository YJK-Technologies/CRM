import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import labels from "./Labels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';

const config = require('./Apiconfig');


function Employee() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [company_no, setCompany_no] = useState("");
  const [company_name, setCompany_name] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(""); // Set default state value
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [Locationdrop, setLocationdrop] = useState("")
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [employee_no, setemployee_no] = useState("");
  const [employee_name, setemployee_name] = useState("");
  const [desgination, setdesgination] = useState("");
  const [employee_type, setemployee_type] = useState("");

  const [createdBy, setCreatedBy] = useState("");  
  const [modifiedBy, setModifiedBy] = useState(""); 
  const [createdDate, setCreatedDate] = useState(""); 
  const [modifiedDate, setModifiedDate] = useState("");

  //code added by Pavun purpose of set user permisssion
   const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
   const companyPermissions = permissions
   .filter(permission => permission.screen_type === 'Company')
   .map(permission => permission.permission_type.toLowerCase());
 
 
  /*testing for search criteria*/
  /* const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");*/

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //    try {
  //      const response = await fetch("http://localhost:5500/search ");
  //     const jsonData = await response.json();
  //     setRowData(jsonData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //    }
  // };
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    }) 
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const cityNames = data.map(option => option.attributedetails_name);
        setDrop(cityNames);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    }) 
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const countries = data.map(option => option.attributedetails_name);
        setCondrop(countries);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })  
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const States = data.map(option => option.attributedetails_name);
        setStatedrop(States);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

    useEffect(() => {
      fetch(`${config.apiBaseUrl}/locationno`)
        .then((response) => response.json())
        .then((data) => {
          // Extract city names from the fetched data
          const LocationOption = data.map(option => option.location_no);
          setLocationdrop(LocationOption);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      
      fetch(`${config.apiBaseUrl}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code })
      })     
       .then((response) => response.json())
        .then((data) => {
          // Extract city names from the fetched data
          const statusOption = data.map(option => option.attributedetails_name);
          setStatusGriddrop(statusOption);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }, []);
  
    useEffect(() => {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      
      fetch(`${config.apiBaseUrl}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code })
      })
        .then((data) => data.json())
        .then((val) => setStatusdrop(val))
        .catch((error) => console.error('Error fetching data:', error));
    }, []);
  
  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
    setHasValueChanged(true);
  };


  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/city`)
  //     .then((data) => data.json())
  //     .then((val) => setDrop(val));
  // }, []);
  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/country`)
  //     .then((data) => data.json())
  //     .then((values) => setCondrop(values));
  // }, []);
  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/state`)
  //     .then((data) => data.json())
  //     .then((val) => setStatedrop(val));
  // }, []);

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/status`)
  //     .then((data) => data.json())
  //     .then((val) => setStatusdrop(val));
  // }, []);


  const handleCompanyNoChange = (event) => {
    setCompany_no(event.target.value);
  };

  const handleCompanyNameChange = (event) => {
    setCompany_name(event.target.value);
  };

  const handlecityChange = (event) => {
    setCity(event.target.value);
  };

  const handlestateChange = (event) => {
    setState(event.target.value);
  };



  const handlesetPincodeChange = (event) => {
    setPincode(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const reloadGridDatas = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/reloadGridData`); // Replace with the actual endpoint to reload grid data
      if (response.ok) {
        const gridData = await response.json();
        setRowData(gridData);
        console.log("Grid data reloaded successfully");
      } else {
        console.error("Failed to reload grid data");
      
        toast.error("Failed to reload grid data. Please try again later")
      }
    } catch (error) {
      console.error("Error reloading grid data:", error);
      toast.error("An error occurred while reloading grid data. Please try again later")
    }
  };

  const handleSearch = async () => {
   const company_code = sessionStorage.getItem('selectedCompanyCode')
    try {
      const response = await fetch(`${config.apiBaseUrl}/getallEmployee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ employee_no, employee_name, desgination, employee_type,company_code}) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found")
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error.message);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };



  const columnDefs = [

    {
      headerCheckboxSelection: true,
      headerName: "Employee No",
      field: "employee_no",
      cellStyle: { textAlign: "left" },
      minWidth: 180,
      checkboxSelection: true,
      cellEditorParams: {
        maxLength: 18,
      },
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };
        
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      },

    },
    {
      headerName: "Employee Name",
      field: "employee_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 200,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Father Name",
      field: "fathername",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "DOJ ",
      field: "doj",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
      valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
    },
    {
      headerName: "DOB ",
      field: "dob",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
      valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
    },
    {
      headerName: "MOB No",
      field: "mob_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    }, 
    {
      headerName: "Emergency MOB No",
      field: "emg_mob_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: drop,
       
      },

    },
    {
      headerName: "Employee type",
      field: "employee_type",
      editable: true,
      cellStyle: { textAlign: "left" },
        minWidth: 150,    
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: statedrop,
        },
    },
    {
      headerName: "Department ID",
      field: "dept_id",
      editable: true,
      type: Number,
      cellStyle: { textAlign: "right" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 100,
      },
    },
    {
      headerName: "Designation",
      field: "desgination",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: condrop,
      },
    },
    {
      headerName: "Qualification",
      field: "qualification",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },

    {
      headerName: "Address",
      field: "address",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop
      },
      
    },
    {
      headerName: "city ",
      field: "city",
      filter: "agDateColumnFilter",
      editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      filter: "agDateColumnFilter",
      editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      hide:true
    }
 
  
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // sortable: true,
    //editable: true,
    flex: 1,
    // filter: true,
    // floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };


  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
         toast.warning("Please select at least one row to generate a report");
         return 
         };
    const reportData = selectedRows.map((row) => {
      return {
        "Employee  No": row.employee_no,
        "Employee Name": row.employee_name,
        "Father Name": row.fathername,
        "DOJ": row.doj,
        "DOB": row.dob,
        "Mobile No": row.mob_no,
        "Employee Type": row.employee_type,
        "Dept Id": row.dept_id,
        "Designation": row.desgination,
        "Qualification": row.qualification,
        "Address": row.address,
        "City": row.city
      };
    });
  
    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>EmployeeInfo</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      body {
          font-family: Arial, sans-serif;
          margin: 20px;
      }
      h1 {
          color: maroon;
          text-align: center;
          font-size: 24px;
          margin-bottom: 30px;
          text-decoration: underline;
      }
      table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
      }
      th, td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
          vertical-align: top;
      }
      th {
          background-color: maroon;
          color: white;
          font-weight: bold;
      }
      td {
          background-color: #fdd9b5;
      }
      tr:nth-child(even) td {
          background-color: #fff0e1;
      }
      .report-button {
          display: block;
          width: 150px;
          margin: 20px auto;
          padding: 10px;
          background-color: maroon;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          text-align: center;
          border-radius: 5px;
      }
      .report-button:hover {
          background-color: darkred;
      }
      @media print {
          .report-button {
              display: none;
          }
          body {
              margin: 0;
              padding: 0;
          }
      }
    `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write("<h1><u>Employee Information</u></h1>");
  
    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");
  
    // Populate the rows
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write("</tr>");
    });
  
    reportWindow.document.write("</tbody></table>");
  
    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };
  
  

  const handleNavigateToForm = () => {
    navigate("/EmployeeInputInfo", { state: { mode: "create"} }); // Pass selectedRows as props to the Input component
  };
  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/EmployeeInputInfo", { state: { mode: "update", selectedRow } });
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.employee_no === params.data.employee_no // Use the unique identifier 
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };


  const saveEditedData = async () => {
  	
  	 const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield));
        if (selectedRowsData.length === 0) {
            toast.warning("Please select and modify at least one row to update its data");
            return;
          }
         
        const modified_by = sessionStorage.getItem('selectedUserCode');  
                  showConfirmationToast(
            "Are you sure you want to update the data in the selected rows?",
            async () => {
        try {

      const response = await fetch(`${config.apiBaseUrl}/EmployeeEditData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Modified-By": modified_by
        },
        body: JSON.stringify({ editedData: selectedRowsData }), // Send only the selected rows for saving
        "modified_by": modified_by 
      });

     if (response.status === 200) {
            setTimeout(() => {
              toast.success("Data Updated Successfully")
              handleSearch();
            }, 1000);
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error saving data:", error);
          toast.error("Error Updating Data: " + error.message);
        }
            },
            () => {
              toast.info("Data updated cancelled.");
            }
          );
        };
      

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
                toast.warning("Please select atleast One Row to Delete")
                return;
          }
    
    const modified_by = sessionStorage.getItem('selectedUserCode');

    const keyfieldsToDelete = selectedRows.map((row) => row.keyfield); 
     showConfirmationToast(
            "Are you sure you want to Delete the data in the selected rows?",
            async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmployeeDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Modified-By": modified_by
        },
        body: JSON.stringify({
          keyfield: keyfieldsToDelete
        })
      });
  
            if (response.ok) {
            setTimeout(() => {
              toast.success("Data Deleted successfully")
              handleSearch();
            }, 1000);

          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        }
        },
        () => {
            toast.info("Data Delete cancelled.");
        }
      );
      };
  
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return 'N/A' if the date is missing
    const date = new Date(dateString);
    
    // Format as DD/MM/YYYY
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleRowClick = (rowData) => {
    setCreatedBy(rowData.created_by);
    setModifiedBy(rowData.modified_by);
    const formattedCreatedDate = formatDate(rowData.created_date);
    const formattedModifiedDate = formatDate(rowData.modified_date);
    setCreatedDate(formattedCreatedDate);
    setModifiedDate(formattedModifiedDate);
  };

  // Handler for when a row is selected
  const onRowSelected = (event) => {
    if (event.node.isSelected()) {
      handleRowClick(event.data);
    }
  };


  return (
    <div className="container-fluid Topnav-screen">
      <div>
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className=" d-flex justify-content-between  ">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut">Employee Info </h1>
              </div>
              <div className="d-flex justify-content-end purbut me-3">
{['add', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
                  <addbutton className="purbut" onClick={handleNavigateToForm}
                required title="Add Company"> <i class="fa-solid fa-user-plus"></i>
              </addbutton>
            )}
            {['delete', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
                <delbutton
                className="purbut"
                onClick={deleteSelectedRows}
                required
                title="Delete"
              >
                <i class="fa-solid fa-user-minus"></i>
              </delbutton>
            )}
            {['update', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
              <savebutton
              className="purbut"
              onClick={saveEditedData}
              required
              title="Update"
            >
              <i class="fa-solid fa-floppy-disk"></i>
            </savebutton>
            )}

          {['all permission', 'view'].some(permission => companyPermissions.includes(permission)) && (
        <printbutton
        class="purbut"
        onClick={generateReport}
        required
        title="Generate Report"
      >
        <i class="fa-solid fa-print"></i>
      </printbutton>
      )}
</div>

          <div class="mobileview">
          <div class="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
          <h1 align="left" className="h1">Employee Info</h1>
          </div>
                <div class="dropdown mt-3 me-5" >
            <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-list"></i>
            </button>

              <ul class="dropdown-menu menu">
                
              <li class="iconbutton d-flex justify-content-center text-success">
              {['add', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
                   <icon
                   class="icon"
                   onClick={handleNavigateToForm}
                 > 
                 <i class="fa-solid fa-user-plus"></i>
                   {" "}
                 </icon>
                  )}
                </li>
                <li class="iconbutton  d-flex justify-content-center text-danger">
                {['delete', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
                      <icon
                      class="icon"
                      onClick={deleteSelectedRows}
                    >
                    
            <i class="fa-solid fa-user-minus"></i>
                    </icon>
                  )}
                </li>
                <li class="iconbutton  d-flex justify-content-center text-primary ">                  {['update', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
                     <icon
                     class="icon"
                     onClick={saveEditedData}
                   >
                   <i class="fa-solid fa-floppy-disk"></i>
                   </icon>
                  )}
                </li>
                <li class="iconbutton  d-flex justify-content-center ">
                {['all permission', 'view'].some(permission => companyPermissions.includes(permission)) && (
                     <icon
                     class="icon"
                     onClick={generateReport}
                   >
                    
           <i class="fa-solid fa-print"></i>
                   </icon>
                  )}
              </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
       
          </div>
        
       
          <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className="row ms-4 mt-3 mb-3 me-4">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                
              <label for="cname" class="exp-form-labels">
                  Employee No
                </label>
                <input
                  id="cno"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the company number here"
                  value={employee_no}
                  onChange={(e)=>setemployee_no (e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={18}
                />
                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <label for="cname" class="exp-form-labels">
              Employee Name
                </label>
                <input
                  id="cname"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the company name here"
                  value={employee_name}
                  onChange={(e)=>setemployee_name (e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={250}
                />
                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
               <label for="city" class="exp-form-labels">
                  Designation
                </label><input
                id="city"
                className="exp-input-field form-control"
                   type="text"
                placeholder=""
                required title="Please fill the city here" 
                value={desgination}
                onChange={(e) => setdesgination(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={100}
                />
               
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
               <label for="state" class="exp-form-labels">
                  Employee Type
                </label><input
                id="state"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the state here" 
                value={employee_type}
                onChange={(e) => setemployee_type(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={100}
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
          
           {/* <p >Result Set</p> */}
       
        
        <div class="ag-theme-alpine"  style={{height: 455, width:"100%"}}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            pagination={true}
            paginationAutoPageSize={true}
            onRowSelected={onRowSelected}
          /></div>
        </div>
        </div>
     
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {createdBy}</p>
            <p className="col-md-">
            {labels.createdDate}: {createdDate}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
            {labels.modifiedBy}: {modifiedBy }
            </p>
            <p className="col-md-6">
            {labels.modifiedDate}:{modifiedDate}
            </p>
          </div>
        </div>
      </div>
      </div>
  );
}

export default Employee;
