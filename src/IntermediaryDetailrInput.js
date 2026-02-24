import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import IntermediaryHdrInputPopup from "./IntermediaryHeaderInput";
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';
const config = require('./Apiconfig');

function IntermediaryDetailInput({ }) {
  const [open2, setOpen2] = React.useState(false);
  const [Code, setCode] = useState("");
  const [codeDetails, setCodeDetails] = useState("");
  const [intermediary_addr_1, setIntermediary_Addr_1] = useState("");
  const [intermediary_addr_2, setIntermediary_Addr_2] = useState("");
  const [intermediary_addr_3, setIntermediary_Addr_3] = useState("");
  const [intermediary_addr_4, setIntermediary_Addr_4] = useState("");
  const [intermediary_area_code, setIntermediary_Area_Code] = useState("");
  const [intermediary_stat_code, setIntermediary_Stat_Code] = useState("");
  const [intermediary_cnty_code, setIntermediary_Cnty_Code] = useState("");
  const [intermediary_imex_no, setIntermediary_Imex_No] = useState("");
  const [intermediary_office_no, setIntermediary_Office_No] = useState("");
  const [intermediary_resi_no, setIntermediary_Resi_No] = useState("");
  const [intermediary_mobile_no, setIntermediary_Mobile_No] = useState("");
  const [intermediary_fax_no, setIntermediary_Fax_No] = useState("");
  const [intermediary_email_id, setIntermediary_Email_Id] = useState("");
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [intcodedrop, setintCodedrop] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState('');
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setselectedState] = useState('');
  const [selectedCountry, setselectedCountry] = useState('');


  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  console.log(selectedRow);

  
  const clearInputFields = () => {
    setSelectedHeader("");
    setCodeDetails("");
    setIntermediary_Addr_1("");
    setIntermediary_Addr_2("");
    setIntermediary_Addr_3("");
    setIntermediary_Addr_4("");
    setselectedState("");
    setSelectedCity("");
    setselectedCountry("");
    setIntermediary_Imex_No("");
    setIntermediary_Office_No("");
    setIntermediary_Resi_No("");
    setIntermediary_Mobile_No("");
    setIntermediary_Fax_No("");
    setIntermediary_Email_Id("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setselectedState({
        label: selectedRow.intermediary_stat_code,
        value: selectedRow.intermediary_stat_code,
      });
      setSelectedCity({
        label: selectedRow.intermediary_area_code,
        value: selectedRow.intermediary_area_code,
      });
      setselectedCountry({
        label: selectedRow.intermediary_cnty_code,
        value: selectedRow.intermediary_cnty_code,
      });
      setSelectedHeader({
        label: selectedRow.Code,
        value: selectedRow.Code,
      });
      setCodeDetails(selectedRow.codeDetails || "");
      setIntermediary_Addr_1(selectedRow.intermediary_addr_1 || "");
      setIntermediary_Addr_2(selectedRow.intermediary_addr_2 || "");
      setIntermediary_Addr_3(selectedRow.intermediary_addr_3 || "");
      setIntermediary_Addr_4(selectedRow.intermediary_addr_4 || "");
      setIntermediary_Imex_No(selectedRow.intermediary_imex_no || "");
      setIntermediary_Office_No(selectedRow.intermediary_office_no || "");
      setIntermediary_Resi_No(selectedRow.intermediary_resi_no || "");
      setIntermediary_Mobile_No(selectedRow.intermediary_mobile_no || "");
      setIntermediary_Fax_No(selectedRow.intermediary_fax_no || "");
      setIntermediary_Email_Id(selectedRow.intermediary_email_id || "");
      setIntermediary_Stat_Code(selectedRow.intermediary_stat_code || "");
      setIntermediary_Area_Code(selectedRow.intermediary_area_code || "");
     setIntermediary_Cnty_Code(selectedRow.intermediary_cnty_code || "");
       setCode(selectedRow.Code || "");

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


  const Address3 = useRef(null);
  const Address4 = useRef(null);
  const codeD = useRef(null);
  const Address1 = useRef(null);
  const Address2 = useRef(null);
  const code = useRef(null);
  const City = useRef(null);
  const State = useRef(null);
  const Country = useRef(null);
  const IMEx = useRef(null);
  const Office = useRef(null);
  const Residential = useRef(null);
  const Mobile = useRef(null);
  const Fax = useRef(null);
  const Email = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/inthdrcode`)
      .then((data) => data.json())
      .then((val) => setintCodedrop(val));
  }, []);

  const filteredOptionHeader = intcodedrop.map((option) => ({
    value: option.Code,
    label: `${option.Code} - ${option.Details}`,
  }));

  const handleChangeHeader = (selectedHeader) => {
    setSelectedHeader(selectedHeader);
    setCode(selectedHeader ? selectedHeader.value : '');
      
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

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCondrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatedrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionCity = drop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionState = statedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));
  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setIntermediary_Area_Code(selectedCity ? selectedCity.value : '');
      
  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setIntermediary_Stat_Code(selectedState ? selectedState.value : '');
      
  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setIntermediary_Cnty_Code(selectedCountry ? selectedCountry.value : '');
      
  };
  const handleInsert = async () => {
    if (
      !Code ||
      !codeDetails ||
      !intermediary_addr_1 ||
      !intermediary_addr_2 ||
      !intermediary_area_code ||
      !intermediary_stat_code ||
      !intermediary_cnty_code ||
      !intermediary_imex_no ||
      !intermediary_office_no ||
      !intermediary_resi_no ||
      !intermediary_mobile_no ||
      !intermediary_email_id
    ) {
      setError(" ");
      return;
    }
    // Email validation
    if (!validateEmail(intermediary_email_id)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addIntermediaryDetailData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),

          Code,
          codeDetails,
          intermediary_addr_1,
          intermediary_addr_2,
          intermediary_addr_3,
          intermediary_addr_4,
          intermediary_area_code,
          intermediary_stat_code,
          intermediary_cnty_code,
          intermediary_imex_no,
          intermediary_office_no,
          intermediary_resi_no,
          intermediary_mobile_no,
          intermediary_fax_no,
          intermediary_email_id,
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
        toast.warning(errorResponse.message, {
          
        });
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data', {
          
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message, {
       
      });
    }
    finally {
      setLoading(false);
    }
  };

  const handleNavigateToForm = () => {
    navigate("/AddIntermedHeader", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/Intermediary"); // Pass selectedRows as props to the Input component
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

  const handleClickOpen = (params) => {
    setOpen2(true);
    console.log("Opening popup...");
  };
  const handleClose = () => {
    setOpen2(false);
  };


  const handleUpdate = async () => {
    if (
      !selectedHeader ||
      !codeDetails ||
      !intermediary_addr_1 ||
      !intermediary_addr_2 ||
      !selectedCity ||
      !selectedCountry ||
      !selectedState ||
      !intermediary_imex_no ||
      !intermediary_office_no ||
      !intermediary_resi_no ||
      !intermediary_mobile_no ||
      !intermediary_email_id
    ) {
      setError(" ");
      return;
      
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/IntermediaryUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Code:selectedHeader.value,
          codeDetails,
          intermediary_addr_1,
          intermediary_addr_2,
          intermediary_addr_3,
          intermediary_addr_4,
          intermediary_area_code:selectedCity.value,
          intermediary_stat_code:selectedState.value,
          intermediary_cnty_code:selectedCountry.value,
          intermediary_imex_no,
          intermediary_office_no,
          intermediary_resi_no,
          intermediary_mobile_no,
          intermediary_fax_no,
          intermediary_email_id,
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
              <div className="shadow-lg p-0 bg-body-tertiary rounded">
              <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="mobileview fs-4"> {mode === "update"?'Update Intermediary Details ':'Add Intermediary Details'}</h1>
              <h1 align="left" class="purbut"> {mode === "update"?'Update Intermediary Details ':'Add Intermediary Details'}</h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
              <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

              </div>
        <div class="pt-2 mb-4">

          <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
            <div class="row">
            <div className="col-md-3 form-group mb-0 me-0">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                  Code
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> 
                <div className="input-group" title="Select the code">

                <Select
                id="ihcode"
                value={selectedHeader}
                onChange={handleChangeHeader}
                options={filteredOptionHeader}
                className="exp-input-field position-relative"
                placeholder=""
                required
                ref={code}
                readOnly={mode === "update"}
                isDisabled={mode === "update"}
                onKeyDown={(e) => handleKeyDown(e, codeD, code)}
              />
            {mode !== "update" &&(  <button onClick={handleClickOpen} class="inthdrcode position-absolute pb-2  me-5" required title="Add Header"><i class="fa-solid fa-plus"></i></button>)}
</div>
                {error && !Code && <div className="text-danger">Code should not be blank</div>}

                
              </div>
            </div>
         
           
            
            <div className="col-md-3 form-group mb-2  ">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Code Detail
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="idcode"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the intermediary detail code"
                  value={codeDetails}
                  maxLength={250}
                  onChange={(e) => setCodeDetails(e.target.value)}
                  ref={codeD}
                  readOnly={mode === "update"}
                  onKeyDown={(e) => handleKeyDown(e, Address1, codeD)}
                />            {error && !codeDetails && <div className="text-danger">Code Detail should not be blank</div>}

                
              </div>
            </div>
            <div className="col-md-3 form-group  mb-2 ">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Address 1
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="idaddr1"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the address"
                  value={intermediary_addr_1}
                  maxLength={250}
                  onChange={(e) => setIntermediary_Addr_1(e.target.value)}
                  ref={Address1}
                  onKeyDown={(e) => handleKeyDown(e, Address2, Address1)}
                />            {error && !intermediary_addr_1 && <div className="text-danger">Address should not be blank</div>}

                
              </div>
            </div>
          
        
          <div className="col-md-3 form-group mb-2 ">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Address 2
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="idaddr2"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the address"
                  value={intermediary_addr_2}
                  maxLength={250}
                  onChange={(e) => setIntermediary_Addr_2(e.target.value)}
                  ref={Address2}
                  onKeyDown={(e) => handleKeyDown(e, Address3, Address2)}
                />          {error && !intermediary_addr_2 && <div className="text-danger">Address should not be blank</div>}

                
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Address 3
                  
                </label>
                </div>
                <div>
                  
                  </div>
                </div><input
                  id="idaddr3"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the address"
                  value={intermediary_addr_3}
                  maxLength={250}
                  onChange={(e) => setIntermediary_Addr_3(e.target.value)}
                  ref={Address3}
                  onKeyDown={(e) => handleKeyDown(e, Address4, Address3)}
                />
                
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                 <label for="idaddr4" class="exp-form-labels">
                  Address 4
                </label><input
                  id="idaddr4"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the address"
                  value={intermediary_addr_4}
                  maxLength={250}
                  onChange={(e) => setIntermediary_Addr_4(e.target.value)}
                  ref={Address4}
                  onKeyDown={(e) => handleKeyDown(e, City, Address4)}
                />
               
              </div>
            </div>
           
           
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
            
                <div>
                   <label for="state" class="exp-form-labels">
                   City   <div> <span className="text-danger">*</span></div>
                </label></div>
                <div title="Select the City">

              <Select
                id="city"
                value={selectedCity}
                onChange={handleChangeCity}
                options={filteredOptionCity}
                className="exp-input-field"
                placeholder=""
                ref={City}
                onKeyDown={(e) => handleKeyDown(e, State, City)}
              /> {error && !intermediary_area_code && <div className="text-danger">City should not be blank</div>}

               
              </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   State
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                                 <div title="Select the State">
                <Select
                  id="state"
                  value={selectedState}
                  onChange={handleChangeState}
                  options={filteredOptionState}
                  className="exp-input-field"
                  placeholder=""
                  ref={State}
                  onKeyDown={(e) => handleKeyDown(e, Country, State)}
                />{error && !intermediary_stat_code && <div className="text-danger">State should not be blank</div>}

             
              </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Country
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                 <div title="Select the Country">
                <Select
                  id="country"
                  value={selectedCountry}
                  onChange={handleChangeCountry}
                  options={filteredOptionCountry}
                  className="exp-input-field"
                  placeholder=""
                  ref={Country}
                  onKeyDown={(e) => handleKeyDown(e, IMEx, Country)}
                />{error && !intermediary_cnty_code && <div className="text-danger">Country should not be blank</div>}
</div>
                
              </div>
            </div>
          
           
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 IMEX No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="idimexno"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the IMEX Number"
                  value={intermediary_imex_no}
                  maxLength={10}
                  onChange={(e) => setIntermediary_Imex_No(e.target.value)}
                  ref={IMEx}
                  onKeyDown={(e) => handleKeyDown(e, Office, IMEx)}
                />            {error && !intermediary_imex_no && <div className="text-danger">IMEX No should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Office No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="idofficeno"
                  class="exp-input-field form-control"
                  type="Number"
                  placeholder=""
                  required title="Please enter the office contact number"
                  value={intermediary_office_no}
                  maxLength={20}
                  ref={Office}
                  onKeyDown={(e) => handleKeyDown(e, Residential, Office)}
                  onChange={(e) => setIntermediary_Office_No(e.target.value.replace(/\D/g, '').slice(0, 50))}
                />            {error && !intermediary_office_no && <div className="text-danger">Office No should not be blank</div>}

             
              </div>
            </div>
            
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Residential No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="idresno"
                  class="exp-input-field form-control"
                  type="Number"
                  placeholder=""
                  required title="Please enter the residential contact number"
                  value={intermediary_resi_no}
                  maxLength={20}
                  ref={Residential}
                  onKeyDown={(e) => handleKeyDown(e, Mobile, Residential)}
                  onChange={(e) => setIntermediary_Resi_No(e.target.value.replace(/\D/g, '').slice(0, 50))}
                />            {error && !intermediary_resi_no && <div className="text-danger">Resident No should not be blank</div>}

              
              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Mobile No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="idmobno"
                  class="exp-input-field form-control"
                  type="Number"
                  placeholder=""
                  required title="Please enter the mobile number"
                  value={intermediary_mobile_no}
                  maxLength={50}
                  ref={Mobile}
                  onKeyDown={(e) => handleKeyDown(e, Fax, Mobile)}
                  onChange={(e) => setIntermediary_Mobile_No(e.target.value.replace(/\D/g, '').slice(0, 50))}
                />            {error && !intermediary_mobile_no && <div className="text-danger">Mobile No should not be blank</div>}

              
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Fax No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="idfaxno"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the fax number"
                  value={intermediary_fax_no}
                  maxLength={20}
                  ref={Fax}
                  onKeyDown={(e) => handleKeyDown(e, Email, Fax)}
                  onChange={(e) => setIntermediary_Fax_No(e.target.value)}
                />{error && !intermediary_fax_no && <div className="text-danger">Fax No should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Email ID
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="idemailid"
                  class="exp-input-field form-control"
                  type="Email"
                  placeholder=""
                  required title="Please enter the email ID"
                  value={intermediary_email_id}
                  maxLength={250}
                  ref={Email}
                 onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (mode === "create") {
                              handleInsert();
                            } else {
                              handleUpdate();
                            }
                          }
                        }}
                  onChange={(e) => setIntermediary_Email_Id(e.target.value)}
                />{error && !validateEmail(intermediary_email_id) && <div className="text-danger">Please Enter Valid Email Id</div>}

              
        
            </div>
            </div>  
            <div class="col-md-3 form-group  ">
                {mode === "create" ? (
                  <button onClick={handleInsert} className="mt-4" title="Save">
                                        <i class="fa-solid fa-floppy-disk"></i>

                  </button>
                ) : (
                  <button onClick={handleUpdate} className="mt-4" title="Update">
                                        <i class="fa-solid fa-floppy-disk"></i>

                  </button>
                )}
              </div>
            {/* <div className="col-md-3 form-group">
            
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

          </div> 
              <div>
                <IntermediaryHdrInputPopup open={open2} handleClose={handleClose} />
              </div>
            
             
            </div>
          </div>
        </div>
        </div>
    
        </div>
  );
}
export default IntermediaryDetailInput;