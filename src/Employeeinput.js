import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer,toast } from 'react-toastify';
import { useLocation } from "react-router-dom";

const config = require('./Apiconfig');

function EmployeeInput({ }) {
  const [open2, setOpen2] = React.useState(false);
  const [employee_no, setemployee_no] = useState("");
  const [employee_name, setemployee_name] = useState("");
  const [fathername, setfathername] = useState("");
  const [doj, setdoj] = useState("");
  const [dob, setdob] = useState("");
  const [mob_no, setmob_no] = useState("");
  const [emg_mob_no, setemg_mob_no] = useState("");
  const [employee_type, setemployee_type] = useState("");
  const [dept_id, setdept_id] = useState("");
  const [desgination, setdesgination] = useState("");
  const [qualification, setqualification] = useState("");
  const [address, setaddress] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const [Typedrop, setTypedrop] = useState([]);
  const [Deptdrop, setDeptdrop] = useState([]);
  const [Desgdrop, setDesgdrop] = useState([]);
  const [drop, setDrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedtype, setSelectedtype] = useState('');
  const [selecteddept, setSelecteddept] = useState('');
  const [selecteddesg, setSelecteddesg] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState("");
  const [product, setProduct] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState([]);

  const [error, setError] = useState("");
  const empno = useRef(null);
  const empname = useRef(null);
  const fatname = useRef(null);
  const dateofjoin = useRef(null);
  const dateofbirth = useRef(null);
  const mobileno = useRef(null);
  const emergencyno = useRef(null);
  const emptype = useRef(null);
  const departmentid = useRef(null);
  const desg = useRef(null);
  const qual = useRef(null);
  const add = useRef(null);
  const City = useRef(null)
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')




  console.log(selectedRows);
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
 



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/getEmptype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTypedrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionType = Typedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeType = (selectedtype) => {
    setSelectedtype(selectedtype);
    setemployee_type(selectedtype ? selectedtype.value : '');
    setError(false);
  };

    


    useEffect(() => {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      
      fetch(`${config.apiBaseUrl}/getDept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code })
      })
        .then((data) => data.json())
        .then((val) => setDeptdrop(val))
        .catch((error) => console.error('Error fetching data:', error));
    }, []);


    const filteredOptionDept = Deptdrop.map((option) => ({
      value: option.Department,
      label: option.Department,
    }));

    const handleChangedept = (selecteddept) => {
      setSelecteddept(selecteddept);
      setdept_id(selecteddept ? selecteddept.value : '');
      fetchProductCodes(selecteddept ? selecteddept.value : '');
      setError(false);
    };

  const handleChangedesgination = (selecteddesg) => {
    setSelecteddesg(selecteddesg);
    setdesgination(selecteddesg ? selecteddesg.value : '');
    setError(false);
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionCity = drop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity ? selectedCity.value : '');
    setError(false);
  };


  const handleInsert = async () => {
    if (!employee_no || !employee_name || !dept_id || !desgination || !mob_no) {
      setError(" ");
      return;
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddEmployeeInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          employee_no,
          employee_name,
          fathername,
          doj,
          dob,
          mob_no,
          emg_mob_no,
          employee_type,
          dept_id,
          desgination,
          qualification,
          address,
          city,
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
     // Show error message using SweetAlert
     toast.error('Error inserting data: ' + error.message, {
       
     });
    }
  };

  const company_code = sessionStorage.getItem('selectedCompanyCode')

  const fetchProductCodes = (selectedValue) => {
    fetch(`${config.apiBaseUrl}/getDesgination`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dept_id: selectedValue, company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((product) => ({
          value: product.Desgination,
          label: product.Desgination,
        }));
        setDynamicOptions(formattedData);
        setdesgination(formattedData ? formattedData.value : '');
      })
      .catch((error) => console.error('Error fetching product codes:', error));
  };

  const handleNavigate = () => {
    navigate("/EmployeeInfo");
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
                <ToastContainer
                position="top-right"
                className="toast-design" // Adjust this value as needed
                theme="colored"
                />
              <div className="shadow-lg p-0 bg-body-tertiary rounded">
                <div className=" mb-0 d-flex justify-content-between">
                <h1 align="left" class="purbut"> {mode === "update"?'Update Employee Details ':'Add Employee Details'} </h1>
                <h1 align="left" class="mobileview fs-4"> {mode === "update"?'Update Employee Details ':'Add Employee Details'} </h1>
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
                 <div><label for="rid" class="exp-form-labels">
                 Employee No
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="eno"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee No"
                  value={employee_no}
                  onChange={(e) => setemployee_no(e.target.value)}
                  maxLength={10}
                  ref={empno}
                  onKeyDown={(e) => handleKeyDown(e, empname, empno)}
                /> {error && !employee_no && <div className="text-danger">Employee No should not be blank</div>}

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Employee Name
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="ename"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee Name"
                  value={employee_name}
                  onChange={(e) => setemployee_name(e.target.value)}
                  maxLength={50}
                  ref={empname}
                  onKeyDown={(e) => handleKeyDown(e, fatname, empname)}
                /> {error && !employee_name && <div className="text-danger">Employee Name should not be blank</div>}

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Father Name
                </label></div>
                 </div><input
                  id="fname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee Name"
                  value={fathername}
                  onChange={(e) => setfathername(e.target.value)}
                  maxLength={50}
                  ref={fatname}
                  onKeyDown={(e) => handleKeyDown(e, dateofjoin, fatname)}
                />

                
              </div>
            </div>

            
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Date of Join
                </label></div>
                 </div><input
                  id="doj"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the Date of joining"
                  value={doj}
                  onChange={(e) => setdoj(e.target.value)}
                  ref={dateofjoin}
                  onKeyDown={(e) => handleKeyDown(e, dateofbirth, dateofjoin)}
                />

                
              </div>
            </div>

 
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Date of Birth
                </label></div>
                 </div><input
                  id="dob"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the Date of joining"
                  value={dob}
                  onChange={(e) => setdob(e.target.value)}
                  ref={dateofbirth}
                  onKeyDown={(e) => handleKeyDown(e, mobileno, dateofbirth)}
                />

                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Mobile No
                </label></div>
                 </div><input
                  id="mno"
                  class="exp-input-field form-control"
                  type="num"
                  placeholder=""
                  required title="Please enter the Mobile No"
                  value={mob_no}
                  onChange={(e) => setmob_no(e.target.value)}
                  maxLength={15}
                  ref={mobileno}
                  onKeyDown={(e) => handleKeyDown(e, emergencyno, mobileno)}
                />

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Emergency Mobile No
                </label></div>
                 </div><input
                  id="emno"
                  class="exp-input-field form-control"
                  type="num"
                  placeholder=""
                  required title="Please enter the Mobile No"
                  value={emg_mob_no}
                  onChange={(e) => setemg_mob_no(e.target.value)}
                  maxLength={15}
                  ref={emergencyno}
                  onKeyDown={(e) => handleKeyDown(e, emptype, emergencyno)}
                />

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">


                 <div class="d-flex justify-content-start">
                 <div>
                  <label for="rid" class="exp-form-labels">
                   Employee Type
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                 <div className="d-flex justify-content-between input-group">
                <Select
                id="emptype"
                value={selectedtype}
                onChange={handleChangeType}
                options={filteredOptionType}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={emptype}
                onKeyDown={(e) => handleKeyDown(e, departmentid, emptype)}
              /> 
              </div>
                
                {error && !employee_type && <div className="text-danger">Employee Tpye  should not be blank</div>}
                
                
              </div>
            </div>
            
           

            <div className="col-md-3 form-group">
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
                onKeyDown={(e) => handleKeyDown(e, desg, departmentid)}
              /> 
              </div>
                
                {error && !dept_id && <div className="text-danger">Department ID  should not be blank</div>}
                
                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">


                 <div class="d-flex justify-content-start">
                 <div>
                  <label for="rid" class="exp-form-labels">
                  Desgination
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                 <div className="d-flex justify-content-between input-group">
                <Select
                id="desg"
                options={dynamicOptions}
                onChange={handleChangedesgination}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={desg}
                onKeyDown={(e) => handleKeyDown(e, qual, desg)}
              /> 
              </div>
                
                {error && !desgination && <div className="text-danger">Desgination should not be blank</div>}
                
                
              </div>
            </div>
           
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Qualification
                </label></div>
                 </div><input
                  id="quallification"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter your Qualification"
                  value={qualification}
                  onChange={(e) => setqualification(e.target.value)}
                  maxLength={20}
                  ref={qual}
                  onKeyDown={(e) => handleKeyDown(e, add, qual)}
                /> 

                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                   Address
                </label></div>
                 </div><input
                  id="add"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter your Address"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  maxLength={250}
                  ref={add}
                  onKeyDown={(e) => handleKeyDown(e, City, add)}
                />
                
              </div>
            </div>
         
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">


                 <div class="d-flex justify-content-start">
                 <div>
                  <label for="rid" class="exp-form-labels">
                  City
                </label></div>
                 </div>
                 <div className="d-flex justify-content-between input-group">
                <Select
                id="city"
                value={selectedCity}
                onChange={handleChangeCity}
                options={filteredOptionCity}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={City}
                onKeyDown={(e) => handleKeyDown(e, City)}
              /> 
              </div> 
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
                
          <div class="col-md-3 form-group ">
                {mode === "create" ? (
                  <button onClick={handleInsert} className="mt-4" title="Save">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </button>
                ) : (
                  <button className="mt-4" title="Update">
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
              <div className="shadow-lg p-0 bg-body-tertiary rounded">
                <div className=" mb-0 d-flex justify-content-between" >
                <h1 align="left" class="h1"> {mode === "update"?'Update Employee Details ':'Add Employee Details '} </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none borde-shape h-70 fs-5" required title="Close">
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
                 <div><label for="rid" class="exp-form-labels">
                 Employee No
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="eno"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee No"
                  value={employee_no}
                  onChange={(e) => setemployee_no(e.target.value)}
                  maxLength={10}
                  ref={empno}
                  onKeyDown={(e) => handleKeyDown(e, empname, empno)}
                /> {error && !employee_no && <div className="text-danger">Employee No should not be blank</div>}

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Employee Name
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="ename"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee Name"
                  value={employee_name}
                  onChange={(e) => setemployee_name(e.target.value)}
                  maxLength={50}
                  ref={empname}
                  onKeyDown={(e) => handleKeyDown(e, fatname, empname)}
                /> {error && !employee_name && <div className="text-danger">Employee Name should not be blank</div>}

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Father Name
                </label></div>
                 </div><input
                  id="fname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Employee Name"
                  value={fathername}
                  onChange={(e) => setfathername(e.target.value)}
                  maxLength={50}
                  ref={fatname}
                  onKeyDown={(e) => handleKeyDown(e, dateofjoin, fatname)}
                />

                
              </div>
            </div>

            
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Date of Join
                </label></div>
                 </div><input
                  id="doj"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the Date of joining"
                  value={doj}
                  onChange={(e) => setdoj(e.target.value)}
                  ref={dateofjoin}
                  onKeyDown={(e) => handleKeyDown(e, dateofbirth, dateofjoin)}
                />

                
              </div>
            </div>

 
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Date of Birth
                </label></div>
                 </div><input
                  id="dob"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the Date of joining"
                  value={dob}
                  onChange={(e) => setdob(e.target.value)}
                  ref={dateofbirth}
                  onKeyDown={(e) => handleKeyDown(e, mobileno, dateofbirth)}
                />

                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Mobile No
                </label></div>
                 </div><input
                  id="mno"
                  class="exp-input-field form-control"
                  type="num"
                  placeholder=""
                  required title="Please enter the Mobile No"
                  value={mob_no}
                  onChange={(e) => setmob_no(e.target.value)}
                  maxLength={15}
                  ref={mobileno}
                  onKeyDown={(e) => handleKeyDown(e, emergencyno, mobileno)}
                />

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                 Emergency Mobile No
                </label></div>
                 </div><input
                  id="emno"
                  class="exp-input-field form-control"
                  type="num"
                  placeholder=""
                  required title="Please enter the Mobile No"
                  value={emg_mob_no}
                  onChange={(e) => setemg_mob_no(e.target.value)}
                  maxLength={15}
                  ref={emergencyno}
                  onKeyDown={(e) => handleKeyDown(e, emptype, emergencyno)}
                />

                
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">


                 <div class="d-flex justify-content-start">
                 <div>
                  <label for="rid" class="exp-form-labels">
                   Employee Type
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                 <div className="d-flex justify-content-between input-group">
                <Select
                id="emptype"
                value={selectedtype}
                onChange={handleChangeType}
                options={filteredOptionType}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={emptype}
                onKeyDown={(e) => handleKeyDown(e, departmentid, emptype)}
              /> 
              </div>
                
                {error && !employee_type && <div className="text-danger">Employee Tpye  should not be blank</div>}
                
                
              </div>
            </div>
            
           

            <div className="col-md-3 form-group">
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
                onKeyDown={(e) => handleKeyDown(e, desg, departmentid)}
              /> 
              </div>
                
                {error && !dept_id && <div className="text-danger">Department ID  should not be blank</div>}
                
                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">


                 <div class="d-flex justify-content-start">
                 <div>
                  <label for="rid" class="exp-form-labels">
                  Desgination
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                 <div className="d-flex justify-content-between input-group">
                <Select
                id="desg"
                options={dynamicOptions}
                onChange={handleChangedesgination}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={desg}
                onKeyDown={(e) => handleKeyDown(e, qual, desg)}
              /> 
              </div>
                
                {error && !desgination && <div className="text-danger">Desgination should not be blank</div>}
                
                
              </div>
            </div>
           
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Qualification
                </label></div>
                 </div><input
                  id="quallification"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter your Qualification"
                  value={qualification}
                  onChange={(e) => setqualification(e.target.value)}
                  maxLength={20}
                  ref={qual}
                  onKeyDown={(e) => handleKeyDown(e, add, qual)}
                /> 

                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                   Address
                </label></div>
                 </div><input
                  id="add"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter your Address"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  maxLength={250}
                  ref={add}
                  onKeyDown={(e) => handleKeyDown(e, City, add)}
                />
                
              </div>
            </div>
         
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">


                 <div class="d-flex justify-content-start">
                 <div>
                  <label for="rid" class="exp-form-labels">
                  City
                </label></div>
                 </div>
                 <div className="d-flex justify-content-between input-group">
                <Select
                id="city"
                value={selectedCity}
                onChange={handleChangeCity}
                options={filteredOptionCity}
                className=" exp-input-field position-relative "
                placeholder=""
                ref={City}
                onKeyDown={(e) => handleKeyDown(e, City)}
              /> 
              </div> 
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
export default EmployeeInput;