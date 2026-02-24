import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import TabButtons from "./Tabs";
import Select from 'react-select'
import FamilyDetails from "./FamilyPopup";
import { showConfirmationToast } from '../ToastConfirmation';
const config = require('../Apiconfig');

function Input({ }) {

  const [familyMembers, setFamilyMembers] = useState([{ relation: 'familyMembers', members: [{ relationName: '', name: '', dob: '', Age: '', aadharNo: '', keyfield: '' }] }]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [employeeID, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [relativedrop, setrelationdrop] = useState([]);
  const [relation, setrelationName] = useState("");
  const [open3, setOpen3] = React.useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const familyPermissions = permissions
    .filter(permission => permission.screen_type === 'Family')
    .map(permission => permission.permission_type.toLowerCase());


  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: employeeID, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };


  const addRow = (relation) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: [...item.members, { relationName: '', name: '', dob: '', Age: '', aadharNo: '' }] }
          : item
      )
    );
  };

  const deleteRow = (relation, index) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const RelationInputChange = (relation, index, field, value) => {
    setFamilyMembers((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
            ...item,
            members: item.members.map((member, i) =>
              i === index ? { ...member, [field]: value } : member
            ),
          }
          : item
      )
    );
  };

  const [activeTab, setActiveTab] = useState('Family');
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
        Insurance1();
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

  const handleSave = async () => {

    if (!employeeID) {
      setError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    for (const relationGroup of familyMembers) {
      for (const member of relationGroup.members) {
        if (!member.relationName || !member.name || !member.dob || !member.Age) {
          setError("Please fill all required fields.");
          toast.warning("Error: Missing required fields")

          return;
        }
      }
    }

    const employeeData = familyMembers.flatMap((relationGroup) =>
      relationGroup.members.map((member) => ({
        EmployeeId: employeeID,
        Relation: member.relationName,
        Name: member.name,
        DOB: member.dob,
        AGE: member.Age,
        aadhar_no: member.aadharNo,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode")
      }))
    );

    try {
      const response = await fetch(`${config.apiBaseUrl}/addEmployeeFamily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeData }),
      });
      if (response.ok) {
        toast.success("Data saved successfully");
      } else {
        const error = await response.json();  // This is to handle error message sent from backend
        toast.error(error.message || "Failed to save data");
      }
    } catch (error) {
      toast.error(error.message || "Error saving data");
    }
  };

  const handleDelete = async (relationName, index) => {
    const relationGroup = familyMembers.find(group => group.relation === relationName);
    const member = relationGroup ? relationGroup.members[index] : null;

    if (!member.keyfield) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    if (!member.relationName || !member.name || !member.dob || !member.Age) {
      setError(" ");
      return;
    }

    const keyfieldsToDelete = {
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    showConfirmationToast(
      "Are you sure you want to Delete the data in the row?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeFamily`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keyfieldsToDelete: [keyfieldsToDelete] }),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data deleted successfully!", {
                onClose: () => window.location.reload(),
              });
            }, 1000);
          } else {
            const errorResponse = await response.json();
            console.error(errorResponse.message);
            toast.warning(errorResponse.message, {
            })
          }
        } catch (err) {
          console.error("Error delete data:", err);
          toast.error('Error delete data: ' + err.message, {
          });
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleUpdate = async (relationName, index) => {
    const relationGroup = familyMembers.find(group => group.relation === relationName);
    const member = relationGroup ? relationGroup.members[index] : null;

    if (!member.keyfield) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    if (!member.relationName || !member.name || !member.dob || !member.Age) {
      setError(" ");
      return;
    }

    const editedData = {
      EmployeeId: employeeID,
      Relation: member.relationName,
      Name: member.name,
      DOB: member.dob,
      AGE: member.Age,
      aadhar_no: member.aadharNo,
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    showConfirmationToast(
      "Are you sure you want to update the data in the row ?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeFamily`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ editedData: [editedData] }),
          });

          if (response.ok) {
            setTimeout(() => {
              toast.success("Data updated successfully!", {
                onClose: () => window.location.reload(),
              });
            }, 1000);
          } else {
            const errorResponse = await response.json();
            console.error(errorResponse.message);
            toast.warning(errorResponse.message, {
            })
          }
        } catch (err) {
          console.error("Error delete data:", err);
          toast.error('Error delete data: ' + err.message, {
          });
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmployeeFamily(employeeID)
    }
  };

  const formatDate = (dateString) => {
    if (typeof dateString === 'string' && dateString) {
      const dateParts = dateString.split('T')[0].split('-');
      if (dateParts.length === 3) {
        return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
      }
    }
    return '';
  };

  const handleEmployeeFamily = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeFamily`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), }),
      });

      if (response.ok) {
        setSaveButtonVisible(false);
        setIsAcademicDataLoaded(true);
        setShowAsterisk(false);
        const searchData = await response.json();

        const [{ EmployeeId, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const updatedFamilyMembers = searchData.reduce((acc, item) => {
          const { Relation, Name, DOB, AGE, aadhar_no, keyfield } = item;

          const formattedDOB = formatDate(DOB);

          const memberData = {
            relationName: Relation || "",
            selectRelation: Relation
              ? { value: Relation, label: Relation }
              : null,
            name: Name,
            dob: formattedDOB,
            Age: AGE,
            aadharNo: aadhar_no,
            keyfield: keyfield,
          };

          const existingRelation = acc.find(group => group.relation === Relation);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: Relation,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setFamilyMembers(updatedFamilyMembers);
        setEmployeeId(EmployeeId);
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setFamilyMembers([
          {
            relation: 'familyMembers',
            members: [{
              relationName: '',
              name: '',
              dob: '',
              Age: '',
              aadharNo: '',
              keyfield: ''
            }]
          }
        ]);
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

  const filteredOptionrelation = relativedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {

    fetch(`${config.apiBaseUrl}/getrelation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setrelationdrop(val));
  }, []);


  const handleChangeRelation = (selectedRelation, relation, index) => {
    setFamilyMembers((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  relationName: selectedRelation
                    ? selectedRelation.value
                    : "",
                  selectRelation: selectedRelation,
                }
                : member
            ),
          }
          : doc
      )
    );
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const [open1, setOpen1] = React.useState(false);

  const handleFamilyDetails = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const familyDetails = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setShowAsterisk(false);
      setIsAcademicDataLoaded(true);
      const [{ employeeId }] = data;

      handleEmployeeFamily(employeeId);

    } else {
      console.log("Data not fetched...!");
    }
  };

  const handleDateChange = (e, relation, idx) => {
    const selectedDate = e.target.value;
    const today = new Date();
    const dob = new Date(selectedDate);

    if (selectedDate > today.toISOString().split("T")[0]) {
      toast.warning("Future dates are not allowed!");
      return;
    }

    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--; // Adjust age if birthday hasn't occurred yet this year
    }

    // Update both DOB and Age
    RelationInputChange(relation, idx, "dob", selectedDate);
    RelationInputChange(relation, idx, "Age", age);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleEmployeeFamily(location.state.employeeId);
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
      handleEmployeeFamily(employeeId);
    }
  }, [location.state]);

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded mb-1">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <div class="d-flex justify-content-start">
                <h1 align="left" class="purbut">Family</h1>
              </div>
              <div className="d-flex justify-content-end purbut me-3">
                {saveButtonVisible && ['add', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
                  <savebutton className="purbut" onClick={handleSave} title="Save">
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton>
                )}
                <reloadbutton className="purbut mt-3 me-3" onClick={reloadGridData} title="Reload">
                  <i className="fa-solid fa-arrow-rotate-right"></i>
                </reloadbutton>
              </div>
            </div>
            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1" >Family</h1>
                </div>
                <div class="dropdown mt-1 ms-5" >
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {saveButtonVisible && ['add', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
                        <icon class="icon" onClick={handleSave}>
                          <i class="fa-regular fa-floppy-disk"></i>
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
                <label for="cno" className={`${error && !employeeID ? 'red' : ''}`}>Employee ID{showAsterisk && <span className="text-danger">*</span>}</label>
                <div class="exp-form-floating ">
                  <div class="d-flex justify-content-end">
                    <input
                      id="cno"
                      class="exp-input-field form-control"
                      title="Please Enter the Employee ID"
                      type="text"
                      value={employeeID}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      maxLength={18}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="position-absolute mt-1 me-2">
                      <span className="icon searchIcon" title="Family Help" onClick={handleFamilyDetails}>
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
            {familyMembers.map((relationGroup, relationIndex) => (
              <div key={relationIndex} className="shadow-sm p-1 bg-light rounded-0 ">
                {relationGroup.members.map((member, index) => (
                  <div key={index} className="row  mt-3">
                    <div className="col-md-1 mt-4">
                      <button type="button" className="btn btn-primary ms-3" onClick={() => addRow(relationGroup.relation)}>
                        <i className="fa-solid fa-circle-plus"></i>
                      </button>
                      {relationGroup.members.length > 1 && (
                        <button type="button" className="btn btn-danger" onClick={() => deleteRow(relationGroup.relation, index)}>
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div>
                        <label for="cno" className={`${error && !member.relationName ? 'red' : ''}`}>Relation{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                      <div title="Please Select the Relation">
                        <Select
                          className="exp-input-field"
                          value={member.selectRelation}
                          options={filteredOptionrelation}
                          maxLength={50}
                          onChange={(selectedRelation) =>
                            handleChangeRelation(selectedRelation, relationGroup.relation, index)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div>
                        <label for="cno" className={`${error && !member.name ? 'red' : ''}`}>Name{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                      <input
                        type="text"
                        className="exp-input-field form-control"
                        placeholder=""
                        value={member.name}
                        pattern="[A-Za-z]+"
                        maxLength={250}
                        title="Please Enter the Name"
                        // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'name', e.target.value)}
                        onChange={(e) => {
                          const onlyLetters = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          RelationInputChange(relationGroup.relation, index, 'name', onlyLetters);
                        }}
                      />
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div>
                        <label for="cno" className={`${error && !member.dob ? 'red' : ''}`}>DOB{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                      <input
                        type="date"
                        className="exp-input-field form-control"
                        title="Please Enter the Date Of Birth"
                        value={member.dob}
                        placeholder=''
                        max={new Date().toISOString().split("T")[0]} // Restrict future dates
                        onChange={(e) => handleDateChange(e, relationGroup.relation, index)}
                      />
                    </div>
                    <div className="col-md-1 form-group mb-2">
                      <div>
                        <label for="cno" className={`${error && !member.Age ? 'red' : ''}`}>Age{showAsterisk && <span className="text-danger">*</span>}</label>
                      </div>
                      <input
                        type="number"
                        className="exp-input-field form-control"
                        value={member.Age}
                        placeholder=''
                        title="Please Enter the Age"
                        readOnly
                      // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'Age', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div>
                        <label for="cno" class="exp-form-labels">Aadhaar No</label>
                      </div>
                      <input
                        type="number"
                        className="exp-input-field form-control"
                        value={member.aadharNo}
                        maxLength={18}
                        title="Please Enter the Aadhaar No"
                        placeholder=''
                        onChange={(e) => RelationInputChange(relationGroup.relation, index, 'aadharNo', e.target.value)}
                      />
                    </div>
                    <div className="col-md-1 mt-4">
                      {isAcademicDataLoaded && (
                        <>
                          {['update', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-success"
                              title="Update"
                              onClick={() => handleUpdate(relationGroup.relation, index)} // Pass the specific row data
                            >
                              <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                          )}
                          {['delete', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              title="Delete"
                              onClick={() => handleDelete(relationGroup.relation, index)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div>
            <FamilyDetails open={open1} handleClose={handleClose} familyDetails={familyDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;
