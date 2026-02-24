import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import SalespersonSearch from "./SalespersonSearch";
import config from "../../Apiconfig";
import Company from "./company.png";

const styles = {
  largeTitleInput: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    border: "none",
    borderBottom: "2px solid #ccc",
    outline: "none",
    width: "100%",
    padding: "4px 0",
    transition: "border-color 0.2s ease",
    marginLeft: "0"
  },
  saveButton: {
    fontWeight: "600",
    fontSize: "14px",
    borderRadius: "8px",
    padding: "6px 20px",
    marginLeft: "20px",
    whiteSpace: "nowrap",
  },
  baseInputUnderline: {
    display: "block",
    width: "100%",
    border: "none",
    borderBottom: "2px solid #ccc",
    outline: "none",
    padding: "6px 2px",
    marginTop: "4px",
    fontSize: "14px",
    transition: "border-color 0.2s ease",
  },
  label: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#555",
  },
  contactListItem: {
    fontSize: "14px",
  },
};

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    border: "none",
    borderBottom: state.isFocused ? "2px solid #007bff" : "2px solid #ccc",
    borderRadius: 0,
    boxShadow: "none",
    backgroundColor: "transparent",
    minHeight: "30px",
    "&:hover": {
      borderBottom: "2px solid #007bff",
    },
  }),
  valueContainer: (base) => ({ ...base, padding: "0px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: "transparent" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "2px" }),
};

const SalesTeamHelp = ({ showSalesTeam, onCloseSalesTeam, selectedColumnId,initialData }) => {
  const [Sales_Team, setSales_Team] = useState("");
  const [Email_alias, setEmailAlias] = useState("");
  const [Emails_From, setEmailsFrom] = useState("");
  const [Sales_code, setSales_code] = useState("");
  const [selectedSalesCode, setSelectedSalesCode] = useState("");
    const [SelectedTeamLeader, setSelectedTeamLeader] = useState("");

  const [loading, setLoading] = useState(false);
  const [SalesCode, setSalesCode] = useState("");
  const [salesDrop, setSalesDrop] = useState([]);
  const [showSalesperson, setShowSalesperson] = useState(false);
  const [Sales, setSales] = useState([]);
  const [error, setError] = useState("");
 const mode = initialData ? "update" : "create";

  const handleSalesTeam = (option) => {
  setSelectedSalesCode(option);
};


  useEffect(() => {
    if (initialData) {
     
       setSales_Team(initialData.Sales_Team || "");
    setEmailAlias(initialData.Email_alias || "");
    setEmailsFrom(initialData.Emails_From || "");
    setSales_code(initialData.Sales_ID || "");
     
      if (initialData.Team_Leader && filteredSalesTeam.length > 0) {
  const matchedOption = filteredSalesTeam.find(
    option => option.value === initialData.Team_Leader
  );
  setSelectedSalesCode(matchedOption || null);
}

    } else {
     
      clearInputFields();
    }
  }, [initialData]);

  const clearInputFields = () => {
  setSales_Team("");
  setEmailAlias("");
  setEmailsFrom("");
  setSales_code("");
  setSelectedSalesCode(null);
  setSales([]);
};


  const filteredSalesTeam = Array.isArray(salesDrop)
    ? salesDrop.map((option) => ({
      value: option.SalesCode,
      label: `${option.SalesCode} - ${option.SalesPersonName}`,
    }))
    : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/GetSalesperson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSalesDrop(data); // Store the fetched gender options in state
        }
      })
      .catch((error) => {
        console.error("Error fetching gender data:", error);
      });
  }, []);

  const handleUpdate = async () => {

  if (
    !Sales_Team ||
    !selectedSalesCode ||
    !Email_alias ||
    !Emails_From
  ) {
    toast.warning("Please fill in all required fields before updating.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${config.apiBaseUrl}/CRM_SalesTeam_HDRUpdate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Sales_ID: Sales_code,
        Sales_Team: Sales_Team,
        Team_Leader: selectedSalesCode?.value || "",
        Email_alias: Email_alias,
        Emails_From: Emails_From,
        Company_code: sessionStorage.getItem("selectedCompanyCode"),
        modified_by: sessionStorage.getItem("selectedUserCode"),
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success(result.message || "Sales Team updated successfully!");
      onCloseSalesTeam();
    } else {
      toast.warning(result.message || "Failed to update Sales Team!");
    }

  } catch (error) {
    console.error("Error updating Sales Team:", error);
    toast.error(`Error updating Sales Team: ${error.message}`);
  } finally {
    setLoading(false);
  }
};



  const handleSave = async () => {

  if (
    !Sales_Team ||
    !selectedSalesCode ||
    !Email_alias ||
    !Emails_From
  ) {
    setError(" ");
    toast.warning("Error: Missing required fields");
    return;
  }

  setLoading(true);

  try {
    const salesPersonCodes = (Sales || [])
      .map((person) => person.SalesCode)
      .filter(Boolean)
      .join(",");

    const response = await fetch(`${config.apiBaseUrl}/CRM_SalesTeam_HDRInsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Sales_Team: Sales_Team,
        Team_Leader: selectedSalesCode?.value || "",
        Email_alias: Email_alias,
        Emails_From: Emails_From,
        Company_code: sessionStorage.getItem("selectedCompanyCode"),
        Created_by: sessionStorage.getItem("selectedUserCode"),
        Sales_person: salesPersonCodes,
        Sales_ID: Sales_code
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success(result.message || "Sales Team saved successfully!");
      onCloseSalesTeam();
    } else {
      toast.warning(result.message || "Failed to save Sales Team!");
    }

  } catch (error) {
    toast.error(`Error inserting data: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  

  if (!showSalesTeam) return null;

  const handleSalespersonSelect = (salesperson) => {
    setSales((prev) => [...prev, salesperson]);
    setShowSalesperson(false);
  };

  const handleDeleteCard = (indexToRemove) => {
    setSales((prevSales) => prevSales.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div
      className="modal d-block mt-5 popupadj popup"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        minWidth: "530px",
      }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-2">
          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">Sales Team</h5>
              <button className="btn btn-danger" onClick={onCloseSalesTeam}>
                <i className="bi bi-x-lg" title="Close"></i>
              </button>
            </div>
          </div>

          <div className="modal-body">
            <div className="row mb-1">
              <div className="col-md-12">
                <div className="d-flex row mb-3">
                  <div className="col-md-12">
                    <input
                      type="text"
                      placeholder="Sales Team"
                      value={Sales_Team}
                      onChange={(e) => setSales_Team(e.target.value)}
                      style={styles.largeTitleInput}
                      onFocus={(e) => (e.target.style.borderBottom = "2px solid #007bff")}
                      onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                    />
                  </div>
                </div>

                <div className="d-flex row mb-2">
                  <div className="col-md-6">
                    <label className="form-label d-flex justify-content-start">
                      Team Leader
                    </label>
                    <Select
                      type="email"
                      value={selectedSalesCode}
                      onChange={handleSalesTeam}
                      options={filteredSalesTeam}
                      styles={customSelectStyles}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={styles.label} className="d-flex justify-content-start">
                    Sales Code
                    </label>
                    <div style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}>
                      <input
                        type="text"
                        value={Sales_code}
                        onChange={(e) => setSales_code(e.target.value)}
                        style={{ ...styles.baseInputUnderline, flex: 1, padding: "6px 8px" }}
                        onFocus={(e) => (e.target.style.borderBottom = "2px solid #007bff")}
                        onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label style={styles.label} className="d-flex justify-content-start">
                      Accept Emails From
                    </label>
                    <div style={{ display: "flex", alignItems: "center", position: "relative", width: "100%" }}>
                      <input
                        type="text"
                        value={Emails_From}
                        onChange={(e) => setEmailsFrom(e.target.value)}
                        style={{ ...styles.baseInputUnderline, flex: 1, padding: "6px 8px" }}
                        onFocus={(e) => (e.target.style.borderBottom = "2px solid #007bff")}
                        onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                      />
                    </div>
                  </div>
                   <div className= "col-md-6" style={{ marginBottom: "20px" }}>
                  <label style={styles.label} className="d-flex justify-content-start">
                    Email Alias
                  </label>
                  <div className="d-flex justify-content-between gap-3">
                    <input
                      type="text"
                      
                      value={Email_alias}
                      onChange={(e) => setEmailAlias(e.target.value)}
                      style={styles.baseInputUnderline}
                      onFocus={(e) => (e.target.style.borderBottom = "2px solid #007bff")}
                      onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                    />
                    {/* <input
                      type="text"
                      placeholder="Enter Email"
                      style={styles.baseInputUnderline}
                      onFocus={(e) => (e.target.style.borderBottom = "2px solid #007bff")}
                      onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                    /> */}
                  </div>
                </div>
                </div>

               
                <div style={{ marginBottom: "20px" }}>
                  <div className="tab-content p-3 rounded">
                    <div>
                      <div className="row row-cols-1 row-cols-md-2 g-3">
                        {(Sales || []).map((c, index) => (
                          <div
                            key={index}
                            className="col position-relative"  
                            style={{ cursor: "pointer" }}
                          >
                            <div className="card h-100 p-1 rounded-0 position-relative shadow-sm">
                              <i
                                className="bi bi-x-circle-fill text-danger position-absolute"
                                style={{
                                  top: "5px",
                                  right: "5px",
                                  cursor: "pointer",
                                  fontSize: "18px",
                                }}
                                onClick={() => handleDeleteCard(index)} 
                              ></i>

                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <img
                                    src={c?.ImageUrl || Company}
                                    alt="contact icon"
                                    className="rounded-0 ms-1"
                                    style={{ width: "60px", height: "auto" }}
                                  />
                                </div>
                                <div>
                                  {c?.SalesPersonName && (
                                    <li
                                      className="card-text ms-2 mb-1 text-start"
                                      style={styles.contactListItem}
                                    >
                                      <i className="bi bi-person-fill me-2"></i>
                                      {c.SalesPersonName}
                                    </li>
                                  )}
                                  {c?.EmailID && (
                                    <li
                                      className="card-text ms-2 mb-1 text-start"
                                      style={styles.contactListItem}
                                    >
                                      <i className="bi bi-envelope-fill me-2"></i>
                                      {c.EmailID}
                                    </li>
                                  )}
                                  {c?.Role && (
                                    <li
                                      className="card-text ms-2 mb-1 text-start"
                                      style={styles.contactListItem}
                                    >
                                      <i className="bi bi-person-fill-gear me-2"></i>
                                      {c.Role}
                                    </li>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="col">
                          <div
                            className="card h-100 p-4 rounded-0 d-flex justify-content-center align-items-center"
                            onClick={() => setShowSalesperson(true)}
                          >
                            <span className="text-success">Add Salesperson</span>
                          </div>
                        </div>
                        <SalespersonSearch
                          showSpSearch={showSalesperson}
                          onSpSearchClose={() => setShowSalesperson(false)}
                          onSaveTeam={handleSalespersonSelect}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }} className="modal-footer d-flex justify-content-end ">
             {mode === "create" ? (
    <button
      className="btn btn-success me-2 text-center"
      onClick={handleSave}
      title="Save"
      style={{ color: "white" }}
    >
      <i className="bi bi-save me-2"></i> Save
    </button>
  ) : (
    <button
      className="btn btn-success me-2 text-center"
      onClick={handleUpdate}
      title="Update"
      style={{ color: "white" }}
    >
      <i className="bi bi-pencil-square me-2"></i> Update
    </button>
  )}
            <button
              type="button"
              className="btn btn-danger px-4"
              title="Discard"
              onClick={onCloseSalesTeam}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SalesTeamHelp;
