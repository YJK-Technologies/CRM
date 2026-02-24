import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import LoadingScreen from './Loading';
const config = require('./Apiconfig');


const columnDefs = [
    {
  
      checkboxSelection: true,
      headerName: "Warehouse Code",
      field: "warehouse_code",
      editable: false,
      cellStyle: { textAlign: "center" },
      //minWidth: 250,
      //maxWidth: 250,

    
    },
    {
      headerName: "Warehouse Name",
      field: "warehouse_name",
      editable: false,
      cellStyle: { textAlign: "center" },
      //minWidth: 150,

    },
    {
      headerName: "Status",
      field: "status",
      editable: false,
      cellStyle: { textAlign: "center" },
      //minWidth: 150,
      //maxWidth: 150,
    },
    {
      headerName: "Location No",
      field: "location_no",
      editable: false,
      cellStyle: { textAlign: "center" },
      //minWidth: 150,
    
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    sortable: true,
    editable: true,
    // flex: 1,
    
    
  };
  
export default function StockTransferWarehousePopup({ open, handleClose, handleWarehouse}) {

  const [rowData, setRowData] = useState([]);
  const [warehouse_code, setwarehouse_code] = useState("");
  const [warehouse_name, setwarehouse_name] = useState("");
  const [status, setstatus] = useState("");
  const [location_no, setlocation_no] = useState("");
   const [loading, setLoading] = useState(false);

  const handlewarehouseSearch = async () => {
        setLoading(true);
        try {
      const response = await fetch(`${config.apiBaseUrl}/warehouseSearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({company_code : sessionStorage.getItem('selectedCompanyCode'), warehouse_code, warehouse_name, status, location_no }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
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
  const [selectedRows, setSelectedRows] = useState([]);
  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm1 = () => {
    const selectedData1 = selectedRows.map(row => ({
      warehouse: row.warehouse_code 
    }));
    console.log('Selected Data:', selectedData1);
    handleWarehouse(selectedData1);
    handleClose();
    clearInputs([])
    setRowData([])
    }

    
    const handleReload = () => {
      clearInputs([])
      setRowData([])
    };
  
    const clearInputs = () => {
      setwarehouse_code("");
      setwarehouse_name("");
      setstatus("");
      setlocation_no("");
    };

  return (
    <>
    {open && (
       <fieldset>
      <div>
      <div  className="purbut">
              {loading && <LoadingScreen />}
      <div className="modal mt-5 Topnav-screen popupadj popup"  tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
        <div className="modal-content">
        <div class="row justify-content-center">
        <div class="col-md-12 text-center">
                        <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">Wareouse Help</h1>
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
                <div className="row me-3 ms-3">
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='WarehouseCode'
                      className='form-control'
                      maxLength={18}
                      placeholder=' Warehouse Code'
                      value={warehouse_code}
                      onChange={(e) => setwarehouse_code(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='WarehouseName'
                      className='form-control'
                      maxLength={250}
                      placeholder='Warehouse Name'
                      value={warehouse_name}
                      onChange={(e) => setwarehouse_name(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                       autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='Status'
                      className='form-control'
                      placeholder=' Status'
                      maxLength={18}
                      value={status}
                      onChange={(e) => setstatus(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                       autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='LocationNo'
                      className='form-control'
                      placeholder=' Location No'
                      maxLength={18}
                      value={location_no}
                      onChange={(e) => setlocation_no(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                       autoComplete="off"
                    />
                  </div>
                  <div className="mb-2 mt-2 d-flex justify-content-end">
                    <icon className="icon popups-btn" onClick={handlewarehouseSearch}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} /> 
                    </icon>
                    <icon className="icon popups-btn" onClick={handleReload}>
                    <i class="fa-solid fa-arrow-rotate-right"></i>
                    </icon>
                    <icon className="icon popups-btn" onClick={handleConfirm1}>
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
      <div  className="mobileview">
      <div className="modal mt-5 Topnav-screen"  tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
        <div className="modal-content">
        <div class="row justify-content-center">
        <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">Warehouse Help</h1>
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
                <div className="row me-3 ms-3">
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='WarehouseCode'
                      className='form-control'
                      maxLength={18}
                      placeholder=' Warehouse Code'
                      value={warehouse_code}
                      onChange={(e) => setwarehouse_code(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='WarehouseName'
                      className='form-control'
                      maxLength={250}
                      placeholder='Warehouse Name'
                      value={warehouse_name}
                      onChange={(e) => setwarehouse_name(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                       autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='Status'
                      className='form-control'
                      placeholder=' Status'
                      maxLength={18}
                      value={status}
                      onChange={(e) => setstatus(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                       autoComplete="off"
                    />
                  </div>
                  <div className="col-sm mb-2">
                    <input
                      type='text'
                      id='LocationNo'
                      className='form-control'
                      placeholder=' Location No'
                      maxLength={18}
                      value={location_no}
                      onChange={(e) => setlocation_no(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlewarehouseSearch()}
                       autoComplete="off"
                    />
                  </div>
                  <div className="mb-2 mt-2 d-flex justify-content-end">
                    <button className="" onClick={handlewarehouseSearch}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} /> 
                    </button>
                    <button className="" onClick={handleReload}>
                    <i class="fa-solid fa-arrow-rotate-right"></i>
                    </button>
                    <button className="" onClick={handleConfirm1}>
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
  </>
  );
}
