import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Transaction No",
    field: "transaction_no",
    editable: false,
    //minWidth: 300,
    //maxWidth: 300,
  },
  {
    headerName: "Transaction Date",
    field: "Entry_date",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Vendor Name",
    field: "vendor_name",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160
  },
  {
    headerName: "Vendor Address 1",
    field: "vendor_addr_1",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor Address 2",
    field: "vendor_addr_2",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor Address 3",
    field: "vendor_addr_3",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor Address 4",
    field: "vendor_addr_4",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor State",
    field: "state",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor Country",
    field: "country",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Contact No",
    field: "contact_number",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "GST No",
    field: "vendor_gst_no",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Contact Person",
    field: "contact_person",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: " ShipTo Customer Name",
    field: "ShipTo_customer_name",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Address 1",
    field: "ShipTo_customer_addr_1",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Address 2",
    field: "ShipTo_customer_addr_2",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Address 3",
    field: "ShipTo_customer_addr_3",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Address 4",
    field: "ShipTo_customer_addr_4",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer State",
    field: "ship_to_state",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Country",
    field: "ship_to_country",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Contact Mobile No",
    field: "ship_to_contact_number",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo GST No",
    field: "ShipTo_vendor_gst_no",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Contact Person",
    field: "ship_to_contact_person",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Total Amount",
    field: "purchase_amount",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Total Tax",
    field: "tax_amount",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },

  {
    headerName: "Round Off",
    field: "rounded_off",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Total Bill Amount",
    field: "total_amount",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1,
  filter: true,
};

export default function PurchaseOrderPopup({ open, handleClose, handlePoData }) {

  const [rowData, setRowData] = useState([]);
  const [transaction_no, settransaction_no] = useState("");
  const [Entry_date, setEntry_date] = useState("");
  const [vendor_name, setvendor_name] = useState("");
  const [ShipTo_customer_name, setShipTo_customer_name] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
        setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/getPOSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no, Entry_date, vendor_name, ShipTo_customer_name, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning('Data not found!', {
          onClose: () => {
            setRowData([]);
            clearInputs([])
          }
        })
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
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
    settransaction_no("");
    setEntry_date("");
    setvendor_name("");
    setShipTo_customer_name("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      TransactionNo: row.transaction_no,
      EntryDate: row.Entry_date,
      VendorName: row.vendor_name,
      VendorAddr1: row.vendor_addr_1,
      VendorAddr2: row.vendor_addr_2,
      VendorAddr3: row.vendor_addr_3,
      VendorAddr4: row.vendor_addr_4,
      VendorState: row.state,
      VendorCountry: row.country,
      ContactPerson: row.contact_person,
      ContactMobileNo: row.contact_number,
      ShipToCustomerName: row.ShipTo_customer_name,
      ShipToCustomerAddr1: row.ShipTo_customer_addr_1,
      ShipToCustomerAddr2: row.ShipTo_customer_addr_2,
      ShipToCustomerAddr3: row.ShipTo_customer_addr_3,
      ShipToCustomerAddr4: row.ShipTo_customer_addr_4,
      ShipToCustomerState: row.ship_to_state,
      ShipToCustomerCountry: row.ship_to_country,
      ShipToContactPerson: row.ship_to_contact_person,
      ShipToContactMobileNo: row.ship_to_contact_number,
      PurchaseAmount: row.purchase_amount,
      RoundOff: row.rounded_off,
      TotalAmount: row.total_amount,
      TaxAmount: row.tax_amount,
      VendorCode: row.vendor_code,
      ShipToCustomerCode: row.ShipTo_customer_code,
      GSTNo: row.vendor_gst_no,
      ShipToGSTNo: row.ShipTo_vendor_gst_no,
      deliveryDate: row.delivery_date,
      credit: row.remarks,
      remarks: row.credit,
    }));
    handlePoData(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
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
                            <h1 align="left" className="purbut">Purchase Order  Help</h1>
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
                              id='transaction_no'
                              className='exp-input-field form-control'
                              placeholder='Transaction No'
                              value={transaction_no}
                              onChange={(e) => settransaction_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='transaction_date'
                              className='exp-input-field form-control'
                              placeholder='Transaction Date'
                              value={Entry_date}
                              onChange={(e) => setEntry_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Vendor Name'
                              value={vendor_name}
                              onChange={(e) => setvendor_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Ship To Customer Name'
                              value={ShipTo_customer_name}
                              onChange={(e) => setShipTo_customer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <icon className="icon popups-btn" onClick={handleSearch} title="Search">
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </icon>
                            <icon className="icon popups-btn" onClick={handleReload} title="Reload">
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </icon>
                            <icon className="icon popups-btn" onClick={handleConfirm} title="Confirm">
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </icon>
                          </div>
                        </div>
                        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                          <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection="single"
                            pagination='true'
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
              {/* <ToastContainer position="top-right" className="toast-design" theme="colored" /> */}
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Purchase Order Help</h1>
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
                              id='transaction_no'
                              className='exp-input-field form-control'
                              placeholder='Transaction No'
                              value={transaction_no}
                              onChange={(e) => settransaction_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='transaction_date'
                              className='exp-input-field form-control'
                              placeholder='Transaction Date'
                              value={Entry_date}
                              onChange={(e) => setEntry_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Vendor Name'
                              value={vendor_name}
                              onChange={(e) => setvendor_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Ship To Customer Name'
                              value={ShipTo_customer_name}
                              onChange={(e) => setShipTo_customer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-auto mb-2">
                            <button className="" onClick={handleSearch} title="Search">
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                            <button className="" onClick={handleReload} title="Reload">
                              <i class="fa-solid fa-arrow-rotate-right"></i>
                            </button>
                            <button className="" onClick={handleConfirm} title="Confirm">
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </button>
                          </div>
                          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                            <AgGridReact
                              rowData={rowData}
                              columnDefs={columnDefs}
                              defaultColDef={defaultColDef}
                              rowSelection="single"
                              pagination='true'
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
