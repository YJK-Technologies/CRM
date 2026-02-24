import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import "./apps.css";
import "./input.css";
import "./mobile.css";
import * as XLSX from 'xlsx';
import "bootstrap/dist/css/bootstrap.min.css";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InventoryHdrPopup from './SalesReturnPopup';
import SalesRetrunView from './SalesReturnViewPopup';
import Select from 'react-select'
import labels from './Labels';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function SalesReturn() {

  // State variables
  const [paydrop, setPaydrop] = useState([]);
  const [Salesdrop, setSalesdrop] = useState([]);
  const [rowData, setRowData] = useState([{ serialNumber: 1, delete: '', itemCode: '', itemName: '', serach: '', unitWeight: '', warehouse: '', billQty: '', ItemTotalWight: 0, salesAmt: 0, TotalTaxAmount: 0, TotalItemAmount: 0 }]);
  const [rowDataTax, setRowDataTax] = useState([]);
  const [activeTable, setActiveTable] = useState('myTable');
  const [return_reason, setreturn_reason] = useState("");
  const [return_person, setreturn_person] = useState("");
  const [return_no, setreturn_no] = useState("");
  const [return_date, setreturn_date] = useState("");

  const [TotalTax, setTotalTax] = useState(0)
  const [error, setError] = useState("");
  const [payType, setPayType] = useState("");
  const [roundOff, setRoundOff] = useState(0);
  const [salesType, setSalesType] = useState("");
  const [billDate, setBillDate] = useState("");
  const [billNo, setBillNo] = useState("");
  const [saleAmount, setTotalSaleAmount] = useState(0);
  const [inventory_autono, setInventory_autono] = useState("");
  const [inventry_ret_autono, setinventry_ret_autono] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [new_running_no, setNew_running_no] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customer_name, setcustomerName] = useState("");
  const [Ret_no, setReturn_no] = useState("");
  const [returnDate, setReturnDate] = useState(0);
  const [additionalData, setAdditionalData] = useState({
    modified_by: '',
    created_by: '',
    modified_date: '',
    created_date: ''
  });
  const [hovered, setHovered] = useState(false);
  const retperson = useRef();
  const retreason = useRef();
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [showExcelButton, setShowExcelButton] = useState(false);
  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAsterisk, setShowAsterisk] = useState(false);
  const [authError, setAuthError] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const salesReturnPermission = permissions
    .filter(permission => permission.screen_type === 'Sales Return')
    .map(permission => permission.permission_type.toLowerCase());

  const handleShowModal = () => {
    setOpen(true);
  };

  const handleShowReturn = () => {
    setOpen1(true);
  };

  //Item Name Popup
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
  };

  //Warehouse Popup
  const handleOpen = (event) => {
    setOpen1(true);
    console.log('Opening popup...');
  };


  const onCellValueChanged = (params) => {
    if (params.colDef.field === 'returnQty') {
      const salesQty = params.data.billQty;
      let newValue = parseFloat(params.newValue);

      if (isNaN(newValue) || newValue < 0 || newValue > salesQty) {
        // Handle invalid or out-of-range values
        newValue = 0; // Set to zero
        params.node.setDataValue('returnQty', newValue);
        params.api.refreshCells({ rowNodes: [params.node], columns: ['returnQty'] }); // Refresh cell

        let errorMessage = '';
        if (isNaN(newValue)) {
          errorMessage = 'Please enter a valid number.';
        } else if (newValue < 0) {
          errorMessage = 'Negative values are not allowed for return quantity.';
        } else if (newValue > salesQty) {
          errorMessage = 'Return quantity cannot be greater than Sales quantity.';
        }

        toast.warning("Return Qty Should Not be Greater than Sales qty");
      } else {
        // Valid value
        params.data.returnQty = newValue;
        SalesreturnItemAmountCalculation(params);
      }
    } else {
      // Handle other fields if needed
    }
  };

  const onCellValueChangedView = (params) => {
    if (params.colDef.field === 'returnQty') {
      const salesQty = params.data.billQty;
      let newValue = parseFloat(params.newValue);

      if (isNaN(newValue) || newValue < 0 || newValue > salesQty) {
        // Handle invalid or out-of-range values
        newValue = 0; // Set to zero
        params.node.setDataValue('returnQty', newValue);
        params.api.refreshCells({ rowNodes: [params.node], columns: ['returnQty'] }); // Refresh cell

        let errorMessage = '';
        if (isNaN(newValue)) {
          errorMessage = 'Please enter a valid number.';
        } else if (newValue < 0) {
          errorMessage = 'Negative values are not allowed for return quantity.';
        } else if (newValue > salesQty) {
          errorMessage = 'Return quantity cannot be greater than Sales quantity.';
        }

        toast.warning("Return Qty Should Not be Greater than Sales qty");
      } else {
        params.data.returnQty = newValue;
        SalesreturnItemAmountCalculation(params);
      }
    } else {
    }
  };

  const formatToTwoDecimalPoints = (number) => {
    return parseFloat(number).toFixed(2);
  };

  // CODE FOR TOTAL WEIGHT, TOTAL TAX, AND TOTAL AMOUNT CALCULATION
  const SalesreturnItemAmountCalculation = async (params) => {
    if (params.data.billQty >= params.data.returnQty) {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getSalesReturnItemAmountCalculation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            Item_SNO: params.data.serialNumber,
            Item_code: params.data.itemCode,
            return_qty: Number(params.data.returnQty),
            item_amt: params.data.itemAmt,
            tax_type_header: params.data.taxType,
            tax_name_details: params.data.taxDetails,
            tax_percentage: params.data.taxPer,
            UnitWeight: params.data.unitWeight
          })
        });

        if (response.ok) {
          const searchData = await response.json();
          const updatedRowData = rowData.map(row => {
            if (row.itemCode === params.data.itemCode && row.serialNumber === params.data.serialNumber) {
              const matchedItem = searchData.find(item => item.id === row.id);
              if (matchedItem) {
                return {
                  ...row,
                  ReturnWeight: formatToTwoDecimalPoints(matchedItem.ItemTotalWeight),
                  totalReturnAmt: parseFloat(matchedItem.TotalItemAmount).toFixed(2),
                  taxAmt: formatToTwoDecimalPoints(matchedItem.TotalTaxAmount)
                };
              }
            }
            return row;
          });
          setRowData(updatedRowData);

          let updatedRowDataTaxCopy = [...rowDataTax];

          searchData.forEach(item => {
            let existingItem = updatedRowDataTaxCopy.find(row => row.serialNumber === item.ItemSNO && row.Item_code === item.Item_code && row.TaxType === item.TaxType);

            if (existingItem) {
              // Remove the existing item with different item code
              const indexToRemove = updatedRowDataTaxCopy.indexOf(existingItem);
              updatedRowDataTaxCopy.splice(indexToRemove, 1);
            }
            const existingItemWithSameCode = updatedRowDataTaxCopy.find(row => row.ItemSNO === item.ItemSNO && row.Item_code === item.Item_code && row.TaxType === item.TaxType);

            if (existingItemWithSameCode) {
              existingItemWithSameCode.TaxPercentage = item.TaxPercentage;
              existingItemWithSameCode.TaxAmount = item.TaxAmount;
            } else {
              const newRow = {
                ItemSNO: item.ItemSNO,
                TaxSNO: item.TaxSNO,
                Item_code: item.Item_code,
                TaxType: item.TaxType,
                TaxPercentage: item.TaxPercentage,
                TaxAmount: item.TaxAmount
              };
              updatedRowDataTaxCopy.push(newRow);
            }
          });

          updatedRowDataTaxCopy.sort((a, b) => a.ItemSNO - b.ItemSNO);

          setRowDataTax(updatedRowDataTaxCopy);
          console.log("Data fetched successfully");

          const hasReturnQty = updatedRowData.some(row => row.returnQty >= 0);

          if (hasReturnQty) {
            const totalReturnAmount = updatedRowData.map(row => row.totalReturnAmt || 0).join(',');
            const totalTaxAmount = updatedRowData.map(row => row.taxAmt || 0).join(',');

            // Remove trailing commas if present
            const formattedTotalItemAmounts = totalReturnAmount.endsWith(',') ? totalReturnAmount.slice(0, -1) : totalReturnAmount;
            const formattedTotalTaxAmounts = totalTaxAmount.endsWith(',') ? totalTaxAmount.slice(0, -1) : totalTaxAmount;

            // Ensure that TotalAmountCalculation receives numbers, not strings
            await TotalAmountCalculation(formattedTotalTaxAmounts, formattedTotalItemAmounts);

            console.log("TotalAmountCalculation executed successfully");
          } else {
            console.log("No rows with purchaseQty greater than 0 found");
          }

        } else if (response.status === 404) {
          console.log("Data not found"); // Log the message for 404 Not Found
        } else {
          console.log("Bad request"); // Log the message for other errors
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    } else {
      console.log("Bill quantity should be greater than or equal to return quantity. Skipping calculation.");
    }
  };

  const TotalAmountCalculation = async (formattedTotalTaxAmounts, formattedTotalItemAmounts) => {
    if (parseFloat(formattedTotalTaxAmounts) >= 0 && parseFloat(formattedTotalItemAmounts) >= 0) {
      try {
        const response = await fetch(`${config.apiBaseUrl}/SalesreturnTotalAmountCalculation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Tax_amount: formattedTotalTaxAmounts, sale_amt: formattedTotalItemAmounts, company_code: sessionStorage.getItem("selectedCompanyCode") }),
        });

        if (response.ok) {
          const data = await response.json();
          console.table(data);
          const [{ rounded_amount, round_difference, TotalSales, TotalTax }] = data;
          setTotalAmount(formatToTwoDecimalPoints(rounded_amount));
          setRoundOff(formatToTwoDecimalPoints(round_difference));
          setTotalSaleAmount(formatToTwoDecimalPoints(TotalSales));
          setTotalTax(formatToTwoDecimalPoints(TotalTax));
        } else {
          const errorMessage = await response.text();
          console.error(`Server responded with error: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleRowClicked = (event) => {
    const clickedRowIndex = event.rowIndex;
    console.log(clickedRowIndex)
  };

  const handleDelete = (params) => {
    const serialNumberToDelete = params.data.serialNumber; // Assuming itemCode is used to identify the row

    const updatedRowData = rowData.filter(row => row.serialNumber !== serialNumberToDelete);
    const updatedRowDataTax = rowDataTax.filter(row => row.ItemSNO !== serialNumberToDelete.toString());

    setRowData(updatedRowData);
    setRowDataTax(updatedRowDataTax);

    if (updatedRowData.length === 0) {
      const formattedTotalItemAmounts = '0.00';
      const formattedTotalTaxAmounts = '0.00';

      TotalAmountCalculation(formattedTotalTaxAmounts, formattedTotalItemAmounts);
    }

    const updatedRowDataWithNewSerials = updatedRowData.map((row, index) => ({
      ...row,
      serialNumber: index + 1 // Update serialNumber dynamically based on index
    }));
    setRowData(updatedRowDataWithNewSerials);

    // Sync rowDataTax with the updated serial numbers
    const updatedRowDataTaxWithNewSerials = updatedRowDataTax.map((taxRow) => {
      const correspondingRow = updatedRowDataWithNewSerials.find(
        (dataRow) => dataRow.itemCode === taxRow.Item_code
      );

      // Update ItemSNO to match the new serial number from rowData
      return correspondingRow
        ? { ...taxRow, ItemSNO: correspondingRow.serialNumber.toString() }
        : taxRow;
    });
    setRowDataTax(updatedRowDataTaxWithNewSerials);

    const totalItemAmounts = updatedRowData.map(row => row.totalReturnAmt || '0.00').join(',');
    const totalTaxAmounts = updatedRowData.map(row => row.taxAmt || '0.00').join(',');

    const formattedTotalItemAmounts = totalItemAmounts.endsWith(',') ? totalItemAmounts.slice(0, -1) : totalItemAmounts;
    const formattedTotalTaxAmounts = totalTaxAmounts.endsWith(',') ? totalTaxAmounts.slice(0, -1) : totalTaxAmounts;

    TotalAmountCalculation(formattedTotalTaxAmounts, formattedTotalItemAmounts);
  };

  function qtyValueSetter(params) {
    const newValue = parseFloat(params.newValue);

    // Check if the new value is not a number or if it contains invalid characters
    if (isNaN(newValue) || params.newValue.toString().trim() === '' || params.newValue.toString().match(/[^0-9.]/)) {
      toast.warning('Please enter a valid numeric quantity.');
      return false; // Reject the change
    }

    // Check if the new value is a number and not negative
    if (isNaN(newValue) || newValue < 0) {
      toast.warning('Return qty cannot be negative!');
      return false; // Prevent the value from being set
    }

    // Check if the new value is greater than the purchase quantity
    if (newValue > params.data.purchaseQty) {
      toast.warning("Return qty cannot be greater than the Sales quantity!");
      return false; // Prevent the value from being set
    }

    // If validation passes, update the purchase quantity
    params.data.returnQty = newValue;
    return true; // Allow the value to be set
  }


  // Column definitions for the grid
  const columnDefs = [
    {
      headerName: 'S.No',
      field: 'serialNumber',
      maxWidth: 80,
      editable: false
    },
    {
      headerName: '',
      field: 'delete',
      editable: false,
      maxWidth: 25,
      onCellClicked: handleDelete,
      cellRenderer: function (params) {
        return <FontAwesomeIcon icon="fa-solid fa-trash" style={{ cursor: 'pointer', marginRight: "12px" }} />
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: "2px" },
    },
    {
      headerName: 'Item Code',
      field: 'itemCode',
      editable: false,
      // maxWidth: 140,
      filter: true,
      editable: false
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      editable: false,
      // minWidth: 150,
      filter: true,
      editable: false
    },
    {
      headerName: 'Unit Weight',
      field: 'unitWeight',
      editable: false,
      // minWidth: 150,
      // maxWidth: 150,
      filter: true,
      editable: false
    },
    {
      headerName: 'Warehouse',
      field: 'warehouse',
      editable: false,
      filter: true,
      // maxWidth: 150,
      editable: false
    },
    {
      headerName: 'Sales Qty',
      field: 'billQty',
      editable: false,
      // maxWidth: 170,
      filter: true,
      editable: false
    },
    {
      headerName: 'Return Qty',
      field: 'returnQty',
      editable: !showExcelButton,
      filter: true,
      // maxWidth: 170,
      valueSetter: qtyValueSetter,
    },
    {
      headerName: 'Total Weight ',
      field: 'ItemTotalWeight',
      editable: false,
      filter: true,
      // maxWidth: 170,
      editable: false
    },
    {
      headerName: 'Return Weight',
      field: 'ReturnWeight',
      editable: false,
      filter: true,
      // maxWidth: 170,
      editable: false
    },
    {
      headerName: 'Unit Price',
      field: 'itemAmt',
      editable: false,
      filter: true,
      // maxWidth: 170,
      editable: false
    },
    {
      headerName: 'Tax Amount',
      field: 'taxAmt',
      editable: false,
      filter: true,
      // maxWidth: 130,
      editable: false
    },

    {
      headerName: 'Total',
      field: 'totalReturnAmt',
      editable: false,
      filter: true,
      // maxWidth: 130,
      editable: false
    },
    {
      headerName: 'Sales Tax Type',
      field: 'taxType',
      editable: false,
      // maxWidth: 150,
      filter: true,
      editable: false,
      hide: true
    },
    {
      headerName: 'Tax Detail',
      field: 'taxDetails',
      editable: false,
      // maxWidth: 150,
      filter: true,
      hide: true,
      editable: false
    },
    {
      headerName: 'tax Percentage',
      field: 'taxPer',
      editable: false,
      // maxWidth: 150,
      filter: true,
      hide: true,
      editable: false
    },
  ];

  //DEFINE TAX DETAIL COLUMNS
  const columnDefsTax = [
    {
      headerName: 'S.No',
      field: 'ItemSNO',
      maxWidth: 80,
      editable: false
    },
    {
      headerName: 'Tax S.No',
      field: 'TaxSNO',
      maxWidth: 120,
      editable: false
    },
    {
      headerName: 'Item Code',
      field: 'Item_code',
      // minWidth: 401,
      editable: false
    },
    {
      headerName: 'Tax Type ',
      field: 'TaxType',
      // minWidth: 401,
      editable: false
    },
    {
      headerName: 'Tax %',
      field: 'TaxPercentage',
      // minWidth: 401,
      editable: false
    },
    {
      headerName: 'Tax Amount',
      field: 'TaxAmount',
      // minWidth: 401,
      editable: false
    }
  ];

  // Fetch data from APIs
  useEffect(() => {

    fetch(`${config.apiBaseUrl}/paytype`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((response) => response.json())
      .then((data) => setPaydrop(data))
      .catch((error) => console.error("Error fetching payment types:", error));

    fetch(`${config.apiBaseUrl}/salestype`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((response) => response.json())
      .then((data) => setSalesdrop(data))
      .catch((error) => console.error("Error fetching sales types:", error));

  }, []);


  //CODE TO SAVE PURCHASE HEADER 
  const handleSaveButtonClick = async () => {
    if (!return_date || !billNo || !billDate || !customerCode || !payType) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }

    const filteredRowData = rowData.filter(row => row.returnQty > 0);

    if (filteredRowData.length === 0 || rowDataTax.length === 0) {
      toast.warning('Give Return Qty to save.');
      return;
    }
    setLoading(false);

    try {
      const Header = {
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        customer_name: customerName,
        customer_code: customerCode,
        return_date: return_date,
        return_reason: return_reason,
        return_person: return_person,
        bill_date: billDate,
        bill_no: billNo,
        pay_type: payType,
        sales_type: salesType,
        roff_amt: roundOff,
        sale_amt: saleAmount,
        bill_amt: totalAmount,
        tax_amount: TotalTax,
        created_by: sessionStorage.getItem('selectedUserCode')
      };
      const response = await fetch(`${config.apiBaseUrl}/addSalesRetHdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ return_no }] = searchData;
        setreturn_no(return_no);


        await saveInventoryReturnDetails(return_no);
        await savesalesrturnTaxDetails(return_no);
        setShowExcelButton(true)
        toast.success("Data inserted Successfully")
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message); // Log error message
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false)
    }
  };

  //CODE TO SAVE Sales Return DETAILS
  const saveInventoryReturnDetails = async (return_no) => {
    try {
      for (const row of rowData) {
        const Details = {
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          return_no: new_running_no,
          ItemSNo: row.serialNumber,
          bill_date: billDate,
          bill_no: billNo,
          entry_no: row.entry_no,
          item_code: row.itemCode,
          item_name: row.itemName,
          customer_code: customerCode,
          customer_name: customerName,
          return_date: return_date,
          return_no: return_no,
          warehouse_code: row.warehouse,
          return_person: return_person,
          return_reason: return_reason,
          bill_qty: row.billQty,
          return_qty: row.returnQty,
          item_amt: row.itemAmt,
          weight: row.ItemTotalWeight,
          return_weight: row.ReturnWeight,
          total_weight: row.ItemTotalWeight,
          pay_type: payType,
          sales_type: salesType,
          tax_amt: row.taxAmt,
          return_amt: row.totalReturnAmt,
          created_by: sessionStorage.getItem('selectedUserCode')

        };
        const response = await fetch(`${config.apiBaseUrl}/addSalesRetDetail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Details),
        });

        if (response.ok) {
          console.log("Sales Return  Detail Data inserted successfully");
        } else if (response.status === 400) {
          const errorResponse = await response.json();
          console.error(errorResponse.error);
        } else {
          console.error("Failed to insert data for row");
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const savesalesrturnTaxDetails = async (return_no) => {
    try {
      for (const row of rowData) {
        // Find matching rows in rowDataTax
        const matchingTaxRows = rowDataTax.filter(taxRow => taxRow.Item_code === row.itemCode);

        for (const taxRow of matchingTaxRows) {
          const Details = {
            company_code: sessionStorage.getItem('selectedCompanyCode'),
            return_no: new_running_no,
            item_code: row.itemCode,
            item_name: row.itemName,
            customer_code: customerCode,
            pay_type: payType,
            ItemSNo: row.serialNumber,
            TaxSNo: taxRow.TaxSNO,
            tax_type: row.taxType,
            tax_name_details: taxRow.TaxType,
            tax_amt: taxRow.TaxAmount,
            tax_per: taxRow.TaxPercentage,
            bill_date: billDate,
            bill_no: billNo,
            return_date: return_date,
            return_no: return_no,
            return_reason: return_reason,
            return_person: return_person,
            inventry_ret_autono: new_running_no,
            created_by: sessionStorage.getItem('selectedUserCode')
          };

          const response = await fetch(`${config.apiBaseUrl}/addSalesRetTaxDetail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Details),
          });

          if (response.ok) {
            console.log("Purchase Detail Data inserted successfully");
          } else if (response.status === 400) {
            const errorResponse = await response.json();
            console.error(errorResponse.error);
          } else {
            console.error("Failed to insert data for row");
          }
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const PrintHeaderData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/refNumberToSalesReturnHeaderPrintData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: return_no, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });

      if (response.ok) {
        const searchData = await response.json();
        return searchData;
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const PrintDetailData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/refNumberToSalesReturnDetailPrintData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: return_no, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });

      if (response.ok) {
        const searchData = await response.json();
        return searchData;
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const PrintSumTax = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/refNumberToSalesReturnSumTax`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: return_no, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });

      if (response.ok) {
        const searchData = await response.json();
        return searchData;
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };


  const generateReport = async () => {
    setLoading(true);
    try {
      const headerData = await PrintHeaderData();
      const detailData = await PrintDetailData();
      const taxData = await PrintSumTax();

      if (headerData && detailData && taxData) {
        console.log("All API calls completed successfully");

        sessionStorage.setItem('SRheaderData', JSON.stringify(headerData));
        sessionStorage.setItem('SRdetailData', JSON.stringify(detailData));
        sessionStorage.setItem('SRtaxData', JSON.stringify(taxData));

        window.open('/SalesReturnPrint', '_blank');
      } else {
        console.log("Failed to fetch some data");
        toast.error("Reference Number Does Not Exits");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTable = (table) => {
    setActiveTable(table);
  };

  const handleData = async (data) => {
    if (data && data.length > 0) {
      const [{ BillNo, BillDate, SalesType, PayType, InventoryAutoNo, CustomerName, CustomerCode }] = data;
      console.table(data);

      // Set PayType
      const partycodeInput = document.getElementById('payType');
      if (partycodeInput) {
        partycodeInput.value = PayType;
        setPayType(PayType);
      } else {
        console.error('payType element not found');
      }

      const salesType = document.getElementById('salesType');
      if (salesType) {
        salesType.value = SalesType;
        setSalesType(SalesType);
      } else {
        console.error('purchasetype element not found');
      }

      // Set TransactionDate to current date (or use TransactionDate if required)
      const billDate = document.getElementById('billDate');
      if (billDate) {
        billDate.value = BillDate;
        setBillDate(formatDate(BillDate));
      } else {
        console.error('Billdate element not found');
      }

      // Set TransactionNumber
      const billNo = document.getElementById('billNo');
      if (billNo) {
        billNo.value = BillNo;
        setBillNo(BillNo);
      } else {
        console.error('transactionNumber element not found');
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

      // Fetch purchase return tax details
      await SalesReturnTax(BillNo);
      console.log(BillNo)
    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const SalesReturnTax = async (BillNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getSalesTaxDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: BillNo, company_code: sessionStorage.getItem('selectedCompanyCode') })
      });

      if (response.ok) {
        const searchData = await response.json();
        const newTaxDetail = [];
        const taxNameDetailsArray = [];
        const taxPer = [];
        let TaxName = '';
        searchData.forEach(({ ItemSNo, TaxSNo, item_code, tax_name_details, tax_per, tax_amt, tax_type }) => {
          newTaxDetail.push({
            ItemSNO: ItemSNo,
            TaxSNO: TaxSNo,
            Item_code: item_code,
            TaxType: tax_name_details,
            TaxPercentage: tax_per,
            TaxAmount: tax_amt,
            TaxName: tax_type
          });
          taxNameDetailsArray.push(tax_name_details);
          taxPer.push(tax_per);
          TaxName = tax_type;
        });

        const taxNameDetailsString = taxNameDetailsArray.join(',');
        const taxPerDetaiString = taxPer.join(',');

        setRowDataTax(newTaxDetail);

        SalesReturnDetail(BillNo, taxNameDetailsString, taxPerDetaiString, TaxName);
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const SalesReturnDetail = async (BillNo, taxNameDetailsString, taxPerDetaiString, TaxName) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getSalesDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: BillNo, company_code: sessionStorage.getItem('selectedCompanyCode') })
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
            bill_rate,
            return_weight
          } = item;

          newRowData.push({
            serialNumber: ItemSNo,
            itemCode: item_code,
            itemName: item_name,
            unitWeight: weight,
            billQty: bill_qty,
            warehouse: warehouse_code,
            ItemTotalWeight: total_weight,
            itemAmt: item_amt,
            taxAmt: tax_amt,
            totalReturnAmt: bill_rate,
            taxType: TaxName,
            taxPer: taxPerDetaiString,
            taxDetails: taxNameDetailsString,
            ReturnWeight: return_weight
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

  const handleChangeNo = (e) => {
    const refNo = e.target.value;
    setBillNo(refNo); setStatus("Typing...")
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRefNo(billNo)
      retperson.current.focus();
    }
  }

  const handleKeyPressView = (e) => {
    if (e.key === 'Enter') {
      handleRefNoView(return_no)
      TransactionStatus(return_no)
    }
  }

  const TransactionStatus = async (returnNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/salretauthstatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ return_no: returnNo, company_code: sessionStorage.getItem('selectedCompanyCode') }),
      });
      if (response.ok) {
        const searchData = await response.json();
        if (Array.isArray(searchData)) {
          // Format the options for the Select component
          const formattedOptions = searchData.map((item) => ({
            value: item.descriptions,
            label: item.attributedetails_name,
          }));
          setStatus(formattedOptions); // Update the state with formatted options
        } else {
          console.log("Data fetched is not in the expected array format");
        }
      } else {
        console.log("Failed to fetch some data");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    }
  };

  const handleChangeNoview = (e) => {
    const refNo = e.target.value;
    setinventry_ret_autono(refNo); setStatus('Typing...');
  }


  const handleBillDateChange = (event) => {
    setBillDate(event.target.value);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return (`${year}-${month}-${day}`);
  };

  const handleRefNo = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getSalesData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: code,company_code: sessionStorage.getItem('selectedCompanyCode')  }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        if (searchData.table1 && searchData.table1.length > 0) {
          console.log("Table 1 Data:", searchData.table1);
          const item = searchData.table1[0];
          setPayType(item.pay_type);
          setSalesType(item.sales_type);
          setBillDate(formatDate(item.bill_date));
          setBillNo(item.bill_no);
          setCustomerCode(item.customer_code);
          setCustomerName(item.customer_name)
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
        toast.warning('Data not found');

        // Clear the data fields
        setInventory_autono('')
        setTotalSaleAmount('');
        setPayType('');
        setNew_running_no('');
        setSalesType('');
        setBillDate('');
        setBillNo('');
        setCustomerCode('');
        setCustomerName('');
        setTotalTax('');
        setTotalAmount('');
        setRowData([{ serialNumber: 1, delete: '', itemCode: '', itemName: '', serach: '', unitWeight: 0, warehouse: '', billQty: 0, ItemTotalWight: 0, salesAmt: 0, TotalTaxAmount: 0, TotalItemAmount: 0 }]);
        setRowDataTax([]);
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
    window.location.reload();
  };

  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setreturn_date(currentDate);
  }, [currentDate]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (selectedDate === currentDate) {
      setreturn_date(selectedDate);
      setStatus('Current Date Selected');
    } else {
      setStatus('Invalid Date Selected');
    }
  };

  const handleRefNoView = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getSalesreturnView`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: code }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        setShowExcelButton(true);
        setShowDropdown(true);
        setShowAsterisk(true);
        const searchData = await response.json();
        if (searchData.table1 && searchData.table1.length > 0) {
          console.log("Table 1 Data:", searchData.table1);
          const item = searchData.table1[0];
          setPayType(item.pay_type);
          setSalesType(item.sales_type);
          setBillDate(formatDate(item.bill_date));
          setReturnDate(formatDate(item.return_date));
          setBillNo(item.bill_no);
          setCustomerCode(item.customer_code);
          setCustomerName(item.customer_name)
          setReturn_no(item.return_no)
          setreturn_person(item.return_person)
          setreturn_reason(item.return_reason)
          setTotalAmount(item.bill_amt)
          setTotalTax(item.tax_amount)
          setTotalSaleAmount(item.sale_amt)
          setRoundOff(item.roff_amt)

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
              returnQty: item.return_qty,
              billQty: item.bill_qty,
              ItemTotalWeight: item.total_weight,
              itemAmt: item.item_amt,
              taxAmt: item.tax_amt,
              totalReturnAmt: item.bill_rate,
              ReturnWeight: item.return_weight,
              warehousecode: item.warehouse_code,
              totalReturnAmt: item.return_amt,
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
              TaxType: item.tax_type,
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
        toast.warning('Data not found');

        // Clear the data fields
        setInventory_autono('')
        setTotalSaleAmount('');
        setPayType('');
        setNew_running_no('');
        setSalesType('');
        setBillDate('');
        setBillNo('');
        setCustomerCode('');
        setCustomerName('');
        setTotalTax('');
        setTotalAmount('');
        setRowData([{ serialNumber: 1, delete: '', itemCode: '', itemName: '', serach: '', unitWeight: 0, warehouse: '', billQty: 0, ItemTotalWight: 0, salesAmt: 0, TotalTaxAmount: 0, TotalItemAmount: 0 }]);
        setRowDataTax([]);
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDataView = async (data) => {
    if (data && data.length > 0) {

      setShowExcelButton(true)
      setShowDropdown(true);
      setShowAsterisk(true);

      const [{ BillNo, BillDate, TotalTax, RoundOff, ReturnDate, SalesType, TotalAmount, TotalSales, ReturnNo, RetReason, PayType, Retper, CustomerName, CustomerCode }] = data;
      console.table(data);

      // Set PayType
      const partycodeInput = document.getElementById('payType');
      if (partycodeInput) {
        partycodeInput.value = PayType;
        setPayType(PayType);
      } else {
        console.error('payType element not found');
      }

      const retdate = document.getElementById('redate');
      if (retdate) {
        retdate.value = ReturnDate;
        setReturnDate(formatDate(ReturnDate));
      } else {
        console.error('Return Date element not found');
      }

      const Roundoff = document.getElementById('roundOff');
      if (Roundoff) {
        Roundoff.value = RoundOff;
        setRoundOff(RoundOff);
      } else {
        console.error('payType element not found');
      }

      const Totaltax = document.getElementById('totalTaxAmount');
      if (Totaltax) {
        Totaltax.value = TotalTax;
        setTotalTax(TotalTax);
      } else {
        console.error('payType element not found');
      }

      const returnNo = document.getElementById('returnno');
      if (returnNo) {
        returnNo.value = ReturnNo;
        setreturn_no(ReturnNo);
      } else {
        console.error('ReturnNo element not found');
      }


      const Returnperson = document.getElementById('retper');
      if (Returnperson) {
        Returnperson.value = Retper;
        setreturn_person(Retper);
      } else {
        console.error('payType element not found');
      }

      const ReturnReason = document.getElementById('retreason');
      if (ReturnReason) {
        ReturnReason.value = RetReason;
        setreturn_reason(RetReason);
      } else {
        console.error('RetReason element not found');
      }
      const Customername = document.getElementById('customername');
      if (Customername) {
        Customername.value = CustomerName;
        setcustomerName(CustomerName);
      } else {
        console.error('RetReason element not found');
      }

      const TotalSale = document.getElementById('totalSalesAmount');
      if (TotalSale) {
        TotalSale.value = TotalSales;
        setTotalSaleAmount(TotalSales);
      } else {
        console.error('RetReason element not found');
      }

      const TotalBill = document.getElementById('totalBillAmount');
      if (TotalBill) {
        TotalBill.value = TotalAmount;
        setTotalAmount(TotalAmount);
      } else {
        console.error('totalBillAmount element not found');
      }


      const salesType = document.getElementById('salesType');
      if (salesType) {
        salesType.value = SalesType;
        setSalesType(SalesType);
      } else {
        console.error('purchasetype element not found');
      }

      // Set TransactionDate to current date (or use TransactionDate if required)
      const billDate = document.getElementById('billDate');
      if (billDate) {
        billDate.value = BillDate;
        setBillDate(formatDate(BillDate));
      } else {
        console.error('Billdate element not found');
      }

      // Set TransactionNumber
      const billNo = document.getElementById('billNo');
      if (billNo) {
        billNo.value = BillNo;
        setBillNo(BillNo);
      } else {
        console.error('transactionNumber element not found');
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

      TransactionStatus(ReturnNo)
      await SalesReturnTaxView(ReturnNo);
    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const SalesReturnTaxView = async (ReturnNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/SalesReturnTaxView`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: ReturnNo })
      });

      if (response.ok) {
        const searchData = await response.json();
        const newTaxDetail = [];
        searchData.forEach(({ ItemSNo, TaxSNo, item_code, tax_name_details, tax_per, tax_amt, tax_type }) => {
          newTaxDetail.push({
            ItemSNO: ItemSNo,
            TaxSNO: TaxSNo,
            Item_code: item_code,
            TaxType: tax_name_details,
            TaxPercentage: tax_per,
            TaxAmount: tax_amt,
            TaxName: tax_type
          });
        });

        setRowDataTax(newTaxDetail);

        SalesReturnDetailView(ReturnNo);
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const SalesReturnDetailView = async (ReturnNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/SalesReturnDetailView`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: ReturnNo })
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
            bill_rate,
            return_weight,
            return_qty,
            return_amt
          } = item;

          newRowData.push({
            serialNumber: ItemSNo,
            itemCode: item_code,
            itemName: item_name,
            unitWeight: weight,
            billQty: bill_qty,
            warehouse: warehouse_code,
            ItemTotalWeight: total_weight,
            itemAmt: item_amt,
            taxAmt: tax_amt,
            totalReturnAmt: bill_rate,
            ReturnWeight: return_weight,
            returnQty: return_qty,
            totalReturnAmt: return_amt,

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

  const handleExcelDownload = () => {
    const filteredRowData = rowData.filter(row => row.returnQty > 0 && row.totalReturnAmt > 0 && row.itemAmt > 0);
    const filteredRowDataTax = rowDataTax.filter(taxRow => taxRow.TaxAmount > 0 && taxRow.TaxPercentage > 0);

    const headerData = [{
      company_code: sessionStorage.getItem('selectedCompanyCode'),
      customer_name: customerName,
      customer_code: customerCode,
      return_date: return_date,
      return_reason: return_reason,
      return_person: return_person,
      bill_date: billDate,
      bill_no: billNo,
      pay_type: payType,
      sales_type: salesType,
      roff_amt: roundOff,
      sale_amt: saleAmount,
      bill_amt: totalAmount,
      tax_amount: TotalTax,
    }];

    const headerSheet = XLSX.utils.json_to_sheet(headerData);
    const rowDataSheet = XLSX.utils.json_to_sheet(filteredRowData);
    const rowDataTaxSheet = XLSX.utils.json_to_sheet(filteredRowDataTax);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, headerSheet, "Header Data");
    XLSX.utils.book_append_sheet(workbook, rowDataSheet, "Sales Return Details");
    XLSX.utils.book_append_sheet(workbook, rowDataTaxSheet, "Tax Details");

    XLSX.writeFile(workbook, "Sales Return data.xlsx");
  };


  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      // Check if the value has changed and handle the search logic
      if (hasValueChanged) {
        await handleKeyDownStatus(e); // Trigger the search function
        setHasValueChanged(false); // Reset the flag after the search
      }

      // Move to the next field if the current field has a valid value
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); // Prevent moving to the next field if the value is empty
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };

  const handleChangeStatus = (selectedOption) => {
    setSelectedStatus(selectedOption);
    console.log("Selected option:", selectedOption);
  };


  const handleAuthorizedButtonClick = async () => {
    if (!selectedStatus || !return_no) {
      setAuthError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }
    setLoading(true);
    try {
      const headerResult = await AuthorizedHeader();
      const detailResult = await AuthorizedDetails();
      const taxDetailResult = await AuthorizedTaxDetails();

      if (headerResult === true && detailResult === true && taxDetailResult === true) {
        console.log("All API calls completed successfully");
        toast.success(`Data ${selectedStatus.label} Successfully`, {
          autoClose: true,
          onClose: () => {
            window.location.reload();
          }
        });
      } else {
        const errorMessage =
          headerResult !== true
            ? headerResult
            : detailResult !== true
              ? detailResult
              : taxDetailResult !== true
                ? taxDetailResult
                : "An unknown error occurred.";

        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
      toast.warning(error.message || "An Error occured while Deleting Data");
    } finally {
      setLoading(false);
    }
  };

  const AuthorizedHeader = async () => {
    console.log(selectedStatus.value)
    try {
      const response = await fetch(`${config.apiBaseUrl}/SalesReturnAuthHdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          return_no: return_no,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          authroization_status: selectedStatus.value
        })
      });
      if (response.ok) {
        console.log("Rows deleted successfully:", billNo);
        return true
      } else {
        const errorResponse = await response.json();
        return errorResponse.details || errorResponse.message || "Failed to header.";
      }
    } catch (error) {
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const AuthorizedDetails = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/SalesReturnAuthDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          return_no: return_no,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          authroization_status: selectedStatus.value
        })
      });
      if (response.ok) {
        return true
      } else {
        const errorResponse = await response.json();
        return errorResponse.details || errorResponse.message || "Failed to detail.";
      }
    } catch (error) {
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const AuthorizedTaxDetails = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/SalesReturnAuthTaxDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          return_no: return_no,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          authroization_status: selectedStatus.value
        })
      });
      if (response.ok) {
        return true;
      } else {
        const errorResponse = await response.json();
        return errorResponse.details || errorResponse.message || "Failed to tax detail.";
      }
    } catch (error) {
      toast.error('Error inserting data: ' + error.message);
    }
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div class="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">Sales Return</h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
              {['add', 'all permission'].some(permission => salesReturnPermission.includes(permission)) && (
                <savebutton className="purbut" onClick={handleSaveButtonClick} title='Save'>
                  <i class="fa-regular fa-floppy-disk"></i>
                </savebutton>
              )}
              {showExcelButton && (
                <savebutton className="purbut" onClick={handleAuthorizedButtonClick} title="Authorization">
                  <i class="fa-solid fa-check"></i>
                </savebutton>
              )}
              {['all permission', 'view'].some(permission => salesReturnPermission.includes(permission)) && (
                <printbutton className="purbut" title="Print" onClick={generateReport}>
                  <i class="fa-solid fa-file-pdf"></i>
                </printbutton>
              )}
              {showExcelButton && (
                <printbutton className="purbut" title='Excel' onClick={handleExcelDownload}>
                  <i class="fa-solid fa-file-excel"></i>
                </printbutton>
              )}
              <printbutton className="purbut" title='Reload' onClick={handleReload} >
                <i class="fa-solid fa-arrow-rotate-right"></i>
              </printbutton>
            </div>
          </div>
          <div class="mobileview">
            <div class="d-flex justify-content-between ">
              <div className="d-flex justify-content-start">
                <h1 align="left" className="h1">Sales Return</h1>
              </div>
              <div class="dropdown mt-1 " style={{ paddingLeft: 0 }}>
                <button class="btn btn-primary dropdown-toggle p-1 ms-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-list"></i>
                </button>
                <ul class="dropdown-menu menu">
                  <li class="iconbutton d-flex justify-content-center text-success">
                    {['add', 'all permission'].some(permission => salesReturnPermission.includes(permission)) && (
                      <icon class="icon" onClick={handleSaveButtonClick}>
                        <i class="fa-regular fa-floppy-disk"></i>
                      </icon>
                    )}
                  </li>
                  {showExcelButton && (
                    <li class="iconbutton d-flex justify-content-center text-success">
                      <icon class="icon" onClick={handleAuthorizedButtonClick}>
                        <i class="fa-solid fa-check"></i>
                      </icon>
                    </li>
                  )}
                  <li class="iconbutton  d-flex justify-content-center text-warning">
                    {['all permission', 'view'].some(permission => salesReturnPermission.includes(permission)) && (
                      <icon class="icon" onClick={generateReport}>
                        <i class="fa-solid fa-file-pdf"></i>
                      </icon>
                    )}
                  </li>
                  {showExcelButton && (
                    <li class="iconbutton  d-flex justify-content-center text-info">
                      <icon class="icon" onClick={handleExcelDownload}>
                        <i class="fa-solid fa-file-excel"></i>
                      </icon>
                    </li>
                  )}
                  <li class="iconbutton  d-flex justify-content-center">
                    <icon class="icon" onClick={handleReload}>
                      <i class="fa-solid fa-arrow-rotate-right"></i>
                    </icon>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  pt-3 pb-4" align="left">
          <div className="row  ms-3 me-3">
            {showDropdown && (
              <div className="col-md-3 form-group mb-2">
                <label for="" className={`${authError && !selectedStatus ? 'text-danger' : ''}`}>Status<span className="text-danger">*</span></label>
                <div class="exp-form-floating">
                  <Select
                    id="returnType"
                    className="exp-input-field"
                    placeholder="Select an option"
                    options={status}
                    value={selectedStatus}
                    onChange={handleChangeStatus}
                    getOptionLabel={(option) => option.label || ""}
                    getOptionValue={(option) => option.value || ""}
                  />
                </div>
              </div>
            )}
            < div className="col-md-3 form-group mb-2">
              <label htmlFor="party_code" >
                Bill No{!showAsterisk && <span className="text-danger">*</span>}
              </label>
              <div className="exp-form-floating">
                <div class="d-flex justify-content-end">
                  <input
                    className="exp-input-field form-control justify-content-start"
                    id='billNo'
                    title="Please enter the bill no"
                    required
                    maxLength={18}
                    value={billNo}
                    onChange={handleChangeNo}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                  />
                  <div className='position-absolute mt-1 me-2'>
                    <span className="icon searchIcon"
                      title='Sales Help'
                      onClick={handleShowModal}>
                      <i class="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="returnno" className={`${authError && !return_no ? 'text-danger' : ''}`}>Return No{showAsterisk && <span className="text-danger">*</span>}</label>
                <div class="d-flex justify-content-end">
                  <input
                    name="returnno"
                    id="returnno"
                    type="text"
                    className="exp-input-field form-control justify-content-start"
                    placeholder=""
                    required
                    maxLength={18}
                    value={return_no}
                    onKeyPress={handleKeyPressView}
                    title="Please enter the return no"
                    onChange={(e) => setreturn_no(e.target.value)}
                    autoComplete="off"
                  />
                  <div className='position-absolute mt-1 me-2'>
                    <span className="icon searchIcon"
                      onClick={handleShowReturn}>
                      <i class="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="redate" className={`${error && !return_date ? 'red' : ''}`}>Return Date</label>
                {!showAsterisk && <span className="text-danger">*</span>}
                <input
                  name="redate"
                  id='redate'
                  align="left"
                  className="exp-input-field form-control"
                  type="date"
                  title="Please enter the return date"
                  placeholder=""
                  required
                  value={return_date}
                  onChange={handleDateChange}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="retper">Return Person{!showAsterisk && <span className="text-danger">*</span>}</label>
                <input
                  name="retper"
                  id="retper"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  maxLength={18}
                  title="Please enter the return person"
                  value={return_person}
                  onChange={(e) => setreturn_person(e.target.value)}
                  autoComplete="off"
                  ref={retperson}
                  onKeyDown={(e) => handleKeyDown(e, retreason, retperson)}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="retreason" >Return Reason{!showAsterisk && <span className="text-danger">*</span>}</label>
                <input
                  name="retreason"
                  id="retreason"
                  className="exp-input-field form-control"
                  type="text"
                  title="Please enter the return reason"
                  placeholder=""
                  required
                  maxLength={18}
                  value={return_reason}
                  onChange={(e) => setreturn_reason(e.target.value)}
                  autoComplete="off"
                  ref={retreason}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label id="partyCode" className={`${error && !customerCode ? 'red' : ''}`}>Customer Code</label>
                {!showAsterisk && <span className="text-danger">*</span>}
                <input
                  className="exp-input-field form-control"
                  id='customercode'
                  required
                  value={customerCode}
                  title="Please enter the customer code"
                  onChange={(e) => setCustomerCode(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label id="partyCode" >Customer Name</label>
                <input
                  className="exp-input-field form-control"
                  id='customername'
                  title="Please enter the customer name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="billdate" className={`${error && !billDate ? 'red' : ''}`}>Bill Date</label>
                {!showAsterisk && <span className="text-danger">*</span>}
                <input
                  name="billdate"
                  id="billDate"
                  className="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  title="Please enter the bill date"
                  required
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="paytype" className={`${error && !payType ? 'red' : ''}`}>Pay Type</label>
                {!showAsterisk && <span className="text-danger">*</span>}
                <input
                  name="paytype"
                  id="payType"
                  className="exp-input-field form-control"
                  placeholder=""
                  required
                  title="Please enter the pay type"
                  value={payType}
                  onChange={(e) => setPayType(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="salestype">Sales Type</label>
                <input
                  name="salestype"
                  id="salesType"
                  className="exp-input-field form-control"
                  placeholder=""
                  required
                  title="Please enter the sales type"
                  value={salesType}
                  onChange={(e) => setSalesType(e.target.value)}
                  autoComplete="off"
                  readOnly
                >
                </input>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="">
                  Total Sales
                </label>
                <input
                  id="totalSalesAmount"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  title='Total sales'
                  required
                  value={saleAmount}
                  onChange={(e) => setTotalSaleAmount(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="">
                  Total Tax
                </label>
                <input
                  name="totalTaxAmount"
                  id="totalTaxAmount"
                  text="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  title='Total tax'
                  required
                  value={TotalTax}
                  onChange={(e) => setTotalTax(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="">
                  Round Off
                </label>
                <input
                  name=""
                  id="roundOff"
                  type="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  required
                  title='Round off'
                  value={roundOff}
                  onChange={(e) => setRoundOff(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="">
                  Total Bill Amount
                </label>
                <input
                  name=""
                  id="totalBillAmount"
                  type="text"
                  className="exp-input-field form-control"
                  placeholder=""
                  title='Total bill amount'
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between ms-3" style={{ marginBlock: "", marginTop: "10px" }} >
            <div align="left" class="d-flex justify-content-start" style={{ marginLeft: "17px" }}>
              <purButton
                type="button"
                title='Item Details'
                className={`"toggle-btn"  ${activeTable === 'myTable' ? 'active' : ''}`}
                onClick={() => handleToggleTable('myTable')}>
                Item Details
              </purButton>
              <purButton
                type="button"
                title='Tax Details'
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
              onCellValueChanged={async (event) => {
                if (event.colDef.field === 'returnQty' || event.colDef.field === 'itemAmt') {
                  await SalesreturnItemAmountCalculation(event);
                }
                onCellValueChanged(event)

              }}
              onRowClicked={handleRowClicked}
            />
          </div>
        </div>
      </div>
      <div>
        <InventoryHdrPopup open={open} handleClose={handleClose} handleData={handleData} />
        <SalesRetrunView open={open1} handleClose={handleClose} handleDataView={handleDataView} />
      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.createdBy}: {additionalData.created_by}</p>
            <p className="col-md-6">{labels.createdDate}: {additionalData.created_date}</p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">{labels.modifiedBy}: {additionalData.modified_by}</p>
            <p className="col-md-6"> {labels.modifiedDate}: {additionalData.modified_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesReturn;


