import React, { useState } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import TabButtons from './Tabs.js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../apps.css';
import { showConfirmationToast } from '../ToastConfirmation';

const config = require('../Apiconfig');

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
  let startYear, endYear;

  if (currentMonth < 4) {
    startYear = currentYear - 1;
    endYear = currentYear;
  } else {
    startYear = currentYear;
    endYear = currentYear + 1;
  }

  const FirstDate = `${startYear}-04-01`;
  const LastDate = `${endYear}-03-31`;

  return { FirstDate, LastDate };
};

const { FirstDate, LastDate } = getFinancialYearDates();

function Input({ }) {
  const [Loan_ID, setLoan_ID] = useState('');
  const [Loan_Eligible_Amount, setLoan_Eligible_Amount] = useState(0);
  const [Start_Year, setStart_Year] = useState(FirstDate);
  const [End_Year, setEnd_Year] = useState(LastDate);
  const [error, setError] = useState('');
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [Loan_id, setLoan_id] = useState("");
  const [LoanEligibleAmount, setLoanEligibleAmount] = useState(0);
  const [StartYear, setStartYear] = useState(FirstDate);
  const [EndYear, setEndYear] = useState(LastDate);
  const [activeTab, setActiveTab] = useState("EmpLoanType")
  const navigate = useNavigate();

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
                  onClick={() => handleUpdate(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
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
      headerName: "Loan ID",
      field: "Loan_ID",
      editable: true,
      textAlign: "center",
      cellEditorParams: {
        maxLength: 150,
        valueFormatter: (params) => formatDate(params.value)
      }
    },
    {
      headerName: "Loan Eligible Amount",
      field: "Loan_Eligible_Amount",
      editable: true,
      cellEditorParams: {
        maxLength: 150,
        valueFormatter: (params) => formatDate(params.value)
      }
    },
    {
      headerName: "Start Year",
      field: "Start_year",
      filter: 'agTextColumnFilter',
      editable: true,
    },
    {
      headerName: "End Year",
      field: "End_Year",
      filter: 'agTextColumnFilter',
      sortable: true,
      textAlign: "center",
      editable: true,
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      hide: true
    },
  ]

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const reloadGridData = () => {
    setRowData([]);
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleSearch = async () => {
    try {
      const body = {
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Loan_id,
        LoanEligibleAmount,
        StartYear,
        EndYear,
      };

      const response = await fetch(`${config.apiBaseUrl}/getLoanType`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          Loan_ID: matchedItem.Loan_ID,
          Loan_Eligible_Amount: matchedItem.Loan_Eligible_Amount,
          Start_year: formatDate(matchedItem.Start_year),
          End_Year: formatDate(matchedItem.End_Year),
          keyfield: matchedItem.keyfield,
        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch loan data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("An unexpected error occurred while fetching data.");
    }
  };

  const handleInsert = async () => {
    if (!Loan_ID || !Loan_Eligible_Amount || !Start_Year || !End_Year) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Headers = {
        Loan_ID: Loan_ID,
        Loan_Eligible_Amount: Loan_Eligible_Amount,
        Start_Year: Start_Year,
        End_Year: End_Year,
        keyfield: sessionStorage.getItem("selectedCompanyCode"),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Created_by: sessionStorage.getItem("selectedUserCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/addLoanType`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Headers),
      });

      if (response.status === 200) {
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert data");
      }
    } catch (error) {
      toast.error("Error inserting data: " + error);
    }
  };

  const handleUpdate = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/updateLoanType`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              company_code: sessionStorage.getItem("selectedCompanyCode"),
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to employee data");
          }
        } catch (error) {
          toast.error("Error updateing data: " + error.message);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const handleDelete = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/deleteLoanType`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
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

  const handleLoanIdChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9]*$/;

    if (regex.test(value)) {
      setLoan_ID(value);
      setError(false);
    } else {
      setError(true);
    }
  };

  const tabs = [
    { label: 'Salary Eligibility Days' },
    { label: 'Bonus' },
    { label: 'PF Contribution' },
    { label: 'Professional Tax' },
    { label: 'Loan Type' },
    { label: 'TDS' },
  ];

  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case 'EmployeeAllowance':
        NavigateEmployeeAllowance();
        break;

      case 'Salary Eligibility Days':
        FinancialYear();
        break;

      case 'Bonus':
        EmployeeBonus();
        break;

      case 'PF Contribution':
        EmpPFCompany();
        break;

      case 'Professional Tax':
        EmpProfessionalTax();
        break;

      case 'Loan Type':
        EmpLoanType();
        break;

      case 'TDS':
        EmpTDS();
        break;
      default:
        break;
    }
  };

  const NavigateEmployeeAllowance = () => {
    navigate("/EmployeeAllowance");
  };

  const FinancialYear = () => {
    navigate("/PayslipSalaryDays");
  };

  const EmployeeBonus = () => {
    navigate("/PayslipEmpBonus");
  };

  const EmpPFCompany = () => {
    navigate("/PFContribution");
  };

  const EmpProfessionalTax = () => {
    navigate("/PayslipEmpProTax");
  };

  const EmpLoanType = () => {
    navigate("/PayslipEmpLoanType");
  };

  const EmpTDS = () => {
    navigate("/PayslipEmpTDS");
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="">Payslip Master - Loan Type</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      </div>
      <div class=" mb-4">
        <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
          <div class="row">
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="sname" className={`${error && !Loan_ID ? 'red' : ''}`}>Loan ID<span className="text-danger">*</span></label>
                  </div>
                </div>
                <input
                  id="Loan_ID"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please Enter the Loan ID"
                  value={Loan_ID}
                  autoComplete="off"
                  onChange={(e) => handleLoanIdChange(e)}
                  maxLength={20}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="sname" className={`${error && !Loan_Eligible_Amount ? 'red' : ''}`}>Loan Amount<span className="text-danger">*</span></label>
                  </div>
                </div>
                <input
                  id="Loan_Eligible_Amount"
                  class="exp-input-field form-control"
                  type="Number"
                  placeholder=""
                  required title="Please Enter the Loan Amount"
                  value={Loan_Eligible_Amount}
                  autoComplete="off"
                  onChange={(e) => setLoan_Eligible_Amount(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <label For="city">Start Year<span className="text-danger">*</span></label>
                </div>
                <input
                  id="Start_Year"
                  class="exp-input-field form-control"
                  type="Date"
                  placeholder=""
                  required title="Please Choose the Start Year"
                  value={Start_Year}
                  autoComplete="off"
                  onChange={(e) => setStart_Year(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label For="city">End Year<span className="text-danger">*</span></label>
                  </div>
                </div>
                <input
                  id="End_Year"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please Choose the End Year"
                  value={End_Year}
                  autoComplete="off"
                  onChange={(e) => setEnd_Year(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
            <button onClick={handleInsert} className="" title="Save">
              <i class="fa-solid fa-floppy-disk"></i>
            </button>
          </div>
        </div>
        <div class=" mb-4">
          <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
            <div className="pe-0 " style={{ width: "150px" }}>
              <h6 className="">Search Criteria:</h6>
            </div>
            <div class="row">
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="sname" class="exp-form-labels">Loan ID</label>
                    </div>
                  </div>
                  <input
                    id="Loan_id"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please Enter the Loan ID"
                    value={Loan_id}
                    autoComplete="off"
                    maxLength={20}
                    onChange={(e) => setLoan_id(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="sname" class="exp-form-labels">Loan Amount</label>
                    </div>
                  </div>
                  <input
                    id="LoanEligibleAmount"
                    class="exp-input-field form-control"
                    type="Number"
                    placeholder=""
                    required title="Please Enter the Loan Amount"
                    value={LoanEligibleAmount}
                    onChange={(e) => setLoanEligibleAmount(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label For="city">Start Year</label>
                    </div>
                  </div>
                  <input
                    id="StartYear"
                    class="exp-input-field form-control"
                    type="Date"
                    placeholder=""
                    required title="Please Choose the Start Year"
                    value={StartYear}
                    onChange={(e) => setStartYear(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label For="city">End Year</label>
                    </div>
                  </div>
                  <input
                    id="EndYear"
                    class="exp-input-field form-control"
                    type="Date"
                    placeholder=""
                    required title="Please Choose the End Year"
                    value={EndYear}
                    onChange={(e) => setEndYear(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 form-group mt-4 mb-3">
              <div class="exp-form-floating">
                <div class=" d-flex  justify-content-center">
                  <div class=''>
                    <icon className="popups-btn fs-6 p-3" onClick={handleSearch} required title="Search">
                      <i className="fas fa-search"></i>
                    </icon>
                  </div>
                  <div>
                    <icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Reload">
                      <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                    </icon>
                  </div>
                </div>
              </div>
            </div>
            <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                rowSelection="multiple"
                pagination={true}
                paginationAutoPageSize={true}
                gridOptions={gridOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;
