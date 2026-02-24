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
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Customer Code",
    field: "customer_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    //minWidth: 250,
    //maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer Name",
    field: "customer_name",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Status",
    field: "status",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Pan no",
    field: "panno",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer GST No",
    field: "customer_gst_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer Address 1",
    field: "customer_addr_1",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer Address 2",
    field: "customer_addr_2",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer Address 3",
    field: "customer_addr_3",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer Address 4",
    field: "customer_addr_4",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Customer Area",
    field: "customer_area",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "State",
    field: "customer_state",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Country",
    field: "customer_country",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Mobile No",
    field: "customer_mobile_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Residential No",
    field: "customer_resi_no",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Office No",
    field: "customer_office_no",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Customer IMEX No",
    field: "customer_imex_no",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Fax No",
    field: "customer_fax_no",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Email ID",
    field: "customer_email_id",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Credit Limit",
    field: "customer_credit_limit",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Transport Code",
    field: "customer_transport_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toLowerCase() : '';
    },
  },
  {
    headerName: "Salesman Code",
    field: "customer_salesman_code",
    editable: false,
    cellStyle: { textAlign: "left" },
    valueFormatter: (params) => {
      return params.value ? params.value.toLowerCase() : '';
    },
  },
  {

    headerName: "Broker Code",
    field: "customer_broker_code ",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Weekday Code",
    field: "customer_weekday_code",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Contact Person",
    field: "contact_person",
    editable: false,
    cellStyle: { textAlign: "left" },
  }
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: false,
  // flex: 1,

};
export default function SalesVendorPopup({ open, handleClose, handleVendor }) {

  const [rowData, setRowData] = useState([]);
  const [customer_code, setCustomer_code] = useState("");
  const [customer_name, setCustomer_name] = useState("");
  const [status, setStatus] = useState("");
  const [customer_state, setCustomer_state] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getCustomerSearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), customer_code, customer_name, status, customer_state, })
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
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
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
      Address1: row.customer_addr_1,
      Address2: row.customer_addr_2,
      Address3: row.customer_addr_3,
      Address4: row.customer_addr_4,
      State: row.customer_state,
      Country: row.customer_country,
      MobileNo: row.customer_mobile_no,
      ContactPerson: row.contact_person,
      GSTNo: row.customer_gst_no,
    }));
    console.log('Selected Data:', selectedData);
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
          <div>
            <div className="purbut">
              {loading && <LoadingScreen />}
              <div className="modal mt-5 Topnav-screen popup popupadj" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Customer Help</h1>
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
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Customer Help</h1>
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
          </div>
        </fieldset>
      )}
    </div>
  );
}
