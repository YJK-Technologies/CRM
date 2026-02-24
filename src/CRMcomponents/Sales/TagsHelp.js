import { useState } from 'react';
import { toast } from 'react-toastify';
const config = require("../../Apiconfig");

const   TagsHelp = ({ onCloseC, showTag, }) => {
const [tagName, setTagName] = useState("");
const [color, setColor] = useState("#f4d03f");
const [Loading, setLoading] = useState("#f4d03f");

 if (!showTag) return null;

 const handleSave = async () => {
   

   try {
     const data = {
       Tag_Name: tagName ,
       Tag_colour:color,
       Company_code: sessionStorage.getItem("selectedCompanyCode"),
       created_by: sessionStorage.getItem("selectedUserCode"),
     };
 
     setLoading(true);
 
     const response = await fetch(`${config.apiBaseUrl}/CRM_Tag_MasterInsert`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(data),
     });
 
     const result = await response.json();
 
     if (response.ok && result.success) {
       toast.success("TagName inserted successfully!");
 
     
       if (result.tagID) {
         setTagName(result.tagID);
       }
 
    
       setTagName("");
       setColor("");
      
     } else {
       toast.error(result.message || "Failed to insert TagName");
     }
   } catch (error) {
     console.error("Error inserting TagName:", error);
     toast.error("Error inserting TagName: " + error.message);
   } finally {
     setLoading(false);
   }
 };

  const handleSaveAndNew = () => {
    if (!tagName.trim()) {
      toast.warning("Please enter a tag name");
      return;
    }
    toast.success("Tag saved successfully!");
    console.log("Saved Tag:", { tagName, color });
    setTagName("");
    setColor("#f4d03f");
  };

  const handleDiscard = () => {
    onCloseC();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "500px",
          borderRadius: "6px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          overflow: "hidden",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 18px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h3 style={{ margin: 0, color: "#333" }}>Create Tags</h3>
          <span  className="btn btn-danger" title='Close'
            onClick={onCloseC}
            style={{ cursor: "pointer", fontSize: "18px",}}
          >
            <i className="bi bi-x-lg"></i>
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "500", color: "#333", marginBottom: "8px" }}>
              Tag Name
            </label>
            <input
              type="text"
              placeholder="Services"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "500", color: "#333", marginBottom: "8px" }}>
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: "40px",
                height: "30px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-END",
            gap: "10px",
            padding: "16px 20px",
            borderTop: "1px solid #eee",
          }}
        >
          <button title='Save'
            onClick={handleSave}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Save
          </button>

          {/* <button
            onClick={handleSaveAndNew}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Save & New
          </button> */}

          <button
            onClick={handleDiscard}
            style={{
              // backgroundColor: "btn-danger",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            className='btn btn-danger' title='Discard'
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsHelp;
