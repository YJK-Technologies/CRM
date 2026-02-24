import React, { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function Role_input({ }) {
  const [companyCode, setCompanyCode] = useState("");
  const [validationStatus, setValidationStatus] = useState("");
  const [selectValidationStatus, setSelectedValidationStatus] = useState("");
  const [screens, setScreens] = useState("");
  const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
  const [companyCodeDrop, setCompanyCodeDrop] = useState([]);
  const [validationStatusDrop, setValidationStatusDrop] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const created_by = sessionStorage.getItem('selectedUserCode');
  const [loading, setLoading] = useState(false);

  const clearInputFields = () => {
    setCompanyCode("");
    setValidationStatus("");
    setScreens("");
    setSelectedCompanyCode("");
    setSelectedValidationStatus("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setSelectedCompanyCode({
        label: selectedRow.company_code,
        value: selectedRow.company_code,
      });
      setCompanyCode(selectedRow.company_code || "");

      setSelectedValidationStatus({
        label: selectedRow.Validation_status,
        value: selectedRow.Validation_status,
      });
      setValidationStatus(selectedRow.Validation_status || "");

      setScreens(selectedRow.Screens || "");
    }
    else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/GetCC`)
      .then((data) => data.json())
      .then((val) => setCompanyCodeDrop(val));
  }, []);

  const filteredOptionCompany = companyCodeDrop.map((option) => ({
    value: option.company_no,
    label: `${option.company_no} - ${option.company_name}`,
  }));

  const handleChangeCompany = (selectedCompanyCode) => {
    setSelectedCompanyCode(selectedCompanyCode);
    setCompanyCode(selectedCompanyCode ? selectedCompanyCode.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setValidationStatusDrop(val));
  }, []);

  const filteredOptionValidationSatus = validationStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleValidationSatus = (selectValidationStatus) => {
    setSelectedValidationStatus(selectValidationStatus);
    setValidationStatus(selectValidationStatus ? selectValidationStatus.value : '');
  };


  const handleInsert = async () => {
    if (!companyCode || !validationStatus || !screens) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/InsertStockVal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
          Validation_status: validationStatus,
          Screens: screens,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/ValidationGrid");
  };

  const handleUpdate = async () => {
    if (!companyCode || !validationStatus || !screens) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/updateStockValStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: companyCode,
          Validation_status: validationStatus,
          Screens: screens,
          modified_by,
        }),
      });
      if (response.status === 200) {
        console.log("Data Updated successfully");
        setIsUpdated(true);
        clearInputFields();
        toast.success("Data Updated successfully!")
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class=""  >
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-body-tertiary rounded ">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">{mode === "update" ? 'Update Validation' : 'Add Validation'}  </h1>
              <h1 align="left" class="fs-4 mobileview">{mode === "update" ? 'Update Validation' : 'Add Validation'}  </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="pt-2 mb-4">
            <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2 ">
              <div class="row col-12">
                <div className="col-md-3 col-12 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels" className={`${error && !companyCode ? 'text-danger' : ''}`}>
                          Company Code<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <Select
                      id="rid"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="please enter the role ID"
                      maxLength={18}
                      readOnly={mode === "update"}
                      value={selectedCompanyCode}
                      onChange={handleChangeCompany}
                      options={filteredOptionCompany}
                    />
                    {/* {error && !companyCode && <div className="text-danger">Company Code should not be blank</div>} */}
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels" className={`${error && !validationStatus ? 'text-danger' : ''}`}>
                          Validation Status<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <Select
                      id="rname"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="please enter the role name"
                      maxLength={50}
                      value={selectValidationStatus}
                      onChange={handleValidationSatus}
                      options={filteredOptionValidationSatus}
                    />
                    {/* {error && !validationStatus && <div className="text-danger">Validation Status should not be blank</div>} */}
                  </div>
                </div>
                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="rid" class="exp-form-labels" className={`${error && !screens ? 'text-danger' : ''}`}>
                          Screens<span className="text-danger">*</span>
                        </label>
                      </div>
                    </div>
                    <input
                      id="desc"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="please enter the description"
                      maxLength={255}
                      value={screens}
                      autoComplete="off"
                      onChange={(e) => setScreens(e.target.value)}
                    />
                    {/* {error && !screens && <div className="text-danger">Validation Status should not be blank</div>} */}
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
                </div> */}
                <div class="col-md-3 form-group d-flex justify-content-start">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Role_input;