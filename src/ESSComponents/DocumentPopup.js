
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


// Function to convert binary data to base64 string
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};


const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Employee ID",
    field: "EmployeeID",
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
    field: "Middle_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Employee Last Name",
    field: "Last_Name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Document Name",
    field: "document_name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Department",
    field: "department_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Designation",
    field: "designation_id",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Image",
    hide: true,
    field: "Photos",
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
  //   {
  //     headerName: "First Name",
  //     field: "First_Name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 160,
  //   },
  //   {
  //     headerName: "Middle Name",
  //     field: "Middle_Name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 160,
  //   },
  //   {
  //     headerName: "Last Name",
  //     field: "Last_Name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 160,
  //   },
  //   {
  //     headerName: "Father Name",
  //     field: "father_name",
  //     editable: false,
  //     // minWidth: 135,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Mother Name",
  //     field: "mother_name",
  //     editable: false,
  //     // minWidth: 140,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Gender",
  //     field: "Gender",
  //     editable: false,
  //     // minWidth: 150,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Email",
  //     field: "email",
  //     editable: false,
  //     // minWidth: 150,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Grade ID",
  //     field: "Grade_id",
  //     editable: false,
  //     // minWidth: 120,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Phone No",
  //     field: "phone1",
  //     editable: false,
  //     // minWidth: 140,
  //     // maxWidth: 140,
  //   },
  //   {
  //     headerName: "Alter Phone No",
  //     field: "phone2",
  //     editable: false,
  //     minWidth: 130,
  //     maxWidth: 200,
  //   },
  //   {
  //     headerName: "Address 1",
  //     field: "address1",
  //     editable: false,
  //     // minWidth: 120,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Address 2",
  //     field: "address2",
  //     editable: false,
  //     // minWidth: 120,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Address 3",
  //     field: "address3",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Permanent Address",
  //     field: "PermanantAddress",
  //     editable: false,
  //     minWidth: 160,
  //     maxWidth: 200,
  //   },
  //   {
  //     headerName: "Reference Name",
  //     field: "Reference_name",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Reference Phone No",
  //     field: "Reference_Phone",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Martial Status",
  //     field: "marital_status",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Pan No",
  //     field: "Pan_No",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   },
  //   {
  //     headerName: "Aadhaar No",
  //     field: "Aadhar_no",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   }, {
  //     headerName: "Kids",
  //     field: "Kids",
  //     editable: false,
  //     // minWidth: 160,
  //     // maxWidth: 200,
  //   }
];
const gridOptions = {
  pagination: true,
  paginationPageSize: 10,
};

export default function DocumentPopup({ open, handleClose, EmployeeInfo }) {

  const [rowData, setRowData] = useState([]);
  const [Employee_Id, setEmployeeId] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [document_name, setdocument_name] = useState("");
  const [DOB, setDOB] = useState("");
  const [Name, setname] = useState("");


  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmployeeDocSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Employee_Id, document_name, Name, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            EmployeeID: item.EmployeeID,
            First_Name: item.First_Name,
            Middle_Name: item.Middle_Name,
            Photos: item.Photos ? arrayBufferToBase64(item.Photos.data) : null,

            company_code: sessionStorage.getItem('selectedCompanyCode'),
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
    setFirst_Name("");
    setdocument_name("");
    setDOB("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      EmployeeId: row.EmployeeID,
      Department: row.department_id,
      Designation: row.designation_id,
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
                            <h1 align="left" className="purbut">Documents Help</h1>
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
                              value={Employee_Id}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                              maxLength={18}
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
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='Document Name'
                              title="Please Enter the Document Name"
                              value={document_name}
                              onChange={(e) => setdocument_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                              maxLength={75}
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
                            // defaultColDef={defaultColDef}
                            rowSelection="single"
                            pagination='true'

                            paginationAutoPageSize={true}
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
                            <h1 className="h1">Documents Help</h1>
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
                              placeholder='Issue Id'
                              value={Employee_Id}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                              maxLength={18}
                            />
                          </div>

                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='Last name'
                              value={document_name}
                              onChange={(e) => setdocument_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                              maxLength={75}
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
