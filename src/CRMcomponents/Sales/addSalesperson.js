import React, { useState, useEffect, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Select from "react-select";
import { toast } from "react-toastify";
import Company from "./company.png";

const config = require("../../Apiconfig");

const AddSalesperson = ({
  showSalesperson,
  onSalespersonClose,
  onSaveSalesperson,
  title,
  typedValue,
  onSuccess,
  initialData
}) => {
  const [error, setError] = useState("");
  const [SalesCode, setSalesCode] = useState("");
  const [SalesPersonName, setSalesPersonName] = useState("");
  const [EmailID, setEmailID] = useState("");
  const [Language, setLanguage] = useState("");
  const [Role, setRole] = useState("");
  const [SalesTeam, setSalesTeam] = useState("");
  const [SalespersonStatusDrop, setSalesPersonStatusDrop] = useState([]);
  const [selectedSalesPersonStatus, setSelectedSalesPersonStatus] = useState("");
  const [SalespersonStatus, setSalespersonStatus] = useState("");
  const [domainDrop, setDomainDrop] = useState([]);
  const [selectedDomainStatus, setSelectedDomainStatus] = useState("");
  const [domain, setDomain] = useState("");
  const [refferedBy, setRefferedBy] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const mode = initialData ? "update" : "create";

  const inputStyle = {
    boxShadow: "none",
  };

  const selectCustomStyles = {
    control: (base, state) => ({
      ...base,
      border: "none",
      borderBottom: state.isFocused ? "2px solid #17a2b8" : "2px solid #ccc",
      boxShadow: "none",
      borderRadius: "0",
      backgroundColor: "transparent",
      fontSize: "14px",
      fontWeight: 500,
      width: '100%',
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#666",
      ":hover": { color: "#17a2b8" },
    }),
  };

  const clearInputFields = () => {
    setSalesCode("");
    setSalesPersonName("");
    setEmailID("");
    setLanguage("");
    setRole("");
    setSalesTeam("");
    setSalespersonStatus("");
    setSelectedSalesPersonStatus(null);
  };

  useEffect(() => {
    if (initialData) {
      setSalesCode(initialData.SalesCode || "");
      setSalesPersonName(initialData.SalesPersonName || "");
      setEmailID(initialData.EmailID || "");
      setLanguage(initialData.Language || "");
      setRole(initialData.Role || "");
      setSalesTeam(initialData.SalesTeam || "");
      setSalespersonStatus(initialData.status || "");
      setSelectedSalesPersonStatus(
        initialData.status
          ? { value: initialData.status, label: initialData.status }
          : null
      );
    } else {
      // Clear modal for new record
      clearInputFields();
    }
  }, [initialData]);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setSalesPersonStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getDomain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setDomainDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (typedValue) {
      setSalesPersonName(typedValue);
    }
  }, [typedValue]);

  if (!showSalesperson) return null;

  const handleChangeSalesPersonStatus = (selectedSalespersonStatus) => {
    setSelectedSalesPersonStatus(selectedSalespersonStatus);
    setSalespersonStatus(
      selectedSalespersonStatus ? selectedSalespersonStatus.value : ""
    );
  };

  const handleChangeDomain = (selectedDomainStatus) => {
    setSelectedDomainStatus(selectedDomainStatus);

    if (selectedDomainStatus && selectedDomainStatus.length > 0) {
      const selectedValues = selectedDomainStatus.map(option => option.value);
      setDomain(selectedValues.join(","));
    } else {
      setDomain("");
    }
  };

  const filteredOptionSalesPersonStatus = SalespersonStatusDrop.map(
    (option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    })
  );

  const filteredOptionDomain = domainDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleInsert = async () => {
    if (
      !SalesCode ||
      !SalesPersonName ||
      !EmailID ||
      !Language ||
      !SalespersonStatus
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_SalesPersonMasterInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SalesCode: SalesCode,
          SalesPersonName: SalesPersonName,
          EmailID: EmailID,
          Language: Language,
          Role: Role,
          SalesTeam: SalesTeam,
          status: SalespersonStatus,
          BussinessDomain: domain,
          RefferedBy: refferedBy,
          Created_by: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!");
        if (onSuccess) onSuccess(SalesPersonName);
        onSalespersonClose();
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    }
  };

  const handleUpdate = async () => {
    if (

      !SalesPersonName ||
      !EmailID ||
      !Language ||
      !SalespersonStatus
    ) {
      setError(" ");

      toast.warning("Error: Missing required fields");
      return;
    }


    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_SalesPersonMasterUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SalesCode: SalesCode,
          SalesPersonName: SalesPersonName,
          EmailID: EmailID,
          Language: Language,
          Role: Role,
          SalesTeam: SalesTeam,
          status: SalespersonStatus,
          BussinessDomain: domain,
          RefferedBy: refferedBy,
          Created_by: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.status === 200) {
        // console.log("SalesPerson Updated successfully");
        toast.success("SalesPerson Updated successfully!");
        if (onSuccess) onSuccess(SalesPersonName);
        onSalespersonClose();
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error Updated data:", error);
      toast.error("Error Updated data: " + error.message);
    }
  };


  return (
    <div
      className="modal d-block mt-5 popupadj Topnav-screen popup"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">{title || "Create Salesperson"}</h5>
              <button
                className="btn btn-danger"
                onClick={onSalespersonClose}
                aria-label="Close"
                title="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div
            className="text-center"
            style={{
              backgroundColor: "#e6f4f9",
              padding: "10px",
              color: "#333",
              fontSize: "14px",
            }}
          >
            You are inviting a new user.
          </div>

          <div className="modal-body d-flex align-items-start" style={{ gap: "20px" }}>
            <div>
              <img
                src={Company}
                alt="User"
                style={{ width: 120, height: 120 }}
              />
            </div>

            <div className="flex-grow-1 w-100">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Code
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom"
                    style={inputStyle}
                    value={SalesCode}

                    onChange={(e) => setSalesCode(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Person Name
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom"
                    style={inputStyle}
                    value={SalesPersonName}
                    onChange={(e) => setSalesPersonName(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Email ID
                  </label>
                  <input
                    type="email"
                    className="form-control border-0 border-bottom"
                    style={inputStyle}
                    value={EmailID}
                    onChange={(e) => setEmailID(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Language
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom"
                    style={inputStyle}
                    value={Language}
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom"
                    style={inputStyle}
                    value={Role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                {/* 2. REMOVED the 'Sales Team' Input Field block here */}
                {/* <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Sales Team
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom"
                    style={{ boxShadow: "none" }}
                    value={SalesTeam}
                    onChange={(e) => setSalesTeam(e.target.value)}
                  />
                </div> */}
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Status
                  </label>
                  <Select
                    type="text"
                    placeholder="Select Status"
                    className="form-control border-0 "
                    styles={selectCustomStyles}
                    value={selectedSalesPersonStatus}
                    onChange={handleChangeSalesPersonStatus}
                    options={filteredOptionSalesPersonStatus}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Bussiness Domain
                  </label>
                  <Select
                    placeholder="Select Bussiness Domain"
                    className="form-control border-0 "
                    value={selectedDomainStatus}
                    onChange={handleChangeDomain}
                    options={filteredOptionDomain}
                    styles={selectCustomStyles}
                    isMulti
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex justify-content-start">
                    Reffered By
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom"
                    value={refferedBy}
                    style={inputStyle}
                    onChange={(e) => setRefferedBy(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {mode === "create" ? (
              <button
                className="btn btn-success me-2 text-center"
                onClick={handleInsert}
                style={{ color: "white" }}
                title="Save"
              >
                <i className="bi bi-save me-2"></i> Save
              </button>
            ) : (
              <button
                className="btn btn-success me-2 text-center"
                onClick={handleUpdate}
                style={{ color: "white" }}
                title="Update"
              >
                <i className="bi bi-pencil-square me-2"></i> Update
              </button>
            )}

            <button className="btn btn-danger px-4" title="Discard" onClick={onSalespersonClose}>
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesperson;