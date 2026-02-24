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
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Transaction No",
    field: "transaction_no",
    editable: false,
    minWidth: 300,
    maxWidth: 300,
  },
  {
    headerName: "Transaction Date",
    field: "transaction_date",
    editable: false,
    minWidth: 160,
    maxWidth: 160,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Customer Name",
    field: "customer_name",
    editable: false,
    minWidth: 160,
    maxWidth: 160
  },
  {
    headerName: "Customer Code",
    field: "bill_to_customer_code",
    editable: false,
    minWidth: 160,
    maxWidth: 160
  },
  {
    headerName: "Customer Addr 1",
    field: "customer_addr_1",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Customer Addr 2",
    field: "customer_addr_2",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Customer Addr 3",
    field: "customer_addr_3",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Customer Addr 4",
    field: "customer_addr_4",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Customer State",
    field: "customer_state",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Customer Country",
    field: "customer_country",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Contact Number",
    field: "customer_mobile_no",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Contact Person",
    field: "contact_person",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "GST No",
    field: "customer_gst_no",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: " ShipTo Customer Name",
    field: "ShipTo_customer_name",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Code",
    field: "Ship_to_customer_code",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Addr 1",
    field: "ShipTo_customer_addr_1",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Addr 2",
    field: "ShipTocustomer_addr_2",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Addr 3",
    field: "ShipTocustomer_addr_3",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Addr 4",
    field: "ShipTocustomer_addr_4",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer State",
    field: "ShipTocustomer_state",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Country",
    field: "ShipTocustomer_country",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Contact Mobile",
    field: "ShipTocustomer_mobile_no",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo Contact Person",
    field: "ShipTocontact_person",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "ShipTo GST No",
    field: "ShipTocustomer_gst_no",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Purchase Amount",
    field: "purchase_amount",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Round Off",
    field: "rounded_off",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Transport Charges",
    field: "transport_charges",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Total Amount",
    field: "total_amount",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Pay Type",
    field: "pay_type",
    editable: false,
  },
  {
    headerName: "Sales Type",
    field: "sales_type",
    editable: false,
  },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  flex: 1,
  filter: true,
};

export default function ItemPopup({ open, handleClose, handleDcData }) {

  const [rowData, setRowData] = useState([]);
  const [transaction_no, settransaction_no] = useState("");
  const [transaction_date, settransaction_date] = useState("");
  const [customer_name, setcustomer_name] = useState("");
  const [ShipTo_customer_name, setShipTo_customer_name] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getDcSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no, transaction_date, customer_name, ShipTo_customer_name, company_code: sessionStorage.getItem("selectedCompanyCode") })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not Found")
          .then(() => {
            setRowData([]);
            clearInputs([])
          });
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
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
    settransaction_date("");
    setcustomer_name("");
    setShipTo_customer_name("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      TransactionNo: row.transaction_no,
      TransactionDate: row.transaction_date,
      CustomerName: row.customer_name,
      bill_to_customer_code: row.bill_to_customer_code,
      CustomerAddr1: row.customer_addr_1,
      CustomerAddr2: row.customer_addr_2,
      CustomerAddr3: row.customer_addr_3,
      CustomerAddr4: row.customer_addr_4,
      CustomerState: row.customer_state,
      CustomerCountry: row.customer_country,
      ContactPerson: row.contact_person,
      ContactMobileNo: row.customer_mobile_no,
      ShipToCustomerName: row.ShipTo_customer_name,
      Ship_to_customer_code: row.Ship_to_customer_code,
      ShipToCustomerAddr1: row.ShipTo_customer_addr_1,
      ShipToCustomerAddr2: row.ShipTocustomer_addr_2,
      ShipToCustomerAddr3: row.customer_addr_3,
      ShipToCustomerAddr4: row.customer_addr_4,
      ShipToCustomerState: row.ShipTocustomer_state,
      ShipToCustomerCountry: row.ShipTocustomer_country,
      ShipToContactPerson: row.ShipTocontact_person,
      ShipToContactMobileNo: row.ShipTocustomer_mobile_no,
      PurchaseAmount: row.purchase_amount,
      RoundOff: row.rounded_off,
      Transport_charges: row.transport_charges,
      TotalAmount: row.total_amount,
      SalesType: row.sales_type,
      PayType: row.pay_type,
      GSTNo:row.customer_gst_no,
      ShipTo_GSTNo:row.ShipTocustomer_gst_no,
      Dispatched_through:row.dispatched_through,
      destination:row.Destination,
      Delivery_note:row.delivery_note,
      Note_not_for_sale:row.note_not_for_sale,
    }));
    handleDcData(selectedData);
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
                            <h1 align="left" className="purbut">Dc Help</h1>
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
                              value={transaction_date}
                              onChange={(e) => settransaction_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Customer Name'
                              value={customer_name}
                              onChange={(e) => setcustomer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Ship to Customer Name'
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
              {loading && <LoadingScreen />}
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Dc Help</h1>
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
                              value={transaction_date}
                              onChange={(e) => settransaction_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Customer Name'
                              value={customer_name}
                              onChange={(e) => setcustomer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Ship to Customer Name'
                              value={ShipTo_customer_name}
                              onChange={(e) => setShipTo_customer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
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
