import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";



function PurchaseAnalysis() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    // Fetch data here and set it using setRowData
    // Example: setRowData(yourFetchedData);
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onSearchInputChange = (e) => {
    setSearchValue(e.target.value);
    gridApi.setQuickFilter(e.target.value);
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }

    const reportData = selectedRows.map((row) => ({
      "Date": row.transaction_date,
      "Invoice No": row.transaction_no,
      "Vendor Code": row.vendor_code,
      "Vendor Name": row.vendor_name,
      "Payment Type": row.Payment_Type,
      "Tax Amount": row.tax_amt,
      "Balance Due": row.Balance_Due,
      "Total Amount": row.total_amount,
    }));

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Purchase Report</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      .report-entry {
          margin-bottom: 20px;
      }
      .report-label {
          font-weight: bold;
          width: 150px;
          display: inline-block;
      }
      .report-value {
          display: inline-block;
      }
      .report-button {
          margin-top: 20px;
      }
    `);


    reportData.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        reportWindow.document.write(`
          <div class="report-entry">
            <span class="report-label">${key}: </span><span class="report-value">${value}</span>
          </div>
        `);
      });
      reportWindow.document.write("<hr>");
    });

    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  const columnDefs = [
    {
      headerName: "Date",
      field: "transaction_date",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
    {
      headerName: "Invoice No",
      field: "transaction_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
    {
      headerName: "Vendor Code",
      field: "vendor_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
    {
      headerName: "Vendor Name",
      field: "vendor_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
    {
      headerName: "Payment Type",
      field: "pay_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
    {
      headerName: "Tax Amount",
      field: "tax_amount",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
    {
      headerName: "Balance Due",
      field: "Balance_Due",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
    {
      headerName: "total Amount",
      field: "purchase_amount",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => params.value ? params.value.toUpperCase() : '',
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    sortable: true,
    editable: true,
    flex: 1,
    filter: true,
    floatingFilter: true,
  };

  return (
    <div className="from-div" style={{ width: '90%', margin: '20px auto' }}>
      <Header />
      <Summary />
      <Divider />
      <Search searchValue={searchValue} onSearchInputChange={onSearchInputChange} />
      <PurchaseTable
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        generateReport={generateReport}
      />
    </div>
  );
}

const Header = () => {
  return (
    <div className="d-flex">
      <div className="d-flex month-div">
        <SelectMonth />
        <DateRange />

      </div>
    </div>
  );
};

const SelectMonth = () => (
  <div className="select-div">
    <select>
      {["This Month", "Last Month", "This quarter", "This Year", "custom"].map((month, index) => (
        <option key={index} value={month}>{month}</option>
      ))}
    </select>
  </div>
);


const DateRange = () => (
  <div className="d-flex gap-1 justify-content-center align-items-center">
    <div className="month_input">
      <span className="between-span">Between</span>
      <input type="date" />
    </div>
    <div>
      <span>To</span>
    </div>
    <div className="month_input">
      <input type="date" />
    </div>
  </div>
);



const Summary = () => {
  
  return (
    <div className="d-flex align-items-center gap-3" style={{ marginTop: '20px' }}>
      <SummaryItem type="paid" amount="$ 3,042.00" />
      <span style={{ fontSize: '20px', fontWeight: '700' }}>+</span>
      <SummaryItem type="unpaid" amount="$ 3,042.00" />
      <span style={{ fontSize: '20px', fontWeight: '700' }}>=</span>
      <SummaryItem type="total" amount="$ 6,084.00" />
    </div>
  );
};

const SummaryItem = ({ type, amount }) => (
  <div className={type}>
    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
    <p>{amount}</p>
  </div>
);

const Divider = () => (
  <div className="line-div"></div>
);

const Search = ({ searchValue, onSearchInputChange }) => {
  return (
    <div className="d-flex" style={{ justifyContent: 'space-between', marginTop: '10px' }}>
      <div className="search-input">
        <input type="text" style={{ position: 'absolute', paddingLeft: '20px' }} value={searchValue} onChange={onSearchInputChange} />
        <i className="fa fa-search" style={{ position: 'relative', left: '5px' }}></i>
      </div>
      <div>
        <button className="btn btn-primary">
          <i style={{ marginRight: '4px', backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(0, 140, 255)' }}></i>
          Addpurchase
        </button>
      </div>
    </div>
  );
};

const PurchaseTable = ({ rowData, columnDefs, defaultColDef, onGridReady, onSelectionChanged, generateReport }) => {
  return (
    <div className="ag-theme-quartz" style={{ height: 800, width: "100%" }}>

      <div className="search-container" align="center">

      </div>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        rowSelection="multiple"
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
};

export default PurchaseAnalysis;
