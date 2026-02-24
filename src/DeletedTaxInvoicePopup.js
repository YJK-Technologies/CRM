import { useState, useEffect } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';
import Select from 'react-select'

const config = require('./Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Transaction No",
    field: "bill_no",
    editable: false,
    //minWidth: 250,
    //maxWidth: 250,
  },
  {
    headerName: "Transaction Date",
    field: "bill_date",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Pay Type",
    field: "pay_type",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160,
  },
  {
    headerName: "Sales Type",
    field: "sales_type",
    editable: false,
    //minWidth: 135,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Customer Code",
    field: "customer_code",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Customer Code",
    field: "shipTo_customer_code",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Customer Name",
    field: "billTo_customer_name",
    editable: false,
    //minWidth: 140,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Customer Name ",
    field: "shipTo_customer_name",
    editable: false,
    //minWidth: 150,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Address 1",
    field: "billTo_customer_addr_1",
    editable: false,
    //minWidth: 120,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Address 2",
    field: "billTo_customer_addr_2",
    editable: false,
    //minWidth: 110,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Address 3",
    field: "billTo_customer_addr_3",
    editable: false,
    //minWidth: 140,
    //maxWidth: 140,
  },
  {
    headerName: "Bill to Address 4",
    field: "billTo_customer_addr_4",
    editable: false,
    //minWidth: 130,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Address 1",
    field: "shipTo_customer_addr_1",
    editable: false,
    //minWidth: 120,
    //maxWidth: 200,
    hide: true
  },
  {
    headerName: "Ship to Address 2",
    field: "shipTo_customer_addr_2",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Address 3",
    field: "shipTo_customer_addr_3",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Address 4",
    field: "shipTo_customer_addr_4",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to State",
    field: "billTo_customer_state",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to State",
    field: "shipTo_customer_state",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Country",
    field: "billTo_customer_country",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Country",
    field: "shipTo_customer_country",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Mobile No",
    field: "billTo_customer_mobile_no",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Mobile No",
    field: "shipTo_customer_mobile_no",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to Contact Person",
    field: "billTo_contact_person",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to Contact Person",
    field: "shipTo_contact_person",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Bill to GST No",
    field: "billTo_customer_gst_no",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Ship to GST No",
    field: "ShipTo_customer_gst_no",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Total Amount",
    field: "sale_amt",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Total Tax",
    field: "tax_amount",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Round Diff",
    field: "roff_amt",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Grand Total",
    field: "bill_amt",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Advance Amount",
    field: "Advance_Amount",
    editable: false,
    //minWidth: 160,
    //maxWidth: 200,
  },
  {
    headerName: "Balance Amount",
    field: "bal_amt",
    editable: false,
    //minWidth: 160,
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
export default function DeletedTaxInvoicePopup({ open, handleClose, handleDeletedTaxInvoiceData, invoicetype }) {

  const [rowData, setRowData] = useState([]);
  const [bill_no, setbill_no] = useState("");
  const [bill_date, setbill_date] = useState("");
  const [sales_type, setsales_type] = useState("");
  const [billTo_customer_name, setbillTo_customer_name] = useState("");
  const [shipTo_customer_name, setshipTo_customer_name] = useState("");
  const [pay_type, setpay_type] = useState("");
  const [invoicedrop, setInvoicedrop] = useState([]);
  const [selectedInvoice, setselectedInvoice] = useState(null);
  const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!invoicetype) {
      toast.warning('Please select a Invoice Type before proceeding.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getDeletedTaxInvoiceSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bill_no, bill_date, sales_type, pay_type, billTo_customer_name, shipTo_customer_name,
          invoice_type: invoicetype,
          company_code: sessionStorage.getItem('selectedCompanyCode')
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not Found")
            setRowData([]);
            clearInputs([])
        console.log("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
finally {
      setLoading(false);
    }

  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    setbill_no("");
    setbill_date("");
    setsales_type("");
    setpay_type("");
    setbillTo_customer_name("");
    setshipTo_customer_name("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      billno: row.bill_no,
      billdate: row.bill_date,
      salestype: row.sales_type,
      Paytype: row.pay_type,
      billtocustomercode: row.customer_code,
      Shiptocustomercode: row.shipTo_customer_code,
      billtocustomername: row.billTo_customer_name,
      Shiptocustomername: row.shipTo_customer_name,
      BillTo_customer_addr_1: row.billTo_customer_addr_1,
      BillTo_customer_addr_2: row.billTo_customer_addr_2,
      BillTo_customer_addr_3: row.billTo_customer_addr_3,
      BillTo_customer_addr_4: row.billTo_customer_addr_4,
      ShipTo_customer_addr_1: row.shipTo_customer_addr_1,
      ShipTo_customer_addr_2: row.shipTo_customer_addr_2,
      ShipTo_customer_addr_3: row.shipTo_customer_addr_3,
      ShipTo_customer_addr_4: row.shipTo_customer_addr_4,
      BillTo_customer_state: row.billTo_customer_state,
      ShipTo_customer_state: row.shipTo_customer_state,
      BillTo_customer_country: row.billTo_customer_country,
      ShipTo_customer_country: row.shipTo_customer_country,
      BillTo_customer_mobile_no: row.billTo_customer_mobile_no,
      ShipTo_customer_mobile_no: row.shipTo_customer_mobile_no,
      BillTo_contact_person: row.billTo_contact_person,
      ShipTo_contact_person: row.shipTo_contact_person,
      Saleamt: row.sale_amt,
      Taxamt: row.tax_amount,
      Billamt: row.bill_amt,
      RoffAmt: row.roff_amt,
      adAmount: row.Advance_Amount,
      balAmount: row.bal_amt,
      BillToGSTNo: row.billTo_customer_gst_no,
      ShipToGSTNo: row.ShipTo_customer_gst_no,
      po_no:row.po_no,
      document_type:row.document_type,
      po_date:row.po_date,
      delivery_note:row.delivery_note,
      dispatched_through:row.dispatched_through,
      Destination:row.Destination,
    }));
    handleDeletedTaxInvoiceData(selectedData);
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
                            <h1 align="left" className="purbut">Deleted Tax Invoice Help</h1>
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
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              className='exp-input-field form-control'
                              placeholder='Transaction No'
                              value={bill_no}
                              onChange={(e) => setbill_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='date'
                              className='exp-input-field form-control'
                              placeholder='Transaction Date'
                              value={bill_date}
                              onChange={(e) => setbill_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              className='exp-input-field form-control'
                              placeholder='Pay Type'
                              value={sales_type}
                              onChange={(e) => setsales_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Sales Type'
                              value={pay_type}
                              onChange={(e) => setpay_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='purchase_type'
                              className='exp-input-field form-control'
                              placeholder='Bill to Cus Name'
                              value={billTo_customer_name}
                              onChange={(e) => setbillTo_customer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='Pay_type'
                              className='exp-input-field form-control'
                              placeholder='Ship to Cus Name'
                              value={shipTo_customer_name}
                              onChange={(e) => setshipTo_customer_name(e.target.value)}
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
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Deleted Tax Invoice Help</h1>
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
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='transaction_no'
                              className='exp-input-field form-control'
                              placeholder='Transaction No'
                              value={bill_no}
                              onChange={(e) => setbill_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='date'
                              id='transaction_date'
                              className='exp-input-field form-control'
                              placeholder='Transaction Date'
                              value={bill_date}
                              onChange={(e) => setbill_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Vendor Code'
                              value={sales_type}
                              onChange={(e) => setsales_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='exp-input-field form-control'
                              placeholder='Vendor Name'
                              value={billTo_customer_name}
                              onChange={(e) => setbillTo_customer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>

                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='purchase_type'
                              className='exp-input-field form-control'
                              placeholder='Purchase Type'
                              value={shipTo_customer_name}
                              onChange={(e) => setshipTo_customer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-2 mb-2">
                            <input
                              type='text'
                              id='Pay_type'
                              className='exp-input-field form-control'
                              placeholder='Paytype'
                              value={pay_type}
                              onChange={(e) => setpay_type(e.target.value)}
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
