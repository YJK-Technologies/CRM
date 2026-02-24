import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import TabButtons from './Tabs.js';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import { AgGridReact } from "ag-grid-react";
import { showConfirmationToast } from '../ToastConfirmation';

const config = require('../Apiconfig');

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based
  console.log(currentMonth)
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
  const [Employee_Salary, setEmployee_Salary] = useState(0);
  const [Employee_Salarys, setEmployee_Salarys] = useState(0);
  const [Taxable_Amounts, setTaxable_Amounts] = useState(0);
  const [Taxable_Amount, setTaxable_Amount] = useState(0);
  const [Start_Years, setStart_Years] = useState(FirstDate);
  const [End_Years, setEnd_Years] = useState(LastDate);
  const [error, setError] = useState("");
  const [Start_Year, setStart_Year] = useState(FirstDate);
  const [End_Year, setEnd_Year] = useState(LastDate);
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);
  const [activeTab, setActiveTab] = useState("EmpTDS")

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const columnDefs = [
    {
      headerName: "Actions",
      field: "action",
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
      headerName: "Start Year",
      field: "Start_Year",
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "End Year",
      field: "End_Year",
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Employee Salary",
      field: "Employee_Salary",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Taxable Amount",
      field: "Taxable_Amount",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Key Field ",
      field: "keyfield",
      editable: false,
      hide: true
    },
  ];

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/SearchTDS`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Start_Years,
          End_Years,
          Employee_Salarys,
          Taxable_Amounts
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        setRowData([]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error updating data: " + error);
      setRowData([]);
    }
  };

  const handleInsert = async () => {
    if (!Start_Year || !End_Year || !Employee_Salary || !Taxable_Amount) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/addTDS`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Start_Year,
          End_Year,
          Employee_Salary,
          Taxable_Amount,
          created_by: sessionStorage.getItem('selectedUserCode'),
        }),

      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error);
    }
  };

  const handleUpdate = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {

          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/updateTDS`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully")
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error update rows:", error);
          toast.error('Error update Data: ' + error.message);
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

          const dataToSend = { deletedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/deleteTDS`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to Delete data");
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

  const reloadGridData = () => {
    setRowData([]);
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
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">Payslip Master - TDS</h1>
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
                        <label for="sname" className={`${error && !Start_Year ? 'red' : ''}`}>
                          Start Year<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please Choose the Start Year"
                      value={Start_Year}
                      onChange={(e) => setStart_Year(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !End_Year ? 'red' : ''}`}>
                          End Year<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      required title="Please Choose the End Year"
                      placeholder=""
                      value={End_Year}
                      onChange={(e) => setEnd_Year(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !Employee_Salary ? 'red' : ''}`}>
                          Employee Salary<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Employee Salary"
                      value={Employee_Salary}
                      onChange={(e) => setEmployee_Salary(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="add1" className={`${error && !Taxable_Amount ? 'red' : ''}`}>
                          Taxable Amount<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Taxable Amount"
                      value={Taxable_Amount}
                      onChange={(e) => setTaxable_Amount(e.target.value)}
                    />
                  </div>
                </div>
                <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                  <button onClick={handleInsert} className="" title="Save">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
              <div className="pe-0 " style={{ width: "150px" }}>
                <h6 className="">Search Criteria:</h6>
              </div>
              <div class="row">
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">Start Year</label>
                      </div>
                    </div>
                    <input
                      type="date"
                      className="exp-input-field form-control"
                      required title="Please Choose the Start Year"
                      value={Start_Years}
                      onChange={(e) => setStart_Years(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">End Year</label>
                      </div>
                    </div>
                    <input
                      required title="Please Choose the End Year"
                      type="date"
                      className="exp-input-field form-control"
                      value={End_Years}
                      onChange={(e) => setEnd_Years(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">Employee Salary</label>
                      </div>
                    </div>
                    <input type="Number"
                      className="exp-input-field form-control"
                      required title="Please Enter the Employee Salary"
                      value={Employee_Salarys}
                      onChange={(e) => setEmployee_Salarys(Number(e.target.value))}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">Taxable Amount</label>
                      </div>
                    </div>
                    <input type="Number"
                      className="exp-input-field form-control"
                      required title="Please Enter the Taxable Amount"
                      value={Taxable_Amounts}
                      onChange={(e) => setTaxable_Amounts(Number(e.target.value))}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                  </div>
                </div>
                <div className="col-md-2 form-group mb-2 mt-4">
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
              <div class="ag-theme-alpine" style={{ height: 485, width: "100%" }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  rowSelection="multiple"
                  pagination={true}
                  paginationAutoPageSize={true}
                  gridOptions={gridOptions}
                  onGridReady={(params) => {
                    gridApiRef.current = params.api;
                    gridColumnApiRef.current = params.columnApi;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;
