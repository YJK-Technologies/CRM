import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import AttriHdrInputPopup from "./AttriHdrInput";
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function AttriDetInput({ }) {
  const [open2, setOpen2] = React.useState(false);
  const [attributeheader_code, setAttributeheader_Code] = useState("");
  const [attributedetails_code, setAttributedetails_code] = useState("");
  const [attributedetails_name, setAttributedetails_name] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const navigate = useNavigate();
  const [statusdrop, setCodedrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const code = useRef(null);
  const subcode = useRef(null);
  const detailname = useRef(null);
  const description = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')




  console.log(selectedRows);
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const [isUpdated, setIsUpdated] = useState(false);


  console.log(selectedRow)

  const clearInputFields = () => {
    setSelectedHeader("");
    setAttributedetails_code("");
    setAttributedetails_name("");
    setDescriptions("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setSelectedHeader({
        label: selectedRow.attributeheader_code,
        value: selectedRow.attributeheader_code,
      });
    setAttributeheader_Code(selectedRow.attributeheader_code || "");
    setAttributedetails_code(selectedRow.attributedetails_code || "");
    setAttributedetails_name(selectedRow.attributedetails_name || "");
    setDescriptions(selectedRow.descriptions || "");
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/hdrcode`)
      .then((data) => data.json())
      .then((val) => setCodedrop(val));
  }, []);

  const filteredOptionHeader = statusdrop.map((option) => ({
    value: option.attributeheader_code,
    label: option.attributeheader_code,
  }));

  const handleChangeHeader = (selectedHeader) => {
    setSelectedHeader(selectedHeader);
    setAttributeheader_Code(selectedHeader ? selectedHeader.value : '');
  };

  const handleInsert = async () => {
    if (!attributeheader_code || !attributedetails_code || !attributedetails_name) {
          setError(" ");
          toast.warning("Missing Required Fields");
          return;
        }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addattridetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          attributeheader_code,
          attributedetails_code,
          attributedetails_name,
          descriptions,
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

  const handleNavigateToForm = () => {
    navigate("/AddAttributeHeader", { selectedRows }); // Pass selectedRows as props to the Input component
  };
  const handleNavigate = () => {
    navigate("/Attribute"); // Pass selectedRows as props to the Input component
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
      !attributeheader_code ||
      !attributedetails_code ||
      !attributedetails_name ||
      !descriptions

    ) {
       setError(" ");
       toast.warning("Missing Required Fields");
       return;
        }
    setLoading(true);


    try {
      const response = await fetch(`${config.apiBaseUrl}/AttributeUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attributeheader_code,
          attributedetails_code,
          attributedetails_name,
          descriptions,
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
        toast.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error Update data: ' + error.message);
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

          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div class="row ">
            <div class="col-md-12 text-center">
              <div >
              </div>
              <div>
                <div>
                  <div className="shadow-lg p-0 bg-body-tertiary rounded">
                    <div className=" mb-0 d-flex justify-content-between" >
                      <h1 align="left" class="purbut">{mode === "update" ? 'Update Attribute Details' : 'Add Attribute Details'}</h1>
                      <h1 align="left" class="mobileview fs-4">{mode === "update" ? 'Update Attribute Details' : 'Add Attribute Details'}</h1>

                      <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">

                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-2 mb-4">
              <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
                <div class="row">
                  <div className="col-md-3 form-group">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="rid" class="exp-form-labels">
                            Code
                          </label></div>
                        <div> <span className="text-danger">*</span></div>
                      </div>
                      <div className="d-flex justify-content-between input-group" title="Select the Code">
                       
                        <Select
                          id="HdrCode"
                          value={selectedHeader}
                          onChange={handleChangeHeader}
                          options={filteredOptionHeader}
                          className=" exp-input-field position-relative "
                          placeholder=""
                          ref={code}
                          readOnly={mode === "update"}
                          isDisabled={mode === "update"}
                          onKeyDown={(e) => handleKeyDown(e, subcode, code)}
                        />
                        {mode !== "update" && (<button onClick={handleClickOpen} class="atthdrcode position-absolute me-5 pb-2 " required title="Add Header"><i class="fa-solid fa-plus"></i></button>)}

                      </div>

                      {error && !attributeheader_code && <div className="text-danger">Attribute Header Code should not be blank</div>}


                    </div>
                  </div>

                  <div className="col-md-3 form-group">
                    <div class="exp-form-floating">

                      <div class="d-flex justify-content-start">
                        <div><label for="rid" class="exp-form-labels">
                          subcode
                        </label></div>
                        <div> <span className="text-danger">*</span></div>
                      </div><input
                        id="adcode"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the attribute sub code"
                        value={attributedetails_code}
                        onChange={(e) => setAttributedetails_code(e.target.value)}
                        maxLength={18}
                        ref={subcode}
                        readOnly={mode === "update"}
                        onKeyDown={(e) => handleKeyDown(e, detailname, subcode)}
                      /> {error && !attributedetails_code && <div className="text-danger">Attribute Sub Code should not be blank</div>}


                    </div>
                  </div>
                  <div className="col-md-3 form-group">
                    <div class="exp-form-floating">

                      <div class="d-flex justify-content-start">
                        <div><label for="rid" class="exp-form-labels">
                          Detail Name
                        </label></div>
                        <div> <span className="text-danger">*</span></div>
                      </div><input
                        id="adnames"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the attribute detail name"
                        value={attributedetails_name}
                        onChange={(e) => setAttributedetails_name(e.target.value)}
                        maxLength={250}
                        ref={detailname}
                        onKeyDown={(e) => handleKeyDown(e, description, detailname)}
                      />{error && !attributedetails_name && <div className="text-danger">Attribute Detail Name should not be blank</div>}


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
                        value={descriptions}
                        onChange={(e) => setDescriptions(e.target.value)}
                        maxLength={250}
                        ref={description}
                        // onKeyDown={(e) => handleKeyDown(e, description)}
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

                    </div>
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
                </div><input
                id="emailid"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please enter the email ID"
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
          </div>  */}
                  <div class="col-md-3 form-group d-flex justify-content-start mb-4">
                    {mode === "create" ? (
                      <button onClick={handleInsert} className="mt-4" title="Save">
                        <i class="fa-solid fa-floppy-disk"></i>
                      </button>
                    ) : (
                      <button onClick={handleUpdate} className="mt-4" title="Update">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>
                  <div>
                    <AttriHdrInputPopup open={open2} handleClose={handleClose} />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
export default AttriDetInput;