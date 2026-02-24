
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
import { ToastContainer,toast } from 'react-toastify';
import SalesVendorPopup from './SalesVendorPopup'
import { useNavigate } from "react-router-dom";
import SalesItemPopup from './ItemPopup';
import SalesWarehousePopup from './WarehousePopup';
import SalesDeletedPopup from './SalesdeletePopup';

import Search from './search-icon.svg';
import { Dropdown, DropdownButton } from 'react-bootstrap';
const config = require('./Apiconfig');



function DeletedSales() {
  const CompanyCode = sessionStorage.getItem('selectedCompanyCode'); 
  const CompanyName = sessionStorage.getItem('selectedCompanyName'); 
  const LocationCode = sessionStorage.getItem('selectedLocationCode'); 
  const LocationName = sessionStorage.getItem('selectedLocationName'); 
  const UserName = sessionStorage.getItem('selectedUserName'); 
  const UserCode = sessionStorage.getItem('selectedUserCode'); 

  // State variables
  const [vendorcodedrop, setVendorcodedrop] = useState([]);
  const [paydrop, setPaydrop] = useState([]);
  const [orderdrop, setOrderdrop] = useState([]);
  const [salesdrop, setSalesdrop] = useState([]);
  const [rowData, setRowData] = useState([{ serialNumber: 1, delete: '', itemCode: '', itemName: '', serach: '', unitWeight: 0, warehouse: '', salesQty: 0, ItemTotalWight: 0, purchaseAmt: 0, TotalTaxAmount: 0, TotalItemAmount: 0 }]);
  const [rowDataTax, setRowDataTax] = useState([]);
  const [activeTable, setActiveTable] = useState('myTable');
  const [customerCode, setCustomerCode] = useState("");
  const [payType, setPayType] = useState("");
  const [salesType, setSalesType] = useState("");
  const [delvychellanno, setDelvychellanno] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");
  const [orderType, setOrderType] = useState(null);
  const [bill_qty, setbill_qty] = useState("");
  const [TotalBill, setTotalBill] = useState(0);
  const [TotalTax, setTotalTax] = useState(0)
  const [Totalsales, setTotalsales] = useState(0)
  const [round_difference, setRoundDifference] = useState(0)
  const [error, setError] = useState("");
  const [refNo, setRefNo] = useState(0);
  const navigate = useNavigate();
  const [inventory_autono, setInventory_autono] = useState("");
  const [status, setStatus] = useState('Ready to Add Data...');
  const [customerName, setCustomerName] = useState("");
  const [selected, setSelected] = useState(null);
    const [global,setGlobal] = useState(null)

  
  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const sales = permissions
  .filter(permission => permission.screen_type === 'Sales')
  .map(permission => permission.permission_type.toLowerCase());




  
  const handleChangeNo = (e) => {
    const refNo = e.target.value;
    setInventory_autono(refNo); setStatus("Typing...")
  }

  const handleShowModall = () => {
    setOpen4(true);
  };


  const [open4, setOpen4] = React.useState(false);

  

  const handleClose = () => {
    setOpen4(false);
  };





  const handleKeyDelete = (e) => {
    if (e.key === 'Enter') {
      handleDeleteRefNo(inventory_autono);
    }
  };


  // Column definitions for the grid
  const columnDefs = [
    {
      headerName: 'S.No',
      field: 'serialNumber',
      maxWidth: 80,
      editable: false
    },
    {
      headerName: 'Item Code',
      field: 'itemCode',
      editable: true,
      maxWidth: 140,
      filter: true,
      editable: false,
      onCellValueChanged: function (params) {
      
        
      }
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      editable: true,
      maxwidth: 150,
      filter: true,
      editable: false,
      cellEditorParams: {
        maxLength: 40,
      },
      sortable:false
    },
    {
      headerName: 'Unit Weight',
      field: 'unitWeight',
      editable: true,
      maxWidth: 150,
      editable: false,
      filter: true,
    },
    {
      headerName: 'Warehouse',
      field: 'warehouse',
      editable: true,
      filter: true,
      maxWidth: 150,
      editable: false,
      cellEditorParams: {
        maxLength: 18,
      },
      sortable:false
    },
    {
      headerName: ' Qty',
      field: 'salesQty',
      editable: true,
      maxWidth: 140,
      filter: true,
      editable: false,
      value: { bill_qty }
    },
    {
      headerName: 'Total Weight',
      field: 'ItemTotalWeight',
      editable: true,
      minWidth: 150,
      maxWidth: 150,
      editable: false,
      filter: true,
    },
    {
      headerName: 'Unit Price',
      field: 'purchaseAmt',
      editable: true,
      maxWidth: 170,
      editable: false,
      filter: true,
    },
    {
      headerName: 'Tax Amount',
      field: 'TotalTaxAmount',
      editable: true,
      minWidth:150,
      maxWidth: 150,
      editable: false,
      filter: true,
    },
    {
      headerName: 'Total',
      field: 'TotalItemAmount',
      editable: true,
      filter: true,
      minWidth: 135,
      editable: false,
      maxWidth: 135,
    },
    {
      headerName: 'Purchase Tax Type',
      field: 'taxType',
      editable: true,
      maxWidth: 150,
      filter: true,
      editable: false,
      hide: true
    },
    {
      headerName: 'Tax Detail',
      field: 'taxDetails',
      editable: true,
      maxWidth: 150,
      filter: true,
      editable: false,
      hide: true
    },
    {
      headerName: 'tax Percentage',
      field: 'taxPer',
      editable: true,
      maxWidth: 150,
      filter: true,
      editable: false,
      hide: true,
    },
  ];

  //DEFINE TAX DETAIL COLUMNS
  const columnDefsTax = [
    {
      headerName: 'S.No',
      field: 'ItemSNO',
      editable: false,
      maxWidth: 80,
    },
    {
      headerName: 'Tax S.No',
      field: 'TaxSNO',
      maxWidth: 120,
      editable: false,
    },
    {
      headerName: 'Item Code',
      field: 'Item_code',
      editable: false,
      minWidth: 401
    },
    {
      headerName: 'Tax Type ',
      field: 'TaxType',
      editable: false,
      minWidth: 401,
    },
    {
      headerName: 'Tax percentage',
      field: 'TaxPercentage',
      editable: false,
      minWidth: 401
    },
    {
      headerName: 'Tax Amount',
      field: 'TaxAmount',
      editable: false,
      minWidth: 401,
    }
  ];



  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return (`${year}-${month}-${day}`);
  };


  const handleToggleTable = (table) => {
    setActiveTable(table);
  };
  
  
  const handleDeletedData = async (data) => {
    if (data && data.length > 0) {
      const [{ BillNo, BillDate, SalesType,RoundOff,DCNo,SaleAmount,TotalAmount,TotalTax, PayType, InventoryAutoNo, CustomerName, CustomerCode,OrderType }] = data;
      console.table(data);

      // Set TransactionDate to current date (or use TransactionDate if required)
      const billDate = document.getElementById('billDate');
      if (billDate) {
        billDate.value = BillDate;
        setBillDate(formatDate(BillDate));
      } else {
        console.error('Billdate element not found');
      }

      const billNo = document.getElementById('billNo');
      if (billNo) {
        billNo.value = BillNo;
        setBillNo(BillNo);
      } else {
        console.error('Billdate element not found');
      }

      // Set TransactionNumber
      const ordertype = document.getElementById('ordertype');
      if (ordertype) {
        ordertype.value = OrderType;
        setOrderType(OrderType);
      } else {
        console.error('transactionNumber element not found');
      }

      const salesType = document.getElementById('salesType');
      if (salesType) {
        salesType.value = SalesType;
        setSalesType(SalesType);
      } else {
        console.error('transactionNumber element not found');
      }

      const payType = document.getElementById('payType');
      if (payType) {
        payType.value = PayType;
        setPayType(PayType);
      } else {
        console.error('transactionNumber element not found');
      }

      const referenceNumberInput = document.getElementById('saleReferNo');
      if (referenceNumberInput) {
        referenceNumberInput.value = InventoryAutoNo;
        setRefNo(InventoryAutoNo);
      } else {
        console.error('referenceNumber element not found');
      }

      const customerCode = document.getElementById('customercode');
      if (customerCode) {
        customerCode.value = CustomerCode;
        setCustomerCode(CustomerCode);
      } else {
        console.error('vendor element not found');
      }

      const customerName = document.getElementById('customername');
      if (customerName) {
        customerName.value = CustomerName;
        setCustomerName(CustomerName);
      } else {
        console.error('vendor element not found');
      }

      const roundOff = document.getElementById('roundOff');
      if (roundOff) {
        roundOff.value = RoundOff;
        setRoundDifference(RoundOff);
      } else {
        console.error('vendor element not found');
      }

      const dcNo = document.getElementById('dcno');
      if (dcNo) {
        dcNo.value = DCNo;
        setDelvychellanno(DCNo);
      } else {
        console.error('vendor element not found');
      }

      const saleAmount = document.getElementById('totalSaleAmount');
      if (saleAmount) {
        saleAmount.value = SaleAmount;
        setTotalsales(SaleAmount);
      } else {
        console.error('vendor element not found');
      }
      
      const totalAmount = document.getElementById('totalBillAmount');
      if (totalAmount) {
        totalAmount.value = TotalAmount;
        setTotalBill(TotalAmount);
      } else {
        console.error('vendor element not found');
      }

      const totalTax = document.getElementById('totalTaxAmount');
      if (totalTax) {
        totalTax.value = TotalTax;
        setTotalTax(TotalTax);
      } else {
        console.error('vendor element not found');
      }

      // Fetch purchase return tax details
      await SalesReturnTax(InventoryAutoNo);
      console.log(InventoryAutoNo)
    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  }
  const SalesReturnTax = async (InventoryAutoNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/salesdelsearchtax`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inventry_autono: InventoryAutoNo })
      });

      if (response.ok) {
        const searchData = await response.json();
        const newTaxDetail = [];
        const taxNameDetailsArray = [];
        const taxPer = [];
        let TaxName = '';
        searchData.forEach(({ ItemSNo, TaxSNo, item_code, tax_name_details, tax_per, tax_amt, tax_type }) => {
          newTaxDetail.push({
            ItemSNO:ItemSNo,
            TaxSNO:TaxSNo,
            Item_code: item_code,
            TaxType:tax_name_details,
            TaxPercentage:tax_per,
            TaxAmount:tax_amt,
            TaxName:tax_type
          });
          taxNameDetailsArray.push(tax_name_details);
          taxPer.push(tax_per);
          TaxName = tax_type;
        });

        const taxNameDetailsString = taxNameDetailsArray.join(',');
        const taxPerDetaiString = taxPer.join(',');

        setRowDataTax(newTaxDetail);

        SalesReturnDetail(InventoryAutoNo, taxNameDetailsString, taxPerDetaiString, TaxName);
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };
  
  const SalesReturnDetail = async (InventoryAutoNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/saledelsearchitem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inventry_autono: InventoryAutoNo })
      });

      if (response.ok) {
        const searchData = await response.json();

        const newRowData = [];
        searchData.forEach(item => {
          const {
            ItemSNo,
            item_code,
            item_name,
            weight,
            warehouse_code,
            bill_qty,
            total_weight,
            item_amt,
            tax_amt,
            bill_rate
          } = item;

          newRowData.push({
            serialNumber: ItemSNo,
            itemCode: item_code,
            itemName: item_name,
            unitWeight: weight,
            salesQty: bill_qty,
            warehouse: warehouse_code,
            ItemTotalWeight: total_weight,
            purchaseAmt: item_amt,
            TotalTaxAmount: tax_amt,
            TotalItemAmount: bill_rate
          });
        });
        setRowData(newRowData);

      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };



  const formatToTwoDecimalPoints = (number) => {
    return parseFloat(number).toFixed(2);
  };


  const handleDeleteRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getRefSalesDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inventry_autono: code }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        if (searchData.table1 && searchData.table1.length > 0) {
          console.log("Table 1 Data:", searchData.table1);
          const item = searchData.table1[0];
          setRefNo(item.inventry_autono);
          setBillDate(formatDate(item.bill_date));
          setBillNo(item.bill_no);
          setCustomerCode(item.customer_code);
          setCustomerName(item.customer_name);
          setDelvychellanno(item.dely_chlno);
          setOrderType(item.order_type);
          setPayType(item.pay_type);
          setSalesType(item.sales_type);
          setTotalBill(formatToTwoDecimalPoints(item.bill_amt));
          setRoundDifference(formatToTwoDecimalPoints(item.roff_amt));
          setTotalsales(formatToTwoDecimalPoints(item.sale_amt));
          setTotalTax(formatToTwoDecimalPoints(item.tax_amount));

          
        } else {
          console.log("Table 1 is empty or not found");
        }

        if (searchData.table2 && searchData.table2.length > 0) {
          console.log("Table 2 Data:", searchData.table2);

          const updatedRowData = searchData.table2.map(item => {
            // Find all tax details from table3 that correspond to the current item in table2
            const taxDetailsList = searchData.table3.filter(taxItem => taxItem.item_code === item.item_code);

            // Extract and join tax types and percentages as comma-separated strings
            const taxDetails = taxDetailsList.map(taxItem => taxItem.tax_name_details).join(",");
            const taxPer = taxDetailsList.map(taxItem => taxItem.tax_per).join(",");
            const taxType = taxDetailsList.length > 0 ? taxDetailsList[0].tax_type : null;

            // Set the vendor_name to the label
            document.getElementById('customercode').textContent = item.customer_name;

            return {
              serialNumber: item.ItemSNo,
              itemCode: item.item_code,
              itemName: item.item_name,
              unitWeight: item.weight,
              warehouse: item.warehouse_code,
              billQty: item.bill_qty,
              ItemTotalWeight: item.total_weight,
              itemAmt: item.item_amt,
              taxAmt: item.tax_amt,
              totalReturnAmt: item.bill_rate,
              ReturnWeight: item.return_weight,
              purchaseAmt: item.item_amt,
              delvychellanno: item.dely_chlno,
              TotalTaxAmount: parseFloat(item.tax_amount).toFixed(2),
              TotalItemAmount: parseFloat(item.bill_rate).toFixed(2),
              taxType: taxType || null,
              taxPer: taxPer || null,
              taxDetails: taxDetails || null
            };
          });

          setRowData(updatedRowData);
        } else {
          console.log("Table 2 is empty or not found");
        }

        if (searchData.table3 && searchData.table3.length > 0) {
          console.log("Table 3 Data:", searchData.table3);

          const updatedRowDataTax = searchData.table3.map(item => {
            return {
              ItemSNO: item.ItemSNo,
              TaxSNO: item.TaxSNo,
              Item_code: item.item_code,
              TaxType: item.tax_name_details,
              TaxPercentage: item.tax_per,
              TaxAmount: item.tax_amt,
              TaxName: item.tax_type
            };
          });

          console.log(updatedRowDataTax);
          setRowDataTax(updatedRowDataTax);
        } else {
          console.log("Table 3 is empty or not found");
        }

        console.log("data fetched successfully")

      } else if (response.status === 404) {
        
        toast.error("Data Not Found")

        // Clear the data fields
        setRefNo('')
        setTotalsales('');
        setDelvychellanno('');
        setPayType('');
        setSalesType('');
        setBillDate('');
        setBillNo('');
        setCustomerCode('');
        setCustomerName('');
        setTotalTax('');
        setRowData([{ serialNumber: 1, delete: '', itemCode: '', itemName: '', serach: '', unitWeight: 0, warehouse: '', billQty: 0, ItemTotalWight: 0, salesAmt: 0, TotalTaxAmount: 0, TotalItemAmount: 0 }]);
        setRowDataTax([]);
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };
    

  
  

  return (
    <div>
      <div className="d-flex justify-content-between"  class="head">
         <h1 align="left" class="topu" >Deleted Sales</h1>
        
             
    <div class="purbut">
          <div class="d-flex me-4">
          
        </div>
      </div>
       </div>
       <div className="status">{status}</div>
      <hr />
      <div >
         <div className="row  ms-2">

   < div className="col-md-2 form-group">

   <label htmlFor="party_code" >
   Sales Reference No<span className="text-danger">*</span>
   </label>

   <div className="exp-form-floating">
   <div class="d-flex justify-content-between">
    <input
      className="exp-input-field form-control"
      id='saleReferNo'
      required
      value={refNo}
      onChange={handleChangeNo}
      onKeyPress={handleKeyDelete}
      autoComplete="off"
    />
    <div> <button className=""  onClick={handleShowModall}>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
     </button></div>
     </div>
   </div></div> 


          <div className="col-md-3 form-group">

          <label htmlFor="party_code"  className={`${error && !customerCode ? 'red' : ''}`}>
          Customer Code
          </label>

          <div className="exp-form-floating">
            <div class="d-flex justify-content-between">
              <input
                className="exp-input-field form-control"
                id='customercode'
                required
                value={customerCode}
                autoComplete="off"
                readOnly
              />
              {/* <div> <button className=""  onClick={handleShowModal}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button></div> */}
            </div>
          </div></div>
          
          <div className="col-md-2 form-group">
            <div className="exp-form-floating">
              <label id="customer">Customer Name</label>
              <input
                className="exp-input-field form-control"
                id="customername"
                required
                value={customerName}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-2 form-group">
            {/* {error && !payType && <div className="text-danger">Pay Type should not be blank.</div>} */}
            <div className="exp-form-floating">
              <label htmlFor="" className={`${error && !payType ? 'red' : ''}`}>Pay type</label>
              <input
                id="payType"
                value={payType}
                className="exp-input-field form-control"
                placeholder=""
                required
                isDisabled={true}
                data-tip="Please select a payment type"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-md-2 form-group">
            <div className="exp-form-floating">
              <label htmlFor="" >Sales Type</label>
              <input
                id="salesType"
                value={salesType}
                className="exp-input-field form-control"
                placeholder=""
                required
                isDisabled={true}
                data-tip="Please select a payment type"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-md-2 form-group">
            <div className="exp-form-floating">
              <label htmlFor="" >Order Type</label>
              <input
                id="ordertype"
                value={orderType}
                className="exp-input-field"
                placeholder=""
                required
                readOnly
                isDisabled={true}
                data-tip="Please select a payment type"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-md-2 form-group">
            {/* {error && !billNo && <div className="text-danger">Transaction Number should not be blank.</div>} */}
            <div className="exp-form-floating">
              <label htmlFor="" className={`${error && !billNo ? 'red' : ''}`}>Bill No</label>
              <span className="text-danger">*</span>
              <input
                name="transactionNumber"
                id="billNo"
                type="text"
                className="exp-input-field form-control"
                placeholder=""
                required
                value={billNo}
                readOnly
                onChange={(e) => {
                  setBillNo(e.target.value);
                  setStatus('Typing...');
                }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-md-2 form-group ">
            {/* {error && !billDate && <div className="text-danger">Transaction Date should not be blank.</div>} */}
            <div className="exp-form-floating">
              <label htmlFor=""  className={`${error && !billDate ? 'red' : ''}`}>Bill Date</label>
              <span className="text-danger">*</span>
              <input
                name="transactionDate"
                id="billDate"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                readOnly
                value={billDate}
                onChange={(e) => {
                  setBillDate(e.target.value);
                  setStatus('Typing...');
                }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-md-2 form-group">
            <div className="exp-form-floating">
              
              <label >DC No.</label>
              <input
                name="transactionNumber"
                id="dcno"
                type="text"
                className="exp-input-field form-control"
                placeholder=""
                required
                readOnly
                value={delvychellanno}
                onChange={(e) => {
                  setDelvychellanno(e.target.value);
                  setStatus('Typing...');
                }}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <hr />
      </div>
   <div className="d-flex justify-content-end ">
      <div className="row ms-2" >
        <div className="col-md-2 form-group">
          <div className="exp-form-">
            <label htmlFor="" >Total Sales Amt</label>
            <input
              id="totalSaleAmount"
              className="exp-input-field form-control input"
              type="text"
              placeholder=""
              required
              value={Totalsales}
              onChange={(e) => setTotalsales(e.target.value)}
              readOnly
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-md-2 form-group">
          <div className="exp-form-floating">
            <label htmlFor="">Total Tax</label>
            <input
              name="totalTaxAmount"
              id="totalTaxAmount"
              text="text"
              className="exp-input-field form-control input"
              placeholder=""
              required
              value={TotalTax}
              onChange={(e) => setTotalTax(e.target.value)}
              readOnly
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-md-2 form-group">
          <div className="exp-form-floating">
            <label htmlFor="">Round Off</label>
            <input
              name=""
              id="roundOff"
              type="text"
              className="exp-input-field form-control input"
              placeholder=""
              required
              value={round_difference}
              onChange={(e) => setRoundDifference(e.target.value)}
              readOnly
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-md-2 form-group">
          <div className="exp-form-floating">
            <label htmlFor="">Total Bill Amt</label>
            <input
              name=""
              id="totalBillAmount"
              type="text"
              className="exp-input-field form-control input"
              placeholder=""
              required
              value={TotalBill}
              onChange={(e) => setTotalBill(e.target.value)}
              readOnly
              autoComplete="off"
            />
          </div>
        </div>
      </div></div>
      <div class="d-flex justify-content-between ms-3" style={{  marginBlock: "", marginTop: "10px" }} >
      <div align="left" class="d-flex justify-content-start" style={{ marginLeft: "14px" }}>
          <purButton
            type="button"
            className={`"toggle-btn"  ${activeTable === 'myTable' ? 'active' : ''}`}
            onClick={() => handleToggleTable('myTable')}>
            Item Details
          </purButton>
          <purButton
            type="button"
            className={`"toggle-btn" ${activeTable === 'tax' ? 'active' : ''}`}
            onClick={() => handleToggleTable('tax')}>
            Tax Details
          </purButton>   
          
      </div></div>
      <div className="ag-theme-alpine" style={{ height: 437, width: "100%" }}>
        <AgGridReact
          columnDefs={activeTable === 'myTable' ? columnDefs : columnDefsTax}
          rowData={activeTable === 'myTable' ? rowData : rowDataTax}
          defaultColDef={{ editable: true, resizable: true }}
          rowSelection="Single"
        />
      </div>
      <div>
        <SalesDeletedPopup open={open4}handleClose={handleClose} handleDeletedData={handleDeletedData} />
      </div>
    </div>
  );
}

export default DeletedSales;