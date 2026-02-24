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
    headerName: "Transaction Id",
    field: "IssuanceID",
    editable: false,
  },
  {
    headerName: "Transaction Date",
    field: "DateIssued",
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Transaction Type",
    field: "Issued_Type",
    editable: false,
  },
  {
    headerName: "Warehouse",
    field: "Warehouse",
    editable: false,
  },
  {
    headerName: "Department",
    field: "Department",
    editable: false,
  },
  {
    headerName: "ItemSNo",
    field: "ItemSNo",
    editable: false,
  },
  {
    headerName: "Item Code",
    field: "ItemCode",
    editable: false,
  },
  {
    headerName: "Item Name",
    field: "ItemName",
    editable: false,
  },
  {
    headerName: "Serial No",
    field: "Serial_No",
    editable: false,
  },
  {
    headerName: "Quantity Issued",
    field: "QuantityIssued",
    editable: false,
  },
  {
    headerName: "Reason For Issuance",
    field: "ReasonForIssuance",
    editable: false,
  },
  {
    headerName: "Issued By",
    field: "IssuedBy",
    editable: false,
  },
  {
    headerName: "Approval Status",
    field: "ApprovalStatus",
    editable: false,
    hide: true
  },
  {
    headerName: "Action Taken",
    field: "ActionTaken",
    editable: false,
    hide: true
  },
  {
    headerName: "Notes",
    field: "Notes",
    editable: false,
  }
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1,
  filter: true,
};
export default function InvIssuedPopup({ open, handleClose, InvIssuedData }) {

  const [rowData, setRowData] = useState([]);
  const [IssuanceID, setIssuanceID] = useState("");
  const [DateIssued, setDateIssued] = useState("");
  const [Issued_Type, setIssued_Type] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/InventoryIssuedSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), IssuanceID, DateIssued, Issued_Type })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not Found");
        setRowData([]);
        clearInputs([])
        console.log("Data not found");
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
    setIssuanceID("");
    setDateIssued("");
    setIssued_Type("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      IssuanceID: row.IssuanceID,
      DateIssued: row.DateIssued,
      Issued_Type: row.Issued_Type,
      Warehouse: row.Warehouse,
      Department: row.Department,
      ItemSNo: row.ItemSNo,
      ItemCode: row.ItemCode,
      ItemName: row.ItemName,
      QuantityIssued: row.QuantityIssued,
      ReasonForIssuance: row.ReasonForIssuance,
      IssuedBy: row.IssuedBy,
      ApprovalStatus: row.ApprovalStatus,
      ActionTaken: row.ActionTaken,
      Notes: row.Notes,
      Serial_No: row.Serial_No,
    }));

    InvIssuedData(selectedData);
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
                            <h1 align="left" className="purbut">Inventory Issue Help</h1>
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
                              id='IssuanceID'
                              className='exp-input-field form-control'
                              placeholder='Transaction ID'
                              value={IssuanceID}
                              title='Please enter the transaction ID'
                              onChange={(e) => setIssuanceID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='DateIssued'
                              className='exp-input-field form-control'
                              placeholder='Transaction Date'
                              title='Please enter the transaction date'
                              value={DateIssued}
                              onChange={(e) => setDateIssued(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='Transaction Type'
                              title='Please enter the transaction type'
                              value={Issued_Type}
                              onChange={(e) => setIssued_Type(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="mb-2 mt-2 d-flex justify-content-end">
                            <icon className="icon popups-btn" onClick={handleSearch} title="Search">
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </icon>
                            <icon className="icon popups-btn"  onClick={handleReload} title="Reload">
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
                            <h1 className="h1">Inventory Issue Help</h1>
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
                              id='IssuanceID'
                              className='exp-input-field form-control'
                              placeholder='Issue Id'
                              value={IssuanceID}
                              onChange={(e) => setIssuanceID(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='date'
                              id='DateIssued'
                              className='exp-input-field form-control'
                              placeholder='Issued Date'
                              value={DateIssued}
                              onChange={(e) => setDateIssued(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              autoComplete='off'
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Issued_Type'
                              className='exp-input-field form-control'
                              placeholder='Issue Type'
                              value={Issued_Type}
                              onChange={(e) => setIssued_Type(e.target.value)}
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
