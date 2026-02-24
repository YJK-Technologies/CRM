import { useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer,toast } from 'react-toastify';
const config = require('./Apiconfig');



const columnDefs = [

  {
    checkboxSelection: true,
    headerName: "Vendor Code",
    field: "vendor_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 250,
    maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Name",
    field: "vendor_name",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 250,
    maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
      headerName: "Company Code",
      field: "company_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address1",
      field: "vendor_addr_1",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address2",
      field: "vendor_addr_2",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address3",
      field: "vendor_addr_3",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address4",
      field: "vendor_addr_4",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Area Code",
      field: "vendor_area_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor State Code",
      field: "vendor_state_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Country Code",
      field: "vendor_country_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Pan No",
      field: "panno",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
     },
    {
      headerName: "Gst No",
      field: "vendor_gst_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
    },
    {
      headerName: "Vendor IMEX No",
      field: "vendor_imex_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      
    },
    {
      headerName: "Vendor Office No",
      field: "vendor_office_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
     
    },
    {
      headerName: "Vendor Resi No",
      field: "vendor_resi_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Mobile No",
      field: "vendor_mobile_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
   
    },
    {
      headerName: "Fax No",
      field: "vendor_fax_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toLowerCase() : '';
      },
    },
  {
    headerName: "Email ID",
    field: "vendor_email_id",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toLowerCase() : '';
    },
  },
  {
  
    headerName: "Credit Limit",
    field: "vendor_credit_limit",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
 
  },
  {
    headerName: "Transport Code",
    field: "vendor_transport_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    },
  {
    headerName: "Salesman Code",
    field: "vendor_salesman_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
      headerName: "Broker Code",
      field: "vendor_broker_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Weekday Code",
      field: "vendor_weekday_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },

];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: false,
  flex: 1,
  
};
export default function DcToVendorPopup({ open, handleClose, handleToVendor }) {

  const [rowData, setRowData] = useState([]);
  const [vendor_code, setVendorCode] = useState("");
  const [vendor_name, setVendorName] = useState("");
  const [status, setStatus] = useState("");
  const [vendor_country_code, setCountryCode] = useState("");
  
  const handleSearchItem = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/vendorsearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vendor_code, vendor_name, status, vendor_country_code }) 
      });
      if (response.ok) {
      const searchData = await response.json();
      setRowData(searchData);
      console.log("data fetched successfully")
    } else if (response.status === 404) {
    
      toast.error("Data not found!").then(() => {
        setRowData([]);
        clearInputs([])
      });
      console.log("Data not found"); // Log the message for 404 Not Found
    } else {
      console.log("Bad request"); // Log the message for other errors
    }
  } catch (error) {
    console.error("Error fetching search data:", error);
  }
  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    setVendorCode("");
    setVendorName("");
    setStatus("");
    setCountryCode("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

const handleConfirm = () => {
  const selectedData = selectedRows.map(row => ({
    VendorCode: row.vendor_code,
    VendorName: row.vendor_name,
    Address1:row.vendor_addr_1,
    Address2:row.vendor_addr_2,
    Address3:row.vendor_addr_3,
    Address4:row.vendor_addr_4,
    MobileNo:row.vendor_mobile_no
  }));
  console.log('Selected Data:', selectedData);
  handleToVendor(selectedData);
  handleClose();
  clearInputs([]);
  setRowData([]);
  setSelectedRows([]);
}


  return (
    <div>
    {open && (
      <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontFamily: "Helvetica" }}>Vendor Help</h5>
           
                 <div><button type="button" className="btn btn-danger" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button></div>
            </div>
            <div className="modal-body">
              <div className="container ">
                <div className="row mb-3 ms-4">
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='Vendor_code'
                      className='exp-input-field form-control'
                      placeholder='Vendor Code'
                      value={vendor_code}
                      onChange={(e) => setVendorCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='Vendor Name'
                      className='exp-input-field form-control'
                      placeholder='Vendor Name'
                      value={vendor_name}
                      onChange={(e) => setVendorName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='Status'
                      className='exp-input-field form-control'
                      placeholder='Status'
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='ShortName'
                      className='exp-input-field form-control'
                      placeholder='Country Code'
                      value={vendor_country_code}
                      onChange={(e) => setCountryCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-auto mb-2">
                    <button className="pt-1 pb-1" onClick={handleSearchItem}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} /> 
                    </button>
                    <button className="pt-1 pb-1" onClick={handleReload}>
                    <i class="fa-solid fa-arrow-rotate-right"></i>
                    </button>
                    <button type="button" className="pt-1 pb-1 me-4" onClick={handleConfirm}>
                      <FontAwesomeIcon icon="fa-solid fa-check" />
                      </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                      <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="multiple"
                        pagination
                        onSelectionChanged={handleRowSelected}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
   