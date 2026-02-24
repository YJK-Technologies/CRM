
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import "./mobile.css"
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, DropdownButton } from "react-bootstrap";
import swal from "sweetalert2";
import Select from 'react-select'

function StocktransferGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  //const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  /* const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");*/
  const config = require('./Apiconfig');
  const [transaction_date, settransaction_date] = useState("");
  const [transaction_type, settransaction_type] = useState("");
  const [transaction_no, settransaction_no] = useState("");
  const [item_code, setitem_code] = useState("");
  const [editedData, setEditedData] = useState([]);
  const [Transactiondrop, setTransactiondrop] = useState([]);
  const [selectedTransaction, setselectedTransaction] = useState('');
  const [itemcodedrop, setitemcodedrop] = useState([]);
  const [Transdrop, setTransdrop] = useState([]);
  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })

      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const Transaction = data.map(option => option.attributedetails_name);
        setTransdrop(Transaction);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })

      .then((data) => data.json())
      .then((val) => setTransactiondrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/itemcode`)
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const Itemcode = data.map(option => option.Item_code);
        setitemcodedrop(Itemcode);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionitemcode = itemcodedrop.map((option) => ({
    value: option.Item_code,
    label: option.Item_code,
  }));
  const filteredOptionTransaction = Transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangetransaction = (selectedTransaction) => {
    setselectedTransaction(selectedTransaction);
    settransaction_type(selectedTransaction ? selectedTransaction.value : '');
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

  const reloadGridData = () => {
    window.location.reload();
  };




  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/stocktransferSearch
`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction_date, transaction_type, transaction_no, item_code }) // Send company_no and company_name as search criteria
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


  const columnDefs = [

    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Transaction Date",
      field: "transaction_date",
      //  editable: true,
      cellStyle: {
        textAlign: "left",
      },

      minWidth: 250,
      maxWidth: 250,
      cellEditorParams: {
        maxLength: 20,
      },
      valueFormatter: (params) => {
        if (!params.value) return ''; // Return an empty string if the value is null or undefined
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, '0'); // Get day (padStart ensures double-digit format)
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (+1 because months are zero-indexed)
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Return formatted date string with day, month, and year
      },
    },
    {
      headerName: "Transaction Type",
      field: "transaction_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Transdrop,


      },
    },
    {

      headerName: "Transaction No",
      field: "transaction_no",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 10,
      },
    },
    {

      headerName: "Item Code",
      field: "item_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: itemcodedrop,


      },
    },
    {

      headerName: "Transfer Quantity",
      field: "transfer_Qty",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {

      headerName: "From Warehouse",
      field: "from_Warehouse",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 50,
      },
    },
    {

      headerName: "To Warehouse",
      field: "to_Warehouse",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      minWidth: 150,
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
    flex: 1,
    // filter: true,
    // floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onSearchInputChange = (e) => {
    setSearchValue(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row) => {
      return {
        /* Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        Expenditure: row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks,*/
        "Transaction Date": row.transaction_date,
        "Transaction Type": row.transaction_type,
        "Transaction No": row.transaction_no,
        "Item Code": row.Item_code,
        "Transfer Quantity": row.transfer_Qty,
        "From Warehouse": row.from_Warehouse,
        "To Warehouse": row.to_Warehouse,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Stock Transfer</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      .report-entry {
          margin-bottom: 20px; /* Adjust the space between each key-value pair */
      }
      .report-label {
          font-weight: bold;
          width: 500px;
          display: inline-block;
      }
      .report-value {
          width: calc(100% -500px);
          display: inline-block;
      }
      .report-button {
          margin-top: 20px;
      }
  `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write("<h1><u>Stock Transfer</u></h1>");

    // Display report data
    reportData.forEach((row) => {
      // Iterate over each property of the row
      Object.entries(row).forEach(([key, value]) => {
        // Write description and value on a single line
        reportWindow.document.write(`
              <div class="report-entry">
                  <span class="report-label">${key}: </span><span class="report-value">${value}</span>
              </div>
          `);
      });
      // Add a horizontal line after each report
      reportWindow.document.write("<hr>");
    });

    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };


  /*const handleNavigateToForm = () => {
    navigate("/form");
  };*/

  const handleNavigatesToForm = () => {
    navigate("/StockTransfer/Add", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };




  // Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.transaction_date === params.data.transaction_date && row.transaction_no === params.data.transaction_no
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
      // Filter the editedData state to include only the selected rows
      const selectedRowsData = editedData.filter(row =>
        selectedRows.some(selectedRow =>
          selectedRow.transaction_date === row.transaction_date && selectedRow.transaction_no === row.transaction_no
        )
      );

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

      const response = await fetch(`${config.apiBaseUrl}/updstocktransfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_datesToUpdate: selectedRowsData.map(row => row.transaction_date),
          transaction_nosToUpdate: selectedRowsData.map(row => row.transaction_no),
          updatedData: selectedRowsData
        }), // Send the selected rows for saving along with their header and detail codes
      });

      if (response.ok) {
        setTimeout(() => {
          swal.fire({
            text: "Data updated successfully!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            handleSearch();
          });
        }, 1000);
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
  //delete
  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      swal.fire({
        title: "No Rows Selected",
        text: "Please select at least one row to delete",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }


    const confirmDelete = await swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete the selected rows?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    if (!confirmDelete.isConfirmed) {
      return;
    }

    const transaction_datesToDelete = selectedRows.map((row) => row.transaction_date);
    const transaction_noToDelete = selectedRows.map((row) => row.transaction_no);

    try {
      const response = await fetch(`${config.apiBaseUrl}/deletestocktransfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_datesToDelete, transaction_noToDelete }), // Corrected the key name to match the server-side expectation
      });

      if (response.ok) {
        console.log("Rows deleted successfully:", transaction_datesToDelete, transaction_noToDelete);
        handleSearch(); // Fetch updated data after deletion
        swal.fire({
          title: "Success",
          text: "Rows deleted successfully",
          icon: "success",
          confirmButtonText: "OK"
        });
      } else {
        // Check if the response status is 400 for custom error handling
        if (response.status === 400) {
          const errorMessage = await response.text(); // Extract error message from response
          swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK"
          }); // Display error message to the user
        } else {
          console.error("Failed to delete rows");
        }
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      // Handle network errors or other exceptions
      swal.fire({
        title: "Error",
        text: "An error occurred while deleting rows. Please try again later.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };


  return (
    <div>
      <div align="right">


        <div class="d-flex justify-content-between">

          <div className="d-flex justify-content-start">
            <h1 align="left" >Stock Transfer</h1>
          </div>


          <div class="d-flex justify-content-end" >
            <addbutton onClick={handleNavigatesToForm}
              required title="Add Stock Transfer"> <i class="fa-solid fa-user-plus"></i> </addbutton>
            <delbutton onClick={deleteSelectedRows} required title="Delete">
              <i class="fa-solid fa-user-minus"></i>
            </delbutton>
            <button class="save" onClick={saveEditedData} required title="Update"><i class="fa-solid fa-floppy-disk"></i></button>

            <button class="print" onClick={generateReport} required title="Generate Report" ><i class="fa-solid fa-print"></i></button>
          </div></div>


        <div class="mobileview">
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-start">
              <h1 align="left" className="h1">Stock Transfer</h1>
            </div>

            <div className="d-flex justify-content-end">
              <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-list"></i>
                </button>

                <ul class="dropdown-menu menu">
                  <li class="me-5 ms-4">
                    <button class="btn btn-secondary me-3 fs-6 mobile" >Add Data</button>
                  </li>
                  <li class="me-5 ms-4">
                    <button class="btn btn-danger me-3 mt-2 fs-6 mobile" onClick={deleteSelectedRows} >Delete</button>
                  </li>
                  <li class="me-5 ms-4">
                    <button class="btn btn-success me-3 mt-2 fs-6 mobile" onClick={saveEditedData} >Save</button>
                  </li>
                  <li class="me-5 ms-4">
                    <button class="btn btn-dark text-white me-3 mt-2 fs-6 text-dark mobile" onClick={generateReport}>Print</button>
                  </li>
                </ul></div>
            </div>
          </div></div></div>



      <div className="search-criteria-box" align="left">


        <div className="row ms-4">
          <div className="col-md-3 form-group ">
            <div class="exp-form-floating">
              <label for="rolname" class="exp-form-labels">
                Transaction Date
              </label><input
                id="rolname"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please fill the transaction date here"
                min={financialYearStart}
                max={financialYearEnd}
                value={transaction_date}
                maxLength={50}
                onChange={(e) => settransaction_date(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="tcode" class="exp-form-labels">
                Transaction Type
              </label>
              {/*<input
                    id="wcode"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please fill the screen type here"
                    value={Screen_Type}
                    onChange={(e) => setScreen_Type(e.target.value)}
                    />*/}
              <Select
                id="wcode"
                value={selectedTransaction}
                onChange={handleChangetransaction}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                options={filteredOptionTransaction}
                className="exp-input-field"
                placeholder=""
                required title="Please select a transaction type"
              />

            </div>
          </div>
          <div className="col-md-3 form-group ">
            <div class="exp-form-floating">
              <label for="rolname" class="exp-form-labels">
                Transaction No
              </label><input
                id="rolname"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the transaction no here"
                value={transaction_no}
                maxLength={50}
                onChange={(e) => settransaction_no(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

            </div>
          </div>
          <div className="col-md-3 form-group ">
            <div class="exp-form-floating">
              <label for="rolname" class="exp-form-labels">
                Item Code
              </label><input
                id="rolname"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the item code here"
                value={item_code}
                maxLength={50}
                onChange={(e) => setitem_code(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

            </div>
          </div>

        </div><div className="col-md-2 form-group mt-4 ms-5">
          <div class="exp-form-floating">
            <div class=" d-flex justify-content-center ">
              <button className="searchBtn" onClick={handleSearch} required title="Search"><i className="fas fa-search"></i></button>
              <button className="searchBtn" onClick={reloadGridData} required title="Refresh"><FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" /></button>
            </div> </div></div>
      </div>






      {/* <p>Result Set</p>  */}
      <hr />
      <div class="tax">
        <div class="ag-theme-alpine" style={{ height: 609, width: "100%" }}>
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
      </div></div>
  );
}

export default StocktransferGrid;