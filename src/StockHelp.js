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
import Swal from 'sweetalert2';
import LoadingScreen from './Loading';
const config = require('./Apiconfig');



const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Transaction No",
    field: "transaction_no",
    editable: false,
    //minWidth: 150,
    //maxWidth: 200,
  },
  {
    headerName: "Transaction Date",
    field: "transaction_date",
    editable: false,
    //minWidth: 160,
    //maxWidth: 160,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Item Code",
    field: "item_code",
    editable: false,
    //minWidth: 140,
    //maxWidth: 200,
  },
  {
    headerName: "Item Name",
    field: "Item_name",
    editable: false,
    //minWidth: 150,
    //maxWidth: 200,
  },
  {
    headerName: "Weight",
    field: "weight",
    editable: false,
    //minWidth: 120,
    //maxWidth: 200,
  },
  {
    headerName: " From Warehouse",
    field: "from_Warehouse",
    editable: false,
    //minWidth: 110,
    //maxWidth: 200,

  },
  {
    headerName: "To Warehouse",
    field: "to_Warehouse",
    editable: false,
    //minWidth: 140,
    //maxWidth: 140,
  },
  {
    headerName: "Qty",
    field: "transfer_Qty",
    editable: false,
    //minWidth: 130,
    //maxWidth: 200,
    valueFormatter: params => parseFloat(params.value).toFixed(2),
  },
  {
    headerName: "Key Field",
    field: "keyfield",
    editable: false,
    //minWidth: 120,
    //maxWidth: 200,
    hide: true
  },

  {
    headerName: "Total Weight",
    field: "total_weight",
    editable: false,
    //minWidth: 130,
    //maxWidth: 200,
    valueFormatter: params => parseFloat(params.value).toFixed(2),
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
export default function StockItemPopup({ open, handleClose, handlePurchaseData }) {

  const [rowData, setRowData] = useState([]);
  const [transaction_no, settransaction_no] = useState("");
  const [transaction_date, setTransactionDate] = useState("");
  const [Item_name, setItem_name] = useState("");
  const [from_Warehouse, setfrom_Warehouse] = useState("");
  const [to_Warehouse, setto_Warehouse] = useState("");
  const [item_code, setitem_code] = useState("");
  const [weight, setweight] = useState("");
  const [total_weight, settotal_weight] = useState("");
  const [transfer_Qty, settransfer_Qty] = useState("");
  const [loading, setLoading] = useState(false);

  // const [status, setstatus] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/stocktransferSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no, transaction_date, item_code, Item_name, to_Warehouse, from_Warehouse, transfer_Qty, total_weight, weight }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
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
    }finally {
      setLoading(false);
    }

  };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    settransaction_no("");
    setTransactionDate("");
    setitem_code("");
    setItem_name("");
    setfrom_Warehouse("");
    setto_Warehouse("");
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      TransactionNo: row.transaction_no,
      TransactionDate: row.transaction_date,
      itemCode: row.item_code,

    }));
    console.log('Selected Data:', selectedData);
    handlePurchaseData(selectedData);
    handleClose();
    clearInputs([])
    setRowData([])
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
                            <h1 align="left" className="purbut">Stock Help</h1>
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
                          <div className="col-md-4 mb-2">
                            <input
                              type='text'
                              id='transaction_no'
                              className='form-control'
                              maxLength={10}
                              placeholder='Transaction No'
                              value={transaction_no}
                              onChange={(e) => settransaction_no(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type='date'
                              id='transaction_date'
                              className='form-control'
                              placeholder='Transaction Date'
                              value={transaction_date}
                              onChange={(e) => setTransactionDate(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='form-control'
                              maxLength={18}
                              placeholder='ItemCode'
                              value={item_code}
                              onChange={(e) => setitem_code(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                        </div>
                        <div className="row ms-3 me-3">
                          <div className="col-md-4 mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='form-control'
                              placeholder='Item Name'
                              maxLength={40}
                              value={Item_name}
                              onChange={(e) => setItem_name(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type='text'
                              id='purchase_type'
                              className='form-control'
                              placeholder='From Warehouse'
                              maxLength={18}
                              value={from_Warehouse}
                              onChange={(e) => setfrom_Warehouse(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type='text'
                              id='Pay_type'
                              className='form-control'
                              placeholder='To Warehosue'
                              value={to_Warehouse}
                              maxLength={18}
                              onChange={(e) => setto_Warehouse(e.target.value)}
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
                            <h1 className="h1">Stock Help</h1>
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
                              className='form-control'
                              maxLength={10}
                              placeholder='Transaction No'
                              value={transaction_no}
                              onChange={(e) => settransaction_no(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='transaction_date'
                              className='form-control'
                              placeholder='Transaction Date'
                              value={transaction_date}
                              onChange={(e) => setTransactionDate(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='form-control'
                              maxLength={18}
                              placeholder='ItemCode'
                              value={item_code}
                              onChange={(e) => setitem_code(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='vendor_code'
                              className='form-control'
                              placeholder='Item Name'
                              maxLength={40}
                              value={Item_name}
                              onChange={(e) => setItem_name(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='purchase_type'
                              className='form-control'
                              placeholder='From Warehouse'
                              maxLength={18}
                              value={from_Warehouse}
                              onChange={(e) => setfrom_Warehouse(e.target.value)}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Pay_type'
                              className='form-control'
                              placeholder='To Warehosue'
                              value={to_Warehouse}
                              maxLength={18}
                              onChange={(e) => setto_Warehouse(e.target.value)}
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
                            <button type="button" className="pt-1 pb-1 me-4" onClick={handleConfirm} title="Confirm">
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
