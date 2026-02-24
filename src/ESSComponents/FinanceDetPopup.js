import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
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
    headerName: "Employee Last Name",
    field: "Last_Name",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Salary Type",
    field: "salaryType",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Pay Scale",
    field: "Payscale",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "PF No",
    field: "PFNo",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Salary Per Annum",
    field: "salary_month",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Department ID",
    field: "department_id",
    filter: 'agTextColumnFilter',
    editable: false,
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    filter: 'agTextColumnFilter',
    editable: false,
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};


export default function FinanceDetailsPopup({ open, handleClose, finaceDetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [payScale, setPayScale] = useState("");
  const [salaryPerAnnum, setSalaryPerAnnum] = useState("");

  const [Name, setname] = useState("");

  const handleSearch = async () => {
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const salaryValue = salaryPerAnnum === "" ? 0 : parseInt(salaryPerAnnum, 10);
      const response = await fetch(`${config.apiBaseUrl}/getFinancialDetailsSearchCretria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ EmployeeId, salaryType, Name, Payscale: payScale, salary_month: salaryValue, company_code })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not found")
            setRowData([]);
            clearInputs([])
        console.log("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        setRowData([]);
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
    }
  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    setEmployeeId("");
    setSalaryType("");
    setPayScale("");
    setSalaryPerAnnum("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      employeeId: row.EmployeeId,
      salaryType: row.salaryType,
      Payscale: row.Payscale,
      PFNo: row.PFNo,
      salaryMonth: row.salary_month,
      first_name: row.first_name,
      Department: row.department_id,
      Designation: row.designation_id,
    }));

    finaceDetails(selectedData);
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
                            <h1 align="left" className="purbut">Financial Details Help</h1>
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
                              id='EmployeeId'
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
                              type='text'
                              id='salaryType'
                              className='exp-input-field form-control'
                              placeholder='Salary Type'
                              title="Please Enter the Salary Type"
                              value={salaryType}
                              onChange={(e) => setSalaryType(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='payScale'
                              className='exp-input-field form-control'
                              placeholder='Payscale'
                              title="Please Enter the Payscale"
                              value={payScale}
                              onChange={(e) => setPayScale(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='salaryPerAnnum'
                              className='exp-input-field form-control'
                              placeholder='Salary Per Annum'
                              title="Please Enter the Salary Per Annum"
                              value={salaryPerAnnum}
                              onChange={(e) => setSalaryPerAnnum(e.target.value)}
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
            {/* <div className="mobileview">
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Financial Details Help</h1>
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
                              id='EmployeeId'
                              className='exp-input-field form-control'
                              placeholder='Employee Id'
                              value={EmployeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='AcademicName'
                              className='exp-input-field form-control'
                              placeholder='Academic Name'
                              value={salaryType}
                              onChange={(e) => setAcademicName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Major'
                              className='exp-input-field form-control'
                              placeholder='Major'
                              value={Major}
                              onChange={(e) => setMajor(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Institution'
                              className='exp-input-field form-control'
                              placeholder='Institution'
                              value={Institution}
                              onChange={(e) => setInstitution(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
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
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </fieldset>
      )}
    </div>
  );
}
