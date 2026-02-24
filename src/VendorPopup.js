import { useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import LoadingScreen from './Loading';

const config = require('./Apiconfig');



const columnDefs = [

  {
    checkboxSelection: true,
    headerName: "Vendor Code",
    field: "vendor_code",
    editable: true,
    cellStyle: { textAlign: "left" },
    minWidth: 250,
    maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
    headerName: "Vendor Name",
    field: "vendor_name",
    editable: true,
    cellStyle: { textAlign: "left" },
    minWidth: 250,
    maxWidth: 250,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
      headerName: "Company Code",
      field: "company_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address1",
      field: "vendor_addr_1",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address2",
      field: "vendor_addr_2",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address3",
      field: "vendor_addr_3",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Address4",
      field: "vendor_addr_4",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Area Code",
      field: "vendor_area_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor State Code",
      field: "vendor_state_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Vendor Country Code",
      field: "vendor_country_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "PAN No",
      field: "panno",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
     },
    {
      headerName: "GST No",
      field: "vendor_gst_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
    },
    {
      headerName: "Vendor IMEX No",
      field: "vendor_imex_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      
    },
    {
      headerName: "Vendor Office No",
      field: "vendor_office_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
     
    },
    {
      headerName: "Vendor Residental No",
      field: "vendor_resi_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Mobile No",
      field: "vendor_mobile_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
   
    },
    {
      headerName: "Fax No",
      field: "vendor_fax_no",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 250,
      maxWidth: 250,
      valueFormatter: (params) => {
        return params.value ? params.value.toLowerCase() : '';
      },
    },
  {
    headerName: "Email ID",
    field: "vendor_email_id",
    editable: true,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toLowerCase() : '';
    },
  },
  {
  
    headerName: "Credit Limit",
    field: "vendor_credit_limit",
    editable: true,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
 
  },
  {
    headerName: "Transport Code",
    field: "vendor_transport_code",
    editable: true,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    },
  {
    headerName: "Salesman Code",
    field: "vendor_salesman_code",
    editable: true,
    cellStyle: { textAlign: "left" },
    minWidth: 150,
    valueFormatter: (params) => {
      return params.value ? params.value.toUpperCase() : '';
    },
  },
  {
      headerName: "Broker Code",
      field: "vendor_broker_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
    },
    {
      headerName: "Weekday Code",
      field: "vendor_weekday_code",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => {
        return params.value ? params.value.toUpperCase() : '';
      },
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
export default function VendorPopup({ open, handleClose, handleVendor }) {

  const [rowData, setRowData] = useState([]);
  const [vendor_code, setvendor_code] = useState("");
  const [vendor_name, setvendor_name] = useState("");
  const [company_code, setcompany_code] = useState("");
  const [vendor_salesman_code, setvendor_salesman_code] = useState("");
  const [vendor_broker_code, setvendor_broker_code] = useState("");
    const [loading, setLoading] = useState(false);
  
//   const [Item_Our_Brand, setItem_Our_Brand] = useState("");
//   const [status, setstatus] = useState("");

  const handleSearchItem = async () => {
            setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/vendorsearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vendor_code, company_code, vendor_salesman_code, vendor_broker_code }) 
      });
      if (response.ok) {
      const searchData = await response.json();
      setRowData(searchData);
      console.log("data fetched successfully")
    } else if (response.status === 404) {
      console.log("Data not found"); // Log the message for 404 Not Found
    } else {
      console.log("Bad request"); // Log the message for other errors
    }
  } catch (error) {
    console.error("Error fetching search data:", error);
  }finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

/* const handleConfirm = () => {
    const selectedData = selectedRows.map(row => ({
        vendorcode: row.vendor_code,
        vendor_name: row.vendor_name,
    }));
    console.log('Selected Data:', selectedData);
    if (selectedData.length > 0) {
        const { vendorcode, vendor_name } = selectedData[0];
        setvendor_code(vendorcode);
        setvendor_name(vendor_name);
    }
    handleClose();
}*/

const handleConfirm = () => {
  const selectedData = selectedRows.map(row => ({
      vendorcode: row.vendor_code,
      vendor_name: row.vendor_name,
  }));
  console.log('Selected Data:', selectedData);
  handleVendor(selectedData);
  handleClose();
}


  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='90%'
      >
         {loading && <LoadingScreen />}
        <DialogTitle id="alert-dialog-title">Purchase</DialogTitle>
        <DialogContent>

          <Stack spacing={4} margin={2}>
            <Stack direction='row' spacing={2}>
          <TextField
            id='VendorCode'
            placeholder='Enter Vendor Code'
            label='Vendor Code'
            variant='outlined'
            className="exp-input-field form-control"
            size="small"
            value={vendor_code}
            onChange={(e) => setvendor_code(e.target.value)}
          />
          <TextField
            id='Varient'
            placeholder='Enter Varient'
            label='Varient'
            variant='outlined'
            size="small"
            value={company_code}
            onChange={(e) => setcompany_code(e.target.value)}
          />
          <TextField
            id='ItemName'
            placeholder='Enter Item Name'
            label='Item Name'
            variant='outlined'
            size="small"
            value={vendor_salesman_code}
            onChange={(e) => setvendor_salesman_code(e.target.value)}
          />
          <TextField
            id='ShortName'
            placeholder='Enter Short Name'
            label='Short Name'
            variant='outlined'
            size="small"
            value={vendor_broker_code}
            onChange={(e) => setvendor_broker_code(e.target.value)}
          />
          <Button onClick={handleSearchItem}><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
          <Button onClick={handleReload }><FontAwesomeIcon icon="fa-solid fa-rotate-right" /></Button>
          </Stack>
          </Stack>

          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              pagination='true'
              onSelectionChanged={handleRowSelected}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button  onClick={handleConfirm}>Ok</button>
          <button onClick={handleClose}>Cancel</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
   