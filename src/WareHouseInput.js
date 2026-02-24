import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';
const config = require('./Apiconfig');


function WareHouseInput({ }) {
  const [warehouse_code, setWarehouse_Code] = useState("");
  const [warehouse_name, setWarehouse_Name] = useState("");
  const [status, setStatus] = useState("");
  const [location_no, setLocation_No] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [locationnodrop, setLocationdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const StatuS = useRef(null);
  const WarehouseCode = useRef(null);
  const WarehouseName = useRef(null);
  const Status = useRef(null);
  const LocatioN = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const navigate = useNavigate();
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [loading, setLoading] = useState(false);
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  console.log(selectedRow);

  const clearInputFields = () => {
    setWarehouse_Code("");
    setWarehouse_Name("");
    setSelectedLocation("");
    setSelectedStatus("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setSelectedLocation({
        label: selectedRow.location_no,
        value: selectedRow.location_no,
      });
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
      setWarehouse_Code(selectedRow.warehouse_code || "");
      setWarehouse_Name(selectedRow.warehouse_name || "");

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);



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

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((data) => data.json())
      .then((val) => setLocationdrop(val));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionLocation = locationnodrop.map((option) => ({
    value: option.location_no,
    label: option.location_no,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');

  };

  const handleChangeLocation = (selectedLocation) => {
    setSelectedLocation(selectedLocation);
    setLocation_No(selectedLocation ? selectedLocation.value : '');

  };


  const handleInsert = async () => {
    if (
      !warehouse_code ||
      !warehouse_name ||
      !status ||
      !location_no

    ) {
      setError(" ");
      return;
    }
    setLoading(true);
    //   if (validateInputs()) {
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddWareHousedata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          warehouse_code,
          warehouse_name,
          status,
          location_no,
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

  const handleNavigate = () => {
    navigate("/WareHouse"); // Pass selectedRows as props to the Input component
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


  const handleUpdate = async () => {
    if (
      !warehouse_code ||
      !warehouse_name ||
      !selectedStatus ||
      !selectedLocation
    ) {
      setError(" ");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/WarehouseUpdates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          warehouse_code,
          warehouse_name,
          status: selectedStatus.value,
          location_no: selectedLocation.value,
          created_by,
          modified_by,
        }),
      });
      if (response.status === 200) {
        console.log("Data Updated successfully");
        setIsUpdated(true);
        clearInputFields();
        toast.success("Data Updated successfully!")
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error("Failed to Update data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
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

          <ToastContainer
            position="top-right"
            className="toast-design" // Adjust this value as needed
            theme="colored"
          />
          <div className="shadow-lg p-0 bg-body-tertiary rounded ">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="fs-4 mobileview " > {mode === "update" ? 'Update  Warehouse ' : ' Add Warehouse'} </h1>
              <h1 align="left" class="purbut" > {mode === "update" ? 'Update  Warehouse ' : ' Add Warehouse'} </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          <div class="pt-2 mb-4">
            <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
              <div class="row">
                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="state" class="exp-form-labels">
                          Warehouse Code

                        </label>
                      </div>
                      <div>
                        <span className="text-danger">*</span>
                      </div>
                    </div><input
                      id="whcode"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the warehouse code"
                      value={warehouse_code}
                      maxLength={18}
                      onChange={(e) => setWarehouse_Code(e.target.value)}
                      ref={WarehouseCode}
                      readOnly={mode === "update"}
                      onKeyDown={(e) => handleKeyDown(e, WarehouseName, WarehouseCode)}
                    />            {error && !warehouse_code && <div className="text-danger">WareHouse Code should not be blank</div>}


                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="state" class="exp-form-labels">
                          Warehouse Name

                        </label>
                      </div>
                      <div>
                        <span className="text-danger">*</span>
                      </div>
                    </div><input
                      id="whname"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the warehouse name"
                      value={warehouse_name}
                      maxLength={250}
                      onChange={(e) => setWarehouse_Name(e.target.value)}
                      ref={WarehouseName}
                      onKeyDown={(e) => handleKeyDown(e, Status, WarehouseName)}
                    />            {error && !warehouse_name && <div className="text-danger">WareHouse Name should not be blank</div>}


                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="state" class="exp-form-labels">
                          Status

                        </label>
                      </div>
                      <div>
                        <span className="text-danger">*</span>
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
                      onKeyDown={(e) => handleKeyDown(e, LocatioN, Status)}
                    />
                    {error && !status && <div className="text-danger"> Status should not be blank</div>}

                  </div>
                </div>   </div>







                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="state" class="exp-form-labels">
                          Location No

                        </label>
                      </div>
                      <div>
                        <span className="text-danger">*</span>
                      </div>
                    </div>
<div title="Select the Location No">     
                    <Select
                      id="status"
                      value={selectedLocation}
                      onChange={handleChangeLocation}
                      options={filteredOptionLocation}
                      className="exp-input-field"
                      placeholder=""
                      ref={LocatioN}
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
                    {error && !location_no && <div className="text-danger"> Location No should not be blank</div>}



                  </div>
                </div>    </div>

                <div class="col-md-3 form-group  ">
                  {mode === "create" ? (
                    <button onClick={handleInsert} className="mt-4" title="Save">
                      <i class="fa-solid fa-floppy-disk"></i>

                    </button>
                  ) : (
                    <button onClick={handleUpdate} className="mt-4" title="Update">
                      <i class="fa-solid fa-floppy-disk"></i>

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
export default WareHouseInput;
