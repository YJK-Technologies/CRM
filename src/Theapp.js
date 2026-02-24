

/*
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Thedashboard from './Thedashboard';
import Thesidebar from './Thesidebar';
import Topbar from './Topbar';
import Input from './Input'; // Import your input component here
import "./App.css";
import Grid from './Grid';

function Theapp() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <Router>
            <div className={`sb-nav-fixed ${isSidebarOpen ? '' : 'sb-sidenav-toggled'}`}>
                <Topbar />
                <div id="layoutSidenav" className={`sb-nav-fixed ${isSidebarOpen ? '' : 'sb-sidenav-toggled'}`}>
                    <Thesidebar onClick={toggleSidebar} />
                    <div id="layoutSidenav_content">
                        <div className="container-fluid px-4">
                            <Routes>
                                <Route path="/form" element={<Input />} />
                                <Route path="/grid" element={<Grid />} />
                            </Routes>
                            <Thedashboard />
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default Theapp;
*/



// the main



/*

                                                   // Login page within the dashboard :)

// App
import React, { useState } from "react";
import "./App.css";
import Topbar from "./Topbar";
import Thesidebar from "./Thesidebar";
import Thedashboard from "./Thedashboard";
import { Routes, Route, Link } from "react-router-dom";
import Input from "./Input"; // Import your input component here
import Grid from "./Grid";
import Login from "./Login.js";
import Signup from "./signup.js";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
  
      <div
        className={`sb-nav-fixed ${isSidebarOpen ? "" : "sb-sidenav-toggled"}`}
      >
        <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          id="layoutSidenav"
          className={`sb-nav-fixed ${
            isSidebarOpen ? "" : "sb-sidenav-toggled"
          }`}
        >
          <div id="layoutSidenav_content">
            <Thesidebar />
            <div className="container-fluid px-4">
            <Routes>
                <Route path="/form" element={<Input />} />
                <Route path="/grid" element={<Grid />} />
              </Routes>
              <Thedashboard />
            </div>
          </div>
        </div>
      </div>
   
   
  );
}

export default App;
*/

import React, { useState } from "react";
import "./App.css";
import Topbar from "./Topbar";
import Thesidebar from "./Thesidebar";
import Thedashboard from "./Thedashboard";
/*import { Routes, Route, Link } from "react-router-dom";
import Input from "./Input"; // Import your input component here
import Grid from "./Grid";
import Login from "./Login.js";
import Signup from "./signup.js";*/

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className={`sb-nav-fixed ${isSidebarOpen ? "sb-nav-fixed" : "sb-sidenav-toggled"}`}>
      <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div id="layoutSidenav_content" className={`sb-nav-fixed ${isSidebarOpen ? "" : "sb-sidenav-toggled"}`}>
        <div id="layoutSidenav_content">
          <Thesidebar />
          <div className="container-fluid">
            <Thedashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
