import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import { useLocation } from "react-router-dom";

const config = require('../Apiconfig');

function AttriDetInput({ }) {
  const [open2, setOpen2] = React.useState(false);

  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState('Cash');
  const [error, setError] = useState("");
  const code = useRef(null);
  const subcode = useRef(null);
  const detailname = useRef(null);
  const description = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const[ProjectDescription,setProjectDescription]=useState("");
  const[ProjectName,setProjectName]=useState("");
  const[projectCode,setProjectCode]=useState("");
  const[ProjectManager,setProjectManager]=useState("");
  const[EmployeeId,setEmployeeId]=useState("");
  const [StartDate, setStartDate] = useState('');
  const [ProjectID, setProjectID] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [PriorityLevel, setPriorityLevel] = useState('');
   const[selectedPriortyLeavel,setSelectedPriortyLeavel]=useState('');
   const[PriorityDrop,setPriorityDrop]=useState([]);
   const [TaskStatus, setTaskStatus] = useState('');
   const [status_type, setstatus_type] = useState("");
   const [TaskStatusDrop,setTaskStatusDrop] = useState('');
    const [statusdrop, setStatusdrop] = useState([]);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedTaskStatus, setSelectedTaskStatus] = useState('');
  const created_by = sessionStorage.getItem('selectedUserCode');





//   console.log(selectedRows);
//   const modified_by = sessionStorage.getItem("selectedUserCode");
  
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const [isUpdated, setIsUpdated] = useState(false); 


console.log(selectedRow)

//   const clearInputFields = () => {
//     setSelectedHeader("");
//     setAttributedetails_code("");
//     setAttributedetails_name("");
//     setDescriptions("");
//   };

//   useEffect(() => {
//     if (mode === "update" && selectedRow && !isUpdated) {
//       setSelectedHeader({
//         label: selectedRow.attributeheader_code,
//         value: selectedRow.attributeheader_code,
//       });
//       setAttributedetails_code(selectedRow.attributedetails_code || "");
//       setAttributedetails_name(selectedRow.attributedetails_name || "");
//       setDescriptions(selectedRow.descriptions || "");
     


//     } else if (mode === "create") {
//       clearInputFields();
//     }
//   }, [mode, selectedRow, isUpdated]);

//   useEffect(() => {
//     fetch(`${config.apiBaseUrl}/hdrcode`)
//       .then((data) => data.json())
//       .then((val) => setCodedrop(val));
//   }, []);

//   const filteredOptionHeader = statusdrop.map((option) => ({
//     value: option.attributeheader_code,
//     label: option.attributeheader_code,
//   }));

//   const handleChangeHeader = (selectedHeader) => {
//     setSelectedHeader(selectedHeader);
//     setAttributeheader_Code(selectedHeader ? selectedHeader.value : '');
//     setError(false);
//   };

//   const handleInsert = async () => {
//     if (!attributeheader_code || !attributedetails_code || !attributedetails_name) {
//       setError(" ");
//       return;
//     }
//     try {
//       const response = await fetch(`${config.apiBaseUrl}/addattridetData`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           company_code: sessionStorage.getItem('selectedCompanyCode'),
//           attributeheader_code,
//           attributedetails_code,
//           attributedetails_name,
//           descriptions,
//           created_by: sessionStorage.getItem('selectedUserCode')
//         }),
//       });
//       if (response.status === 200) {
//         console.log("Data inserted successfully");
//         setTimeout(() => {
//           toast.success("Data inserted successfully!", {
//             onClose: () => window.location.reload(), // Reloads the page after the toast closes
//           });
//         }, 1000);
//       } else if (response.status === 400) {
//         const errorResponse = await response.json();
//         console.error(errorResponse.message);
//         toast.warning(errorResponse.message, {
          
//         });
//       } else {
//         console.error("Failed to insert data");
//         toast.error('Failed to insert data', {
          
//         });
//       }
//     } catch (error) {
//       console.error("Error inserting data:", error);
//       toast.error('Error inserting data: ' + error.message, {
       
//       });
//     }
//   };

