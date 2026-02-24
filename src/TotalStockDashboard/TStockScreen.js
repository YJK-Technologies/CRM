import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../ItemDash.css";
import "../mobile.css";
import config from "../Apiconfig";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemPage = () => {
  const navigate = useNavigate();
  const [columnDefs] = useState([
    { headerName: "Item Code", field: "Item_code", minWidth: 100, maxWidth: 200 },
    { headerName: "Item Name", field: "Item_name", minWidth: 150, maxWidth: 200 },
    { headerName: "Opening Qty", field: "OpeningItemQty", minWidth: 150, maxWidth: 150 },
    { headerName: "Received Goods Qty", field: "ReceivedGoodsQty", minWidth: 200, maxWidth: 200 },
    { headerName: "Purchase Qty", field: "PurchaseQty", minWidth: 150, maxWidth: 150 },
    { headerName: "Sales Return Qty", field: "SalesReturnQty", minWidth: 150, maxWidth: 150 },
    { headerName: "Purchase Return Qty", field: "PurchaseReturnQty", minWidth: 200, maxWidth: 200 },
    { headerName: "Sales Qty", field: "SalesQty", minWidth: 100, maxWidth: 100 },
    { headerName: "Tax Invoice Qty", field: "TaxInvoiceQty", minWidth: 150, maxWidth: 150 },
    { headerName: "Delivery Challan Qty", field: "DCItemQty", minWidth: 200, maxWidth: 200 },
    { headerName: "Total Qty", field: "Total_Quantity", minWidth: 150, maxWidth: 150 },
    { headerName: "Total Value", field: "stock_value", minWidth: 150, maxWidth: 150 },
  ]);

  const [rowData, setRowData] = useState([]);
  const [itemDrop, setItemDrop] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [item, setItem] = useState("");

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getCurrentStockItemCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setItemDrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  useEffect(() => {
    const fetchCurrentStockData = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/getTotalStockValueDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode,item_code:item }),
        });
        if(response.ok){
          const data = await response.json();
          setRowData(data);
        }
        else if(response.status === 404){
          console.log('Data not found')
          setRowData([])
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCurrentStockData();
  }, [item]);

  const filteredOptionItem = Array.isArray(itemDrop)
  ? itemDrop.map((option) => ({
      value: option.Item_code,
      label: `${option.Item_code} - ${option.Item_name}`,
    }))
  : [];


  const handleChangeItem = (selected) => {
    setSelectedItem(selected);
    setItem(selected ? selected.value : '');
  };


  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container-fluid Topnav-screen">
     <ToastContainer position="top-right" className="toast-design" theme="colored" />
     <div className="shadow-lg p-0 bg-body-tertiary rounded mb-2 me-2">
        <div className="d-flex justify-content-between">
          <h1 className="purbut">Total Stock</h1>
          <div className="mobileview">
            <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start">
            <h1 className='h1 mt-3'>Total Stock</h1>
            </div>
            <div class="d-flex justify-content-end">
              <button
                class="btn btn-danger mt-3 mb-3 rounded-3 me-5"
                style={{ cursor: "pointer" }}
                onClick={goBack}
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
              </div>
            </div>
          </div>
          <div className="purbut">
            <div className="d-flex justify-content-end me-5">
              <button
                class="btn btn-danger mt-3 mb-3 rounded-3"
                style={{ cursor: "pointer" }}
                onClick={goBack}
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-3 bg-body-tertiary  rounded-bottom-0 mt-2">
        <div className="row ms-4">
          <div className="col-md-2 form-group ">
            <div class="exp-form-floating">
              <label for="ucode" class="exp-form-labels mb-1">
                Item Name
              </label>
              <Select
                type="text"
                className="exp-input-field"
                value={selectedItem}
                onChange={handleChangeItem}
                options={filteredOptionItem}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-3 bg-body-tertiary rounded mt-2">
        <div
          className="ag-theme-alpine mb-4"
          style={{ height: 600, width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationAutoPageSize={true}
            rowSelection="Single"
            onSelectionChanged={() => console.log("Selection Changed")}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
