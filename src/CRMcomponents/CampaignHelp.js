




export default function CampaignHelp(){
    return(
       <div className="container-fluid Topnav-screen">
      {/* Top nav */}
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap p-1">
          <div className="d-flex justify-content-start">
            <h1 className="">Create Campaign</h1>
          </div>
          </div>
             <div className="shadow-lg p-3 bg-white rounded">
      <div className="justify-content-between flex-wrap p-3 w-100">
        <div className="d-flex justify-content-center w-100">
          <div className="input-group w-50">
          
            <span className="input-group-text bg-white">
           <button classname="success">New</button>
            </span>
            </div>
          </div>
              <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Campaign Name
                              </label>
                            </div>
                          <input
                                type="text"
                                style={{
                                display: "block",
                                width: "500px",
                                border: "none",
                                borderBottom: "2px solid #ccc",
                                outline: "none",
                                padding: "6px 2px",
                                marginTop: "7px",
                                marginLeft:"50px",
                                fontSize: "14px",
                                transition: "border-color 0.2s ease",
                                }}
                                onFocus={(e) => (e.target.style.borderBottom = "2px solid #FFC107")}
                                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                            />

                            <div></div>
            
            </div>

              <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels mt-5">
                                Responsible
                              </label>
                            </div>
                               <input
                                type="text"
                                style={{
                                  margin:"50px",
                                 

                                 display: "block",
                                width: "50px",
                                marginLeft:"70px",
                                // fontSize: "14px",
                                // transition: "border-color 0.2s ease",
                                }}
                                onFocus={(e) => (e.target.style.borderBottom = "2px solid #FFC107")}
                                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                            />

                         
                            <div></div>
            
            </div>

              

               <div class=" justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Tags
                              </label>
                            </div>
                            
                         
                            <div></div>
            
            </div>

            <div className="d-flex justify-content-end gap-2 m-3">
   <button type="submit" className="btn btn-primary">
    Save
  </button>
  
  <button type="button" className="btn btn-secondary">
    Discard
  </button>


 
</div>

            
            </div></div>

          </div></div>
    )
}