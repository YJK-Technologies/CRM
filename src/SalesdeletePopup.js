import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';
const config = require('./Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Bill Date",
    field: "bill_date",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
    valueFormatter: (params) => {
      if (!params.value) return ''; // Return an empty string if the value is null or undefined
      const date = new Date(params.value);
      const day = date.getDate().toString().padStart(2, '0'); // Get day (padStart ensures double-digit format)
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (+1 because months are zero-indexed)
      const year = date.getFullYear();
      return `${day}/${month}/${year}`; // Return formatted date string with day, month, and year
    },
  },
  {
    headerName: "Bill No",
    field: "bill_no",
    editable: false,
    //minWidth: 250,
    //maxWidth: 250,
  },
  {
    headerName: "Customer Code",
    field: "customer_code",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Customer Name",
    field: "customer_name",
    editable: false,
    //minWidth: 190,
    //maxWidth: 250,
  },
  {
    headerName: "Sales Type",
    field: "sales_type",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Sales Amount",
    field: "sale_amt",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Bill Amount",
    field: "bill_amt",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Pay Type",
    field: "pay_type",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Order Type",
    field: "order_type",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Delivery Challan No",
    field: "dely_chlno",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Paid Amount",
    field: "paid_amount",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Return Amount",
    field: "return_amount",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Sales Mode",
    field: "sales_mode",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
  },
  {
    headerName: "Key Field",
    field: "key_field",
    editable: false,
    //minWidth: 250,
    //maxWidth: 250,
    hide: true,
  },
  {
    headerName: "Round Off",
    field: "roff_amt",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
    // hide: true,
  },
  {
    headerName: "Tax Amount",
    field: "tax_amount",
    editable: false,
    //minWidth: 150,
    //maxWidth: 250,
    // hide: true,
  },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1,
};


export default function SalesDeletedPopup({ open, handleClose, handleDeletedData }) {

  const [rowData, setRowData] = useState([]);
  const [bill_date, setbill_date] = useState("");
  const [bill_no, setbill_no] = useState("");
  const [dely_chlno, setdely_chlno] = useState("");
  const [sales_type, setsales_type] = useState("");
  const [customer_code, setcustomer_code] = useState("");
  const [customer_name, setcustomer_name] = useState("");
  const [pay_type, setpay_type] = useState("");
  const [order_type, setorder_type] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearchItem = async () => {
        setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getsalesdelsearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bill_date, bill_no, sales_type, customer_code, customer_name, pay_type, order_type, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
          toast.warning("Data not found")
                  setRowData([]);
                  clearInputs([])
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        console.log("Bad request"); // Log the message for other errors
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
    setbill_date("");
    setbill_no("");
    setdely_chlno("");
    setsales_type("");
    setcustomer_code("");
    setcustomer_name("");
    setpay_type("");
    setorder_type("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };



  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      BillNo: row.bill_no,
      BillDate: row.bill_date,
      SalesType: row.sales_type,
      PayType: row.pay_type,
      TotalTax: row.tax_amount,
      TotalAmount: row.bill_amt,
      CustomerName: row.customer_name,
      SaleAmount: row.sale_amt,
      CustomerCode: row.customer_code,
      RoundOff: row.roff_amt,
      OrderType: row.order_type,
      DCNo: row.dely_chlno,
      PaidAmount: row.paid_amount,
      ReturnAmount: row.return_amount,
      SalesMode: row.sales_mode,
    }));
    console.log('Selected Data:', selectedData);
    handleDeletedData(selectedData);
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
                <div className="modal-dialog modal-xl px-4 p-3" role="document" >
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Deleted Sales Help</h1>
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
                              type="date"
                              id="billdate"
                              className="form-control"
                              placeholder="Bill Date"
                              value={bill_date}
                              onChange={(e) => setbill_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="billno"
                              className="form-control"
                              placeholder="Bill No"
                              value={bill_no}
                              onChange={(e) => setbill_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="cuscode"
                              className="form-control"
                              placeholder="Customer Code"
                              value={customer_code}
                              onChange={(e) => setcustomer_code(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="cusname"
                              className="form-control"
                              placeholder="Customer Name"
                              value={customer_name}
                              onChange={(e) => setcustomer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="salestype"
                              className="form-control"
                              placeholder="Sales Type"
                              value={sales_type}
                              onChange={(e) => setsales_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="paytype"
                              className="form-control"
                              placeholder="Pay Type"
                              value={pay_type}
                              onChange={(e) => setpay_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ordertype"
                              className="form-control"
                              placeholder="Order Type"
                              value={order_type}
                              onChange={(e) => setorder_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="delychlno"
                              className="form-control"
                              placeholder="Delivery Challan No"
                              value={dely_chlno}
                              onChange={(e) => setdely_chlno(e.target.value)}
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
                            rowSelection="single"
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
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document" >
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Sales Del Help</h1>
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
                              type="date"
                              id="billdate"
                              className="form-control"
                              placeholder="Bill Date"
                              value={bill_date}
                              onChange={(e) => setbill_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="billno"
                              className="form-control"
                              placeholder="Bill No"
                              value={bill_no}
                              onChange={(e) => setbill_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="cuscode"
                              className="form-control"
                              placeholder="Customer Code"
                              value={customer_code}
                              onChange={(e) => setcustomer_code(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="cusname"
                              className="form-control"
                              placeholder="Customer Name"
                              value={customer_name}
                              onChange={(e) => setcustomer_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="row ms-3 me-3">
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="salestype"
                              className="form-control"
                              placeholder="Sales Type"
                              value={sales_type}
                              onChange={(e) => setsales_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="paytype"
                              className="form-control"
                              placeholder="Pay Type"
                              value={pay_type}
                              onChange={(e) => setpay_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ordertype"
                              className="form-control"
                              placeholder="Order Type"
                              value={order_type}
                              onChange={(e) => setorder_type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="delychlno"
                              className="form-control"
                              placeholder="Delivery Challan No"
                              value={dely_chlno}
                              onChange={(e) => setdely_chlno(e.target.value)}
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
                            <button type="button" className="" onClick={handleConfirm}>
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </button>
                          </div>
                          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                            <AgGridReact
                              rowData={rowData}
                              columnDefs={columnDefs}
                              defaultColDef={defaultColDef}
                              rowSelection="single"
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
