import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./ThemeContext";
import AppContent from "./App_content";
import ForgotPopup from "./Forgotpopup";
import './usersettings.css';
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingsPage = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [companyDrop, setCompanyDrop] = useState([]);
  const [company, setCompany] = useState(null);
  const [companyValue, setCompanyValue] = useState("");

  const [screenDrop, setScreenDrop] = useState([]);
  const [screen, setScreen] = useState(null);
  const [screenValue, setScreenValue] = useState("");

  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [errors, setErrors] = useState(false);

  const config = require("./Apiconfig");

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getScreens`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });
        const data = await response.json();
        setScreenDrop(data);
      } catch (error) {
        console.error("Error fetching screen options:", error);
      }
    };
    fetchScreens();
  }, []);

  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const userCode = sessionStorage.getItem("selectedUserCode");

        const response = await fetch(`${config.apiBaseUrl}/getusercompany`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_code: userCode }),
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyDrop(data);
        } else {
          setCompanyDrop([]);
        }
      } catch (error) {
        console.error("Error fetching user company data:", error);
        setCompanyDrop([]);
      }
    };

    fetchUserCompanies();
  }, []);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getDefaultScreens`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role_id: sessionStorage.getItem("role_id"),
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await response.json();
        setScreenDrop(data);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchScreens();
  }, []);

  const filteredOptionCompany = Array.isArray(companyDrop)
    ? companyDrop.map((option) => ({
        value: option?.keyfiels,
        label: `${option?.company_no} - ${option?.company_name} - ${option?.location_no} - ${option?.location_name}`,
        company_no: option?.company_no,
        company_name: option?.company_name,
        location_no: option?.location_no,
        location_name: option?.location_name,
        keyfiels: option?.keyfiels,
      }))
    : [];

  const filteredOptionScreen = Array.isArray(screenDrop)
    ? screenDrop.map((option) => ({
        value: option.screen_type,
        label: option.screen_type,
      }))
    : [];

  const handleChangeCompany = (selected) => {
    setCompany(selected);
    setCompanyValue(selected ? selected.value : "");
  };

  const handleChangeScreen = (selected) => {
    setScreen(selected);
    setScreenValue(selected ? selected.value : "");
  };

  useEffect(() => {
    if (
      settingsLoaded ||
      filteredOptionCompany.length === 0 ||
      filteredOptionScreen.length === 0
    ) {
      return;
    }

    const fetchUserSettings = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getUserSettings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
            User_Code: sessionStorage.getItem("selectedUserCode"),
          }),
        });

        const data = await response.json();

        if (data.length > 0) {
          const settings = data[0];

          const selectedComp = filteredOptionCompany.find(
            x => x.value === settings.DefaultCompanyId
          );

          if (selectedComp) {
            setCompany(selectedComp);
            setCompanyValue(selectedComp.value);
          }

          const selectedScr = filteredOptionScreen.find(
            x => x.value === settings.DefaultScreenId
          );

          if (selectedScr) {
            setScreen(selectedScr);
            setScreenValue(selectedScr.value);
          }
        }

        setSettingsLoaded(true);

      } catch (err) {
        console.log(err);
      }
    };

    fetchUserSettings();

  }, [filteredOptionCompany, filteredOptionScreen, settingsLoaded]);

  const handleSave = async () => {
    if (!companyValue || !screenValue) {
      toast.warning("Please select required fields");
      setErrors(true);
      return;
    }

    setLoading(true);
    setErrors(false);

    try {
      const payload = {
        User_Code: sessionStorage.getItem("selectedUserCode"),
        Status: "Active",
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Location_Code: sessionStorage.getItem("selectedLocationCode"),
        DefaultCompanyId: companyValue,
        DefaultScreenId: screenValue,
        role_id: sessionStorage.getItem("role_id"),
        created_by: sessionStorage.getItem("selectedUserCode"),
      };

      const response = await fetch(
        `${config.apiBaseUrl}/userSettingsInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "User Settings saved successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        toast.warning(result.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving User Settings:", error);
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid usrset-page-wrapper">
      <ToastContainer 
        position="top-right" 
        theme="colored"
        style={{ zIndex: 99999, top: "70px" }}
      />
      
      {/* Enterprise Level Header */}
      <header className="usrset-header mt-5">
        <div className="usrset-header-left ">
          <div className="usrset-header-icon-box">
            <i className="fa-solid fa-gear"></i>
          </div>
          <div className="usrset-header-text">
            <h1>User Settings</h1>
            <p>Manage your preferences and dashboard configurations</p>
          </div>
        </div>
        
        <div className="usrset-header-actions">
          <button className="usrset-btn-reset" title="Reset Password" onClick={() => setOpen(true)}>
            <i className="fa-solid fa-key"></i>
            <span>Reset Password</span>
          </button>
          <button className="usrset-btn-save" title="Save Changes" onClick={handleSave} disabled={loading}>
            <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-floppy-disk"}`}></i>
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </header>

      <main className="usrset-content">
        <div className="row g-3 mb-3">
          <div className="col-lg-6">
            <section className="usrset-card shadow-sm p-3">
              <div className="usrset-select-container">
                <label className="fw-bold mb-2">Select Default Company</label>
                <Select
                  value={company}
                  onChange={handleChangeCompany}
                  options={filteredOptionCompany}
                  classNamePrefix="usrset-select"
                  placeholder="Select Company"
                  isClearable
                />
              </div>
            </section>
          </div>

          <div className="col-lg-6">
            <section className="usrset-card shadow-sm p-3">
              <div className="usrset-select-container">
                <label className="fw-bold mb-2">Select Default Screen</label>
                <Select
                  value={screen}
                  onChange={handleChangeScreen}
                  options={filteredOptionScreen}
                  classNamePrefix="usrset-select"
                  placeholder="Select Screen"
                  isClearable
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <ForgotPopup open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default SettingsPage;