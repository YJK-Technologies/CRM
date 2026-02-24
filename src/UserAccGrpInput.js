import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import Select from 'react-select'
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function UserAccInput({ }) {
  const navigate = useNavigate();
  const [user_accgroup_code, setuser_accgroup_code] = useState("");
  const [user_accgroup_name, setuser_accgroup_name] = useState("");
  const [standard_accgroup_code, setstandard_accgroup_code] = useState("");
  const [base_accgroup_code, setbase_accgroup_code] = useState("");
  const [status, setstatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [BaseAccDrop, setBaseAccDrop] = useState([]);
  const [StdAccGrpdrop, setStdAccGrpdrop] = useState([]);
  const [selectedUserAcc, setSelectedUserAcc] = useState('');
  const [selectedBaseAcc, setSelectedBaseAcc] = useState('');
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const code = useRef(null)
  const Name = useRef(null)
  const Standard = useRef(null)
  const Status = useRef(null)
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [error, setError] = useState("");

  console.log(selectedRows);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getStdAccGrp`)
      .then((data) => data.json())
      .then((val) => setStdAccGrpdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getBaseAccGrp`)
      .then((data) => data.json())
      .then((val) => setBaseAccDrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionStdAccGrp = StdAccGrpdrop.map((option) => ({
    value: option.standard_accgroup_code,
    label: option.standard_accgroup_code,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeStdAccGrp = (selectedUserAcc) => {
    setSelectedUserAcc(selectedUserAcc);
    setstandard_accgroup_code(selectedUserAcc ? selectedUserAcc.value : '');
  };

  const handleNavigateToForm = () => {
    navigate("/AddStandardAccount", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleNavigate = () => {
    navigate("/UserAccountGroup", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleInsert = async () => {
    if (
      !user_accgroup_code ||
      !user_accgroup_name ||
      !standard_accgroup_code ||
      !status
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addUserAccGrp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //company_code: sessionStorage.getItem('selectedCompanyCode'),
          user_accgroup_code,
          user_accgroup_name,
          standard_accgroup_code,
          status,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
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

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="">
        <div class="">
          <div className="shadow-lg p-0 bg-body-tertiary rounded  mb-2">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="">Add User Account </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="">
            <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2">
              <div className="row ">
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels">
                          Code<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="venad1"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the code"
                      value={user_accgroup_code}
                      onChange={(e) => setuser_accgroup_code(e.target.value)}
                      maxLength={3}
                      ref={code}
                      onKeyDown={(e) => handleKeyDown(e, Name, code)}
                    />
                    {error && !user_accgroup_code && <div className="text-danger">Code should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels">
                          Name<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="venad1"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the name"
                      value={user_accgroup_name}
                      onChange={(e) => setuser_accgroup_name(e.target.value)}
                      maxLength={40}
                      ref={Name}
                      onKeyDown={(e) => handleKeyDown(e, Standard, Name)}
                    />
                    {error && !user_accgroup_name && <div className="text-danger">Name should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels">
                          Standard Account Code<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <div title="Select the Standard Account Code">        
                    <div className="input-group">
                      <Select
                        id="city"
                        value={selectedUserAcc}
                        onChange={handleChangeStdAccGrp}
                        options={filteredOptionStdAccGrp}
                        className="exp-input-field position-relative"
                        placeholder=""
                        ref={Standard}
                        onKeyDown={(e) => handleKeyDown(e, Status, Standard)}
                      />
                      <button onClick={handleNavigateToForm} class="userhdrcode position-absolute me-5 pb-2" required title="Add Standard Code"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    </div>
                    {error && !standard_accgroup_code && <div className="text-danger">Standard Code should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels">
                          Status<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    {/* <select
                name="state"
                id="state"
                className="exp-input-field form-control"
                placeholder="Select state"
                required title="Please select a state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                autoComplete="off"
              >
                <option value=""></option>
                {statedrop.map((option, index) => (
                  <option key={index} value={option.attributedetails_name}>
                    {option.attributedetails_name}
                  </option>
                ))}
              </select> */}
                    <Select
                      id="state"
                      value={selectedStatus}
                      onChange={handleChangeStatus}
                      options={filteredOptionStatus}
                      className="exp-input-field"
                      placeholder=""
                      ref={Status}
                      onKeyDown={(e) => handleKeyDown}
                    />
                    {error && !status && <div className="text-danger">Status should not be blank</div>}
                  </div>
                </div>
                {/* <div className="col-md-3 form-group  mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="state" class="exp-form-labels">
                          Created By
                        </label>
                      </div>
                    </div><input
                      id="emailid"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the email ID"
                      value={created_by}
                    />
                  </div>
                </div> */}
                <div className="col-md-3 form-group">
                  <div class="mt-4">
                    <button onClick={handleInsert} required title="Save"><i class="fa-solid fa-floppy-disk"></i>
                    </button>
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
export default UserAccInput;