import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import './EmployeeLoan.css'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../apps.css'
import Select from 'react-select'

const config = require('../Apiconfig');

function Input({ }) {
  const [company_no, setCompany_no] = useState("");
  const [company_name, setCompany_name] = useState("");
  const [short_name, setShort_name] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [email_id, setEmail_id] = useState("");
  const [status, setStatus] = useState("");
  const [foundedDate, setFoundedDate] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [location_no, setlocation_no] = useState("");
  const [annualreportURL, setAnnualReportURL] = useState("");
  const [error, setError] = useState("");
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [locationnodrop, setLocationdrop] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setselectedState] = useState('');
  const [selectedCountry, setselectedCountry] = useState('');
  const [selectedStatus, setselectedStatus] = useState('');
  const [selectedLocation, setselectedLocation] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [EmployeeId, setEmployeeId] = useState("");
  const [open3, setOpen3] = React.useState(false);
  const navigate = useNavigate();
  const companycode = useRef(null);
  const companyname = useRef(null);
  const shortname = useRef(null);
  const Address1 = useRef(null);
  const Address2 = useRef(null);
  const Address3 = useRef(null);
  const City = useRef(null);
  const State = useRef(null);
  const Pincode = useRef(null);
  const Country = useRef(null);
  const Email = useRef(null);
  const Status = useRef(null);
  const WebsiteUrl = useRef(null);
  const ContactNo = useRef(null);
  const annaual = useRef(null);
  const locatioN = useRef(null);
  const logo = useRef(null);
  const found = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [companyImage, setCompanyImage] = useState("");
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const modified_by = sessionStorage.getItem("selectedUserCode");

  const clearInputFields = () => {
    setCompany_no("");
    setCompany_name("");
    setShort_name("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setSelectedCity(null);
    setselectedState(null);
    setselectedCountry(null);
    setselectedStatus(null);
    setselectedLocation(null);
    setPincode("");
    setEmail_id("");
    setFoundedDate("");
    setWebsiteURL("");
    setContact_no("");
    setAnnualReportURL("");
    setSelectedImage("")
  };

  console.log(selectedRow)

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setCompany_no(selectedRow.company_no || "");
      setCompany_name(selectedRow.company_name || "");
      setShort_name(selectedRow.short_name || "");
      setAddress1(selectedRow.address1 || "");
      setAddress2(selectedRow.address2 || "");
      setAddress3(selectedRow.address3 || "");
      setSelectedCity({
        label: selectedRow.city,
        value: selectedRow.city,
      });
      setselectedState({
        label: selectedRow.state,
        value: selectedRow.state,
      });
      setselectedCountry({
        label: selectedRow.country,
        value: selectedRow.country,
      });
      setselectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
      setselectedLocation({
        label: selectedRow.location_no,
        value: selectedRow.location_no,
      });
      setPincode(selectedRow.pincode || "");
      setEmail_id(selectedRow.email_id || "");
      setWebsiteURL(selectedRow.websiteURL || "");
      setContact_no(selectedRow.contact_no || "");
      setAnnualReportURL(selectedRow.annualReportURL || "");

      if (selectedRow.foundedDate) {
        const formattedDate = new Date(selectedRow.foundedDate).toISOString().split("T")[0];
        setFoundedDate(formattedDate);
      } else {
        setFoundedDate("");
      }

      if (selectedRow.company_logo && selectedRow.company_logo.data) {
        const base64Image = arrayBufferToBase64(selectedRow.company_logo.data);
        const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'company_logo.jpg');
        setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
        setCompanyImage(file)
      } else {
        setSelectedImage(null); // No image found, reset
      }

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


  const base64ToFile = (base64Data, fileName) => {
    if (!base64Data || !base64Data.startsWith("data:")) {
      throw new Error("Invalid base64 string");
    }

    const parts = base64Data.split(',');
    if (parts.length !== 2) {
      throw new Error("Base64 string is not properly formatted");
    }

    const mimePart = parts[0];
    const dataPart = parts[1];

    const mime = mimePart.match(/:(.*?);/);
    if (!mime || !mime[1]) {
      throw new Error("Could not extract MIME type");
    }

    const binaryString = atob(dataPart);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    const fileBlob = new Blob([uint8Array], { type: mime[1] });
    return new File([fileBlob], fileName, { type: mime[1] });
  };


  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size exceeds 1MB. Please upload a smaller file.',
          confirmButtonText: 'OK'
        });
        event.target.value = null;
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setCompanyImage(file);
    }
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/city`)
      .then((data) => data.json())
      .then((val) => setDrop(val));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/country`)
      .then((data) => data.json())
      .then((values) => setCondrop(values));
  }, []);
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/state`)
      .then((data) => data.json())
      .then((val) => setStatedrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((data) => data.json())
      .then((val) => setLocationdrop(val));
  }, []);

  const filteredOptionCity = drop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionState = statedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionLocation = locationnodrop.map((option) => ({
    value: option.location_no,
    label: `${option.location_no} - ${option.location_name}`,
  }));

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCity(selectedCity ? selectedCity.value : '');
    setError(false);
  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setState(selectedState ? selectedState.value : '');
    setError(false);
  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : '');
    setError(false);
  };

  const handleChangeStatus = (selectedStatus) => {
    setselectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
    setError(false);
  };

  const handleChangeLocation = (selectedLocation) => {
    setselectedLocation(selectedLocation);
    setlocation_no(selectedLocation ? selectedLocation.value : '');
    setError(false);
  };

  const handleInsert = async () => {
    if (
      !company_no ||
      !company_name ||
      !address1 ||
      !address2 ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !email_id ||
      !status ||
      !contact_no
    ) {
      setError(" ");
      return;
    }

    // Email validation
    if (!validateEmail(email_id)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("company_no", company_no);
      formData.append("company_name", company_name);
      formData.append("short_name", short_name);
      formData.append("address1", address1);
      formData.append("address2", address2);
      formData.append("address3", address3);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("country", country);
      formData.append("email_id", email_id);
      formData.append("status", status);
      formData.append("foundedDate", foundedDate);
      formData.append("contact_no", contact_no);
      formData.append("annualReportURL", annualreportURL);
      formData.append("websiteURL", websiteURL);
      formData.append("location_no", location_no);
      formData.append("created_by", sessionStorage.getItem('selectedUserCode'));

      if (companyImage) {
        formData.append("company_logo", companyImage); // Appending the image file
      }
      const response = await fetch(`${config.apiBaseUrl}/add`, {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(), // Reloads the page after the toast closes
          });
        }, 1000);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        //setError(errorResponse.error);
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        console.error("Failed to insert data");
        // Show generic error message using SweetAlert
        toast.error('Failed to insert data', {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      // Show error message using SweetAlert
      toast.error('Error inserting data: ' + error.message, {

      });
    }
  };
  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/Company");
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      if (hasValueChanged) {
        await handleKeyDownStatus(e);
        setHasValueChanged(false);
      }

      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !company_no ||
      !company_name ||
      !address1 ||
      !address2 ||
      !selectedCity ||
      !selectedState ||
      !pincode ||
      !selectedCountry ||
      !email_id ||
      !selectedStatus ||
      !contact_no
    ) {
      setError(" ");
      return;
    }

    if (!validateEmail(email_id)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("company_no", company_no);
      formData.append("company_name", company_name);
      formData.append("short_name", short_name);
      formData.append("address1", address1);
      formData.append("address2", address2);
      formData.append("address3", address3);
      formData.append("city", selectedCity.value);
      formData.append("state", selectedState.value);
      formData.append("pincode", pincode);
      formData.append("country", selectedCountry.value);
      formData.append("email_id", email_id);
      formData.append("status", selectedStatus.value);
      formData.append("foundedDate", foundedDate);
      formData.append("contact_no", contact_no);
      formData.append("annualReportURL", annualreportURL);
      formData.append("websiteURL", websiteURL);
      formData.append("location_no", selectedLocation.value);
      formData.append("modified_by", sessionStorage.getItem('selectedUserCode'));

      if (companyImage) {
        formData.append("company_logo", companyImage);
      }
      const response = await fetch(`${config.apiBaseUrl}/CompanyUpdate`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Data Updated successfully");
        setIsUpdated(true);
        clearInputFields();
        toast.success("Data Updated successfully!")
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to Update data");
        toast.error("Failed to Update data");

      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const NavigatecomDet = () => {
    navigate("/CompanyDetails");
  };


  const FinanceDet = () => {
    navigate("/FinanceDet");
  };
  const BankAccDet = () => {
    navigate("/BankAccDet");
  };
  const IdentDoc = () => {
    navigate("/IdentDoc");
  };

  const AcademicDet = () => {
    navigate("/AcademicDet");
  };

  const Documents = () => {
    navigate("/Documents");
  };

  const Insurance1 = () => {
    navigate("/Family");
  };

  const handlePaySlip = () => {
    setOpen3(true);
  };
  const reloadGridData = () => {
    window.location.reload();
  };
  const handleDelete = async () => {
    if (
      !EmployeeId) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const deatils = {
        EmployeeId: EmployeeId
      }

      const response = await fetch(`${config.apiBaseUrl}/deleteemployeedata`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deatils),
      });

      if (response.status === 200) {
        console.log("Data deleted successfully");
        setTimeout(() => {
          toast.success("Data deleted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {
        })
      }
    } catch (error) {
      console.error("Error delete data:", error);
      toast.error('Error delete data: ' + error.message, {
      });
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-light rounded">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">Employee Bonus</h1>
            </div>
          </div>
          <div className="shadow-lg  bg-light rounded mt-2  p-3">
            <div class="row">
              <div className="col-md-3 form-group mb-2 me-1">
                <label for="cno" class="exp-form-labels">Employee ID <span className="text-danger">*</span></label>
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-end">
                  <input
                    id="cno"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the company code"
                    value={company_no}
                    onChange={(e) => setCompany_no(e.target.value)}
                    maxLength={18}
                    ref={companycode}
                    onKeyDown={(e) => handleKeyDown(e, companyname, companycode)}
                    readOnly={mode === "update"}
                  />
                 <div className="position-absolute mt-1 me-2">
                    <span className="icon searchIcon"
                      onClick={handlePaySlip}>
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                  {error && !company_no && <div className="text-danger">Company Code should not be blank</div>}
                </div>
              </div>
              </div>
              <div className="col-md-2">
              <div class="me-2 mt-3">
                <div class=" d-flex justify-content-start">
                  {saveButtonVisible && (
                      <savebutton className="purbut" onClick={handleInsert}
                        required title="save"> <i class="fa-regular fa-floppy-disk"></i> </savebutton>
                    )}
                    {updateButtonVisible && (
                      <savebutton className="purbut" title='update' onClick={handleUpdate} >
                        <i class="fa-solid fa-floppy-disk"></i>
                      </savebutton>
                    )}
                  <div className="mt-3">
                    <delbutton onClick={handleDelete} title="Delete">
                    <i class="fa-solid fa-trash"></i>
                    </delbutton>
                  </div>
                  <div className="col-md-1">
                  <div className="ms-2 mt-3"></div>
                      <reloadbutton className="purbut" onClick={reloadGridData} title="save">
                        <i className="fa-solid fa-arrow-rotate-right"></i>
                      </reloadbutton>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-lg  bg-light rounded-top mt-2  pt-3">
            <button className=" p-2 ms-2 shadow-sm addTab" > Bonus Details</button>
          </div>
          <div class=" mb-4">
            <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
              <div class="row">
                
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div>
                        <label for="sname" class="exp-form-labels">
                        Select Type
                        </label> </div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the founded date"
                      value={foundedDate}
                      ref={found}
                      onChange={(e) => setFoundedDate(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, WebsiteUrl, found)}
                    />
                  </div>
                </div>
                <div className="col-md-3 form-group mb-2">
                  <div class="exp-form-floating">
                    <div class="d-flex justify-content-start">
                      <div> <label for="add1" class="exp-form-labels">
                        Select Details
                      </label></div>
                      <div><span className="text-danger">*</span></div>
                    </div>
                    <input
                      id="fdate"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the founded date"
                      value={foundedDate}
                      ref={found}
                      onChange={(e) => setFoundedDate(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, WebsiteUrl, found)}
                    />
                    {error && !address1 && <div className="text-danger">Address should not be blank</div>}
                  </div>
                </div>
            
              
               
                <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                  <button onClick={handleInsert} className="" title="Save">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
export default Input;
