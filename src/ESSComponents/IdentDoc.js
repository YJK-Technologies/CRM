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
import PdfPreview from './PdfPreviewHelp'
import IdentityDocuments from "./IdentDocPopup.js";
import { showConfirmationToast } from '../ToastConfirmation';
const config = require('../Apiconfig');

function Input({ }) {
  const [EmployeeId, setEmployeeId] = useState("");
  const [documentUrl, setDocumentUrl] = useState({});
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [documents, setDocuments] = useState([{ relation: 'documents', members: [{ documentType: '', documentNo: '', issueDate: '', expiryDate: '', document: null, documentUrl: '' }] }]);
  const [open, setOpen] = React.useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [documentTypeDrop, setDocumentTypeDrop] = useState([]);
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const identityPermissions = permissions
    .filter(permission => permission.screen_type === 'IdentDoc')
    .map(permission => permission.permission_type.toLowerCase());

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDocumentType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })

      .then((data) => data.json())
      .then((val) => setDocumentTypeDrop(val));
  }, []);

  const filteredOptionDocumentType = Array.isArray(documentTypeDrop)
    ? documentTypeDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const handleChangeDocumentType = (selectedDocumentType, relation, index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  documentType: selectedDocumentType
                    ? selectedDocumentType.value
                    : "",
                  selectDocumentType: selectedDocumentType,
                }
                : member
            ),
          }
          : doc
      )
    );
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleDocuments(EmployeeId)
    }
  };

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

  const handleDocuments = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getIdentityDocuments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();
        setSaveButtonVisible(false);
        setIsAcademicDataLoaded(true);
        const [{ EmployeeId, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        const updatedFamilyMembers = searchData.reduce((acc, item) => {
          const { documentType, documentNo, issueDate, expiryDate, document } = item;

          const formattedIssueDate = formatDate(issueDate);
          const formattedExpiryDate = formatDate(expiryDate);

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
            documentType: documentType || "",
            selectDocumentType: documentType
              ? { value: documentType, label: documentType }
              : null,
            documentNo: documentNo || "",
            issueDate: formattedIssueDate || "",
            expiryDate: formattedExpiryDate || "",
            documentUrl: documentUrl,
            document: documentFile
          };

          const existingRelation = acc.find(group => group.relation === documentType);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: documentType,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setDocuments(updatedFamilyMembers);
        setEmployeeId(EmployeeId);
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setDocuments([
          { 
            relation: 'documents', 
            members: [{ 
              documentType: '', 
              documentNo: '', 
              issueDate: '', 
              expiryDate: '', 
              document: null, 
              documentUrl: '' 
            }] 
          }
        ]);
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleSave = async () => {
    if (!EmployeeId) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    for (const relationGroup of documents) {
      for (const member of relationGroup.members) {
        if (!member.documentType || !member.issueDate || !member.expiryDate || !member.document) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
      }
    }

    const employeeData = await Promise.all(
      documents.flatMap((relationGroup) =>
        relationGroup.members.map(async (member) => {
          const fileBase64 = member.document ? await convertToBase64(member.document) : null;
          console.log(fileBase64)
          return {
            EmployeeId: EmployeeId,
            documentType: member.documentType,
            documentNo: member.documentNo,
            issueDate: member.issueDate,
            expiryDate: member.expiryDate,
            document: fileBase64,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            created_by: sessionStorage.getItem("selectedUserCode"),
          };
        })
      )
    );
    try {
      const response = await fetch(`${config.apiBaseUrl}/addEmployeeIdentityDocument`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeData }),
      });
      if (response.ok) {
        toast.success("Data saved successfully");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to save data");
      }
    } catch (error) {
      toast.error(error.message || "Error saving data");
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

  const [activeTab, setActiveTab] = useState('Identity Documents');
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

  // const handleInputChange = (index, field, value) => {
  //   const updatedDocuments = [...documents];
  //   updatedDocuments[index][field] = value;
  //   setDocuments(updatedDocuments);
  // };

  const handleInputChange = (relation, index, field, value) => {
    setDocuments((prev) =>
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

  const handleAddRow = (relation) => {
    setDocuments((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: [...item.members, { documentType: '', documentNo: '', issueDate: '', expiryDate: '' }] }
          : item
      )
    );
  };

  const handleDeleteRow = (relation, index) => {
    setDocuments((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? { ...item, members: item.members.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  // const handleFileChange = (event, index) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     const fileUrl = URL.createObjectURL(file);
  //     setDocumentUrl((prev) => ({
  //       ...prev,
  //       [index]: fileUrl,
  //     }));
  //   } else {
  //     alert("Please upload a valid PDF file.");
  //     event.target.value = "";
  //   }
  // };

  // const handleFileChange = (event, index) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === 'application/pdf') {
  //     const fileUrl = URL.createObjectURL(file);

  //     setDocuments((prevDocuments) => {
  //       const updatedDocuments = [...prevDocuments];
  //       updatedDocuments[0].members[index].document = file;
  //       updatedDocuments[0].members[index].documentUrl = fileUrl;
  //       return updatedDocuments;
  //     });

  //     setDocumentUrl((prev) => ({
  //       ...prev,
  //       [index]: fileUrl,
  //     }));
  //   } else {
  //     toast.warning('Please upload a valid PDF file.');
  //     event.target.value = '';
  //   }
  // };

  const handleFileChange = (event, relation, index) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);

      setDocuments((prevDocuments) =>
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

  const handleIdentDet = () => {
    setOpen(true);
  };



  const reloadGridData = () => {
    window.location.reload();
  };

  const handleUpdate = async (relationName, index) => {
    const relationGroup = documents.find(group => group.relation === relationName);
    const member = relationGroup ? relationGroup.members[index] : null;

    if (!member.documentNo) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    if (!member.documentType || !member.documentNo || !member.issueDate || !member.expiryDate) {
      setError(" ");
      return;
    }

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const editedData = {
      EmployeeId: EmployeeId,
      documentType: member.documentType,
      documentNo: member.documentNo,
      issueDate: member.issueDate,
      expiryDate: member.expiryDate,
      document: fileBase64,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    showConfirmationToast(
      "Are you sure you want to update the data in the row ?",
      async () => {

        try {
          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeIdentityDocument`, {
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

  const handleDelete = async (relationName, index) => {
    const relationGroup = documents.find(group => group.relation === relationName);
    const member = relationGroup ? relationGroup.members[index] : null;

    if (!member.documentNo) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    if (!member.documentType || !member.documentNo || !member.issueDate || !member.expiryDate) {
      setError(" ");
      return;
    }

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const documentNoToDelete = {
      documentNo: member.documentNo,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    showConfirmationToast(
      "Are you sure you want to Delete the data in the row ?",
      async () => {

        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeIdentityDocument`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ documentNoToDelete: [documentNoToDelete] }),
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

  const identityDocuments = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      // setShowAsterisk(false);
      setIsAcademicDataLoaded(true);
      const [{ employeeId }] = data;

      // if (employeeIdRef.current) {
      //   employeeIdRef.current.value = employeeId;
      //   setEmployeeId(employeeId);
      // } else {
      //   console.error('EmployeeId input not found');
      // }

      handleDocuments(employeeId);

    } else {
      console.log("Data not fetched...!");
    }
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.employeeId) {
        setEmployeeId(location.state.employeeId);
        handleDocuments(location.state.employeeId);
      }
      if (location.state.firstName) {
        setFirst_Name(location.state.firstName);
      }
      if (location.state.department_id) {
        setdepartment_id(location.state.department_id);
      }
      if (location.state.designation_id) {
        setdesignation_id(location.state.designation_id);
      }
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
                <h1 align="left" class="purbut">Identity Documents</h1>
              </div>
              <div className="d-flex justify-content-end purbut me-3">
                {saveButtonVisible && ['add', 'all permission'].some(permission => identityPermissions.includes(permission)) && (
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
                  <h1 align="left" className="h1" >Identity Documents</h1>
                </div>
                <div class="dropdown mt-1" >
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {saveButtonVisible && ['add', 'all permission'].some(permission => identityPermissions.includes(permission)) && (
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
                <label for="cno" className={`${error && !EmployeeId ? 'red' : ''}`}>Employee ID<span className="text-danger">*</span></label>
                <div class="exp-form-floating ">
                  <div class="d-flex justify-content-end">
                    <input
                      id="cno"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please Enter the Employee ID"
                      value={EmployeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      maxLength={18}
                      onKeyPress={handleKeyPress}
                      autoComplete="off"
                    />
                    <div className="position-absolute mt-1 me-2">
                      <span className="icon searchIcon" title="Identity Documents Help" onClick={handleIdentDet}>
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
          <div className="mb-4">
            {documents.map((relationGroup, relationIndex) => (
              <div key={relationIndex} className="shadow-sm p-1 bg-light rounded-bottom mb-2">
                {relationGroup.members.map((member, index) => (
                  <div key={index} className="row mt-3">
                    <div className="mt-4 col-md-1">
                      <button type="button" onClick={() => handleAddRow(relationGroup.relation)} className="btn btn-primary ms-3" title="Add Row">
                        <i className="fa-solid fa-circle-plus"></i>
                      </button>
                      {relationGroup.members.length > 1 && (
                        <button type="button" onClick={() => handleDeleteRow(relationGroup.relation, index)} className="btn btn-danger" title="Delete Row">
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div className="exp-form-floating">
                        <div className="d-flex justify-content-start">
                          <div>
                            <label htmlFor={`cname-${index}`} className={`${error && !member.documentType ? 'red' : ''}`}>
                              Doc Type<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div title="Please Select the Document Type">
                          <Select
                            id={`cname-${index}`}
                            className="exp-input-field"
                            type="text"
                            value={member.selectDocumentType}
                            maxLength={50}
                            onChange={(selectedDocumentType) =>
                              handleChangeDocumentType(selectedDocumentType, relationGroup.relation, index)
                            }
                            options={filteredOptionDocumentType}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div className="exp-form-floating">
                        <div className="d-flex justify-content-start">
                          <div>
                            <label htmlFor={`add1-${index}`} className={`${error && !member.documentNo ? 'red' : ''}`}>
                              Doc No<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <input
                          id={`sname-${index}`}
                          className="exp-input-field form-control"
                          type="text"
                          title="Please enter the Doc No"
                          value={member.documentNo}
                          maxLength={100}
                          onChange={(e) => handleInputChange(relationGroup.relation, index, 'documentNo', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div className="exp-form-floating">
                        <div className="d-flex justify-content-start">
                          <div>
                            <label htmlFor={`add1-${index}`} className={`${error && !member.issueDate ? 'red' : ''}`}>
                              Issue Date<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <input
                          id={`add1-${index}`}
                          className="exp-input-field form-control"
                          title="Please enter the Issue Date"
                          type="date"
                          value={member.issueDate}
                          onChange={(e) => handleInputChange(relationGroup.relation, index, 'issueDate', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div className="exp-form-floating">
                        <div className="d-flex justify-content-start">
                          <div>
                            <label htmlFor={`add2-${index}`} className={`${error && !member.expiryDate ? 'red' : ''}`}>
                              Expiry Date<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <input
                          id={`add2-${index}`}
                          className="exp-input-field form-control"
                          type="date"
                          value={member.expiryDate}
                          onChange={(e) => handleInputChange(relationGroup.relation, index, 'expiryDate', e.target.value)}
                          required
                          title="Please enter the Expiry Date"
                        />
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div className="exp-form-floating">
                        <div className="d-flex justify-content-start">
                          <div>
                            <label htmlFor={`upload-${index}`} className="exp-form-labels">
                              Upload Document
                            </label>
                          </div>
                        </div>
                        <input
                          id={`upload-${index}`}
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
                          {['update', 'all permission'].some(permission => identityPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-success"
                              title="Update"
                              onClick={() => handleUpdate(relationGroup.relation, index)} // Pass the specific row data
                            >
                              <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                          )}
                          {['delete', 'all permission'].some(permission => identityPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              title="Delete"
                              onClick={() => handleDelete(relationGroup.relation, index)}
                            >
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
            <IdentityDocuments open={open} handleClose={handleClose} identityDocuments={identityDocuments} />

          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;
