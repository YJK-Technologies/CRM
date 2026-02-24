
import AutocompleteSelectCellEditor from 'ag-grid-autocomplete-editor';
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import "./apps.css";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import VendorPopup from './VendorPopup'
import ItemPopup from './ItemPopup'
import WarehousePopup from './WarehousePopup'
import swal from 'sweetalert';

function Sales() {
  const CompanyCode = sessionStorage.getItem('selectedCompanyCode'); 
  const CompanyName = sessionStorage.getItem('selectedCompanyName'); 
  const LocationCode = sessionStorage.getItem('selectedLocationCode'); 
  const LocationName = sessionStorage.getItem('selectedLocationName'); 
  const UserName = sessionStorage.getItem('selectedUserName'); 
  const UserCode = sessionStorage.getItem('selectedUserCode'); 
  // State variables
  const [gridApi, setGridApi] = useState(null);
  const [vendorcodedrop, setVendorcodedrop] = useState([]);
  const [paydrop, setPaydrop] = useState([]);
  const [salesdrop, setSalesdrop] = useState([]);
  const [itemnamedrop, setItemnamedrop] = useState([]);
  const [warehousedrop, setWarehousedrop] = useState([]);
  const [orderdrop, setOrderdrop] = useState([]);
  const [rowData, setRowData] = useState([{ delete: '', itemName: '', unitWeight: '', warehouse: '', purchaseQty: '', totalWeight: '', purchaseAmt: '', TotalTaxAmount: '', TotalItemAmount: '' }]);
  const [rowDataTax, setRowDataTax] = useState([{ Item_code: '', TaxType: '', TaxPercentage: '', TaxAmount: '' }]);
  const [activeTable, setActiveTable] = useState('myTable');
  const [partyCode, setPartyCode] = useState("");
  const [payType, setPayType] = useState("");
  const [salesType, setSalesType] = useState("local");
  const [ordertype, setOrderType] = useState("");
  const [customer_code, setcustomer_code] = useState("");

  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [TotalWithTax, setTotalWithTax] = useState("");
  const [bill_qty, setbill_qty] = useState("");
  const [TotalTaxAmount, setTotalTaxAmount] = useState("")
  const [TotalItemAmount, setTotalItemAmount] = useState("")
  const [error, setError] = useState("");
  const config = require('./Apiconfig');




  const handleChange = selectedOption => {
    setSelectedOption(selectedOption);
  };

  // const handleInputChange = (event) => {
  //   const value = event.target.value;
  //   setInputValue(value);
  //   const foundVendor = vendorcodedrop.find(vendor => vendor.vendor_code === value);
  //   if (foundVendor) {
  //     setLabelValue(foundVendor.vendor_name); 
  //   } else {
  //     setLabelValue(''); 
  //   }
  // };

  const handleOverlayClick = () => {
    setIsActive(false);
    if (selectedOption) {
      const partycodeLabel = document.getElementById('partyCode');
      partycodeLabel.innerText = selectedOption.value1;

      const partycodeInput = document.getElementById('party_code');
      partycodeInput.value = selectedOption.value;
      setPartyCode(selectedOption.value);
    }
  };




  const handleShowModal = () => {
    setIsActive(true);
  };
  //Item Name Popup
   const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setopen2] = React.useState(false);




  //vendor popup


  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
    setopen2(false);
  };


  //Warehouse Popup
  const handleClickOpen = (event) => {
    setOpen1(true);
    console.log('Opening popup...');
  };

  //item popup

  const handleClickOpen1 = (event) => {
    setOpen(true);
    
    
    console.log('Opening popup...');
  };
  // vendor 
  const handleClickOpen2 = (event) => {
    setopen2(true);
    console.log('Opening popup...');
  };

  //enter to close popup screen
  useEffect(() => {
    const handlekeypress = (event) => {
      if (event.key === 'Enter' && isActive && selectedOption) {
        handleOverlayClick();
      }
    };

    document.addEventListener('keypress', handlekeypress);
    return () => {
      document.removeEventListener('keypress', handlekeypress);
    };
  }, [isActive, selectedOption]);

  // Column definitions for the grid
  const columnDefs = [
    {
      headerName: 'S.No', field: 'S.No', maxWidth: 80, minWidth: 90, editable: true,
    },

    {
      headerName: '',
      field: 'delete',
      editable: false,
      maxWidth: 50,
      cellRenderer: function () {
        return <FontAwesomeIcon icon="fa-solid fa-trash" style={{ cursor: 'pointer' }} />
      },
    },
    {
      headerName: 'itemName', field: 'itemName', minWidth: 350, cellEditor: "agSelectCellEditor", editable: true,
      // onCellValueChanged: function (params) {
      //   handleItemCode(params);}
    },

    {
      headerName: '',
      field: 'Search',
      editable: true,
      maxWidth: 50,
      onCellClicked: handleClickOpen1,
      filter: true,
      cellRenderer: function () {
        return <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" style={{ cursor: 'pointer' }} />
      },
    },



    { headerName: 'UnitWeight', field: 'unitWeight', editable: true },

    {
      headerName: 'Warehouse', field: 'warehouse', editable: true, cellEditor: "agSelectCellEditor", onCellClicked: handleClickOpen,
    },

    { headerName: 'Purchase Qty', field: 'PurchaseQty', editable: true },
    { headerName: 'TotalWeight', field: 'TotalWeight', editable: true },
    { headerName: 'purchaseAmt', field: 'purchaseAmt', editable: true },
    { headerName: 'taxAmt', field: 'taxAmt', editable: true },
    { headerName: 'totalAmt', field: 'totalAmt', editable: true, maxWidth: 192 }
  ];

  const columnDefsTax = [
    { headerName: 'Item', field: 'Item', minWidth: 401 },
    { headerName: 'Taxper', field: 'TaxPer1', minWidth: 401 },
    { headerName: 'Taxper', field: 'TaxPer2', minWidth: 401 },
    { headerName: 'TotalTax', field: 'TotalTax', minWidth: 401 }
  ];

  // Fetch data from APIs
  useEffect(() => {
    fetch(`http://localhost:5500/vendorcode`)
      .then((response) => response.json())
      .then((data) => setVendorcodedrop(data))
      .catch((error) => console.error("Error fetching vendor codes:", error));

    fetch(`http://localhost:5500/paytype`)
      .then((response) => response.json())
      .then((data) => setPaydrop(data))
      .catch((error) => console.error("Error fetching payment types:", error));

    fetch(`http://localhost:5500/salestype`)
      .then((response) => response.json())
      .then((data) => setSalesdrop(data))
      .catch((error) => console.error("Error fetching sales types:", error));


    fetch(`http://localhost:5500/ordertype`)
      .then((response) => response.json())
      .then((data) => setOrderdrop(data))
      .catch((error) => console.error("Error fetching Order type:", error));
  }, []);

  // Event handlers
  const handleCellValueChanged = (params) => {
    const editingRowIndex = params.rowIndex;
    const lastRowIndex = rowData.length + 1;
    if (editingRowIndex === lastRowIndex) {
      setRowData([...rowData, { SNo: '', ItemName: '', unitWeight: '', warehouse: '', PurchaseQty: '', TotalWeight: '', PurchaseAmt: '', PaxAmt: '', TotalAmt: '' }]);
    }
  };

  const handleRowClicked = (event) => {
    const clickedRowIndex = event.rowIndex;
    console.log(clickedRowIndex)
  };



  const ItemAmountCalculation = async (params) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/ItemAmountCalculation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          SNo: params.data.SNo, ItemName: params.data.ItemName, UnitWeight: params.data.unitWeight, Warehouse: params.data.warehouse, PurchaseQty: params.data.PurchaseQty, TotalWeight: params.data.TotalWeight,
          PurchaseAmt: params.data.PurchaseAmt, TaxAmt: params.data.TaxAmt, TotalAmt: params.data.TotalAmt
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        const updatedRowData = rowData.map(row => {
          if (row.ItemName === params.data.ItemName) {
            const matchedItem = searchData.find(Item => Item.id === row.id);
            if (matchedItem) {
              return {
                ...row,
                ItemTotalWight: matchedItem.ItemTotalWight,
                TotalItemAmount: matchedItem.TotalItemAmount,
                TotalTaxAmount: matchedItem.TotalTaxAmount
              };
            }
          }
          return row;
        });
        setRowData(updatedRowData);

        let updatedRowDataTaxCopy = [...rowDataTax];

        searchData.forEach(Item => {
          let existingItem = updatedRowDataTaxCopy.find(row => row.ItemName === Item.ItemName && row.TaxType === Item.TaxType);

          if (existingItem) {
            existingItem.TaxPercentage = Item.TaxPercentage;
            existingItem.TaxAmount = Item.TaxAmount;
          } else {
            const newRow = {
              SNO: Item.SNO,
              TaxSNO: Item.TaxSNO,
              Item_code: Item.Item_code,
              TaxType: Item.TaxType,
              TaxPercentage: Item.TaxPercentage,
              TaxAmount: Item.TaxAmount
            };
            updatedRowDataTaxCopy.push(newRow);
          }
        });

        updatedRowDataTaxCopy.sort((a, b) => {
          if (a.ItemSNO === b.ItemSNO) {
            return a.TaxSNO - b.TaxSNO;
          }
          return a.ItemSNO - b.ItemSNO;
        });

        setRowDataTax(updatedRowDataTaxCopy);

        console.log("data fetched successfully")
      } else if (response.status === 404) {
        console.log("Data not found"); // Log the message for 404 Not Found
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };




  const saveEditedData = async () => {
    try {
      const response = await fetch("http://localhost:5500/saveEditedData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saveEditedData }),
      });
      if (response.status === 200) {
        console.log("Data saved successfully!");
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete the selected rows?");
    if (!confirmDelete) {
      return;
    }
    const company_nosToDelete = selectedRows.map((row) => row.company_no);
    try {
      const response = await fetch("http://localhost:5500/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_nos: company_nosToDelete }),
      });
      if (response.status === 200) {
        console.log("Rows deleted successfully:", company_nosToDelete);
      } else {
        console.error("Failed to delete rows");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  };

  const handleToggleTable = (table) => {
    setActiveTable(table);
  };

  const [selectedData, setSelectedData] = useState("")

  const handleToggle = (table) => {
    setActiveTable(activeTable === table ? '' : table);
  };


  const handleItem = async (selectedData) => {
    setSelectedData(selectedData)
    setRowData(selectedData);
  }

  /* const handleWarehouse = (data) => {
     const updatedRowData = rowData.map(row => {
       const matchedItem = data.find(item => item.id === row.id);
       if (matchedItem) {
         return {
           ...row,
           warehouse: matchedItem.warehouse_code
         };
       }
       return row;
     })
     setRowData(updatedRowData)
     console.log(updatedRowData)
   };*/

  const handleVendor = async (data) => {
    const [{ vendorcode, vendor_name }] = data;
    const cuscode = document.getElementById('cuscode');
    cuscode.value = vendorcode;
    setPartyCode(vendorcode);

    const cusname = document.getElementById('cusname');
    cusname.value = vendor_name;
    setPartyCode(vendor_name);
  };

  const handleWarehouse = (selectedData) => {
    const updatedRowData = rowData.map(row => {
      const matchedItem = selectedData.find(item => item.id === row.id);
      if (matchedItem) {
        return {
          ...row,
          warehouse: matchedItem.warehouse
        };
      }
      return row;
    })
    setRowData(updatedRowData)
  };




  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 900, width: "100%", padding: 10 }}>
        <h1 align="Left" style={{ marginLeft: '60px', marginTop: '50px' }}>Inventory</h1>
        <div align="left">
          <div className="row gx-3 p-0 ms-5">
          
          
          
          <div className="col-md-2 form-group">
              <div class="exp-form-floating">
                <select
                  name="cuscode"
                  id="cuscode"
                  type="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  align=" right"
                  required
                  onClick={handleClickOpen2} >

                </select>
                <label for="" class="exp-form-labels">
                  Customer Code
                </label>
              </div>
            </div>

            <div className="col-md-2 form-group">
              <div class="exp-form-floating">
                <input
                  name="cusname"
                  id="cusname"
                  type="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  align=" right"
                  required />
                <label for="" class="exp-form-labels">
                  Customer Name
                </label>
              </div>
            </div>
            <div className="col-md-2 form-group">
              <div class="exp-form-floating">
                <input
                  id="partycode"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required

                />
                <label for="partycode" class="exp-form-labels">
                  Bill Date
                </label>
              </div>
            </div>
            {/*pay type  <input type="text"/>drop */}

            <div className="col-md-2 form-group">
              <div class="exp-form-floating">
                <input
                  name="billno"
                  id="billno"
                  type="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  align=" right"
                  required />
                <label for="" class="exp-form-labels">
                  Bill Number
                </label>
              </div>
            </div>

            <div className="col-md-1 form-group">
              <div class="exp-form-floating">
                <select
                  name="paytype"
                  id="paytype"
                  className="exp-input-field form-control"
                  placeholder=""
                  type="date"
                  required
                  value={payType}
                  onChange={(e) => setPayType(e.target.value)}
                >
                  <option value=""></option>
                  {paydrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>
                <label for="" class="exp-form-labels">
                  Pay Type
                </label>
              </div>
            </div>
            {/*purchase type <input type="text"/>drop */}
            <div className="col-md-1 form-group">
              <div class="exp-form-floating">
                <select
                  name="purchasetype"
                  id="purchasetype"
                  className="exp-input-field form-control"

                  placeholder=""
                  required
                  value={salesType}
                  onChange={(e) => setSalesType(e.target.value)}
                >
                  <option value={salesType}>local</option>
                  {salesdrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>
                <label for="" class="exp-form-labels">
                  Sales Type
                </label>
              </div>
            </div>

            <div className="col-md-1 form-group">
              <div class="exp-form-floating">
                <select
                  name="purchasetype"
                  id="purchasetype"
                  className="exp-input-field form-control"
                  placeholder=""
                  required
                  value={ordertype}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value=""></option>
                  {orderdrop.map((option, index) => (
                    <option key={index} value={option.attributedetails_name}>
                      {option.attributedetails_name}
                    </option>
                  ))}
                </select>
                <label for="" class="exp-form-labels">
                  Order Type
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="ag-theme-alpine" style={{ height: 450, width: "100%", padding: 20 }}>
          <div id="btn" style={{ marginLeft: "30px", position: 'absolute' }}>
            <button
              className={`toggle-btn ${activeTable === 'myTable' ? 'active' : ''}`} class="butsales"
              onClick={() => handleToggle('myTable')}
            >
              Item Details
            </button>
            <button
              type="button"
              className={`toggle-btn ${activeTable === 'tax' ? 'active' : ''}`} class="butsales"
              onClick={() => handleToggleTable('tax')}
            >
              Tax Details
            </button>
          </div>


          <AgGridReact
            columnDefs={activeTable === 'myTable' ? columnDefs : columnDefsTax}
            rowData={activeTable === 'myTable' ? rowData : rowDataTax}
            defaultColDef={{ editable: true, resizable: false }}
            onCellValueChanged={async (event) => {
              await ItemAmountCalculation(event); // Wait for ItemAmountCalculation to complete
              handleCellValueChanged(event);
            }}
            onRowClicked={handleRowClicked}
          />
        </div>
        <div>
          <ItemPopup open={open} handleClose={handleClose} handleItem={handleItem} />
          <WarehousePopup open={open1} handleClose={handleClose} handleWarehouse={handleWarehouse} />
          <VendorPopup open2={open2} handleClose={handleClose} handleVendor={handleVendor} />
        </div>



        <div style={{ marginTop: "120px", marginLeft: "0px", marginRight: "65px" }} >
          <div align="right">
            <div className="col-md-2 form-group">
              <div class="exp-form-floating">
                <input
                  id="purchaseamt"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                />
                <label for="" class="exp-form-labels">
                  Total Purchase Amount
                </label>
              </div>
            </div>
            {/*pay type  <input type="text"/>drop */}
            <div className="col-md-2 form-group">
              <div class="exp-form-floating">
                <input
                  name="tax"
                  id="paytype"
                  text="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  required
                />

                <label for="" class="exp-form-labels">
                  Tax
                </label>
              </div>
            </div>

            {/*purchase type <input type="text"/>drop */}
            <div className="col-md-2 form-group">
              <div class="exp-form-floating">
                <input
                  name="billamt"
                  id="purchasetype"
                  type="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  required
                />
                <label for="" class="exp-form-labels">
                  Bill Amount
                </label>
              </div>
            </div>
            <div align="right">
              <button className="toggle-btn" onClick={saveEditedData}>
                Save <i class="bi bi-save2"></i>
              </button>
              <button className="toggle-btn" onClick={saveEditedData}>
                Print <i class="bi bi-save2"></i>
              </button>
              <button className="toggle-btn" onClick={deleteSelectedRows}>
                Delete  <i class="bi bi-trash"></i>
              </button>
            </div>


          </div>
        </div>
      </div>

      <section className={`modal-section ${isActive ? 'active' : ''}`}>
        <span className="span" onClick={handleOverlayClick}></span>

        <div className="modal-box">

          <Select
            value={selectedOption}
            onChange={handleChange}
            // options={filteredOptions.map((option, index) => ({
            //   value1: option.vendor_name,
            //   value: option.vendor_code,
            //   label:`${option.vendor_name} (${option.vendor_code})`
            // }))}
            className='select'
          />
        </div>

      </section>
    </div>
  );
}

export default Sales;

