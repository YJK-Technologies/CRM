import React, { useState, useEffect } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
// import { useLocation } from "react-router-dom";
  import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'

const config = require('./Apiconfig');

function ProductHdr({  }) {
  const [Product_Code, setProduct_Code] = useState("");
  const [Product_name, setProduct_name] = useState("");
  const [status, setStatus] = useState("");
  /*const [created_by, setCreated_by] = useState("");
  const [created_date, setCreated_date] = useState("");
  const [modfied_by, setModified_by] = useState("");
  const [modfied_date, setModified_date] = useState("");*/
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('');
  const [description, setDescriptions] = useState('');
  const navigate = useNavigate();


  console.log(selectedRows);

 useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
    setError(false);
  };

  const handleInsert = async () => {
    if (!Product_Code || !status) {
      setError(" ");
      return;
  }
    try {
      const response = await fetch(`${config.apiBaseUrl}/addProductHeader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),

          Product_Code,
          Product_name,
            status,
            description,
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
  navigate("/AddProductDetail")  ; // Pass selectedRows as props to the Input component
};
 
  return (
    <div class="container-fluid">     
      <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      <div class="row justify-content-center">
        <div class="col-md-12 text-center">
         {/* <div
            style={{
              color: "red",
              border: "1px solid red",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {error}
          </div> */}
       <div >
  <div class="d-flex justify-content-between" className="head">

  <div className="purbut"><h1 align="left" class="" >
      Add Product Header
    </h1></div>

    <div className="mobileview">
      
      <div class="d-flex justify-content-between">
      <div className="" style={{marginRight:"90px", marginLeft:"100px",textAlign:"left"}}><h1  >
       Add Product Mapping Hdr
    </h1></div>
      
     
      <div className="mt-3"><button onClick={handleNavigate} class="closebtn" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
      </div>
      </div>
      </div> 
<div className="purbut">
    <div class="d-flex justify-content-end mb-2 me-3">
      
      <div class="mt-3 ">
        <button onClick={handleInsert} class="saveinbtn" required title="Save"><i class="fa-regular fa-floppy-disk"></i></button>
      </div>
      <div className="mt-3"><button onClick={handleNavigate} class="closebtn" required title="Close" ><i class="fa-solid fa-circle-xmark"></i> </button>
      </div>
      </div></div>

  </div>



</div>

</div>

        

          {error && <div className="error">{error}</div>}
       
        <div class="container-fluid mt-4">
          <div className="row p-0 ms-2">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                 <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Product Code
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="ahcode"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the attribute header code"
                  value={Product_Code}
                  onChange={(e) => setProduct_Code(e.target.value)}
                  maxLength={100}
                />{error && !Product_Code && <div className="text-danger">Attribute Code should not be blank</div>}

                
              </div>
            </div>
            
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                   Product  Name
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div> <input
                  id="ahname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the attribute header name"
                  value={Product_name}
                  maxLength={250}
                  onChange={(e) => setProduct_name(e.target.value)}
                />{error && !Product_name && <div className="text-danger">Attribute Name should not be blank</div>}
               
              </div>
            </div>

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Description
                </label></div>
                </div><input
                  id="addesc"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the description"
                  value={description}
                  onChange={(e) => setDescriptions(e.target.value)}
                  maxLength={250}
                />
                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Status
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div>
                {/* <select
                  name="status"
                  id="ahsts"
                  className="exp-input-field form-control"
                  placeholder="Select status"
                  required title="Please select a status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  autoComplete="off"
                >
                  <option value=""></option>
                  {statusdrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select> */}

                <Select
                  id="status"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  className="exp-input-field"
                  placeholder=""
                  required
                  data-tip="Please select a payment type"
                />
                {error && !status && <div className="text-danger"> Status  should not be blank</div>}
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
export default ProductHdr;