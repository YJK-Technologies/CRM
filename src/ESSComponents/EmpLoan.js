import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import Select from 'react-select'
import axios from 'axios';
import EmployeeInfoPopup from "./EmployeeinfoPopup.js";
import { showConfirmationToast } from '../ToastConfirmation';
const config = require('../Apiconfig');

function Input({ }) {
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [loanAction, setLoanAction] = useState('update'); // Default to 'add'
  const [ApprovedDrop, setApprovedDrop] = useState('');
  const [approveddrop, setapproveddrop] = useState('');
  const [EmployeeId, setEmployeeId] = useState('');
  const [loanID, setLoanID] = useState('');
  const [loanid, setLoanid] = useState('');
  const [ApprovedBy, setApprovedBy] = useState('');
  const [approvedby, setapprovedby] = useState('');
  const [LoanEligibleAmount, setLoanEligibleAmount] = useState('');
  const [EffectiveDate, setEffectiveDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [HowManyMonth, setHowManyMonth] = useState('');
  const [EMIAmount, setEMIAmount] = useState('');
  const [Howmanymonth, setHowmanymonth] = useState('');
  const [selectedApprovedBy, setselectedApprovedBy] = useState('');
  const [selectedapprovedby, setselectedapprovedby] = useState('');
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [EmployeeID, setEmployeeID] = useState('');
  const [Loaneligibleamount, setloanEligibleamount] = useState('');
  const [EffetiveDate, setEffectivedate] = useState('');
  const [Enddate, setEnddate] = useState('');
  const [EMIamount, setEMIamount] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef(null);
  const [open3, setOpen3] = React.useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [error, setError] = useState("");
  const [LoanDrop, setLoanDrop] = useState([]);
  const [loandrop, setloandrop] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [selectedloan, setselectedloan] = useState("");
  const navigate = useNavigate();
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [rowData, setRowData] = useState('');

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Employee Id",
      field: "EmployeeId",
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: "Loan ID",
      field: "loanID",
      filter: 'agTextColumnFilter',
      editable: true,
    },
    {
      headerName: "Approved By",
      field: "ApprovedBy",
      filter: 'agTextColumnFilter',
      editable: true,
    },
    {
      headerName: "Loan Eligible Amount",
      field: "LoanEligibleAmount",
      filter: 'agNumberColumnFilter',
      editable: true,
    },
    {
      headerName: "Effective Date",
      field: "EffetiveDate",
      filter: 'agDateColumnFilter',
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "End Date",
      field: "EndDate",
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "How Many Months",
      field: "HowManyMonth",
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "EMI Amount",
      field: "EMIAmount",
      filter: 'agNumberColumnFilter',
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSave = async () => {
    if (!EmployeeId || !selectedLoan || !selectedApprovedBy || !LoanEligibleAmount || !EffectiveDate || !EndDate || !HowManyMonth || !EMIAmount) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const data = {
        EmployeeId,
        loanID: selectedLoan,
        ApprovedBy: selectedApprovedBy,
        LoanEligibleAmount: parseFloat(LoanEligibleAmount),
        EffectiveDate,
        EndDate,
        HowManyMonth: parseInt(HowManyMonth, 10),
        EMIAmount: parseFloat(EMIAmount),
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeLoan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };


  const saveEditedData = async () => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeLoan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified_by": modified_by
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
            });
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
        toast.info("Data updated cancelled.");
      }
    );
  };

  const deleteSelectedRows = async (rowData) => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };
    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeLoan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data deleted successfully");
              handleSearch();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLoanID`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setLoanDrop(val)
        setloandrop(val)

      });
  }, []);

  const HandleLoan = (selectedLoan) => {
    setLoanID(selectedLoan);
    setSelectedLoan(selectedLoan ? selectedLoan.value : '');
  };

  const filteredOptionloan = loandrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const Handleloan = (selectedloan) => {
    setLoanid(selectedloan);
    setselectedloan(selectedloan ? selectedloan.value : '');
  };

  const filteredOptionLoan = LoanDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getTeamManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        setApprovedDrop(val)
        setapproveddrop(val)
      });
  }, []);

  const HandleApproved = (ApprovedBy) => {
    setApprovedBy(ApprovedBy);
    setselectedApprovedBy(ApprovedBy.value);
  };

  const filteredOptionApproved = Array.isArray(ApprovedDrop)
    ? ApprovedDrop.map((option) => ({
      value: option.manager,
      label: `${option.EmployeeId} - ${option.manager}`,  // Concatenate ApprovedBy and EmployeeId with ' - '
    }))
    : [];

  const handleapproved = (approvedby) => {
    setapprovedby(approvedby);
    setselectedapprovedby(approvedby.value);
  };

  const filteredOptionapproved = Array.isArray(approveddrop)
    ? approveddrop.map((option) => ({
      value: option.manager,
      label: `${option.EmployeeId} - ${option.manager}`,  // Concatenate ApprovedBy and EmployeeId with ' - '
    }))
    : [];

  const handleReload = () => {
    window.location.reload();
  };

  const reloadGridData = () => {
    setRowData([]);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const handleSearch = async () => {

    try {
      const body = {
        EmployeeId: EmployeeID,
        loanID: selectedloan,
        ApprovedBy: selectedapprovedby,
        LoanEligibleAmount: Loaneligibleamount,
        EffetiveDate: EffetiveDate,
        EndDate: Enddate,
        HowManyMonth: Howmanymonth,
        EMIAmount: EMIamount,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }
      const response = await fetch(`${config.apiBaseUrl}/LoanSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          EmployeeId: matchedItem.EmployeeId,
          loanID: matchedItem.loanID,
          ApprovedBy: matchedItem.ApprovedBy,
          LoanEligibleAmount: matchedItem.LoanEligibleAmount,
          EffetiveDate: matchedItem.EffetiveDate,
          EndDate: matchedItem.EndDate,
          HowManyMonth: matchedItem.HowManyMonth,
          EMIAmount: matchedItem.EMIAmount,

        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };


  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className=" p-0 shadow-lg bg-white rounded">
            <div className="purbut mb-0 d-flex justify-content-between">
              <h1 align="left" className="purbut">
                {loanAction === 'add' ? 'Add Loan Details' : ' Loan Details'}
              </h1>
              <div className="col-md-1 mt-3 me-5">
                <div class=" d-flex justify-content-start  me-5">
                  <div className="me-1 ">
                    {saveButtonVisible && (
                      <savebutton className="purbut" onClick={handleSave} required title="Save">
                        <i class="fa-regular fa-floppy-disk"></i>
                      </savebutton>
                    )}
                    {updateButtonVisible && (
                      <savebutton className="purbut" title='update' onClick={handleSave} >
                        <i class="fa-regular fa-floppy-disk"></i>
                      </savebutton>
                    )}
                  </div>
                  <div className="col-md-1">
                    <div className="ms-1">
                      <reloadbutton className="purbut" onClick={handleReload} title="Reload" style={{ cursor: "pointer" }}>
                        <i className="fa-solid fa-arrow-rotate-right"></i>
                      </reloadbutton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" shadow-lg bg-white rounded  mt-2  p-3">
            <div class=" mb-4">
              <div className="mb-2">
                <div class="row ms-3 me-3 mb-3">
                  <div className="col-md-3 form-group mb-2">
                    <div className="exp-form-floating">
                      <div className="d-flex justify-content-start">
                        <div>
                          <label htmlFor="EmployeeId" className={`${error && !EmployeeId ? 'red' : ''}`}> Employee ID{showAsterisk && <span className="text-danger">*</span>}</label>
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
                          required title="Please enter the Employee ID"
                          value={EmployeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          maxLength={20}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="cname" className={`${error && !loanID ? 'red' : ''}`}>Loan ID{showAsterisk && <span className="text-danger">*</span>}</label>
                        </div>
                      </div>
                      <div title="Please select a Loan ID">
                      <Select
                        required 
                        id="loanID"
                        value={loanID}
                        className="exp-input-field"
                        onChange={HandleLoan}
                        options={filteredOptionLoan}
                        maxLength={20}
                      />
                    </div>
                    </div>
                  </div>
                  {loanAction && (
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="sname" className={`${error && !ApprovedBy ? 'red' : ''}`}>Approved By{showAsterisk && <span className="text-danger">*</span>}</label>
                          </div>
                        </div>
                        <div title="Please Select an Approved By">
                        <Select
                          id="Approvedby"
                          class="exp-input-field form-control"
                          required 
                          placeholder=""
                          value={ApprovedBy}
                          onChange={HandleApproved}
                          options={filteredOptionApproved}
                          maxLength={35}
                        />
                      </div>
                      </div>
                    </div>
                  )}
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="add1" className={`${error && !LoanEligibleAmount ? 'red' : ''}`}>Loan Eligible Amount{showAsterisk && <span className="text-danger">*</span>}</label>
                        </div>
                      </div>
                      <input
                        id="LoanEligibleAmount"
                        class="exp-input-field form-control"
                        type="number"
                        placeholder=""
                        required title="Please Enter the Loan Eligible Amount"
                        value={LoanEligibleAmount}
                        onChange={(e) => setLoanEligibleAmount(e.target.value.slice(0, 7))}
                        maxLength={30}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div> 
                          <label for="add2" className={`${error && !EffectiveDate ? 'red' : ''}`}>Effective Date{showAsterisk && <span className="text-danger">*</span>}</label>
                        </div>
                      </div>
                      <input
                        id="EffetiveDate"
                        class="exp-input-field form-control"
                        type="date"
                        placeholder=""
                        required title="Please Enter the Effective Date"
                        value={EffectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <label for="add3" className={`${error && !EndDate ? 'red' : ''}`}>End Date{showAsterisk && <span className="text-danger">*</span>}</label>
                      <input
                        id="EndDate"
                        class="exp-input-field form-control"
                        type="date"
                        placeholder=""
                        required title="Please Enter the End Date"
                        value={EndDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label For="city" className={`${error && !EndDate ? 'red' : ''}`}>How Many Months{showAsterisk && <span className="text-danger">*</span>}</label>
                        </div>
                      </div>
                      <input
                        id="HowManyMonth"
                        class="exp-input-field form-control"
                        type="number"
                        placeholder=""
                        required title="Please Enter the How Many Months "
                        value={HowManyMonth}
                        onChange={(e) => setHowManyMonth(e.target.value.slice(0, 2))}
                        max={5}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <label for="add3" className={`${error && !EMIAmount ? 'red' : ''}`}>EMI Amount{showAsterisk && <span className="text-danger">*</span>}</label>
                      <input
                        id="EMIAmount"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please Enter the EMI Amount"
                        value={EMIAmount}
                        onChange={(e) => setEMIAmount(e.target.value.slice(0, 6))}
                        maxLength={60}
                      />
                    </div>
                  </div>
                  <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" shadow-lg bg-white rounded  mt-2  p-3">
            <div class=" mb-4">
              <div className="    mb-2">
                <div className="pe-0 " style={{ width: "150px" }}>
                  <h6 className="">Search Criteria:</h6>
                </div>
                <div class="row ms-3 me-3 mb-3">
                  <div class="row">
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">Employee ID</label>
                        </div>
                        <div class="d-flex justify-content-start">
                          <input type="text"
                            className="exp-input-field form-control"
                            placeholder=""
                            required title="Please Enter the Employee ID"
                            value={EmployeeID}
                            onChange={(e) => setEmployeeID(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">Loan ID</label>
                        </div>
                        <div class="d-flex justify-content-start" title="Please Select a Loan ID">
                          <Select type="text"
                            className="exp-input-field"
                            required 
                            placeholder=""
                            value={loanid}
                            onChange={Handleloan}
                            options={filteredOptionloan}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">Approved By</label>
                        </div>
                        <div class="d-flex justify-content-start" title="Please Select an Approved By">
                          <Select type="text"
                            required 
                            className="exp-input-field"
                            placeholder=""
                            value={approvedby}
                            onChange={handleapproved}
                            options={filteredOptionapproved}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">Loan Eligible Amount</label>
                        </div>
                        <div class="d-flex justify-content-start">
                          <input type="number"
                            className="exp-input-field form-control"
                            required title="Please Enter the Loan Eligible Amount"
                            placeholder=" "
                            value={Loaneligibleamount}
                            onChange={(e) => setloanEligibleamount(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2 ">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">Effetive Date</label>
                        </div>
                        <div class="d-flex justify-content-start">
                          <input
                            type="date"
                            required title="Please Enter the Effective Date"
                            className="exp-input-field form-control"
                            placeholder=""
                            value={EffetiveDate}
                            onChange={(e) => setEffectivedate(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2 ">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">End Date</label>
                        </div>
                        <div class="d-flex justify-content-start">
                          <input
                            type="date"
                            required title="Please Enter the End Date"
                            className="exp-input-field form-control"
                            placeholder=""
                            value={Enddate}
                            onChange={(e) => setEnddate(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2 ">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">How Many Months</label>
                        </div>
                        <div class="d-flex justify-content-start">
                          <input type="number"
                            className="exp-input-field form-control"
                            required title="Please Enter the How Many Months "
                            placeholder=""
                            value={Howmanymonth}
                            onChange={(e) => setHowmanymonth(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group mb-2 ">
                      <div class="exp-form-floating">
                        <div>
                          <label for="cname" class="exp-form-labels">EMI Amount</label>
                        </div>
                        <div class="d-flex justify-content-start">
                          <input type="number"
                            className="exp-input-field form-control"
                            placeholder=""
                            required title="Please Enter the EMI Amount"
                            value={EMIamount}
                            onChange={(e) => setEMIamount(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2 ">
                      <div class="exp-form-floating">
                        <div class=" d-flex  justify-content-center">
                          <div class=''>
                            <icon className="popups-btn fs-6 p-3" onClick={handleSearch} required title="Search">
                              <i className="fas fa-search"></i>
                            </icon>
                          </div>
                          <div>
                            <icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Reload">
                              <i className="fa-solid fa-arrow-rotate-right" />
                            </icon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ag-theme-alpine mt-2" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                      columnDefs={columnDefs}
                      rowData={rowData}
                      pagination={true}
                      paginationAutoPageSize={true}
                      gridOptions={gridOptions}
                    />
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Input;

