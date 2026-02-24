import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
const config = require('../Apiconfig');

const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeId",
    cellStyle: { textAlign: "center" },
    editable: false,
  },
  {
    headerName: "Employee First Name",
    field: "First_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Employee Middle Name",
    field: "middle_name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Employee Last Name",
    field: "Last_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Account Holder Name",
    field: "AccountHolderName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Account NO",
    field: "Account_NO",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "IFSC Code",
    field: "IFSC_Code",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Bank Name",
    field: "bankName",
    editable: "false",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Branch Name",
    field: "branchName",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Department ID",
    field: "department_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Designation ID",
    field: "designation_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Bankbook Image",
    field: "Bankbook_img",
    editable: false,
    cellStyle: { textAlign: "center" },
    cellRenderer: (params) => {
      if (params.value) {
        return (
          <img
            src={`data:image/jpeg;base64,${params.value}`}
            alt="Item"
            style={{ width: "50px", height: "50px" }}
          />
        );
      } else {
        return "No Image";
      }
    },
  },
];

const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function Bankaccdetpopup({ open, handleClose, Employeebankdetails }) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [Account_NO, setAccountNumber] = useState("");
  const [AccountHolderName, setAccountHolderName] = useState("");
  const [bankName, setbankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [IFSC_Code, setIFSCCode] = useState("");
  const [Bankbook_img, setBankbook_img] = useState("");
  const [Name, setname] = useState("");



  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  const handleSearch = async () => {
    const company_code = sessionStorage.getItem('selectedCompanyCode')
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmpBankDetailsSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ EmployeeId, Account_NO, Name, AccountHolderName, bankName, IFSC_Code, Bankbook_img, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeId: item.EmployeeId,
            Account_NO: item.Account_NO,
            AccountHolderName: item.AccountHolderName,
            IFSC_Code: item.IFSC_Code,
            bankName: item.bankName,
            branchName: item.branchName,
            Bankbook_img: item.Bankbook_img ? arrayBufferToBase64(item.Bankbook_img.data) : null,

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
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
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
    setAccountNumber("");
    setAccountHolderName("");
    setbankName("");
    setBranchName("");
    setIFSCCode("");
    setBankbook_img("");

  };
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeId,
      Account_NO: row.Account_NO,
      AccountHolderName: row.AccountHolderName,
      bankName: row.bankName,
      branchName: row.branchName,
      IFSC_Code: row.IFSC_Code,
      Bankbook_img: row.Bankbook_img,
      department_ID: row.department_id,
      designation_ID: row.designation_id,
      first_name: row.first_name
    }));


    Employeebankdetails(selectedData);
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
              <div className="modal mt-5 Topnav-screen popupadj popup " tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Bank Accounts Details Help</h1>
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
                              maxLength={18}
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
                              id="AccountHolderName"
                              class="exp-input-field form-control"
                              type="text"
                              name="AccountHolderName"
                              placeholder="Account Holder Name"
                              title="Please Enter the Account Holder Name"
                              value={AccountHolderName}
                              onChange={(e) => setAccountHolderName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="Account NO"
                              class="exp-input-field form-control"
                              type="text"
                              name="Account_NO"
                              placeholder="Account No"
                              title="Please Enter the Account No"
                              value={Account_NO}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="bankName	"
                              class="exp-input-field form-control"
                              type="text"
                              name="bankName"
                              placeholder="Bank Name"
                              title="Please Enter the Bank Name"
                              value={bankName}
                              onChange={(e) => setbankName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
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
                            <h1 className="h1">Bank Accounts Details Help</h1>
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
                              id="Account_NO"
                              class="exp-input-field form-control"
                              type="text"
                              name="Account_NO"
                              placeholder="EmployeeId"
                              title="Please Enter the Employee ID"
                              value={Account_NO}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              id="AccountHolderName"
                              class="exp-input-field form-control"
                              type="text"
                              name="AccountHolderName"
                              placeholder="Account Holder Name"
                              value={AccountHolderName}
                              onChange={(e) => setAccountHolderName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          {/* <div className="col-sm mb-2">
                          <input
                      id="IFSC_Code"
                      class="exp-input-field form-control"
                      type="text"
                      name="IFSC_Code"
                      placeholder="Accountno"
                      value={IFSC_Code}
                      onChange={(e) => setIFSCCode(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            /> */}
                          {/* </div> */}
                          <div className="col-sm mb-2">
                            <input
                              id="bankName"
                              class="exp-input-field form-control"
                              name="bankName"
                              type="text"
                              placeholder=""
                              value={bankName}
                              onChange={(e) => setbankName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <button className="" onClick={handleSearch}>
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                            <button className="" onClick={handleReload}>
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </button>
                            <button className="" onClick={handleConfirm}>
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </button>
                          </div>
                          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                            <AgGridReact
                              rowData={rowData}
                              columnDefs={columnDefs}
                              // defaultColDef={defaultColDef}
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
