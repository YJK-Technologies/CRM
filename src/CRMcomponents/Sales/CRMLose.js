import React, { useState, useEffect } from "react"
import { toast } from 'react-toastify';
import { emailInputStyle, emailInputFocusStyle, companySelectStyles } from "./formStyles";
const config = require('../../Apiconfig');


const CreateLostModal = ({ showSource, onCloseSource, Id, SalesTeam, Sales_man_code, typedValue, onSuccess }) => {


  const [isFocused, setIsFocused] = useState(false);

  const [Reason_for_Lose, setReason_for_Lose] = useState('');
  const [Description, setDescription] = useState('');

  useEffect(() => {
  if (typedValue) {
    setDescription(typedValue);
  }
}, [typedValue]); 
  
  if (!showSource) return null;

 const handleInsert = async () => {
  // Basic validation
  if (!Reason_for_Lose) {
    toast.warning("Please enter a reason for loss.");
    return;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/CRM_Lose_Insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        OpportunityID: Id,
        SalesTeam: SalesTeam,
        Sales_man_code: Sales_man_code,
        Reason_for_Lose: Reason_for_Lose,
        Description: Description,
        Created_by: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem('selectedCompanyCode'),
      }),
    });

    if (response.ok) {
      toast.success("Marked as lost successfully!");
      console.log("Data inserted successfully");

      // Close the popup
      onCloseSource();

      // Notify parent to change button to 'Restore'
      if (onSuccess) onSuccess();

      // Optionally reset form fields after success
      setReason_for_Lose('');
      setDescription('');
    } else {
      const errorResponse = await response.json();
      console.error("Server error:", errorResponse.message);
      toast.warning(errorResponse.message || "Failed to mark as lost.");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    toast.error("Error inserting data: " + error.message);
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
          <h3 style={{ margin: 0, color: 'black' }}>Mark Lost</h3>
          <div style={{ display: 'flex', gap: '10px' }} title="Close">
            <span  className="btn btn-danger"
              style={{
                cursor: 'pointer',
                fontSize: '18px',
              }}
              onClick={onCloseSource}
            >
              <i className="bi bi-x-lg"></i>
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
         
        }}>
          {/* Lost Reason */}
          <div style={{display: "flex",alignItems: "center",gap: "10px",}}>
            <label style={{fontSize: "16px",color: "#333",minWidth: "80px",fontWeight: '500',}}>
              Lost Reason:
            </label>
            <input
              type="text"
              placeholder=""
              value={Reason_for_Lose}
              onChange={(e) => setReason_for_Lose(e.target.value)}
              style={{
                ...emailInputStyle,
                ...(isFocused === "companyGSTIn" ? emailInputFocusStyle : {}),
                width: "250px",
                marginBottom:"15px",
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          </div>
          <div style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          
        }}>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="col-md-6 text-start" style={{ fontWeight: '500', color: '#333', marginBottom: '1px' }}>
              Description
            </label>
            <input
              type="text"
              placeholder=""
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                ...emailInputStyle,
                ...(isFocused === "companyGSTIn" ? emailInputFocusStyle : {}),
                width: "550px",
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          padding: '20px',
          borderTop: '1px solid #eee'
        }}>
          <button className="btn btn-success" title="Mark as Lost" style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
            onClick={handleInsert} title="Mark as Lost"
          >
            Mark as Lost
          </button>
          <button className="btn btn-danger" style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
            onClick={onCloseSource} title="Discard"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLostModal;
