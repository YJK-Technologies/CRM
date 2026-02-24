import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import TabButtons from './Tabs.js';
import Select from 'react-select';
import Companydetailpopup from "./companydetailpopup.js";
import { showConfirmationToast } from '../ToastConfirmation';

const config = require('../Apiconfig');

function Input() {
  const [activeTab, setActiveTab] = useState('Company Details');
  const [Shiftdrop, setShiftdrop] = useState([]);
  const [Shift, setShift] = useState("");
  const [selectedShift, setSelectedShift] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [DPTdrop, setDPTdrop] = useState([]);
  const [status, setStatus] = useState('');
  const [customerDataDrop, setCustomerDatadrop] = useState([]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [selecteddpt, setselecteddept] = useState("");
  const [dpt, setdpt] = useState("");
  const [Designation, setDesignation] = useState("");
  const [DOJ, setDOJ] = useState("");
  const [DOL, setDOL] = useState("");
  const [manager, setManager] = useState("");
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [selecteddesg, setSelecteddesg] = useState('');
  const [selectedmanager, setselectedmanager] = useState('');
  const [first_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [Managerdrop, setManagerdrop] = useState([]);

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const companyPermissions = permissions
    .filter(permission => permission.screen_type === 'CompanyDetails')
    .map(permission => permission.permission_type.toLowerCase());


  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch status options
  useEffect(() => {

    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getDept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setDPTdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getESSmanager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  // Handle status change
  const handleStatusChange = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
  };

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionDPt = DPTdrop.map((option) => ({
    value: option.Department,
    label: option.Department,
  }));

  const filteredOptionShift = Shiftdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  // shift dropdown function 
  useEffect(() => {

    fetch(`${config.apiBaseUrl}/getcompanyshift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setShiftdrop(val));
  }, []);

  // Handle shift change
  const handleShiftChange = (selectedShift) => {
    setSelectedShift(selectedShift);
    setShift(selectedShift ? selectedShift.value : '');
  };

  // Handle shift change
  const handleDPT = (selectedDPT) => {
    setselecteddept(selectedDPT);
    setdpt(selectedDPT ? selectedDPT.value : '');
    fetchProductCodes(selectedDPT ? selectedDPT.value : '');
  };

  const handleChangedesgination = (selecteddesg) => {
    setDesignation(selecteddesg);
    setSelecteddesg(selecteddesg ? selecteddesg.value : '');
  };

  const handleChangeCode = (selectedOption) => {
    setselectedmanager(selectedOption);
    setManager(selectedOption ? selectedOption.value : '');
  };

  // Manager change effect to fetch shift data using selected manager's company code
  useEffect(() => {
    if (selectedmanager && selectedmanager.companyCode) {
      fetch(`${config.apiBaseUrl}/getESSmanager`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: selectedmanager.companyCode,
        }),
      })
        .then((response) => response.json())
        .then((data) => setShiftdrop(data)) // Assuming setShiftdrop updates the shift dropdown
        .catch((error) => console.error("Error fetching shifts:", error));
    }
  }, [selectedmanager]);


  const company_code = sessionStorage.getItem('selectedCompanyCode')

  const fetchProductCodes = async (selectedValue) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getDesgination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dept_id: selectedValue, company_code }),
      });

      const data = await response.json();
      const formattedData = data.map((product) => ({
        value: product.Desgination,
        label: product.Desgination,
      }));

      setDynamicOptions(formattedData);
      return formattedData; // Return fetched data
    } catch (error) {
      console.error('Error fetching product codes:', error);
      return [];
    }
  };

  const fetchmanager = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getESSmanager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') }), // Send only the value
      });

      const data = await response.json();
      const formattedData = data.map((product) => ({
        label: `${product.EmployeeId} - ${product.full_name}`,
        value: product.EmployeeId,
      }));

      setManagerOptions(formattedData);
      return formattedData; // Return fetched data
    } catch (error) {
      console.error('Error fetching managers:', error);
      return [];
    }
  };


  const handleSave = async () => {

    if (!EmployeeId || !dpt || !selecteddesg || !DOJ || !manager || !Shift || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        EmployeeId,
        department_ID: dpt,
        designation_ID: selecteddesg,
        DOJ,
        manager: manager,
        shift: Shift,
        status: status,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode') // Assuming this value is required
      };

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeCompany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header), // Sending the data
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
        console.error(errorResponse.message);
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  // Handle Delete operation
  const handleDelete = async () => {
    if (!EmployeeId) {
      setError("Employee ID is required.");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to Delete the data?",
      async () => {
        try {
          const Header = {
            EmployeeId: EmployeeId,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }
          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeCompany`, {

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
    if (!EmployeeId || !dpt || !selecteddesg || !DOJ || !manager || !Shift || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {
          const Header = {
            EmployeeId: EmployeeId,
            department_ID: dpt,
            designation_ID: selecteddesg,
            DOJ,
            manager: manager,
            shift: Shift,
            status: status,
            company_code: sessionStorage.getItem('selectedCompanyCode'),
            modified_by: sessionStorage.getItem('selectedUserCode')
          };

          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeCompany`, {
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

  // Handle tab navigation
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    switch (tabLabel) {
      case 'Personal Details':
        navigate("/AddEmployeeInfo", { state: { employeeId: EmployeeId, firstName: first_Name, department_id: department_id, designation_id: designation_id } });
        break;
      case 'Company Details':
        navigate("/CompanyDetails", { state: { employeeId: EmployeeId, firstName: first_Name } });
        break;
      case 'Financial Details':
        navigate("/FinanceDet", { state: { employeeId: EmployeeId, firstName: first_Name, department_id: department_id, designation_id: designation_id } });
        break;
      case 'Bank Account Details':
        navigate("/BankAccDet", { state: { employeeId: EmployeeId, firstName: first_Name, department_id: department_id, designation_id: designation_id } });
        break;
      case 'Identity Documents':
        navigate("/IdentDoc", { state: { employeeId: EmployeeId, firstName: first_Name, department_id: department_id, designation_id: designation_id } });
        break;
      case 'Academic Details':
        navigate("/AcademicDet", { state: { employeeId: EmployeeId, firstName: first_Name, department_id: department_id, designation_id: designation_id } });
        break;
      case 'Family':
        navigate("/Family", { state: { employeeId: EmployeeId, firstName: first_Name, department_id: department_id, designation_id: designation_id } });
        break;
      case 'Documents':
        navigate("/Documents", { state: { employeeId: EmployeeId, firstName: first_Name, department_id: department_id, designation_id: designation_id } });
        break;
      default:
        break;
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCompanyDetails = () => {
    setOpen(true);
  };

  const CompanyDetails = async (data) => {

    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      setShowAsterisk(false);
      const [{ EmployeeId, first_name, Department, Designation, DOJ, DOL, manager, shift, status }] = data;

      console.log(data);

      const employeeId = document.getElementById('EmployeeId');
      if (employeeId) {
        employeeId.value = EmployeeId;
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

      const dOJ = document.getElementById('DOJ');
      if (dOJ) {
        dOJ.value = DOJ;
        setDOJ(formatDate(DOJ));
      } else {
        console.error('Date of Joining  not found');
      }

      const dOl = document.getElementById('DOL');
      if (dOl) {
        dOl.value = DOL;
        setDOL(formatDate(DOL));
      } else {
        console.error('Date of Leave not found');
      }

      const department = document.getElementById('department');
      if (department) {
        const selectedDepartment = filteredOptionDPt.find(option => option.value === Department);
        setselecteddept(selectedDepartment);
        setdpt(selectedDepartment.value)
      } else {
        console.error('department element not found');
      }

      const designationOptions = await fetchProductCodes(Department);

      const designation = document.getElementById('designation');
      if (designation) {
        const selectedDesignation = designationOptions.find(option => option.value === Designation);
        setDesignation(selectedDesignation);
        setSelecteddesg(selectedDesignation.value)
      } else {
        console.error('designation element not found');
      }

      const managerOptions = await fetchmanager(Designation);

      const managers = document.getElementById('manager');
      if (managers) {
        const selectedManager = managerOptions.find(option => option.value === manager);
        console.log(selectedManager)
        if (selectedManager) {
          setselectedmanager(selectedManager);
          setManager(selectedManager.value);
        } else {
          console.warn('Manager not found in options:', manager);
          setselectedmanager(null);
          setManager('');
        }
      } else {
        console.error('designation element not found');
      }

      const Shift = document.getElementById('shift');
      if (Shift) {
        const selectedShift = filteredOptionShift.find(option => option.value === shift);
        setShift(selectedShift.value);
        setSelectedShift(selectedShift);
      } else {
        console.error('shift element not found');
      }

      const Status = document.getElementById('status');
      if (Status) {
        const selectedStatus = filteredOptionStatus.find(option => option.value === status);
        setStatus(selectedStatus.value);
        setSelectedStatus(selectedStatus);
      } else {
        console.error('status element not found');
      }


      console.log(data);
    };
  }

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNO(EmployeeId)
    }
  };

  const handleRefNO = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmpcompanyDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), }),
      });

      if (response.ok) {
        setSaveButtonVisible(false);
        setShowAsterisk(false);
        setUpdateButtonVisible(true);
        const searchData = await response.json();

        if (searchData && searchData.length > 0) {
          const [{ EmployeeId, department_ID, First_Name, designation_ID, DOJ, DOL, manager, shift, status }] = searchData;
          const formatDateDOJ = DOJ ? new Date(DOJ).toISOString().split('T')[0] : '';
          const formatDateDOL = DOL ? new Date(DOL).toISOString().split('T')[0] : '';

          setEmployeeId(EmployeeId);
          setdepartment_id(department_ID);
          setdesignation_id(designation_ID);
          setFirst_Name(First_Name);
          console.log(First_Name)
          setDOJ(formatDateDOJ);
          setDOL(formatDateDOL);

          const selecteddept = filteredOptionDPt.find(option => option.value === department_ID);
          setselecteddept(selecteddept);
          setdpt(selecteddept?.value || null);

          const designationData = await fetchProductCodes(department_ID);
          const selectedDesg = designationData.find(option => option.value === designation_ID);
          setDesignation(selectedDesg);
          setSelecteddesg(selectedDesg?.value || null);

          const managerData = await fetchmanager(designation_ID);
          const selectedmanager = managerData.find(option => option.value === manager);
          console.log(selectedmanager)
          setselectedmanager(selectedmanager);
          setManager(selectedmanager?.value || null);

          const selectedShift = filteredOptionShift.find(option => option.value === shift);
          setSelectedShift(selectedShift);
          setShift(selectedShift?.value || null);

          const selectedStatus = filteredOptionStatus.find(option => option.value === status);
          setSelectedStatus(selectedStatus);
          setStatus(selectedStatus?.value || null);

        }
      } else if (response.status === 404) {
        toast.warning("Employee not found");
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

  const reloadGridData = () => {
    window.location.reload();
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
      DPTdrop?.length > 0 &&
      statusdrop?.length > 0 &&
      Managerdrop?.length > 0
    ) {
      handleRefNO(employeeId);
    }
  }, [location.state, DPTdrop, Managerdrop, statusdrop]);

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //     }
  //     if (location.state.employeeId && DPTdrop && Managerdrop && statusdrop && Shiftdrop) {
  //       handleRefNO(location.state.employeeId);
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
  //     }
  //     if (location.state.designation_id) {
  //       setdesignation_id(location.state.designation_id);
  //     }
  //   }
  // }, [location.state, DPTdrop, Managerdrop, statusdrop, Shiftdrop]);

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-light rounded">
        <div className="purbut mb-0 d-flex justify-content-between" >
          <div class="d-flex justify-content-start">
            <h1 align="left" class="purbut">Company Details</h1>
          </div>
          <div className="d-flex justify-content-end purbut me-3">
            {saveButtonVisible && ['add', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
              <savebutton className="purbut" onClick={handleSave} title="Save">
                <i class="fa-regular fa-floppy-disk"></i>
              </savebutton>
            )}
            {updateButtonVisible && ['update', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
              <savebutton className="purbut" onClick={handleUpdate} required title="Update">
                <i class="fa-solid fa-floppy-disk"></i>
              </savebutton>
            )}
            {['delete', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
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
              <h1 align="left" className="h1" >Company Details</h1>
            </div>
            <div class="dropdown mt-1" >
              <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-list"></i>
              </button>
              <ul class="dropdown-menu">
                <li class="iconbutton d-flex justify-content-center text-success">
                  {saveButtonVisible && ['add', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
                    <icon class="icon" onClick={handleSave}>
                      <i class="fa-regular fa-floppy-disk"></i>
                    </icon>
                  )}
                </li>
                {updateButtonVisible && ['update', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
                  <li class="iconbutton  d-flex justify-content-center text-primary ">
                    <icon class="icon" onClick={handleUpdate}>
                      <i class="fa-solid fa-floppy-disk"></i>
                    </icon>
                  </li>
                )}
                <li class="iconbutton  d-flex justify-content-center text-danger">
                  {['delete', 'all permission'].some(permission => companyPermissions.includes(permission)) && (
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
      <div className="shadow-lg bg-light rounded mt-2 p-3">
        <div className="row">
          <div className="col-md-3 form-group mb-2 me-1">
            <label htmlFor="EmployeeId" className={`${error && !EmployeeId ? 'red' : ''}`}>Employee ID<span className="text-danger">*</span></label>
            <div className="exp-form-floating">
              <div class="d-flex justify-content-end">
                <input
                  id="EmployeeId"
                  className="exp-input-field form-control "
                  maxLength={100}
                  required
                  value={EmployeeId}
                  title="Please Enter the Employee ID"
                  onChange={(e) => setEmployeeId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoComplete="off"
                />
                <div className="position-absolute mt-1 me-2">
                  <span className="icon searchIcon" title="Company Details Help" onClick={handleCompanyDetails}>
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
                    <strong> Employee Name :</strong>{first_Name}
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
      <TabButtons tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      <div className="shadow-lg p-3 bg-light rounded-bottom mb-2">
        <div className="row">
          <div className="col-md-3 form-group mb-2">
            <label htmlFor="selecteddpt" className={`${error && !selecteddpt ? 'red' : ''}`}>
              Department{showAsterisk && <span className="text-danger">*</span>}
            </label>
            <div title="Please Select the Department">
              <Select
                id="department"
                className="exp-input-field"
                type="text"
                value={selecteddpt}
                onChange={handleDPT}
                options={filteredOptionDPt}
              />
            </div>
          </div>
          <div className="col-md-3 form-group mb-2">
            <label htmlFor="selecteddpt" className={`${error && !selecteddpt ? 'red' : ''}`}>
              Designation{showAsterisk && <span className="text-danger">*</span>}
            </label>
            <div title="Please Select the Designation">
              <Select
                id="designation"
                className=" exp-input-field position-relative"
                name="designation_ID"
                type="text"
                value={Designation}
                options={dynamicOptions}
                onChange={handleChangedesgination}
              />
            </div>
          </div>
          <div className="col-md-3 form-group mb-2">
            <label htmlFor="DOJ" className={`${error && !DOJ ? 'red' : ''}`}>
              DOJ{showAsterisk && <span className="text-danger">*</span>}
            </label>
            <input
              id="DOJ"
              className="exp-input-field form-control"
              type="date"
              name="DOJ"
              value={DOJ}
              onChange={(e) => setDOJ(e.target.value)}
              required
              title="Please Enter the Date Of Joinig"
            />
          </div>
          <div className="col-md-3 form-group mb-2">
            <label htmlFor="DOL" className="exp-form-labels">DOL</label>
            <input
              id="DOL"
              className="exp-input-field form-control"
              type="date"
              name="DOL"
              value={DOL}
              onChange={(e) => setDOL(e.target.value)}
              title="Please Enter the Date Of Leaving"
            />
          </div>
          <div className="col-md-3 form-group mb-2">
            <div class="exp-form-floating">
              <label htmlFor="selectedmanager" className={`${error && !selectedmanager ? 'red' : ''}`}>
                Manager{showAsterisk && <span className="text-danger">*</span>}
              </label>
              <div title="Please Select the Manager">
                <Select
                  id="manager"
                  className="exp-input-field"
                  type="text"
                  name="manager"
                  value={selectedmanager}
                  options={filteredOptionManager}
                  onChange={handleChangeCode}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-md-3 form-group mb-2">
            <label htmlFor="EmployeeId" class="exp-form-labels">Shift</label>
            <div title="Please Select the Shift">
              <Select
                id="shift"
                type="text"
                value={selectedShift}
                onChange={handleShiftChange}
                options={filteredOptionShift}
              />
            </div>
          </div>
          <div className="col-md-3 form-group mb-2">
            <label htmlFor="Status" className={`${error && !selectedStatus ? 'red' : ''}`}>
              Status{showAsterisk && <span className="text-danger">*</span>}
            </label>
            <div title="Please Select the Status">
              <Select
                id="status"
                type="text"
                value={selectedStatus}
                onChange={handleStatusChange}
                options={filteredOptionStatus}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Companydetailpopup open={open} handleClose={handleClose} CompanyDetails={CompanyDetails} />
      </div>
    </div>
  );
}

export default Input;
