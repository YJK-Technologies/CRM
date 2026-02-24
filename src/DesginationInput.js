import React, { useState, useEffect,useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer,toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';


const config = require('./Apiconfig');

function DesginationInput({   }) {
  const [dept_id, setdept_id] = useState("");
  const [desgination_id, setdesgination_id] = useState("");
  const [desgination, setdesgination] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [Deptdrop, setDeptdrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selecteddept, setSelecteddept] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const departmentid = useRef(null);
  const desgid = useRef(null);
  const desg = useRef(null);
  const Status = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false); 
  const [keyfield, setkey_field] = useState(false); 
  const [loading, setLoading] = useState(false);

 console.log(selectedRows);
 const modified_by = sessionStorage.getItem("selectedUserCode");

 const location = useLocation();
 const { mode, selectedRow } = location.state || {};

  

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
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
    setError(false);
  };



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchDept = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getDept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setDeptdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (company_code) {
      fetchDept();
    }
  }, []);

  const filteredOptionDept = Deptdrop.map((option) => ({
    value: option.Department,
    label: option.Department,
  }));

  const handleChangedept = (selecteddept) => {
    setSelecteddept(selecteddept);
    setdept_id(selecteddept ? selecteddept.value : '');
    setError(false);
  };




  const handleInsert = async () => {
    if (!dept_id || !desgination_id ||!desgination ||!status  ) {
      setError(" ");
      return;
  }
  setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/AddDesgination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            company_code: sessionStorage.getItem('selectedCompanyCode'),
            dept_id,
            desgination_id,
            desgination,
            status,
            created_by: sessionStorage.getItem('selectedUserCode')

          /* created_by,
          created_date,
          modfied_by,
          modfied_date,*/
        }),
      });
        if (response.ok) {
                               toast.success("Data inserted Successfully", {
                                 onClose: () => clearInputFields()
                               });
      } else if (response.status === 400) {
          const errorResponse = await response.json();
          console.error(errorResponse.message);
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
  }
  finally {
    setLoading(false);
  }
};

const clearInputFields = () => {
  setdesgination_id("");
  setdesgination("");
  setSelecteddept("");
  setSelectedStatus("");
 
}
 useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setdesgination_id(selectedRow.desgination_id || "");
      setdesgination(selectedRow.desgination || "");
      setkey_field(selectedRow.keyfield || "");

      
      setSelecteddept({
        label: selectedRow.dept_id,
        value: selectedRow.dept_id,
      });
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
    
 
 
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

