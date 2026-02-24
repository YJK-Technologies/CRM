 import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
//import Login from "./Login.js";
//import Register from "./registration.js";
import Home from './Home.js';
import Login from "./Login.js";
import Signup from "./signup.js";
import App from "./Theapp.js";
import { useState,useEffect } from "react";
import Input from "./Input.js";
import Grid from "./Grid.js";
import Topbar from "./Topbar2.js";
import SideBar from "./SideBar.js";
import UserGrid from "./user_Grid.js";
import UserInput from "./UserInput.js";
import WareHouseInput from "./WareHouseInput.js";
import RoleInfoGrid from "./RoleInfoGrid.js";
import Role_input from "./RoleInfo_Input.js";
import AttriDetGrid from "./AttriDetGrid.js";
import AttriHdrInput from "./AttriHdrInput.js";
import AttriDetInput from "./AttriDetInput.js";
import TaxHdrInput from "./TaxHdrInput.js";
import TaxDetInput from "./TaxDetInput.js";
import VenHdrInput from "./VenHdrInput.js";
import VenDetInput from "./VenDetInput.js";
import CompanyMappingGrid from "./CompanyMappingGrid.js";
import UserComMap_input from "./CompanyMappingInput.js";
import UserRoleMapGrid from "./UserRoleMapGrid.js";
import UserRoleInput from "./UserRoleMapInput.js";
import LocInfoGrid from "./LocationInfoGrid.js";
import LocInfoInput from "./LocationInput.js";
import PurchaseAnalysis from "./PurchaseAnalysis.js";
import SalesReturn from "./SalesReturn.js";
import Template from "./Template.js";
import SaleTrans from './SalesAnalysis.js';
import SalesPrint from './SalesTemplate.js'
import VariantTab from './ItemDashboard/Variant.js';
import ProductTab from './ItemDashboard/Products.js';
import UnitTab from './ItemDashboard/Unit.js';
import Chart from './ItemDashboard/Charts/Charts.js';
import Settings from './Settings.js';
import UnitChart from './ItemDashboard/Charts/UnitChart.js';
import ProChart from './ItemDashboard/Charts/ProChart.js';
import VarChart from './ItemDashboard/Charts/VarChart.js';
import Purdash from './PurchaseDashboard/PurchaseAnalysis.js';
import PurchaseReturnPrint from "./PurchaseReturnTemplate.js";
import AccountInformation from "./AccountInformation.js";
import UserScreenMapGrid from "./userscreenmapgrid.js";
import UserScreenInput from "./userscreeninput.js"; 
import CustomerHdrInput from "./Customerhdrinput.js"; 
import CustomerDetInput from "./customerdetinput.js";
import OpeningbalanceGrid from "./OpeningbalanceGrid.js";
import OpeningbalanceInput from "./Openingbalanceinput.js";
import AdjustmentInput from "./Adjustmentinput.js";
import StocktransferInput from "./stocktransferinput.js";
import SalesReturnPrint from "./SalesReturnTemplate.js";
import JournalInput from "./journalinput.js";
import PurChart from './PurchaseDashboard/PurChart.js';
import NotFound from './NotFound.js'
import PurchaseDeleteDetails from "./PurchaseDeleteDetails.js";
import DeletedSales from "./DeletedSales.js";
import TStock from './TotalStockDashboard/TStockScreen.js'
import StockTransferTemplate from "./StockTransferTemplate.js";
import AddBaseAcc from "./AddBaseAccount.js";
import UserAccGrpGrid from "./UserAccGrpgrid.js";
import UserAccInput from "./UserAccGrpInput.js";
import AccNameInput from "./AccountNameInput.js";
import Cstock from "./CurrentStockScreen.js";
import TaxInvoiceTemplate1 from "./PrintScreens/Template1/InvoicePrint.js";
import TaxInvoiceTemplate2 from "./PrintScreens/Template2/TaxInvoicePrint.js";
import QuotationTemplate1 from "./PrintScreens/Template1/QuotePrint.js";
import QuotationTemplate2 from "./PrintScreens/Template2/QuotationPrint.js";
import DeliveryChallanTemplate1 from "./PrintScreens/Template1/DeliveryChallanPrint.js";
import DeliveryChallanTemplate2 from "./PrintScreens/Template2/DcPrint.js";
import PurchaseOrderTemplate1 from "./PrintScreens/Template1/PurchaseOrderPrint.js";
import PurchaseOrderTemplate2 from "./PrintScreens/Template2/POPrint.js";
import ProductDetail from "./AddProductDetails.js";
import ProductHdr from "./AddProducthdr.js";
import InvReceiptPrint from "./InventoryPrintTemplates/InvReceiptPrint.js";
import InvReturnPrint from "./InventoryPrintTemplates/InvReturnPrint.js";
import InvIssuedPrint from "./InventoryPrintTemplates/InvIssuedPrint.js";
import Employee from "./Employeegrid.js";
import EmployeeInput from "./Employeeinput.js";
import AdjustmnetPrint from "./InventoryPrintTemplates/AdjustmnetPrint.js";
import ObPrint from "./InventoryPrintTemplates/ObPrint.js";
import JournalPrint from "./InventoryPrintTemplates/JournalTemplate.js";
import CompanyDetails from './ESSComponents/CompanyDetails.js'
import FinanceDet from './ESSComponents/FinanceDet.js'
import BankAccDet from './ESSComponents/BankAccDet.js'
import AcademicDet from './ESSComponents/AcademicDet.js'
import IdentDoc from './ESSComponents/IdentDoc.js'
import Insur from './ESSComponents/Insurance.js'
import Documents from './ESSComponents/Document.js'
import ESSLoan from './ESSComponents/EmpLoan.js'
import EmpLeave from './ESSComponents/EmpLeave.js'
import DailyAtt from './ESSComponents/DailyAttendance.js'
import Announce from './ESSComponents/Announcement.js'
import EmpLoan from './ESSComponents/EmpLoan.js'
// import Products from "./PrintTemplates/Productprint.js";
import LeaveReq from './ESSDashboard/LeaveRequest.js'
// import DCPrint from "./PrintScreens/DcPrint.js";
// import DCSM from "./PrintTemplates/DCSm/PO.js";
import PerformaInvoiceTemplate1 from './PrintScreens/Template1/ProformaPrint.js';
import PerformaInvoiceTemplate2 from './PrintScreens/Template2/PerformaInvoicePrint.js';
import EmployeeBonus from './ESSComponents/EmployeeBonus.js';
import EmployeeOtherAllowance from './ESSComponents/Employee_other_Allowance.js'
import EmpLoanType from './ESSComponents/EmployeeLoanType.js'
import EmpPFCompany from './ESSComponents/EmployeePFCompany.js'
import EmpProfessionalTax from './ESSComponents/EmpProfessionalTax.js'
import ManagerLeave from './ESSComponents/ManagerLeave.js';
import EmpTDS from './ESSComponents/EmpTDS.js'
import Salessettings from "./SalesSettings.js";
import PurchaseSetting from "./PurchaseSetting.js";
import POsettings from "./POsettings.js";
import EmployeeTask from './TaskMasters/TaskInspector.js';
import InvoiceSettings from "./InvoiceSetting.js";
import EmpProjectinput from './TaskMasters/EmpProjectinput.js';
import DailyTaskInput from './TaskMasters/DailyTaskInput.js';
import HoliDays from "./ESSComponents/Holiday.js";
import FinancialYear from "./ESSComponents/FinancialYear.js";
import PayslipReport from "./PayslipReport.js"
import AddFinancialYearAccess from './AddFInancialYearAccess.js'
import PayslipDash from './PayslipReports.js'
import { ToastContainer } from "react-toastify";
import Crmworkspace from './CRMcomponents/Sales/CRMBoard.js'
import Crmlistpage from "./CRMcomponents/Sales/CRMList.js";
import CrmChart from "./CRMcomponents/Sales/CRMChart.js";
import CrmScheduler from "./CRMcomponents/Sales/CRMSchedule.js";
import CrmActivity from "./CRMcomponents/Sales/CRMActivity.js";
import CrmLocation from "./CRMcomponents/Sales/CRMLocation.js";
import Forcast from "./CRMcomponents/Reports/Forecast.js";
import RChart from "./CRMcomponents/Reports/CRMChart.js";
import Rpivot from "./CRMcomponents/Reports/Pivot.js";
import CRMSettings from "./CRMcomponents/Configurations/Settings.js";
import CRMSalesTeam from './CRMcomponents/Configurations/SalesTeam.js'
import WeekOff from "./WeekOff.js";
import EditCRMCard from "./CRMcomponents/Sales/EditCardscreen.js";
import Typesofcontacts from "./CRMcomponents/Sales/TypesofContacts.js";
import LeadsOfAll from './CRMcomponents/Lead.js'
import Pipeline from './CRMcomponents/Sales/pipeline.js'
import Campaign from './CRMcomponents/Campaign.js';
import CampaignHelp from "./CRMcomponents/CampaignHelp.js";
import SalesTeam from './CRMcomponents/Sales/Sales_Team.js';
import Theams from "./CRMcomponents/Theams.js";
import SalesTeams from "./CRMcomponents/Sales/SalesTeams.js";
import SalesTeamHelp from './CRMcomponents/Sales/SalesTeamHelp.js';
import CustomerSearch from './CRMcomponents/Sales/CustomerSearch.js';
import Teams from './CRMcomponents/Sales/Teams.js';
import CRMSalesActivity from "./CRMcomponents/Sales/CrmSalesActivity.js";
import Tags from "./CRMcomponents/Sales/Tags.js";
import TagsHelp from "./CRMcomponents/Sales/TagsHelp.js";
import ActivityAnalysis from "./CRMcomponents/Sales/ActivityAnalysis.js";
import PipelineAnalysis from "./CRMcomponents/Sales/PipelineAnalysis.js";
import LeadsAnalysis from "./CRMcomponents/Sales/LeadsAnalysis.js";

