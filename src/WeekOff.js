import React, { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "./apps.css";
import Select from "react-select";
import { showConfirmationToast } from './ToastConfirmation';
const config = require("./Apiconfig");

function WeekOff() {
  const [statusdrop, setStatusdrop] = useState([]);
  const [relativedrop, setrelationdrop] = useState([]);
  const [empiddrop, setempiddrop] = useState([]);
  const [generateid, setgenerateid] = useState("");
  const [selectedgenerate, setselectedgenerateid] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [error, setError] = useState("");
  const [isAcademicDataLoaded, setIsAcademicDataLoaded] = useState(true);
  const [weekOffData, setWeekOffData] = useState([
    {
      relation: "weekOffData",
      members: [{ relationName: "", statusName: "" , keyfield:""}],
    },
  ]);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);

  const location = useLocation();
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const familyPermissions = permissions
    .filter((permission) => permission.screen_type === "Family")
    .map((permission) => permission.permission_type.toLowerCase());
  

  const addRow = (relation) => {
    setWeekOffData((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: [...item.members, { relationName: "", statusName: "" }],
            }
          : item
      )
    );
  };

  const deleteRow = (relation, index) => {
    setWeekOffData((prev) =>
      prev.map((item) =>
        item.relation === relation
          ? {
              ...item,
              members: item.members.filter((_, i) => i !== index),
            }
          : item
      )
    );
  };

  const handleChangeRelation = (selectedRelation, relation, index) => {
    setWeekOffData((prevDocuments) =>
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

  const handleChangeStatus = (selectedStatus, relation, index) => {
    setWeekOffData((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.relation === relation
          ? {
              ...doc,
              members: doc.members.map((member, i) =>
                i === index
                  ? {
                      ...member,
                      statusName: selectedStatus ? selectedStatus.value : "",
                      selectedStatus: selectedStatus,
                    }
                  : member
              ),
            }
          : doc
      )
    );
  };



  const handleEmployeeUpdate = async () => {
    if (!selectedgenerate) {
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const employeePayload = {
        employee_id: generateid,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        modified_by: sessionStorage.getItem("selectedUserCode"),

      };

      const employeeResponse = await fetch(
        `${config.apiBaseUrl}/SettingEmployeeUpdate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeePayload),
        }
      );

      if (!employeeResponse.ok) {
        const errorText = await employeeResponse.text();
        try {
          const errorResponse = JSON.parse(errorText);
          toast.warning(errorResponse.message || "Failed to save employee");
        } catch {
          toast.warning("Failed to save employee: " + errorText);
        }
        return;
      }
      if (employeeResponse.ok) {
        toast.success("Employee Data Updated successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorText = await employeeResponse.text();
        try {
          const errorResponse = JSON.parse(errorText);
          toast.warning(errorResponse.message || "Failed to save Data");
        } catch {
          toast.warning("Failed to save Week Off Day: " + errorText);
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Unexpected error: " + error.message);
    }
  };


  const handleSave = async () => {
    if (!selectedgenerate || !weekOffData || weekOffData.length === 0) {
      toast.warning("Error: Missing required fields");
      return;
    }

    for (const group of weekOffData) {
      for (const member of group.members) {
        if (!member.selectRelation) {
          toast.warning(
            "Error: Missing Week Off Day for one or more employees"
          );
          return;
        }
      }
    }

    try {
      const employeePayload = {
        employee_id: generateid,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };

      const employeeResponse = await fetch(
        `${config.apiBaseUrl}/AddGenerateEmployee`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeePayload),
        }
      );

      if (!employeeResponse.ok) {
        const errorText = await employeeResponse.text();
        try {
          const errorResponse = JSON.parse(errorText);
          toast.warning(errorResponse.message || "Failed to save employee");
        } catch {
          toast.warning("Failed to save employee: " + errorText);
        }
        return;
      }

      const weekOffArray = weekOffData.flatMap((group) =>
        group.members.map((member) => ({
          week_off_days: member.relationName,
          employee_id: generateid,
          Status: member.statusName,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          Keyfield: member.relationName,
          created_by: sessionStorage.getItem("selectedUserCode"),
        }))
      );

      const weekOffResponse = await fetch(`${config.apiBaseUrl}/AddWeekOff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ WeekOffData: weekOffArray }),
      });

      if (weekOffResponse.ok) {
        toast.success("Employee and Week Off Day saved successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorText = await weekOffResponse.text();
        try {
          const errorResponse = JSON.parse(errorText);
          toast.warning(errorResponse.message || "Failed to save Week Off Day");
        } catch {
          toast.warning("Failed to save Week Off Day: " + errorText);
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Unexpected error: " + error.message);
    }
  };

   const handleDelete = async (selectRelation,index) => {
    const group = weekOffData.find(group => group.relation === selectRelation);
    const member = group ? group.members[index] : null;

    if (!member.keyfield) {
      setDeleteError(" ");
      toast.warning("Error: Missing required keyfield")
      return;
    }

    if (!member) {
      setError(" ");
      return;
    }

    if (!member.selectRelation ) {
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
          const response = await fetch(`${config.apiBaseUrl}/deleteWeekOff`, {
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
    const handleUpdate = async (selectRelation,index) => {
      const group = weekOffData.find(group => group.relation === selectRelation);
      const member = group ? group.members[index] : null;
  
      if (!member.keyfield) {
        setDeleteError(" ");
        toast.warning("Error: Missing required fields")
        return;
      }
  
      if (!member) {
        setError(" ");
        return;
      }
  
      const editedData = {
          week_off_days: member.relationName,
          Status: member.statusName,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          keyfield: member.keyfield
      };
  
      showConfirmationToast(
        "Are you sure you want to update the data in the row ?",
        async () => {
          try {
            const response = await fetch(`${config.apiBaseUrl}/updateWeekOff`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ editedData: [editedData] }),
            });
  
            if (response.ok) {
              setTimeout(() => {
                toast.success("Data updated successfully!", {
                  onClose: () => window.location.reload()
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
  
  const Handleemp = (selectedEmp) => {
    setselectedgenerateid(selectedEmp);
    setgenerateid(selectedEmp ? selectedEmp.value : "");
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error("Error fetching status data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/WeekOff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setrelationdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/GenerateEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setempiddrop(val));
  }, []);

useEffect(() => {
    fetch(`${config.apiBaseUrl}/FetchWeekOff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data || data.length === 0) return;
        const updatedFamilyMembers = [{
          relation: "WeekOffDays",
          members: data.map((item) => {
            const { week_off_days, Status,keyfield } = item;
            return {
              relationName: week_off_days || "",
              keyfield:keyfield,
              selectRelation: week_off_days
                ? { value: week_off_days, label: week_off_days }
                : null,
              statusName: Status || "",
              selectedStatus: Status
                ? { value: Status, label: Status }
                : null
            };
          })
        }];
        setWeekOffData(updatedFamilyMembers);
      });
    fetch(`${config.apiBaseUrl}/FetchGenerateEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data || data.length === 0) return;
        const { employee_id } = data[0];
        const setDefault = (type, setType, options, setSelected) => {
          if (type) {
            setType(type);
            setSelected(options.find((opt) => opt.value === type) || null);
          }
        };
        setDefault(employee_id, setgenerateid, filteredOptionemployee, setselectedgenerateid);
      });
  }, [empiddrop, statusdrop]);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const weekdayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const filteredOptionrelation = relativedrop
    .map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    .sort(
      (a, b) => weekdayOrder.indexOf(a.label) - weekdayOrder.indexOf(b.label)
    );

  const filteredOptionemployee = empiddrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-0 bg-light rounded mb-2">
        <div className="purbut mb-0 d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="purbut">ESS Setting Screen</h1>
          </div>
          <div className="d-flex justify-content-end purbut me-3">
            {saveButtonVisible &&
              ["add", "all permission"].some((p) =>
                familyPermissions.includes(p)
              ) && (
                <savebutton className="purbut" onClick={handleSave} title="Save">
                  <i className="fa-regular fa-floppy-disk"></i>
                </savebutton>
              )}
            <reloadbutton
              className="purbut mt-3 me-3"
              onClick={reloadGridData}
              title="Reload"
            >
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </reloadbutton>
          </div>
        </div>
         </div>
        <div className="shadow-lg p-3 bg-light rounded mb-1">
          <div className="row">
           
         
         
          <div className="col-md-2">
          <div className="form-group mb-2 ms-2 ">
             <label className="me-2 " >
             Employee ID<span className="text-danger">*</span>
          </label>
            <Select
              className="exp-input-field "
              value={selectedgenerate}
              options={filteredOptionemployee}
              onChange={Handleemp}
            />
          </div>  
          </div>
           <div className="col-md-1 mt-4">
                        <>
                          {['update', 'all permission'].some(permission => familyPermissions.includes(permission)) && (
                            <button
                              type="button"
                              className="btn btn-success"
                              title="Update"
                              onClick={handleEmployeeUpdate} 
                            >
                              <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                          )}
                        </>
                   
                    </div> </div>
        </div>
        <div className=" shadow-lg p-0 bg-light rounded mb-1 ">
          {weekOffData.map((relationGroup, relationIndex) => (
            <div
              key={relationIndex}
            
            >
              {relationGroup.members.map((member, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center mt-3 ms-3"
                >
                  <div>
                    {relationGroup.members.length < 3 && (
                      <button
                        className="btn btn-primary me-1"
                        onClick={() => addRow(relationGroup.relation)}
                      >
                        <i className="fa-solid fa-circle-plus"></i>
                      </button>
                    )}
                    {relationGroup.members.length > 1 && (
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteRow(relationGroup.relation, index)}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    )}
                  </div>
                  <div className="d-flex gap-2 ms-3">
                    <div className="mt-2">
                    <label>
                      Week Off Day {index + 1}
                      <span className="text-danger">*</span>
                    </label>
                    </div>
                    <div style={{width:"148px"}}>
                    <Select
                      className="exp-input-field"
                      value={member.selectRelation}
                      options={filteredOptionrelation}
                      onChange={(selectedRelation) =>
                        handleChangeRelation(
                          selectedRelation,
                          relationGroup.relation,
                          index
                        )
                      }
                    />
                    </div>
                     
                  </div>
                  <div className="d-flex gap-2 ms-3">
                    <div className="mt-2">
                    <label>Status</label>
                    </div>
                    <div style={{width:"148px"}}>
                    <Select
                      className="exp-input-field"
                      value={member.selectedStatus}
                      options={filteredOptionStatus}
                      onChange={(selectedStatus) =>
                        handleChangeStatus(
                          selectedStatus,
                          relationGroup.relation,
                          index
                        )
                      }
                    />
                    </div>
                  </div>
                   <div className="col-md-1 mt-4 mb-4">
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
                    
                    </div>
                </div>
              ))}
            </div>
          ))}
        </div>
     
    </div>
  );
}

export default WeekOff;
