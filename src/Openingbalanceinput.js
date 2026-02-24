import React, { useState, useEffect,useRef} from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";

import Swal from "sweetalert2";import { useNavigate } from "react-router-dom";
import Select from 'react-select'
const config = require('./Apiconfig');

function OpeningbalanceInput({ open,handleClose }) {
  const [open2, setOpen2] = React.useState(false);
    const [transaction_date, settransaction_date] = useState("");
    const [transaction_type, settransaction_type] = useState("");
    const [transaction_no, settransaction_no] = useState("");
    const [acct_code, setacct_code] = useState("");
    const [journal_no, setjournal_no] = useState("");
    const [debit, setdebit] = useState(0);
    const [credit, setcredit] = useState(0);
    const [Transactiondrop, setTransactiondrop] = useState([]);
    const [selectedTransaction, setselectedTransaction] = useState('');
   /*const [created_by, setCreated_by] = useState("");
  const [created_date, setCreated_date] = useState("");
  const [modfied_by, setModified_by] = useState("");
  const [modfied_date, setModified_date] = useState("");*/
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const Credit= useRef(null)
  const Debit = useRef(null)
  const Journal = useRef(null)
  const Account = useRef(null)
  const TransactionNo = useRef(null)
  const Transaction = useRef(null)
  const TransactionDATE = useRef(null)
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
      .then((val) => setTransactiondrop(val));
  }, []);

  const filteredOptionTransaction = Transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  
  const handleChangetransaction = (selectedTransaction) => {
    setselectedTransaction(selectedTransaction);
    settransaction_type(selectedTransaction? selectedTransaction.value : '');
    setError(false);
  };
  const handleInsert = async () => { if (
    !transaction_type
) {
    setError(" ");
    return;
}
    try {
      const response = await fetch(`${config.apiBaseUrl}/addopenbalance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          transaction_date,	    
          transaction_type,	    
          transaction_no,		    
          acct_code,	
          journal_no,    
          debit,
          credit,     
          created_by: sessionStorage.getItem('selectedUserCode')
     
           /* created_by,
          created_date,
          modfied_by,
          modfied_date,*/
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          Swal.fire({
            title: "Success",
            text: "Data inserted successfully!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
        }, 1000);



      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        //setError(errorResponse.error);
        Swal.fire({
          title: 'Error!',
          text: errorResponse.message,
          icon: 'error',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to insert data',
          icon: 'error',
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert
      Swal.fire({
        title: 'Error!',
        text: 'Error inserting data: ' + error.message,
        icon: 'error',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  };
const handleNavigate = () => {
  navigate("/OpeningBalance")  ; // Pass selectedRows as props to the Input component
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
  <div class="row ">
    <div class="col-md-12 text-center">
      <div>
       <div>
       <div className="shadow-lg p-1 bg-body-tertiary rounded ">
         <div class="d-flex justify-content-between">
         <div className="d-flex justify-content-start">
            <h1 align="left" class="purbut">
      Add Opening balance
      </h1>
            </div>
            <div className="d-flex justify-content-end ">
               <button onClick={handleNavigate} className="btn purbut btn-danger pt-2 mt-2 mb-2 me-3" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
            </div>
           </div>
           <div className="mobileview">
            
                  <div class="d-flex justify-content-between">

                  <div className="d-flex justify-content-start pt-3"> 
                     <h1 align="left" className="h1"> 
       Add Opening Balance 
       </h1>
                  </div>
                  <div className="d-flex justify-content-end pt-4 pb-5">
               <button onClick={handleNavigate} className="btn btn-danger me-3" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
            </div>  
                  </div>
                </div>
           </div>
          </div>
        </div>


          {error && <div className="error">{error}</div>}
          <div class="pt-2 mb-4">  

          <div className="shadow-lg p-1 bg-body-tertiary rounded pt-3 pb-3">
          <div className="row ms-3 me-3">
          <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Transaction Date
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please enter the transaction date"
                  value={transaction_date}
                  onChange={(e) => settransaction_date
                  (e.target.value)}
                  maxLength={20}
                  ref={TransactionDATE}
                  onKeyDown={(e) => handleKeyDown(e, Transaction, TransactionDATE)}
                />{error && !transaction_date && <div className="text-danger">Transaction Date should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
            <div class="exp-form-floating">
            <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Transaction Type
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div>
              <Select
                id="status"
                value={selectedTransaction}
                onChange={handleChangetransaction}
                options={filteredOptionTransaction}
                className="exp-input-field"
                placeholder=""
                required title="Please select a Transaction type"
                maxLength={250}
                ref={Transaction}
                onKeyDown={(e) => handleKeyDown(e, TransactionNo, Transaction)}
              /> {error && !transaction_type && <div className="text-danger">Transaction Type should not be blank</div>}
            </div>
          </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Transaction No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the transaction number"
                  value={transaction_no}
                  onChange={(e) => settransaction_no
                  (e.target.value)}
                  maxLength={10}
                  ref={TransactionNo}
                  onKeyDown={(e) => handleKeyDown(e, Account, TransactionNo)}
                />{error && !transaction_no && <div className="text-danger">Transaction No should not be blank</div>}

               
              </div>
            </div>
             <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Account Code
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the account code"
                  value={acct_code}
                  onChange={(e) => setacct_code
                  (e.target.value)}
                  maxLength={10}
                  ref={Account}
                  onKeyDown={(e) => handleKeyDown(e, Journal, Account)}
                />{error && !acct_code && <div className="text-danger">Account Code should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Journal No
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the journal number"
                  value={journal_no}
                  onChange={(e) => setjournal_no
                  (e.target.value)}
                  maxLength={25}
                  ref={Journal}
                  onKeyDown={(e) => handleKeyDown(e, Debit, Journal)}
                />{error && !journal_no && <div className="text-danger">Journal No should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Debit
                  
                </label>
                </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the debit amount"
                  value={debit}
                  onChange={(e) => setdebit
                  (e.target.value)}
                  maxLength={50}
                  ref={Debit}
                  onKeyDown={(e) => handleKeyDown(e, Credit, Debit)}
                />

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Credit
                  
                </label>
                </div>
                </div><input
                  id="acc"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the credit amount"
                  value={credit}
                  onChange={(e) => setcredit
                  (e.target.value)}
                  maxLength={50}
                  ref={Credit}
                  onKeyDown={(e) => handleKeyDown}
                />

               
              </div>
            </div>
        
             <div className="col-md-3 form-group  mb-2">
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
          </div>
          <div class="col-md-3 form-group  d-flex justify-content-start">
                <button onClick={handleInsert} class="mt-4" required title="Save"> Save</button>
              </div>
          </div>
        </div>
        </div>
      </div>

    </div>
    </div>
  );
}
export default OpeningbalanceInput;