import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer,toast } from 'react-toastify';
const config = require('../Apiconfig');

const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "EmployeeId",
    field: "EmployeeId",
    cellStyle: { textAlign: "center" },
    minWidth: 250,
    maxWidth: 250,
    editable: false,
  },
  {
    headerName: "AccountHolderName",
    field: "AccountHolderName",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Account_NO",
    field: "Account_NO",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
    maxWidth: 150,
  },
  {
    headerName: "IFSC_Code",
    field: "IFSC_Code",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
 {
  headerName:"bankName",
  field:"bankName",
  editable:"false",
  cellStyle:{textAlign :"center"},
  minWidth: 150,
    maxWidth: 150,
  },
  {
    headerName: "branchName",
    field: "branchName",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Bankbook_img",
    field: "Bankbook_img",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
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

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  flex: 1,


};
export default function EmployeeBankDet({ open, handleClose,Employeebankdetails}) {

  const [rowData, setRowData] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [Account_NO, setAccountNumber] = useState("");
  const [AccountHolderName, setAccountHolderName] = useState("");
  const [bankName	, setbankName	] = useState("");
  const [branchName, setBranchName] = useState("");
  const [IFSC_Code, setIFSCCode] = useState("");
  const [Bankbook_img, setBankbook_img] = useState("");


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
        body: JSON.stringify({EmployeeId,Account_NO, AccountHolderName,bankName	})
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
              bankName	: item.bankName	,
              branchName:item.branchName,
              Bankbook_img: item.Bankbook_img ? arrayBufferToBase64(item.Bankbook_img.data) : null,
             
            }))
          );
        setRowData(updatedData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
       toast.warning("Data not found!").then(() => {
          setRowData([]);
          clearInputs([])
        });
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
    setAccountNumber("");
    setAccountHolderName("");
    setbankName	("");
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
        AccountHolderName:row.AccountHolderName,
        bankName	: row.bankName	,
        branchName: row.branchName,
        IFSC_Code: row.IFSC_Code,
        Photos:row.Photos
 }));


   Employeebankdetails(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
    setSelectedRows([]);
  }

  return (
    <div>
            <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      
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
                            <h1 align="left" className="purbut">Employee Help</h1>
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
                         id="Account_NO"
                         class="exp-input-field form-control"
                        type="text"
                        name="Account_NO"
                         placeholder=""
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
                      placeholder=""
                      value={AccountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                          <input
                      id="IFSC_Code"
                      class="exp-input-field form-control"
                      name="IFSC_Code"
                      type="text"
                      placeholder=""
                      value={IFSC_Code}
                      onChange={(e) => setIFSCCode(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                          <input
                         id="bankName	"
                         class="exp-input-field form-control"
                         type="text"
                         name="bankName	"
                         placeholder=""
                         value={bankName	}
                         onChange={(e) => setbankName	(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <icon className="icon popups-btn" onClick={handleSearch}>
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
                            <h1 className="h1">Employee Help</h1>
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
                         placeholder=""
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
                      placeholder=""
                      value={AccountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                          <input
                      id="IFSC_Code"
                      class="exp-input-field form-control"
                      type="text"
                      name="IFSC_Code"
                      placeholder=""
                      value={IFSC_Code}
                      onChange={(e) => setIFSCCode(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                          <input
                      id="bankName"
                      class="exp-input-field form-control"
                      name="bankName	"
                      type="text"
                      placeholder=""
                      value={bankName	}
                      onChange={(e) => setIFSCCode(e.target.value)}
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
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
