import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import TabButtons from "./Tabs";
import Select from 'react-select'
import { useNavigate, useLocation } from "react-router-dom";
import FinancialDetails from "./FinanceDetPopup";
import { showConfirmationToast } from '../ToastConfirmation';

const config = require('../Apiconfig');

function Input({ }) {
  const [EmployeeId, setEmployeeId] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [payscale, setPayscale] = useState("");
  const [PFNo, setPFNo] = useState("");
  const [salaryMonth, setSalaryMonth] = useState("");
  const [error, setError] = useState("");
  const [salaryTypeDrop, setSalaryTypeDrop] = useState([]);
  const [PayscaleDrop, setPayscaleDrop] = useState([]);
  const [selectedSalaryType, setSelectedSalaryType] = useState('');
  const [selectedPayscale, setselectedPayscale] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const financePermissions = permissions
    .filter(permission => permission.screen_type === 'FinanceDet')
    .map(permission => permission.permission_type.toLowerCase());

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSalaryType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setSalaryTypeDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getPayscale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setPayscaleDrop(val));
  }, []);

  const filteredOptionSalaryType = salaryTypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionPayscale = PayscaleDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeSalaryType = (selectedSalaryType) => {
    setSelectedSalaryType(selectedSalaryType);
    setSalaryType(selectedSalaryType ? selectedSalaryType.value : '');
  };

  const handleChangePayscale = (selectedPayscale) => {
    setselectedPayscale(selectedPayscale);
    setPayscale(selectedPayscale ? selectedPayscale.value : '');
  };

  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance = () => {
    navigate("/Family", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const [activeTab, setActiveTab] = useState('Financial Details');
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);

    switch (tabLabel) {
      case 'Personal Details':
        EmployeeLoan();
        break;
      case 'Company Details':
        NavigatecomDet();
        break;
      case 'Financial Details':
        FinanceDet();
        break;
      case 'Bank Account Details':
        BankAccDet();
        break;
      case 'Identity Documents':
        IdentDoc();
        break;
      case 'Academic Details':
        AcademicDet();
        break;
      case 'Family':
        Insurance();
        break;
      case 'Documents':
        Documents();
        break;
      default:
        break;
    }
  };

  const tabs = [
    { label: 'Personal Details' },
    { label: 'Company Details' },
    { label: 'Financial Details' },
    { label: 'Bank Account Details' },
    { label: 'Identity Documents' },
    { label: 'Academic Details' },
    { label: 'Family' },
    { label: 'Documents' }
  ];

  useEffect(() => {
    const { employeeId, firstName, department_id, designation_id } = location.state || {};

    if (employeeId) {
      setEmployeeId(employeeId);
      setFirst_Name(firstName || "");
      setdepartment_id(department_id || "");
      setdesignation_id(designation_id || "");
    }

    if (
      employeeId &&
      salaryTypeDrop?.length > 0 &&
      PayscaleDrop?.length > 0
    ) {
      handleRefNo(employeeId);
    }
  }, [location.state, salaryTypeDrop, PayscaleDrop]);

  const handleSave = async () => {
    if (!EmployeeId || !salaryType || !payscale || !PFNo || !salaryMonth) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        EmployeeId: EmployeeId,
        salaryType: salaryType,
        Payscale: payscale,
        PFNo: PFNo,
        salary_month: salaryMonth,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/addSalaryDetails`, {
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(EmployeeId)
    }
  };

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeSalary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        setSaveButtonVisible(false);
        setUpdateButtonVisible(true);
        setShowAsterisk(false);
        const searchData = await response.json();
        const [{ EmployeeId, PFNo, department_id, First_Name, designation_id, Payscale, salaryType, salary_month }] = searchData;

        setEmployeeId(EmployeeId);
        setPFNo(PFNo);
        setSalaryMonth(salary_month);
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const selectedSalaryType = filteredOptionSalaryType.find(option => option.value === salaryType);
        setSelectedSalaryType(selectedSalaryType);
        console.log(selectedSalaryType.value);
        setSalaryType(selectedSalaryType);

        const selectedOptionPayscale = filteredOptionPayscale.find(option => option.value === Payscale);
        setselectedPayscale(selectedOptionPayscale);
        setPayscale(selectedOptionPayscale);

      } else if (response.status === 404) {
        toast.warning('Data not found');
        setSalaryType('');
        setPayscale('');
        setPFNo('');
        setSalaryMonth('');
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

  const handleDelete = async () => {
    if (!EmployeeId || !PFNo) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to Delete the data ?",
      async () => {
        try {
          const Header = {
            EmployeeId: EmployeeId,
            PFNo: PFNo,
            company_code: sessionStorage.getItem("selectedCompanyCode")
          };

          const response = await fetch(`${config.apiBaseUrl}/deleteSalaryDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Header),
          });

          if (response.status === 200) {
            console.log("Data deleted successfully");
            setTimeout(() => {
              toast.success("Data deleted successfully!", {
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
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleUpdate = async () => {
    if (!EmployeeId || !salaryType || !payscale || !PFNo || !salaryMonth) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data ?",
      async () => {
        try {
          const Header = {
            EmployeeId: EmployeeId,
            salaryType: salaryType,
            Payscale: payscale,
            PFNo: PFNo,
            salary_month: salaryMonth,
            company_code: sessionStorage.getItem('selectedCompanyCode'),
            modified_by: sessionStorage.getItem('selectedUserCode')
          };

          const response = await fetch(`${config.apiBaseUrl}/updateSalaryDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Header),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data updated successfully!", {
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
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const [open, setOpen] = React.useState(false);

  const handleEmployeeInfo = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const finaceDetails = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      setShowAsterisk(false);
      const [{ EmployeeId, salaryType, first_name, Department, Designation, Payscale, PFNo, salaryMonth }] = data;

      console.log(data)

      const employeeIdRef = document.getElementById('EmployeeId');
      if (employeeIdRef) {
        employeeIdRef.value = EmployeeId;
        setEmployeeId(EmployeeId);
      } else {
        console.error('EmployeeId  not found');
      }
      const firstname = document.getElementById('EmployeelabelName');
      if (firstname) {
        firstname.value = first_name;
        setFirst_Name(first_name);
      } else {
        console.error('EmployeeId  not found');
      }

      const DPT = document.getElementById('Departmentlabel');
      if (DPT) {
        DPT.value = Department;
        setdepartment_id(Department);
      } else {
        console.error('EmployeeId  not found');
      }
      const Desig = document.getElementById('designationLabel');
      if (Desig) {
        Desig.value = Designation;
        setdesignation_id(Designation);
      } else {
        console.error('EmployeeId  not found');
      }

      const PFNoRef = document.getElementById('PFNo');
      if (PFNoRef) {
        PFNoRef.value = PFNo;
        setPFNo(PFNo);
      } else {
        console.error('PFNo  not found');
      }

      const salaryMonthRef = document.getElementById('salaryMonth');
      if (salaryMonthRef) {
        salaryMonthRef.value = salaryMonth;
        setSalaryMonth(salaryMonth);
      } else {
        console.error('salaryMonth  not found');
      }

      const salaryTypeRef = document.getElementById('salaryType');
      if (salaryTypeRef) {
        const selectedSalaryType = filteredOptionSalaryType.find(option => option.value === salaryType);
        setSelectedSalaryType(selectedSalaryType);
        setSalaryType(selectedSalaryType.value);
      } else {
        console.error('salaryType element not found');
      }

      const payScaleRef = document.getElementById('payScale');
      if (payScaleRef) {
        const selectedPayscale = filteredOptionPayscale.find(option => option.value === Payscale);
        setselectedPayscale(selectedPayscale);
        setPayscale(selectedPayscale.value);
      } else {
        console.error('salaryType element not found');
      }

    } else {
      console.log("Data not fetched...!");
    }
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only numeric values
      setSalaryMonth(value);
    }
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //   }
  // }, [location.state]);




  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <div class="d-flex justify-content-start">
                <h1 align="left" class="purbut">Financial Details</h1>
              </div>
              <div className="d-flex justify-content-end purbut me-3">
                {saveButtonVisible && ['add', 'all permission'].some(permission => financePermissions.includes(permission)) && (
                  <savebutton className="purbut" onClick={handleSave} title="Save">
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton>
                )}
                {updateButtonVisible && ['update', 'all permission'].some(permission => financePermissions.includes(permission)) && (
                  <savebutton className="purbut" onClick={handleUpdate} required title="Update">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </savebutton>
                )}
                {['delete', 'all permission'].some(permission => financePermissions.includes(permission)) && (
                  <delbutton className="purbut" onClick={handleDelete} required title="Delete">
                    <i class="fa-solid fa-trash"></i>
                  </delbutton>
                )}
                <reloadbutton className="purbut mt-3 me-3" onClick={reloadGridData} title="Reload">
                  <i className="fa-solid fa-arrow-rotate-right"></i>
                </reloadbutton>
              </div>
            </div>
            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1" >Financial Details</h1>
                </div>
                <div class="dropdown mt-1" >
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {saveButtonVisible && ['add', 'all permission'].some(permission => financePermissions.includes(permission)) && (
                        <icon class="icon" onClick={handleSave}>
                          <i class="fa-regular fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                    {updateButtonVisible && ['update', 'all permission'].some(permission => financePermissions.includes(permission)) && (
                      <li class="iconbutton  d-flex justify-content-center text-primary ">
                        <icon class="icon" onClick={handleUpdate}>
                          <i class="fa-solid fa-floppy-disk"></i>
                        </icon>
                      </li>
                    )}
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {['delete', 'all permission'].some(permission => financePermissions.includes(permission)) && (
                        <icon class="icon" onClick={handleDelete}>
                          <i class="fa-solid fa-trash"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-black">
                      <icon class="icon" onClick={reloadGridData}>
                        <i className="fa-solid fa-arrow-rotate-right"></i>
                      </icon>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-lg  bg-light rounded mt-2  p-3">
            <div class="row">
              <div className="col-md-3 form-group mb-2 me-1">
                <label for="cno" className={`${error && !EmployeeId ? 'red' : ''}`}>Employee ID<span className="text-danger">*</span> </label>
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-end">
                    <input
                      id="EmployeeId"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      title="Please Enter the Employee ID"
                      value={EmployeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      maxLength={18}
                      autoComplete="off"
                    />
                    <div className="position-absolute mt-1 me-2">
                      <span className="icon searchIcon" title="Financial Details Help" onClick={handleEmployeeInfo}>
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 form-group mb-2 mt-4">
                <div className="exp-form-floating">
                  <div className="d-flex justify-content">
                    <div>
                      <label htmlFor="EmployeeId " id='EmployeelabelName' className="exp-form-labels partyName">
                        <strong> Employee Name :</strong>{First_Name}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-2 form-group mb-2 mt-4">
                <div className="exp-form-floating">
                  <div className="d-flex justify-content">
                    <div>
                      <label htmlFor="EmployeeId" id='Departmentlabel' className="exp-form-labels partyName">
                        <strong>Department:</strong> {department_id}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 form-group mb-2 mt-4">
                <div className="exp-form-floating">
                  <div className="d-flex justify-content">
                    <div>
                      <label htmlFor="EmployeeId " id='designationLabel' className="exp-form-labels partyName">
                        <strong> Designation :</strong>{designation_id}

                      </label>
                    </div>
                  </div>
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
                        <label for="cname" className={`${error && !salaryType ? 'red' : ''}`}>Salary Type{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <div title="Please Select the Salary Type">
                      <Select
                        id="salaryType"
                        className="exp-input-field"
                        placeholder=""
                        value={selectedSalaryType}
                        onChange={handleChangeSalaryType}
                        options={filteredOptionSalaryType}
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !payscale ? 'red' : ''}`}>Payscale{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                    </div>
                    <div title="Please Select the Payscale">
                      <Select
                        id="payScale"
                        placeholder=""
                        className="exp-input-field"
                        value={selectedPayscale}
                        onChange={handleChangePayscale}
                        options={filteredOptionPayscale}
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !PFNo ? 'red' : ''}`}>PF No<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      class="exp-input-field form-control"
                      type="text"
                      id="PFNo"
                      placeholder=""
                      value={PFNo}
                      onChange={(e) => setPFNo(e.target.value)}
                      maxLength={100}
                      title="Please Enter the PF No"
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div className="exp-form-floating">
                    <div className="d-flex justify-content-start">
                      <div>
                        <label htmlFor="sname" className={`${error && !salaryMonth ? 'red' : ''}`}>
                          Salary Per Annum
                          {showAsterisk && <span className="text-danger">*</span>}
                        </label>
                      </div>
                    </div>
                    <input
                      id="salaryMonth"
                      className="exp-input-field form-control"
                      type="Number"
                      placeholder=""
                      value={salaryMonth}
                      onChange={(e) => handleSalaryChange(e)}
                      maxLength={17}
                      title="Please Enter the Salary Per Annum"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <FinancialDetails open={open} handleClose={handleClose} finaceDetails={finaceDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;