function Main() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [screenTypes, setScreenTypes] = useState(
    JSON.parse(sessionStorage.getItem("screenTypes")) || []
  );

  useEffect(() => {
    const loadPermissions = () => {
      const permissionsJSON = sessionStorage.getItem("permissions");
      if (permissionsJSON) {
        const permissions = JSON.parse(permissionsJSON);
        const screens = permissions.map((permission) =>
          permission.screen_type.replace(/\s+/g, "")
        );
        setScreenTypes(screens);
        sessionStorage.setItem("screenTypes", JSON.stringify(screens));
      }
    };

    loadPermissions();

    window.addEventListener("permissionsUpdated", loadPermissions);
    return () => window.removeEventListener("permissionsUpdated", loadPermissions);
  }, []);

// console.log('Screen Types:', screenTypes);
  
  // const screenTypes = Object.keys(permissions);

  // create by pavun on 7 may 2024 use: To block the view page source  brgin
  // useEffect(()=>{
  //   document.addEventListener("contextmenu",handlecontextmenu)
  //   return()=>{
  //     document.removeEventListener("contextmenu",handlecontextmenu)
  //   }
  // },[])

  // const handlecontextmenu=(e)=>{
  //   e.preventDefault()
  //   // alert("right click is disable")
  // }
  // create by pavun on 7 may 2024 use: To block the view page source  End

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const routes = [
    { path: "/", component: <Home /> },
    { path: "/Login", component: <Login /> },
    { path: "/signup", component: <Signup /> },
    { path: "/PurchasePrint", component: <Template /> },
    { path: "/SalesPrint", component: <SalesPrint /> },
    { path: "/PurchaseReturnPrint", component: <PurchaseReturnPrint /> },
    { path: "/SalesReturnPrint", component: <SalesReturnPrint /> },
    { path: "/PurchaseChart", component: <PurChart /> },
    { path: "/PurchaseAnalysis", component: <Purdash /> },
    { path: "/UnitDataChart", component: <UnitChart /> },
    { path: "/VarientDataChart", component: <VarChart /> },
    { path: "/ItemDataChart", component: <ProChart /> },
    { path: "/SalesChart", component: <Chart /> },
    { path: "/Settings", component: <Settings /> },
    { path: "/UnitData", component: <UnitTab /> },
    { path: "/VarientData", component: <VariantTab /> },
    { path: "/ItemData", component: <ProductTab /> },
    { path: "/AddCompany", component: <Input /> },
    { path: "/SalesAnalysis", component: <SaleTrans /> },
    { path: "/Company", component: <Grid /> },
    { path: "/AddUser", component: <UserInput /> },
    { path: "/User", component: <UserGrid /> },
    { path: "/AddWarehouse", component: <WareHouseInput /> },
    { path: "/Role", component: <RoleInfoGrid /> },
    { path: "/AddRole", component: <Role_input /> },
    { path: "/Attribute", component: <AttriDetGrid /> },
    { path: "/AddAttributeHeader", component: <AttriHdrInput /> },
    { path: "/AddAttributeDetail", component: <AttriDetInput /> },
    { path: "/AddTaxHeader", component: <TaxHdrInput /> },
    { path: "/AddTaxDetails", component: <TaxDetInput /> },
    { path: "/AddVendorHeader", component: <VenHdrInput /> },
    { path: "/AddVendorDetails", component: <VenDetInput /> },
    { path: "/CompanyMapping", component: <CompanyMappingGrid /> },
    { path: "/AddCompanyMapping", component: <UserComMap_input /> },
    { path: "/UserRoleMapping", component: <UserRoleMapGrid /> },
    { path: "/AddUserRoleMapping", component: <UserRoleInput /> },
    { path: "/Location", component: <LocInfoGrid /> },
    { path: "/AddLocation", component: <LocInfoInput /> },
    { path: "/PurchaseAnalysis", component: <PurchaseAnalysis /> },
    { path: "/SalesReturn", component: <SalesReturn /> },
    { path: "/UserRights", component: <UserScreenMapGrid /> },
    { path: "/AccountInformation", component: <AccountInformation /> },
    { path: "/AddUserRights", component: <UserScreenInput /> },
    { path: "/AddCustomerHeader", component: <CustomerHdrInput /> },
    { path: "/AddCustomerDetails", component: <CustomerDetInput /> },
    { path: "/OpeningBalance", component: <OpeningbalanceGrid /> },
    { path: "/AddOpeningBalance", component: <OpeningbalanceInput /> },
    { path: "/AddAdjustment", component: <AdjustmentInput /> },
    { path: "/AddJournal", component: <JournalInput /> },
    { path: "/NotFound", component: <NotFound /> },
    { path: "/DeletePurchase", component: <PurchaseDeleteDetails /> },
    { path: "/DeletedSales", component: <DeletedSales /> },
    { path: "/TotalStock", component: <TStock /> },
    { path: "/StockTransferTemplat", component: <StockTransferTemplate /> },
    { path: "/AddBaseAccount", component: <AddBaseAcc /> },
    { path: "/UserAccountGroup", component: <UserAccGrpGrid /> },
    { path: "/AddUserAccGrp", component: <UserAccInput /> },
    { path: "/AddAccountName", component: <AccNameInput /> },
    { path: "/CurrentStock", component: <Cstock /> },
    // { path: "/TaxInvoicePrint", component: <TaxInvoicePrint /> },
    // { path: "/QuotationPrint", component: <QuotationPrint /> },
    // { path: "/DCPrint", component: <DeliveryChallanSM /> },
    // { path: "/PurchaseOrderPrint", component: <PurchaseOrderPrint /> },
    { path: "/AddProductDetail", component: <ProductDetail /> },
    { path: "/AddProductHdr", component: <ProductHdr /> },
    { path: "/InvReceiptPrint", component: <InvReceiptPrint/>},
    { path: "/InvReturnPrint", component: <InvReturnPrint/>},
    { path: "/InvIssuedPrint", component: <InvIssuedPrint/>},
    { path: "/EmployeeInfo", component: <Employee/>},
    { path: "/EmployeeInputInfo", component: <EmployeeInput/>},
    { path: "/AdjustmnetPrint", component: <AdjustmnetPrint/>},
    { path: "/ObPrint", component: <ObPrint/>},
    { path: "/JournalPrint", component: <JournalPrint/>},
    { path: "/CompanyDetails", component: <CompanyDetails/>},
    { path: "/FinanceDet", component: <FinanceDet/>},
    { path: "/BankAccDet", component: <BankAccDet/>},
    { path: "/AcademicDet", component: <AcademicDet/>},
    { path: "/IdentDoc", component: <IdentDoc/>},
    { path: "/Family", component: <Insur/>},
    { path: "/Documents", component: <Documents/>},
    { path: "/ESSLoan", component: <ESSLoan/>},
    { path: "/EmpLeave", component: <EmpLeave/>},
    { path: "/DailyAtt", component: <DailyAtt/>},
    { path: "/Announce", component: <Announce/>},
    { path: "/EmployeeLoan", component: <EmpLoan/>},
    // { path: "/ProductPrint", component: <Products/>},
    { path: "/LeaveReq", component: <LeaveReq/>},
    // { path: "/DCSM", component: <DCSM/>},
    // { path: "/PerformaInvoicePrint", component: <PerformaInvoicePrint/>},
     { path: "/PayslipEmpBonus", component: <EmployeeBonus/>},
     { path: "/EmpOtherAllowance", component: <EmployeeOtherAllowance/>},
     { path: "/PayslipEmpLoanType", component: <EmpLoanType/>},
     { path: "/PFContribution", component: <EmpPFCompany/>},
     { path: "/PayslipEmpProTax", component: <EmpProfessionalTax/>},
    //  { path: "/PayslipEmpLoanType", component: <EmpLoanType/>},
     { path: "/PayslipEmpTDS", component: <EmpTDS/>},
     { path: "/Salessettings", component: <Salessettings/>},
     { path: "/PurchaseSetting", component: <PurchaseSetting/>},
     { path: "/POsettings", component: <POsettings/>},
     { path: "/EmployeeTask", component: <EmployeeTask/>},
     { path: "/InvoiceSettings", component: <InvoiceSettings/>},
     { path: "/EmpProjectinput", component: <EmpProjectinput/>},
     { path: "/DailyTaskInput", component: <DailyTaskInput/>},
     { path: "/HoliDays", component: <HoliDays/>},
     { path: "/PayslipSalaryDays", component: <FinancialYear/>},
     { path: "/PayslipReport", component: <PayslipReport/>},
     { path: "/AddFYA", component: <AddFinancialYearAccess/>},
     { path: "/PayslipDash", component: <PayslipDash/>},
     { path: "/Crmworkspace", component: <Crmworkspace /> },
     { path: "/crmlistpage", component: <Crmlistpage /> },
     { path: "/CrmChart", component: <CrmChart /> },
     { path: "/CrmScheduler", component: <CrmScheduler /> },
     { path: "/CrmActivity", component: <CrmActivity /> },
     { path: "/CrmLocation", component: <CrmLocation /> },
     { path: "/Forcast", component: <Forcast /> },
     { path: "/RChart", component: <RChart /> },
     { path: "/Rpivot", component: <Rpivot /> },
     { path: "/CRMSettings", component: <CRMSettings /> },
     { path: "/CRMSalesTeam", component: <CRMSalesTeam /> },
     { path: "/WeekOff", component: <WeekOff /> },
     { path: "/editCRMCard", component: <EditCRMCard /> },
     { path: "/Typesofcontacts", component: <Typesofcontacts /> },
     { path: "/Leads", component: <LeadsOfAll /> },
     { path: "/pipeline", component: <Pipeline /> },
     { path: "/Campaign", component: <Campaign /> },
     { path: "/CampaignHelp", component: <CampaignHelp /> },
     { path: "/SalesTeam", component: <SalesTeam /> },
     { path: "/Theams", component: <Theams /> },
     { path: "/SalesTeams", component: <SalesTeams /> },
     { path: "/SalesTeamHelp", component: <SalesTeamHelp /> },
     { path: "/CustomerSearch", component: <CustomerSearch /> },
     { path: "/Teams", component: <Teams /> },
    { path: "/CRMSalesActivity", component: <CRMSalesActivity /> },
    { path: "/Tags", component: <Tags /> },
    { path: "/TagsHelp", component: <TagsHelp /> },
    { path: "/ActivityAnalysis", component: <ActivityAnalysis /> },
    { path: "/PipelineAnalysis", component: <PipelineAnalysis /> },
    { path: "/LeadsAnalysis", component: <LeadsAnalysis /> },




     

    

  ];
 
  return (
    <Router>
        <PathLogger />
        <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/TaxInvoiceTemplate1" element={<TaxInvoiceTemplate1 />} />
      <Route path="/TaxInvoiceTemplate2" element={<TaxInvoiceTemplate2 />} />
      <Route path="/ProformaInvoiceTemplate1" element={<PerformaInvoiceTemplate1 />} />
      <Route path="/ProformaInvoiceTemplate2" element={<PerformaInvoiceTemplate2 />} />
      <Route path="/QuotationTemplate1" element={<QuotationTemplate1 />} />
      <Route path="/QuotationTemplate2" element={<QuotationTemplate2 />} />
      <Route path="/PurchaseOrderTemplate1" element={<PurchaseOrderTemplate1 />} />
      <Route path="/PurchaseOrderTemplate2" element={<PurchaseOrderTemplate2 />} />
      <Route path="/DeliveryChallanTemplate1" element={<DeliveryChallanTemplate1 />} />
      <Route path="/DeliveryChallanTemplate2" element={<DeliveryChallanTemplate2 />} />

      <Route
        path="/AccountInformation"
        element={
          <div>
            <Topbar />
            <div className="layout-container ">
              <SideBar className="sidebar"/>
              <div className=" container-fluid ">
                <AccountInformation />
              </div>
            </div>
          </div>
        }
      />
      
      {routes.map(({ path, component }) =>
        screenTypes.includes(path.replace('/', '')) ? (
          path.includes('Print') ? (
            <Route
              key={path}
              path={path}
              element={
                <div className="px-4">{component}</div>
              }
            />
          ) : (
            <Route
              key={path}
              path={path}
              element={
                <div>
                  <Topbar />
                  <div className="layout-container">
                    <SideBar className="sidebar" />
                      <div className="container-fluid">{component}</div>
                  </div>
                </div>
              }
            />
          )
        ) : (
          <Route
            key={path}
            path={path}
            element={
              <div>
                <SideBar className="sidebar" />
                <Topbar />
                <div className="layout-container">
                  <div className="container-fluid ">
                    <NotFound />
                  </div>
                </div>
              </div>
            }
          />
        )
      )}
    </Routes>
  </Router>
  );
}

const PathLogger = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    sessionStorage.setItem('currentPath', currentPath);
  }, [location]); 

  return null; 
};

export default Main;
