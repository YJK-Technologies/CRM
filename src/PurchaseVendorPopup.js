import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Vendor Code",
    field: "vendor_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    //minWidth: 250,
    //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Name",
    field: "vendor_name",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Company Code",
    field: "company_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Address 1",
    field: "vendor_addr_1",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Address 2",
    field: "vendor_addr_2",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Address 3",
    field: "vendor_addr_3",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Address 4",
    field: "vendor_addr_4",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Area Code",
    field: "vendor_area_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor State Code",
    field: "vendor_state_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Country Code",
    field: "vendor_country_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Status",
    field: "status",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "PAN No",
    field: "panno",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
  },
  {
    headerName: "GST No",
    field: "vendor_gst_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
  },
  {
    headerName: "Vendor IMEX No",
    field: "vendor_imex_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
  },
  {
    headerName: "Vendor Office No",
    field: "vendor_office_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
  },
  {
    headerName: "Vendor Residental No",
    field: "vendor_resi_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Mobile No",
    field: "vendor_mobile_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
  },
  {
    headerName: "Vendor Fax No",
    field: "vendor_fax_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 250,
    // //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toLowerCase() : '';
    },
  },
  {
    headerName: "Vendor Email ID",
    field: "vendor_email_id",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toLowerCase() : '';
    },
  },
  {

    headerName: "Credit Limit",
    field: "vendor_credit_limit",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 150,
  },
  {
    headerName: "Transport Code",
    field: "vendor_transport_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 150,
  },
  {
    headerName: "Salesman Code",
    field: "vendor_salesman_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Broker Code",
    field: "vendor_broker_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Weekday Code",
    field: "vendor_weekday_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Contact Person",
    field: "contact_person",
    editable: false,
    cellStyle: { textAlign: "left" },
    // //minWidth: 150,
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
  // flex: 1,
};
export default function PurchaseVendorPopup({ open, handleClose, handleVendor }) {

  const [rowData, setRowData] = useState([]);
  const [vendor_code, setVendorCode] = useState("");
  const [vendor_name, setVendorName] = useState("");
  const [status, setStatus] = useState("");
  const [vendor_country_code, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchItem = async () => {
        setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/vendorsearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), vendor_code, vendor_name, status, vendor_country_code })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning('Data not found!', {
          onClose: () => {
            setRowData([]);
            clearInputs([])
          }
        })
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }finally {
      setLoading(false);
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
      Address1: row.vendor_addr_1,
      Address2: row.vendor_addr_2,
      Address3: row.vendor_addr_3,
      Address4: row.vendor_addr_4,
      State: row.vendor_state_code,
      Country: row.vendor_country_code,
      MobileNo: row.vendor_mobile_no,
      ContactPerson: row.contact_person,
      GSTNo: row.vendor_gst_no
    }));

    handleVendor(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
    setSelectedRows([]);
  }


  return (
    <div>
      {open && (
        <fieldset>
          <div className="purbut">
                    {loading && <LoadingScreen />}
            
            <div className="modal mt-5  Topnav-screen popup popupadj" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div className="p-0 bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between" >
                          <h1 align="left" className="purbut">Vendor Help</h1>
                          <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div className="d-flex justify-content-start">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="row ms-3 me-3">
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
                        <div className="mb-2 mt-2 d-flex justify-content-end">
                          <icon className="icon popups-btn" onClick={handleSearchItem}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </icon>
                          <icon className="icon popups-btn" onClick={handleReload}>
                            <i class="fa-solid fa-arrow-rotate-right"></i>
                          </icon>
                          <icon className="icon popups-btn" onClick={handleConfirm}>
                            <FontAwesomeIcon icon="fa-solid fa-check" />
                          </icon>
                        </div>
                      </div>
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
          <div className="mobileview">
            <div className="modal mt-5  Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div className="mb-0 d-flex justify-content-between">
                        <div className="mb-0 d-flex justify-content-start me-4">
                          <h1 className="h1">Vendor Help</h1>
                        </div>
                        <div className="mb-0 d-flex justify-content-end" >
                          <button onClick={handleClose} className="closebtn2" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                        </div>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="row ms-3 me-3">
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
                        <div className="mb-2 mt-2 d-flex justify-content-end">
                          <button className="" onClick={handleSearchItem}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </button>
                          <button className="" onClick={handleReload}>
                            <i class="fa-solid fa-arrow-rotate-right"></i>
                          </button>
                          <button className="" onClick={handleConfirm}>
                            <FontAwesomeIcon icon="fa-solid fa-check" />
                          </button>
                        </div>
                      </div>
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
        </fieldset>
      )}
    </div>
  );
}
