import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import TaxHdrInputPopup from "./TaxHdrInput.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';



function TaxDetInput({ }) {
  const [open2, setOpen2] = React.useState(false);
  const navigate = useNavigate();
  const [tax_type_header, settax_type_header] = useState("");
  const [tax_name_details, settax_name_details] = useState("");
  const [tax_percentage, settax_percentage] = useState(0);
  const [tax_shortname, settax_shortname] = useState("");
  const [tax_accountcode, settax_accountcode] = useState("");
  const [transaction_type, settransaction_type] = useState("");
  const [status, setStatus] = useState("");
  const [taxtypedrop, settaxtypedrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [transactiondrop, setTransactiondrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedTax, setSelectedTax] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const config = require('./Apiconfig');
  const taxtypehdr = useRef(null);
  const taxnamedet = useRef(null);
  const taxper = useRef(null);
  const shortname = useRef(null);
  const taxaccounttype = useRef(null);
  const transactiontype = useRef(null);
  const StatuS = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')

  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  console.log(selectedRow);

  const clearInputFields = () => {
    setSelectedTax("");
    setSelectedTransaction("");
    setSelectedStatus("");
    settax_name_details("");
    settax_percentage("");
    settax_shortname("");
    settax_accountcode("");
    settax_type_header("");
    settransaction_type("");
    setStatus("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setSelectedTax({
        label: selectedRow.tax_type_header,
        value: selectedRow.tax_type_header,
      });
      settax_type_header(selectedRow.tax_type_header || "")
      setSelectedTransaction({
        label: selectedRow.transaction_type,
        value: selectedRow.transaction_type,
      });
      settransaction_type(selectedRow.transaction_type || "")
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
      setStatus(selectedRow.status || "")
      settax_name_details(selectedRow.tax_name_details || "");
      settax_percentage(selectedRow.tax_percentage || "");
      settax_shortname(selectedRow.tax_shortname || "");
      settax_accountcode(selectedRow.tax_accountcode || "");

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/taxtype`)
  //     .then((data) => data.json())
  //     .then((val) => settaxtypedrop(val));
  // }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/taxtype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(settaxtypedrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
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
      .then((val) => setStatusdrop(val));
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



  const filteredOptionTax = taxtypedrop.map((option) => ({
    value: option.tax_type,
    label: option.tax_type,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionTransaction = transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeTax = (selectedTax) => {
    setSelectedTax(selectedTax);
    settax_type_header(selectedTax ? selectedTax.value : '');

  };


  const handleChangeTransaction = (selectedTransaction) => {
    setSelectedTransaction(selectedTransaction);
    settransaction_type(selectedTransaction ? selectedTransaction.value : '');

  };

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');

  };


  const handleNavigateToForm = () => {
    navigate("/AddTaxHeader", { selectedRows }); // Pass selectedRows as props to the Input component
  };
  const handleNavigate = () => {
    navigate("/Tax", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const handleInsert = async () => {
    if (
      !tax_type_header ||
      !tax_name_details ||
      !tax_percentage ||
      !transaction_type ||
      !tax_shortname ||
      !tax_accountcode ||
      !transaction_type ||
      !status

    ) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);
    //   if (validateInputs()) {
    try {
      const response = await fetch(`${config.apiBaseUrl}/addTaxDetailsData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          tax_type_header,
          tax_name_details,
          tax_percentage,
          tax_shortname,
          tax_accountcode,
          transaction_type,
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
      !tax_type_header ||
      !tax_name_details ||
      !tax_percentage ||
      !transaction_type ||
      !tax_shortname ||
      !tax_accountcode ||
      !transaction_type ||
      !status

    ) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/TaxUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tax_type_header: selectedTax.value,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          tax_name_details,
          tax_percentage,
          tax_shortname,
          tax_accountcode,
          transaction_type: selectedTransaction.value,
          status: selectedStatus.value,
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
    }
    finally {
      setLoading(false);
    }
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
          <div className="shadow-lg p-0 bg-body-tertiary rounded ">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut"> {mode === "update" ? 'Update Tax Details' : ' Add Tax Details'}</h1>
              <h1 align="left" class="fs-4 mobileview"> {mode === "update" ? 'Update Tax Details' : ' Add Tax Details'}</h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

          </div>

          <div class="pt-2 mb-4">

            <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
              <div class="row">
                <div className="col-md-3 form-group mb-1">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels">
                          Tax Type Header
                        </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div>
                    <div className="input-group" title="Select the Tax Type Header">
                      <Select
                        id="taxdettype"
                        value={selectedTax}
                        onChange={handleChangeTax}
                        options={filteredOptionTax}
                        className="srcinput exp-input-field"
                        placeholder=""
                        maxLength={18}
                        ref={taxtypehdr}
                        readOnly={mode === "update"}
                        isDisabled={mode === "update"}
                        onKeyDown={(e) => handleKeyDown(e, taxnamedet, taxtypehdr)}
                      />
                      {mode !== "update" && (<button onClick={handleClickOpen} class="taxhdrcode position-absolute pt-2 me-5" required title="Add Header"><i class="fa-solid fa-plus"></i></button>)}
                    </div>
                    {error && !tax_type_header && <div className="text-danger">Tax Type should not be blank</div>}



                  </div>
                </div>



                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Tax Name Detail
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div> <input
                      id="taxdetname"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the tax name detail"
                      value={tax_name_details}
                      onChange={(e) => settax_name_details(e.target.value)}
                      maxLength={250}
                      ref={taxnamedet}
                      readOnly={mode === "update"}
                      onKeyDown={(e) => handleKeyDown(e, taxper, taxnamedet)}
                    />            {error && !tax_name_details && <div className="text-danger">Tax Name should not be blank</div>}


                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Tax Percentage
                      </label></div>
                      <div> <span className="text-danger">*</span></div>
                    </div> <input
                      id="taxdetper"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the tax percentage"
                      value={tax_percentage}
                      onChange={(e) => settax_percentage(e.target.value)}
                      maxLength={50}
                      ref={taxper}
                      onKeyDown={(e) => handleKeyDown(e, shortname, taxper)}
                    />            {error && !tax_percentage && <div className="text-danger">Tax Percentage should not be blank</div>}


                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <label for="taxshortname" class="exp-form-labels">
                      Short Name
                    </label> 
                     <div> <span className="text-danger">*</span></div>
                    </div><input
                      id="taxshortname"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the short name"
                      value={tax_shortname}
                      onChange={(e) => settax_shortname(e.target.value)}
                      maxLength={250}
                      ref={shortname}
                      onKeyDown={(e) => handleKeyDown(e, taxaccounttype, shortname)}
                    /> {error && !tax_shortname && <div className="text-danger">Short Name should not be blank</div>}

                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="rid" class="exp-form-labels">
                        Tax Account Code
                      </label></div>
                    </div><input
                      id="taxcode"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the tax account code"
                      value={tax_accountcode}
                      onChange={(e) => settax_accountcode(e.target.value)}
                      maxLength={9}
                      ref={taxaccounttype}
                      readOnly={mode === "update"}
                      onKeyDown={(e) => handleKeyDown(e, transactiontype, taxaccounttype)}
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
                      <div title="Select the Transaction Type">
                    <Select
                      id="transtype"
                      value={selectedTransaction}
                      onChange={handleChangeTransaction}
                      options={filteredOptionTransaction}
                      className="exp-input-field"
                      placeholder=""
                      maxLength={250}
                      ref={transactiontype}
                      onKeyDown={(e) => handleKeyDown(e, StatuS, transactiontype)}
                    />
                    {error && !transaction_type && <div className="text-danger">Tax Transaction Type should not be blank</div>}
</div>
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
                     <div title="Select the Status">
                    <Select
                      id="status"
                      value={selectedStatus}
                      onChange={handleChangeStatus}
                      options={filteredOptionStatus}
                      className="exp-input-field"
                      placeholder=""
                      maxLength={18}
                      ref={StatuS}
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
                    {error && !status && <div className="text-danger">Status should not be blank</div>}
</div>

                  </div>
                </div>
                <div class="col-md-3 form-group ">
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
                <div>
                  <TaxHdrInputPopup open={open2} handleClose={handleClose} />
                </div>


              </div>
            </div>
          </div>


        </div>
      </div>

    </div>
  );
}
export default TaxDetInput;