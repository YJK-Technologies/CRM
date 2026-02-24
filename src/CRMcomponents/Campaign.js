import { useState, useMemo,useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';




export default function Campaign() {
   const navigate = useNavigate();

   const handleClick = () => {
    navigate("/CampaignHelp"); 
  };


     const columnDefs = [
    { headerName: 'Name', field: 'Name' },
    { headerName: 'Responsible', field: 'Responsible' },
    { headerName: 'Stage', field: 'Stage' },
    { headerName: 'Tags', field: 'Tags' },
  
    ]
    return(
        <div className="container-fluid Topnav-screen">
      {/* Top nav */}
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap p-1">
          <div className="d-flex justify-content-start">
            <h1 className="">Campaign</h1>
        <button 
        // onClick={handleClose} 
        className="purbut btn btn-gray shadow-none rounded-0 h-70 fs-5" required title="Close">
       
      
        <i className="bi bi-x fs-5"></i>
      </button>
          </div>
          </div>
          </div>
            <div className="shadow-lg p-3 bg-white rounded">
      <div className="d-flex justify-content-between flex-wrap p-3 w-100">
        <div className="d-flex justify-content-center w-100">
          <div className="input-group w-50">
          
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted"></i>
            </span>

            <Select
              type="text"
              className="form-control"
              placeholder="Search"
            />
          </div>
            <h4 className="me-5"  style={{margin :10,color:'black'}}>1-9/9</h4>
          <i class="bi bi-chevron-left me-5" style={{margin :10,color:'black'}}></i>
          <i class="bi bi-chevron-right"  style={{margin :10,color:'black'}}></i>
        </div>
      </div>
    </div>
 <div className="shadow-lg p-0 mb-2 bg-white rounded mt-2">
                    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" ,margin:"30" }}>
                           <AgGridReact
                             rowData={[]} // Replace with real rowData
                             columnDefs={columnDefs}
                             pagination={true}
                             paginationPageSize={5}
                           />
                         </div>
                         <div className='m-3'>
                          <button className='m-3'  onClick={handleClick}>New</button>
                            <button className='m-3'>Close</button>
                         </div>
          </div>
          </div>

          
    )
}