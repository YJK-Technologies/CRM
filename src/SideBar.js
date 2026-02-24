import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { Printer, Wrench, ClipboardList, ShoppingCart,UserCog ,BarChart3, ReceiptText } from "lucide-react"; // or from "react-feather"
import {
  Building,
  Briefcase,
  BuildingFill,
  CardText,
  Book,
} from "react-bootstrap-icons";
import "./SideBar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [adminCollapsed, setAdminCollapsed] = useState(false);
  const [mastersCollapsed, setMastersCollapsed] = useState(false);
  const [accountCollapsed, setAccountCollapsed] = useState(false);
  const [TransactionsCollapsed, setTransactionsCollapsed] = useState(false);
  const [purchaseCollapsed, setPurchaseCollapsed] = useState(false);
  const [salesCollapsed, setSalesCollapsed] = useState(false);
  const [unplannedCollapsed, setUnplannedCollapsed] = useState(false);
  const [reportCollapsed, setReportCollapsed] = useState(false);
  const [ESSCollapsed, setESSCollapsed] = useState(false);
  const [MastersCollapsed, setmastersCollapsed] = useState(false);
  const [CRMCollapsed, setCRMCollapsed] = useState(false);
  const [PMSTransactions, setPMSTransactions] = useState(false);
  const [payslipCollapsed, setpayslipCollapsed] = useState(false);
  const [CRM, setCRM] = useState(false);



  const [selectedLink, setSelectedLink] = useState(false);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleESSCollapse = () => {
    setESSCollapsed(!ESSCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setCRMCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
    
  };

  const togglePMSTransactions = () => {
    setPMSTransactions(!PMSTransactions);
    setmastersCollapsed(true);
    setESSCollapsed(false);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setCRMCollapsed(false);
  };

  const toggleMastertsCollapse = () => {
    setmastersCollapsed(!MastersCollapsed);
    setESSCollapsed(false);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const toggleAdminCollapse = () => {
    setESSCollapsed(false);
    setAdminCollapsed(!adminCollapsed);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const toggleMastersCollapse = () => {
    setESSCollapsed(false);
    setMastersCollapsed(!mastersCollapsed);
    setAdminCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const toggleAccountCollapse = () => {
    setESSCollapsed(false);
    setAccountCollapsed(!accountCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const toggleTransactionsCollapse = () => {
    setESSCollapsed(false);
    setTransactionsCollapsed(!TransactionsCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setPurchaseCollapsed(true);
    setSalesCollapsed(true);
    setUnplannedCollapsed(true);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const togglePurchaseCollapse = () => {
    setESSCollapsed(false);
    setPurchaseCollapsed(!purchaseCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const toggleSalesCollapse = () => {
    setESSCollapsed(false);
    setSalesCollapsed(!salesCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setUnplannedCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const toggleUnplannedCollapse = () => {
    setESSCollapsed(false);
    setUnplannedCollapsed(!unplannedCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setReportCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const toggleReportCollapse = () => {
    setESSCollapsed(false);
    setReportCollapsed(!reportCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

  const togglePayslipCollapse = () => {
    // setESSCollapsed(false);
    setpayslipCollapsed(!payslipCollapsed);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setPMSTransactions(false);
setCRMCollapsed(false);  };

   const toggleCRM = () => {
    setESSCollapsed(false);
    setpayslipCollapsed(false);
    setAdminCollapsed(false);
    setMastersCollapsed(false);
    setAccountCollapsed(false);
    setTransactionsCollapsed(false);
    setPurchaseCollapsed(false);
    setSalesCollapsed(false);
    setUnplannedCollapsed(false);
    setPMSTransactions(false);
    setCRMCollapsed(!CRMCollapsed);
  };



  const handleLinkClick = (linkName) => {
    setSelectedLink(linkName);
    sessionStorage.setItem("selectedPage", linkName);
  };

  // Fetch permissions from session storage
  const permissionsJSON = sessionStorage.getItem("permissions");
  const permissions = permissionsJSON ? JSON.parse(permissionsJSON) : [];
  const screenType = Array.isArray(permissions)
    ? permissions.map((permission) =>
      permission.screen_type.replace(/\s+/g, "")
    )
    : [];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-menu mt-2" id="">
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          {collapsed ? <BsChevronDown /> : <BsChevronRight />}
        </div>
    
        <div className="menu-item mt-5" onClick={toggleAdminCollapse} title="Admin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-person-vcard me-2 Admin-font"
            viewBox="0 0 16 16"
          >
            <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
          </svg>
          <span className={collapsed ? "hidden" : ""}>Admin</span>
          <div class="admin-arrow" >
            {adminCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>
        <div className={`collapse ${adminCollapsed ? "show" : "hide"}`} >
          <div className=" ms-3">
            {screenType.includes("Company") && (
              <Link to="/Company" className="nav-link"
                title="Company">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-buildings me-3"
                    viewBox="0 0 16 16"

                  >
                    <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                    <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="" >
                    {" "}
                    Company{" "}
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("CompanyMapping") && (
              <Link to="/CompanyMapping" className="nav-link" title="Company Mapping">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-clipboard-pulse me-3"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1H3a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3.5a1 1 0 0 0-1-1h-1v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2m6.979 3.856a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.895-.133L4.232 10H3.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .416-.223l1.41-2.115 1.195 3.982a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h1.5a.5.5 0 0 0 0-1h-1.128z"
                    />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    {" "}
                    Company Mapping{" "}
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("Location") && (
              <Link to="/Location" className="nav-link" title="Location">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-geo-alt me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="ms-1">
                    {" "}
                    Location
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("Role") && (
              <Link to="/Role" className="nav-link" title="Role">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person-circle me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path
                      fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    {" "}
                    Role
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("UserRoleMapping") && (
              <Link to="/UserRoleMapping" className="nav-link" title="Role Mapping">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person-fill-check me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Role Mapping
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("UserRights") && (
              <Link to="/UserRights" className="nav-link" title="Role Rights">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person-fill-gear me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Role Rights
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className=" ms-3">
            {screenType.includes("User") && (
              <Link to="/User" className="nav-link" title="User">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-people-fill me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    User
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* Add other admin links here */}
        </div>
        <div className="menu-item" onClick={toggleMastersCollapse} title="Masters">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-lightning-fill me-2 masters-font"
            viewBox="0 0 16 16"
          >
            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z" />
          </svg>
          <span className={collapsed ? "hidden" : ""}>Masters</span>
          <div class="master-arrow">
            {mastersCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>
        <div className={`collapse ${mastersCollapsed ? "show" : ""}`}>
          <div className="ms-3">
            {screenType.includes("Attribute") && (
              <Link to="/Attribute" className="nav-link" title="Attribute">
                <div class="menu-item">
                  <CardText size={18} className="me-3 " />
                  <span className={collapsed ? "hidden" : ""} class="">
                    {" "}
                    Attribute
                  </span>
                </div>
              </Link>
            )}
          </div>


          {/*} <div className=" ms-3">
            {screenType.includes("EmployeeInfo") && (
              <Link to="/EmployeeInfo" className="nav-link" title="Employee Info">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="me-3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zM12 14c3.87 0 7 1.28 7 3v1H5v-1c0-1.72 3.13-3 7-3z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>
                    {" "}
                    Employee Info
                  </span>
                </div>
              </Link>
            )}
          </div> */}

        </div>
 
        <div className={`collapse ${ESSCollapsed ? "show" : ""}`}>

          <div className="menu-item" onClick={toggleESSCollapse} title="ESS Master">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-clipboard-data me-2 Report-font"
              viewBox="0 0 16 16"
            >
              <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
            </svg>
            <span className={collapsed ? "hidden" : ""}>ESS Master</span>
            <div class="ESS-arrow">
              {ESSCollapsed ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>
          <div className={`collapse ${ESSCollapsed ? "show" : ""}`}>

          <div className="ms-3">
            {screenType.includes("EmpLeave") && (
              <Link to="/EmpLeave" className="nav-link" title="Leave">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-person-walking me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z" />
                    <path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    Leave
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("EmployeeLoan") && (
              <Link to="/EmployeeLoan" className="nav-link" title="Loan">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-cash-coin me-3"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
                    />
                    <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z" />
                    <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z" />
                    <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    Loan
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("Announce") && (
              <Link to="/Announce" className="nav-link" title="Announcement">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-megaphone-fill me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""} class="">
                    Announcement
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("HoliDays") && (
              <Link to="/HoliDays" className="nav-link" title="HoliDays">
                <div className="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-calendar-check-fill me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 .5a.5.5 0 0 1 .5.5V2h6V1a.5.5 0 0 1 1 0v1h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2V1a.5.5 0 0 1 .5-.5zM2 6v8h12V6H2zm9.854 2.854a.5.5 0 0 0-.708-.708L8 11.293 6.854 10.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l4-4z" />
                  </svg>
                  <span className={collapsed ? "hidden" : ""}>Employee Holiday</span>
                </div>
              </Link>
            )}
          </div>
          <div className="ms-3">
            {screenType.includes("WeekOff") && (
              <Link to="/WeekOff" className="nav-link" title="WeekOff">
                <div className="menu-item">
                 <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor"
  className="bi bi-calendar-weekend-fill me-3"
  viewBox="0 0 16 16"
>
  <path d="M4 .5a.5.5 0 0 1 .5.5V2h6V1a.5.5 0 0 1 1 0v1h2a1 1 0 0 1 1 1v2H1V3a1 1 0 0 1 1-1h2V1a.5.5 0 0 1 .5-.5zM1 6h14v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6zm3 1v5h2V7H4zm5 0v5h2V7H9z"/>
</svg>

                  <span className={collapsed ? "hidden" : ""}>Setting Screen </span>
                </div>
              </Link>
            )}
          </div>
          </div>
       <div className="menu-item-container">
  <Link to="/PayslipSalaryDays" className="nav-link" title="Payslip Master">
    <div className="menu-item" onClick={togglePayslipCollapse}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="bi bi-receipt-dollar me-2 Report-font"
        viewBox="0 0 16 16"
      >
        <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H2.5a.5.5 0 0 1-.5-.5V1.5zM3 2v12h10V2H3z" />
        <path d="M5 3.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-9zM6 4v2h4V4H6zm0 3v1h4V7H6zm0 2v2h4v-2H6z" />
        <path d="M8.5 12.5c.83 0 1.5-.672 1.5-1.5s-.67-1.5-1.5-1.5S7 10.17 7 11s.67 1.5 1.5 1.5z" />
      </svg>

      <span className={collapsed ? "hidden" : ""}>Payslip Master</span>
    </div>
  </Link>
</div>
          <div className={`collapse ${payslipCollapsed ? "show" : ""}`}>
          

            {/* <div className="ms-3">
            {screenType.includes("FinancialYear") && (
              <Link to="/FinancialYear" className="nav-link" title="FinancialYear">
                <div class="menu-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-receipt me-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z" />
                    {/* <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" /> */}
            {/* </svg>
                  <span className={collapsed ? "hidden" : ""} class=" ">
                  Eligibility salary days
                  </span>
                </div>
              </Link>
            )}
          </div> */}
          </div>
        </div>

        <div className="menu-item" onClick={toggleCRM} title="CRM">
         <UserCog size={20} className="me-2 CRMFont" />

          <span className={collapsed ? "hidden" : ""}>CRM </span>
          <div className="CRM-arrow ">
            {CRMCollapsed ? <BsChevronDown /> : <BsChevronRight />}
          </div>
        </div>
        <div className={`collapse ${CRMCollapsed ? "show" : ""}`}>
          <div className="menu-item ms-3 mt-1">
            {screenType.includes("Crmworkspace") && (
              <Link to="/Crmworkspace" className="nav-link" title="CRM Workspace">
                <div class="">
                  <ShoppingCart size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}>CRM Workspace</span>
                </div>
              </Link>
            )}
          </div>
          <div className="menu-item ms-3 mt-1">
            {screenType.includes("Forcast") && (
              <Link to="/Forcast" className="nav-link" title="Warehouse">
                <div class="">
                  <ClipboardList size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}> Reports </span>
                </div>
              </Link>
            )}
          </div>
            <div className="menu-item ms-3 mt-1">
            {screenType.includes("CRMSalesActivity") && (
              <Link to="/CRMSalesActivity" className="nav-link" title="CRMSalesActivity">
                <div class="">
                  <ClipboardList size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}> Activity </span>
                </div>
              </Link>
            )}
          </div>
          <div className="menu-item ms-3 mt-1">
            {screenType.includes("Teams") && (
              <Link to="/Teams" className="nav-link" title="Teams">
                <div class="">
                  <ClipboardList size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}> Teams </span>
                </div>
              </Link>
            )}
          </div>
           <div className="menu-item ms-3 mt-1">
            {screenType.includes("Campaign") && (
              <Link to="/CustomerSearch" className="nav-link" title="Campaign">
                <div class="">
                  <ClipboardList size={18} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}> Customer </span>
                </div>
              </Link>
            )}
          </div>
         
         


          <div className="menu-item" onClick={toggleCRM} title="Reports">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-database-gear me-2 Report-font"
              viewBox="0 0 16 16"
            >
              <path d="M4 3c0-1.105 2.239-2 4-2s4 .895 4 2-2.239 2-4 2-4-.895-4-2z" />
              <path d="M2 3v2c0 1.105 2.239 2 4 2s4-.895 4-2V3H2z" />
              <path d="M2 7v2c0 1.105 2.239 2 4 2s4-.895 4-2V7H2z" />
              <path d="M2 11v2c0 1.105 2.239 2 4 2s4-.895 4-2v-2H2z" />
              <path d="M13.635 9.04a3 3 0 0 1 0 5.92M12.5 14h1.5m-1.5-1.5h1.5m-1.5-1.5h1.5" />
            </svg> */}

            <span className={collapsed ? "hidden" : ""}>Configuration </span>
            <div className="CRM-arrow ms-5 ps-5">
              {CRMCollapsed ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>
          <div className="menu-item ms-3 mt-1">
            {screenType.includes("CRMSettings") && (
              <Link to="/CRMSettings" className="nav-link" title="Warehouse">
                <div class="">
                  <Wrench size={20} className="me-3" />
                  <span className={collapsed ? "hidden" : ""}> Settings </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="sidebar-footer position-fixed text-center bg-dark pt-2 fw-bold pb-1" style={{paddingRight:"85px",paddingLeft:"70px"}}>
        <h3 className="">YJK Technologies</h3>
        <h3 className="">Version 1.0.0</h3>
      </div>
    </div>
  );
};

export default Sidebar;
