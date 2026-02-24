import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import { useNavigate, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import TabButtons from "./Tabs";
import AcademicDetails from "./AcademicDetPopup.js";
import PdfPreview from './PdfPreviewHelp'
import EmployeeInfoPopup from "./EmployeeinfoPopup.js";

const config = require('../Apiconfig');

function Input({ }) {

  const [Academic, setAcademic] = useState([{ relation: 'Academic', members: [{ academicName: '', major: '', institution: '', academicYear: '', document: null, documentUrl: '', keyfield: '' }] }]);
  const [EmployeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [document, setDocument] = useState("");
  const [documentUrl, setDocumentUrl] = useState({});
  const navigate = useNavigate();
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [open, setOpen] = React.useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const employeeIdRef = useRef(null);
  const [showAsterisk, setShowAsterisk] = useState(true);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const academicPermissions = permissions
    .filter(permission => permission.screen_type === 'AcademicDet')
    .map(permission => permission.permission_type.toLowerCase());

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };


  const addRow = (relation) => {
    setAcademic((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: [...item.members, { academicName: '', major: '', institution: '', academicYear: '', document: null, documentUrl: '', keyfield: '' }] }
          : item
      )
    );
  };

  const deleteRow = (relation, index) => {
    setAcademic((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const handleSave = async () => {
    if (
      !EmployeeId) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    for (const relationGroup of Academic) {
      for (const member of relationGroup.members) {
        if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
      }
    }

    const employeeData = await Promise.all(


      Academic.flatMap((relationGroup) =>
        relationGroup.members.map(async (member) => {
          if (member.document) {
            // Check if file size exceeds 1MB before proceeding
            const fileSize = member.document.size;
            const maxSize = 1 * 1024 * 1024; // 1MB

            if (fileSize > maxSize) {
              toast.warning('File size exceeds 1MB. Please upload a smaller file.');
              return; // Exit early if file is too large
            }

            const fileBase64 = member.document ? await convertToBase64(member.document) : null;
            console.log(fileBase64)
            return {
              EmployeeId: EmployeeId,
              academicName: member.academicName,
              major: member.major,
              institution: member.institution,
              academicYear: member.academicYear,
              document: fileBase64,
              company_code: sessionStorage.getItem("selectedCompanyCode"),
              created_by: sessionStorage.getItem("selectedUserCode"),
            };
          }
        })
      )

    );

    try {
      const response = await fetch(`${config.apiBaseUrl}/addEmployeeAcademicDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeData }),
      });
      if (response.ok) {
        setTimeout(() => {
          toast.success("Data saved successfully!", {
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
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
      reader.onerror = (error) => reject(error);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAcademic(EmployeeId)
    }
  };

  // const formatDate = (dateString) => {
  //   if (typeof dateString === 'string' && dateString) {
  //     const dateParts = dateString.split('T')[0].split('-');
  //     if (dateParts.length === 3) {
  //       return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
  //     }
  //   }
  //   return '';
  // };

  const convertBufferToBlobUrlAndFile = (buffer, fileName = "document.pdf", mimeType = "application/pdf") => {
    if (buffer && buffer.type === "Buffer") {
      const byteArray = new Uint8Array(buffer.data);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const file = new File([blob], fileName, { type: mimeType });
      return { blobUrl, file };
    }
    return { blobUrl: null, file: null };
  };

  const handleAcademic = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAcademicDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();
        setSaveButtonVisible(false);
        setShowAsterisk(false);
        setIsAcademicDataLoaded(true);
        const [{ EmployeeId, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);

        const updatedFamilyMembers = searchData.reduce((acc, item) => {
          const { academicName, academicYear, document, institution, keyfield, major } = item;

          console.log(document)
          const formattedDOB = formatDate(academicYear);

          let documentUrl = null;
          let documentFile = null;

          if (document) {
            const { blobUrl, file } = convertBufferToBlobUrlAndFile(document);
            if (blobUrl) {
              documentUrl = blobUrl;
            }

            if (file) {
              documentFile = file;
            }
          }

          const memberData = {
            academicName: academicName,
            major: major,
            institution: institution,
            academicYear: formattedDOB,
            keyfield: keyfield,
            documentUrl: documentUrl,
            document: documentFile
          };

          const existingRelation = acc.find(group => group.relation === academicName);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: academicName,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setAcademic(updatedFamilyMembers);
        setEmployeeId(EmployeeId);
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setAcademic([
          {
            relation: 'Academic',
            members: [{
              academicName: '',
              major: '',
              institution: '',
              academicYear: '',
              document: null,
              documentUrl: '',
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

  const RelationInputChange = (relation, index, field, value) => {
    setAcademic((prev) =>
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




  const handleFileChange = (event, relation, index) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);

      setAcademic((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.relation === relation
            ? {
              ...doc,
              members: doc.members.map((member, i) =>
                i === index
                  ? {
                    ...member,
                    document: file,
                    documentUrl: fileUrl,
                  }
                  : member
              ),
            }
            : doc
        )
      );

      setDocumentUrl((prev) => ({
        ...prev,
        [index]: fileUrl,
      }));
    } else {
      toast.warning('Please upload a valid PDF file.');
      event.target.value = '';
    }
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

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: EmployeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };


  const [activeTab, setActiveTab] = useState('Academic Details');
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

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleUpdate = async (relationName, index) => {
    const relationGroup = Academic.find(group => group.relation === relationName);
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

    if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
      setError(" ");
      return;
    }

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const editedData = {
      EmployeeId: EmployeeId,
      academicName: member.academicName,
      major: member.major,
      institution: member.institution,
      academicYear: member.academicYear,
      document: fileBase64,
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/updateEmployeeAcademicDetails`, {
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
  };

  const handleDelete = async (relationName, index) => {
    const relationGroup = Academic.find(group => group.relation === relationName);
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

    if (!member.academicName || !member.major || !member.institution || !member.academicYear) {
      setError(" ");
      return;
    }

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const keyfieldsToDelete = {
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeAcademicDetails`, {
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAcademicDetails = () => {
    setOpen(true);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  //base64 to pdf conversion (url + file)
  // const convertBase64ToBlobUrlAndFile = (base64, fileName = "document.pdf", mimeType = "application/pdf") => {
  //   if (base64) {
  //     const byteCharacters = atob(base64); 
  //     const byteArrays = new Uint8Array(byteCharacters.length);

  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteArrays[i] = byteCharacters.charCodeAt(i);
  //     }

  //     const blob = new Blob([byteArrays], { type: mimeType });
  //     const blobUrl = URL.createObjectURL(blob);
  //     const file = new File([blob], fileName, { type: mimeType });

  //     return { blobUrl, file };
  //   }
  //   return { blobUrl: null, file: null };
  // };

  // const academicDetails = async (data) => {
  //   if (data && data.length > 0) {
  //     setSaveButtonVisible(false);
  //     setIsAcademicDataLoaded(true);
  //     const [{ employeeId }] = data;

  //     if (employeeIdRef.current) {
  //       employeeIdRef.current.value = employeeId;
  //       setEmployeeId(employeeId);
  //     } else {
  //       console.error('EmployeeId input not found');
  //     }

  //     const updatedMembers = data.map((item) => {
  //       const { blobUrl, file } = convertBase64ToBlobUrlAndFile(item.document);

  //       return {
  //         academicName: item.academicName,
  //         major: item.major,
  //         institution: item.institution,
  //         academicYear: formatDate(item.academicYear),
  //         document: file,
  //         documentUrl: blobUrl, 
  //         keyfield: item.keyfield || ''
  //       };
  //     });

  //     setAcademic([{ relation: 'Academic', members: updatedMembers }]);
  //     console.log(data);
  //   } else {
  //     console.log("Data not fetched...!");
  //   }
  // };



  const academicDetails = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setShowAsterisk(false);
      setIsAcademicDataLoaded(true);
      const [{ employeeId }] = data;

      handleAcademic(employeeId);

    } else {
      console.log("Data not fetched...!");
    }
  };

  const handleDateChange = (e, relation, idx) => {
    const selectedDate = new Date(e.target.value); // Convert to Date object
    const today = new Date(); // Get today's date

    if (selectedDate > today) {
      toast.warning("Future dates are not allowed!");
    } else {
      RelationInputChange(relation, idx, 'academicYear', e.target.value);
    }
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);

      const [{ EmployeeId }] = data;

      console.log(data);

      if (EmployeeId) {
        // ? Just set the value in state
        setEmployeeId(EmployeeId);
      } else {
        console.error('EmployeeId not found');
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
  //       handleAcademic(location.state.employeeId); // ✅ Automatically run function
  //     }

  //     if (location.state.firstName) {
  //       setFirst_Name(location.state.firstName);
  //     }

  //     if (location.state.department_id) {
  //       setdepartment_id(location.state.department_id);
  //     } else {
  //       console.log("Department data not found");
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
      handleAcademic(employeeId);
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
                <h1 class="purbut">Academic Details</h1>
              </div>
              <div className="d-flex justify-content-end purbut me-3">
                {saveButtonVisible && ['add', 'all permission'].some(permission => academicPermissions.includes(permission)) && (
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
                  <h1 align="left" className="h1" >Academic Details</h1>
                </div>
                <div class="dropdown mt-1" >
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {saveButtonVisible && ['add', 'all permission'].some(permission => academicPermissions.includes(permission)) && (
                        <icon class="icon" onClick={handleSave} title="Save">
                          <i class="fa-regular fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center text-black">
                      <icon class="icon" onClick={reloadGridData} title="Reload">
                        <i className="fa-solid fa-arrow-rotate-right"></i>
                      </icon>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-lg bg-light rounded mt-2 p-3">
            <div class="row">
              <div className="col-md-3 form-group mb-2 me-1">
                <label for="cno" className={`${error && !EmployeeId ? 'red' : ''}`}>Employee ID{showAsterisk && <span className="text-danger">*</span>}</label>
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-end">
                    <input
                      id="employeeId"
                      className="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required
                      title="Please enter the Employee ID"
                      value={EmployeeId}
                      ref={employeeIdRef}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      maxLength={18}
                      onKeyPress={handleKeyPress}
                      autoComplete="off"
                    />
                    <div className="position-absolute mt-1 me-2">
                      <span className="icon searchIcon" title="Academic Details Help" onClick={handleAcademicDetails}>
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
          <div class="mb-4">
            {Academic.map((relationGroup, relationIndex) => (
              <div key={relationIndex} className="shadow-sm p-1 bg-light rounded-0 ">
                {relationGroup.members.map((member, index) => (
                  <div key={index} className="row  mt-3">
                    <div className="col-md-1 mt-4">
                      <button type="button" className="btn btn-primary ms-3" onClick={() => addRow(relationGroup.relation)}>
                        <i className="fa-solid fa-circle-plus"></i>
                      </button>
                      {relationGroup.members.length > 1 && (
                        <button type="button" className="btn btn-danger"
                          onClick={() => deleteRow(relationGroup.relation, index)}>
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <label className={`${error && !member.academicName ? 'red' : ''}`}>Academic Name{showAsterisk && <span className="text-danger">*</span>}</label>
                      <input
                        type="text"
                        className="exp-input-field form-control"
                        value={member.academicName}
                        maxLength={50}
                        title="Please enter the Academic Name"
                        onChange={(e) => RelationInputChange(relationGroup.relation, index, 'academicName', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <label className={`${error && !member.major ? 'red' : ''}`}>Major{showAsterisk && <span className="text-danger">*</span>}</label>
                      <input
                        type="text"
                        className="exp-input-field form-control"
                        value={member.major}
                        maxLength={125}
                        title="Please enter the Major"
                        onChange={(e) => RelationInputChange(relationGroup.relation, index, 'major', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <label className={`${error && !member.institution ? 'red' : ''}`}>Institution{showAsterisk && <span className="text-danger">*</span>}</label>
                      <input
                        type="text"
                        className="exp-input-field form-control"
                        value={member.institution}
                        maxLength={225}
                        title="Please enter the Institution"
                        onChange={(e) => RelationInputChange(relationGroup.relation, index, 'institution', e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="add1" className={`${error && !member.relationName ? 'red' : ''}`}>Academic Year{showAsterisk && <span className="text-danger">*</span>}</label>
                          </div>
                        </div>
                        <input
                          id="fdate"
                          class="exp-input-field form-control"
                          type="date"
                          placeholder=""
                          title="Please enter the Academic Year"
                          // onChange={(e) => RelationInputChange(relationGroup.relation, index, 'academicYear', e.target.value)}
                          value={member.academicYear}
                          max={new Date().toISOString().split("T")[0]} // Restrict future dates
                          onChange={(e) => handleDateChange(e, relationGroup.relation, index)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="add1" class="exp-form-labels">Upload Document</label>
                          </div>
                        </div>
                        <input
                          id={`add2-${index}`}
                          type="file"
                          className="exp-input-field form-control"
                          accept="application/pdf"
                          onChange={(event) => handleFileChange(event, relationGroup.relation, index)}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 mt-4">
                      {isAcademicDataLoaded && (
                        <>
                          {['update', 'all permission'].some(permission => academicPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-success"
                              title="Update"
                              onClick={() => handleUpdate(relationGroup.relation, index)} // Pass the specific row data
                            >
                              <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                          )}
                          {['delete', 'all permission'].some(permission => academicPermissions.includes(permission)) && (
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
                    <div className="Des">
                      <div className=" d-flex justify-content-end  mb-2">
                        <div className="exp-form-floating">
                          <div className="pdf-frame"
                            style={{
                              width: "200px",
                              height: "200px",
                              border: "2px solid #ccc",
                              padding: "10px",
                              textAlign: "center",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              marginRight: "150px",
                            }}
                            onClick={() => handlePdfClick(member.documentUrl)}
                          >
                            {member.documentUrl ? (
                              <iframe
                                src={member.documentUrl} // Use the documentUrl from the state
                                title="PDF Preview"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  border: 'none',
                                }}
                              />
                            ) : (
                              <span>PDF Preview</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mobvi">
                      <div className=" col-md-5 col-12    mb-2">
                        <div className="exp-form-floating">
                          <div className="pdf-frame"
                            style={{
                              width: "200px",
                              height: "200px",
                              border: "2px solid #ccc",
                              padding: "10px",
                              textAlign: "center",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              marginRight: "150px",
                            }}
                            onClick={() => handlePdfClick(member.documentUrl)}
                          >
                            {member.documentUrl ? (
                              <iframe
                                src={member.documentUrl}
                                title="PDF Preview"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  border: 'none',
                                }}
                              />
                            ) : (
                              <span>PDF Preview</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div>
            <PdfPreview open={isModalOpen} pdfUrl={currentPdfUrl} handleClose={handleCloseModal} />
            <AcademicDetails open={open} handleClose={handleClose} academicDetails={academicDetails} />

          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;
