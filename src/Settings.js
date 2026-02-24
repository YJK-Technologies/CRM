import React, { useState,useEffect} from 'react';
import { ThemeProvider } from './ThemeContext';
import AppContent from './App_content';
import ForgotPopup from "./Forgotpopup";
import Select from 'react-select';
import { Cursor } from 'react-bootstrap-icons';

const config = require('./Apiconfig');

const SettingsPage = () => {
    // Example state for settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('en');
    const [open, setOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [perioddrop, setPerioddrop] = useState([]);
    const [selectedPurchasePeriod, setSelectedPurchasePeriod] = useState('');
    const [purchasePeriod, setPurchasePeriod] = useState("");
    const [selectedSalesPeriod, setSelectedSalesPeriod] = useState('');
    const [salesPeriod, setSalesPeriod] = useState("");
    const [salesCustomDateRange, setSalesCustomDateRange] = useState({ from: '', to: '' });
    const [selectedOption,setSelectedOption] = useState('')

   
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDateRange`)
      .then((data) => data.json())
      .then((val) => {
        setPerioddrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].Sno,
            label: val[0].DateRangeDescription,
          };
          setSelectedPurchasePeriod(firstOption);
          setSelectedSalesPeriod(firstOption);
          setPurchasePeriod(firstOption.value);
          setSalesPeriod(firstOption.value);
        }
      });
  }, []);

  const handleSalesCustomDateChange = (e) => {
    const { name, value } = e.target;
    setSalesCustomDateRange((prevRange) => ({
      ...prevRange,
      [name]: value
    }));
  };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value);
    };

    const handleLanguage = (e) => {
      setLanguage(e.target.value);
  };

    const filteredOptionPeriod = perioddrop.map((option) => ({
        value: option.Sno,
        label: option.DateRangeDescription,
      }));
      const options = [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' }
      ];
      
    return (
<div className="container-fluid Topnav-screen">
  <div align="right">
    <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">
          <h1 className="purbut">Settings</h1>
        </div>
        <div className="d-flex justify-content-end me-5 purbut">
        <button className="btn btn-success mt-2 mb-2  purbut"  style={{ cursor: "pointer" }} title="Save settings">
            Save
          </button>
          <button className="btn btn-primary mt-2 mb-2  purbut" onClick={handleOpen} style={{ cursor: "pointer" }} title="reset password">
             Reset password
          </button>
        </div>
      </div>

      
      <div className="mobileview">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className=""> Settings</h1>
          </div>
          <div className="d-flex justify-content-end ms-0">
            <div className="dropdown mt-2 me-5 ms-3" style={{ paddingLeft: 0 }}>
              <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa-solid fa-list"></i>
              </button>
              <ul className="dropdown-menu">
                <icon className="icon text-dark text-center fs-1" onClick={handleOpen} title="reset password">
                  <i className="fa-solid fa-lock-open"></i>
                </icon>
                <icon className="icon text-success text-center fs-1"  title="save">
                <i class="fa-solid fa-floppy-disk"></i>
                </icon>
              </ul>
            </div>
            <ForgotPopup open={open} handleClose={handleClose} />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
    <div className="row mt-4 p-2 ms-4">
   
      <div className="col-12 col-md-2 mb-3 me-5 mt-4"> <label className="fw-bold fs-5">General: </label><br></br>
       <label htmlFor="language" className="form-label me-2 mt-1">Language:</label>
        <Select
          className="exp-input-field"
          options={options}
          value={selectedOption}
          onChange={setSelectedOption}
        />
      </div>

      <div className="col-md-4 mt-4">
        <label className="fw-bold fs-5">Dashboard Settings: </label>

        <div className="row">
          <div className="col-12 col-md-8 mb-3">
            <label htmlFor="total-sales" className="form-label me-2">Total Sales:</label>
            <Select
              id="total-sales"
              value={selectedPurchasePeriod}
              onChange={handleSalesCustomDateChange}
              options={filteredOptionPeriod}
              className="exp-input-field"
              placeholder=""
            />
          </div>

          <div className="col-12 col-md-8 mb-3">
            <label htmlFor="total-purchase" className="form-label me-2">Total Purchase:</label>
            <Select
              id="total-purchase"
              value={selectedPurchasePeriod}
              onChange={handleSalesCustomDateChange}
              options={filteredOptionPeriod}
              className="exp-input-field"
              placeholder=""
            />
          </div>

          <div className="col-12 col-md-8 mb-3">
            <label htmlFor="total-items" className="form-label me-2">Total Items:</label>
            <Select
              id="total-items"
              value={selectedPurchasePeriod}
              onChange={handleSalesCustomDateChange}
              options={filteredOptionPeriod}
              className="exp-input-field"
              placeholder=""
            />
          </div>

          <div className="col-12 col-md-8 mb-3">
            <label htmlFor="total-stock-values" className="form-label me-2">Total Stock Values:</label>
            <Select
              id="total-stock-values"
              value={selectedPurchasePeriod}
              onChange={handleSalesCustomDateChange}
              options={filteredOptionPeriod}
              className="exp-input-field"
              placeholder=""
            />
          </div>

          
        </div>

      </div>
      <div className='col-md-4 mt-4'>
      <div  className="col-md-10">
      <div className="col-12 col-md-6">
        <label htmlFor="theme" className="fw-bold fs-5">Theme:</label>
       <div className='mt-4'> 
       <ThemeProvider>
          <AppContent />
        </ThemeProvider></div>
      </div></div>
    </div>

    </div>


   
  </div>
</div>

    );
};

export default SettingsPage;
