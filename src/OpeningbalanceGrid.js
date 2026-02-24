
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

import ObPopup from './OBPopup';
import * as XLSX from 'xlsx';

function OpeningbalanceGrid() {
  const [rowData, setRowData] = useState([{Item_SNo:1,acct_code:"",transaction_no:"",acc_type:"",item_type:"",debit:"",credit:""}]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const config = require('./Apiconfig');
  const [transaction_date, settransaction_date] = useState("");
  const [transaction_type, settransaction_type] = useState("");
  const [transaction_no, settransaction_no] = useState("");
  const [acct_code, setacct_code] = useState("");
  const [journal_no, setjournal_no] = useState("");
  const [editedData, setEditedData] = useState([]);
  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');
  const [additionalData, setAdditionalData] = useState({
    modified_by: '',
    created_by: '',
    modified_date: '',
    created_date: ''
  });
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(false);
  const [showExcelButton, setShowExcelButton] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const openingBalancePermission = permissions
    .filter(permission => permission.screen_type === 'OpeningBalance')
    .map(permission => permission.permission_type.toLowerCase());


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


  const handleSearch = async () => {
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const response = await fetch(`${config.apiBaseUrl}/getopeningbalancedata
`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code
        },
        body: JSON.stringify({ company_code: company_code, transaction_date, transaction_type, transaction_no, acct_code, journal_no }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")

      } else if (response.status === 404) {
        console.log("Data not found");
        swal.fire({
          title: "Data not found",
          text: "No data matching the search criteria",
          icon: "info",
          confirmButtonText: "OK"
        }) // Log the message for 404 Not Found
      } else {
        console.log("Bad request");
        swal.fire({
          title: "Error!",
          text: "An error occurred. Please try again later",
          icon: "error",
          confirmButtonText: "OK"
        });
      } // Log the message for other errors

    } catch (error) {
      console.error("Error fetching search data:", error);
      swal.fire({
        title: "Error!",
        text: "An error occurred while fetching data. Please try again later",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleDelete = (params) => {
    const serialNumberToDelete = params.data.Item_SNo;

    const updatedRowData = rowData.filter(row => row.Item_SNo !== serialNumberToDelete);

    setRowData(updatedRowData);

    if (updatedRowData.length === 0) {
      const newRow = {
        Item_SNo: 1,
        acct_code: '',
        journal_no: '',
        acc_type: '',
        item_type: '',
        debit: '',
        credit: ''
      };
      setRowData([newRow]);
    }
    else {
      const updatedRowDataWithNewSerials = updatedRowData.map((row, index) => ({
        ...row,
        Item_SNo: index + 1
      }));
      setRowData(updatedRowDataWithNewSerials);
    }
  };

  function qtyValueSetter(params) {
    const newValue = parseFloat(params.newValue);
    if (isNaN(newValue) || newValue < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Credit',
        text: 'Credit cannot be negative!',
        confirmButtonText: 'OK'
      });
      return false; // Prevent the value from being set
    }
    params.data.credit = newValue;
    return true; // Allow the value to be set
  }

  function qtyValueSett(params) {
    const newValue = parseFloat(params.newValue);
    if (isNaN(newValue) || newValue < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Debit',
        text: 'Debit cannot be negative!',
        confirmButtonText: 'OK'
      });
      return false; // Prevent the value from being set
    }
    params.data.debit = newValue;
    return true; // Allow the value to be set
  }

  const columnDefs = [
    {
      headerName: "S.NO",
      field: "Item_SNo",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 50,
    },
    {
      headerName: '',
      field: 'delete',
      editable: false,
      maxWidth: 25,
      tooltipValueGetter: (p) =>
        "Delete",
      onCellClicked: handleDelete,
      cellRenderer: function (params) {
        return <FontAwesomeIcon icon="fa-solid fa-trash" style={{ cursor: 'pointer', marginRight: "12px" }} />
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      sortable: false
    },
    {
      headerName: "Account Code",
      field: "acct_code",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Journal No",
      field: "journal_no",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 25,
      },
    },
    {
      headerName: "Account Type",
      field: "acc_type",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {
      headerName: "Item Type",
      field: "item_type",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 25,
      },
    },
    {
      headerName: "Debit",
      field: "debit",
      editable: true,
      valueSetter:qtyValueSett,
      cellStyle: {
        textAlign: "left",
      },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {
      headerName: "Credit",
      field: "credit",
      editable: true,
      valueSetter:qtyValueSetter,
      cellStyle: {
        textAlign: "left",
      },
      // minWidth: 150,
      cellEditorParams: {
        maxLength: 50,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // sortable: true,
    //editable: true,
    // flex: 1,
    // filter: true,
    // floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };


  const generateReport = async () => {
    try {
      const headerData = await PrintHeaderData();
      const detailData = await PrintDetailData();

      if (headerData && detailData) {
        console.log("All API calls completed successfully");

        // Stringify data and encode it
        const encodedHeaderData = encodeURIComponent(JSON.stringify(headerData));
        const encodedDetailData = encodeURIComponent(JSON.stringify(detailData));

        const url = `/ObPrint?headerData=${encodedHeaderData}&detailData=${encodedDetailData}`;

        window.open(url, '_blank');
      } else {
        console.log("Failed to fetch some data");
        toast.warning("Trasaction ID Does Not Exits");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    }
  };

  const PrintHeaderData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/ObHeaderPrint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no })
      });

      if (response.ok) {
        const searchData = await response.json();
        return searchData;
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const PrintDetailData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/ObDetailPrint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no })
      });

      if (response.ok) {
        const searchData = await response.json();
        return searchData;
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };




  //Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.journal_no === params.data.journal_no // Use the unique identifier 
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };


  const saveEditedData = async () => {
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const modified_by = sessionStorage.getItem('selectedUserCode');
      // Filter the editedData state to include only the selected rows
      const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.journal_no === row.journal_no));

      const response = await fetch(`${config.apiBaseUrl}/openbalsaveEditedData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code,
          "Modified-By": modified_by
        },
        body: JSON.stringify({ editedData: selectedRowsData }), // Send only the selected rows for saving
        "company_code": company_code,
        "modified_by": modified_by
      });

      if (selectedRowsData.length === 0) {
        swal.fire({
          title: "No Rows Selected",
          text: "Please select a row to update its data",
          icon: "warning",
          confirmButtonText: "OK"
        });
        return;
      }
      const saveConfirmation = await swal.fire({
        title: "Confirm Update",
        text: "Are you sure you want to update the data in the selected rows?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      });

      if (!saveConfirmation.value) {
        return;
      }

      if (response.status === 200) {
        setTimeout(() => {
          swal.fire({
            text: "Data updated successfully!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
            //   customClass: {
            //     popup: 'my-custom-size',
            // }
          }).then(() => {
            handleSearch();
          });
        }, 1000);
        return;

      } else {
        console.error("Failed to save data");
        swal.fire({
          title: "Error!",
          text: "Failed to update data. Please try again later",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      swal.fire({
        title: "Error!",
        text: "An error occurred while saving data. Please try again later",
        icon: "error",
        confirmButtonText: "OK"
      });

    }
  };

  const handleSaveButtonClick = async () => {
    if (!transaction_date) {
      setError(" ");
      toast.warning("Missing required fields");      
      return;
    }

    if (rowData.length === 0) {
      toast.warning("No Opening balance Data found to save.");
      return;
    }

    try {

      const Header = {
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        transaction_date,
        created_by: sessionStorage.getItem('selectedUserCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/addOpeningbalHdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ transaction_no }] = searchData;
        settransaction_no(transaction_no);
        Swal.fire({
          title: "Success",
          text: "Opening balance Data Inserted Successfully",
          icon: "success",
          confirmButtonText: "OK"
        })

        await OpeningBalanceDetails(transaction_no);
        setShowExcelButton(true); // Show the Excel button
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message); // Log error message
        Swal.fire({
          title: "Error!",
          text: errorResponse.message,
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      Swal.fire({
        title: "Error!",
        text: 'Error inserting data: ' + error.message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const OpeningBalanceDetails = async (transaction_no) => {
    try {


    
      for (const row of rowData) {
        const Details = {
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          created_by: sessionStorage.getItem('selectedUserCode'),
          transaction_date,
          transaction_no,
          item_type:row.item_type,
          acc_type:row.acc_type,
          acct_code:row.acct_code,
          journal_no:row.journal_no,
          Item_SNo:row.Item_SNo,
          debit:row.debit,
          credit:row.credit
        };

        const response = await fetch(`${config.apiBaseUrl}/AddOpeningBalanceDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Details),
        });

        if (response.ok) {
          console.log("Inventory Return Data inserted successfully");
        } else {
          const errorResponse = await response.json();
          console.error(errorResponse.message); // Log error message
          Swal.fire({
            title: "Error!",
            text: errorResponse.message,
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (!transaction_no) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const headerResult = await OBHeaderDelete();
      if (!headerResult) {
      toast.error("Header deletion failed");
        throw new Error('Header deletion failed');
      }

      const detailResult = await OBDetailDelete();
      if (!detailResult) {
        throw new Error('Detail deletion failed');
      }

      if (headerResult && detailResult) {
        console.log("All API calls completed successfully");
        Swal.fire({
          title: "Success",
          text: "Successfully Deleted",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          window.location.reload();
        });
      } else {
        console.log("Failed to fetch some data");
        Swal.fire({
          title: "Error!",
          text: "Reference Number Does Not Exist",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting data",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const OBHeaderDelete = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OpeningBalDelhdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no })
      });
      if (response.ok) {
        return true
      } else {
        console.log("Failed to fetch some data");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    }
  };
  const OBDetailDelete = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OpeningBaldeletedet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no })
      });
      if (response.ok) {
        return true
      } else {
        console.log("Failed to fetch some data");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    }
  };

  const handleAddRow = () => {
    const Item_SNo = rowData.length + 1;
    const newRow = {Item_SNo,acct_code:"",journal_no:"",acc_type:"",item_type:"",debit:"",credit:""};
    setRowData([...rowData, newRow]);
  };

  const handleRemoveRow = () => {
    if (rowData.length > 0) {
      const updatedRowData = rowData.slice(0, -1);
      if (updatedRowData.length === 0) {
        setRowData([{Item_SNo:1,acct_code:"",journal_no:"",acc_type:"",item_type:"",debit:"",credit:""}]);
      } else {
        setRowData(updatedRowData);
      }
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleOB(transaction_no)
    }
  };

  const handleOB = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OpeningBalance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: code }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        setShowExcelButton(true);
        setSaveButtonVisible(false);
        setUpdateButtonVisible(true);
        const searchData = await response.json();
        if (searchData.Header && searchData.Header.length > 0) {
          const item = searchData.Header[0];
          settransaction_date(formatDate(item.transaction_date));
          settransaction_no(item.transaction_no);

        } else {
          console.log("Header Data is empty or not found");
          settransaction_date('');
          settransaction_no('');
        }

        if (searchData.Detail && searchData.Detail.length > 0) {
          const updatedRowData = searchData.Detail.map(item => {

            return {
              Item_SNo: item.Item_SNo,
              acct_code: item.acct_code,
              journal_no: item.journal_no,
              acc_type: item.acc_type,
              item_type: item.item_type,
              debit: item.debit,
              credit: item.credit,
            };
          });

          setRowData(updatedRowData);
        } else {
          console.log("Detail Data is empty or not found");
          setRowData([{Item_SNo:1,acct_code:"",journal_no:"",acc_type:"",item_type:"",debit:"",credit:""}]);
        }

        console.log("data fetched successfully")
      } else if (response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data not found',
          text: 'The requested data could not be found.',
        });

        settransaction_date('');
        settransaction_no('');
        setRowData([{Item_SNo:1,acct_code:"",journal_no:"",acc_type:"",item_type:"",debit:"",credit:""}]);

      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpeningBalance = () => {
    setOpen(true);
  };

  const handleOb = async (data) => {
    setShowExcelButton(true)
    setSaveButtonVisible(false);
    setUpdateButtonVisible(true);
    if (data && data.length > 0) {
      const [{ transactionNo, transactionDate }] = data;

      const No = document.getElementById('transactionNO');
      if (No) {
        No.value = transactionNo;
        settransaction_no(transactionNo);
      } else {
        console.error('transactionNO element not found');
      }

      const Date = document.getElementById('transactionDate');
      if (Date) {
        Date.value = transactionDate;
        settransaction_date(formatDate(transactionDate));
      } else {
        console.error('transactionDate element not found');
      }

      await OpeningBalanceDetail(transactionNo);

    } else {
      console.log("Data not fetched...!");
    }
  };

  const OpeningBalanceDetail = async (transactionNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OpeningBalanceDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no: transactionNo })
      });

      if (response.ok) {
        const searchData = await response.json();
        const newRowData = [];
        searchData.forEach(item => {
          const { item_type, acc_type, acct_code, journal_no, Item_SNo, debit, credit} = item;
          newRowData.push({
            Item_SNo: Item_SNo,
            acct_code: acct_code,
            journal_no: journal_no,
            acc_type: acc_type,
            item_type: item_type,
            debit: debit,
            credit: credit
          });
        });
        setRowData(newRowData)
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const transformRowData = (data) => {
    return data.map(row => ({
      "S.No": row.Item_SNo,
      "Account Code": row.acct_code.toString(),
      "Journal No": row.journal_no.toString(),
      "Account Type": row.acc_type.toString(),
      "Item Type": row.item_type.toString(),
      "Debit": row.debit.toString(),
      "Credit": row.credit.toString()
    }));
  };

  const handleExcelDownload = () => {

    const filteredRowData = rowData.filter(row => row.debit > 0);
    if (rowData.length === 0 || !transaction_no || !transaction_date) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data Available',
        text: 'There is no data to export.',
      });
      return;
    }

    const headerData = [{
      "company code": sessionStorage.getItem('selectedCompanyCode'),
      "Transaction Number": transaction_no,
      "Transaction Date": transaction_date,
    }];

    const transformedData = transformRowData(filteredRowData);
    const rowDataSheet = XLSX.utils.json_to_sheet(transformedData);
    const headerSheet = XLSX.utils.json_to_sheet(headerData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, headerSheet, "Header Data");
    XLSX.utils.book_append_sheet(workbook, rowDataSheet, "Opening Balance Details");

    XLSX.writeFile(workbook, "Opening Balance.xlsx");
  };

  const handleUpdateButtonClick = async () => {
    if (!transaction_no || !transaction_date ) {
      setError(" ");
      return;
    }

    if (rowData.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "No  details found to save.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    try {

      const [detailResult] = await Promise.all([
        handleDeleteUpdateDetail()
      ]);

      if (!detailResult) {
        throw new Error('Detail deletion failed');
      }

      await Promise.all([
        updateObDetails()
      ]);

      Swal.fire({
        title: "Success",
        text: "Opening Balance Data Upadated Successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      console.log('Update successful');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDeleteUpdateDetail = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OpeningBaldeletedet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_no })
      });
      if (response.ok) {
        return true
      } else {
        console.log("Failed to fetch some data");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    }
  };

  const updateObDetails = async () => {
    try {

      const validRows = rowData.filter(row =>
        row.acct_code && row.journal_no > 0
      );

      console.log(validRows)

      for (const row of validRows) {
        const Details = {
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          created_by: sessionStorage.getItem('selectedUserCode'),
          transaction_date,
          transaction_no,
          item_type:row.item_type,
          acc_type:row.acc_type,
          acct_code:row.acct_code,
          journal_no:row.journal_no,
          Item_SNo:row.Item_SNo,
          debit:row.debit,
          credit:row.credit
        };

        const response = await fetch(`${config.apiBaseUrl}/AddOpeningBalanceDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Details),
        });

        if (response.ok) {
          console.log("Inventory Return Data inserted successfully");
        } else {
          const errorResponse = await response.json();
          console.error(errorResponse.message); // Log error message
          Swal.fire({
            title: "Error!",
            text: errorResponse.message,
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };


  return (
    <div className="container-fluid Topnav-screen">
      <div>
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className=" d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">
                Opening Balance
              </h1></div>
              <div className="d-flex justify-content-end purbut me-3">
              {saveButtonVisible && ['add', 'all permission'].some(permission => openingBalancePermission.includes(permission)) && (
                <savebutton className="purbut" title='save' onClick={handleSaveButtonClick}>
                  <i class="fa-regular fa-floppy-disk"></i>
                </savebutton>
              )}
             {updateButtonVisible && ['update', 'all permission'].some(permission => openingBalancePermission.includes(permission)) && (
                <savebutton className="purbut" title='update' onClick={handleUpdateButtonClick} >
                  <i class="fa-solid fa-floppy-disk"></i>
                </savebutton>
              )}
              {['delete', 'all permission'].some(permission => openingBalancePermission.includes(permission)) && (
                <delbutton className="purbut" title='delete' onClick={handleDeleteButtonClick}>
                  <i class="fa-solid fa-trash"></i>
                </delbutton>
              )}
              {['all permission', 'view'].some(permission => openingBalancePermission.includes(permission)) && (
                <printbutton className="purbut" title="print" onClick={generateReport}>
                  <i class="fa-solid fa-file-pdf"></i>
                </printbutton>
              )}
              {showExcelButton && (
                <printbutton className="purbut" title='excel' onClick={handleExcelDownload}>
                  <i class="fa-solid fa-file-excel"></i>
                </printbutton>
              )}
              <printbutton className="purbut" onClick={handleReload}>
                <i class="fa-solid fa-arrow-rotate-right"></i>
              </printbutton>
            </div>
            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1">
                    Opening Balance
                  </h1>
                </div>
                <div class="dropdown mt-2 me-4">
                  <button
                    class="btn btn-primary dropdown-toggle p-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu menu">
                  {saveButtonVisible && (
                    <li class="iconbutton d-flex justify-content-center text-success">
                      {['add', 'all permission'].some(permission => openingBalancePermission.includes(permission)) && (
                        <icon class="icon" onClick={handleSaveButtonClick}>
                          <i class="fa-regular fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                    )}
                    {updateButtonVisible && (
                  <li class="iconbutton d-flex justify-content-center text-success">
                 {['update', 'all permission'].some(permission => openingBalancePermission.includes(permission)) && (
                   <icon class="icon" onClick={handleUpdateButtonClick} >
                   <i class="fa-solid fa-floppy-disk"></i>
                   </icon>
                 )}
                  </li>
                    )}
                  <li class="iconbutton  d-flex justify-content-center text-danger">
                    {['delete', 'all permission'].some(permission => openingBalancePermission.includes(permission)) && (
                      <icon class="icon" onClick={handleDeleteButtonClick}>
                        <i class="fa-solid fa-trash"></i>
                      </icon>
                    )}
                  </li>
                  <li class="iconbutton  d-flex justify-content-center text-warning">
                    {['all permission', 'view'].some(permission => openingBalancePermission.includes(permission)) && (
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
        </div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  pt-4 " align="left" >
          <div className="row ms-3 mb-3 me-3">
            <div className="col-md-3 form-group ">
              <div class="exp-form-floating">
                <label for="rolname" class="exp-form-labels">
                  Transaction No
                </label>
                <div class="d-flex justify-content-end">
                <input
                  id="transactionNO"
                  className="exp-input-field form-control justify-content-start"
                  type="text"
                  placeholder=""
                  required title="Please fill the transaction no here"
                  value={transaction_no}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => settransaction_no(e.target.value)}
                />
                 <div className='position-absolute mt-2 me-2'>
                    <span 
                    style={hovered ? { cursor: "pointer", borderRadius: "50%", backgroundColor: "#f0f0f0", padding: "10px" } : { cursor: "pointer", borderRadius: "50%", padding: "10px" }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleOpeningBalance}>
                    <i class="fa fa-search"></i>
                    </span>
                    </div>
              </div>
            </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label for="rolname" class="exp-form-labels">
                  Transaction Date
                </label>
                <input
                  id="transactionDate"
                  className="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please fill the transaction date here"
                  min={financialYearStart}
                  max={financialYearEnd}
                  value={transaction_date}
                  maxLength={50}
                  onChange={(e) => settransaction_date(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* <p>Result Set</p>  */}
            <div  class="d-flex justify-content-end mb-2" style={{ marginRight: "50px" }}>
              <icon
                type="button"
                class="popups-btn"
                onClick={handleAddRow}>
                <FontAwesomeIcon icon={faPlus} />
              </icon>
              <icon
                type="button"
                class="popups-btn"
                onClick={handleRemoveRow}>
                <FontAwesomeIcon icon={faMinus} />
              </icon>
            </div>
          <div class="ag-theme-alpine" style={{ height: 545, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              pagination={true}
            />
          </div>
          <div>
          <ObPopup open={open} handleClose={handleClose} handleOb={handleOb}/>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">Created_by: {additionalData.created_by}</p>
            <p className="col-md-">
              Created_date: {additionalData.created_date}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              modified_by: {additionalData.modified_by}{" "}
            </p>
            <p className="col-md-6">
              modified_date: {additionalData.modified_date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpeningbalanceGrid;