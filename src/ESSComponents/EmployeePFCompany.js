import React, { useState } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css';
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import TabButtons from './Tabs.js';
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
  const [rowData, setRowData] = useState([]);
  const [startYear, setStartYear] = useState(FirstDate);
  const [endYear, setEndYear] = useState(LastDate);
  const [error, setError] = useState("");
  const [companyContribution, setCompanyContribution] = useState("");
  const [employeePF, setEmployeePF] = useState("");
  const [Start_Year, setStart_Year] = useState(FirstDate);
  const [End_Year, setEnd_Year] = useState(LastDate);
  const [Company_Fund, setCompany_Fund] = useState(0);
  const [Employee_Fund, setEmployee_Fund] = useState(0);
  const [activeTab, setActiveTab] = useState("EmployeePFCompany")
  const navigate = useNavigate();

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
      valueFormatter: (params) => formatDate(params.value),
      editable: true
    },
    {
      headerName: "End Year",
      field: "End_Year",
      valueFormatter: (params) => formatDate(params.value),
      editable: true
    },
    {
      headerName: "Company Contribution",
      field: "Company_Fund",
      editable: true
    },
    {
      headerName: "Employee PF",
      field: "Employee_Fund",
      editable: true
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

  const handleSave = async () => {
    if (!companyContribution || !employeePF || !startYear || !endYear) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        Employee_Fund: employeePF,
        Company_Fund: companyContribution,
        Start_Year: startYear,
        End_Year: endYear,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/addPfDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
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

  const handleSearch = async () => {
    try {
      const body = {
        Company_Fund,
        Employee_Fund,
        Start_Year,
        End_Year,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      };

      const response = await fetch(`${config.apiBaseUrl}/getPFContribution`, {
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
          Company_Fund: matchedItem.Company_Fund,
          Employee_Fund: matchedItem.Employee_Fund,
          keyfield: matchedItem.keyfield,
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

  const reloadGridData = () => {
    setRowData([])
  };

  const handleUpdate = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/updatePfDetail`, {
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

          const response = await fetch(`${config.apiBaseUrl}/deletePfDetail`, {
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
              <h1 align="left" class="purbut">Payslip Master - PF Contribution</h1>
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
                        <label for="sname" className={`${error && !startYear ? 'red' : ''}`}>Start Year<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      title="Please Choose the Start Year"
                      required
                      autoComplete="off"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !endYear ? 'red' : ''}`}>End Year<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="date"
                      class="exp-input-field form-control"
                      type="date"
                      title="Please Choose the End Year"
                      placeholder=""
                      required
                      autoComplete="off"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !companyContribution ? 'red' : ''}`}>Company Contribution<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      title="Please Enter the Company Contribution"
                      required
                      autoComplete="off"
                      value={companyContribution}
                      onChange={(e) => setCompanyContribution(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="add1" className={`${error && !employeePF ? 'red' : ''}`}>Employee PF<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      title="Please Enter the Employee PF"
                      required
                      autoComplete="off"
                      value={employeePF}
                      onChange={(e) => setEmployeePF(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                  <button className="" onClick={handleSave} title="Save">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </button>
                </div>
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
                  />
                </div>
              </div>
              <div className="col-md-2 form-group mb-2">
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
                  />
                </div>
              </div>
              <div className="col-md-2 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="sname">Company Contribution</label>
                    </div>
                  </div>
                  <input
                    id="fdate"
                    class="exp-input-field form-control"
                    type="Number"
                    placeholder=""
                    required title="Please Enter the Company Contribution"
                    autoComplete="off"
                    value={Company_Fund}
                    onChange={(e) => setCompany_Fund(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-2 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="add1">Employee PF</label>
                    </div>
                  </div>
                  <input
                    id="fdate"
                    class="exp-input-field form-control"
                    type="Number"
                    placeholder=""
                    required title="Please Enter the Employee PF"
                    autoComplete="off"
                    value={Employee_Fund}
                    onChange={(e) => setEmployee_Fund(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-2 form-group mb-2 mt-4">
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
              <div className="ag-theme-alpine mt-2" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  pagination={true}
                  paginationAutoPageSize={true}
                  gridOptions={gridOptions}
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
