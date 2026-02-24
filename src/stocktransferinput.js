import React, { useState, useEffect } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";

import Swal from "sweetalert2";import { useNavigate } from "react-router-dom";
import Select from 'react-select'
const config = require('./Apiconfig');

function StocktransferInput({  }) {
    const [transaction_date, settransaction_date] = useState("");
    const [transaction_type, settransaction_type] = useState("");
    const [transaction_no, settransaction_no] = useState("");
    const [item_code, setItem_code] = useState("");
    const [transfer_Qty, settransfer_Qty] = useState("");
    const [from_Warehouse, setfrom_Warehouse] = useState("");
    const [to_Warehouse, setto_Warehouse] = useState("");
    const [Transactiondrop, setTransactiondrop] = useState([]);
    const [selectedTransaction, setselectedTransaction] = useState('');
    const [itemcodedrop, setitemcodedrop] = useState([]);
    const [selecteditemcode, setselecteditemcode] = useState('');
   const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');

  console.log(selectedRows);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/Transaction`)
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
  };
  
  const handleChangeitemcode = (selecteditemcode) => {
      setselecteditemcode(selecteditemcode);
      setItem_code(selecteditemcode? selecteditemcode.value : '');
  };
  
  useEffect(() => {
      fetch(`${config.apiBaseUrl}/itemcode`)
        .then((data) => data.json())
        .then((val) => setitemcodedrop(val));
    }, []);
    
    const filteredOptionitemcode = itemcodedrop.map((option) => ({
      value: option.Item_code,
      label: option.Item_code,
    }));
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
  const handleInsert = async () => { if (
    !transaction_type,
    !item_code
) {
    setError(" ");
    return;
}
    try {
      const response = await fetch(`${config.apiBaseUrl}/addstocktransfer`, {
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
            transfer_Qty, 
            from_Warehouse,
            to_Warehouse,  
            created_by: sessionStorage.getItem('selectedUserCode')

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
          confirmButtonText: 'OK'
        });
      } else {
        console.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };
 
 
  const handleNavigate = () => {
    navigate("/StockTransfer")  ; // Pass selectedRows as props to the Input component
  };

  
  return (
    <div class="container-fluid" >
      

      <div class="row justify-content-center">
        <div class="col-md-12 text-center">
        <div >
  <div class="d-flex justify-content-between" className="head">

    <div><h1 align="left" class="" >
      Add Stock Transfer
    </h1></div>




    <div class="d-flex justify-content-end mb-2 me-3">
      <div class="mt-3 ">
        <button onClick={handleInsert} class="saveinbtn" required title="Save"><i class="fa-regular fa-floppy-disk"></i></button>
      </div>
      <div className="mt-3"><button onClick={handleNavigate} class="closebtn" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
      </div></div>

  </div>



</div>



      

          {error && <div className=" intenal server error">{error}</div>}
        </div>
        <div class="exp-form container mt-2">
        <div class="exp-form container mt-2">
          <div className="row p-0">
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
                />            {error && !transaction_date && <div className="text-danger">Transaction Date should not be blank</div>}

              
              </div>
            </div>
            
           
            <div className="col-md-3 form-group">
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
                      />
                    {error && !transaction_type && <div className="text-danger">Transaction Type should not be blank</div>}
              </div>
            </div>
          </div>
          </div>


 
          <div class="exp-form container mt-2">
          <div className="row p-0">
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
                />            {error && !transaction_no && <div className="text-danger">Last Name should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="tcode" class="exp-form-labels">
               Item Code
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
                      value={selecteditemcode}
                      onChange={handleChangeitemcode}
                      options={filteredOptionitemcode}
                      className="exp-input-field"
                      placeholder=""
                      required title="Please select a item code"
                      maxLength={18}
                      />
                     {error && !item_code && <div className="text-danger">Item Code should not be blank</div>}
                
              </div>
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   Transfer Quantity
                  
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
                  required title="Please enter the transfer quantity"
                  value={transfer_Qty}
                  onChange={(e) => settransfer_Qty(e.target.value)}
                  maxLength={50}
                />            {error && !transfer_Qty && <div className="text-danger">Transfer Quantity should not be blank</div>}

               
              </div>
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                  From Warehouse
                  
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
                  required title="Please enter the From warehouse"
                  value={from_Warehouse}
                  onChange={(e) => setfrom_Warehouse(e.target.value)}
                  maxLength={50}
                />            
        {error && !from_Warehouse && <div className="text-danger">From Warehouse should not be blank</div>}
               
              </div>
            </div>
            <div className="col-md-4 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                <div>
                   <label for="state" class="exp-form-labels">
                   To Warehouse
                  
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
                  required title="Please enter the To warehouse"
                  value={to_Warehouse}
                  onChange={(e) => setto_Warehouse(e.target.value)}
                  maxLength={50}
                />            {error && !to_Warehouse && <div className="text-danger">To Warehouse should not be blank</div>}

               
              </div>
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
export default StocktransferInput;
