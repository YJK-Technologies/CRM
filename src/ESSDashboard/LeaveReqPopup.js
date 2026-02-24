import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';
const config = require('../Apiconfig');



const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "Leave Type",
    field: "LeaveType",
    cellStyle: { textAlign: "center" },
    editable: false,
  },
  {
    headerName: "From Date",
    field: "FromDate",
    editable: false,
    cellStyle: { textAlign: "center" },
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "To Date",
    field: "ToDate",
    editable: false,
    cellStyle: { textAlign: "center" },
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Leave Status",
    field: "LeaveStatus",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1
};

export default function LeavePopup({ open, handleClose, handleLeave }) {

  const [rowData, setRowData] = useState([]);
  const [LeaveStatus, setLeaveStatus] = useState("");
  const [LeaveType, setLeaveType] = useState("");
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");


  const handleSearchItem = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeLeavesearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          EmployeeId: sessionStorage.getItem('selectedUserCode'),
          FromDate,
          ToDate,
          LeaveStatus,
          LeaveType
        }) 
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
            setRowData([]);
            clearInputs([]);
        toast.warning("Data not found")
        console.log("Data not found"); 
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {
        })
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
    setFromDate('');
    setToDate('');
    setLeaveStatus('');
    setLeaveType('');
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      LeaveType:row.LeaveType,
      FromDate:row.FromDate,
      ToDate:row.ToDate,
      LeaveStatus:row.LeaveStatus
    }));
    console.log('Selected Data:', selectedData);
    handleLeave(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
    setSelectedRows([]);
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
                            <h1 align="left" className="purbut">Applied Leaves</h1>
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
                              type='Date'
                              id='FromDate'
                              className='exp-input-field form-control'
                              placeholder='From Date'
                              value={FromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='Date'
                              id='ToDate'
                              className='exp-input-field form-control'
                              placeholder=' To Date'
                              value={ToDate}
                              onChange={(e) => setToDate(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='LeaveStatus'
                              className='exp-input-field form-control'
                              placeholder=' Leave Status'
                              maxLength={40}
                              value={LeaveStatus}
                              onChange={(e) => setLeaveStatus(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='LeaveType'
                              className='exp-input-field form-control'
                              placeholder=' Leave Type'
                              maxLength={50}
                              value={LeaveType}
                              onChange={(e) => setLeaveType(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <icon className="icon popups-btn" onClick={handleSearchItem}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </icon>
                            <icon className="icon popups-btn" onClick={handleReload}>
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </icon>
                            <icon className="icon popups-btn" onClick={handleConfirm}>
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </icon>
                          </div>
                        </div>
                        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                          <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection="multiple"
                            pagination
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
                            <h1 className="h1">Leave Applied</h1>
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
                              type='Date'
                              id='FromDate'
                              className='exp-input-field form-control'
                              placeholder='From Date'
                              value={FromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='Date'
                              id='ToDate'
                              className='exp-input-field form-control'
                              placeholder=' To Date'
                              value={ToDate}
                              onChange={(e) => setToDate(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='LeaveStatus'
                              className='exp-input-field form-control'
                              placeholder=' Leave Status'
                              maxLength={40}
                              value={LeaveStatus}
                              onChange={(e) => setLeaveStatus(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='LeaveType'
                              className='exp-input-field form-control'
                              placeholder=' Leave Type'
                              maxLength={50}
                              value={LeaveType}
                              onChange={(e) => setLeaveType(e.target.value)}
                              autoComplete="off"
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <button className="" onClick={handleSearchItem}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                            <button className="" onClick={handleReload}>
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </button>
                            <button type="button" className="" onClick={handleConfirm}>
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </button>
                          </div>
                          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                            <AgGridReact
                              rowData={rowData}
                              columnDefs={columnDefs}
                              defaultColDef={defaultColDef}
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
