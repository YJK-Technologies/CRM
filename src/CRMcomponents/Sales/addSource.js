import { useState, useEffect } from "react"
import { toast } from 'react-toastify';
import { emailInputStyle, emailInputFocusStyle, companySelectStyles } from "./formStyles";
const config = require('../../Apiconfig');


const CreateSourceModal = ({ showSource, onCloseSource, typedValue, onSuccess }) => {

  const [error, setError] = useState("");
  const [Source_ID, setSource_ID] = useState('');
  const [SourceName, setSourceName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (typedValue) {
      setSourceName(typedValue);
    }
  }, [typedValue]);

  if (!showSource) return null;

  const handleInsert = async () => {

    if (!Source_ID || !SourceName) {
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_SourceInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Source_ID: Source_ID,
          SourceName: SourceName,
          Created_by: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!");
        onCloseSource(); // close modal
        if (onSuccess) onSuccess(SourceName);
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
          <h3 style={{ margin: 0, color: 'black' }}>Create Source</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span
              style={{
                cursor: 'pointer',
                fontSize: '18px',
                color: '#444'
              }}
              onClick={onCloseSource}
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
          {/* Source Id */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="col-md-6 text-start" style={{ fontWeight: '500', color: '#333', marginBottom: '8px' }}>
              Source Id
            </label>
            <input
              type="text"
              placeholder=""
              value={Source_ID}
              onChange={(e) => setSource_ID(e.target.value)}
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="col-md-6 text-start" style={{ fontWeight: '500', color: '#333', marginBottom: '8px' }}>
              Source Name
            </label>
            <input
              type="text"
              placeholder=""
              value={SourceName}
              onChange={(e) => setSourceName(e.target.value)}
              style={{
                ...emailInputStyle,
                ...(isFocused === "companyGSTIn" ? emailInputFocusStyle : {}),
                width: "250px",
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
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
            title="Save"
            onClick={handleInsert}
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
            title="Discard"
            className="btn btn-danger text-center"
            onClick={onCloseSource}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSourceModal;
