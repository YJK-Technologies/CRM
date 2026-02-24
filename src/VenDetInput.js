import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import Select from 'react-select'
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import VenHdrInputPopup from "./VenHdrInput";
import { useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';
const config = require('./Apiconfig');


function VenDetInput({ }) {
  const [open2, setOpen2] = React.useState(false);
  const navigate = useNavigate();
  const [vendor_code, setvendor_code] = useState("");
  const [company_code, setcompany_code] = useState("");
  const [vendor_addr_1, setvendor_addr_1] = useState("");
  const [vendor_addr_2, setvendor_addr_2] = useState("");
  const [vendor_addr_3, setvendor_addr_3] = useState("");
  const [vendor_addr_4, setvendor_addr_4] = useState("");
  const [vendor_area_code, setvendor_area_code] = useState("");
  const [vendor_state_code, setvendor_state_code] = useState("");
  const [vendor_country_code, setvendor_country_code] = useState("");
  const [vendor_imex_no, setvendor_imex_no] = useState("");
  const [vendor_office_no, setvendor_office_no] = useState("");
  const [vendor_resi_no, setvendor_resi_no] = useState("");
  const [vendor_mobile_no, setvendor_mobile_no] = useState("");
  const [vendor_fax_no, setvendor_fax_no] = useState("");
  const [vendor_email_id, setvendor_email_id] = useState("");
  const [vendor_credit_limit, setvendor_credit_limit] = useState("0");
  const [vendor_transport_code, setvendor_transport_code] = useState("");
  const [vendor_salesman_code, setvendor_salesman_code] = useState("");
  const [vendor_broker_code, setvendor_broker_code] = useState("");
  const [vendor_weekday_code, setvendor_weekday_code] = useState("");
  const [loading, setLoading] = useState(false);
  /*const [created_by, setCreated_by] = useState("");
  const [created_date, setCreated_date] = useState("");
  const [modfied_by, setModified_by] = useState("");
  const [modfied_date, setModified_date] = useState("");*/
  const [selectedRows, setSelectedRows] = useState([]);
  const [vendorcodedrop, setvendorcodedrop] = useState([]);
  const [SMcodedrop, setsmcodedrop] = useState([]);
  const [TRcodedrop, settrcodedrop] = useState([]);
  const [BRcodedrop, setbrcodedrop] = useState([]);
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setselectedState] = useState('');
  const [selectedCountry, setselectedCountry] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedSales, setSelectedSales] = useState('');
  const [selectedBroker, setSelectedBroker] = useState('');
  const [error, setError] = useState("");
  const [officedrop, setOfficedrop] = useState([]);
  const [selectedOffice, setselectedOffice] = useState('');
  const [office_type, setOfficeType] = useState('');
  const [contact_person, setContact_person] = useState('');
  const [keyfield, setkeyfield] = useState("");
  const created_by = sessionStorage.getItem('selectedUserCode')

  //Enter Key Reference Code
  const code = useRef(null);
  const Address1 = useRef(null);
  const Address2 = useRef(null);
  const Address3 = useRef(null);
  const Address4 = useRef(null);
  const City = useRef(null);
  const State = useRef(null);
  const Country = useRef(null);
  const Imex = useRef(null);
  const Office = useRef(null);
  const Residential = useRef(null);
  const Mobile = useRef(null);
  const FaxNo = useRef(null);
  const Credit = useRef(null);
  const TRansport = useRef(null);
  const Sales = useRef(null);
  const Broker = useRef(null);
  const Week = useRef(null);
  const OfficeT = useRef(null);
  const Email = useRef(null);
  const Contact = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setvendor_code("");
    setvendor_addr_1("");
    setvendor_addr_2("");
    setvendor_addr_3("");
    setvendor_addr_4("");
    setvendor_area_code("");
    setvendor_state_code("");
    setvendor_country_code("");
    setvendor_imex_no("");
    setvendor_office_no('');
    setvendor_resi_no('');
    setvendor_mobile_no("");
    setvendor_fax_no('');
    setvendor_email_id('');
    setvendor_credit_limit(0);
    setvendor_transport_code('');
    setvendor_salesman_code('');
    setvendor_broker_code('');
    setvendor_weekday_code('');
    setOfficeType('');
    setContact_person('');
    setvendor_area_code('');
    setvendor_state_code('');
    setvendor_country_code('');
    setvendor_code('');
    setvendor_transport_code('');
    setvendor_salesman_code('');
    setvendor_broker_code('');
    setOfficeType('');
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setvendor_code(selectedRow.vendor_code || "")
      setvendor_addr_1(selectedRow.vendor_addr_1 || "");
      setvendor_addr_2(selectedRow.vendor_addr_2 || "");
      setvendor_addr_3(selectedRow.vendor_addr_3 || "");
      setvendor_addr_4(selectedRow.vendor_addr_4 || "");
      setvendor_area_code(selectedRow.vendor_area_code || "");
      setvendor_state_code(selectedRow.vendor_state_code || "");
      setvendor_country_code(selectedRow.vendor_country_code || "");
      setvendor_imex_no(selectedRow.vendor_imex_no || "");
      setvendor_office_no(selectedRow.vendor_office_no || "");
      setvendor_resi_no(selectedRow.vendor_resi_no || "");
      setvendor_mobile_no(selectedRow.vendor_mobile_no || "");
      setvendor_fax_no(selectedRow.vendor_fax_no || "");
      setvendor_email_id(selectedRow.vendor_email_id || "");
      setvendor_credit_limit(selectedRow.vendor_credit_limit || 0);
      setvendor_transport_code(selectedRow.vendor_transport_code || "");
      setvendor_salesman_code(selectedRow.vendor_salesman_code || "");
      setvendor_broker_code(selectedRow.vendor_broker_code || "");
      setvendor_weekday_code(selectedRow.vendor_weekday_code || "");
      setOfficeType(selectedRow.office_type || "");
      setContact_person(selectedRow.contact_person || "");
      setkeyfield(selectedRow.keyfield || "");
       setvendor_area_code(selectedRow.vendor_area_code || "");
      setvendor_state_code(selectedRow.vendor_state_code || "");
      setvendor_country_code(selectedRow.vendor_country_code || "");
      setvendor_code(selectedRow.vendor_code || "");
      setvendor_transport_code(selectedRow.vendor_transport_code || "");
      setvendor_salesman_code(selectedRow.vendor_salesman_code || "");
      setvendor_broker_code(selectedRow.vendor_broker_code || "");
      setOfficeType(selectedRow.office_type || "");

      setSelectedCity({
        label: selectedRow.vendor_area_code,
        value: selectedRow.vendor_area_code,
      });
      setselectedState({
        label: selectedRow.vendor_state_code,
        value: selectedRow.vendor_state_code,
      });
      setselectedCountry({
        label: selectedRow.vendor_country_code,
        value: selectedRow.vendor_country_code,
      });
      setSelectedCode({
        label: selectedRow.vendor_code,
        value: selectedRow.vendor_code,
      });
      setSelectedTransport({
        label: selectedRow.vendor_transport_code,
        value: selectedRow.vendor_transport_code,
      });
      setSelectedSales({
        label: selectedRow.vendor_salesman_code,
        value: selectedRow.vendor_salesman_code,
      });
      setSelectedBroker({
        label: selectedRow.vendor_broker_code,
        value: selectedRow.vendor_broker_code,
      });
      setselectedOffice({
        label: selectedRow.office_type,
        value: selectedRow.office_type,
      });

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const fetchVendor = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/vendorcode`, {
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
        setvendorcodedrop(val);
      } catch (error) {
        console.error('Error fetching Vendors:', error);
      }
    };

    if (company_code) {
      fetchVendor();
    }
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/trcode`)
      .then((data) => data.json())
      .then((val) => settrcodedrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/smcode`)
      .then((data) => data.json())
      .then((val) => setsmcodedrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/brcode`)
      .then((data) => data.json())
      .then((val) => setbrcodedrop(val));
  }, []);



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

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getofftype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setOfficedrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionCode = vendorcodedrop.map((option) => ({
    value: option.vendor_code,
    label: `${option.vendor_code} - ${option.vendor_name}`,
  }));


  const filteredOptionTransaction = TRcodedrop.map((option) => ({
    value: option.keyfield,
    label: option.keyfield,
  }));

  const filteredOptionSales = SMcodedrop.map((option) => ({
    value: option.keyfield,
    label: option.keyfield,
  }));

  const filteredOptionBroker = BRcodedrop.map((option) => ({
    value: option.keyfield,
    label: option.keyfield,
  }));

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

  const filteredOptionOffice = officedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChangeCode = (selectedCode) => {
    setSelectedCode(selectedCode);
    setvendor_code(selectedCode ? selectedCode.value : '');

  };



  const handleChangeTransport = (selectedTransport) => {
    setSelectedTransport(selectedTransport);
    setvendor_transport_code(selectedTransport ? selectedTransport.value : '');

  };

  const handleChangeSales = (selectedSales) => {
    setSelectedSales(selectedSales);
    setvendor_salesman_code(selectedSales ? selectedSales.value : '');

  };

  const handleChangeBroker = (selectedBroker) => {
    setSelectedBroker(selectedBroker);
    setvendor_broker_code(selectedBroker ? selectedBroker.value : '');

  };
  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setvendor_area_code(selectedCity ? selectedCity.value : '');

  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setvendor_state_code(selectedState ? selectedState.value : '');

  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setvendor_country_code(selectedCountry ? selectedCountry.value : '');

  };

  const handleChangeOffice = (selectedOffice) => {
    setselectedOffice(selectedOffice);
    setOfficeType(selectedOffice ? selectedOffice.value : '');

  };

  const handleNavigateToForm = () => {
    navigate("/AddVendorHeader", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleNavigate = () => {
    navigate("/Vendor", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleInsert = async () => {
    if (
      !vendor_code ||
      !vendor_addr_1 ||
      !vendor_addr_2 ||
      !vendor_mobile_no ||
      !vendor_email_id ||
      !vendor_credit_limit ||
      !vendor_country_code ||
      !vendor_state_code
    ) {
      setError(" ");
       toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(vendor_email_id)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addVendorDetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendor_code,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          vendor_addr_1,
          vendor_addr_2,
          vendor_addr_3,
          vendor_addr_4,
          vendor_area_code,
          vendor_state_code,
          vendor_country_code,
          vendor_imex_no,
          vendor_office_no,
          vendor_resi_no,
          vendor_mobile_no,
          vendor_fax_no,
          vendor_email_id,
          vendor_credit_limit,
          vendor_transport_code,
          vendor_salesman_code,
          vendor_broker_code,
          vendor_weekday_code,
          contact_person,
          office_type,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
       if (response.ok) {
       toast.success("Data inserted Successfully", {
      onClose: () => clearInputFields()
      });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {
    if (!vendor_code) {
      setError(" ");
       toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(vendor_email_id)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/VendorUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendor_code,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          vendor_addr_1,
          vendor_addr_2,
          vendor_addr_3,
          vendor_addr_4,
          vendor_area_code,
          vendor_state_code,
          vendor_country_code,
          vendor_imex_no,
          vendor_office_no,
          vendor_resi_no,
          vendor_mobile_no,
          vendor_fax_no,
          vendor_email_id,
          vendor_credit_limit,
          vendor_transport_code,
          vendor_salesman_code,
          vendor_broker_code,
          vendor_weekday_code,
          contact_person,
          office_type,
          keyfield,
          modified_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
     if (response.ok) {
      toast.success("Data updated successfully", {
      onClose: () => clearInputFields()
      });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("Failed to insert data");
        const errorResponse = await response.json();
        toast.error('Error inserting data: ' + errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

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


  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          {loading && <LoadingScreen />}

          <ToastContainer
            position="top-right"
            className="toast-design" // Adjust this value as needed
            theme="colored"
          />
          <div className="shadow-lg p-0 bg-body-tertiary rounded">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut"> {mode === "update" ? 'Update Vendor Details ' : ' Add Vendor Details'}</h1>
              <h1 align="left" class="mobileview fs-3"> {mode === "update" ? 'Update Vendor Details ' : ' Add Vendor Details'}</h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="pt-2 mb-4">
            <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
              <div class="row">
                <div className="col-md-3 form-group mb-2" >

                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Code
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div>

                    <div className="input-group" title="Select the Code">
                
                      <Select
                        id="venco"
                        value={selectedCode}
                        onChange={handleChangeCode}
                        options={filteredOptionCode}
                        className="exp-input-field position-relative"
                        placeholder=""
                        maxLength={18}
                        ref={code}
                        onKeyDown={(e) => handleKeyDown(e, Address1, code)}
                      /><button onClick={handleClickOpen} class="vendorhdrcode position-absolute me-5 pt-2" required title="Add Header"><i class="fa-solid fa-plus"></i></button>
                    
                    {error && !vendor_code && <div className="text-danger">Code should not be blank</div>}
                  </div>
                </div>      </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Address1
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="venad1"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={vendor_addr_1}
                      onChange={(e) => setvendor_addr_1(e.target.value)}
                      maxLength={250}
                      ref={Address1}
                      onKeyDown={(e) => handleKeyDown(e, Address2, Address1)}
                    />{error && !vendor_addr_1 && <div className="text-danger">Address should not be blank</div>}


                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Address2
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="venad2"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={vendor_addr_2}
                      onChange={(e) => setvendor_addr_2(e.target.value)}
                      maxLength={250}
                      ref={Address2}
                      onKeyDown={(e) => handleKeyDown(e, Address3, Address2)}
                    />            {error && !vendor_addr_2 && <div className="text-danger">Address should not be blank</div>}


                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="venad3" class="exp-form-labels">
                      Address3
                    </label>  <input
                      id="venad3"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={vendor_addr_3}
                      onChange={(e) => setvendor_addr_3(e.target.value)}
                      maxLength={250}
                      ref={Address3}
                      onKeyDown={(e) => handleKeyDown(e, Address4, Address3)}
                    />

                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="venad4" class="exp-form-labels">
                      Address4
                    </label><input
                      id="venad4"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={vendor_addr_4}
                      onChange={(e) => setvendor_addr_4(e.target.value)}
                      maxLength={250}
                      ref={Address4}
                      onKeyDown={(e) => handleKeyDown(e, City, Address4)}
                    />

                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">

                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        City
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div>
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
                    />
                    {error && !vendor_area_code && <div className="text-danger">City should not be blank</div>}
                  </div>
                </div>     </div>

                <div className="col-md-3 form-group mb-2">

                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
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
                    />
                    {error && !vendor_state_code && <div className="text-danger">State should not be blank</div>}
                  </div>
                </div>  </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Country
                      </label>
                      </div>
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
                      onKeyDown={(e) => handleKeyDown(e, Imex, Country)}
                    />
                    {error && !vendor_country_code && <div className="text-danger">Country should not be blank</div>}
                  </div>
                </div>  </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        IMEX No
                      </label></div>
                    </div> <input
                      id="venimex"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the IMEX number"
                      value={vendor_imex_no}
                      onChange={(e) => setvendor_imex_no(e.target.value)}
                      maxLength={20}
                      ref={Imex}
                      onKeyDown={(e) => handleKeyDown(e, Office, Imex)}
                    />

                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="venoff" class="exp-form-labels">
                      Office No
                    </label><input
                      id="venoff"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the office number"
                      value={vendor_office_no}
                      onChange={(e) => setvendor_office_no(e.target.value)}
                      maxLength={20}
                      ref={Office}
                      onKeyDown={(e) => handleKeyDown(e, Residential, Office)}
                    />

                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="venresi" class="exp-form-labels">
                      Residential No
                    </label> <input
                      id="venresi"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the residential number"
                      value={vendor_resi_no}
                      onChange={(e) => setvendor_resi_no(e.target.value)}
                      maxLength={20}
                      ref={Residential}
                      onKeyDown={(e) => handleKeyDown(e, Mobile, Residential)}
                    />

                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Mobile No
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="mobno"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the mobile number"
                      value={vendor_mobile_no}
                      onChange={(e) => setvendor_mobile_no(e.target.value)}
                      maxLength={20}
                      ref={Mobile}
                      onKeyDown={(e) => handleKeyDown(e, FaxNo, Mobile)}
                    />            {error && !vendor_mobile_no && <div className="text-danger">Mobile Number should not be blank</div>}


                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Fax No
                      </label></div>
                    </div> <input
                      id="venfax"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the FAX number"
                      value={vendor_fax_no}
                      onChange={(e) => setvendor_fax_no(e.target.value)}
                      maxLength={20}
                      ref={FaxNo}
                      onKeyDown={(e) => handleKeyDown(e, Email, FaxNo)}
                    />


                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Email ID
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="emailid"
                      class="exp-input-field form-control"
                      type="email"
                      placeholder=""
                      required title="Please enter the email ID"
                      value={vendor_email_id}
                      onChange={(e) => setvendor_email_id(e.target.value)}
                      maxLength={250}
                      ref={Email}
                      onKeyDown={(e) => handleKeyDown(e, Credit, Email)}
                    />            {error && !validateEmail(vendor_email_id) && <div className="text-danger">Please Enter Valid Email Id</div>}


                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Credit Limit
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="vencre"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the credit limit"
                      value={vendor_credit_limit}
                      onChange={(e) => setvendor_credit_limit(e.target.value)}
                      maxLength={18}
                      ref={Credit}
                      onKeyDown={(e) => handleKeyDown(e, TRansport, Credit)}
                    />            {error && !vendor_credit_limit && <div className="text-danger">Credit Limit should not be blank</div>}


                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="ventrans" class="exp-form-labels">
                      Transport Code
                    </label>
                    <div title="Select the Transport Code">        

                    <Select
                      id="ventrans"
                      value={selectedTransport}
                      onChange={handleChangeTransport}
                      options={filteredOptionTransaction}
                      className="exp-input-field"
                      placeholder=""
                      ref={TRansport}
                      onKeyDown={(e) => handleKeyDown(e, Sales, TRansport)}
                    />

                  </div>
                </div>    </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="vensales" class="exp-form-labels">
                      Salesman Code
                    </label>
 <div title="Select the Salesman Code">    
                    <Select
                      id="vensales"
                      value={selectedSales}
                      onChange={handleChangeSales}
                      options={filteredOptionSales}
                      className="exp-input-field"
                      placeholder=""
                      ref={Sales}
                      onKeyDown={(e) => handleKeyDown(e, Broker, Sales)}
                    />

                  </div>
                </div> </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="venbro" class="exp-form-labels">
                      Broker Code
                    </label>
                    <div title="Select the Broker Code">   

                    <Select
                      id="venbro"
                      value={selectedBroker}
                      onChange={handleChangeBroker}
                      options={filteredOptionBroker}
                      className="exp-input-field"
                      placeholder=""
                      ref={Broker}
                      onKeyDown={(e) => handleKeyDown(e, Week, Broker)}
                    />

                  </div>
                </div>  </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="venweek" class="exp-form-labels">
                      Weekday Code
                    </label><input
                      id="venweek"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please select a weekday code"
                      value={vendor_weekday_code}
                      onChange={(e) => setvendor_weekday_code(e.target.value)}
                      maxLength={10}
                      ref={Week}
                      onKeyDown={(e) => handleKeyDown(e, OfficeT, Week)}
                    />

                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="ventrans" class="exp-form-labels">
                      Office Type
                    </label>
                     <div title="Select the Office Type "> 
                    <Select
                    
                      id="officeType"
                      value={selectedOffice}
                      onChange={handleChangeOffice}
                      options={filteredOptionOffice}
                      className="exp-input-field"
                      placeholder=""
                      ref={OfficeT}
                      onKeyDown={(e) => handleKeyDown(e, Contact, OfficeT)}
                    />

                  </div>
                </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="ventrans" class="exp-form-labels">
                      Contact Person
                    </label>
                    <input
                      id="officeType"
                      value={contact_person}
                      onChange={(e) => setContact_person(e.target.value)}
                      className="exp-input-field form-control"
                      placeholder=""
                      ref={Contact}
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
                <div class="col-md-3 form-group ">
                  {mode === "create" ? (
                    <button onClick={handleInsert} className="mt-4" title="Save">
                      <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  ) : (
                    <button onClick={handleUpdate} className="mt-4" title="Update">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                  )}
                  <VenHdrInputPopup open={open2} handleClose={handleClose} />
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
export default VenDetInput;