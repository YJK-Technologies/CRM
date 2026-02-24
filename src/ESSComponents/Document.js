import React, { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import TabButtons from "./Tabs";
import PdfPreview from './PdfPreviewHelp';
import Select from 'react-select';
import EmployeeInfoPopup from "./EmployeeinfoPopup.js";
import DocumentPopup from "./DocumentPopup.js";
import { showConfirmationToast } from '../ToastConfirmation';
const config = require('../Apiconfig');

function Input({ }) {
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([{ relation: 'documents', members: [{ documentName: '', document: null, documentUrl: '' }] }]);
  const [documentNameDrop, setDocumentNameDrop] = useState([]);
  const [documentUrl, setDocumentUrl] = useState({});
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const location = useLocation();
  const [First_Name, setFirst_Name] = useState('');
  const [department_id, setdepartment_id] = useState("");
  const [designation_id, setdesignation_id] = useState("");

  //code added by Pavun purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const documentsPermissions = permissions
    .filter(permission => permission.screen_type === 'Documents')
    .map(permission => permission.permission_type.toLowerCase());

  const handlePdfClick = (url) => {
    setCurrentPdfUrl(url);
    setIsModalOpen(true);  // Show the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPdfUrl(null);
  };

  const NavigatecomDet = () => {
    navigate("/CompanyDetails", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const FinanceDet = () => {
    navigate("/FinanceDet", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const BankAccDet = () => {
    navigate("/BankAccDet", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const IdentDoc = () => {
    navigate("/IdentDoc", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const AcademicDet = () => {
    navigate("/AcademicDet", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Insurance1 = () => {
    navigate("/Family", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const Documents = () => {
    navigate("/Documents", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };

  const EmployeeLoan = () => {
    navigate("/AddEmployeeInfo", { state: { employeeId: employeeId, firstName: First_Name, department_id: department_id, designation_id: designation_id } });
  };


  const [activeTab, setActiveTab] = useState('Documents');
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    if (!employeeId) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    for (const relationGroup of documents) {
      for (const member of relationGroup.members) {
        if (!member.documentName || !member.document) {
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
            EmployeeId: employeeId,
            document_name: member.documentName,
            document_files: fileBase64,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            created_by: sessionStorage.getItem("selectedUserCode"),
          };
        })
      )
    );
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddEmpDoc`, {
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

  // const handleDelete = async () => {
  //   if (
  //     !employeeId) {
  //     setError("Please fill all required fields.");
  //     return;
  //   }

  //   try {
  //     const deatils = {
  //       EmployeeId: employeeId,company_code: sessionStorage.getItem("selectedCompanyCode")
  //     }

  //     const response = await fetch(`${config.apiBaseUrl}/delemployeedoc`, {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(deatils),
  //     });

  //     if (response.status === 200) {
  //       console.log("Data deleted successfully");
  //       setTimeout(() => {
  //         toast.success("Data deleted successfully!", {
  //           onClose: () => window.location.reload(),
  //         });
  //       }, 1000);
  //     } else {
  //       const errorResponse = await response.json();
  //       console.error(errorResponse.message);
  //       toast.warning(errorResponse.message, {
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Error delete data:", error);
  //     toast.error('Error delete data: ' + error.message, {
  //     });
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(employeeId)
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

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getempdoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id: code, company_code: sessionStorage.getItem("selectedCompanyCode"), })
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ employee_id, department_id, designation_id, First_Name }] = searchData;
        setdepartment_id(department_id);
        setdesignation_id(designation_id);
        setFirst_Name(First_Name);
        setSaveButtonVisible(false);
        setIsAcademicDataLoaded(true);

        const updatedDocument = searchData.reduce((acc, item) => {
          const { document_name, document_files, keyfield } = item;

          console.log(document_files)
          let documentUrl = null;
          let documentFile = null;

          if (document_files) {
            const { blobUrl, file } = convertBufferToBlobUrlAndFile(document_files);
            if (blobUrl) {
              documentUrl = blobUrl;
            }

            if (file) {
              documentFile = file;
            }
          }

          console.log(documentUrl)

          const memberData = {
            documentName: document_name || "",
            selectDocumentName: document_name
              ? { value: document_name, label: document_name }
              : null,
            documentUrl: documentUrl,
            document: documentFile,
            keyfield: keyfield
          };

          const existingRelation = acc.find(group => group.relation === document_name);

          if (existingRelation) {
            existingRelation.members.push(memberData);
          } else {
            acc.push({
              relation: document_name,
              members: [memberData]
            });
          }
          return acc;
        }, []);

        setDocuments(updatedDocument);
        setEmployeeId(employee_id);
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setDocuments([
          { 
            relation: 'documents', 
            members: [{ 
              documentName: '', 
              document: null, 
              documentUrl: '' 
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

  const reloadGridData = () => {
    window.location.reload();
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

  const handleChangeDocumentName = (selectDocumentName, relation, index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
            ...doc,
            members: doc.members.map((member, i) =>
              i === index
                ? {
                  ...member,
                  documentName: selectDocumentName
                    ? selectDocumentName.value
                    : "",
                  selectDocumentName: selectDocumentName,
                }
                : member
            ),
          }
          : doc
      )
    );
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDocument`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })

      .then((data) => data.json())
      .then((val) => setDocumentNameDrop(val));
  }, []);

  const filteredOptionDocumentName = Array.isArray(documentNameDrop)
    ? documentNameDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

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


  const handleUpdate = async (relationName, index) => {
    const relationGroup = documents.find(group => group.relation === relationName);
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

    // if (!member.documentName || !member.document||member.keyfield) {
    //   setError(" ");

    //   return;
    // }


    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const editedData = {
      EmployeeId: employeeId,
      document_name: member.documentName,
      document_files: fileBase64,
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode"),
      modified_by: sessionStorage.getItem("selectedCompanyCode")
    };

    showConfirmationToast(
      "Are you sure you want to update the data in the row ?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/updateempDoc`, {
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

    if (!member.keyfield) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    const fileBase64 = member.document ? await convertToBase64(member.document) : null;
    console.log(fileBase64);

    const keyfieldsToDelete = {
      keyfield: member.keyfield,
      company_code: sessionStorage.getItem("selectedCompanyCode")
    };

    showConfirmationToast(
      "Are you sure you want to Delete the data in the row ?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/delempdoc`, {
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

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const EmployeeInfo = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      const [{ EmployeeId }] = data;

      handleRefNo(EmployeeId);
      setEmployeeId(EmployeeId);
    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const handleEmployeeInfo = () => {
    setOpen(true);
  };

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.employeeId) {
  //       setEmployeeId(location.state.employeeId);
  //       handleRefNo(location.state.employeeId);
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

    if (
      employeeId &&
      documentNameDrop?.length > 0 
    ) {
      handleRefNo(employeeId);
    }
  }, [location.state, documentNameDrop]);

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <div class="d-flex justify-content-start">
                <h1 align="left" class="purbut">Documents</h1>
              </div>
              <div className="d-flex justify-content-end purbut me-3">
                {saveButtonVisible && ['add', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
                  <savebutton className="purbut" title="Save" onClick={handleSave}>
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton>
                )}
                {/* {['delete', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
                  <delbutton className="purbut" required title="Delete">
                    <i class="fa-solid fa-trash"></i>
                  </delbutton>
                )} */}
                <reloadbutton className="purbut mt-3 me-3" onClick={reloadGridData} title="Reload">
                  <i className="fa-solid fa-arrow-rotate-right"></i>
                </reloadbutton>
              </div>
            </div>
            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1" >Documents</h1>
                </div>
                <div class="dropdown mt-1 ms-5" >
                  <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {saveButtonVisible && ['add', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
                        <icon class="icon">
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
                <label for="cno" className={`${error && !employeeId ? 'red' : ''}`}>Employee ID<span className="text-danger">*</span></label>
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-end">
                    <input
                      className="exp-input-field form-control"
                      type="text"
                      title="Please Enter the Employee ID"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="position-absolute mt-1 me-2">
                      <span className="icon searchIcon" title="Documents Help" onClick={handleEmployeeInfo}>
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
                            <label htmlFor={`cname-${index}`} className={`${error && !member.documentName ? 'red' : ''}`}>
                              Document Name<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div title="Please Select the Document Name">
                          <Select
                            id={`cname-${index}`}
                            className="exp-input-field"
                            type="text"
                            value={member.selectDocumentName}
                            maxLength={50}
                            onChange={(selectDocumentName) =>
                              handleChangeDocumentName(selectDocumentName, relationGroup.relation, index)
                            }
                            options={filteredOptionDocumentName}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 form-group mb-2">
                      <div className="exp-form-floating">
                        <div className="d-flex justify-content-start">
                          <div>
                            <label htmlFor={`upload-${index}`} className={`${error && !member.document ? 'red' : ''}`}>
                              Upload Document<span className="text-danger">*</span>
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
                    <div className="col-md-2 form-group mb-2 mb-2">
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
                    <div className="col-md-1 mt-4">
                      {isAcademicDataLoaded && (
                        <>
                          {['update', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-success"
                              title="Update"
                              onClick={() => handleUpdate(relationGroup.relation, index)} // Pass the specific row data
                            >
                              <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                          )}
                          {['delete', 'all permission'].some(permission => documentsPermissions.includes(permission)) && (
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
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div>
            <DocumentPopup open={open} handleClose={handleClose} EmployeeInfo={EmployeeInfo} />
            <PdfPreview open={isModalOpen} pdfUrl={currentPdfUrl} handleClose={handleCloseModal} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;