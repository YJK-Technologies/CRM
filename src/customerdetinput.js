import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import Select from 'react-select';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import CustomerHdrInputPopup from "./Customerhdrinput";
import { useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');


function CustomerDetInput({ }) {
  const [open2, setOpen2] = React.useState(false);
  const navigate = useNavigate();
  const [customer_code, setcustomer_code] = useState("");
  const [company_code, setcompany_code] = useState("");
  const [customer_addr_1, setcustomer_addr_1] = useState("");
  const [customer_addr_2, setcustomer_addr_2] = useState("");
  const [customer_addr_3, setcustomer_addr_3] = useState("");
  const [customer_addr_4, setcustomer_addr_4] = useState("");
  const [customer_area, setcustomer_area] = useState("");
  const [customer_state, setcustomer_state] = useState("");
  const [customer_country, setcustomer_country] = useState("");
  const [customer_imex_no, setcustomer_imex_no] = useState("");
  const [customer_office_no, setcustomer_office_no] = useState("");
  const [customer_resi_no, setcustomer_resi_no] = useState("");
  const [customer_mobile_no, setcustomer_mobile_no] = useState("");
  const [customer_fax_no, setcustomer_fax_no] = useState("");
  const [customer_email_id, setcustomer_email_id] = useState("");
  const [customer_credit_limit, setcustomer_credit_limit] = useState("0");
  const [keyfield, setkeyfield] = useState("");
  const [customer_transport_code, setcustomer_transport_code] = useState("");
  const [customer_salesman_code, setcustomer_salesman_code] = useState("");
  const [customer_broker_code, setcustomer_broker_code] = useState("");
  const [customer_weekday_code, setcustomer_weekday_code] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [customercodedrop, setcustomercodedrop] = useState([]);
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
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedSales, setSelectedSales] = useState('');
  const [selectedBroker, setSelectedBroker] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('')
  const [officedrop, setOfficedrop] = useState([]);
  const [customerdrop, setcustomerdrop] = useState([]);
  const [selectedOffice, setselectedOffice] = useState('');
  const [office_type, setOfficeType] = useState('');
  const [contact_person, setContact_person] = useState('');
  const [selectedCustomer, setselectedCust] = useState('');
  const [default_customer, setdefaultCust] = useState('');
  const Country = useRef(null);
  const IMEx = useRef(null);
  const OfficeNo = useRef(null);
  const Residential = useRef(null);
  const Mobile = useRef(null);
  const Fax = useRef(null);
  const Email = useRef(null);
  const Credit = useRef(null);
  const Transport = useRef(null);
  const Salesman = useRef(null);
  const Broker = useRef(null);
  const Weekday = useRef(null);
  const Office = useRef(null);
  const City = useRef(null);
  const Address4 = useRef(null);
  const Address3 = useRef(null);
  const Address2 = useRef(null);
  const Address1 = useRef(null);
  const code = useRef(null);
  const Contact = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')

  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setcustomer_code("");
    setcustomer_addr_1("");
    setcustomer_addr_2("");
    setcustomer_addr_3("");
    setcustomer_addr_4('');
    setcustomer_imex_no('');
    setcustomer_office_no('');
    setcustomer_resi_no('');
    setcustomer_mobile_no('');
    setcustomer_email_id('');
    setcustomer_credit_limit('');
    setcustomer_weekday_code('');
    setContact_person('');
    setcustomer_code('');
    setcustomer_area('');
    setcustomer_state('');
    setcustomer_country('');
    setcustomer_transport_code('');
    setcustomer_salesman_code('');
    setcustomer_broker_code('');
    setOfficeType('');
    setdefaultCust('');
    setSelectedCode('');
    setSelectedCity('');
    setselectedState('');
    setselectedCountry('');
    setSelectedTransport('');
    setSelectedSales('');
    setSelectedBroker('');
    setselectedOffice('');
    setselectedCust('');
  };



  
  
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/customercode`, {
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
        setcustomercodedrop(val);
      } catch (error) {
        console.error('Error fetching Vendors:', error);
      }
    };

    if (company_code) {
      fetchCustomer();
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


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getdefCustomer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setcustomerdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setcustomer_addr_1(selectedRow.customer_addr_1 || "")
      setcustomer_addr_2(selectedRow.customer_addr_2 || "");
      setcustomer_addr_3(selectedRow.customer_addr_3 || "");
      setcustomer_addr_4(selectedRow.customer_addr_4 || "");
      setcustomer_imex_no(selectedRow.customer_imex_no || "");
      setcustomer_office_no(selectedRow.customer_office_no || "");
      setcustomer_resi_no(selectedRow.customer_resi_no || "");
      setcustomer_mobile_no(selectedRow.customer_mobile_no || 0);
      setcustomer_fax_no(selectedRow.customer_fax_no || "");
      setcustomer_email_id(selectedRow.customer_email_id || "");
      setcustomer_credit_limit(selectedRow.customer_credit_limit || 0);
      setcustomer_weekday_code(selectedRow.customer_weekday_code || "");
      setContact_person(selectedRow.contact_person || "");
      setcustomer_code(selectedRow.customer_code || "");
      setcustomer_area(selectedRow.customer_area || "");
      setcustomer_state(selectedRow.customer_state || "");
      setcustomer_country(selectedRow.customer_country || "");
      setcustomer_transport_code(selectedRow.customer_transport_code || "");
      setcustomer_salesman_code(selectedRow.customer_salesman_code || "");
      setcustomer_broker_code(selectedRow.customer_broker_code || "");
      setOfficeType(selectedRow.office_type || "");
      setdefaultCust(selectedRow.default_customer || "");
      setkeyfield(selectedRow.keyfield || "");
      setSelectedCode({
        label: selectedRow.customer_code,
        value: selectedRow.customer_code,
      });
      setSelectedCity({
        label: selectedRow.customer_area,
        value: selectedRow.customer_area,
      });
      setselectedState({
        label: selectedRow.customer_state,
        value: selectedRow.customer_state,
      });
      setselectedCountry({
        label: selectedRow.customer_country,
        value: selectedRow.customer_country,
      });
      setSelectedTransport({
        label: selectedRow.customer_transport_code,
        value: selectedRow.customer_transport_code,
      });
      setSelectedSales({
        label: selectedRow.customer_salesman_code,
        value: selectedRow.customer_salesman_code,
      });
      setSelectedBroker({
        label: selectedRow.customer_broker_code,
        value: selectedRow.customer_broker_code,
      });
      setselectedOffice({
        label: selectedRow.office_type,
        value: selectedRow.office_type,
      });
      setselectedCust({
        label: selectedRow.default_customer,
        value: selectedRow.default_customer,
      });


    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const filteredOptionCode = Array.isArray(customercodedrop)
    ? customercodedrop.map((option) => ({
      value: option.customer_code,
      label: `${option.customer_code} - ${option.customer_name}`,
    }))
    : [];

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

  const filteredOptioncustomer = customerdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChangeCode = (selectedOption) => {
    setSelectedCode(selectedOption);
    setcustomer_code(selectedOption ? selectedOption.value : '');
    setSelectedUserName(selectedOption ? selectedOption.label.split(' - ')[1] : '');
  };

  const handleChangeTransport = (selectedTransport) => {
    setSelectedTransport(selectedTransport);
    setcustomer_transport_code(selectedTransport ? selectedTransport.value : '');
  };

  const handleChangeSales = (selectedSales) => {
    setSelectedSales(selectedSales);
    setcustomer_salesman_code(selectedSales ? selectedSales.value : '');
  };

  const handleChangeBroker = (selectedBroker) => {
    setSelectedBroker(selectedBroker);
    setcustomer_broker_code(selectedBroker ? selectedBroker.value : '');
  };

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setcustomer_area(selectedCity ? selectedCity.value : '');
  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setcustomer_state(selectedState ? selectedState.value : '');
  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setcustomer_country(selectedCountry ? selectedCountry.value : '');
  };

  const handleChangeOffice = (selectedOffice) => {
    setselectedOffice(selectedOffice);
    setOfficeType(selectedOffice ? selectedOffice.value : '');
  };

  const handleChangeCustomer = (selectedCustomer) => {
    setselectedCust(selectedCustomer);
    setdefaultCust(selectedCustomer ? selectedCustomer.value : '');
  };



  const handleNavigateToForm = () => {
    navigate("/AddCustomerHeader", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleNavigate = () => {
    navigate("/Customer", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleInsert = async () => {
    if (
      !customer_code ||
      // !company_code ||
      !customer_addr_1 ||
      !customer_addr_2 ||
      !customer_mobile_no ||
      !customer_email_id ||
      !customer_credit_limit ||
      !customer_country ||
      !customer_state
    ) {
      setError(" ");
      return;
    }

    // Email validation
    if (!validateEmail(customer_email_id)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addCustomerDetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          customer_code,
          customer_addr_1,
          customer_addr_2,
          customer_addr_3,
          customer_addr_4,
          customer_area,
          customer_state,
          customer_country,
          customer_imex_no,
          customer_office_no,
          customer_resi_no,
          customer_mobile_no,
          customer_fax_no,
          customer_email_id,
          customer_credit_limit,
          customer_transport_code,
          customer_salesman_code,
          customer_broker_code,
          customer_weekday_code,
          contact_person,
          office_type,
          default_customer,
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
      toast.error('Error inserting data: ' + error.message, {

      });
    }
    finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {
    if (
      !customer_code ||
      !customer_addr_1 ||
      !customer_addr_2 ||
      !customer_mobile_no ||
      !customer_email_id ||
      !customer_credit_limit ||
      !customer_country ||
      !customer_state
    ) {
      setError(" ");
      return;
    }

    // Email validation
    if (!validateEmail(customer_email_id)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/CustomerUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          customer_code,
          customer_addr_1,
          customer_addr_2,
          customer_addr_3,
          customer_addr_4,
          customer_area,
          customer_state,
          customer_country,
          customer_imex_no,
          customer_office_no,
          customer_resi_no,
          customer_mobile_no,
          customer_fax_no,
          customer_email_id,
          customer_credit_limit,
          customer_transport_code,
          customer_salesman_code,
          customer_broker_code,
          customer_weekday_code,
          contact_person,
          office_type,
          default_customer,
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
        <div class=""  >
          {loading && <LoadingScreen />}

          <ToastContainer
            position="top-right"
            className="toast-design" // Adjust this value as needed
            theme="colored"
          />
          <div className="shadow-lg p-0 bg-body-tertiary rounded  ">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut" > {mode === "update" ? 'Update Customer Details' : 'Add Customer Details '} </h1>
              <h1 align="left" class="mobileview fs-4" > {mode === "update" ? 'Update Customer Details' : 'Add Customer Details '} </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="pt-2 mb-4">
            <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
              <div class="row">
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="state" class="exp-form-labels">
                          Code
                        </label></div>
                      <div> <span className="text-danger">*</span></div>

                    </div>


                    <div className="input-group" title="Select the Code">
                      <Select
                        id="cusco"
                        value={selectedCode}
                        onChange={handleChangeCode}
                        options={filteredOptionCode}
                        className="exp-input-field position-relative"
                        placeholder=""
                        maxLength={18}
                        ref={code}
                        onKeyDown={(e) => handleKeyDown(e, Address1, code)}
                      /><button onClick={handleClickOpen} class="cushdrcode position-absolute me-5 pb-2" required title="Add Header"><i class="fa-solid fa-plus"></i></button>
                      {error && !customer_code && <div className="text-danger">Code  should not be blank</div>}

                    </div>

                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Address 1
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="cusad1"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={customer_addr_1}
                      onChange={(e) => setcustomer_addr_1(e.target.value)}
                      maxLength={250}
                      ref={Address1}
                      onKeyDown={(e) => handleKeyDown(e, Address2, Address1)}
                    />
                    {error && !customer_addr_1 && <div className="text-danger">Address should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Address 2
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="cusad2"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={customer_addr_2}
                      onChange={(e) => setcustomer_addr_2(e.target.value)}
                      maxLength={250}
                      ref={Address2}
                      onKeyDown={(e) => handleKeyDown(e, Address3, Address2)}
                    />
                    {error && !customer_addr_2 && <div className="text-danger">Address should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="cusad3" class="exp-form-labels">
                      Address 3
                    </label>  <input
                      id="cusad3"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={customer_addr_3}
                      onChange={(e) => setcustomer_addr_3(e.target.value)}
                      maxLength={250}
                      ref={Address3}
                      onKeyDown={(e) => handleKeyDown(e, Address4, Address3)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="cusad4" class="exp-form-labels">
                      Address 4
                    </label><input
                      id="cusad4"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={customer_addr_4}
                      onChange={(e) => setcustomer_addr_4(e.target.value)}
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
                        onKeyDown={(e) => handleKeyDown(e, code, City)}
                      />
                      {error && !customer_area && <div className="text-danger">City should not be blank</div>}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="rid" class="exp-form-labels">
                      State<div> <span className="text-danger">*</span></div>
                    </label>
                    <div title="Select the State">
                      <Select
                        id="state"
                        value={selectedState}
                        onChange={handleChangeState}
                        options={filteredOptionState}
                        className="exp-input-field"
                        placeholder=""
                        ref={code}
                        onKeyDown={(e) => handleKeyDown(e, Country, code)}
                      />
                      {error && !customer_state && <div className="text-danger">State should not be blank</div>}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
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
                      />
                      {error && !customer_country && <div className="text-danger">Country should not be blank</div>}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        IMEX No
                      </label></div>
                    </div> <input
                      id="cusimex"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the IMEX number"
                      value={customer_imex_no}
                      onChange={(e) => setcustomer_imex_no(e.target.value)}
                      maxLength={20}
                      ref={IMEx}
                      onKeyDown={(e) => handleKeyDown(e, OfficeNo, IMEx)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="cusoff" class="exp-form-labels">
                      Office No
                    </label><input
                      id="cusoff"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the office number"
                      value={customer_office_no}
                      onChange={(e) => setcustomer_office_no(e.target.value)}
                      maxLength={20}
                      ref={OfficeNo}
                      onKeyDown={(e) => handleKeyDown(e, Residential, OfficeNo)}
                    />
                      {error && !customer_office_no && <div className="text-danger">Office no should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="cusresi" class="exp-form-labels">
                      Residential No
                    </label> <input
                      id="cusresi"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the residential number"
                      value={customer_resi_no}
                      onChange={(e) => setcustomer_resi_no(e.target.value)}
                      maxLength={20}
                      ref={Residential}
                      onKeyDown={(e) => handleKeyDown(e, Mobile, Residential)}
                    />
                    {error && !customer_resi_no && <div className="text-danger">Residential no should not be blank</div>}
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
                      value={customer_mobile_no}
                      onChange={(e) => setcustomer_mobile_no(e.target.value)}
                      maxLength={20}
                      ref={Mobile}
                      onKeyDown={(e) => handleKeyDown(e, Fax, Mobile)}
                    />
                    {error && !customer_mobile_no && <div className="text-danger">Mobile Number should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Fax No
                      </label></div>
                    </div> <input
                      id="cusfax"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the FAX number"
                      value={customer_fax_no}
                      onChange={(e) => setcustomer_fax_no(e.target.value)}
                      maxLength={20}
                      ref={Fax}
                      onKeyDown={(e) => handleKeyDown(e, Email, Fax)}
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
                      value={customer_email_id}
                      onChange={(e) => setcustomer_email_id(e.target.value)}
                      maxLength={250}
                      ref={Email}
                      onKeyDown={(e) => handleKeyDown(e, Credit, Email)}
                    />
                    {error && !validateEmail(customer_email_id) && <div className="text-danger">Please Enter Valid Email Id</div>}
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
                      id="cuscre"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the credit limit"
                      value={customer_credit_limit}
                      onChange={(e) => setcustomer_credit_limit(e.target.value)}
                      maxLength={18}
                      ref={Credit}
                      onKeyDown={(e) => handleKeyDown(e, Transport, Credit)}
                    />
                    {error && !customer_credit_limit && <div className="text-danger">Credit Limit should not be blank</div>}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="custrans" class="exp-form-labels">
                      Transport Code
                    </label>
                    <div title="Select the Transport Code">
                      <Select
                        id="custrans"
                        value={selectedTransport}
                        onChange={handleChangeTransport}
                        options={filteredOptionTransaction}
                        className="exp-input-field"
                        placeholder=""
                        ref={Transport}
                        onKeyDown={(e) => handleKeyDown(e, Salesman, Transport)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="cussales" class="exp-form-labels">
                      Salesman Code
                    </label>
                    <div title="Select the Salesman Code">
                      <Select
                        id="cussales"
                        value={selectedSales}
                        onChange={handleChangeSales}
                        options={filteredOptionSales}
                        className="exp-input-field"
                        placeholder=""
                        ref={Salesman}
                        onKeyDown={(e) => handleKeyDown(e, Broker, Salesman)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="cusbro" class="exp-form-labels">
                      Broker Code
                    </label>
                    <div title="Select the Broker Code">
                      <Select
                        id="cusbro"
                        value={selectedBroker}
                        onChange={handleChangeBroker}
                        options={filteredOptionBroker}
                        className="exp-input-field"
                        placeholder=""
                        ref={Broker}
                        onKeyDown={(e) => handleKeyDown(e, Weekday, Broker)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2 ">
                  <div class="exp-form-floating">
                    <label for="cusweek" class="exp-form-labels">
                      Weekday Code
                    </label><input
                      id="cusweek"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please select a weekday code"
                      value={customer_weekday_code}
                      onChange={(e) => setcustomer_weekday_code(e.target.value)}
                      maxLength={10}
                      ref={Weekday}
                      onKeyDown={(e) => handleKeyDown(e, Office, Weekday)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2 ">
                  <div class="exp-form-floating">
                    <label for="cusweek" class="exp-form-labels">
                      Office Type
                    </label>
                    <div title="Select the Office Type">
                      <Select
                        id="officeType"
                        value={selectedOffice}
                        onChange={handleChangeOffice}
                        options={filteredOptionOffice}
                        className="exp-input-field"
                        placeholder=""
                        ref={Office}
                        onKeyDown={(e) => handleKeyDown(e, Contact, Office)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2 ">
                  <div class="exp-form-floating">
                    <label for="cusweek" class="exp-form-labels">
                      Default Customer
                    </label>
                    <div title="Select the  Default Customer">
                      <Select
                        id="officeType"
                        value={selectedCustomer}
                        onChange={handleChangeCustomer}
                        options={filteredOptioncustomer}
                        className="exp-input-field"
                        placeholder=""
                        ref={Office}
                        onKeyDown={(e) => handleKeyDown(e, Contact, Office)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2 ">
                  <div class="exp-form-floating">
                    <label for="cusweek" class="exp-form-labels">
                      Contact Person
                    </label>
                    <input
                      id="officeType"
                      value={contact_person}
                      onChange={(e) => setContact_person(e.target.value)}
                      className="exp-input-field form-control"
                      placeholder=""
                      ref={Contact}
                      // onKeyDown={(e) => handleKeyDown}
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
                <div class="col-md-3 form-group d-flex justify-content-start p-2">
                  {mode === "create" ? (
                    <button onClick={handleInsert} className="mt-3" title="Save">
                      <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  ) : (
                    <button onClick={handleUpdate} className="mt-3" title="Update">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                  )}
                </div>
                <div>
                  <CustomerHdrInputPopup open={open2} handleClose={handleClose} />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
export default CustomerDetInput;