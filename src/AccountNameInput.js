import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';

const config = require("./Apiconfig");

function AccNameInput({ }) {
  const navigate = useNavigate();
  const [account_code, setaccount_code] = useState("");
  const [account_name, setaccount_name] = useState("");
  const [acc_addr_1, setacc_addr_1] = useState("");
  const [acc_addr_2, setacc_addr_2] = useState("");
  const [acc_addr_3, setacc_addr_3] = useState("");
  const [acc_addr_4, setacc_addr_4] = useState("");
  const [acc_area_code, setacc_area_code] = useState("");
  const [acc_state_code, setacc_state_code] = useState("");
  const [acc_country_code, setacc_country_code] = useState("");
  const [acc_imex_no, setacc_imex_no] = useState("");
  const [acc_office_no, setacc_office_no] = useState("");
  const [acc_resi_no, setacc_resi_no] = useState("");
  const [acc_mobile_no, setacc_mobile_no] = useState("");
  const [acc_fax_no, setacc_fax_no] = useState("");
  const [acc_email_id, setacc_email_id] = useState("");
  const [acc_credit_limit, setacc_credit_limit] = useState("");
  const [acc_transport_code, setacc_transport_code] = useState("");
  const [acc_salesman_code, setacc_salesman_code] = useState("");
  const [acc_broker_code, setacc_broker_code] = useState("");
  const [acc_weekday_code, setacc_weekday_code] = useState("");
  // const [standard_accgroup_code, setstandard_accgroup_code] = useState("");
  const [user_accgroup_code, setuser_accgroup_code] = useState("");
  const [status, setstatus] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [customercodedrop, setcustomercodedrop] = useState([]);
  const [SMcodedrop, setsmcodedrop] = useState([]);
  const [TRcodedrop, settrcodedrop] = useState([]);
  const [BRcodedrop, setbrcodedrop] = useState([]);
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setselectedState] = useState("");
  const [selectedCountry, setselectedCountry] = useState("");
  const [selectedTransport, setSelectedTransport] = useState("");
  const [selectedSales, setSelectedSales] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const [selectBaseacc, setselectedbaseacc] = useState("");
  const [baseaccdrop, setbaseaccdrop] = useState([]);
  const [error, setError] = useState("");
  const [StdAccGrpdrop, setStdAccGrpdrop] = useState([]);
  const [selectedUserAcc, setSelectedUserAcc] = useState("");
  const [Userdrop, setUserdrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserCode, setSelectedUserCode] = useState("");
  const [loading, setLoading] = useState(false);


  // const [standardAccCode, setStandardAccCode] = useState('');
  const Status = useRef(null)
  const Address4 = useRef(null)
  const City = useRef(null)
  const State = useRef(null)
  const Country = useRef(null)
  const IMEX = useRef(null)
  const Office = useRef(null)
  const Residential = useRef(null)
  const Mobile = useRef(null)
  const Fax = useRef(null)
  const Email = useRef(null)
  const Credit = useRef(null)
  const Transport = useRef(null)
  const Salesman = useRef(null)
  const Broker = useRef(null)
  const Weekday = useRef(null)
  const Address3 = useRef(null)
  const Address2 = useRef(null)
  const Address1 = useRef(null)
  const Accountant = useRef(null)
  const User = useRef(null)
  const Accountantcode = useRef(null)
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')

  console.log(selectedRows);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getStdAccGrp`)
      .then((data) => data.json())
      .then((val) => setStdAccGrpdrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getbasaccode`)
      .then((data) => data.json())
      .then((val) => setbaseaccdrop(val));
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

    fetch(`${config.apiBaseUrl}/getUsercodename`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setUserdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionStdAccGrp = StdAccGrpdrop.map((option) => ({
    value: option.standard_accgroup_code,
    label: option.standard_accgroup_code,
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
  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));
  const filteredOptionUser = Userdrop.map((option) => ({
    value: option.user_accgroup_code,
    label: option.user_accgroup_name,
  }));
  // const handleChangeStdAccGrp = (selectedUserAcc) => {
  //   setSelectedUserAcc(selectedUserAcc);
  //   setstandard_accgroup_code(selectedUserAcc ? selectedUserAcc.value : '');
  //   setError(false);
  // };
  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleChangeTransport = (selectedTransport) => {
    setSelectedTransport(selectedTransport);
    setacc_transport_code(selectedTransport ? selectedTransport.value : "");
  };

  const handleChangeSales = (selectedSales) => {
    setSelectedSales(selectedSales);
    setacc_salesman_code(selectedSales ? selectedSales.value : "");
  };

  const handleChangeBroker = (selectedBroker) => {
    setSelectedBroker(selectedBroker);
    setacc_broker_code(selectedBroker ? selectedBroker.value : "");
  };
  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setacc_area_code(selectedCity ? selectedCity.value : "");
  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setacc_state_code(selectedState ? selectedState.value : "");
  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setacc_country_code(selectedCountry ? selectedCountry.value : "");
  };

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_accgroup_code(selectedUser ? selectedUser.value : "");
    setSelectedUserCode(selectedUser.value);
  };

  // const SelectItem = async (user_accgroup_code) => {
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/getstdBase`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ user_accgroup_code: user_accgroup_code }),
  //     });

  //     if (response.ok) {
  //       const searchData = await response.json();
  //       const [{standard_accgroup_code}] = searchData;
  //       setStandardAccCode(standard_accgroup_code)

  //       console.log(searchData);
  //     } else if (response.status === 404) {
  //       console.log("Data not found");
  //     } else {
  //       console.log("Bad request");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching search data:", error);
  //   }
  // };

  const handleNavigateToForm = () => {
    navigate("/AddAccountName", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleNavigate = () => {
    navigate("/AccountName", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleInsert = async () => {
    if (
      !account_name ||
      !acc_addr_1 ||
      !acc_addr_2 ||
      !acc_area_code ||
      !acc_state_code ||
      !acc_country_code ||
      !acc_imex_no ||
      !acc_mobile_no ||
      !acc_fax_no ||
      !acc_email_id ||
      !acc_credit_limit ||
      // !standard_accgroup_code ||
      !user_accgroup_code ||
      !status
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    // Email validation
    if (!validateEmail(acc_email_id)) {
      toast.warning("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addAccountName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          account_code,
          account_name,
          acc_addr_1,
          acc_addr_2,
          acc_addr_3,
          acc_addr_4,
          acc_area_code,
          acc_state_code,
          acc_country_code,
          acc_imex_no,
          acc_office_no,
          acc_resi_no,
          acc_mobile_no,
          acc_fax_no,
          acc_email_id,
          acc_credit_limit,
          acc_transport_code,
          acc_salesman_code,
          acc_broker_code,
          acc_weekday_code,
          user_accgroup_code,
          status,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.ok) {
        const searchData = await response.json();
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
        // Reload the page after a delay
        // setTimeout(() => {
        //     window.location.reload();
        // }, 1000); // Adjust the delay time if needed
        //
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.error(errorResponse.message)

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

  const handleChangeName = (e) => {
    const accountantName = e.target.value;
    setaccount_name(accountantName);
  };

  const handleKeyPressRef = (e) => {
    if (e.key === "Enter") {
      GeneretedCode(account_name);
    }
  };

  const handleBlur = () => {
    if (selectedUserCode && account_name) {
      GeneretedCode(account_name);
    }
  };

  const GeneretedCode = async (account_name) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAccountCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          user_accgroup_code: selectedUserCode,
          account_name: account_name,
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ GeneratedAccountCode }] = searchData;
        setaccount_code(GeneratedAccountCode);
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
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

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="purbut">
        <div class="">
          <div className="shadow-lg p-0 bg-body-tertiary rounded mb-2">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">  Add Accounts</h1>
              <button onClick={handleNavigate} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2">
            <div className="row">
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <div className="d-flex justify-content-start">
                    <div>
                      <label htmlFor="rid" className="exp-form-labels">
                        Accountant code<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad1"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Accountant code"
                    value={account_code}
                    readOnly
                    maxLength={100}
                    ref={Accountantcode}
                    onKeyDown={(e) => handleKeyDown(e, User, Accountantcode)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="">
                    <label for="rid" class="exp-form-labels">
                      User Account Code
                    </label>
                      <div title="Select the User Account Code">
                    <Select
                      id="UserAccCode"
                      value={selectedUser}
                      onChange={handleChangeUser}
                      options={filteredOptionUser}
                      className=""
                      placeholder=""
                      ref={User}
                      onKeyDown={(e) => handleKeyDown(e, Accountant, User)}
                    />
                    {error && !user_accgroup_code && (
                      <div className="text-danger">
                        User Account Code should not be blank
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Accountant Name<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad1"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the accountant name"
                    value={account_name}
                    onBlur={handleBlur}
                    onChange={handleChangeName}
                    maxLength={100}
                    ref={Accountant}
                    onKeyDown={(e) => handleKeyDown(e, Address1, Accountant)}
                  />
                  {error && !account_name && (
                    <div className="text-danger">
                      Accountant Name should not be blank
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Address 1<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad1"
                    class="exp-input-field form-control"
                    type="text"
                    required
                    title="Please enter the address"
                    value={acc_addr_1}
                    onChange={(e) => setacc_addr_1(e.target.value)}
                    maxLength={250}
                    ref={Address1}
                    onKeyDown={(e) => handleKeyDown(e, Address2, Address1)}
                  />
                  {error && !acc_addr_1 && (
                    <div className="text-danger">Address should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Address 2<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad2"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the address"
                    value={acc_addr_2}
                    onChange={(e) => setacc_addr_2(e.target.value)}
                    maxLength={250}
                    ref={Address2}
                    onKeyDown={(e) => handleKeyDown(e, Address3, Address2)}
                  />
                  {error && !acc_addr_2 && (
                    <div className="text-danger">Address should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <label for="cusad3" class="exp-form-labels">
                    Address 3
                  </label>
                  <input
                    id="cusad3"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the address"
                    value={acc_addr_3}
                    onChange={(e) => setacc_addr_3(e.target.value)}
                    maxLength={250}
                    ref={Address3}
                    onKeyDown={(e) => handleKeyDown(e, Address4, Address3)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <label for="cusad4" class="exp-form-labels">
                    Address 4
                  </label>
                  <input
                    id="cusad4"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the address"
                    value={acc_addr_4}
                    onChange={(e) => setacc_addr_4(e.target.value)}
                    maxLength={250}
                    ref={Address4}
                    onKeyDown={(e) => handleKeyDown(e, City, Address4)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
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
                    ref={City}
                    onKeyDown={(e) => handleKeyDown(e, State, City)}
                  />
                  {error && !acc_area_code && (
                    <div className="text-danger">City should not be blank</div>
                  )}
                </div>
              </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <label for="rid" class="exp-form-labels">
                    State<span className="text-danger">*</span>
                  </label>
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
                  {error && !acc_state_code && (
                    <div className="text-danger">State should not be blank</div>
                  )}
                </div>
              </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Country<span className="text-danger">*</span>
                      </label>
                    </div>
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
                    onKeyDown={(e) => handleKeyDown(e, IMEX, Country)}
                  />
                  {error && !acc_country_code && (
                    <div className="text-danger">Country should not be blank</div>
                  )}
                </div>
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        IMEX No<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusimex"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the IMEX number"
                    value={acc_imex_no}
                    onChange={(e) => setacc_imex_no(e.target.value)}
                    maxLength={20}
                    ref={IMEX}
                    onKeyDown={(e) => handleKeyDown(e, Office, IMEX)}
                  />
                  {error && !acc_imex_no && (
                    <div className="text-danger">IMEX No should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="cusoff" class="exp-form-labels">
                    Office No
                  </label>
                  <input
                    id="cusoff"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the office number"
                    value={acc_office_no}
                    onChange={(e) => setacc_office_no(e.target.value)}
                    maxLength={20}
                    ref={Office}
                    onKeyDown={(e) => handleKeyDown(e, Residential, Office)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="cusresi" class="exp-form-labels">
                    Residential No
                  </label>
                  <input
                    id="cusresi"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the residential number"
                    value={acc_resi_no}
                    onChange={(e) => setacc_resi_no(e.target.value)}
                    maxLength={20}
                    ref={Residential}
                    onKeyDown={(e) => handleKeyDown(e, Mobile, Residential)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Mobile No<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="mobno"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the mobile number"
                    value={acc_mobile_no}
                    onChange={(e) => setacc_mobile_no(e.target.value)}
                    maxLength={20}
                    ref={Mobile}
                    onKeyDown={(e) => handleKeyDown(e, Fax, Mobile)}
                  />
                  {error && !acc_mobile_no && (
                    <div className="text-danger">
                      Mobile Number should not be blank
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Fax No<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusfax"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the FAX number"
                    value={acc_fax_no}
                    onChange={(e) => setacc_fax_no(e.target.value)}
                    maxLength={20}
                    ref={Fax}
                    onKeyDown={(e) => handleKeyDown(e, Email, Fax)}
                  />
                  {error && !acc_fax_no && (
                    <div className="text-danger">
                      FAX Number should not be blank
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Email ID<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="emailid"
                    class="exp-input-field form-control"
                    type="email"
                    placeholder=""
                    required
                    title="Please enter the email ID"
                    value={acc_email_id}
                    onChange={(e) => setacc_email_id(e.target.value)}
                    maxLength={250}
                    ref={Email}
                    onKeyDown={(e) => handleKeyDown(e, Credit, Email)}
                  />
                  {error && !validateEmail(acc_email_id) && (
                    <div className="text-danger">Please Enter Valid Email Id</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Credit Limit<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cuscre"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the credit limit"
                    value={acc_credit_limit}
                    onChange={(e) => setacc_credit_limit(e.target.value)}
                    maxLength={18}
                    ref={Credit}
                    onKeyDown={(e) => handleKeyDown(e, Transport, Credit)}
                  />
                  {error && !acc_credit_limit && (
                    <div className="text-danger">
                      Credit Limit should not be blank
                    </div>
                  )}
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
                  </label>
                  <input
                    id="cusweek"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please select a weekday code"
                    value={acc_weekday_code}
                    onChange={(e) => setacc_weekday_code(e.target.value)}
                    maxLength={10}
                    ref={Weekday}
                    onKeyDown={(e) => handleKeyDown(e, Status, Weekday)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
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
                    className="exp-input-field"
                    placeholder=""
                    ref={Status}
                    onKeyDown={(e) => handleKeyDown}
                  />
                  {error && !status && (
                    <div className="text-danger">Status should not be blank</div>
                  )}
                </div>
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
              <div class="col-md-3 form-group mt-4">
                <button onClick={handleInsert} class="" required title="Save">
                  <i class="fa-solid fa-floppy-disk"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobileview">
        <div class="">
          <div className="shadow-lg p-0 bg-body-tertiary rounded mb-2">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="h1">  Add Accounts</h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none borde-shape h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2">
            <div className="row">
              <div className="col-md-3 form-group">
                <div className="exp-form-floating">
                  <div className="d-flex justify-content-start">
                    <div>
                      <label htmlFor="rid" className="exp-form-labels">
                        Accountant code<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad1"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Accountant code"
                    value={account_code}
                    readOnly
                    maxLength={100}
                    ref={Accountantcode}
                    onKeyDown={(e) => handleKeyDown(e, User, Accountantcode)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="">
                    <label for="rid" class="exp-form-labels">
                      User Account Code
                    </label>
                    <Select
                      id="UserAccCode"
                      value={selectedUser}
                      onChange={handleChangeUser}
                      options={filteredOptionUser}
                      className=""
                      placeholder=""
                      ref={User}
                      onKeyDown={(e) => handleKeyDown(e, Accountant, User)}
                    />
                    {error && !user_accgroup_code && (
                      <div className="text-danger">
                        User Account Code should not be blank
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Accountant Name<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad1"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the accountant name"
                    value={account_name}
                    onBlur={handleBlur}
                    onChange={handleChangeName}
                    maxLength={100}
                    ref={Accountant}
                    onKeyDown={(e) => handleKeyDown(e, Address1, Accountant)}
                  />
                  {error && !account_name && (
                    <div className="text-danger">
                      Accountant Name should not be blank
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Address 1<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad1"
                    class="exp-input-field form-control"
                    type="text"
                    required
                    title="Please enter the address"
                    value={acc_addr_1}
                    onChange={(e) => setacc_addr_1(e.target.value)}
                    maxLength={250}
                    ref={Address1}
                    onKeyDown={(e) => handleKeyDown(e, Address2, Address1)}
                  />
                  {error && !acc_addr_1 && (
                    <div className="text-danger">Address should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Address 2<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusad2"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the address"
                    value={acc_addr_2}
                    onChange={(e) => setacc_addr_2(e.target.value)}
                    maxLength={250}
                    ref={Address2}
                    onKeyDown={(e) => handleKeyDown(e, Address3, Address2)}
                  />
                  {error && !acc_addr_2 && (
                    <div className="text-danger">Address should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <label for="cusad3" class="exp-form-labels">
                    Address 3
                  </label>
                  <input
                    id="cusad3"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the address"
                    value={acc_addr_3}
                    onChange={(e) => setacc_addr_3(e.target.value)}
                    maxLength={250}
                    ref={Address3}
                    onKeyDown={(e) => handleKeyDown(e, Address4, Address3)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <label for="cusad4" class="exp-form-labels">
                    Address 4
                  </label>
                  <input
                    id="cusad4"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the address"
                    value={acc_addr_4}
                    onChange={(e) => setacc_addr_4(e.target.value)}
                    maxLength={250}
                    ref={Address4}
                    onKeyDown={(e) => handleKeyDown(e, City, Address4)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        City<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
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
                  {error && !acc_area_code && (
                    <div className="text-danger">City should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <label for="rid" class="exp-form-labels">
                    State<span className="text-danger">*</span>
                  </label>
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
                  {error && !acc_state_code && (
                    <div className="text-danger">State should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Country<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <Select
                    id="country"
                    value={selectedCountry}
                    onChange={handleChangeCountry}
                    options={filteredOptionCountry}
                    className="exp-input-field"
                    placeholder=""
                    ref={Country}
                    onKeyDown={(e) => handleKeyDown(e, IMEX, Country)}
                  />
                  {error && !acc_country_code && (
                    <div className="text-danger">Country should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        IMEX No<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusimex"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the IMEX number"
                    value={acc_imex_no}
                    onChange={(e) => setacc_imex_no(e.target.value)}
                    maxLength={20}
                    ref={IMEX}
                    onKeyDown={(e) => handleKeyDown(e, Office, IMEX)}
                  />
                  {error && !acc_imex_no && (
                    <div className="text-danger">IMEX No should not be blank</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="cusoff" class="exp-form-labels">
                    Office No
                  </label>
                  <input
                    id="cusoff"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the office number"
                    value={acc_office_no}
                    onChange={(e) => setacc_office_no(e.target.value)}
                    maxLength={20}
                    ref={Office}
                    onKeyDown={(e) => handleKeyDown(e, Residential, Office)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="cusresi" class="exp-form-labels">
                    Residential No
                  </label>
                  <input
                    id="cusresi"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the residential number"
                    value={acc_resi_no}
                    onChange={(e) => setacc_resi_no(e.target.value)}
                    maxLength={20}
                    ref={Residential}
                    onKeyDown={(e) => handleKeyDown(e, Mobile, Residential)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Mobile No<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="mobno"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the mobile number"
                    value={acc_mobile_no}
                    onChange={(e) => setacc_mobile_no(e.target.value)}
                    maxLength={20}
                    ref={Mobile}
                    onKeyDown={(e) => handleKeyDown(e, Fax, Mobile)}
                  />
                  {error && !acc_mobile_no && (
                    <div className="text-danger">
                      Mobile Number should not be blank
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Fax No<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cusfax"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the FAX number"
                    value={acc_fax_no}
                    onChange={(e) => setacc_fax_no(e.target.value)}
                    maxLength={20}
                    ref={Fax}
                    onKeyDown={(e) => handleKeyDown(e, Email, Fax)}
                  />
                  {error && !acc_fax_no && (
                    <div className="text-danger">
                      FAX Number should not be blank
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Email ID<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="emailid"
                    class="exp-input-field form-control"
                    type="email"
                    placeholder=""
                    required
                    title="Please enter the email ID"
                    value={acc_email_id}
                    onChange={(e) => setacc_email_id(e.target.value)}
                    maxLength={250}
                    ref={Email}
                    onKeyDown={(e) => handleKeyDown(e, Credit, Email)}
                  />{" "}
                  {error && !validateEmail(acc_email_id) && (
                    <div className="text-danger">Please Enter Valid Email Id</div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Credit Limit<span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="cuscre"
                    class="exp-input-field form-control"
                    type="number"
                    placeholder=""
                    required
                    title="Please enter the credit limit"
                    value={acc_credit_limit}
                    onChange={(e) => setacc_credit_limit(e.target.value)}
                    maxLength={18}
                    ref={Credit}
                    onKeyDown={(e) => handleKeyDown(e, Transport, Credit)}
                  />
                  {error && !acc_credit_limit && (
                    <div className="text-danger">
                      Credit Limit should not be blank
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="custrans" class="exp-form-labels">
                    Transport Code
                  </label>
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
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="cussales" class="exp-form-labels">
                    Salesman Code
                  </label>
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
              <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating">
                  <label for="cusbro" class="exp-form-labels">
                    Broker Code
                  </label>
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
              <div className="col-md-3 form-group mb-2 ">
                <div class="exp-form-floating">
                  <label for="cusweek" class="exp-form-labels">
                    Weekday Code
                  </label>
                  <input
                    id="cusweek"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please select a weekday code"
                    value={acc_weekday_code}
                    onChange={(e) => setacc_weekday_code(e.target.value)}
                    maxLength={10}
                    ref={Weekday}
                    onKeyDown={(e) => handleKeyDown(e, Status, Weekday)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">
                        Status <span className="text-danger">*</span>
                      </label>
                    </div>
                  </div>
                  <Select
                    id="status"
                    value={selectedStatus}
                    onChange={handleChangeStatus}
                    options={filteredOptionStatus}
                    className="exp-input-field"
                    placeholder=""
                    ref={Status}
                    onKeyDown={(e) => handleKeyDown}
                  />
                  {error && !status && (
                    <div className="text-danger">Status should not be blank</div>
                  )}
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
                  </div>
                  <input
                    id="emailid"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the email ID"
                    value={created_by}
                  />
                </div>
              </div> */}
              <div class="col-md-3 form-group mt-4">
                <button onClick={handleInsert} class="" required title="Save">
                  <i class="fa-solid fa-floppy-disk"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AccNameInput;
