import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
// import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';
import Select from "react-select";


const config = require("./Apiconfig");

function AttriHdrInput({ open, handleClose }) {
  const [open2, setOpen2] = React.useState(false);
  const [attributeheader_code, setAttributeheader_Code] = useState("");
  const [attributeheader_name, setAttributeheader_Name] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /*const [created_by, setCreated_by] = useState("");
  const [created_date, setCreated_date] = useState("");
  const [modfied_by, setModified_by] = useState("");
  const [modfied_date, setModified_date] = useState("");*/
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const code = useRef(null);
  const Name = useRef(null);
  const Status = useRef(null);
  const navigate = useNavigate();
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
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleInsert = async () => {
    if (!attributeheader_code || !attributeheader_name || !status) {
      setError(" ");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addattriData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),

          attributeheader_code,
          attributeheader_name,
          status,
          created_by: sessionStorage.getItem("selectedUserCode"),

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
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
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

  const handleNavigate = () => {
    navigate("/AddAttributeDetail"); // Pass selectedRows as props to the Input component
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
    <div className="">
      {loading && <LoadingScreen />}
      {open && (
        <fieldset>
          <div className="purbut">
            <div className="purbut modal popupadj popup mt-5" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog  modal-xl  ps-5 p-1 pe-5" role="document">
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div className=" bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between" >
                          <h1 align="left" className="purbut ">Add Attribute Hdr</h1>
                          <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                          </button>

                        </div>
                        <div class="mobileview">
                          <div class="d-flex justify-content-between ">
                            <div className="d-flex justify-content-start mt-3 ">
                              <h1 align="left" className="h1"> Add Attribute Hdr</h1>
                            </div>
                            <div className="d-flex justify-content-end mb-4 mt-4 pt-2">
                              <delbutton onClick={handleClose} className="btn btn-danger  " required title="Close">
                                <i class="fa-solid fa-xmark"></i>
                              </delbutton>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    {/* <div>
                      <div>
                        <div
                          class="d-flex justify-content-between bg-secondary"
                          style={{ backgroundColor: "#d5d5d5" }}
                          className="head "
                        >
                          <legend>
                            <div className="purbut ">
                              <h1 align="left" class="">
                                Add Attribute Hdr
                              </h1>
                            </div>
                          </legend>

                          <div className="mobileview">
                            <div className="d-flex justify-content-between">
                              <div class="d-flex justify-content-start">
                                <div className="d-flex justify-content-start">
                                  <h1 align="left">Add Attribute Hdr</h1>
                                </div>
                                <div className="d-flex justify-content-end">
                                  <button
                                    onClick={handleNavigate}
                                    className="btn btn-danger pt-2 mt-2 mb-2 "
                                    required
                                    title="Close"
                                  >
                                    <i class="fa-solid fa-circle-xmark"></i>{" "}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="purbut">
                            <div class="d-flex justify-content-end mb-2 me-3 ms-4">
                              <div className="mt-3">
                                <button
                                  onClick={handleClose}
                                  class="closebtn"
                                  required
                                  title="Close"
                                >
                                  <i class="fa-solid fa-circle-xmark"></i>{" "}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div class="">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Code
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          <input
                            id="ahcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header code"
                            value={attributeheader_code}
                            onChange={(e) =>
                              setAttributeheader_Code(e.target.value)
                            }
                            maxLength={100}
                            ref={code}
                            onKeyDown={(e) => handleKeyDown(e, Name, code)}
                          />
                          {error && !attributeheader_code && (
                            <div className="text-danger">
                              Attribute Code should not be blank
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Name
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
                          </div>{" "}
                          <input
                            id="ahname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header name"
                            value={attributeheader_name}
                            maxLength={250}
                            onChange={(e) =>
                              setAttributeheader_Name(e.target.value)
                            }
                            ref={Name}
                            onKeyDown={(e) => handleKeyDown(e, Status, Name)}
                          />
                          {error && !attributeheader_name && (
                            <div className="text-danger">
                              Attribute Name should not be blank
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Status
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
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
                   <div title="Select the Status">
                          <Select
                            id="status"
                            value={selectedStatus}
                            onChange={handleChangeStatus}
                            options={filteredOptionStatus}
                            className="exp-input-field"
                            placeholder=""
                            required
                            data-tip="Please select a payment type"
                            ref={Status}
                            // onKeyDown={(e) => handleKeyDown(e, Status)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleInsert();
                              }
                            }}
                          />
                          {error && !status && (
                            <div className="text-danger">
                              {" "}
                              Status should not be blank
                            </div>
                          )}
</div>
                        </div>
                      </div>
                      <div class="col-md-3 form-group  ">
                        <button onClick={handleInsert} class="mt-4" required title="Save">          <i class="fa-solid fa-floppy-disk"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobileview">
            <div className=" modal mt-5" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog  modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div class=" ">
                    <div class="col-md-12 text-center">
                      <div class="mb-0 rounded-0 d-flex justify-content-between">
                        <div className="mb-0 d-flex justify-content-start">
                          <h1 className="h1">Add Attribute Hdr</h1>
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
                    {/* <div>
                      <div>
                        <div
                          class="d-flex justify-content-between bg-secondary"
                          style={{ backgroundColor: "#d5d5d5" }}
                          className="head "
                        >
                          <legend>
                            <div className="purbut ">
                              <h1 align="left" class="">
                                Add Attribute Hdr
                              </h1>
                            </div>
                          </legend>

                          <div className="mobileview">
                            <div className="d-flex justify-content-between">
                              <div class="d-flex justify-content-start">
                                <div className="d-flex justify-content-start">
                                  <h1 align="left">Add Attribute Hdr</h1>
                                </div>
                                <div className="d-flex justify-content-end">
                                  <button
                                    onClick={handleNavigate}
                                    className="btn btn-danger pt-2 mt-2 mb-2 "
                                    required
                                    title="Close"
                                  >
                                    <i class="fa-solid fa-circle-xmark"></i>{" "}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="purbut">
                            <div class="d-flex justify-content-end mb-2 me-3 ms-4">
                              <div className="mt-3">
                                <button
                                  onClick={handleClose}
                                  class="closebtn"
                                  required
                                  title="Close"
                                >
                                  <i class="fa-solid fa-circle-xmark"></i>{" "}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div class="">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Code
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          <input
                            id="ahcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header code"
                            value={attributeheader_code}
                            onChange={(e) =>
                              setAttributeheader_Code(e.target.value)
                            }
                            maxLength={100}
                            // ref={code}
                            // onKeyDown={(e) => handleKeyDown(e, Name, code)}
                          />
                          {error && !attributeheader_code && (
                            <div className="text-danger">
                              Attribute Code should not be blank
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Name
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
                          </div>{" "}
                          <input
                            id="ahname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header name"
                            value={attributeheader_name}
                            maxLength={250}
                            onChange={(e) =>
                              setAttributeheader_Name(e.target.value)
                            }
                            // ref={Name}
                            // onKeyDown={(e) => handleKeyDown(e, Status, Name)}
                          />
                          {error && !attributeheader_name && (
                            <div className="text-danger">
                              Attribute Name should not be blank
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Status
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
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

                            // onKeyDown={(e) => handleKeyDown(e, Status)}
                          />
                          {error && !status && (
                            <div className="text-danger">
                              Status should not be blank
                            </div>
                          )}
                        </div>
                      </div>
                      <div class="col-md-3 form-group d-flex justify-content-end ">
                        <button onClick={handleInsert} class="mt-4" required title="Save">          <i class="fa-solid fa-floppy-disk"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div></div>
        </fieldset>
      )}
    </div>
  );
}
export default AttriHdrInput;
