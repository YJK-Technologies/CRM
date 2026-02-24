import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import TabButtons from "./Tabs";
import Bankaccdetpopup from "./bankaccdetpopup";
import { showConfirmationToast } from '../ToastConfirmation';

const config = require('../Apiconfig');

function Input({ }) {
  const [EmployeeId, setEmployeeId] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState('');
  const [Account_NO, setAccountNumber] = useState('');
  const [IFSC_Code, setIFSCCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [passBookImg, setPassBookImg] = useState('');
  const [selectedImg, setSelectedImage] = useState(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const bankPermissions = permissions
    .filter(permission => permission.screen_type === 'BankAccDet')
    .map(permission => permission.permission_type.toLowerCase());

  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const [activeTab, setActiveTab] = useState('Bank Account Details');
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning('File size exceeds 1MB. Please upload a smaller file.');
        event.target.value = null;
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setPassBookImg(file);
    }
  };

  const handleInsert = async () => {
    if (!EmployeeId || !Account_NO || !AccountHolderName || !bankName || !IFSC_Code) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("EmployeeId", EmployeeId);
      formData.append("Account_NO", Account_NO);
      formData.append("AccountHolderName", AccountHolderName);
      formData.append("bankName", bankName);
      formData.append("branchName", branchName);
      formData.append("IFSC_Code", IFSC_Code);
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("created_by", sessionStorage.getItem("selectedUserCode"));

      if (passBookImg) {
        formData.append("Bankbook_img", passBookImg);
      }

      const response = await fetch(`${config.apiBaseUrl}/Add_employee_bankdetails`, {
        method: "POST",
        body: formData,
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
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!Account_NO) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to Delete the data?",
      async () => {
        try {
          const Header = {
            Account_NO: Account_NO,
            company_code: sessionStorage.getItem("selectedCompanyCode")
          };

          const response = await fetch(`${config.apiBaseUrl}/Employeebankdetdelete`, {
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


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(EmployeeId)
    }
  };

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeBankDeatils`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();

        const [{ AccountHolderName, designation_id, department_id, First_Name, Account_NO, EmployeeId, bankName, IFSC_Code, branchName, Bankbook_img }] = searchData;

        setAccountHolderName(AccountHolderName);
        setAccountNumber(Account_NO)
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        setEmployeeId(EmployeeId);
        setIFSCCode(IFSC_Code);
        setBankName(bankName);
        setBranchName(branchName);
        setUpdateButtonVisible(true);

        setSaveButtonVisible(false);
        const imageBlob = new Blob([new Uint8Array(Bankbook_img.data)], { type: 'image/jpeg' });

        setPassBookImg(imageBlob);

        const imageUrl = URL.createObjectURL(imageBlob);
        setSelectedImage(imageUrl);

      } else if (response.status === 404) {
        toast.warning("Data not found")
        setAccountHolderName('');
        setAccountNumber('');
        setIFSCCode('');
        setBankName('');
        setBranchName('');
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


  const handleUpdate = async () => {
    if (
      !EmployeeId ||
      !Account_NO ||
      !AccountHolderName ||
      !bankName ||
      !branchName ||
      !IFSC_Code

    ) {
      setError("Please fill all required fields.");
      return;
    }
    // if (!validateEmail(Email)) {
    //   setError("Please enter a valid email address");
    //   return;
    // }
    try {
      const formData = new FormData();
      formData.append("EmployeeId", EmployeeId);
      formData.append("Account_NO", Account_NO);
      formData.append("AccountHolderName", AccountHolderName);
      formData.append("bankName", bankName);
      formData.append("branchName", branchName);
      formData.append("IFSC_Code", IFSC_Code);
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("modified_by", sessionStorage.getItem("selectedUserCode"));

      if (passBookImg) {
        formData.append("Bankbook_img", passBookImg);
      }

      const response = await fetch(`${config.apiBaseUrl}/updateEmployeebankdet`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Data updated successfully");
        setTimeout(() => {
          toast.success("Data updated successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data', {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message, {

      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  }
  const handleBankAccDet = () => {
    setOpen(true);
  };



  const reloadGridData = () => {
    window.location.reload();
  };

  const Employeebankdetails = async (data) => {

    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      const [{ EmployeeId, Account_NO, first_name, department_ID, designation_ID, AccountHolderName, IFSC_Code, bankName, branchName }] = data;

      console.log(data);
      setSelectedImage(`data:image/jpeg;base64,${data[0].Bankbook_img}`);

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
        DPT.value = department_ID;
        setdepartment_id(department_ID);
      } else {
        console.error('EmployeeId  not found');
      }

      const Desig = document.getElementById('designationLabel');
      if (Desig) {
        Desig.value = designation_ID;
        setdesignation_id(designation_ID);
      } else {
        console.error('EmployeeId  not found');
      }


      const accounno = document.getElementById('Account_NO');
      if (accounno) {
        accounno.value = Account_NO;
        setAccountNumber(Account_NO);
      } else {
        console.error('Account_NO not found');
      }

      const accountholder = document.getElementById('AccountHolderName');
      if (accountholder) {
        accountholder.value = AccountHolderName;
        setAccountHolderName(AccountHolderName);
      } else {
        console.error('AccountHolderName not found');
      }
      const IFSCCode = document.getElementById('IFSC_Code');
      if (IFSCCode) {
        IFSCCode.value = IFSC_Code;
        setIFSCCode(IFSC_Code);
      } else {
        console.error('IFSC_Code  not found');
      }
      const bankname = document.getElementById('bankName');
      if (bankname) {
        bankname.value = bankName;
        setBankName(bankName);
      } else {
        console.error('bankName not found');
      }

      const branchname = document.getElementById('branchName');
      if (branchname) {
        branchname.value = branchName;
        setBranchName(branchName);
      } else {
        console.error('branchName not found');
      }

    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setUpdateButtonVisible(true);
      const [{ EmployeeId }] = data;

      console.log(data);


      const employeeId = document.getElementById('EmployeeId');
      if (employeeId) {
        employeeId.value = EmployeeId;
        setEmployeeId(EmployeeId);
      } else {
        console.error('EmployeeId  not found');
      }




    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleRefNo(location.state.employeeId)
  //     }
  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }
  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
  //     } else {
  //       console.log("data not found")
  //     }
  //     if (location.state.designation_id) {
  //       setdesignation_id(location.state.designation_id);
  //     }
  //   }
  // }, [location.state]);

  useEffect(() => {
    const { employeeId, firstName, department_id, designation_id } = location.state || {};

    if (employeeId) {
      setEmployeeId(employeeId);
      setFirst_Name(firstName || "");
      setdepartment_id(department_id || "");
      setdesignation_id(designation_id || "");
    }

    if (employeeId) {
      handleRefNo(employeeId);
    }
  }, [location.state]);

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <div class="d-flex justify-content-start">
                <h1 align="left" class="purbut">Bank Account Details</h1>
              </div>
              <div className="d-flex justify-content-end purbut me-3">
                {saveButtonVisible && ['add', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
                  <savebutton className="purbut" onClick={handleInsert} title="Save">
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton>
                )}
                {updateButtonVisible && ['update', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
                  <savebutton className="purbut" onClick={handleUpdate} required title="Update">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </savebutton>
                )}
                {['delete', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
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
                  <h1 align="left" className="h1" >Bank Account Details</h1>
                </div>
                <div class="dropdown mt-1" >
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {saveButtonVisible && ['add', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
                        <icon class="icon" onClick={handleInsert}>
                          <i class="fa-regular fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                    {updateButtonVisible && ['update', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
                      <li class="iconbutton  d-flex justify-content-center text-primary ">
                        <icon class="icon" onClick={handleUpdate}>
                          <i class="fa-solid fa-floppy-disk"></i>
                        </icon>
                      </li>
                    )}
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {['delete', 'all permission'].some(permission => bankPermissions.includes(permission)) && (
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
                <div className="exp-form-floating">
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
                    />
                    <div className="position-absolute mt-1 me-2">
                      <span className="icon searchIcon" title="Bank Account Details Help" onClick={handleBankAccDet}>
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
                        <label for="cno" className={`${error && !AccountHolderName ? 'red' : ''}`}>Account Holder Name<span className="text-danger">*</span> </label>
                      </div>
                    </div>
                    <input
                      id="cno"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      title="Please Enter the Account Holder Name"
                      value={AccountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="cname" className={`${error && !Account_NO ? 'red' : ''}`}>Account Number<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="Account_NO"
                      class="exp-input-field form-control"
                      type="Number"
                      name="Account_NO"
                      placeholder=""
                      title="Please Enter the Account Number"
                      value={Account_NO}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !IFSC_Code ? 'red' : ''}`}>IFSC Code<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="IFSC_Code"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      value={IFSC_Code}
                      title="Please Enter the IFSC Code"
                      onChange={(e) => setIFSCCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" className={`${error && !bankName ? 'red' : ''}`}>Bank Name
                          <span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="bankName"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      title="Please Enter the Bank Name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="add1" className={`${error && !branchName ? 'red' : ''}`}>Branch Name<span className="text-danger">*</span></label>
                      </div>
                    </div>
                    <input
                      id="branchName"
                      class="exp-input-field form-control"
                      type="text"
                      title="Please Enter the Branch Name"
                      placeholder=""
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels">Bank Passbook Img</label>
                    <input type="file"
                      class="exp-input-field form-control"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div className="exp-form-floating">
                    <div className="image-frame"
                      style={{
                        width: "200px",
                        height: "200px",
                        border: "2px solid #ccc",
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <img
                        src={selectedImg || 'default-placeholder.png'}
                        alt="Preview"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Bankaccdetpopup open={open} handleClose={handleClose} Employeebankdetails={Employeebankdetails} />

        </div>
      </div>
    </div>
  );
}
export default Input;
