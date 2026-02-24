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
import LoadingScreen from './Loading';
import { ToastContainer, toast } from 'react-toastify';
const config = require('./Apiconfig');


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

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Product Code",
    field: "Product_Code",
    editable: false,
    minWidth: 250,
    maxWidth: 250,
  },
  {
    headerName: "product Name",
    field: "product_name",
    editable: false,
    minWidth: 160,
    maxWidth: 160,
  },
  // {
  //   headerName: "Image",
  //   field: "Product_img",
  //   editable: false,
  //   cellStyle: { textAlign: "center" },
  //   minWidth: 150,
  //   maxWidth: 150,
  //   cellRenderer: (params) => {
  //     if (params.value) {
  //       return (
  //         <img
  //           src={`data:image/jpeg;base64,${params.value}`}
  //           alt="Item"
  //           style={{ width: "50px", height: "50px" }}
  //         />
  //       );
  //     } else {
  //       return "No Image";
  //     }
  //   },
  // },
  {
    headerName: "Header Description",
    field: "HeaderDescription",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Item Code",
    field: "item_Code",
    editable: false,
    minWidth: 160,
    maxWidth: 160,
  },
  {
    headerName: "Item Name",
    field: "item_name",
    editable: false,
    minWidth: 135,
    maxWidth: 200,
  },
  {
    headerName: "Quantity",
    field: "quantity",
    editable: false,
    minWidth: 140,
    maxWidth: 200,
  },
  // {
  //   headerName: "Tax",
  //   field: "Tax",
  //   editable: false,
  //   minWidth: 150,
  //   maxWidth: 200,
  // },
  // {
  //   headerName: "Total",
  //   field: "Tot_amt",
  //   editable: false,
  //   minWidth: 120,
  //   maxWidth: 200,
  // },
  {
    headerName: "Status",
    field: "status",
    editable: false,
    minWidth: 110,
    maxWidth: 200
  },
  {
    headerName: "Header Description",
    field: "HeaderDescription",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "HSN code",
    field: "HSN_code",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },

  {
    headerName: "Tax Type",
    field: "tax_type",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Other Tax Type",
    field: "Other_sales_taxtype",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: "Product Price",
    field: "Product_price",
    editable: false,
    minWidth: 200,
    maxWidth: 200,
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
export default function ProductPopup({ open, handleClose, ProductData }) {

  const [rowData, setRowData] = useState([]);
  const [Product_Code, setProduct_Code] = useState("");
  const [Product_name, setProduct_name] = useState("");
  const [status, setstatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/ProductSearchData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Product_Code, Product_name, status, company_code: sessionStorage.getItem('selectedCompanyCode') }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();

        const updatedData = await Promise.all(
          searchData.map(async (item) => ({
            ...item,
            productCode: item.Product_Code,
            productName: item.product_name,
            headerDescription: item.HeaderDescription,
            Product_img: item.Product_img ? arrayBufferToBase64(item.Product_img.data) : null,
            status: item.status,
            TaxName: item.tax_name_details,
            TaxPercentage: item.tax_percentage,
            TaxType: item.tax_type,
            HSNcode: item.HSN_code,
            ProductPrice: item.Product_price

          }))
        );
        setRowData(updatedData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.error("Data Not found")
          .then(() => {
            setRowData([]);
            clearInputs([])
          });
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.error(errorResponse.message);
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
    setProduct_Code("");
    setProduct_name("");
    setstatus("");
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
      productCode: row.Product_Code,
      productName: row.product_name,
      headerDescription: row.HeaderDescription,
      status: row.status,
      TaxName: row.tax_name_details,
      TaxPercentage: row.tax_percentage,
      TaxType: row.tax_type,
      HSNcode: row.HSN_code,
      ProductPrice: row.Product_price,
      Other_sales_taxtype: row.Other_sales_taxtype,
      Product_img: row.Product_img
    }));
    ProductData(selectedData);
    handleClose();
    clearInputs([]);
    setRowData([]);
  }

  return (
    <div >
      {open && (
        <fieldset>
          <div className="purbut">
                                {loading && <LoadingScreen />}
            
            <div className="purbut modal popupadj popup mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} >
              <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div className="p-0 bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between" >
                          <h1 align="left" className="purbut">Product Help</h1>
                          <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                            <i class="fa-solid fa-circle-xmark"></i>
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
                            id='Product_Code'
                            className='exp-input-field form-control'
                            placeholder='Product Code'
                            value={Product_Code}
                            onChange={(e) => setProduct_Code(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            autoComplete='off'
                          />
                        </div>
                        <div className="col-md-4 mb-2">
                          <input
                            type='text'
                            id='Product_name'
                            className='exp-input-field form-control'
                            placeholder='Product Name'
                            value={Product_name}
                            onChange={(e) => setProduct_name(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            autoComplete='off'
                          />
                        </div>
                        <div className="col-md-4 mb-2">
                          <input
                            type='text'
                            id='status'
                            className='exp-input-field form-control'
                            placeholder='Status'
                            value={status}
                            onChange={(e) => setstatus(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            autoComplete='off'
                          />
                        </div>
                        <div className="mb-3 mt-3 d-flex justify-content-end">
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
                      </div>
                      <div className="row">
                        <div className="col">
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

          <div className="mobileview">
            <div className=" modal   mt-5   Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} >
              <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div class="mb-0 rounded-0 d-flex justify-content-between">
                        <div className="mb-0 d-flex justify-content-start">
                          <h1 className="h1">Product Help</h1>
                        </div>
                        <div className="mb-0 d-flex justify-content-end ">
                          <button onClick={handleClose} className="closebtn2" required title="Close">
                            <i class="fa-solid fa-circle-xmark"></i>
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
                        <div className="col-md-4 mb-2">
                          <input
                            type='text'
                            id='Product_Code'
                            className='exp-input-field form-control'
                            placeholder='Product Code'
                            value={Product_Code}
                            onChange={(e) => setProduct_Code(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            autoComplete='off'
                          />
                        </div>
                        <div className="col-md-4 mb-2">
                          <input
                            type='text'
                            id='Product_name'
                            className='exp-input-field form-control'
                            placeholder='Product Name'
                            value={Product_name}
                            onChange={(e) => setProduct_name(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            autoComplete='off'
                          />
                        </div>
                        <div className="col-md-4 mb-2">
                          <input
                            type='text'
                            id='status'
                            className='exp-input-field form-control'
                            placeholder='Status'
                            value={status}
                            onChange={(e) => setstatus(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            autoComplete='off'
                          />
                        </div>
                        <div className="mb-3 mt-3 d-flex justify-content-end">
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
                      </div>
                      <div className="row">
                        <div className="col">
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
