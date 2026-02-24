import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';
import { useLocation } from "react-router-dom";
const config = require('./Apiconfig');

function NumberSeriesInput({ }) {
  const [Screen_Type, setScreen_Type] = useState("");
  const [screentypedrop, setscreentypedrop] = useState([]);
  const [Start_Year, setStart_Year] = useState("");
  const [End_Year, setEnd_Year] = useState("");
  const [Start_No, setStart_No] = useState(1);
  const [Running_No, setRunning_No] = useState(0);
  const [End_No, setEnd_No] = useState(10000);
  const [comtext, secomtext] = useState("");
  const [selectedscreentype, setselectedscreentype] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [booleandrop, setBooleandrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setselectedStatus] = useState('');
  const [selectedBoolean, setselectedBoolean] = useState('');
  const [status, setStatus] = useState("");
  const [number_prefix, setNumber_prefix] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const startyear = useRef(null);
  const screentype = useRef(null);
  const endyear = useRef(null);
  const strtno = useRef(null);
  const runno = useRef(null);
  const endno = useRef(null);
  const text = useRef(null);
  const Status = useRef(null);
  const numpre = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false); 

  console.log(selectedRows);
  console.log(selectedRows);
  const modified_by = sessionStorage.getItem("selectedUserCode");
 
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
 

  const clearInputFields = () => {
    setStart_Year("");
    setEnd_Year("");
    setStart_No("");
    setRunning_No("");
    setEnd_No("");
    setScreen_Type("");
    setStatus(null);
    setNumber_prefix(null);
    secomtext("");
   
  }

 useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setStart_Year(selectedRow.Start_Year || "");
      setEnd_Year(selectedRow.End_Year || "");
      setStart_No(selectedRow.Start_No || "");
      setRunning_No(selectedRow.Running_No || "");
      setEnd_No(selectedRow.End_No || "");
      secomtext(selectedRow.comtext || "");
      setScreen_Type(selectedRow.Screen_Type || "");
      setStatus(selectedRow.Status || "");
      setNumber_prefix(selectedRow.number_prefix || "");
      

      setselectedscreentype({
        label: selectedRow.Screen_Type,
        value: selectedRow.Screen_Type,
      });

      setselectedStatus({
        label: selectedRow.Status,
        value: selectedRow.status,
      });
      setStatus(selectedRow.status||'')

      setselectedBoolean({
        label: selectedRow.number_prefix,
        value: selectedRow.number_prefix,
      });
      setNumber_prefix(selectedRow.number_prefix||'')
      
 
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


  const handleUpdate = async () => {
    if (
      
      !Start_Year ||
      !End_Year ||
      !Start_No ||
      !Running_No ||
      !End_No ||
      !comtext 
      
    )  {
        setError(" ");
        toast.warning("Missing Required Fields");
        return;
         }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/NumberSeriesUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Screen_Type:selectedscreentype.value,
          Start_Year:Start_Year,
          End_Year:End_Year,
          Running_No:Running_No,
          Start_No:Start_No,
          End_No:End_No,
          text: comtext,
          number_prefix: number_prefix,
          Status: status,
          modified_by,
        }),
      });
     if (response.ok) {
                        toast.success("Data updated successfully", {
                          onClose: () => clearInputFields()
                        });
      }
       else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } 
      else {
        console.error("Failed to insert data");
        toast.error( "Failed to Update data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };



   useEffect(() => {
     const company_code = sessionStorage.getItem('selectedCompanyCode');
     
     fetch(`${config.apiBaseUrl}/screentype`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ company_code })
     })
       .then((data) => data.json())
       .then((val) => setscreentypedrop(val));
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


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/getboolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setBooleandrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionscreentype = screentypedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionBoolean = booleandrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-based month, so 0 is January, 1 is February, etc.

    let financialYearStartDate, financialYearEndDate;

    if (currentMonth < 3) {  // If current month is less than April (March)
      // Set the previous year's start date and the current year's end date
      financialYearStartDate = `${currentYear - 1}-04-01`;
      financialYearEndDate = `${currentYear}-03-31`;
    } else {
      // Set the current year's start date and the next year's end date
      financialYearStartDate = `${currentYear}-04-01`;
      financialYearEndDate = `${currentYear + 1}-03-31`;
    }

    // Set the calculated dates to the state
    setStart_Year(financialYearStartDate);
    setEnd_Year(financialYearEndDate);

  }, []);


  const handleChangescreentype = (selectedscreentype) => {
    setselectedscreentype(selectedscreentype);
    setScreen_Type(selectedscreentype ? selectedscreentype.value : '');
      
  };

  const handleChangeStatus = (selectedStatus) => {
    setselectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
      
  };

  const handleChangeBoolean = (selectedBoolean) => {
    setselectedBoolean(selectedBoolean);
    setNumber_prefix(selectedBoolean ? selectedBoolean.value : '');
      
  };

  const handleInsert = async () => {
    if (
      !Screen_Type
    ) {
          setError(" ");
          toast.warning("Missing Required Fields");
          return;
        }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addNumberseries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Screen_Type,
          Start_Year,
          End_Year,
          Start_No,
          Running_No,
          End_No,
          comtext,
          number_prefix,
          status,
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
        //setError(errorResponse.error);
        toast.warning(errorResponse.message, {
          
        });
      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        toast.error('Failed to insert data', {
          
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert
      toast.error('Error inserting data: ' + error.message, {
       
      });
    }   finally {
      setLoading(false);
    }
  };
  const handleNavigate = () => {
    navigate("/NumberSeries"); // Pass selectedRows as props to the Input component
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
       <div className="">
    <div class="">
                      {loading && <LoadingScreen />}
        
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
              <div className="shadow-lg p-0 bg-body-tertiary rounded ">
                <div className=" mb-0 d-flex justify-content-between" >
                <h1 align="left" class="purbut" >{mode === "update"?'Update Number Series ':'Add Number Series'} </h1>
                <h1 align="left" class="fs-4 mobileview" >{mode === "update"?'Update Number Series ':'Add Number Series'} </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
              <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
              </div>
        <div class="pt-2 mb-4">
          <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
            <div class="row">
            <div className="col-md-3 form-group">
            
            <div class="exp-form-floating">
            <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Screen Type
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div>
                <div title="Select the Screen Type">
              <Select
                id="status"
                value={selectedscreentype}
                onChange={handleChangescreentype}
                options={filteredOptionscreentype}
                className="exp-input-field "
                placeholder=""
                required title="Please select a screen type"
                ref={screentype}
                readOnly={mode === "update"}
                isDisabled={mode === "update"}
                onKeyDown={(e) => handleKeyDown(e, startyear, screentype)}
              />
              {error && !Screen_Type && <div className="text-danger">Screen Type should not be blank</div>}
            </div>
            </div>
          </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Start Year
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the start year"
                  value={Start_Year}
                  onChange={(e) => setStart_Year
                  (e.target.value)}
                  maxLength={9}
                  // readOnly
                  ref={startyear}
                  onKeyDown={(e) => handleKeyDown(e, endyear, startyear)}
                />{error && !Start_Year && <div className="text-danger">Start Year should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 End Year
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the end year"
                  value={End_Year}
                  onChange={(e) => setEnd_Year
                  (e.target.value)}
                  maxLength={9}
                  // readOnly
                  ref={endyear}
                  onKeyDown={(e) => handleKeyDown(e, strtno, endyear)}
                />{error && !End_Year && <div className="text-danger">End Year should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Start No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the start number"
                  value={Start_No}
                  onChange={(e) => setStart_No
                  (e.target.value)}
                  maxLength={9}
                  ref={strtno}
                  onKeyDown={(e) => handleKeyDown(e, runno, strtno)}
                />{error && !Start_No && <div className="text-danger">Start No should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Running No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the running number"
                  value={Running_No}
                  onChange={(e) => setRunning_No
                  (e.target.value)}
                  maxLength={9}
                  ref={runno}
                  onKeyDown={(e) => handleKeyDown(e, endno, runno)}
                />{error && !Running_No && <div className="text-danger">Running No should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 End No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the end number"
                  value={End_No}
                  onChange={(e) => setEnd_No
                  (e.target.value)}
                  maxLength={9}
                  ref={endno}
                  onKeyDown={(e) => handleKeyDown(e, text, endno)}
                />{error && !End_No && <div className="text-danger">End No should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
            <label for="text">
             Text
            </label>
            <span className="text-danger">*</span>
            <div class="exp-form-floating">
              <input
                className="exp-input-field form-control"
                id='party_code'
                required
                value={comtext}
                onChange={(e) => secomtext
                  (e.target.value)}
                autoComplete="off"
                type="text"
                ref={text}
                onKeyDown={(e) => handleKeyDown(e,Status,text)}
              />
               {error && !comtext  && <div className="text-danger">Text should not be blank</div>}
            </div>
          </div>
          <div className="col-md-3 form-group">
            
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
                                <div title="Select the Status">

              <Select
                 id="status"
                 value={selectedStatus}
                 onChange={handleChangeStatus}
                 options={filteredOptionStatus}
                 className="exp-input-field"
                 placeholder=""
                 ref={Status}
                required title="Please select a status"
                onKeyDown={(e) => handleKeyDown(e,numpre,Status)}
              />
              {error && !selectedStatus  && <div className="text-danger">Status should not be blank</div>}
            </div>
          </div>
          </div>
          <div className="col-md-3 form-group">
            
            <div class="exp-form-floating">
            <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Number Prefix
                  
                </label>
                </div>
                {/* <div>
                  <span className="text-danger">*</span>
                  </div> */}
                </div>
                <div title="Select the Number Prefix">
              <Select
                 id="numpref"
                 value={selectedBoolean}
                 onChange={handleChangeBoolean}
                 options={filteredOptionBoolean}
                 className="exp-input-field"
                 placeholder=""
                 required title="Please select a Number Prefix status"
                 ref={numpre}
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
              {error && !selectedBoolean && <div className="text-danger">Number Prefix Status should not be blank</div>}
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
                 modified_by
                  
                </label>
                </div> 
                </div><input
                id="emailid"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the email ID"
                value={modified_by}
              />  
            </div>
                )}
          </div> */}
            
          <div class="col-md-3 form-group">
                {mode === "create" ? (
                  <button onClick={handleInsert} className="mt-4" title="Save">
                                        <i class="fa-solid fa-floppy-disk"></i>

                  </button>
                ) : (
                  <button onClick={handleUpdate}className="mt-4" title="Update">
                                        <i class="fa-solid fa-floppy-disk"></i>

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
export default NumberSeriesInput;