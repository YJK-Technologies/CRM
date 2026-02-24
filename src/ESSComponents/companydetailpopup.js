import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';

const config = require('../Apiconfig');


const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee First Name",
    field: "first_name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee Middle Name",
    field: "middle_name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Employee Last  Name",
    field: "Last_Name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Department",
    field: "department_ID",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Designation",
    field: "designation_ID",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "DOJ",
    field: "DOJ",
    filter: 'agTextColumnFilter',
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'dd-MM-yyyy'),
  },
  {
    headerName: "DOL",
    field: "DOL",
    filter: 'agTextColumnFilter',
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'dd-MM-yyyy'),
  },
  {
    headerName: "Manager",
    field: "manager",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Shift",
    field: "shift",
    editable: false,
  },
  {
    headerName: "Status",
    field: "status",
    filter: 'agTextColumnFilter',
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function Companydetailpopup({ open, handleClose, CompanyDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [Department, setDepartment] = useState("");
  const [Designation, setDesignation] = useState("");
  const [DOJ, setDOJ] = useState("");
  const [manager, setManager] = useState("");
  const [Name, setname] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmployeeCompanyISC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          EmployeeId, Department, Designation, manager, Name, company_code: sessionStorage.getItem('selectedCompanyCode')

        })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            Department: item.Department,
            designation_Id: item.Designation,
            DOJ: item.DOJ,
            DOL: item.DOL,
            manager: item.manager,
            shift: item.shift,
            status: item.status,
            // First_Name: item.First_Name,
            // Photos: item.Photos ? arrayBufferToBase64(item.Photos.data) : null,

          }))
        );
        setRowData(updatedData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not found")
            setRowData([]);
            clearInputs([])
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    setEmployeeId("");
    setDepartment("");
    setDesignation("");
    setDOJ("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeId,
      Department: row.department_ID,
      Designation: row.designation_ID,
      DOJ: row.DOJ,
      DOL: row.DOL,
      manager: row.manager,
      shift: row.shift,
      status: row.status,
      first_name: row.first_name
    }));
    CompanyDetails(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
  }

  return (
    <div>
      {open && (
        <fieldset>
          <div>
            <div className="purbut">
              <div className="modal mt-5 Topnav-screen popup popupadj" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Company Details Help</h1>
                            <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                          <div class="d-flex justify-content-between">
                            <div className="d-flex justify-content-start">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-body">
                        <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='IssuanceID'
                              className='exp-input-field form-control'
                              placeholder='Employee ID'
                              title="Please Enter the Employee ID"
                              value={EmployeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="employeename"
                              className="exp-input-field form-control"
                              type="text"
                              name="Employee Name"
                              placeholder="Employee Name"
                              title="Please Enter the Employee Name"
                              value={Name}
                              onChange={(e) => setname(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="department"
                              className="exp-input-field form-control"
                              type="text"
                              name="department"
                              placeholder="Department"
                              required
                              title="Please Enter the Department"
                              value={Department}
                              onChange={(e) => setDepartment(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="designation_ID"
                              className="exp-input-field form-control"
                              type="text"
                              placeholder="Designation"
                              title="Please Enter the Designation"
                              name="designation_ID"
                              value={Designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <icon className="icon popups-btn" onClick={handleSearch} title="Search">
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </icon>
                            <icon className="icon popups-btn" onClick={handleReload} title="Reload">
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </icon>
                            <icon className="icon popups-btn" onClick={handleConfirm} title="Confirm">
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </icon>
                          </div>
                        </div>
                        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                          <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            rowSelection="single"
                            pagination='true'
                            gridOptions={gridOptions}
                            onSelectionChanged={handleRowSelected}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mobileview">
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Company Details Help</h1>
                          </div>
                          <div className="mb-0 d-flex justify-content-end" >
                            <button onClick={handleClose} className="closebtn2" required title="Close">
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div className="d-flex justify-content-start">
                          </div>
                        </div>
                      </div>
                      <div className="modal-body">
                        <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Employee ID'
                              className='exp-input-field form-control'
                              placeholder='Employee ID'
                              title="Please Enter the Employee ID"
                              value={EmployeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="manager"
                              className="exp-input-field form-control"
                              type="text"
                              name="manager"
                              placeholder='Employee Name'
                              title="Please Enter the Employee Name"
                              value={Name}
                              onChange={(e) => setname(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="department"
                              className="exp-input-field form-control"
                              type="text"
                              name="department"
                              placeholder='Department'
                              required
                              title="Please Enter the Department"
                              value={Department}
                              onChange={(e) => setDepartment(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="designation_ID"
                              className="exp-input-field form-control"
                              type="text"
                              name="designation_ID"
                              placeholder='Designation'
                              title="Please Enter the Designation"
                              value={Designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <button className="" onClick={handleSearch} title="Search">
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                            <button className="" onClick={handleReload} title="Reload">
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </button>
                            <button className="" onClick={handleConfirm} title="Confirm">
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </button>
                          </div>
                          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                            <AgGridReact
                              rowData={rowData}
                              columnDefs={columnDefs}
                              rowSelection="single"
                              pagination='true'
                              gridOptions={gridOptions}
                              onSelectionChanged={handleRowSelected}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}





