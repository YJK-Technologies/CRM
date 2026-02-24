
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
import PurchaseVendorPopup from './PurchaseVendorPopup'
import Swal from 'sweetalert2';
import "./mobile.css";
import PurchaseItemPopup from './PurchaseItemPopup';
import { useNavigate } from "react-router-dom";
import PurchaseWarehousePopup from './PurchaseWarehousePopup';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Search from './search-icon.svg';
import { upperCase } from "upper-case";
// import PurchasePopup from './PurchasePopup'
import PurchaseDelDetPopup from './PurchaseDelDetPopup'
const config = require('./Apiconfig');


function PurchaseDeleteDetails() {

  const CompanyName = sessionStorage.getItem('selectedCompanyName');
  const LocationCode = sessionStorage.getItem('selectedLocationCode');
  const LocationName = sessionStorage.getItem('selectedLocationName');
  const UserName = sessionStorage.getItem('selectedUserName');


  const [rowData, setRowData] = useState([{ serialNumber: 1, delete: '', itemCode: '', itemName: '', serach: '', unitWeight: 0, warehouse: '', purchaseQty: 0, ItemTotalWight: 0, purchaseAmt: 0, TotalTaxAmount: 0, TotalItemAmount: 0 }]);
  const [rowDataTax, setRowDataTax] = useState([]);
  const [activeTable, setActiveTable] = useState('myTable');
  const [vendor_code, setvendor_code] = useState("");
  const [payType, setPayType] = useState("");
  const [purchaseType, setPurchaseType] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [bill_qty, setbill_qty] = useState("");
  const [TotalBill, setTotalBill] = useState('');
  const [TotalTax, setTotalTax] = useState(0)
  const [TotalPurchase, setTotalPurchase] = useState(0)
  const [round_difference, setRoundDifference] = useState(0)
  const [refNo, setRefNo] = useState("");
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState('');
  const [, setSelected] = useState(null);
  const [vendor_name, setVendorName] = useState("")
  const navigate = useNavigate();
  const [status, setStatus] = useState('Ready to Add  Data...');


  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');

  const handlePurchase = () => {
    setOpen3(true);
  };

  //Item Name Popup
  const [open3, setOpen3] = React.useState(false);



  const handleClose = () => {
    setOpen3(false);
  };

  const handleKeyPressRef = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(refNo)
    }
  };


  // Column definitions for the grid
  const columnDefs = [
    {
      headerName: 'S.No',
      field: 'serialNumber',
      maxWidth: 80,
      sortable: false,
      editable: false
    },
    {
      headerName: 'Item Code',
      field: 'itemCode',
      editable: false,
      maxWidth: 140,
      filter: true,
      cellEditorParams: {
        maxLength: 18,
      },
      sortable: false,
      autoComplete: false
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      editable: false,
      maxwidth: 150,
      filter: true,
      cellEditorParams: {
        maxLength: 40,
      },
      sortable: false
    },
    {
      headerName: 'Unit Weight',
      field: 'unitWeight',
      editable: false,
      maxWidth: 150,
      filter: true,
      sortable: false
    },
    {
      headerName: 'Warehouse',
      field: 'warehouse',
      editable: false,
      filter: true,
      maxWidth: 150,
      cellEditorParams: {
        maxLength: 18,
      },
      sortable: false,
      autoComplete: false
    },
    {
      headerName: ' Qty',
      field: 'purchaseQty',
      editable: false,
      maxWidth: 140,
      filter: true,
      value: { bill_qty },
      sortable: false,
      autoComplete: false
    },
    {
      headerName: 'Tot Weight',
      field: 'ItemTotalWight',
      editable: false,
      maxWidth: 140,
      filter: true,
      sortable: false
    },
    {
      headerName: 'Unit Price',
      field: 'purchaseAmt',
      editable: false,
      maxWidth: 170,
      filter: true,
      sortable: false
    },
    {
      headerName: 'Tax Amount',
      field: 'TotalTaxAmount',
      editable: false,
      minWidth: 165,
      maxWidth: 165,
      filter: true,
      sortable: false
    },
    {
      headerName: 'Total',
      field: 'TotalItemAmount',
      editable: false,
      filter: true,
      maxWidth: 130,
      sortable: false
    },
    {
      headerName: 'Purchase Tax Type',
      field: 'taxType',
      editable: false,
      maxWidth: 150,
      filter: true,
      hide: true,
      sortable: false
    },
    {
      headerName: 'Tax Detail',
      field: 'taxDetails',
      editable: false,
      maxWidth: 150,
      filter: true,
      hide: true,
      sortable: false
    },
    {
      headerName: 'tax Percentage',
      field: 'taxPer',
      editable: false,
      maxWidth: 150,
      filter: true,
      hide: true,
      sortable: false
    },
  ];

  //DEFINE TAX DETAIL COLUMNS
  const columnDefsTax = [
    {
      headerName: 'S.No',
      field: 'ItemSNO',
      maxWidth: 80,
      sortable: false,
      editable: false
    },
    {
      headerName: 'Tax S.No',
      field: 'TaxSNO',
      maxWidth: 120,
      sortable: false,
      editable: false
    },
    {
      headerName: 'Item Code',
      field: 'Item_code',
      minWidth: 315,
      sortable: false,
      editable: false
    },
    {
      headerName: 'Tax Type ',
      field: 'TaxType',
      minWidth: 201,
      sortable: false,
      editable: false
    },
    {
      headerName: 'Tax %',
      field: 'TaxPercentage',
      minWidth: 201,
      sortable: false,
      editable: false
    },
    {
      headerName: 'Tax Amount',
      field: 'TaxAmount',
      minWidth: 301,
      sortable: false,
      editable: false
    }
  ];

  const handleToggleTable = (table) => {
    setActiveTable(table);
  };

  const handleTransactionDateChange = (e) => {
    const date = e.target.value;
    setStatus('Typing...');
    if (date >= financialYearStart && date <= financialYearEnd) {
      setTransactionDate(date);
    } else {
      alert('Transaction date must be between April 1st, 2024 and March 31st, 2025.');
    }
  };

  const handleEntryDateChange = (e) => {
    const date = e.target.value;
    setStatus('Typing...');
    if (date >= financialYearStart && date <= financialYearEnd) {
      setEntryDate(date);
    } else {
      alert('Entry date must be between April 1st, 2024 and March 31st, 2025.');
    }
  };

  const handleChangeNo = (e) => {
    const deleteNumber = e.target.value;
    setRefNo(deleteNumber); setStatus('Typing...');
  }

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatToTwoDecimalPoints = (number) => {
    return parseFloat(number).toFixed(2);
  };

  const handleRefNo = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getPurchaseDeleteDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ purch_autono: code }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        // console.log(searchData)
        if (searchData.table1 && searchData.table1.length > 0) {
          console.log("Table 1 Data:", searchData.table1);
          const item = searchData.table1[0];
          setEntryDate(formatDate(item.Entry_date));
          setPayType(item.pay_type);
          setRefNo(item.purch_autono);
          setPurchaseType(item.purchase_type);
          setTransactionDate(formatDate(item.transaction_date));
          setTransactionNumber(item.transaction_no);
          setvendor_code(item.vendor_code);
          setTotalPurchase(formatToTwoDecimalPoints(item.purchase_amount));
          setTotalTax(formatToTwoDecimalPoints(item.tax_amount));
          setTotalBill(formatToTwoDecimalPoints(item.total_amount));
          setRoundDifference(formatToTwoDecimalPoints(item.rounded_off));

        } else {
          console.log("Table 1 is empty or not found");
        }

        if (searchData.table2 && searchData.table2.length > 0) {
          console.log("Table 2 Data:", searchData.table2);

          const updatedRowData = searchData.table2.map(item => {
            // Find all tax details from table3 that correspond to the current item in table2
            const taxDetailsList = searchData.table3.filter(taxItem => taxItem.item_code === item.item_code);

            // Extract and join tax types and percentages as comma-separated strings
            const taxType = taxDetailsList.map(taxItem => taxItem.tax_name_details).join(",");
            const taxPer = taxDetailsList.map(taxItem => taxItem.tax_per).join(",");
            const taxDetails = taxDetailsList.length > 0 ? taxDetailsList[0].tax_type : null;

            setVendorName(item.vendor_name)
            return {
              serialNumber: item.ItemSNo,
              itemCode: item.item_code,
              itemName: item.item_name,
              unitWeight: item.weight,
              warehouse: item.warehouse_code,
              purchaseQty: item.bill_qty,
              ItemTotalWight: parseFloat(item.total_weight).toFixed(2),
              purchaseAmt: item.item_amt,
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
              TaxAmount: parseFloat(item.tax_amt).toFixed(2),
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
        Swal.fire({
          icon: 'error',
          title: 'Data not found',
          text: 'The requested data could not be found.',
        });

        // Clear the data fields
        setEntryDate('');
        setPayType('');
        setRefNo('');
        setSelected('');
        setSelectedOption('')
        setTransactionDate('');
        setTransactionNumber('');
        setvendor_code('');
        setVendorName('');
        setTotalPurchase('');
        setTotalTax('');
        setRoundDifference('');
        setTotalBill('')
        setRowData([{ serialNumber: 1, delete: '', itemCode: '', itemName: '', serach: '', unitWeight: 0, warehouse: '', purchaseQty: 0, ItemTotalWight: 0, purchaseAmt: 0, TotalTaxAmount: 0, TotalItemAmount: 0 }])
        setRowDataTax([])
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handlePurchaseDeleteData = async (data) => {
    if (data && data.length > 0) {
      const [{ TransactionNo, TransactionDate, Entrydate, PurchaseType, PayType, purch_autono, TotalTax, Amount, VendorName, TotalAmount, Vendorcode, RoundOff }] = data;

      const transactionNumber = document.getElementById('transactionNumber');
      if (transactionNumber) {
        transactionNumber.value = TransactionNo;
        setTransactionNumber(TransactionNo);
      } else {
        console.error('transactionNumber element not found');
      }
      const roundOff = document.getElementById('roundOff');
      if (roundOff) {
        roundOff.value = RoundOff;
        setRoundDifference(RoundOff);
      } else {
        console.error('transactionNumber element not found');
      }

      const entrydate = document.getElementById('entryDate');
      if (entrydate) {
        entrydate.value = Entrydate;
        setEntryDate(formatDate(Entrydate));  // You can choose to use formattedDate instead if required
      } else {
        console.error('entry element not found');
      }

      const payType = document.getElementById('payType');
      if (payType) {
        payType.value = PayType;
        setPayType(PayType);  // You can choose to use formattedDate instead if required
      } else {
        console.error('entry element not found');
      }

      const purchaseType = document.getElementById('purchaseType');
      if (purchaseType) {
        purchaseType.value = PurchaseType;
        setPurchaseType(PurchaseType);  // You can choose to use formattedDate instead if required
      } else {
        console.error('entry element not found');
      }

      const transactiondate = document.getElementById('transactionDate');
      if (transactiondate) {
        transactiondate.value = TransactionDate;
        setTransactionDate(formatDate(TransactionDate));  // You can choose to use formattedDate instead if required
      } else {
        console.error('entry element not found');
      }


      const RefNo = document.getElementById('RefNo');
      if (RefNo) {
        RefNo.value = purch_autono;
        setRefNo(purch_autono);
      } else {
        console.error('transactionNumber element not found');
      }

      const totalPurchaseAmount = document.getElementById('totalPurchaseAmount');
      if (totalPurchaseAmount) {
        totalPurchaseAmount.value = Amount;
        setTotalPurchase(formatToTwoDecimalPoints(Amount));
      } else {
        console.error('transactionNumber element not found');
      }

      const totalTaxAmount = document.getElementById('totalTaxAmount');
      if (totalTaxAmount) {
        totalTaxAmount.value = TotalTax;
        setTotalTax(formatToTwoDecimalPoints(TotalTax));
      } else {
        console.error('transactionNumber element not found');
      }

      const totalBillAmount = document.getElementById('totalBillAmount');
      if (totalBillAmount) {
        totalBillAmount.value = TotalAmount;
        setTotalBill(formatToTwoDecimalPoints(TotalAmount));
      } else {
        console.error('transactionNumber element not found');
      }

      const partyCode = document.getElementById('party_code');
      if (partyCode) {
        partyCode.value = Vendorcode;
        setvendor_code(Vendorcode);
      } else {
        console.error('transactionNumber element not found');
      }
      const partyName = document.getElementById('party_code');
      if (partyName) {
        partyName.value = VendorName;
        setVendorName(VendorName);
      } else {
        console.error('transactionNumber element not found');
      }

      await PurchaseTax(purch_autono);

    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const PurchaseTax = async (purch_autono) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/purdeletedtax`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ purch_autono: purch_autono })
      });

      if (response.ok) {
        const searchData = await response.json();
        const newTaxDetail = [];
        const taxNameDetailsArray = [];
        const taxPer = [];
        let taxType = '';
        searchData.forEach(({ ItemSNo, TaxSNo, item_code, tax_name_details, tax_per, tax_amt, tax_type }) => {
          newTaxDetail.push({
            ItemSNO: ItemSNo,
            TaxSNO: TaxSNo,
            Item_code: item_code,
            TaxType: tax_name_details,
            TaxPercentage: tax_per,
            TaxAmount: parseFloat(tax_amt).toFixed(2),
            TaxName: tax_type
          });
          taxNameDetailsArray.push(tax_name_details);
          taxPer.push(tax_per);
          taxType = tax_type;
        });

        const taxNameDetailsString = taxNameDetailsArray.join(',');
        const taxPerDetaiString = taxPer.join(',');

        setRowDataTax(newTaxDetail);

        PurchaseDetail(purch_autono, taxNameDetailsString, taxPerDetaiString, taxType);
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const PurchaseDetail = async (purch_autono, taxNameDetailsString, taxPerDetaiString, taxType) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/purdeletedunit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ purch_autono: purch_autono })
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
            tax_amount,
            bill_rate,
          } = item;

          newRowData.push({
            serialNumber: ItemSNo,
            itemCode: item_code,
            itemName: item_name,
            unitWeight: weight,
            purchaseQty: bill_qty,
            warehouse: warehouse_code,
            ItemTotalWight: parseFloat(total_weight).toFixed(2),
            purchaseAmt: parseFloat(item_amt).toFixed(2),
            TotalTaxAmount: parseFloat(tax_amount).toFixed(2),
            TotalItemAmount: parseFloat(bill_rate).toFixed(2),
            taxType: taxNameDetailsString,
            taxPer: taxPerDetaiString,
            taxDetails: taxType,
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


  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let startYear, endYear;
    if (currentMonth >= 4) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else {
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    const financialYearStartDate = new Date(startYear, 3, 1).toISOString().split('T')[0]; // April 1
    const financialYearEndDate = new Date(endYear, 2, 31).toISOString().split('T')[0]; // March 31

    setFinancialYearStart(financialYearStartDate);
    setFinancialYearEnd(financialYearEndDate);
  }, []);

  return (
    <div align="left">
      <div>
        <div class="d-flex justify-content-between" className='head'>
          <h1 align="left" class="topu" > Deleted Purchase</h1>
        </div>
      </div>
      <div className="status">{status}</div>
      <hr />

      <div >

        <div className="row ms-4">
          <div className="col-md-3 form-group">
            <label htmlFor="party_code">Transaction No</label>
            <div className="exp-form-floating">
              <div class="d-flex justify-content-between">
                <input
                  id="RefNo"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  value={refNo}
                  onChange={handleChangeNo}
                  onKeyDown={(e) => {
                    // Allow only numbers and certain special keys like Backspace and Arrow keys
                    if (!/^\d$/.test(e.key) && e.key.length === 1 && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onKeyPress={handleKeyPressRef}
                  autoComplete='off'
                />
                <div><button className="" onClick={handlePurchase}><FontAwesomeIcon icon={faMagnifyingGlass} /></button></div>
              </div>
            </div>
          </div>


          <div className="col-md-3 form-group" >
            <div class="exp-form-floating" >
              <label for="" className={`${error && !transactionDate ? 'red' : ''}`}>Transaction Date</label>
              <span className="text-danger">*</span>
              <input
                name="transactionDate"
                id="transactionDate"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                min={financialYearStart}
                max={financialYearEnd}
                value={transactionDate}
                onChange={handleTransactionDateChange}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-3 form-group">

            <label htmlFor="party_code" className={`${error && !vendor_code ? 'red' : ''}`}>
              Vendor Code<span className="text-danger">*</span>
            </label>

            <div className="exp-form-floating">
              <div class="d-flex justify-content-between">
                <input
                  className="exp-input-field form-control"
                  id='party_code'
                  required
                  value={vendor_code}
                  maxLength={18}
                  autoComplete='off'
                  readOnly
                />
              </div>
            </div>
          </div>



          <div className="col-md-3 form-group"> <label id="partyName">Vendor Name</label>
            <div class="exp-form-floating">

              <input
                className="exp-input-field form-control"
                id='party_name'
                required
                value={vendor_name}
                onChange={(e) => setVendorName(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="col-md-3 form-group "><label for="" className={`${error && !payType ? 'red' : ''}`}>Pay Type
            <span className="text-danger">*</span>
          </label>

            <div class="exp-form-floating">

              <input
                id="payType"
                value={payType}
                className="exp-input-field"
                placeholder=""
                required
                isDisabled={true}
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label className={`${error && !purchaseType ? 'red' : ''}`}> Purchase Type</label>
              <span className="text-danger">*</span>
              <input
                id="purchaseType"
                value={purchaseType}
                className="exp-input-field"
                placeholder=""
                isDisabled={true}
              />
            </div>
          </div>
          <div className="col-md-3 form-group ">
            <div class="exp-form-floating">
              <label for="entryDate" className={`${error && !entryDate ? 'red' : ''}`}> Entry Date</label>
              <span className="text-danger">*</span>
              <input
                id="entryDate"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                min={financialYearStart}
                max={financialYearEnd}
                value={entryDate}
                onChange={handleEntryDateChange}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="" className={`${error && !transactionNumber ? 'red' : ''}`}>Reference No</label>
              <span className="text-danger">*</span>
              <input
                name="transactionNumber"
                id="transactionNumber"
                type="text"
                className="exp-input-field form-control"
                placeholder=""
                required
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                autoComplete='off'
                readOnly
              />
            </div>
          </div>
        </div>

        <hr />
      </div>

      <div>

        <div className='row ms-4 mb-3'>

          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="" class="exp-form-labels" className="partyName">Total Amt</label>
              <input
                id="totalPurchaseAmount"
                class="exp-input-field form-control input"
                type="text"
                placeholder=""
                required
                value={TotalPurchase}
                onChange={(e) => setTotalPurchase(e.target.value)}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="" class="exp-form-labels" className="partyName"> Total Tax </label>
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
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="" class="exp-form-labels" className="partyName">Round Off</label>
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
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="" class="exp-form-labels" className="partyName">Total Bill Amt</label>
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
              />
            </div>
          </div>

        </div>
      </div>

      <div class="d-flex justify-content-between ms-3" style={{ marginBlock: "", marginTop: "10px" }} >
        <div align="left" class="d-flex justify-content-start" style={{ marginLeft: "25px" }}>
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
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 437, width: "100%" }}>
        <AgGridReact
          columnDefs={activeTable === 'myTable' ? columnDefs : columnDefsTax}
          rowData={activeTable === 'myTable' ? rowData : rowDataTax}
          defaultColDef={{ editable: true, resizable: true }}
        />
      </div>
      <div>
        <PurchaseDelDetPopup open={open3} handleClose={handleClose} handlePurchaseDeleteData={handlePurchaseDeleteData} />
      </div>
    </div>
  );
}

export default PurchaseDeleteDetails;