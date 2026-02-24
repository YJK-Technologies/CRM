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
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    headerName: "Item Code",
    field: "Item_code",
    cellStyle: { textAlign: "center" },
    editable: false,
  },
  {
    headerName: "Variant",
    field: "Item_variant",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Item Name",
    field: "Item_name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Item Image",
    field: "item_images",
    editable: false,
    cellStyle: { textAlign: "center" },
    cellRenderer: (params) => {
      if (params.value) {
        return (
          <img
            src={`data:image/jpeg;base64,${params.value}`}
            alt="Item"
            style={{ width: "50px", height: "50px" }}
          />
        );
      } else {
        return "No Image";
      }
    },
  },
  {
    headerName: "Item Weight",
    field: "Item_wigh",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Base UOM",
    field: "Item_BaseUOM",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "SecondaryUOM",
    field: "Item_SecondaryUOM",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Short Name",
    field: "Item_short_name",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Without Tax",
    field: "Item_Last_salesRate_ExTax",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "With Tax",
    field: "Item_Last_salesRate_IncludingTax",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Purchase Price",
    field: "Item_std_purch_price",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Sales Price",
    field: "Item_std_sales_price",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Stock Code",
    field: "Item_stock_code",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Stock TYPE",
    field: "Item_stock_type",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Tax Type",
    field: "Item_purch_tax_type",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Cash Or Credit",
    field: "Item_Costing_Method",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "HSN Code",
    field: "hsn",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Register Brand",
    field: "Item_Register_Brand",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Our Brand",
    field: "Item_Our_Brand",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "Status",
    field: "status",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "combined_tax_details",
    field: "combined_tax_details",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "combined_tax_percent",
    field: "combined_tax_percent",
    editable: false,
    cellStyle: { textAlign: "center" },
  },
];

const defaultColDef = {
  resizable: true,
  wrapText: true,
  sortable: true,
  editable: true,
  // flex: 1,
};


export default function QuotationItemPopup({ open, handleClose, handleItem }) {

  const [rowData, setRowData] = useState([]);
  const [Item_code, setItem_code] = useState("");
  const [Item_variant, setItem_variant] = useState("");
  const [Item_name, setItem_name] = useState("");
  const [Item_short_name, setItem_short_name] = useState("");
  const [Item_Our_Brand, setItem_Our_Brand] = useState("");
  const [status, setstatus] = useState("");
  const [loading, setLoading] = useState(false);


  // Function to convert binary data to base64 string
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  const handleSearchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/itempursearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem("selectedCompanyCode"), Item_code, Item_variant, Item_name, Item_short_name, Item_Our_Brand, status })
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            Item_code: item.Item_code,
            Item_variant: item.Item_variant,
            Item_name: item.Item_name,
            item_images: item.item_images ? arrayBufferToBase64(item.item_images.data) : null,
            Item_BaseUOM: item.Item_BaseUOM,
            Item_SecondaryUOM: item.Item_SecondaryUOM,
            Item_short_name: item.Item_short_name,
            Item_Last_salesRate_ExTax: item.Item_Last_salesRate_ExTax,
            Item_Last_salesRate_IncludingTax: item.Item_Last_salesRate_IncludingTax,
            Item_std_purch_price: item.Item_std_purch_price,
            Item_std_sales_price: item.Item_std_sales_price,
            Item_stock_code: item.Item_stock_code,
            Item_stock_type: item.Item_stock_type,
            Item_purch_tax_type: item.Item_purch_tax_type,
            Item_Costing_Method: item.Item_Costing_Method,
            hsn: item.hsn,
            Item_Register_Brand: item.Item_Register_Brand,
            Item_Our_Brand: item.Item_Our_Brand,
            status: item.status,
            combined_tax_details: item.combined_tax_details,
            combined_tax_percent: item.combined_tax_percent
          }))
        );
        setRowData(updatedData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning('Data not found')
        setRowData([]);
        clearInputs([])
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
      itemImages: row.item_images,
      purchaseAmt: row.Item_std_purch_price,
      taxType: row.Item_purch_tax_type,
      taxDetails: row.combined_tax_details,
      taxPer: row.combined_tax_percent,
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
                          <div className="mb-3 mt-3 d-flex justify-content-end">
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
                          <div className="mb-3 mt-3 d-flex justify-content-end">
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
