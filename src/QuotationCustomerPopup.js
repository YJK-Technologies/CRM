import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
const config = require('./Apiconfig');



const columnDefs = [

  {
    checkboxSelection: true,
    headerName: "Customer Code",
    field: "customer_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 250,
    maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer Name",
    field: "customer_name",
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
      headerName: "Pan no",
      field: "panno",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Customer GST No",
      field: "customer_gst_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Customer Address1",
      field: "customer_addr_1",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Customer Address2",
      field: "customer_addr_2",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Customer Address3",
      field: "customer_addr_3",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Customer Address4",
      field: "customer_addr_4",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Customer Area",
      field: "customer_area",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "State",
      field: "customer_state",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Country",
      field: "customer_country",
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
      field: "customer_mobile_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Residential No",
      field: "customer_resi_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Office No",
      field: "customer_office_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
    },
    {
      headerName: "Customer IMEX No",
      field: "customer_imex_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      
    },
    {
      headerName: "Fax No",
      field: "customer_fax_no",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
     
    },
    {
      headerName: "Email ID",
      field: "customer_email_id",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Credit Limit",
      field: "customer_credit_limit",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
   
    },
    {
      headerName: "Transport Code",
      field: "customer_transport_code",
      editable: false,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toLowerCase() : '';
      },
    },
  {
    headerName: "Salesman Code",
    field: "customer_salesman_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toLowerCase() : '';
    },
  },
  {
  
    headerName: "Broker Code",
    field: "customer_broker_code ",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
 
  },
  {
    headerName: "Weekday Code",
    field: "customer_weekday_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    }

];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: false,
  flex: 1,
  
};
export default function QuotationCustomerPopup({ open, handleClose, handleCustomer }) {

  const [rowData, setRowData] = useState([]);
  const [customer_code, setCustomer_code] = useState("");
  const [customer_name, setCustomer_name] = useState("");
  const [status, setStatus] = useState("");
  const [customer_state, setCustomer_state] = useState("");
  
  const handleSearchItem = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getCustomerSearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ customer_code, customer_name, status, customer_state }) 
      });
      if (response.ok) {
      const searchData = await response.json();
      setRowData(searchData);
      console.log("data fetched successfully")
    } else if (response.status === 404) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Data not found!',
      }).then(() => {
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
    setCustomer_code("");
    setCustomer_name("");
    setStatus("");
    setCustomer_state("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
  const selectedData = selectedRows.map(row => ({
    CustomerCode: row.customer_code,
    CustomerName: row.customer_name,
    Address1:row.customer_addr_1,
    Address2:row.customer_addr_2,
    Address3:row.customer_addr_3,
    Address4:row.customer_addr_4,
    MobileNo:row.customer_mobile_no
  }));
  console.log('Selected Data:', selectedData);
  handleCustomer(selectedData);
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
              <h5 className="modal-title" style={{ fontFamily: "Helvetica" }}>Customer Help</h5>
           
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
                      className='form-control'
                      placeholder='Customer Code'
                      maxLength={10}
                      value={customer_code}
                      onChange={(e) => setCustomer_code(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='Variant'
                      className='form-control'
                      placeholder='Customer Name'
                      value={customer_name}
                      maxLength={250}
                      onChange={(e) => setCustomer_name(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='ItemName'
                      className='form-control'
                      placeholder='Status'
                      value={status}
                      maxLength={18}
                      onChange={(e) => setStatus(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='ShortName'
                      className='form-control'
                      placeholder='State'
                      value={customer_state}
                      maxLength={100}
                      onChange={(e) => setCustomer_state(e.target.value)}
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
   