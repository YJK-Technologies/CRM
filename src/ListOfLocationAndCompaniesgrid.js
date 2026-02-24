import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const config = require('./Apiconfig');

function ListOfLocationAndCompaniesgrid() {

      
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  /* const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editedData, setEditedData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");*/

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}`);
      const jsonData = await response.json();
      setRowData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columnDefs = [
  
    {
      
      checkboxSelection: true,
      headerName: "Company Name",
      field: "company_name",
      editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 160,
      maxWidth: 160,
     

     
    },
    {
      headerName: "Location Name",
      field: "",
      editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 160,
      maxWidth: 160,
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

    const reportData = selectedRows.map((row) => {
      return {
        /* Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        Expenditure: row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks,*/
        "Company Name": row.company_no,
        "Location Name": row.company_name,
      };
    });

   
    

   


 

  const handleDataSelection = () => {
    // Perform logic for data selection
    // After selecting data, navigate to the main page
    navigate("/mainpage");
  }; 






 
  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 800, width: "100%" }}>
        <h1 align="center">YJK TECHNOLOGIES
    </h1>

    <h4 align="center"> User Id</h4>
        
          
            
  
          
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
         //  onCellValueChanged={onCellValueChanged}       
          rowSelection="multiple"
          pagination={true}
        //  onSelectionChanged={onSelectionChanged}
        />
        </div>
      <div align="center">
      <button onClick={handleDataSelection}>ENTER</button>
      </div>
    </div>
  );
}

export default ListOfLocationAndCompaniesgrid;
