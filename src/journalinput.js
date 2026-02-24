import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
const config = require('./Apiconfig');

function JournalInput({ open,handleClose }) {
    const [transaction_date, settransaction_date] = useState("");
    const [transaction_type, settransaction_type] = useState("");
    const [transaction_no, settransaction_no] = useState("");
    const [journal_no, setjournal_no] = useState("");
    const [original_accountcode, setoriginal_accountcode] = useState("");
    const [contra_accountCode, setcontra_accountCode] = useState("");
    const [journal_amount, setjournal_amount] = useState("");
    const [narration1, setnarration1] = useState("");
    const [narration2, setnarration2] = useState("");
    const [narration3, setnarration3] = useState("");
    const [narration4, setnarration4] = useState("");
    const [Transactiondrop, setTransactiondrop] = useState([]);
    const [selectedTransaction, setselectedTransaction] = useState('');
    // const [itemcodedrop, setitemcodedrop] = useState([]);
    const [selecteditemcode, setselecteditemcode] = useState('');
   const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');
  const TransactionNo = useRef(null)
  const TransactionDate = useRef(null)
  const TransactionType = useRef(null)
  const JournalNo = useRef(null)
  const Original = useRef(null)
  const Contra = useRef(null)
  const Amount = useRef(null)
  const Narration1 = useRef(null)
  const Narration2 = useRef(null)
  const Narration3 = useRef(null)
  const Narration4 = useRef(null)
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')

  console.log(selectedRows);
   useEffect(() => {
      const companyCode = sessionStorage.getItem('selectedCompanyCode');
  
      fetch(`${config.apiBaseUrl}/Transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
        }),
      })
            .then((response) => response.json())
        .then((data) => setTransactiondrop(data))
        .catch((error) => console.error("Error fetching purchase types:", error));
    }, []);
  
  const filteredOptionTransaction = Transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));
  
  
  const handleChangetransaction = (selectedTransaction) => {
      setselectedTransaction(selectedTransaction);
      settransaction_type(selectedTransaction? selectedTransaction.value : '');
  };
  
//   const handleChangeitemcode = (selecteditemcode) => {
//       setselecteditemcode(selecteditemcode);
//       setItem_code(selecteditemcode? selecteditemcode.value : '');
//   };
  
//   useEffect(() => {
//       fetch(`${config.apiBaseUrl}/itemcode`)
//         .then((data) => data.json())
//         .then((val) => setitemcodedrop(val));
//     }, []);
    
//     const filteredOptionitemcode = itemcodedrop.map((option) => ({
//       value: option.Item_code,
//       label: option.Item_code,
//     }));
    
  const handleInsert = async () => { if (
    !transaction_type
   
) {
    setError(" ");
    return;
}
    try {
      const response = await fetch(`${config.apiBaseUrl}/addjournal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),

            transaction_date,	    
            transaction_type,	    
            transaction_no,	
            journal_no,	    
            original_accountcode,	
            contra_accountCode, 
            journal_amount,
            narration1,
            narration2,
            narration3,
            narration4, 
            created_by: sessionStorage.getItem('selectedUserCode')

           }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
  
            toast.success("Data Inserted Successfully").then(() => {
                window.location.reload();
            });
        }, 1000);
    
    
        
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        //setError(errorResponse.error);
        
        toast.error(errorResponse.message)
      } else {
        console.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };
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
 
  const handleNavigate = () => {
    navigate("/Journal")  ; // Pass selectedRows as props to the Input component
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
    <div class="container-fluid Topnav-screen">
            <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      
  <div class="row ">
  <div class="col-md-12 text-center" >

        <div className="shadow-lg p-1 bg-body-tertiary rounded ">
  <div class="d-flex justify-content-between" >

  <div className="d-flex justify-content-start">
    <h1 align="left" class=" purbut" >Add Journal</h1>
    </div>
              <div className="d-flex justify-content-end ms-5">
    <button onClick={handleNavigate} className="btn purbut btn-danger mt-2 mb-2 me-3 ms-5" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
    </div>
            
  </div>
  <div className="mobileview">
    <div class="d-flex justify-content-between">
    <div class="d-flex justify-content-start">
    <h1  align="left" className="h1">      
    Add Journal               
     </h1>  </div>
     <div className="d-flex justify-content-end me-3">
    <button onClick={handleNavigate} className="btn btn-danger mt-2 mb-2 me-3 ms-5" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
    </div>
    </div>
    </div>


  </div>

</div>



      

          {error && <div className=" intenal server error">{error}</div>}
        
          <div class="pt-2 mb-4"> 
          <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
          <div className="row ">
            <div className="col-md-4  form-group">
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
                </div> <input
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
                  ref={TransactionDate}
                  onKeyDown={(e) => handleKeyDown(e, TransactionType, TransactionDate)}
                />            {error && !transaction_date && <div className="text-danger">Transaction Date should not be blank</div>}

              
              </div>
            </div>
            
           
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
                <label for="tcode" class="exp-form-labels">
                Transaction Type
                </label>
                {/*<input
                    id="wcode"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please fill the screen type here"
                    value={Screen_Type}
                    onChange={(e) => setScreen_Type(e.target.value)}
                    />*/}
                     <Select
                      id="wcode"
                      value={selectedTransaction}
                      onChange={handleChangetransaction}
                      options={filteredOptionTransaction}
                      className="exp-input-field"
                      placeholder=""
                      required title="Please select a transaction type"
                      maxLength={250}
                      ref={TransactionType}
                      onKeyDown={(e) => handleKeyDown(e, TransactionNo, TransactionType)}
                      />
                    {error && !transaction_type && <div className="text-danger">Transaction Type should not be blank.</div>}
              </div>
            </div>
          


 
         
            <div className="col-md-4 form-group">
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
                  id="lname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the transaction no"
                  value={transaction_no}
                  onChange={(e) => settransaction_no(e.target.value)}
                  maxLength={10}
                  ref={TransactionNo}
                  onKeyDown={(e) => handleKeyDown(e, JournalNo, TransactionNo)}
                />            {error && !transaction_no && <div className="text-danger">Last Name should not be blank.</div>}

               
              </div>
            </div>
        
            <div className="col-md-4 form-group">
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
                </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the journal number"
                  value={journal_no}
                  onChange={(e) => setjournal_no(e.target.value)}
                  maxLength={25}
                  ref={JournalNo}
                  onKeyDown={(e) => handleKeyDown(e, Original, JournalNo)}
                />            {error && !journal_no && <div className="text-danger">Journal No should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Original Account Code
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the original account code"
                  value={original_accountcode}
                  onChange={(e) => setoriginal_accountcode(e.target.value)}
                  maxLength={25}
                  ref={Original}
                  onKeyDown={(e) => handleKeyDown(e, Contra, Original)}
                />            
        {error && !original_accountcode && <div className="text-danger">Original Account Code should not be blank</div>}
               
              </div>
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Contra Account Code
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the contra account code"
                  value={contra_accountCode}
                  onChange={(e) => setcontra_accountCode(e.target.value)}
                  maxLength={25}
                  ref={Contra}
                  onKeyDown={(e) => handleKeyDown(e, Amount, Contra)}
                />            {error && !contra_accountCode && <div className="text-danger">Contra Account Code should not be blank</div>}

               
              </div>
              
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                 Amount
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the journal amount"
                  value={journal_amount}
                  onChange={(e) => setjournal_amount(e.target.value)}
                  maxLength={50}
                />            {error && !journal_amount && <div className="text-danger">Contra Account Code should not be blank</div>}

               
              </div>
              
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Narration1
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Narration"
                  value={narration1}
                  onChange={(e) => setnarration1(e.target.value)}
                  maxLength={255}
                  ref={Narration1}
                  onKeyDown={(e) => handleKeyDown(e, Narration2, Narration1)}
                />            {error && !narration1 && <div className="text-danger">Narration should not be blank</div>}

               
              </div>
              
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Narration2
                  
                </label>
                </div>
                <div>
                  <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the Narration"
                  value={narration2}
                  onChange={(e) => setnarration2(e.target.value)}
                  maxLength={255}
                  ref={Narration2}
                  onKeyDown={(e) => handleKeyDown(e, Narration3, Narration2)}
                />            {error && !narration2 && <div className="text-danger">Narration should not be blank</div>}

               
              </div>
              
            </div>
           
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Narration3
                  
                </label>
                </div>
               </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the narration"
                  value={narration3}
                  onChange={(e) => setnarration3(e.target.value)}
                  maxLength={255}
                  ref={Narration3}
                  onKeyDown={(e) => handleKeyDown(e, Narration4, Narration3)}
                />           
               
              </div>
              
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Narration4
                  
                </label>
                </div>
               </div> <input
                  id="uname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the narration"
                  value={narration4}
                  onChange={(e) => setnarration4(e.target.value)}
                  maxLength={255}
                ref={Narration4}
                onKeyDown={(e) => handleKeyDown}
                />          
               
              </div>
              
            </div>
            <div className="col-md-2 form-group  mb-2">
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
          <div class="col-md-3 form-group  ">
                    <button onClick={handleInsert} class="mt-4" required title="Save"> Save</button>
                  </div>
          </div>
</div>
</div>
    </div>
    </div>
  
    

    
  );
}
export default JournalInput;
