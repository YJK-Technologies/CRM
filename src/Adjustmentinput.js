import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
const config = require('./Apiconfig');

function AdjustmentInput({ }) {
  const [transaction_date, settransaction_date] = useState("");
  const [transaction_type, settransaction_type] = useState("");
  const [transaction_no, settransaction_no] = useState("");
  const [item_code, setItem_code] = useState("");
  const [qty, setqty] = useState("");
  const [Transactiondrop, setTransactiondrop] = useState([]);
  const [selectedTransaction, setselectedTransaction] = useState('');
  const [itemcodedrop, setitemcodedrop] = useState([]);
  const [selecteditemcode, setselecteditemcode] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');
  const transactionDate = useRef(null);
  const Quantity = useRef(null);
  const Item = useRef(null);
  const Transaction = useRef(null);
  const transactionType = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')

  console.log(selectedRows);
 

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
      .then((val) => setTransactiondrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionTransaction = Transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChangetransaction = (selectedTransaction) => {
    setselectedTransaction(selectedTransaction);
    settransaction_type(selectedTransaction ? selectedTransaction.value : '');
  };

  const handleChangeitemcode = (selecteditemcode) => {
    setselecteditemcode(selecteditemcode);
    setItem_code(selecteditemcode ? selecteditemcode.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/itemcode`)
      .then((data) => data.json())
      .then((val) => setitemcodedrop(val));
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let startYear, endYear;
    if (currentMonth >= 4) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else {
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    const financialYearStartDate = new Date(startYear, 3, 1).toISOString().split('T')[0]; // April 1
    const financialYearEndDate = new Date(endYear, 2, 31).toISOString().split('T')[0]; // March 31

    setFinancialYearStart(financialYearStartDate);
    setFinancialYearEnd(financialYearEndDate);
  }, []);

  const filteredOptionitemcode = itemcodedrop.map((option) => ({
    value: option.Item_code,
    label: option.Item_code,
  }));

  const handleInsert = async () => {
    if (
      !transaction_type,
      !item_code
    ) {
      setError(" ");
      return;
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/addadjustment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),

          transaction_date,
          transaction_type,
          transaction_no,
          item_code,
          qty,
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
                           toast.warning(errorResponse.message)
                   
               } else {
                   console.error("Failed to insert data");
                   // Show generic error message using SweetAlert
                  toast.error('Failed to insert data')
               }
           } catch (error) {
               console.error("Error inserting data:", error);
               // Show error message using SweetAlert
             toast.error('Error inserting data: ' + error.message)
           }
         };

  const handleNavigate = () => {
    navigate("/Adjustment"); // Pass selectedRows as props to the Input component
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
    <div class="container-fluid Topnav-screen"  >
            <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      <div class=" ">
        <div class="col-md-12 text-center">
          <div>
           <div>
           <div className="shadow-lg p-1 bg-body-tertiary rounded ">
           <div class="d-flex justify-content-between">
           <div className="d-flex justify-content-start">
              <h1 align="left" class="purbut">Add Adjustment </h1>
            </div>
            <div className="d-flex justify-content-end">
               <button onClick={handleNavigate} className="btn purbut btn-danger pt-2 mt-2 mb-2 me-3" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
            </div>
           </div>
           <div className="mobileview">
                  <div class="d-flex justify-content-between">
                  <div className="d-flex justify-content-start"> 
                     <h1 className="h1 mt-3" style={{textAlign:"left"}}>Add Adjustment </h1>
                  </div>
                  <div className="d-flex justify-content-end">
               <button onClick={handleNavigate} className="btn btn-danger mt-4 mb-4 me-3" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
            </div>
                  </div>
                </div>
           </div>
          </div>
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
                    <label for="state" class="exp-form-labels">Transaction Date</label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>
                 <input
                  id="ucode"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the transaction date"
                  min={financialYearStart}
                  max={financialYearEnd}
                  value={transaction_date}
                  onChange={(e) => settransaction_date(e.target.value)}
                  maxLength={18}
                  ref={transactionDate}
                  onKeyDown={(e) => handleKeyDown(e, transactionType, transactionDate)}
                />
                {error && !transaction_date && <div className="text-danger">Transaction Date should not be blank</div>}
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">Transaction Type</label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>
                <Select
                  id="wcode"
                  value={selectedTransaction}
                  onChange={handleChangetransaction}
                  options={filteredOptionTransaction}
                  className="exp-input-field"
                  placeholder=""
                  required title="Please select a transaction type"
                  maxLength={250}
                  ref={transactionType}
                  onKeyDown={(e) => handleKeyDown(e, Transaction, transactionType)}
                />
                {error && !transaction_type && <div className="text-danger">Transaction Type should not be blank.</div>}
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">Transaction No</label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>
                <input
                  id="lname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the transaction no"
                  value={transaction_no}
                  onChange={(e) => settransaction_no(e.target.value)}
                  maxLength={10}
                  ref={Transaction}
                  onKeyDown={(e) => handleKeyDown(e, Item, Transaction)}
                />
                {error && !transaction_no && <div className="text-danger">Transaction No should not be blank.</div>}
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">Item Code</label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>
                <Select
                  id="wcode"
                  value={selecteditemcode}
                  onChange={handleChangeitemcode}
                  options={filteredOptionitemcode}
                  className="exp-input-field "
                  placeholder=""
                  required title="Please select a item code"
                  maxLength={18}
                  ref={Item}
                  onKeyDown={(e) => handleKeyDown(e, Quantity, Item)}
                />
                {error && !item_code && <div className="text-danger">Item Code should not be blank.</div>}
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">Quantity</label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>
                <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the quantity"
                  value={qty}
                  onChange={(e) => setqty(e.target.value)}
                  maxLength={6}
                  ref={Quantity}
                  onKeyDown={(e) => handleKeyDown}
                />
                {error && !qty && <div className="text-danger">Quantity should not be blank</div>}
              </div>
            </div>
            <div className="col-md-3 form-group  mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels"> Created By </label>
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
            </div>
            <div class="col-md-3 form-group  ">
                <button onClick={handleInsert} class="mt-4" required title="Save"> Save</button>
              </div>
          </div>
        </div>
        </div>
      </div>
      <script src="js/jquery.min.js"></script>
      <script src="js/bootstrap.min.js"></script>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    </div>
  );
}
export default AdjustmentInput;
