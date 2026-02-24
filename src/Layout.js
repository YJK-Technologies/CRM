import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import moment from "moment";
import Chart from "./chart";
import Barc from "./Barc";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
// Import other components as needed

function App() {
  // Your existing code goes here

  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        {/* Top bar component */}
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          {/* Sidebar component */}
          <Sidebar />
        </div>
        <div id="layoutSidenav_content">
          {/* Main content component */}
        </div>
      </div>
    </div>
  );
}

export default App;
