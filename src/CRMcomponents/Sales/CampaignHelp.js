import { useState, useMemo,useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ToastContainer, toast } from 'react-toastify';

import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const config = require("../Apiconfig");


const CampaignHelp = ({ onCloseC }) => {
 const [CampaignID, setCampaignID] = useState("");
  const [CampaignName, setCampaignName] = useState("");
  const [Responsible, setResponsible] = useState("");
  const [TagName, setTagName] = useState("");
    const [loading, setLoading] = useState(false);
    const[status,setStatus]=useState("");
    const [showHelp, setShowHelp] = useState(false);


const handleSave = async () => {
  
  try {
    const data = {
      CampaignID: CampaignID ,
      CampaignName,
      Responsible: Responsible,
      TagName,
      status: status,
      company_code: sessionStorage.getItem("selectedCompanyCode"),
      keyfield: sessionStorage.getItem("selectedKeyField"),
      Created_by: sessionStorage.getItem("selectedUserCode"),
    };

    setLoading(true);

    const response = await fetch(`${config.apiBaseUrl}/CRM_CampaignInsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success("Campaign inserted successfully!");

    
      if (result.CampaignID) {
        setCampaignID(result.CampaignID);
      }

   
      setCampaignName("");
      setResponsible("");
      setTagName("");
      setStatus("Active");
    } else {
      toast.error(result.message || "Failed to insert campaign");
    }
  } catch (error) {
    console.error("Error inserting campaign:", error);
    toast.error("Error inserting campaign: " + error.message);
  } finally {
    setLoading(false);
  }
};



   
    return(
       <div className="container-fluid Topnav-screen">
                 <ToastContainer position="top-right" className="toast-design" theme="colored" />
       
      {/* Top nav */}
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
        <div className="d-flex justify-content-between flex-wrap p-1">
          <div className="d-flex justify-content-start">
            <h1 className="">Create Campaign</h1>
          </div>
             <div className="d-flex justify-content-end m-end">
            <addbutton className="mt-2 "
            //  onClick={handleNavigate}
             >
              
              <i class="bi bi-x fs-5 text-dark fs-4"></i>
            </addbutton>
          </div></div>
          </div>
   <div className="shadow-lg p-3 bg-white rounded">
             <div className="d-flex align-items-center">
            {/* <button className="btn btn-light btn-sm me-2">
              <i className="bi bi-arrow-left"></i>
            </button>
            <h5 className="mb-0">Create Campaign</h5>*/}
          </div>

          <div class="d-flex align-items-center">
  <button class="btn btn-outline-secondary btn-sm ms-auto">
    New
  </button>
</div>
</div>

         <div className="shadow-lg p-3 bg-white rounded">

         
    <div className="mb-3 d-flex align-items-center">
  <label className="form-label fw-bold me-3 mb-0" style={{ width: "150px",marginBottom:"30px" }}>
    Campaign ID
  </label>
  <input
    type="text"
    className="form-control"
    value={CampaignID}
    placeholder="e.g. Black Friday"
    onChange={(e) => setCampaignID(e.target.value)}
       style={{  display: "block",width: "100%", border: "none", borderBottom: "2px solid #ccc",outline: "none", marginBottom:"30px"}}
      

      />

</div>

    <div className="mb-3 d-flex align-items-center">
  <label className="form-label fw-bold me-3 mb-0" style={{ width: "150px",marginBottom:"30px" }}>
    Campaign Name
  </label>
  <input
    type="text"
    className="form-control"
    value={CampaignName}
    onChange={(e) => setCampaignName(e.target.value)}
    placeholder="e.g. Black Friday"
       style={{
                                display: "block",
                                width: "100%",
                                border: "none",
                                borderBottom: "2px solid #ccc",
                                outline: "none",
                                marginBottom:"30px"}}
    
  />
</div>

      <div className="mb-3 d-flex align-items-center">
  
  <label className="form-label fw-bold me-3 mb-0" style={{ width: "150px" }}>
    Responsible
  </label>

   <div className="d-flex align-items-center">
    <span
      className="rounded-circle bg-danger text-white d-inline-flex justify-content-center align-items-center"
      style={{ width: "30px", height: "30px", fontSize: "14px" }}
    >
      S
    </span>
    <input
    type="text"
    className="form-control"
    value={Responsible}
    onChange={(e) => setResponsible(e.target.value)}
    placeholder="sara"
       style={{  display: "block", width: "100%",  border: "none", borderBottom: "2px solid #ccc",outline: "none", marginBottom:"30px",marginTop:"20px",marginLeft:"20px" }}
    
  />
  </div>
</div>

        {/* Tags Section */}
        <div className="mb-3 d-flex align-items-center">
  <label className="form-label fw-bold me-3 mb-0" style={{ width: "150px",marginBottom:"20px" }}>
    Tags
  </label>
  <input
    type="text"
    className="form-control"
    value={TagName}
    onChange={(e) => setTagName(e.target.value)}
    placeholder="e.g. Black Friday"
       style={{ display: "block", width: "100%",border: "none",marginBottom:"20px",marginTop:"30Px"}}
    
  />


        {/* Buttons */}
        <div className="d-flex justify-content-end mt-3">
          <button onClick={handleSave} className="btn me-2" style={{ backgroundColor: "#8C6A7D", color: "white" }}>
          
            Save
          </button>
          <button className="btn btn-light"  onClick={() => setShowHelp(false)}>Discard</button>
        
        </div>
      </div>
    </div>
    </div>
    </div>
</div>
</div>
  );
}

export default CampaignHelp;