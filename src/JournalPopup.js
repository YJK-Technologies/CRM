import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer,toast } from 'react-toastify';
import { format } from 'date-fns';
const config = require('./Apiconfig');

const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "Journal NO",
    field: "journal_no",
    cellStyle: { textAlign: "center" },
    // minWidth: 250,
    // maxWidth: 250,
    editable: false,
  },
  {
    headerName: "Transaction Date",
    field: "transaction_date",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Transaction Type",
    field: "transaction_type",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
    // maxWidth: 150,
  },
  {
    headerName: "Original Acc Code",
    field: "original_accountcode",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
  },
  {
    headerName: " Contra Acc Code",
    field: "contra_accountCode",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
  },
  {
    headerName: "Journal Amt",
    field: "journal_amount",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
  },
  {
    headerName: " Narration 1",
    field: "narration1",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
  },
  {
    headerName: "Narration 2",
    field: "narration2",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
  },
  {
    headerName: "Narration 3",
    field: "narration3",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
  },
  {
    headerName: "Narration 4",
    field: "narration4",
    editable: false,
    cellStyle: { textAlign: "center" },
    // minWidth: 150,
  },

];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1
};

export default function JournalPopup({ open, handleClose, handlejournal }) {

  const [rowData, setRowData] = useState([]);
  const [journal_no, setjournal_no] = useState("");
  const [transaction_date, settransaction_date] = useState("");
  const [transaction_type, settransaction_type] = useState("");
  const [original_accountcode, setoriginal_accountcode] = useState("");
  const [contra_accountCode, setcontra_accountCode] = useState("");
  const [status, setstatus] = useState("");

  const handleSearchItem = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/Journalsearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({  company_code : sessionStorage.getItem('selectedCompanyCode'),
          journal_no, transaction_date, transaction_type, original_accountcode, contra_accountCode }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning("Data Not Found")
        .then(() => {
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
    setjournal_no("");
    settransaction_date("");
    settransaction_type("");
    setoriginal_accountcode("");
    setcontra_accountCode("");

  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      JournalNo: row.journal_no,
      Transactiondate: row.transaction_date,

    }));
    console.log('Selected Data:', selectedData);
    handlejournal(selectedData);
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
              <div className="modal mt-5 Topnav-screen popup popupadj" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Journal Help</h1>
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
                              id='ItemCode'
                              maxLength={18}
                              className='exp-input-field form-control'
                              placeholder='Journal No'
                              value={journal_no}
                              onChange={(e) => setjournal_no(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Variant'
                              className='exp-input-field form-control'
                              placeholder=' Transaction date'
                              value={transaction_date}
                              maxLength={18}
                              onChange={(e) => settransaction_date(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='ItemName'
                              className='exp-input-field form-control'
                              placeholder=' Transaction Type'
                              maxLength={40}
                              value={transaction_type}
                              onChange={(e) => settransaction_type(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='ShortName'
                              className='exp-input-field form-control'
                              placeholder=' Original Acc Code'
                              maxLength={50}
                              value={original_accountcode}
                              onChange={(e) => setoriginal_accountcode(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='OurBrand'
                              className='exp-input-field form-control'
                              placeholder=' Contra Acc Code'
                              value={contra_accountCode}
                              maxLength={30}
                              onChange={(e) => setcontra_accountCode(e.target.value)}
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
                            <h1 className="h1">Journal Help</h1>
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
                              id='ItemCode'
                              maxLength={18}
                              className='exp-input-field form-control'
                              placeholder='Journal No'
                              value={journal_no}
                              onChange={(e) => setjournal_no(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='Variant'
                              className='exp-input-field form-control'
                              placeholder=' Transaction date'
                              value={transaction_date}
                              maxLength={18}
                              onChange={(e) => settransaction_date(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='ItemName'
                              className='exp-input-field form-control'
                              placeholder=' Transaction Type'
                              maxLength={40}
                              value={transaction_type}
                              onChange={(e) => settransaction_type(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='ShortName'
                              className='exp-input-field form-control'
                              placeholder=' Original Acc Code'
                              maxLength={50}
                              value={original_accountcode}
                              onChange={(e) => setoriginal_accountcode(e.target.value)}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type='text'
                              id='OurBrand'
                              className='exp-input-field form-control'
                              placeholder=' Contra Acc Code'
                              value={contra_accountCode}
                              maxLength={30}
                              onChange={(e) => setcontra_accountCode(e.target.value)}
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
