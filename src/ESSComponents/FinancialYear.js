import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import TabButtons from './Tabs.js';
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { showConfirmationToast } from '../ToastConfirmation';
import '../apps.css'
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

function Input() {

  const [FromDate, setFromDate] = useState(FirstDate);
  const [ToDate, setToDate] = useState(LastDate);
  const [Start_Year, setStart_Year] = useState(FirstDate);
  const [End_Year, setEnd_Year] = useState(LastDate);
  const [Salary_Days, setSalary_Days] = useState("");
  const [EligibleDays, setEligibledays] = useState("");
  const [error, setError] = useState("");
  const [rowData, setRowData] = useState([]);
  const [activeTab, setActiveTab] = useState("FinancialYear")
  const navigate = useNavigate();

  const formatDate = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    if (isNaN(date)) return "Invalid Date";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleSearch = async () => {
    try {
      const body = {
        Start_Year: Start_Year,
        End_Year: End_Year,
        Salary_Days: Salary_Days,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/salarySearchoption`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          Start_Year: formatDate(matchedItem.Start_Year),
          End_Year: formatDate(matchedItem.End_Year),
          Salary_Days: matchedItem.Salary_Days,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
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
      toast.error("Error fetching search data:", error);
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

          const response = await fetch(`${config.apiBaseUrl}/UpdateSalary`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by
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

  const handleDelete = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/salaryDelete`, {
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
            toast.warning(errorResponse.message || "Failed to insert sales data");
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
      headerName: "Start Year",
      field: "Start_Year",
      editable: true,
      valueFormatter: (params) => formatDate(params.value),  // Format the date for display
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-')); // Convert DD/MM/YYYY to a Date object
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
      headerName: "End Year",
      field: "End_Year",
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
      headerName: "Eligibility Salary Days",
      field: "Salary_Days",
      editable: true,
    },
  ]

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

  const handleSave = async () => {
    if (!FromDate || !ToDate || !EligibleDays) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const formattedFromDate = new Date(FromDate).toISOString().split("T")[0];
      const formattedToDate = new Date(ToDate).toISOString().split("T")[0];

      const Header = {
        Start_Year: formattedFromDate,
        End_Year: formattedToDate,
        Salary_Days: EligibleDays,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };
      const response = await fetch(`${config.apiBaseUrl}/AddSalaryCriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      console.log("Response Status:", response.status);

      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        toast.warning(errorResponse.message || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error);
    }
  };

  // const handleRowSelection = (row) => {
  //   setFromDate(formatDate(row.FromDate)); // Ensure correct format
  //   setToDate(formatDate(row.ToDate));
  //   setEligibledays(row.Salary_Days);
  //   // setSelectedRow(row);
  // };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="">Payslip Master - Salary Eligibility Days</h1>
            </div>

          </div>
          <div className="">
            <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
          </div>
          <div class="mb-0">
            <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
              <div class="row">
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label For="city" className={`${error && !FromDate ? 'red' : ''}`}>Start Year<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Date"
                      placeholder=""
                      required title="Please Choose the Start Year"
                      autoComplete="off"
                      value={FromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label For="city" className={`${error && !ToDate ? 'red' : ''}`}>End Year<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Date"
                      placeholder=""
                      required title="Please Choose the End Year"
                      autoComplete="off"
                      value={ToDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !EligibleDays ? 'red' : ''}`}>Eligibility Salary Days<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Eligibility Salary Days"
                      autoComplete="off"
                      value={EligibleDays}
                      onChange={(e) => setEligibledays(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                  <button onClick={handleSave} className="" title="Save">
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
                        <label For="city">Start Year</label>
                      </div>
                    </div>
                    <input
                      id="add3"
                      class="exp-input-field form-control"
                      type="Date"
                      placeholder=""
                      required title="Please Choose the Start Year"
                      autoComplete="off"
                      value={Start_Year}
                      onChange={(e) => setStart_Year(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                      id="add3"
                      class="exp-input-field form-control"
                      type="Date"
                      placeholder=""
                      required title="Please Choose the End Year"
                      autoComplete="off"
                      value={End_Year}
                      onChange={(e) => setEnd_Year(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname">Eligibility Salary Days</label>
                      </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      required title="Please Enter the Eligibility Salary Days"
                      autoComplete="off"
                      value={Salary_Days}
                      onChange={(e) => setSalary_Days(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="col-md-2 form-group mb-2 mt-4">
                  <div class="exp-form-floating">
                    <div class=" d-flex  justify-content-center">
                      <div >
                        <icon className="popups-btn fs-6 p-3"
                          onClick={handleSearch} required title="Search">
                          <i className="fas fa-search"></i>
                        </icon>
                      </div>
                      <div>
                        <icon className="popups-btn fs-6 p-3"
                          onClick={reloadGridData}
                          required title="Reload">
                          <i className="fa-solid fa-arrow-rotate-right" />
                        </icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ag-theme-alpine mt-2" style={{ height: 455, width: "100%" }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  rowSelection="multiple"
                  // onRowClicked={(event) => handleRowSelection(event.data)}
                  pagination={true}
                  paginationAutoPageSize={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Input;