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
import { ToastContainer,toast } from 'react-toastify';

const config = require('../Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee Id",
    field: "EmployeeId",
    editable: false,
    minWidth: 250,
    maxWidth: 250,
  },
  {
    headerName: "loanID",
    field: "loanID",
    editable: false,
    minWidth: 160,
    maxWidth: 160
    // valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },

  {
    headerName: "ApprovedBy",
    field: "ApprovedBy",
    editable: false,
    minWidth: 160,
    maxWidth: 160,
  },
  {
    headerName: "LoanEligibleAmount",
    field: "LoanEligibleAmount",
    editable: false,
    minWidth: 160,
    maxWidth: 160,
  },
  {
    headerName: "EffetiveDate",
    field: "EffetiveDate",
    editable: false,
    minWidth: 160,
    maxWidth: 160,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd')
  },
  {
    headerName: "EndDate",
    field: "EndDate",
    editable: false,
    minWidth: 135,
    maxWidth: 200,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd')
  },
  {
    headerName: "HowManyMonth",
    field: "HowManyMonth",
    editable: false,
    minWidth: 140,
    maxWidth: 200,
  },
  {
    headerName: "EMIAmount",
    field: "EMIAmount",
    editable: false,
    minWidth: 150,
    maxWidth: 200,
  }

];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1,
  filter: true,
};
export default function EmployeeLoanPopup({ open, handleClose, EmployeeInfo }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [loanID, setLoanID] = useState('');
    const [ApprovedBy, setApprovedBy] = useState('');
    const [LoanEligibleAmount, setLoanEligibleAmount] = useState('');
    const [EffectiveDate, setEffectiveDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [HowManyMonth, setHowManyMonth] = useState('');
    const [EMIAmount, setEMIAmount] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeLoan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({EmployeeId})
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            loanID: item.loanID,
            ApprovedBy: item.ApprovedBy,
            LoanEligibleAmount: item.LoanEligibleAmount,
            EffetiveDate: item.EffetiveDate,
            EndDate: item.EndDate,
            HowManyMonth: item.HowManyMonth,
            EMIAmount: item.EMIAmount
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
  
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
        EmployeeId: row.EmployeeId,
        loanID: row.loanID,
        ApprovedBy: row.ApprovedBy,
        LoanEligibleAmount: row.LoanEligibleAmount,
        EffetiveDate: row.EffetiveDate,
        EndDate: row.EndDate,
        HowManyMonth: row.HowManyMonth,
        EMIAmount: row.EMIAmount
    }));

    EmployeeInfo(selectedData);
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
                            <h1 align="left" className="purbut">EmployeeInfo Help</h1>
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
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='loanID'
                              value={loanID}
                              onChange={(e) => setLoanID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='DateIssued'
                              className='exp-input-field form-control'
                              placeholder='ApprovedBy'
                              value={ApprovedBy}
                              onChange={(e) => setApprovedBy(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='LoanEligibleAmount'
                              value={LoanEligibleAmount}
                              onChange={(e) => setLoanEligibleAmount(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='LoanEligibleAmount'
                              value={EffectiveDate}
                              onChange={(e) => setEffectiveDate(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='LoanEligibleAmount'
                              value={EndDate}
                              onChange={(e) => setEndDate(e.target.value)}
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
                            defaultColDef={defaultColDef}
                            rowSelection="single"
                            pagination='true'
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
                            <h1 className="h1">Inventory Issue Help</h1>
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
                              id='IssuanceID'
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
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='loanID'
                              value={loanID}
                              onChange={(e) => setLoanID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='DateIssued'
                              className='exp-input-field form-control'
                              placeholder='ApprovedBy'
                              value={ApprovedBy}
                              onChange={(e) => setApprovedBy(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='LoanEligibleAmount'
                              value={LoanEligibleAmount}
                              onChange={(e) => setLoanEligibleAmount(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='LoanEligibleAmount'
                              value={EffectiveDate}
                              onChange={(e) => setEffectiveDate(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='LoanEligibleAmount'
                              value={EndDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='HowManyMonths'
                              value={HowManyMonth}
                              onChange={(e) => setHowManyMonth(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='EMIAmount'
                              value={EMIAmount}
                              onChange={(e) => setEMIAmount(e.target.value)}
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
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