const handleUpdate = async () => {
  if (
    !selecteddept ||
    !desgination ||
    !desgination_id ||
    !selectedStatus 
    
  ) {
    setError(" ");
    return;
  }
  setLoading(true);

  try {
    const response = await fetch(`${config.apiBaseUrl}/DesgintionUpdate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code:sessionStorage.getItem("selectedCompanyCode"),
        dept_id:selecteddept.value,
        desgination,
        desgination_id,
        keyfield,
        status:selectedStatus.value,
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


const handleNavigate = () => {
  navigate("/DesgiantionInfo"); 
};

const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
  if (e.key === 'Enter') {
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
  if (e.key === 'Enter' && hasValueChanged) {
    setHasValueChanged(false); 
  }
};


  return (
    <div class="container-fluid Topnav-screen ">
       <div className="">
    <div class=""  >
                    {loading && <LoadingScreen />}
       
    <ToastContainer
      position="top-right"
      className="toast-design" // Adjust this value as needed
 theme="colored"
      />
         <div className="shadow-lg p-0 bg-body-tertiary rounded ">
           <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">{mode === "update"?'Update Designation Details ':'Add Designation Details '} </h1>
              <h1 align="left" class="mobileview fs-4">{mode === "update"?'Update Designation Details ':'Add Designation Details '} </h1>

              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
              <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          {error && <div className=" intenal server error">{error}</div>}
        </div>
        
        <div class="pt-2 mb-4">  
        
        <div className="shadow-lg p-1 bg-body-tertiary rounded pt-3 pb-3">
        <div className="row ms-3 me-3">
        <div className="col-md-3  form-group mb-2">
        <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                  <label for="rid" class="exp-form-labels">
                   Department ID
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                                   <div title="Select the Department ID">

                 <div className="d-flex justify-content-between input-group">
                <Select
                id="deptid"
                value={selecteddept}
                onChange={handleChangedept}
                options={filteredOptionDept}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={departmentid}
                onKeyDown={(e) => handleKeyDown(e, desgid, departmentid)}
              /> 
              </div>
                
                {error && !dept_id && <div className="text-danger">Department ID  should not be blank</div>}
                
                 </div>
              </div>
            </div>

            <div className="col-md-3 form-group">
            <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Desgination ID
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="did"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee No"
                  value={desgination_id}
                  onChange={(e) => setdesgination_id(e.target.value)}
                  maxLength={10}
                  ref={desgid}
                  onKeyDown={(e) => handleKeyDown(e, desg, desgid)}
                /> {error && !desgination_id && <div className="text-danger">Desgination ID should not be blank</div>}

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Desgination
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="ename"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee Name"
                  value={desgination}
                  onChange={(e) => setdesgination(e.target.value)}
                  maxLength={50}
                  ref={desg}
                  onKeyDown={(e) => handleKeyDown(e, Status, desg)}
                /> {error && !desgination && <div className="text-danger">Employee Name should not be blank</div>}

                
              </div>
            </div>
           
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Status
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
               
<div title="Select the Status">
                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  className="exp-input-field"
                  placeholder=""
                  required
                  data-tip="Please select a payment type"
                  ref={Status}
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
                {error && !status && <div className="text-danger"> Status  should not be blank</div>}

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
          </div>
             */}
          <div class="col-md-3 form-group ">
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
       {/* <div className="mobileview">
    <div class=""  >
       
    <ToastContainer
      position="top-right"
      className="toast-design" // Adjust this value as needed
 theme="colored"
      />
         <div className="shadow-lg p-0 bg-body-tertiary rounded ">
           <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="h1">{mode === "update"?'Update Designation Details ':'Add Designation Details '} </h1>
              <button onClick={handleNavigate} className="btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
              <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          {error && <div className=" intenal server error">{error}</div>}
        </div>
        
        <div class="pt-2 mb-4">  
        
        <div className="shadow-lg p-1 bg-body-tertiary rounded pt-3 pb-3">
        <div className="row ms-3 me-3">
        <div className="col-md-3  form-group mb-2">
        <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                  <label for="rid" class="exp-form-labels">
                   Department ID
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                 <div className="d-flex justify-content-between input-group">
                <Select
                id="deptid"
                value={selecteddept}
                onChange={handleChangedept}
                options={filteredOptionDept}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={departmentid}
                onKeyDown={(e) => handleKeyDown(e, desgid, departmentid)}
              /> 
              </div>
                
                {error && !dept_id && <div className="text-danger">Department ID  should not be blank</div>}
                
                
              </div>
            </div>

            <div className="col-md-3 form-group">
            <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Desgination ID
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="did"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee No"
                  value={desgination_id}
                  onChange={(e) => setdesgination_id(e.target.value)}
                  maxLength={10}
                  ref={desgid}
                  onKeyDown={(e) => handleKeyDown(e, desg, desgid)}
                /> {error && !desgination_id && <div className="text-danger">Desgination ID should not be blank</div>}

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Desgination
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="ename"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee Name"
                  value={desgination}
                  onChange={(e) => setdesgination(e.target.value)}
                  maxLength={50}
                  ref={desg}
                  onKeyDown={(e) => handleKeyDown(e, Status, desg)}
                /> {error && !desgination && <div className="text-danger">Employee Name should not be blank</div>}

                
              </div>
            </div>
           
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Status
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
               

                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  className="exp-input-field"
                  placeholder=""
                  required
                  data-tip="Please select a payment type"
                  ref={Status}
                  onKeyDown={(e) => handleKeyDown(e, Status,)}
                />
                {error && !status && <div className="text-danger"> Status  should not be blank</div>}



              </div>
              

            </div>
            
            <div className="col-md-3 form-group  mb-2">
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
          </div>
            
          <div class="col-md-3 form-group d-flex justify-content-end">
                {mode === "create" ? (
                  <button onClick={handleInsert} className="mt-4" title="Save">
                    Save
                  </button>
                ) : (
                  <button className="mt-4" title="Update">
                    Update
                  </button>
                )}
              </div>
          </div>
        </div>
        </div>
      </div>
      </div> */}
      </div>
  );
}
export default DesginationInput;