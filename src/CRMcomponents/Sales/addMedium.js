import React, { useState, useEffect } from "react"
import { toast } from 'react-toastify';
import Select from 'react-select';
import { emailInputStyle, emailInputFocusStyle, companySelectStyles } from "./formStyles";

const config = require('../../Apiconfig');


const CreateMediumModal = ({ showMedium, onCloseMedium, typedValue, onSuccess }) => {
  const [error, setError] = useState("");
  const [Medium_ID, setMedium_ID] = useState('');
  const [MediumName, setMediumName] = useState('');
  const [addMediumStatusDrop, setaddMediumStatusDrop] = useState([]);
  const [addMediumStatus, setaddMediumStatus] = useState('');
  const [MediumStatus, setMediumStatus] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (typedValue) {
      setMediumName(typedValue);
    }
  }, [typedValue]);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setaddMediumStatusDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleAddMediumStatus = (addMediumStatus) => {
    setaddMediumStatus(addMediumStatus);
    setMediumStatus(addMediumStatus ? addMediumStatus.value : '');
  };

  const filteredOptionaddMediumStatusStatus = addMediumStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  if (!showMedium) return null;

  const handleInsert = async () => {

    if (
      !Medium_ID ||
      !MediumName ||
      !MediumStatus

    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_MediumInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Medium_ID: Medium_ID,
          MediumName: MediumName,
          Status: MediumStatus,
          Created_by: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!");
        onCloseMedium();
        if (onSuccess) onSuccess(MediumName);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '600px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #eee'
        }}>
          <h3 style={{ margin: 0, color: 'black' }}>Create Medium</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span
              style={{
                cursor: 'pointer',
                fontSize: '18px',
                color: '#444'
              }}
              onClick={onCloseMedium}
              title="Close"
            >
              ✕
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px'
        }}>

          <div className="row mb-3">
            <div className="col-md-6 text-start" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                Medium ID
              </label>
              <input
                type="text"
                placeholder=""
                value={Medium_ID}
                onChange={(e) => setMedium_ID(e.target.value)}
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
            <div className="col-md-6 text-start" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                Medium Name
              </label>
              <input
                type="text"
                placeholder=""
                value={MediumName}
                onChange={(e) => setMediumName(e.target.value)}
                style={{
                  ...emailInputStyle,
                  ...(isFocused === "companyGSTIn" ? emailInputFocusStyle : {}),
                  width: "250px",
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>

            <div className="col-md-6 text-start" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                value={addMediumStatus}
                onChange={handleAddMediumStatus}
                options={filteredOptionaddMediumStatusStatus}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'end',
          gap: '10px',
          padding: '20px',
          borderTop: '1px solid #eee'
        }}>
          <button style={{
            // backgroundColor: '#6c4f69',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
            className="btn btn-success text-center"
            onClick={handleInsert}
            title="Save"
          >
            Save
          </button>
          <button style={{
            // backgroundColor: '#f0f1f2',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
            onClick={onCloseMedium}
            title="Discard"
            className="btn btn-danger text-center"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMediumModal;
