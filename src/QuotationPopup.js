import { useState, useEffect } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import Select from 'react-select';
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
  },
  {
    headerName: "Transaction Date",
    field: "Entry_date",
    editable: false,
    valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
  },
  {
    headerName: "Customer Code",
    field: "customer_code",
    editable: false,
  },
  {
    headerName: "Customer Name",
    field: "customer_name",
    editable: false,
  },
  {
    headerName: "Customer Address 1",
    field: "customer_addr_1",
    editable: false,
  },
  {
    headerName: "Customer Address 2",
    field: "customer_addr_2",
    editable: false,
  },
  {
    headerName: "Customer Address 3",
    field: "customer_addr_3",
    editable: false,
  },
  {
    headerName: "Customer Address 4",
    field: "customer_addr_4",
    editable: false,
  },
  {
    headerName: "Customer State",
    field: "customer_state",
    editable: false,
  },
  {
    headerName: "Customer Country",
    field: "customer_country",
    editable: false,
  },
  {
    headerName: "Contact Number",
    field: "customer_mobile_no",
    editable: false,
  },
  {
    headerName: "Contact Person",
    field: "contact_person",
    editable: false,
  },
  {
    headerName: "GST No",
    field: "customer_gst_no",
    editable: false,
  },
  {
    headerName: "Purchase Amount",
    field: "purchase_amount",
    editable: false,
  },
  {
    headerName: "Tax Amount",
    field: "tax_amount",
    editable: false,
  },
  {
    headerName: "Round Off",
    field: "rounded_off",
    editable: false,
  },
  {
    headerName: "Total Amount",
    field: "total_amount",
    editable: false,
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

export default function QuotationPopup({ open, handleClose, handleQuotationData }) {

  const [rowData, setRowData] = useState([]);
  const [transaction_no, settransaction_no] = useState("");
  const [Entry_date, setEntry_date] = useState("");
  const [customer_name, setcustomer_name] = useState("");
  const [contact_person, setcontact_person] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getQuotationSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem("selectedCompanyCode"), transaction_no, Entry_date, customer_name, contact_person })
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
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getquotationperiod`)
  //     .then((data) => data.json())
  //     .then((val) => {
  //       setPerioddrop(val);

  //       if (val.length > 0) {
  //         const firstOption = {
  //           value: val[0].Sno,
  //           label: val[0].DateRangeDescription,
  //         };
  //         setSelectedPeriod(firstOption);
  //         setPeriod(firstOption.value);
  //       }
  //     });
  // }, []);

  // const filteredOptionPeriod = perioddrop.map((option) => ({
  //   value: option.Sno,
  //   label: option.DateRangeDescription,
  // }));

  // const handleChangePeriod = (selectedPeriod) => {
  //   setSelectedPeriod(selectedPeriod);
  //   setPeriod(selectedPeriod ? selectedPeriod.value : '');
  // };

  const handleReload = () => {
    clearInputs([])
    setRowData([])
  };

  const clearInputs = () => {
    settransaction_no("");
    setEntry_date("");
    setcustomer_name("");
    setcontact_person("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      TransactionNo: row.transaction_no,
      EntryDate: row.Entry_date,
      CustomerCode: row.customer_code,
      CustomerName: row.customer_name,
      CustomerAddr1: row.customer_addr_1,
      CustomerAddr2: row.customer_addr_2,
      CustomerAddr3: row.customer_addr_3,
      CustomerAddr4: row.customer_addr_4,
      CustomerState: row.customer_state,
      CustomerCountry: row.customer_country,
      ContactPerson: row.contact_person,
      ContactMobileNo: row.customer_mobile_no,
      PurchaseAmount: row.purchase_amount,
      RoundOff: row.rounded_off,
      TotalAmount: row.total_amount,
      TaxAmount: row.tax_amount,
      GSTNo: row.customer_gst_no,
      attention: row.kind_attention,
      Quotation_Validity: row.quotation_validity,
    }));
    handleQuotationData(selectedData);
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
                            <h1 align="left" className="purbut">Quotation Help</h1>
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
                              placeholder='Entry Date'
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
                              placeholder='Customer Code'
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
                              placeholder='Contact Person'
                              value={contact_person}
                              onChange={(e) => setcontact_person(e.target.value)}
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
                            <h1 className="h1">Quotation Help</h1>
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
                              placeholder='Entry Date'
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
                              placeholder='Customer Code'
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
                              placeholder='Contact Person'
                              value={contact_person}
                              onChange={(e) => setcontact_person(e.target.value)}
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
