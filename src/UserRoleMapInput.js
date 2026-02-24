import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function UserRoleInput({ }) {
  const [user_code, setuser_code] = useState("");
  const [role_id, setrole_id] = useState("");
  const [usercodedrop, setusercodedrop] = useState([]);
  const [roleiddrop, setroleiddrop] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const usercode = useRef(null);
  const roleid = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const created_by = sessionStorage.getItem('selectedUserCode')
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const [isUpdated, setIsUpdated] = useState(false);
  const [keyfield, setKeyfield] = useState('');
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};



  console.log(selectedRow);

  const clearInputFields = () => {
    // UI clear
    setSelectedUser(null);
    setSelectedRole(null);

    // Payload clear (IMPORTANT)
    setuser_code("");
    setrole_id("");

    // Optional
    setHasValueChanged(false);
  };

  const handleUserChange = (option) => {
    setSelectedUser(option);
    setuser_code(option ? option.value : "");
  };

  const handleRoleChange = (option) => {
    setSelectedRole(option);
    setrole_id(option ? option.value : "");
  };


  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setuser_code(selectedRow.user_code || "");
      setrole_id(selectedRow.role_id || "");
      setKeyfield(selectedRow.keyfield || "");
      setSelectedUser({
        label: selectedRow.user_code,
        value: selectedRow.user_code,
      });
      setSelectedRole({
        label: selectedRow.role_id,
        value: selectedRow.role_id,
      });

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((data) => data.json())
      .then((val) => setusercodedrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/roleid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setroleiddrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionUser = usercodedrop.map((option) => ({
    value: option.user_code,
    label: `${option.user_code} - ${option.user_name}`,
  }));

  const filteredOptionRole = roleiddrop.map((option) => ({
    value: option.role_id,
    label: `${option.role_id} - ${option.role_name}`,
  }));

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_code(selectedUser ? selectedUser.value : '');
  };

  const handleChangeRole = (selectedRole) => {
    setSelectedRole(selectedRole);
    setrole_id(selectedRole ? selectedRole.value : '');
  };

  const handleInsert = async () => {
    if (!user_code || !role_id) {
      setError("required");
      toast.warning("User Code and Role ID are required");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addUserRoleMappingData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          user_code,
          role_id,
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
    navigate("/UserRoleMapping"); // Pass selectedRows as props to the Input component
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
   if (!user_code || !role_id) {
  toast.warning("User Code and Role ID are required");
  setError(" ");
    return;
  }
  
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/RoleMappingUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          user_code,
          role_id,
          modified_by,
          keyfield
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
          <div class="row ">
            <div class="" >
              <div >
              </div>
              <div>
                <div>
                  <div className="shadow-lg p-0 bg-body-tertiary rounded">
                    <div className="mb-0 d-flex justify-content-between">
                      <h1 align="left" class="purbut ">{mode === "update" ? 'Update Role Mapping' : 'Add Role Mapping'}</h1>
                      <h1 align="left" class="mobileview fs-4">{mode === "update" ? 'Update Role Mapping' : 'Add Role Mapping'}</h1>
                      <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-2 mb-4">
              <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
                <div class="row">
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label
                            className={`exp-form-labels ${error && !selectedUser ? "text-danger" : ""
                              }`}
                          >
                            User Code <span className="text-danger">*</span>
                          </label>

                        </div>
                      </div>
                      <div title="Select the User Code ">
                        <Select
                          id="usercode"
                          value={selectedUser}
                          onChange={handleChangeUser}
                          options={filteredOptionUser}
                          className="exp-input-field"
                          placeholder=""
                          ref={usercode}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              mode === "create" ? handleInsert() : handleUpdate();
                            }
                          }}
                        />

                        {/* {error && !user_code && <div className="text-danger">User Code should not be blank</div>} */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label
                            className={`exp-form-labels ${error && !selectedRole ? "text-danger" : ""
                              }`}
                          >
                            Role ID <span className="text-danger">*</span>
                          </label>

                        </div>
                      </div>
                      <div title="Select the Role ID ">
                        <Select
                          id="roleid"
                          value={selectedRole}
                          onChange={handleChangeRole}
                          options={filteredOptionRole}
                          className="exp-input-field"
                          placeholder=""
                          ref={roleid}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              mode === "create" ? handleInsert() : handleUpdate();
                            }
                          }}
                        />

                        {/* {error && !role_id && <div className="text-danger">Role Id should not be blank</div>} */}
                      </div>
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
                  <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                    {mode === "create" ? (
                      <button onClick={handleInsert} className="" title="Save">
                        <i class="fa-solid fa-floppy-disk"></i>
                      </button>
                    ) : (
                      <button onClick={handleUpdate} className="" title="Update">
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
    </div>
  );
}
export default UserRoleInput;