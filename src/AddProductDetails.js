import React, { useState, useEffect,useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'

const config = require('./Apiconfig');

function ProductDetail({  }) {
  const [ProductCode, setProduct_Code] = useState("");
  const [itemCode, setitem_code] = useState("");
  const [item_name, setitem_name] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const navigate = useNavigate();
  const [Productdrop, setProductdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState('Cash');
  const [error, setError] = useState("");
  const [Productbrand, setProductbrand] = useState([]);
  const [ourbranddrop, setourbranddrop] = useState([]);
  const [Item_Our_Brand,setItem_Our_Brand]=useState("");
  const [quantity,setquantity]=useState("");
  const [tax,settax]=useState("");
  const [tot_amt ,settot_amt ]=useState("");
  const [description ,setdescription ]=useState("");
  const [Product_name ,setProduct_name ]=useState("");
  const productcode = useRef(null);
  const productname = useRef(null);
  const taxamt = useRef(null);
  const itemcode = useRef(null);
  const itemname = useRef(null);
  const totamt = useRef(null);
  const Description = useRef(null);
  const qtty = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')

    

  console.log(selectedRows);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getProductcode`)
      .then((data) => data.json())
      .then((val) => setProductdrop(val));
  }, []);


  const filteredOption= Productdrop.map((option) => ({
    value: option.Product_Code,
    label: option.Product_Code,
  }));


  const handleChangeHeader = (selectedHeader) => {
    setProduct_Code(selectedHeader);
    setProductbrand(selectedHeader ? selectedHeader.value : '');
    setError(false);
  };

 

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/itemcode`)  
      .then((data) => data.json())
      .then((val) => setourbranddrop(val));
  }, []);


  const filteredOptionBrand = ourbranddrop.map((option) => ({
    value: option.Item_code,
    label: option.Item_code,
  }));


  const handleChangeBrand = (selectedBrand) => {
    setitem_code(selectedBrand);
    setItem_Our_Brand(selectedBrand ? selectedBrand.value : '');
    setError(false);
  };


  const handleInsert = async () => {
    if (!ProductCode || !itemCode ||!item_name ) {
      setError(" ");
      return;
  }
    try {
      const response = await fetch(`${config.apiBaseUrl}/addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
           Product_Code:Productbrand, 
             item_code:Item_Our_Brand,
             item_name,
             quantity,
             tax,
             tot_amt,
             description,
             Product_name,

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

const handleNavigateToForm = () => {
  navigate("/AddProductHdr", { selectedRows }); // Pass selectedRows as props to the Input component
};
const handleNavigate = () => {
  navigate("/Product"); // Pass selectedRows as props to the Input component
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
    <div class="container-fluid" >
            <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      <div class="row justify-content-center">
        <div class="col-md-12 text-center">
           <div >
  <div class="d-flex justify-content-between" className="head">

    <div className="purbut"><h1 align="left" class="" >
      Add Product Detail
    </h1></div>

    <div className="mobileview">
      
      <div class="d-flex justify-content-between">
      <div className="" style={{marginRight:"90px", marginLeft:"100px",textAlign:"left"}}><h1  >
       Add Product Mapping
    </h1></div>
      
      
      <div className="mt-3">
        <button onClick={handleNavigate} class="closebtn" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
      </div>
      </div></div>   

<div className="purbut">


    <div class="d-flex justify-content-end mb-2 me-3">
      
      <div class="mt-3">
        <button onClick={handleInsert} class="saveinbtn" required title="Save"><i class="fa-regular fa-floppy-disk"></i></button>
      </div>
      <div className="mt-3"><button onClick={handleNavigate} class="closebtn" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
      </div>
      </div>

  </div></div>



</div>

</div>

        
        <div class="container-fluid mt-4 ">
          <div className="row p-0 ms-2">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">


                 <div class="d-flex justify-content-start">
                 <div>
                  <label for="rid" class="exp-form-labels">
                   Product Code
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                
                <Select
                id="HdrCode"
                value={ProductCode}
                onChange={handleChangeHeader}
                options={filteredOption}
                className="exp-input-field"
                placeholder=""
                ref={productcode}
                onKeyDown={(e) => handleKeyDown(e, productname, productcode)}
              />

                
                {error &&!ProductCode && <div className="text-danger"> Product Code should not be blank</div>}
                
                
              </div>
            </div>

            <div className="col-md-3 form-group ">
           <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Product Name
              </label>
              <div className="input-group">
              <input
                id="state"
                className="exp-input-field  position-relative"
                type="text"
                placeholder=""
                required title="Please fill the description here"
                value={Product_name }
                maxLength={250}
                onChange={(e) => setProduct_name(e.target.value)}
                ref={productname}
                onKeyDown={(e) => handleKeyDown(e, itemcode, productname)}
              /><button onClick={handleNavigateToForm} class="prohdrcode position-absolute me-5" required title="Add Header"><i class="fa-solid fa-plus"></i></button>
              </div>
              </div>
            </div>
           
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                Item code 
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><Select
                  id="adcode"
                  class="exp-input-field form-control"
                  placeholder=""
                  required title="Please enter the Item  Code  code"
                  value={itemCode}
                  options={filteredOptionBrand}
                  onChange={handleChangeBrand}
                  maxLength={18}
                  ref={itemcode}
                  onKeyDown={(e) => handleKeyDown(e, itemname, itemcode)}
                /> {error && !itemCode && <div className="text-danger">Item  Code should not be blank</div>}

                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                   Item  Name
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="adnames"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  value={item_name}
                  onChange={(e) => setitem_name(e.target.value)}
                  maxLength={250}
                  ref={itemname}
                  onKeyDown={(e) => handleKeyDown(e, qtty, itemname)}
                />{error && !item_name && <div className="text-danger">Item Name should not be blank</div>}

              </div>
            </div>

            <div className="col-md-3 form-group">
           <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Quantity
              </label><input
                id="state"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the description here"
                value={quantity}
                maxLength={250}
                onChange={(e) => setquantity(e.target.value)}
                ref={qtty}
                onKeyDown={(e) => handleKeyDown(e, taxamt, qtty)}
                
              />
              </div>
            </div>

            <div className="col-md-3 form-group">
           <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
               Tax Amount 
              </label><input
                id="state"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the description here"
                value={tax}
                maxLength={250}
                onChange={(e) => settax(e.target.value)}
                ref={taxamt}
                onKeyDown={(e) => handleKeyDown(e, totamt, taxamt)}
                
              />
              </div>
            </div>

            <div className="col-md-3 form-group">
           <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Total Amount
              </label><input
                id="state"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the description here"
                value={tot_amt }
                maxLength={250}
                onChange={(e) => settot_amt(e.target.value)}
                ref={totamt}
                onKeyDown={(e) => handleKeyDown(e, Description, totamt)}
              />
              </div>
            </div>
           
            <div className="col-md-3 form-group">
           <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Description
              </label><input
                id="state"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the description here"
                value={description }
                maxLength={250}
                onChange={(e) => setdescription(e.target.value)}
                ref={Description}
                onKeyDown={(e) => handleKeyDown(e, Description)}
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

            
            

            <div className="mobileview">
            <div class="mt-3 d-flex justify-content-end">
        <button onClick={handleInsert}  required title="Save">Save</button>
      </div>

           </div></div>
          

         
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
export default ProductDetail;