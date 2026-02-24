import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';

const config = require("./Apiconfig");

function UserComMap_input({ }) {
  const [user_code, setuser_code] = useState("");
  const [company_no, setcompany_no] = useState("");
  const [location_no, setlocation_no] = useState("");
  const [status, setstatus] = useState("");
  const [order_no, setorder_no] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [usercodedrop, setusercodedrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [companynodrop, setcompanynodrop] = useState([]);
  const [locationnodrop, setlocationnodrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const usercode = useRef(null);
  const companycode = useRef(null);
  const locno = useRef(null);
  const Status = useRef(null);
  const Orderno = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const created_by = sessionStorage.getItem("selectedUserCode");
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const [isUpdated, setIsUpdated] = useState(false);
  const [keyfiels, setKeyfiels] = useState('');

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setSelectedUser("");
    setuser_code("");
    setSelectedCompany("");
    setSelectedLocation("");
    setSelectedStatus("");
    setorder_no("");
  };


  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setorder_no(selectedRow.order_no || "");
      setKeyfiels(selectedRow.keyfiels || "");
      setuser_code(selectedRow.user_code || "");
      setcompany_no(selectedRow.company_no || "");
      setlocation_no(selectedRow.location_no || "");
      setstatus(selectedRow.status || "");
      setSelectedUser({
        label: selectedRow.user_code,
        value: selectedRow.user_code,
      });
      setSelectedCompany({
        label: selectedRow.company_no,
        value: selectedRow.company_no,
      });
      setSelectedLocation({
        label: selectedRow.location_no,
        value: selectedRow.location_no,
      });
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((data) => data.json())
      .then((val) => setusercodedrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/Companyno`)
      .then((data) => data.json())
      .then((val) => setcompanynodrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((data) => data.json())
      .then((val) => setlocationnodrop(val));
  }, []);

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

  const filteredOptionUser = usercodedrop.map((option) => ({
    value: option.user_code,
    label: `${option.user_code} - ${option.user_name}`,
  }));

  const filteredOptionCompany = companynodrop.map((option) => ({
    value: option.company_no,
    label: `${option.company_no} - ${option.company_name}`,
  }));

  const filteredOptionLocation = locationnodrop.map((option) => ({
    value: option.location_no,
    label: `${option.location_no} - ${option.location_name}`,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_code(selectedUser ? selectedUser.value : "");
  };

  const handleChangeCompany = (selectedCompany) => {
    setSelectedCompany(selectedCompany);
    setcompany_no(selectedCompany ? selectedCompany.value : "");
  };

  const handleChangeLocation = (selectedLocation) => {
    setSelectedLocation(selectedLocation);
    setlocation_no(selectedLocation ? selectedLocation.value : "");
  };

  const handleInsert = async () => {
    if (!user_code || !company_no || !location_no || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addCompanyMappingData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            user_code,
            company_no,
            location_no,
            status,
            order_no,
            created_by: sessionStorage.getItem("selectedUserCode"),
          }),
        }
      );
      if (response.ok) {
              toast.success("Data inserted Successfully", {
                onClose: () => clearInputFields()
              });
            } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data');
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/CompanyMapping"); // Pass selectedRows as props to the Input component
  };

  const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
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
    if (e.key === "Enter" && hasValueChanged) {
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };


  const handleUpdate = async () => {
    if (!user_code || !company_no || !location_no || !status) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/CompanyMappingUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
           user_code,
            company_no,
            location_no,
            status,
            order_no,
          modified_by,
          keyfiels
        }),
      });
      // if (response.status === 200) {
      //   console.log("Data Updated successfully");
      //   setIsUpdated(true);
      //   clearInputFields();
      //   toast.success("Data Updated successfully!")
       if (response.ok) {
              toast.success("Data updated successfully", {
                onClose: () => clearInputFields()
              });
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
        <div className="">
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div class="col-md-12 text-center">
            <div>
              <div className="shadow-lg p-0 bg-body-tertiary rounded ">
                <div className=" mb-0 d-flex justify-content-between" >
                  <h1 align="left" class="purbut">{mode === "update" ? 'Update Company Mapping' : 'Add Company Mapping'} </h1>
                  <h1 align="left" class="fs-4 mobileview">{mode === "update" ? 'Update Company Mapping' : 'Add Company Mapping'} </h1>
                  <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
              {/* {error && <div className="error">{error}</div>} */}
              <div class="pt-2 mb-4">
                <div className="shadow-lg p-3 bg-body-tertiary rounded">
                  <div className="row">
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="rid" class="exp-form-labels" className={`${error && !user_code ? 'text-danger' : ''}`}>
                              User Code<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div title="Select the User Code">
                        <Select
                          id="usercode"
                          value={selectedUser}
                          onChange={handleChangeUser}
                          options={filteredOptionUser}
                          className="exp-input-field"
                          placeholder=""
                          ref={usercode}
                          onKeyDown={(e) =>
                            handleKeyDown(e, companycode, usercode)
                          }
                        />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="rid" class="exp-form-labels" className={`${error && !company_no ? 'text-danger' : ''}`}>
                              Company Code<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div title="Select the Company Code ">
                        <Select
                          id="comno"
                          value={selectedCompany}
                          onChange={handleChangeCompany}
                          options={filteredOptionCompany}
                          className="exp-input-field"
                          placeholder=""
                          ref={companycode}
                          onKeyDown={(e) =>
                            handleKeyDown(e, locno, companycode)
                          }
                        />
                       </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="rid" class="exp-form-labels" className={`${error && !location_no ? 'text-danger' : ''}`}>
                              Location No<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div title="Select the Location No">
                        <Select
                          id="locno"
                          value={selectedLocation}
                          onChange={handleChangeLocation}
                          options={filteredOptionLocation}
                          className="exp-input-field"
                          placeholder=""
                          ref={locno}
                          onKeyDown={(e) => handleKeyDown(e, Status, locno)}
                        />
                       </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group">
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="rid" class="exp-form-labels" className={`${error && !status ? 'text-danger' : ''}`}>
                              Status<span className="text-danger">*</span>
                            </label>
                          </div>
                        </div>
                        <div title="Select the Status">
                        <Select
                          id="status"
                          value={selectedStatus}
                          onChange={handleChangeStatus}
                          options={filteredOptionStatus}
                          className="exp-input-field"
                          placeholder=""
                          ref={Status}
                          onKeyDown={(e) => handleKeyDown(e, Orderno, Status)}
                        />
                       </div>
                      </div>
                    </div>
                    <div className="col-md-3 form-group">
                      <div class="exp-form-floating">
                        <label for="ordno" class="exp-form-labels">
                          Order No
                        </label>
                        <input
                          id="ordno"
                          class="exp-input-field form-control"
                          type="number"
                          placeholder=""
                          required
                          title="Please enter the order number"
                          value={order_no}
                          onChange={(e) =>
                            setorder_no(
                              e.target.value.replace(/\D/g, "").slice(0, 50)
                            )
                          }
                          maxLength={50}
                          ref={Orderno}
                          // onKeyDown={(e) => handleKeyDown(e, Orderno)}
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
                    <div class="col-md-3 form-group d-flex justify-content-start mb-4">
                      {mode === "create" ? (
                        <button onClick={handleInsert} className="mt-4" title="Save">
                          <i class="fa-solid fa-floppy-disk"></i>
                        </button>
                      ) : (
                        <button className="mt-4" title="Update" onClick={handleUpdate} >
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
      </div>
    </div>
  );
}
export default UserComMap_input;
