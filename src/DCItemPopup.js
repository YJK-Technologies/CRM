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
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "Item Code",
    field: "Item_code",
    cellStyle: { textAlign: "center" },
    minWidth: 250,
    maxWidth: 250,
    editable: false,
  },
  {
    headerName: "Variant",
    field: "Item_variant",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Item Name",
    field: "Item_name",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
    maxWidth: 150,
  },
  {
    headerName: "Item Weight",
    field: "Item_wigh",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "HSN/SAV",
    field: "hsn",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Base UOM",
    field: "Item_BaseUOM",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "SecondaryUOM",
    field: "Item_SecondaryUOM",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Short Name",
    field: "Item_short_name",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Without Tax",
    field: "Item_Last_salesRate_ExTax",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "With Tax",
    field: "Item_Last_salesRate_IncludingTax",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Purchase Price",
    field: "Item_std_purch_price",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Sales Price",
    field: "Item_std_sales_price",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Stock Code",
    field: "Item_stock_code",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Stock TYPE",
    field: "Item_stock_type",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Tax Type",
    field: "Item_purch_tax_type",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Cash Or Credit",
    field: "Item_Costing_Method",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "HSN Code",
    field: "hsn",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Register Brand",
    field: "Item_Register_Brand",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Our Brand",
    field: "Item_Our_Brand",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "Status",
    field: "status",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "combined_tax_details",
    field: "combined_tax_details",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
  {
    headerName: "combined_tax_percent",
    field: "combined_tax_percent",
    editable: false,
    cellStyle: { textAlign: "center" },
    minWidth: 150,
  },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  flex: 1,
};


export default function DCItemPopup({ open, handleClose, handleItem }) {

  const [rowData, setRowData] = useState([]);
  const [Item_code, setItem_code] = useState("");
  const [Item_variant, setItem_variant] = useState("");
  const [Item_name, setItem_name] = useState("");
  const [Item_short_name, setItem_short_name] = useState("");
  const [Item_Our_Brand, setItem_Our_Brand] = useState("");
  const [status, setstatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/itempursearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Item_code, Item_variant, Item_name, Item_short_name, Item_Our_Brand, status,company_code:sessionStorage.getItem("selectedCompanyCode") }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
       
        toast.error("Data not found!").then(() => {
          setRowData([]);
          clearInputs([])
        });
        console.log("Data not found"); // Log the message for 404 Not Found
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
    setItem_code("");
    setItem_variant("");
    setItem_name("");
    setItem_short_name("");
    setItem_Our_Brand("");
    setstatus("");
  };
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      itemCode: row.Item_code,
      itemName: row.Item_name,
      unitWeight: row.Item_wigh,
      purchaseAmt: row.Item_std_purch_price,
      taxType: row.Item_purch_tax_type,
      taxDetails: row.combined_tax_details,
      taxPer: row.combined_tax_percent,
      Hsn: row.hsn,
      baseuom: row.Item_BaseUOM,
    }));
    // console.log('Selected Data:', selectedData);
    handleItem(selectedData);
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
                            <h1 align="left" className="purbut">Item Help</h1>
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
                              type="text"
                              id="ItemCode"
                              className="exp-input-field form-control"
                              placeholder="Item Code"
                              value={Item_code}
                              onChange={(e) => setItem_code(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="Variant"
                              className="exp-input-field form-control"
                              placeholder="Variant"
                              value={Item_variant}
                              onChange={(e) => setItem_variant(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemName"
                              className="exp-input-field form-control"
                              placeholder="Item Name"
                              value={Item_name}
                              onChange={(e) => setItem_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Short Name"
                              value={Item_short_name}
                              onChange={(e) => setItem_short_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="OurBrand"
                              className="exp-input-field form-control"
                              placeholder="Our Brand"
                              value={Item_Our_Brand}
                              onChange={(e) => setItem_Our_Brand(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="Status"
                              className="exp-input-field form-control"
                              placeholder="Status"
                              value={status}
                              onChange={(e) => setstatus(e.target.value)}
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
              {loading && <LoadingScreen />}
              <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                  <div className="modal-content">
                    <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Item Help</h1>
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
                              type="text"
                              id="ItemCode"
                              className="exp-input-field form-control"
                              placeholder="Item Code"
                              value={Item_code}
                              onChange={(e) => setItem_code(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="Variant"
                              className="exp-input-field form-control"
                              placeholder="Variant"
                              value={Item_variant}
                              onChange={(e) => setItem_variant(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ItemName"
                              className="exp-input-field form-control"
                              placeholder="Item Name"
                              value={Item_name}
                              onChange={(e) => setItem_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="ShortName"
                              className="exp-input-field form-control"
                              placeholder="Short Name"
                              value={Item_short_name}
                              onChange={(e) => setItem_short_name(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="OurBrand"
                              className="exp-input-field form-control"
                              placeholder="Our Brand"
                              value={Item_Our_Brand}
                              onChange={(e) => setItem_Our_Brand(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-sm mb-2">
                            <input
                              type="text"
                              id="Status"
                              className="exp-input-field form-control"
                              placeholder="Status"
                              value={status}
                              onChange={(e) => setstatus(e.target.value)}
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
