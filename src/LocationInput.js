import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';

const config = require("./Apiconfig");

function LocInfoInput({ }) {
  const [location_no, setlocation_no] = useState("");
  const [location_name, setlocation_name] = useState("");
  const [short_name, setshort_name] = useState("");
  const [address1, setaddress1] = useState("");
  const [address2, setaddress2] = useState("");
  const [address3, setaddress3] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [pincode, setpincode] = useState("");
  const [country, setcountry] = useState("");
  const [email_id, setemail_id] = useState("");
  const [status, setstatus] = useState("");
  const [contact_no, setcontact_no] = useState("");
  const [createdby, setcreatedby] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setselectedState] = useState("");
  const [selectedCountry, setselectedCountry] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");

  const [statusdrop, setstatusdrop] = useState([]);
  const [drop, setdrop] = useState([]);
  const [condrop, setcondrop] = useState([]);
  const [statedrop, setstatedrop] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const locationno = useRef(null);
  const locationname = useRef(null);
  const shortname = useRef(null);
  const address = useRef(null);
  const AddresS2 = useRef(null);
  const Address3 = useRef(null);
  const City = useRef(null);
  const State = useRef(null);
  const Pincode = useRef(null);
  const Country = useRef(null);
  const email = useRef(null);
  const Status = useRef(null);
  const Contactno = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setlocation_no("");
    setlocation_name("");
    setshort_name("");
    setaddress1("");
    setaddress2("");
    setaddress3("");
    setSelectedCity(null);
    setselectedState(null);
    setselectedCountry(null);
    setselectedStatus(null);
    setpincode("");
    setemail_id("");
    setcontact_no("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setlocation_no(selectedRow.location_no || "");
      setlocation_name(selectedRow.location_name || "");
      setshort_name(selectedRow.short_name || "");
      setaddress1(selectedRow.address1 || "");
      setaddress2(selectedRow.address2 || "");
      setaddress3(selectedRow.address3 || "");
      setcity(selectedRow.city || "");
      setstate(selectedRow.state || "");
      setcountry(selectedRow.country || "");
      setstatus(selectedRow.status || "");;

 
      setSelectedCity({
        label: selectedRow.city,
        value: selectedRow.city,
      });
      setselectedState({
        label: selectedRow.state,
        value: selectedRow.state,
      });
      setselectedCountry({
        label: selectedRow.country,
        value: selectedRow.country,
      });
      setselectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
      setpincode(selectedRow.pincode || "");
      setemail_id(selectedRow.email_id || "");
      setcontact_no(selectedRow.contact_no || "");
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const created_by = sessionStorage.getItem("selectedUserCode");
  const modified_by = sessionStorage.getItem("selectedUserCode");


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
      .then((val) => setdrop(val))
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
      .then((val) => setcondrop(val))
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
      .then((val) => setstatedrop(val))
      .catch((error) => console.error('Error fetching data:', error));
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
      .then((val) => setstatusdrop(val))
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

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setcity(selectedCity ? selectedCity.value : "");
  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setstate(selectedState ? selectedState.value : "");
  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setcountry(selectedCountry ? selectedCountry.value : "");
  };

  const handleChangeStatus = (selectedStatus) => {
    setselectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleInsert = async () => {
    if (
      !location_no ||
      !location_name ||
      !address1 ||
      !address2 ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !email_id ||
      !status ||
      !contact_no
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    // Email validation
    if (!validateEmail(email_id)) {
      toast.warning("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addlocationinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_no,
          location_name,
          short_name,
          address1,
          address2,
          address3,
          city,
          state,
          pincode,
          country,
          email_id,
          status,
          contact_no,
          created_by: sessionStorage.getItem("selectedUserCode"),
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

  const handleUpdate = async () => {
    if (
      !location_no ||
      !location_name ||
      !address1 ||
      !address2 ||
      !selectedCity ||
      !selectedState ||
      !pincode ||
      !selectedCountry ||
      !email_id ||
      !selectedStatus ||
      !contact_no
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(email_id)) {
      toast.warning("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/LocationUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_no,
          location_name,
          short_name,
          address1,
          address2,
          address3,
          city,
          state,
          pincode,
          country,
          email_id,
          status,
          contact_no,
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

  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/Location"); // Pass selectedRows as props to the Input component
  };

  const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
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
    if (e.key === "Enter" && hasValueChanged) {
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };

  return (
    <div class="container-fluid Topnav-screen">
      <div className="">
        <div class="">
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div class="row ">
            <div class="" >
              <div >
                <div className="shadow-lg p-0 bg-body-tertiary rounded ">
                  <div className="mb-0 d-flex justify-content-between" >
                    <h1 align="left" class="purbut" > {mode === "update" ? 'Update Location' : 'Add Location'}</h1>
                    <h1 align="left" class="fs-4 mobileview" > {mode === "update" ? 'Update Location' : 'Add Location'}</h1>
                    <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-2 mb-4">
              <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2">
                <div class="row ">
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !location_no ? 'text-danger' : ''}`}>
                            Location No<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="locno"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the location number"
                        value={location_no}
                        onChange={(e) => setlocation_no(e.target.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, locationname, locationno)
                        }
                        ref={locationno}
                        maxLength={18}
                        readOnly={mode === "update"}
                      />
                      {/* {error && !location_no && (
                        <div className="text-danger">
                          Location No should not be blank
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !location_name ? 'text-danger' : ''}`}>
                            Location Name<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="locname"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the location name"
                        value={location_name}
                        onChange={(e) => setlocation_name(e.target.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, shortname, locationname)
                        }
                        maxLength={250}
                        ref={locationname}
                      />
                      {/* {error && !location_name && (
                        <div className="text-danger">
                          Location Name should not be blank
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      {/* <label for="srtname" class="exp-form-labels">
                        Short Name
                      </label> */}
                       <label for="state" class="exp-form-labels" className={`${error && !short_name ? 'text-danger' : ''}`}>
                           Short Name<span className="text-danger">*</span>
                          </label>
                      <input
                        id="srtname"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the short name"
                        value={short_name}
                        onChange={(e) => setshort_name(e.target.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, address, shortname)
                        }
                        maxLength={250}
                        ref={shortname}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !address1 ? 'text-danger' : ''}`}>
                            Address 1<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="address1"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the address"
                        value={address1}
                        onKeyDown={(e) => handleKeyDown(e, AddresS2, address)}
                        ref={address}
                        onChange={(e) => setaddress1(e.target.value)}
                        maxLength={250}
                      />{" "}
                      {/* {error && !address1 && (
                        <div className="text-danger">
                          Address should not be blank
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !address2 ? 'text-danger' : ''}`}>
                            Address 2<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="address2"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the address"
                        value={address2}
                        ref={AddresS2}
                        onKeyDown={(e) =>
                          handleKeyDown(e, Address3, AddresS2)
                        }
                        onChange={(e) => setaddress2(e.target.value)}
                        maxLength={250}
                      />
                      {/* {error && !address2 && (
                        <div className="text-danger">
                          Address should not be blank
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <label for="address3" class="exp-form-labels">
                        Address 3
                      </label>
                      <input
                        id="address3"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the address"
                        value={address3}
                        ref={Address3}
                        onChange={(e) => setaddress3(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, City, Address3)}
                        maxLength={250}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2 ">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !city ? 'text-danger' : ''}`}>
                            City<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <div title="Select the City">
                      <Select
                        id="city"
                        value={selectedCity}
                        onChange={handleChangeCity}
                        options={filteredOptionCity}
                        className="exp-input-field"
                        placeholder=""
                        maxLength={100}
                        ref={City}
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            State,
                            City,
                            hasValueChanged,
                            setHasValueChanged
                          )
                        }
                      />
                      {/* {error && !city && (
                        <div className="text-danger">
                          City should not be blank
                        </div>
                      )} */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !state ? 'text-danger' : ''}`}>
                            State<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <div title="Select the State">
                      <Select
                        id="state"
                        value={selectedState}
                        onChange={handleChangeState}
                        options={filteredOptionState}
                        className="exp-input-field"
                        placeholder=""
                        maxLength={100}
                        ref={State}
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            Pincode,
                            State,
                            hasValueChanged,
                            setHasValueChanged
                          )
                        }
                      />
                      {/* {error && !state && (
                        <div className="text-danger">
                          State should not be blank
                        </div>
                      )} */}
                    </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !pincode ? 'text-danger' : ''}`}>
                            Pin Code<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="pincode"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the Pin code"
                        value={pincode}
                        onKeyDown={(e) => handleKeyDown(e, Country, Pincode)}
                        ref={Pincode}
                        onChange={(e) =>
                          setpincode(
                            e.target.value.replace(/\D/g, "").slice(0, 13)
                          )
                        }
                        maxLength={100}
                      />
                      {/* {error && !pincode && (
                        <div className="text-danger">
                          Pin Code should not be blank
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !country ? 'text-danger' : ''}`}>
                            Country<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <div title="Select the Country ">
                      <Select
                        id="country"
                        value={selectedCountry}
                        onChange={handleChangeCountry}
                        options={filteredOptionCountry}
                        className="exp-input-field"
                        placeholder=""
                        maxLength={100}
                        ref={Country}
                        onKeyDown={(e) => handleKeyDown(e, email, Status)}
                      />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !email_id ? 'text-danger' : ''}`}>
                            Email<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="emailid"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required
                        title="Please enter the email"
                        value={email_id}
                        onChange={(e) => setemail_id(e.target.value)}
                        maxLength={150}
                        ref={email}
                        onKeyDown={(e) => handleKeyDown(e, Status, email)}
                      />{" "}
                      {/* {error && !validateEmail(email_id) && (
                        <div className="text-danger">
                          Please Enter Valid Email Id
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !status ? 'text-danger' : ''}`}>
                            Status<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                                      <div title="Select the Status ">
                      <Select
                        id="status"
                        value={selectedStatus}
                        onChange={handleChangeStatus}
                        options={filteredOptionStatus}
                        className="exp-input-field"
                        placeholder=""
                        ref={Status}
                        onKeyDown={(e) => handleKeyDown(e, Contactno, Status)}
                      />
                      {/* {error && !status && (
                        <div className="text-danger">
                          Status should not be blank
                        </div>
                      )} */}
                    </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !contact_no ? 'text-danger' : ''}`}>
                            Contact No<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="conno"
                        class="exp-input-field form-control"
                        type="number"
                        placeholder=""
                        required
                        title="Please enter the contact number"
                        value={contact_no}
                        ref={Contactno}
                        onChange={(e) =>
                          setcontact_no(
                            e.target.value.replace(/\D/g, "").slice(0, 50)
                          )
                        }
                        maxLength={50}
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
                      {/* {error && !contact_no && (
                        <div className="text-danger">
                          Contact No should not be blank
                        </div>
                      )} */}
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
                  <div class="col-md-3 form-group ">
                    {mode === "create" ? (
                      <button onClick={handleInsert} className="mt-4 me-2" title="Save">
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
    </div>
  );
}
export default LocInfoInput;
