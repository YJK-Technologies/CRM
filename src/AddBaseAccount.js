import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import './apps.css'
import Select from 'react-select';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function AddBaseAcc({ }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setselectedStatus] = useState('');
  const [base_accgroup_code, setbase_accgroup_code] = useState('');
  const [base_accgroup_name, setbase_accgroup_name] = useState('');
  const navigate = useNavigate();
  const Status = useRef(null);
  const AccountName = useRef(null);
  const Account = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode');
  const [loading, setLoading] = useState(false);

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

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setselectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
  };

  const handleInsert = async () => {
    if (
      !base_accgroup_code ||
      !base_accgroup_name ||
      !status
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addBaseaccountData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          created_by: sessionStorage.getItem('selectedUserCode'),
          base_accgroup_code,
          base_accgroup_name,
          status,
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
        toast.error(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error("Failed to insert data")
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message)
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate(-1);
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
        <div class="" >
          <div className="shadow-lg p-0 bg-body-tertiary rounded">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="fs-4"> Add Base Account</h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="pt-2 mb-4">
            <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2 ">
              <div class="row">
                <div className="col-md-3 form-group ">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="cno" class="exp-form-labels" className={`${error && !base_accgroup_code ? 'text-danger' : ''}`}>
                          Account Code<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="cno"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the account code"
                      value={base_accgroup_code}
                      onChange={(e) => setbase_accgroup_code(e.target.value)}
                      maxLength={18}
                      ref={Account}
                      onKeyDown={(e) => handleKeyDown(e, AccountName, Account)}
                    />
                    {/* {error && !base_accgroup_code && <div className="text-danger">Account  Code should not be blank</div>} */}
                    {/* {error && <div className="text-danger">{error}</div>} */}
                  </div>
                </div>
                <div className="col-md-3 form-group ">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="cname" class="exp-form-labels" className={`${error && !base_accgroup_name ? 'text-danger' : ''}`}>
                          Account Name<span className="text-danger">*</span>
                        </label>
                      </div>
                      <div></div>
                    </div>
                    <input
                      id="cname"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the account name"
                      value={base_accgroup_name}
                      onChange={(e) => setbase_accgroup_name(e.target.value)}
                      maxLength={250}
                      ref={AccountName}
                      onKeyDown={(e) => handleKeyDown(e, Status, AccountName)}
                    />
                    {/* {error && !base_accgroup_name && <div className="text-danger">Account  Name should not be blank</div>} */}
                  </div>
                </div>
                <div className="col-md-3 form-group ">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="state" class="exp-form-labels" className={`${error && !status ? 'text-danger' : ''}`}>
                          Status<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                <div title="Select the Status">        
                    <Select
                      id="status"
                      value={selectedStatus}
                      onChange={handleChangeStatus}
                      options={filteredOptionStatus}
                      className=""
                      placeholder=""
                      ref={Status}
                      onKeyDown={(e) => handleKeyDown}
                    />
                    {/* {error && !status && <div className="text-danger">Status should not be blank</div>} */}
                  </div>
                  </div>
                </div>
                {/* <div className="col-md-3 form-group ">
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
                <div className="purbut">
                  <div class="mt-3">
                    <button onClick={handleInsert} required title="Save"><i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  </div>
                </div>
                <div className="mobileview">
                  <div class="mt-3">
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
export default AddBaseAcc;
