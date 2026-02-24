import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function CustomerHdrInput({ open, handleClose }) {
  const navigate = useNavigate();
  const [customer_code, setcustomer_code] = useState("");
  const [customer_name, setcustomer_name] = useState("");
  const [status, setstatus] = useState("");
  // const [vendor_logo, setvendor_logo] = useState("");
  const [panno, setpanno] = useState("");
  const [customer_gst_no, setcustomer_gst_no] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const code = useRef(null);
  const Name = useRef(null);
  const Status = useRef(null);
  const PanNo = useRef(null);
  const GSTNo = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);


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

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');

  };


  const handleInsert = async () => {
    if (!customer_code || !customer_name || !status) {
      setError(" ");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/addcustomerhdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          customer_code,
          customer_name,
          status,
          panno,
          customer_gst_no,
          created_by: sessionStorage.getItem('selectedUserCode')

        }),
      });
      if (response.ok) {


        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
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
    } finally {
      setLoading(false);
    }

  };

  const handleNavigate = () => {
    navigate("/AddCustomerDetails"); // Pass selectedRows as props to the Input component
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
    <div>
      {open && (
        <fieldset>
          <div className="purbut">
            {loading && <LoadingScreen />}
            <div className="purbut modal popupadj popup mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl px-4 p-3" role="document">
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div className="p-0 bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between" >
                          <h1 align="left" className="purbut">Add Customer Hdr</h1>
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
                    <div class="">
                      <div class="row p-3">
                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div><label for="rid" class="exp-form-labels">
                                Customer Code
                              </label></div>
                              <div> <span className="text-danger">*</span></div>
                            </div><input
                              id="cuscode"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the customer code"
                              value={customer_code}
                              onChange={(e) => setcustomer_code(e.target.value)}
                              maxLength={18}
                              ref={code}
                              onKeyDown={(e) => handleKeyDown(e, Name, code)}
                            />
                            {error && !customer_code && <div className="text-danger">Customer Code should not be blank</div>}



                          </div>
                        </div>
                        <div className="col-md-3 form-group">

                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div><label for="rid" class="exp-form-labels">
                                Customer Name
                              </label></div>
                              <div> <span className="text-danger">*</span></div>
                            </div><input
                              id="cusname"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the customer name"
                              value={customer_name}
                              onChange={(e) => setcustomer_name(e.target.value)}
                              maxLength={250}
                              ref={Name}
                              onKeyDown={(e) => handleKeyDown(e, Status, Name)}
                            />
                            {error && !customer_name && <div className="text-danger">Customer Name should not be blank</div>}
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
                  id="status"
                  className="exp-input-field form-control"
                  placeholder="Select status"
                   required title = " Please select a status"
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
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
                              ref={Status}
                              // onKeyDown={(e) => handleKeyDown(e, Status)}
                              onKeyDown={(e) => handleKeyDown(e, PanNo, Status)}
                            />
                            {error && !status && <div className="text-danger">Status should not be blank</div>}
                          </div>
                        </div>

                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <label for="panno" class="exp-form-labels">
                              PAN No
                            </label><input
                              id="panno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Pan number"
                              value={panno}
                              onChange={(e) => setpanno(e.target.value)}
                              maxLength={18}
                              ref={PanNo}
                              onKeyDown={(e) => handleKeyDown(e, GSTNo, PanNo)}
                            />

                          </div>
                        </div>
                        <div className="col-md-3  form-group">
                          <div class="exp-form-floating">
                            <label for="cusgstno" class="exp-form-labels">
                              GST No
                            </label><input
                              id="cusgstno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the GST number"
                              value={customer_gst_no}
                              onChange={(e) => setcustomer_gst_no(e.target.value)}
                              maxLength={15}
                              ref={GSTNo}
                              onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleInsert();
                              }
                            }}
                            />

                          </div>
                        </div>
                        <div class="col-md-3 form-group  ">
                          <button onClick={handleInsert} class="mt-4" required title="Save"><i class="fa-solid fa-floppy-disk"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobileview">
            <div className="modal mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div class="">
                    <div class="col-md-12 " >
                      <div class="col-md-12 text-center">
                        <div class="mb-0 rounded-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start">
                            <h1 className="h1">Add Customer Hdr</h1>
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
                    <div class="">
                      <div class="row p-3">
                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div><label for="rid" class="exp-form-labels">
                                Customer Code
                              </label></div>
                              <div> <span className="text-danger">*</span></div>
                            </div><input
                              id="cuscode"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the customer code"
                              value={customer_code}
                              onChange={(e) => setcustomer_code(e.target.value)}
                              ref={code}
                              onKeyDown={(e) => handleKeyDown(e, Name, code)}
                              maxLength={18}
                            />

                            {error && !customer_code && <div className="text-danger">Customer Code should not be blank</div>}

                          </div>
                        </div>
                        <div className="col-md-3 form-group">

                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div><label for="rid" class="exp-form-labels">
                                Customer Name
                              </label></div>
                              <div> <span className="text-danger">*</span></div>
                            </div><input
                              id="cusname"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the customer name"
                              value={customer_name}
                              onChange={(e) => setcustomer_name(e.target.value)}
                              maxLength={250}
                            />
                            {error && !customer_name && <div className="text-danger">Customer Name should not be blank</div>}
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
                  id="status"
                  className="exp-input-field form-control"
                  placeholder="Select status"
                   required title = " Please select a status"
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
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
                            />
                            {error && !status && <div className="text-danger">Status should not be blank</div>}
                          </div>
                        </div>

                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <label for="panno" class="exp-form-labels">
                              Pan No
                            </label><input
                              id="panno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Pan number"
                              value={panno}
                              onChange={(e) => setpanno(e.target.value)}
                              maxLength={18}
                            />

                          </div>
                        </div>
                        <div className="col-md-3  form-group">
                          <div class="exp-form-floating">
                            <label for="cusgstno" class="exp-form-labels">
                              GST No
                            </label><input
                              id="cusgstno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the GST number"
                              value={customer_gst_no}
                              onChange={(e) => setcustomer_gst_no(e.target.value)}
                              maxLength={15}
                            />

                          </div>
                        </div>
                        <div class="col-md-3 form-group  d-flex justify-content-end">
                          <button onClick={handleInsert} class="mt-4" required title="Save"> Save</button>
                        </div>
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
export default CustomerHdrInput; 