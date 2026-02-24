import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import LoadingScreen from './Loading';  
import { toast } from 'react-toastify';
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const config = require('./Apiconfig');

function IntermediaryHdrInput({ open, handleClose }) {
  const [Code, setCode] = useState("");
  const [Details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [deletePermission, setDeletePermission] = useState("");

  /*const [created_by, setCreated_by] = useState("");
  const [created_date, setCreated_date] = useState("");
  const [modfied_by, setModified_by] = useState("");
  const [modfied_date, setModified_date] = useState("");*/
  const [loading, setLoading] = useState(false);    
  const [statusdrop, setStatusdrop] = useState([]);
  const [delPerdrop, setDelperdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDelete, setSelectedDelete] = useState('');
  const navigate = useNavigate();
  const code = useRef(null);
  const Name = useRef(null);
  const Status = useRef(null);
  const Permission = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);


  console.log(selectedRows);
  
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

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/delPer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setDelperdrop(val));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionDelete = delPerdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
      
  };


  const handleChangeDelete = (selectedDelete) => {
    setSelectedDelete(selectedDelete);
    setDeletePermission(selectedDelete ? selectedDelete.value : '');

  };


  const handleInsert = async () => {
    if (
      !Code ||
      !Details ||
      !status ||
      !deletePermission
    ) {
      setError(" ");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddIntermediaryheaderData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),

          Code,
          Details,
          status,
          deletePermission,
          created_by: sessionStorage.getItem('selectedUserCode')


          /* created_by,
          created_date,
          modfied_by,
          modfied_date,*/
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
        
          toast.success("Data inserted successfully!").then(() => {
            window.location.reload();
          });
        }, 1000);



      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        //setError(errorResponse.error);
      
        toast.error(errorResponse.message)
      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
    
        toast.error("Failed to insert data")
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert

      toast.error("Error inserting data: " + error.message)
    }finally {
      setLoading(false);
    }

  };

  const handleNavigate = () => {
    navigate("/AddIntermedDetails"); // Pass selectedRows as props to the Input component
  };

    const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
      if (hasValueChanged) {
        await handleKeyDownStatus(e);
        setHasValueChanged(false);
      }

      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };

  return (
    <div>
                          {loading && <LoadingScreen />}      
      {open && (
        <fieldset>
          <div className="purbut">
          <div className="purbut modal popupadj popup mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
              <div className="modal-content">
                <div class="row justify-content-center">
                  <div class="col-md-12 text-center" >
                  <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Add intermediary Hdr</h1>
                            <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                          <div class="d-flex justify-content-between">
                            <div className="d-flex justify-content-start">
                            </div>
                          </div>
                        </div>
                  </div>

                  <div class="">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Header Code
                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div><input
                            id="ihcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the intermediary header code"
                            value={Code}
                            maxLength={18}
                            onChange={(e) => setCode(e.target.value)}
                             ref={code}
                            onKeyDown={(e) => handleKeyDown(e, Name, code)}
                          />            {error && !Code && <div className="text-danger">Code should not be blank</div>}


                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Name

                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div><input
                            id="ihdetails"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the intermediary header name"
                            value={Details}
                            maxLength={250}
                            onChange={(e) => setDetails(e.target.value)}
                            ref={Name}
                            onKeyDown={(e) => handleKeyDown(e, Status, Name)}
                          />            {error && !Details && <div className="text-danger">Name should not be blank</div>}


                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Status
                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          {/* <select
                  name="status"
                  id="ahsts"
                  className="exp-input-field form-control"
                  placeholder="Select status"
                  required title="Please select a status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  autoComplete="off"
                >
                  <option value=""></option>
                  {statusdrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>   */}
                   <div title="Select the Status">
                          <Select
                            id="ahsts"
                            value={selectedStatus}
                            onChange={handleChangeStatus}
                            options={filteredOptionStatus}
                            className="exp-input-field"
                            placeholder=""
                            required
                            ref={Status}
                            onKeyDown={(e) => handleKeyDown(e, Permission, Status)}
                          />
                          {error && !status && <div className="text-danger">Status should not be blank</div>}

</div>
                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Delete Permission

                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          {/* <select
                  name="Delete Permission"
                  id="ahdelper"
                  className="exp-input-field form-control"
                  placeholder="Select permission"
                  required title="Please select a delete permission"
                  value={deletePermission}
                  onChange={(e) => setDeletePermission(e.target.value)}
                  autoComplete="off"
                >
                  <option value=""></option>
                  {delPerdrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>   */}
                  <div title="Select the Delete Permission">
                          <Select
                            id="ahdelper"
                            value={selectedDelete}
                            onChange={handleChangeDelete}
                            options={filteredOptionDelete}
                            className="exp-input-field"
                            placeholder=""
                            required
                            ref={Permission}
                             onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleInsert();
                              }
                            }}
                          />
                          {error && !deletePermission && <div className="text-danger">Delete Permission should not be blank</div>}
                        </div></div>
                      </div>
                      <div class="col-md-3 form-group  ">
                <button onClick={handleInsert} class="mt-4" required title="Save">                     <i class="fa-solid fa-floppy-disk"></i>
                </button>
              </div>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="mobileview">
          <div className="modal mt-5 Topnav-screen " tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
              <div className="modal-content">
                <div class="row justify-content-center">
                <div class="col-md-12 text-center">
                          <div class="mb-0 rounded-0 d-flex justify-content-between">
                            <div className="mb-0 d-flex justify-content-start">
                              <h1 className="h1">Add intermediary Hdr</h1>
                            </div>
                            <div className="mb-0 d-flex justify-content-end ">
                              <button onClick={handleClose} className="closebtn2" required title="Close">
                              <i class="fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          </div>
                          <div class="d-flex justify-content-between">
                            <div className="d-flex justify-content-start">
                            </div>
                          </div>
                        </div>

                  <div class="">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Header Code
                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div><input
                            id="ihcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the intermediary header code"
                            value={Code}
                            maxLength={18}
                            onChange={(e) => setCode(e.target.value)}
                          />            {error && !Code && <div className="text-danger">Code should not be blank</div>}


                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Name

                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div><input
                            id="ihdetails"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the intermediary header name"
                            value={Details}
                            maxLength={250}
                            onChange={(e) => setDetails(e.target.value)}
                          />            {error && !Details && <div className="text-danger">Name should not be blank</div>}


                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Status
                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          {/* <select
                  name="status"
                  id="ahsts"
                  className="exp-input-field form-control"
                  placeholder="Select status"
                  required title="Please select a status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  autoComplete="off"
                >
                  <option value=""></option>
                  {statusdrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>   */}
                          <Select
                            id="ahsts"
                            value={selectedStatus}
                            onChange={handleChangeStatus}
                            options={filteredOptionStatus}
                            className="exp-input-field"
                            placeholder=""
                            required
                          />
                          {error && !status && <div className="text-danger">Status should not be blank</div>}


                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="state" class="exp-form-labels">
                                Delete Permission

                              </label>
                            </div>
                            <div>
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          {/* <select
                  name="Delete Permission"
                  id="ahdelper"
                  className="exp-input-field form-control"
                  placeholder="Select permission"
                  required title="Please select a delete permission"
                  value={deletePermission}
                  onChange={(e) => setDeletePermission(e.target.value)}
                  autoComplete="off"
                >
                  <option value=""></option>
                  {delPerdrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>   */}
                          <Select
                            id="ahdelper"
                            value={selectedDelete}
                            onChange={handleChangeDelete}
                            options={filteredOptionDelete}
                            className="exp-input-field"
                            placeholder=""
                            required
                          />
                          {error && !deletePermission && <div className="text-danger">Delete Permission should not be blank</div>}
                        </div>
                      </div>
                      <div class="col-md-3 form-group  d-flex justify-content-end">
                <button onClick={handleInsert} class="mt-4" required title="Save"><i class="fa-solid fa-floppy-disk"></i>
                </button>
              </div>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div></div>
        </fieldset>
      )}
    </div>
  );
}
export default IntermediaryHdrInput;