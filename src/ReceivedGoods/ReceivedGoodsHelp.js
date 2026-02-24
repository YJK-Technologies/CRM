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
const config = require('../Apiconfig');

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Transaction No",
    field: "bill_no",
    editable: false,
    //minWidth: 300,
    //maxWidth: 300,
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
    headerName: "Item Code",
    field: "item_code",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160
  },
  {
    headerName: "Item Name",
    field: "item_name",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160
  },
  {
    headerName: "Vendor Name",
    field: "vendor_name",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160
  },
  {
    headerName: "Vendor Addr 1",
    field: "vendor_addr_1",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor Addr 2",
    field: "vendor_addr_2",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor Addr 3",
    field: "vendor_addr_3",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "Vendor Addr 4",
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
    headerName: "Contact Number",
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
    headerName: "ShipTo Customer Addr 1",
    field: "ShipTo_customer_addr_1",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Addr 2",
    field: "ShipTo_customer_addr_2",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Addr 3",
    field: "ShipTo_customer_addr_3",
    editable: false,
    //minWidth: 200,
    //maxWidth: 200,
  },
  {
    headerName: "ShipTo Customer Addr 4",
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
    headerName: "ShipTo Contact Mobile",
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

export default function ReceivedGoodsPopup({ open, handleClose, handleRGData }) {

  const [rowData, setRowData] = useState([]);
  const [bill_no, setbill_no] = useState("");
  const [bill_date, setbill_date] = useState("");
  const [item_code, setitem_code] = useState("");
  const [item_name, setitem_name] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getReceivedGoodsHelp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bill_no, bill_date, item_code, item_name, company_code: sessionStorage.getItem("selectedCompanyCode") })
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
    }
  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    setbill_no("");
    setbill_date("");
    setitem_code("");
    setitem_name("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      TransactionNo: row.bill_no,
      EntryDate: row.bill_date,
    }));
    handleRGData(selectedData);
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
              <div className="modal mt-5 Topnav-screen popup popupadj" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Received Goods Help</h1>
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
                              id='bill_no'
                              className='exp-input-field form-control'
                              placeholder='Transaction No'
                              value={bill_no}
                              onChange={(e) => setbill_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='bill_date'
                              className='exp-input-field form-control'
                              placeholder='Transaction Date'
                              value={bill_date}
                              onChange={(e) => setbill_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='item_code'
                              className='exp-input-field form-control'
                              placeholder='Item Code'
                              value={item_code}
                              onChange={(e) => setitem_code(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='item_name'
                              className='exp-input-field form-control'
                              placeholder='Item Name'
                              value={item_name}
                              onChange={(e) => setitem_name(e.target.value)}
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
                            <h1 className="h1">Received Goods Help</h1>
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
                              id='bill_no'
                              className='exp-input-field form-control'
                              placeholder='Transaction No'
                              value={bill_no}
                              onChange={(e) => setbill_no(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='bill_date'
                              className='exp-input-field form-control'
                              placeholder='Transaction Date'
                              value={bill_date}
                              onChange={(e) => setbill_date(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='item_code'
                              className='exp-input-field form-control'
                              placeholder='Item Code'
                              value={item_code}
                              onChange={(e) => setitem_code(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='item_name'
                              className='exp-input-field form-control'
                              placeholder='Item Name'
                              value={item_name}
                              onChange={(e) => setitem_name(e.target.value)}
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
