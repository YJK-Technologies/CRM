import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import './SideBar.css'
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';


function TaxHdrInput({ open, handleClose }) {
  const navigate = useNavigate();
  const [tax_type, settax_type] = useState("");
  const [tax_name, settax_name] = useState("");
  const [tax_percentage, settax_percentage] = useState(0);
  const [tax_shortname, settax_shortname] = useState("");
  const [tax_accountcode, settax_accountcode] = useState("");
  const [transaction_type, settransaction_type] = useState("");
  const [status, setStatus] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [transactiondrop, setTransactiondrop] = useState([]);
  /*const [created_by, setCreated_by] = useState("");
  const [created_date, setCreated_date] = useState("");
  const [modfied_by, setModified_by] = useState("");
  const [modfied_date, setModified_date] = useState("");*/
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedtaxtype, setselectedtaxtype] = useState('');
  const [tax_type_Sales, settax_type_Sales] = useState('');
  const [taxtypedrop, settaxtypedrop] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const config = require('./Apiconfig');
  const [loading, setLoading] = useState(false);
  const Type = useRef(null);
  const Name = useRef(null);
  const shortName = useRef(null);
  const percentage = useRef(null);
  const accountCode = useRef(null);
  const transactionType = useRef(null);
  const taxOfType = useRef(null);
  const Status = useRef(null);
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
      .then((val) => setStatusdrop(val));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getOverallTAX`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => settaxtypedrop(val));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTransactiondrop(val));
  }, []);


  const filteredOptionTransaction = transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));



  const filteredOptionTaxtype = Array.isArray(taxtypedrop)
    ? taxtypedrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name, // Concatenate ApprovedBy and EmployeeId with ' - '
    }))
    : [];

  const handleChangeTransaction = (selectedTransaction) => {
    setSelectedTransaction(selectedTransaction);
    settransaction_type(selectedTransaction ? selectedTransaction.value : '');

  };


  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');

  };

  const handleChangeTaxtype = (selectedStatus) => {
    setselectedtaxtype(selectedStatus);
    settax_type_Sales(selectedStatus ? selectedStatus.value : '');

  };


  const handleInsert = async () => {
    if (
      !tax_type ||
      !tax_name ||
      !tax_percentage ||
      !transaction_type ||
      !tax_type_Sales ||
      !status
    ) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);
    //   if (validateInputs()) {
    try {
      const response = await fetch(`${config.apiBaseUrl}/addTaxHdrData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          tax_type,
          tax_name,
          tax_percentage,
          tax_shortname,
          tax_accountcode,
          transaction_type,
          status,
          tax_type_Sales,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ tax_acc_code }] = searchData;
        settax_accountcode(tax_acc_code);


        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        //setError(errorResponse.error);
        toast.error('Error inserting data: ' + errorResponse.message);
      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        toast.error('Fail to Insert Data');
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }

  };
  const handleNavigate = () => {
    navigate("/AddTaxDetails"); // Pass selectedRows as props to the Input component
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
    <div >
      {open && (
        <fieldset>
          <div className="purbut">
            {loading && <LoadingScreen />}
            <div className="purbut modal popupadj popup mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl p-3" role="document">
                <div className="modal-content">
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <div className="p-0 bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between" >
                          <h1 align="left" className="purbut">Add Tax Hdr</h1>
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
                  </div>
                  <div class=" ">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Type
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div> <input
                            id="taxtype"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the tax type"
                            value={tax_type}
                            onChange={(e) => settax_type(e.target.value)}
                            maxLength={18}
                            ref={Type}
                            onKeyDown={(e) => handleKeyDown(e, Name, Type)}
                          />            {error && !tax_type && <div className="text-danger">Tax Type should not be blank</div>}


                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Name
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div><input
                            id="taxname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the tax name"
                            value={tax_name}
                            onChange={(e) => settax_name(e.target.value)}
                            maxLength={250}
                            ref={Name}
                            onKeyDown={(e) => handleKeyDown(e, shortName, Name)}
                          />            {error && !tax_name && <div className="text-danger">Tax Name should not be blank</div>}


                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <label for="taxshortname" class="exp-form-labels">
                            Short Name
                          </label><input
                            id="taxshortname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the short name"
                            value={tax_shortname}
                            onChange={(e) => settax_shortname(e.target.value)}
                            ref={shortName}
                            onKeyDown={(e) => handleKeyDown(e, percentage, shortName)}
                          />

                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Percentage
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div><input
                            id="taxpercent"
                            class="exp-input-field form-control"
                            type="number"
                            placeholder=""
                            required title="Please enter the tax percentage"
                            value={tax_percentage}
                            onChange={(e) => settax_percentage(e.target.value)}
                            maxLength={50}
                            ref={percentage}
                            onKeyDown={(e) => handleKeyDown(e, accountCode, percentage)}
                          />            {error && !tax_percentage && <div className="text-danger">Tax Percentage  should not be blank</div>}


                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Account Code
                            </label></div>
                          </div> <input
                            id="taxcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the tax account code"
                            value={tax_accountcode}
                            onChange={(e) => settax_accountcode(e.target.value)}
                            maxLength={9}
                            ref={accountCode}
                            onKeyDown={(e) => handleKeyDown(e, transactionType, accountCode)}
                          />
                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Transaction Type
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div>
                          {/* <select
                  name="taxtransaction"
                  id="taxtransaction"
                  className="exp-input-field form-control"
                  placeholder="Select transaction type"
                 required title="Please select a transaction type"
                  value={transaction_type}
                  onChange={(e) => settransaction_type(e.target.value)}
                    
                >
                  <option value=""></option>
                  {transactiondrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>           */}
                          <Select
                            id="taxtransaction"
                            value={selectedTransaction}
                            onChange={handleChangeTransaction}
                            options={filteredOptionTransaction}
                            className="exp-input-field"
                            placeholder=""
                            maxLength={250}
                            ref={transactionType}
                            onKeyDown={(e) => handleKeyDown(e, taxOfType, transactionType)}
                          />
                          {error && !transaction_type && <div className="text-danger">Tax Transaction Type should not be blank</div>}

                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">

                          <div><label for="rid" class="exp-form-labels">
                            Types of Tax <div> <span className="text-danger">*</span></div>
                          </label></div>

                        </div>
                        <Select
                          id="status"
                          value={selectedtaxtype}
                          onChange={handleChangeTaxtype}
                          options={filteredOptionTaxtype}
                          className="exp-input-field"
                          placeholder=""
                          maxLength={18}
                          ref={taxOfType}
                          onKeyDown={(e) => handleKeyDown(e, Status, taxOfType)}
                        />
                        {error && !tax_type_Sales && <div className="text-danger">Tax Type  should not be blank</div>}
                      </div>
                      <div className="col-md-3 form-group mb-2">
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
                            maxLength={18}
                            ref={Status}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleInsert();
                              }
                            }}
                          />
                          {error && !status && <div className="text-danger">Status should not be blank</div>}



                        </div>

                      </div>
                    </div>
                    <div class="col-md-12 form-group  mb-2 ">
                      <button onClick={handleInsert} class=" ms-4" required title="Save"> <i class="fa-solid fa-floppy-disk"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mobileview">
            <div className="purbut modal mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <div class="mb-0 rounded-0 d-flex justify-content-between">
                        <div className="mb-0 d-flex justify-content-start">
                          <h1 className="h1">Add Tax Hdr</h1>
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
                  </div>
                  <div class=" ">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Type
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div> <input
                            id="taxtype"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the tax type"
                            value={tax_type}
                            onChange={(e) => settax_type(e.target.value)}
                            maxLength={18}
                          />            {error && !tax_type && <div className="text-danger">Tax Type should not be blank</div>}


                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Name
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div><input
                            id="taxname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the tax name"
                            value={tax_name}
                            onChange={(e) => settax_name(e.target.value)}
                            maxLength={250}
                          />            {error && !tax_name && <div className="text-danger">Tax Name should not be blank</div>}


                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <label for="taxshortname" class="exp-form-labels">
                            Short Name
                          </label><input
                            id="taxshortname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the short name"
                            value={tax_shortname}
                            onChange={(e) => settax_shortname(e.target.value)}
                          />

                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Percentage
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div><input
                            id="taxpercent"
                            class="exp-input-field form-control"
                            type="number"
                            placeholder=""
                            required title="Please enter the tax percentage"
                            value={tax_percentage}
                            onChange={(e) => settax_percentage(e.target.value)}
                            maxLength={50}
                          />            {error && !tax_percentage && <div className="text-danger">Tax Percentage  should not be blank</div>}


                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Tax Account Code
                            </label></div>
                          </div> <input
                            id="taxcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required title="Please enter the tax account code"
                            value={tax_accountcode}
                            onChange={(e) => settax_accountcode(e.target.value)}
                            maxLength={9}
                          />
                        </div>
                      </div>

                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div><label for="rid" class="exp-form-labels">
                              Transaction Type
                            </label></div>
                            <div> <span className="text-danger">*</span></div>
                          </div>
                          {/* <select
                  name="taxtransaction"
                  id="taxtransaction"
                  className="exp-input-field form-control"
                  placeholder="Select transaction type"
                 required title="Please select a transaction type"
                  value={transaction_type}
                  onChange={(e) => settransaction_type(e.target.value)}
                    
                >
                  <option value=""></option>
                  {transactiondrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>           */}
                          <Select
                            id="taxtransaction"
                            value={selectedTransaction}
                            onChange={handleChangeTransaction}
                            options={filteredOptionTransaction}
                            className="exp-input-field"
                            placeholder=""
                            maxLength={250}
                          />
                          {error && !transaction_type && <div className="text-danger">Tax Transaction Type should not be blank</div>}

                        </div>
                      </div>
                      <div className="col-md-3 form-group mb-2">
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
                            maxLength={18}
                          />
                          {error && !status && <div className="text-danger">Status should not be blank</div>}


                        </div>

                      </div>
                      <div class="col-md-3 form-group  ">
                        <button onClick={handleInsert} class="mt-4" required title="Save"><i class="fa-solid fa-floppy-disk"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
export default TaxHdrInput;