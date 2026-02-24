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
    <div className="container-fluid Topnav-screen popupadj  popup my-5 ">
      {/* Top nav */}
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
         <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
           <div className="modal-header">
        <div className="d-flex justify-content-between flex-wrap p-1">
          <div className="d-flex justify-content-start">
            <h1 className="">Campaign</h1>
          </div>
          
          <div className="d-flex justify-content-end">
            <addbutton className="mt-2 "
            //  onClick={handleNavigate}
             >
              <i class="bi bi-x fs-5 text-dark fs-4"></i>
            </addbutton>
          </div></div></div>
    </div></div>
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
            <h4 className="me-5"  style={{margin :10,marginLeft:200,color:'black'}}>1-9/9</h4>
          <i class="bi bi-chevron-left me-5" style={{margin :10,color:'black'}}></i>
          <i class="bi bi-chevron-right"  style={{margin :10,color:'black'}}></i>
        </div>
      </div>
    </div>
 <div className="shadow-lg p-0 mb-2 bg-white rounded mt-2">
                    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" ,margin:"30" }}>
                           <AgGridReact
                             rowData={[]}
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
</div>
          
    )

}