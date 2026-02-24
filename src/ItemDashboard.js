import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import './ItemDash.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SummaryCard from './DashboardComponents/SummaryCard';

const transactions = [
  { date: '25/04/2024', invoiceNo: 13, partyName: 'arun kumar', transactionType: 'Sale', paymentType: 'Cash', amount: 1000, balanceDue: 0 },
  { date: '25/04/2024', invoiceNo: 12, partyName: 'siva', transactionType: 'Sale', paymentType: 'Cash', amount: 401, balanceDue: 0 },
  { date: '24/04/2024', invoiceNo: 11, partyName: 'arun kumar', transactionType: 'Sale', paymentType: 'Cash', amount: 2120, balanceDue: 0 },
  { date: '23/04/2024', invoiceNo: 10, partyName: 'siva sundaram', transactionType: 'Sale', paymentType: 'Cash', amount: 907, balanceDue: 0 },
  { date: '22/04/2024', invoiceNo: 9, partyName: 'siva sundaram', transactionType: 'Sale', paymentType: 'Cash', amount: 1866, balanceDue: 0 },
  { date: '21/04/2024', invoiceNo: 8, partyName: 'siva', transactionType: 'Sale', paymentType: 'Cash', amount: 1890, balanceDue: 0 },
  { date: '20/04/2024', invoiceNo: 7, partyName: 'arun kumar', transactionType: 'Sale', paymentType: 'Cash', amount: 1106, balanceDue: 0 },
  { date: '19/04/2024', invoiceNo: 6, partyName: 'siva sundaram', transactionType: 'Sale', paymentType: 'Cash', amount: 421, balanceDue: 0 },
];

const ItemPage = () => {
  const [columnDefs] = useState([
    { headerName: "Date", field: "date" },
    { headerName: "Invoice No.", field: "invoiceNo" },
    { headerName: "Party Name", field: "partyName" },
    { headerName: "Transaction Type", field: "transactionType" },
    { headerName: "Payment Type", field: "paymentType" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Balance Due", field: "balanceDue" },
    {
      headerName: "Actions",
      field: "actions",
      minWidth: 650,
      cellRendererFramework: (params) => (
        <div>
          <button className="btn btn-sm btn-outline-primary" onClick={() => handlePrint(params)}>Print</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(params)}>Edit</button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(params)}>Delete</button>
        </div>
      ),
    },
  ]);

  const handlePrint = (params) => {
    console.log('Print', params.data);
  };

  const handleEdit = (params) => {
    console.log('Edit', params.data);
  };

  const handleDelete = (params) => {
    console.log('Delete', params.data);
  };

  return (
    <div className="container-fluid">
        <div class="SearchGrid mt-3"></div>

       <div class="SearchGrid">
        <h1>Sale Invoices</h1>
        <div class="d-flex justify-content-between mt-3 mb-2 ms-5">
     <div class="row-2">
         <input
              id="cno"
              className="exp-input-field form-control"
              type="text"
              placeholder="Search Transaction"
              maxLength={18}
              
            />
            </div>
       <div class="mb-2">
    <button className="add-sale">Add Sale</button>
    <button className="add-purchase">Add Purchase</button>
    <button className="add-more">Add More</button></div></div> 
    </div>
    <div class="col-gap-3 mb-3"> 
    </div>


<div class="SearchGrid pt-3 pb-3">
  <div class="d-flex justify-content-between">
      <div className="row mb-3 ms-4">
        <div className="col-md-3">
          <select className="form-select">
            <option>Last Month</option>
            {/* Add more options here */}
          </select>
        </div>

        <div className="col-md-6">
          <div className="input-group">
            <input type="date" className="form-control" />
            <span className="input-group-text">To</span>
            <input type="date" className="form-control" />
          </div>
        </div>
       

        <div className="col-md-3">
          <select className="form-select">
            <option>All Firms</option>
            {/* Add more options here */}
          </select>
        </div> </div>
      <div class="d-flex justify-content-end me-4">
        <div className="col-md-10">
           <div >
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
            <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z"/>
          </svg>
           </div>
        </div>
        <div className="col-md-11">
           <div >
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-file-earmark-excel-fill" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M5.884 6.68 8 9.219l2.116-2.54a.5.5 0 1 1 .768.641L8.651 10l2.233 2.68a.5.5 0 0 1-.768.64L8 10.781l-2.116 2.54a.5.5 0 0 1-.768-.641L7.349 10 5.116 7.32a.5.5 0 1 1 .768-.64"/>
            </svg>
           </div>
        </div>
        <div className="col-md-10">
           <div >
           <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
            <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
            <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
          </svg>
           </div>
        </div></div>
      </div>

      
      <div className="d-flex justify-content-start gap-4 ms-5 mb-3" style={{fontSize:"10px"}}>
        <div className="col-md-2">
          <SummaryCard title="Paid" amount="₹13,96,786.00" bgColor="bg-success" textColor="text-white" />
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-plus mt-5" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
        <div className="col-md-2">
          <SummaryCard title="Unpaid" amount="₹4,939.00" bgColor="bg-warning" textColor="text-white" />
        </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-fast-forward-fill mt-5" viewBox="0 0 16 16">
          <path d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
          <path d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
        </svg>
        <div className="col-md-2">
          <SummaryCard title="Total" amount="₹14,01,725.00" bgColor="bg-primary" textColor="text-white" />
        </div>
        
      </div>
      </div>
     <div class="col-gap-3 mb-3"> 
     </div>
      
      <div class="SearchGrid">
        <h1 class="">Transaction</h1>
        <div class="d-flex justify-content-between "></div>
      <div class="d-flex   mb-5 ms-5">
     <div class="row-2">
         <input
              id="cno"
              className="exp-input-field form-control mt-1"
              type="text"
              placeholder="Search Transaction"
              maxLength={18}
              
            />
            </div>
            <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor " class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
            </button>
       </div>

      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          rowData={transactions}
          columnDefs={columnDefs}
        />
      </div>
    </div></div>
  );
};

export default ItemPage;
