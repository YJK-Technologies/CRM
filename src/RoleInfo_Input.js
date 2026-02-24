import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function Role_input({ }) {
  const [role_id, setRole_id] = useState("");
  const [role_name, setRole_name] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const roleid = useRef(null);
  const rolename = useRef(null);
  const Description = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const created_by = sessionStorage.getItem('selectedUserCode')

  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const modified_by = sessionStorage.getItem("selectedUserCode");
  console.log(selectedRow);

  const clearInputFields = () => {
    setRole_id("");
    setRole_name("");
    setDescription("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setRole_id(selectedRow.role_id || "");
      setRole_name(selectedRow.role_name || "");
      setDescription(selectedRow.description || "");
    }
    else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const handleInsert = async () => {
    if (
      !role_id ||
      !role_name
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addRoleInfoData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),

          role_id,
          role_name,
          description,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
       if (response.ok) {
                        toast.success("Data inserted Successfully", {
                          onClose: () => clearInputFields()
                        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data');
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/Role", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      // Check if the value has changed and handle the search logic
      if (hasValueChanged) {
        await handleKeyDownStatus(e); // Trigger the search function
        setHasValueChanged(false); // Reset the flag after the search
      }

      // Move to the next field if the current field has a valid value
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); // Prevent moving to the next field if the value is empty
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };

  const handleUpdate = async () => {
    if (
      !role_id ||
      !role_name
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/RoleUpdates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          role_id,
          role_name,
          description,
          created_by,
          modified_by,
        }),
      });
    if (response.ok) {
    toast.success("Data updated successfully", {
     onClose: () => clearInputFields()
     });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error("Failed to Update data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class=""  >
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg  bg-body-tertiary rounded ">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">{mode === "update" ? 'Update Role' : 'Add Role'}  </h1>
              <h1 align="left" class="fs-4 mobileview">{mode === "update" ? 'Update Role' : 'Add Role'}  </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="pt-2 mb-4">
            <div className="shadow-lg p-3 mb-2 pb-4 pe-4 ps-5 bg-body-tertiary rounded  ">
              <div class="row col-12">
                <div className="col-md-3 col-12 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels" className={`${error && !role_id ? 'text-danger' : ''}`}>
                          Role ID<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="rid"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="please enter the role ID"
                      value={role_id}
                      onChange={(e) => setRole_id(e.target.value)}
                      maxLength={18}
                      ref={roleid}
                      readOnly={mode === "update"}
                      onKeyDown={(e) => handleKeyDown(e, rolename, roleid)}
                    />
                    {/* {error && !role_id && <div className="text-danger">Role ID should not be blank</div>} */}
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels" className={`${error && !role_name ? 'text-danger' : ''}`}>
                          Role Name<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="rname"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="please enter the role name"
                      value={role_name}
                      onChange={(e) => setRole_name(e.target.value)}
                      maxLength={50}
                      ref={rolename}
                      onKeyDown={(e) => handleKeyDown(e, Description, rolename)}
                    />
                    {/* {error && !role_name && <div className="text-danger">Role Name should not be blank</div>} */}
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels">Description</label>
                      </div>
                    </div>
                    <input
                      id="desc"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="please enter the description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={255}
                      ref={Description}
                      // onKeyDown={(e) => handleKeyDown(e, Description)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (mode === "create") {
                            handleInsert();
                          } else {
                            handleUpdate();
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                {/* <div className="col-md-3 form-group  mb-2">
                  {mode === "create" ? (
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels">
                            Created By
                          </label>
                        </div>
                      </div>
                      <input
                        id="emailid"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the email ID"
                        value={created_by}
                      />
                    </div>
                  ) : (
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels">
                            Modified By
                          </label>
                        </div>
                      </div>
                      <input
                        id="emailid"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the email ID"
                        value={modified_by}
                      />
                    </div>
                  )}
                </div> */}
                <div class="col-md-3 form-group  d-flex justify-content-start">
                  {mode === "create" ? (
                    <button onClick={handleInsert} className="mt-4" title="Save">
                      <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  ) : (
                    <button onClick={handleUpdate} className="mt-4" title="Update">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Role_input;