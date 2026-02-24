import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SalespersonSearch from "./SalespersonSearch";
import CreatableSelect from "react-select/creatable";
import { emailInputStyle, emailInputFocusStyle } from "./formStyles";
import AddSalesperson from "./addSalesperson";
const config = require("../../Apiconfig");

const CreateCampaignModal = ({ showCampaign, onCloseCampaign, typedValue, onSuccess }) => {
  const [error, setError] = useState("");
  const [Campaign_ID, setCampaign_ID] = useState("");
  const [CampaignName, setCampaignName] = useState("");
  const [Responsible, setResponsible] = useState("");
  const [TagName, setTagName] = useState("");
  const [showSpModal, setShowSpModal] = useState(false);
  const [addShowSpModal, setAddShowSpModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [salespersonOptions, setSalespersonOptions] = useState([]);
  const [pendingResponsible, setPendingResponsible] = useState(null);

    useEffect(() => {
    if (typedValue) {
      setCampaignName(typedValue);
    }
  }, [typedValue]); 

  const fetchSalesperson = async (selectValueAfterFetch) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/salesPersonDropdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();

      const formattedOptions = data.map((option) => ({
        value: option.SalesCode,
        label: `${option.SalesCode} - ${option.SalesPersonName}`,
        SalesPersonName: option.SalesPersonName
      }));

      setSalespersonOptions(formattedOptions);

      if (selectValueAfterFetch) {
        const matched = formattedOptions.find(
          (opt) => opt.SalesPersonName.toLowerCase() === selectValueAfterFetch.toLowerCase()
        );
        if (matched) setResponsible(matched.value);
      }

    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchSalesperson();
  }, []);

  if (!showCampaign) return null;

  const handleInsert = async () => {
    if (!Campaign_ID || !CampaignName || !Responsible || !TagName) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_CampaignInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CampaignID: Campaign_ID,
          CampaignName: CampaignName,
          Responsible: Responsible,
          TagName: TagName,
          Created_by: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!");
        onCloseCampaign();
        if (onSuccess) onSuccess(CampaignName);
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


  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "600px",
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          // overflow: "hidden",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
          }}
        >
          <h3 style={{ margin: 0, color: "black" }}>Create Campaign</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <span
              style={{
                cursor: "pointer",
                fontSize: "18px",
                color: "#444",
              }}
              onClick={onCloseCampaign}
              title="Close"
            >
              ✕
            </span>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
          }}
        >
          <div className="row mb-3">
            <div
              className="col-md-6 text-start"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <label
                style={{
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Campaign ID
              </label>
              <input
                type="text"
                placeholder=""
                value={Campaign_ID}
                onChange={(e) => setCampaign_ID(e.target.value)}
                style={{
                  ...emailInputStyle,
                  ...(isFocused === "companyGSTIn" ? emailInputFocusStyle : {}),
                  width: "250px",
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>

            {/* Source Name */}
            <div
              className="col-md-6 text-start"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <label
                style={{
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Campaign Name
              </label>
              <input
                type="text"
                placeholder=""
                value={CampaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                style={{
                  ...emailInputStyle,
                  ...(isFocused === "companyGSTIn" ? emailInputFocusStyle : {}),
                  width: "250px",
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
            <div
              className="col-md-6 text-start"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <label
                style={{
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Responsible
              </label>
              <div style={{ flex: 1 }}>
                <CreatableSelect
                  className="custom-input"
                  isClearable
                  style={{ outline: "none" }}
                  options={[...salespersonOptions, { value: "search_more", label: "Search more..." }]}
                  value={
                    salespersonOptions.find((opt) => opt.value === Responsible) ||
                    (Responsible ? { value: Responsible, label: Responsible } : null)
                  }
                  getOptionLabel={(option) =>
                    option.value === "search_more"
                      ? <span style={{ color: "blue", cursor: "pointer" }}>{option.label}</span>
                      : option.label
                  }
                  onChange={(newValue) => {
                    if (newValue) {
                      if (newValue.value === "search_more") {
                        setShowSpModal(true);
                      } else {
                        setResponsible(newValue.value);
                      }
                    } else {
                      setResponsible(null);
                    }
                  }}
                  onCreateOption={(inputValue) => {
                    setPendingResponsible(inputValue);
                    setAddShowSpModal(true);
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                    }),
                    indicatorSeparator: () => ({ display: "none" }),
                  }}
                />
                {/* Button inside input */}
                {/* <button
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "0%",
                    borderRadius: "2px",
                    boxShadow: "0",
                  }}
                  className="p-1"
                  onClick={() => setShowSpModal(true)}
                >
                  <i class="bi bi-plus"></i>
                </button> */}
                <SalespersonSearch
                  showSpSearch={showSpModal}
                  onSpSearchClose={() => setShowSpModal(false)}
                  onSalespersonSaved={(name) => {
                    setResponsible(name);
                    setShowSpModal(false);
                  }}
                  onSaveSP={(selectedsetSalesperson) => {
                    setResponsible(selectedsetSalesperson);
                    setShowSpModal(false);
                  }}
                  title="Search Responsible"
                />
                <AddSalesperson
                  showSalesperson={addShowSpModal}
                  onSalespersonClose={() => setAddShowSpModal(false)}
                  typedValue={pendingResponsible}
                  onSuccess={(newValue) => {
                    fetchSalesperson(newValue);
                    setPendingResponsible(null);
                  }}
                  title="Create Responsible"
                />
              </div>
            </div>
            <div
              className="col-md-6 text-start"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <label
                style={{
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Tags
              </label>
              <input
                type="text"
                placeholder=""
                value={TagName}
                onChange={(e) => setTagName(e.target.value)}
                style={{
                  ...emailInputStyle,
                  ...(isFocused === "companyGSTIn" ? emailInputFocusStyle : {}),
                  width: "250px",
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>

            {/* <div className="col-md-6 text-start" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                Status
              </label>
              <Select
                type="text"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    border: "none",
                    borderBottom: state.isFocused
                      ? "2px solid #17a2b8"
                      : "2px solid #ccc",
                    boxShadow: "none",
                    borderRadius: "0",
                    backgroundColor: "transparent",
                    fontSize: "14px",
                    fontWeight: 500,
                    width: "250px",
                  }),
                  indicatorSeparator: () => ({ display: "none" }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: "#666",
                    ":hover": { color: "#17a2b8" },
                  }),
                }}
                value={addCampaignStatus}
                onChange={handleAddCampaignStatus}
                options={filteredOptionaddCampaignStatusStatus}
              />
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            gap: "10px",
            padding: "20px",
            borderTop: "1px solid #eee",
          }}
        >
          <button
            style={{
              // backgroundColor: "#6c4f69",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            className="btn btn-success text-center"
            onClick={handleInsert}
            title="Save"
          >
            Save
          </button>
          <button
            style={{
              // backgroundColor: "#f0f1f2",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            title="Discard"
            className="btn btn-danger text-center"
            onClick={onCloseCampaign}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