useEffect(() => {
  fetch(`${config.apiBaseUrl}/getPriorityLevel`)
    .then((data) => data.json())
    .then((val) => setPriorityDrop(val));
}, []);

const filteredOptionPriorityLevel = PriorityDrop.map((option) => ({
  value: option.attributedetails_name,
  label: option.attributedetails_name,
}));

const handleChangePriorityLevel = (selectedPriortyLeavel) => {
  setSelectedPriortyLeavel(selectedPriortyLeavel);
  setPriorityLevel(selectedPriortyLeavel ? selectedPriortyLeavel.value : '');
};

const handleChangestatus = (selectedstatus) => {
  setSelectedTaskStatus(selectedstatus);
  setstatus_type(selectedstatus ? selectedstatus.value : '');
};

const filteredOptionTransaction = statusdrop.map((option) => ({
  value: option.attributedetails_name,
  label: option.attributedetails_name,
}));

useEffect(() => {
  fetch(`${config.apiBaseUrl}/getTaskstatus`)
    .then((data) => data.json())
    .then((val) => setStatusdrop(val));
}, []);


  const handleSave = async () => {

    try {
      const data = {
        ProjectName,
        ProjectManager,
        ProjectDescription,
        StartDate,
        EndDate,
        PriorityLevel,
        TaskStatus:status_type,
        created_by: sessionStorage.getItem('selectedUserCode')

      };
  
      
        const response = await fetch(`${config.apiBaseUrl}/addProject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          const searchData = await response.json();
          console.log(searchData);
          const { ProjectID } = searchData[0];
          setProjectID(ProjectID);
          toast.success("Project data inserted successfully!");
         
          // setProjectName("");
          // setProjectManager("");
          // setProjectDescription("");
          // setStartDate("");
          // setEndDate("");
          // setPriorityLevel("");
          // setTaskStatus("");
          // setError("");
        }
        } catch (error) {
          setMessage('Error inserting data: ' + (error.response?.data?.message || error.message));
        } finally {
          setIsSaving(false);
        }
      };
    

  // const handleNavigateToForm = () => {
  //   navigate("/AddAttributeHeader", { selectedRows }); // Pass selectedRows as props to the Input component
  // };
  const handleNavigate = () => {
    navigate("/Project"); // Pass selectedRows as props to the Input component
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

  const handleClickOpen = (params) => {
    setOpen2(true);
    console.log("Opening popup...");
  };
  const handleClose = () => {
    setOpen2(false);
  };

  // const handleUpdate = async () => {
  //   if (
  //     !selectedHeader ||
  //     !attributedetails_code ||
  //     !attributedetails_name ||
  //     !descriptions 
      
  //   ) {
  //     setError(" ");
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/AttributeUpdate`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         attributeheader_code:selectedHeader.value,
  //         attributedetails_code,
  //         attributedetails_name,
  //         descriptions,
  //         created_by,
  //         modified_by
  //       }),
  //     });
  //     if (response.status === 200) {
  //       console.log("Data Updated successfully");
  //       // setIsUpdated(true); 
  //       clearInputFields();
  //       toast.success("Data Updated successfully!")
  //     } else if (response.status === 400) {
  //       const errorResponse = await response.json();
  //       console.error(errorResponse.message);
  //       toast.warning(errorResponse.message);
  //     } else {
  //       console.error("Failed to insert data");
  //       toast.error("Failed to insert data");
  //     }
  //   } catch (error) {
  //     console.error("Error Update data:", error);
  //     toast.error('Error Update data: ' + error.message);
  //   }
  // };

  

  
  return (
    <div class="container-fluid Topnav-screen ">
    <div className="">
    <div class="">
      <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      <div class="row ">
        <div class="col-md-12 text-center">
          <div >
          </div>
          <div>
            <div>
              <div className="shadow-lg p-0 bg-body-tertiary rounded">
                <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">{mode === "update"?'Update Projects':'Add Projects'}</h1>
              <h1 align="left" class="mobileview fs-4">Add Projects</h1>

              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">

              <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 mb-4">
          <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
            <div class="row ms-3 me-3 mb-3">
       
     
    
       <div className="col-md-3 form-group mb-2">
         <div className="exp-form-floating">
           <div className="d-flex justify-content-start">
             <div>
               <label htmlFor="EmployeeId" className="exp-form-labels">
                  Project Code
               </label>
             </div>
             <div>
               <span className="text-danger">*</span>
             </div>
           </div>
           <div class="d-flex justify-content-end">
           <input
             id="ProjectID"
             className="exp-input-field form-control p-2"
             type="text"
             placeholder=""
             required
             title="Please enter the company code"
             value={ProjectID}
             onChange={(e) => setProjectID(e.target.value)}
             maxLength={20}
           />
          

       
            
            
           </div>
          {/* {error && !EmployeeId && <div className="text-danger">Project Code should not be blank</div>} */}
           {/* {error && <div className="text-danger">{error}</div>} */}
         </div>
       </div>

    
               
         
             



             
                
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div><label for="cname" class="exp-form-labels">
                          Project Name
                      </label></div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="loanID"
                      type="text"
                      className="form-control exp-input-field p-2"
                     
                      maxLength={20}
                      value={ProjectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                {/* {error && !loanID && <div className="text-danger">Project Name should not be blank</div>} */}

                   
                  </div>
                </div>

          
               
              

               
                
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" class="exp-form-labels">
                          Project Manager
                      </label></div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="LoanEligibleAmount"
                      class="exp-input-field form-control p-2"
                      type="text"
                      placeholder=""
                      required title="Please enter the address"
                      value={ProjectManager}
                      onChange={(e) => setProjectManager(e.target.value)}

                      
                      
                   
                    />
                    {/* {error && !LoanEligibleAmount && <div className="text-danger">Project Manager should not be blank</div>} */}
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">
                       Project Description <div><span className="text-danger">*</span></div>
                        </label> </div>
                    </div>
                   
                    <textarea
                      id="Approvedby"
                      class="exp-input-field form-control "
                      required title="Please enter the founded date"
                     value={ProjectDescription}
                     onChange={(e) => setProjectDescription(e.target.value)}
                      />
                     
                     {/* {error && !approvedBy && <div className="text-danger">Project Description should not be blank</div>} */}

                    
                  
                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add2" class="exp-form-labels">
                         start Date
                      </label> </div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="StartDate"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the address"
                      value={StartDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      maxLength={100}
                    
                    />
                    {error && !StartDate && <div className="text-danger">Daily Task should not be blank</div>}
                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="add3" class="exp-form-labels  ">
                         End Date<div><span className="text-danger">*</span></div>
                    </label><input
                      id="EndDate"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the address"
                      value={EndDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      maxLength={100}
                  
                    />
                     {error && !EndDate && <div className="text-danger">Hours Taken should not be blank</div>}

                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="tcode" class="exp-form-labels">
                      Priority Level <div><span className="text-danger">*</span></div>
                    </label>
                    <Select
                      id="PriorityLevel"
                      className="exp-input-field"
                      type="text"
                      placeholder=""
                      value={selectedPriortyLeavel}
                      onChange={handleChangePriorityLevel}
                      options={filteredOptionPriorityLevel}
                      
                     
                    />
          {error && !PriorityLevel && <div className="text-danger">PriorityLevel should not be blank</div>}

                  </div>
                </div>

                
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <label for="tcode" class="exp-form-labels  ">
                      Task Status <div><span className="text-danger">*</span></div>
                    </label>
                    <Select
                      id="TaskStatus"
                      className="exp-input-field"
                      type="text"
                      placeholder=""
                      value={selectedTaskStatus}
                      onChange={handleChangestatus}
                      options={filteredOptionTransaction}
             
                      
                     
                    />
          {error && !selectedTaskStatus && <div className="text-danger">TaskStatus should not be blank</div>}

                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                <div class="exp-form-floating mt-2">
           <button onClick={handleSave}>
            <i class="fa-solid fa-floppy-disk"></i>
           </button>
           </div></div>


              </div>  
          </div>
        </div>
        </div>
    </div>
    </div>
    
    </div>
  );
}
export default AttriDetInput;