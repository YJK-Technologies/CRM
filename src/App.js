


import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import moment from "moment";
const config = require('./Apiconfig');

import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dateFilterParams = {
    applyButton: true,
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      var dateAsString = cellValue;
      if (!dateAsString) return -1; // Handle null or undefined dates
      var cellDate = new Date(dateAsString);
      cellDate.setHours(0, 0, 0, 0);

      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    browserDatePicker: true,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (startRow, endRow) => {
    try {
      const response = await fetch(
        `http://localhost:5500?startRow=${startRow}&endRow=${endRow}`
      );
      const jsonData = await response.json();
      setRowData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columnDefs = [
    {
      headerName: "Date",
      field: "expenses_date",
      editable: true,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
      cellRenderer: (data) => {
        return moment(data.value).format("YYYY-MM-DD");
      },
      checkboxSelection: true,
    },
    {
      headerName: "Type",
      field: "expenses_type",
      editable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Amount Spent",
      field: "expenses_amount",
      editable: true,
      aggFunc: (params) => {
        let total = 0;
        params.values.forEach((value) => (total += value));
        return total;
      },
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => {
        return params.value.toFixed(2);
      },
    },
    {
      headerName: "Spent By",
      field: "expenses_spentby",
      editable: true,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Remarks",
      field: "remarks",
      editable: true,
      cellStyle: { textAlign: "right" },
    },
  ];

  const defaultColDef = {
    sortable: true,
    editable: true,
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const exportClick = () => {
    gridApi.exportDataAsExcel();
  };

   // Current report
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }

    const reportData = selectedRows.map((row) => {
      return {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        Expenditure: row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Expenses_Report</title>");
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
    reportWindow.document.write("<h1><u>Expense Report</u></h1>");

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

  // Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.expenses_date === params.data.expenses_date // Use your unique identifier here
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
      const response = await fetch(`${config.apiBaseUrl}/saveEditedData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editedData }),
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

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected rows?"
    );
    if (!confirmDelete) {
      return;
    }

    const empnosToDelete = selectedRows.map((row) => row.empno);

    try {
      const response = await fetch(`${config.apiBaseUrl}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empnos: empnosToDelete }),
      });

      if (response.status === 200) {
        console.log("Rows deleted successfully:", empnosToDelete);
        fetchData(); // Fetch updated data after deletion
      } else {
        console.error("Failed to delete rows");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  };

  const onPaginationPageRequested = (params) => {
    const startRow = params.startRow;
    const endRow = params.endRow;

    // Fetch data for the requested page
    fetchData(startRow, endRow);
  };

  const getFilterType = () => {
    if (startDate !== "" && endDate !== "") return "inRange";
    else if (startDate !== "") return "greaterThan";
    else if (endDate !== "") return "lessThan";
  };
  useEffect(() => {
    if (gridApi) {
      if (startDate !== "" && endDate !== "" && startDate > endDate) {
        alert("Start Date should be before End Date");
        setEndDate("");
      } else {
        var dateFilterComponent = gridApi.getFilterInstance("expenses_date");
        dateFilterComponent.setModel({
          type: getFilterType(),
          dateFrom: startDate ? startDate : endDate,
          dateTo: endDate,
        });
        gridApi.onFilterChanged();
      }
    }
  }, [startDate, endDate]);

 

  return (
    <div className="ag-theme-quartz" style={{ height: 700, width: "100%" }}>
      <h1 align="center">
        <i class="bi bi-cash-stack"></i> Daily Expenses
      </h1>
      <div
        className="upper"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          From :{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span> </span>
          To :{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <i class="bi bi-database-fill-add"></i>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
          ></link>
<button onClick={() => setShowAddUserForm(true)}>
            {" "}
            add <i class="bi bi-trash"></i>
          </button>
          <button onClick={deleteSelectedRows}>
            {" "}
            Delete Expense <i class="bi bi-trash"></i>
          </button>
          <button onClick={() => exportClick()}>
            Export <i class="bi bi-download"></i>
          </button>
          <button onClick={generateReport}>
            Generate Report <i class="bi bi-file-earmark-text"></i>
          </button>
        </div>
      </div>
      {showAddUserForm && <AddUserForm />}
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onCellValueChanged={onCellValueChanged}
        groupIncludeTotalFooter="true"
        pagination={true}
        paginationPageSize={13}
        onPaginationPageRequested={onPaginationPageRequested}
        rowSelection="multiple"
      />

      
      <div align="center">
        <button onClick={saveEditedData}>
          SAVE <i class="bi bi-save2"></i>
        </button>
      </div>
    </div>
  );
}

export default App;


/*const columnDefs = [
    {
      headerName: "Date",
      field: "expenses_date",
      editable: true,
      filter: "agDateColumnFilter",
      rowGroup: true,
      filterParams: dateFilterParams,

      cellRenderer: (data) => {
        return moment(data.value).format("YYYY-MM-DD");
      },
      checkboxSelection: true,
    },
    {
      headerName: "Type",
      field: "expenses_type",
      editable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Amount Spent",
      field: "expenses_amount",
      editable: true,
      aggFunc: (params) => {
        let total = 0;
        params.values.forEach((value) => (total += value));
        return total;
      },
      cellStyle: { textAlign: "right" },
      valueFormatter: (params) => {
        // Format the value with two decimal places
        return params.value.toFixed(2);
      },
    },
    {
      headerName: "Spent By",
      field: "expenses_spentby",
      editable: true,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Remarks",
      field: "remarks",
      editable: true,
      cellStyle: { textAlign: "right" },
    },
  ];
*/

 /*
  /// THE EXPECTED TYPE OF REPORT WITH SINGLE DATA REPRESENTATION WITHOUT WINDOW ALERT
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }
    const reportData = selectedRows.map(row => {
      return {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        "Amount Spent": row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks
      };
    });
  
    const descriptions = Object.keys(reportData[0]);
    const values = Object.values(reportData[0]);
  
    const reportContent = `
      <html>
        <head>
          <title>Expenses Report</title>
          <style>
            .report-table {
              display: table;
              width: 100%;
            }
            .report-row {
              display: table-row;
            }
            .report-cell {
              display: table-cell;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          <h1>Expense Report</h1>
          <div class="report-table">
            ${descriptions.map((desc, index) => `
              <div class="report-row">
                <div class="report-cell">${desc}</div>
                <div class="report-cell">${values[index]}</div>
              </div>
            `).join('')}
          </div>
          <button id="printButton">Print Report</button>
          <script>
            // Add event listener to the print button
            document.getElementById("printButton").addEventListener("click", () => {
              // Print the report
              window.print();
            });
          </script>
        </body>
      </html>
    `;
  
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
  };

*/

  /*



/// THE EXPECTED TYPE OF REPORT WITH SINGLE DATA REPRESENTATION


const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }
    
    selectedRows.forEach((row, index) => {
      const reportData = {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        "Amount Spent": row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks
      };
  
      const descriptions = Object.keys(reportData);
      const values = Object.values(reportData);
  
      const reportContent = `
        <html>
          <head>
            <title>Expenses Report</title>
            <style>
              .report-table {
                display: table;
                width: 100%;
              }
              .report-row {
                display: table-row;
              }
              .report-cell {
                display: table-cell;
                padding: 8px;
              }
            </style>
          </head>
          <body>
            <h1>Expense Report</h1>
            <div class="report-table">
              ${descriptions.map((desc, index) => `
                <div class="report-row">
                  <div class="report-cell">${desc}</div>
                  <div class="report-cell">${values[index]}</div>
                </div>
              `).join('')}
            </div>
            <button id="printButton${index}">Print Report</button>
            <script>
              // Add event listener to the print button
              document.getElementById("printButton${index}").addEventListener("click", () => {
                // Print the report
                window.print();
              });
            </script>
          </body>
        </html>
      `;
  
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(reportContent);
        reportWindow.document.close();
      } else {
        alert("Failed to open report window. Please check your browser settings.");
      }
    });
  };
  */

  /*

TABLE WITH CONSECUTIVE CELLS OF DATA
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }
    
    const reportData = selectedRows.map(row => {
      return {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        "Amount Spent": row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks
      };
    });
  
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<html><head><title>Expenses_Report</title></head><body>');
    reportWindow.document.write('<h1>Expense Report</h1>');
    reportWindow.document.write('<table border="1"><thead><tr>');
    Object.keys(reportData[0]).forEach(key => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write('</tr></thead><tbody>');
    reportData.forEach(row => {
      reportWindow.document.write('<tr>');
      Object.values(row).forEach(value => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write('</tr>');
    });
    reportWindow.document.write('</tbody></table>');
    reportWindow.document.write('<button onclick="window.print()">Print</button>');
    reportWindow.document.write('</body></html>');
    reportWindow.document.close();
  };
  */

  /*
// TYPE 1 REPORT FORMAT WITH MULTI DATA SELECTION

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }
    
    const reportData = selectedRows.map(row => {
      return {
        Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        "Amount Spent": row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks
      };
    });
  
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<html><head><title>Expenses_Report</title></head><body>');
    reportWindow.document.write('<h1>Expense Report</h1>');
  
    // Display report data in two columns
    reportData.forEach(row => {
      // Iterate over each property of the row
      Object.entries(row).forEach(([key, value]) => {
        // Write description and value in two columns
        reportWindow.document.write(`<p><strong>${key}: <span>          </span></strong> ${value}</p>`);
      });
      // Add a line break between rows
      reportWindow.document.write('<br>');
    });
  
    reportWindow.document.write('<button onclick="window.print()">Print</button>');
    reportWindow.document.write('</body></html>');
    reportWindow.document.close();
  };

*/

