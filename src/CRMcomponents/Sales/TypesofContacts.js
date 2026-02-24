import React, { useState, useEffect, useRef } from "react";
import './NewContactModal.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import person from './person.png'
import Company from "./company.png";
import { emailInputStyle, emailInputFocusStyle, companySelectStyles } from "./formStyles";

const config = require('../../Apiconfig');

const Typesofcontacts = ({ onClose, onSave, initialData, initialType }) => {
  const [type, setType] = useState(initialType || "Contact");
  const [isFocused, setIsFocused] = useState(false);
  const [image, setImage] = useState(null);
  const [InvoiceImage, setInvoiceImage] = useState(Company);
  const [ContactImage, setContactImage] = useState(person);
  const [DeliveryImage, setDeliveryImage] = useState(person);
  const [OtherImage, setOtherImage] = useState(Company);

  const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);
  const [selectedContactFile, setSelectedContactFile] = useState(null);
  const [selectedDeliveryFile, setSelectedDeliveryFile] = useState(null);
  const [selectedOtherFile, setSelectedOtherFile] = useState(null);

  const InvoiceInputRef = useRef(null);
  const ContactInputRef = useRef(null);
  const DeliveryInputRef = useRef(null);
  const OtherInputRef = useRef(null);




  const handleInvoiceChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInvoiceImage(URL.createObjectURL(file));
      setSelectedInvoiceFile(file);
    }
  };

  const handleContactChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContactImage(URL.createObjectURL(file));
      setSelectedContactFile(file);
    }
  };

  const handleDeliveryChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDeliveryImage(URL.createObjectURL(file));
      setSelectedDeliveryFile(file);
    }
  };

  const handleOtherChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOtherImage(URL.createObjectURL(file));
      setSelectedOtherFile(file);
    }
  };

  const handleInvoiceClick = () => {
    InvoiceInputRef.current.click();
  };

  const handleContactClick = () => {
    ContactInputRef.current.click();
  };

  const handleDeliveryClick = () => {
    DeliveryInputRef.current.click();
  };

  const handleOtherClick = () => {
    OtherInputRef.current.click();
  };

  // Person fields
  const [Name, setName] = useState('');
  const [Contact_ID, setContact_ID] = useState('');
  const [contact_no, setcontact_no] = useState('');
  const [email, setemail] = useState('');
  const [Address, setAddress] = useState('');
  const [Country, setCountry] = useState('');
  const [Aadhar, setAadhar] = useState('');
  const [Pan, setPan] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  const [contactStatusDrop, setContactStatusDrop] = useState([]);
  const [selectedContactStatus, setSelectedContactStatus] = useState("");
  const [contactStatus, setContactStatus] = useState("");

  const [Invoice_Name, setInvoice_Name] = useState('');
  const [Invoice_contact_no, setInvoice_contact_no] = useState('');
  const [Invoice_Address, setInvoice_Address] = useState('');
  const [Invoice_Country, setInvoice_Country] = useState('');
  const [Invoice_Aadhar, setInvoice_Aadhar] = useState('');
  const [Invoice_Pan, setInvoice_Pan] = useState('');
  const [Invoice_email, setInvoice_email] = useState('');
  const [Invoice_contactNotes, setInvoice_ContactNotes] = useState('');
  const [invoiceStatusDrop, setInvoiceStatusDrop] = useState([]);
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("");

  const [DeliveryName, setDeliveryName] = useState('');
  const [Deliverycontact_no, setDeliverycontact_no] = useState('');
  const [DeliveryAddress, setDeliveryAddress] = useState('');
  const [DeliveryCountry, setDeliveryCountry] = useState('');
  const [DeliveryAadhar, setDeliveryAadhar] = useState('');
  const [DeliveryPan, setDeliveryPan] = useState('');
  const [Deliveryemail, setDeliveryemail] = useState('');
  const [DeliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryStatusDrop, setDeliveryStatusDrop] = useState([]);
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");

  const [otherName, setOtherName] = useState("");
  const [otherAddress1, setOtherAddress1] = useState('');
  const [otherCountry, setOtherCountry] = useState('');
  const [otherEmail, setOtherEmail] = useState('');
  const [otherNotes, setOtherNotes] = useState('');
  const [otherContact_no, setOthercontact_no] = useState("");
  const [otherAadhar, setOtherAadhar] = useState("");
  const [otherPan, setOtherPan] = useState("");
  const [otherStatusDrop, setOtherStatusDrop] = useState([]);
  const [selectedOtherStatus, setSelectedOtherStatus] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [error, setError] = useState('');

  
  console.log(invoiceStatus)
  console.log(selectedInvoiceStatus)
   useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setContactStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setInvoiceStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setDeliveryStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setOtherStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionContactStatus = contactStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionInvoiceStatus = invoiceStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionDeliveryStatus = deliveryStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionOtherStatus = otherStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeContactStatus = (selectedContactStatus) => {
    setSelectedContactStatus(selectedContactStatus);
    setContactStatus(selectedContactStatus ? selectedContactStatus.value : "");
  };

  const handleChangeInvoiceStatus = (selectedInvoiceStatus) => {
    setSelectedInvoiceStatus(selectedInvoiceStatus);
    setInvoiceStatus(selectedInvoiceStatus ? selectedInvoiceStatus.value : "");
  };

  const handleChangeDeliveryStatus = (selectedDeliveryStatus) => {
    setSelectedDeliveryStatus(selectedDeliveryStatus);
    setDeliveryStatus(selectedDeliveryStatus ? selectedDeliveryStatus.value : "");
  };

  const handleChangeOtherStatus = (selectedOtherStatus) => {
    setSelectedOtherStatus(selectedOtherStatus);
    setOtherStatus(selectedOtherStatus ? selectedOtherStatus.value : "");
  };


  // console.log(initialData)

  useEffect(() => {
    if (initialData) {
      if (initialData.Screen_mode === "Contact") {
        setContact_ID(initialData.Contact_ID || "");
        setName(initialData.Name || "");
        setcontact_no(initialData.contact_no || "");
        setemail(initialData.email || "");
        setAddress(initialData.Address || "");
        setCountry(initialData.Country || "");
        setAadhar(initialData.Aadhar || "");
        setPan(initialData.Pan || "");
        setContactNotes(initialData.Notes || "");
        setContactImage(initialData.ImageUrl || person);
        setContactStatus(initialData.Status || "");
        setType(initialData.Screen_mode || "Contact");

        setSelectedContactStatus(
        initialData.Status
          ? { value: initialData.Status, label: initialData.Status }
          : null
      );
      }

      if (initialData.Screen_mode === "Invoice") {
        setContact_ID(initialData.Contact_ID || "");
        setInvoice_Name(initialData.Name || "");
        setInvoice_contact_no(initialData.contact_no || "");
        setInvoice_email(initialData.email || "");
        setInvoice_Address(initialData.Address || "");
        setInvoice_Country(initialData.Country || "");
        setInvoice_Aadhar(initialData.Aadhar || "");
        setInvoice_Pan(initialData.Pan || "");
        setInvoice_ContactNotes(initialData.Notes || "");
        setInvoiceImage(initialData.ImageUrl || Company);
        setInvoiceStatus(initialData.Status || "");
        setType(initialData.Screen_mode || "Contact");

        setSelectedInvoiceStatus(
        initialData.Status
          ? { value: initialData.Status, label: initialData.Status }
          : null
      );
      }

      if (initialData.Screen_mode === "Delivery") {
        setContact_ID(initialData.Contact_ID || "");
        setDeliveryName(initialData.Name || "");
        setDeliverycontact_no(initialData.contact_no || "");
        setDeliveryemail(initialData.email || "");
        setDeliveryAddress(initialData.Address || "");
        setDeliveryCountry(initialData.Country || "");
        setDeliveryAadhar(initialData.Aadhar || "");
        setDeliveryPan(initialData.Pan || "");
        setDeliveryNotes(initialData.Notes || "");
        setDeliveryImage(initialData.ImageUrl || person);
        setDeliveryStatus(initialData.Status || "");
        setType(initialData.Screen_mode || "Contact");

         setSelectedDeliveryStatus(
        initialData.Status
          ? { value: initialData.Status, label: initialData.Status }
          : null
      );

      }

      if (initialData.Screen_mode === "Other") {
        setContact_ID(initialData.Contact_ID || "");
        setOtherName(initialData.Name || "");
        setOthercontact_no(initialData.contact_no || "");
        setOtherEmail(initialData.email || "");
        setOtherAddress1(initialData.Address || "");
        setOtherCountry(initialData.Country || "");
        setOtherAadhar(initialData.Aadhar || "");
        setOtherPan(initialData.Pan || "");
        setOtherNotes(initialData.Notes || "");
        setOtherImage(initialData.ImageUrl || Company);
        setOtherStatus(initialData.Status || "");
        setType(initialData.Screen_mode || "Contact");

        setSelectedOtherStatus(
        initialData.Status
          ? { value: initialData.Status, label: initialData.Status }
          : null
      );

      }
    }
  }, [initialData]);

  useEffect(() => {
    if (type === "person") {
      setImage(person);
    } else {
      setImage(Company);
    }
  }, [type]);

 
  // if (!showC) return null;

  const handleSave = async () => {
    try {
      const contactData = {};

      if (type === "Contact") {
        if (!Name) {
          setError(" ")
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Contact_ID = Contact_ID;
        contactData.Name = Name;
        contactData.contact_no = contact_no;
        contactData.email = email;
        contactData.Address = Address;
        contactData.Country = Country;
        contactData.Aadhar = Aadhar;
        contactData.Pan = Pan;
        contactData.Notes = contactNotes;
        contactData.Screen_mode = type;
        contactData.ImageUrl = ContactImage;
        contactData.Status = contactStatus;
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        if (selectedContactFile) {
          contactData.Image = selectedContactFile;
        }

      } else if (type === "Invoice") {
        if (!Invoice_Name) {
          setError(" ")
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Screen_mode = "Invoice";
        contactData.Contact_ID = Contact_ID;
        contactData.Name = Invoice_Name;
        contactData.contact_no = Invoice_contact_no;
        contactData.email = Invoice_email;
        contactData.Address = Invoice_Address;
        contactData.Country = Invoice_Country;
        contactData.Aadhar = Invoice_Aadhar;
        contactData.Pan = Invoice_Pan;
        contactData.Notes = Invoice_contactNotes;
        contactData.ImageUrl = InvoiceImage;
        contactData.Status = invoiceStatus;
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        if (selectedInvoiceFile) {
          contactData.Image = selectedInvoiceFile;
        }

      } else if (type === "Delivery") {
        if (!DeliveryName) {
          setError(" ")
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Contact_ID = Contact_ID;
        contactData.Name = DeliveryName;
        contactData.contact_no = Deliverycontact_no;
        contactData.email = Deliveryemail;
        contactData.Address = DeliveryAddress;
        contactData.Country = DeliveryCountry;
        contactData.Aadhar = DeliveryAadhar;
        contactData.Pan = DeliveryPan;
        contactData.Notes = DeliveryNotes;
        contactData.ImageUrl = DeliveryImage;
        contactData.Status = deliveryStatus;
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        contactData.Screen_mode = "Delivery";
        if (selectedDeliveryFile) {
          contactData.Image = selectedDeliveryFile;
        }

      } else if (type === "Other") {
        if (!otherName) {
          setError(" ")
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Contact_ID = Contact_ID;
        contactData.Name = otherName;
        contactData.contact_no = otherContact_no;
        contactData.Address = otherAddress1;
        contactData.email = otherEmail;
        contactData.Country = otherCountry;
        contactData.Aadhar = otherAadhar;
        contactData.Pan = otherPan;
        contactData.Notes = otherNotes;
        contactData.ImageUrl = OtherImage;
        contactData.Status = otherStatus;
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        contactData.Screen_mode = "Other";
        if (selectedOtherFile) {
          contactData.Image = selectedOtherFile;
        }
      }

      if (onSave) {
        if (initialData && typeof initialData.index !== "undefined") {
          onSave(contactData, initialData.index);
        } else {
          onSave(contactData);
        }
      }

      // toast.success(`${type} contact added temporarily!`);
      if (onClose) onClose();

    } catch (error) {
      console.error("Error preparing data:", error);
      toast.error("Error preparing data: " + error.message);
    }
  };

  const handleNewSave = async () => {
    try {
      const contactData = {};

      if (type === "Contact") {
        if (!Name) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Contact_ID = Contact_ID;
        contactData.Name = Name;
        contactData.contact_no = contact_no;
        contactData.email = email;
        contactData.Address = Address;
        contactData.Country = Country;
        contactData.Aadhar = Aadhar;
        contactData.Pan = Pan;
        contactData.Notes = contactNotes;
        contactData.Screen_mode = type;
        contactData.ImageUrl = ContactImage;
        contactData.Status = contactStatus;
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        if (selectedContactFile) {
          contactData.Image = selectedContactFile;
        }

      } else if (type === "Invoice") {
        if (!Invoice_Name) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Screen_mode = "Invoice";
        contactData.Contact_ID = Contact_ID;
        contactData.Name = Invoice_Name;
        contactData.contact_no = Invoice_contact_no;
        contactData.email = Invoice_email;
        contactData.Address = Invoice_Address;
        contactData.Country = Invoice_Country;
        contactData.Aadhar = Invoice_Aadhar;
        contactData.Pan = Invoice_Pan;
        contactData.Notes = Invoice_contactNotes;
        contactData.ImageUrl = InvoiceImage;
        contactData.Status = invoiceStatus;
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        if (selectedInvoiceFile) {
          contactData.Image = selectedInvoiceFile;
        }

      } else if (type === "Delivery") {
        if (!DeliveryName) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Contact_ID = Contact_ID;
        contactData.Name = DeliveryName;
        contactData.contact_no = Deliverycontact_no;
        contactData.email = Deliveryemail;
        contactData.Address = DeliveryAddress;
        contactData.Country = DeliveryCountry;
        contactData.Aadhar = DeliveryAadhar;
        contactData.Pan = DeliveryPan;
        contactData.Notes = DeliveryNotes;
        contactData.ImageUrl = DeliveryImage;
        contactData.Status = deliveryStatus;
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        contactData.Screen_mode = "Delivery";
        if (selectedDeliveryFile) {
          contactData.Image = selectedDeliveryFile;
        }

      } else if (type === "Other") {
        if (!otherName) {
          setError(" ");
          toast.warning("Error: Missing required fields");
          return;
        }
        contactData.Contact_ID = Contact_ID;
        contactData.Name = otherName;
        contactData.contact_no = otherContact_no;
        contactData.Address = otherAddress1;
        contactData.email = otherEmail;
        contactData.Country = otherCountry;
        contactData.Aadhar = otherAadhar;
        contactData.Pan = otherPan;
        contactData.Notes = otherNotes;
        contactData.ImageUrl = OtherImage;
        contactData.Status = otherStatus;
        contactData.created_by = sessionStorage.getItem("selectedUserCode");
        contactData.company_code = sessionStorage.getItem("selectedCompanyCode");
        contactData.Screen_mode = "Other";
        if (selectedOtherFile) {
          contactData.Image = selectedOtherFile;
        }
      }

      // ? Save the data
      if (onSave) {
        if (initialData && typeof initialData.index !== "undefined") {
          onSave(contactData, initialData.index);
        } else {
          onSave(contactData);
        }
      }

      // ? Clear all input fields (based on type)
      if (type === "Contact") {
        setName("");
        setcontact_no("");
        setemail("");
        setAddress("");
        setCountry("");
        setAadhar("");
        setPan("");
        setContactNotes("");
        setSelectedContactStatus('');
        setContactStatus('');
        setSelectedContactFile(null);
      } else if (type === "Invoice") {
        setInvoice_Name("");
        setInvoice_contact_no("");
        setInvoice_email("");
        setInvoice_Address("");
        setInvoice_Country("");
        setInvoice_Aadhar("");
        setInvoice_Pan("");
        setInvoice_ContactNotes("");
        setSelectedInvoiceStatus('');
        setInvoiceStatus('');
        setSelectedInvoiceFile(null);
      } else if (type === "Delivery") {
        setDeliveryName("");
        setDeliverycontact_no("");
        setDeliveryemail("");
        setDeliveryAddress("");
        setDeliveryCountry("");
        setDeliveryAadhar("");
        setDeliveryPan("");
        setDeliveryNotes("");
        setSelectedDeliveryStatus('');
        setDeliveryStatus('');
        setSelectedDeliveryFile(null);
      } else if (type === "Other") {
        setOtherName("");
        setOthercontact_no("");
        setOtherAddress1("");
        setOtherEmail("");
        setOtherCountry("");
        setOtherAadhar("");
        setOtherPan("");
        setOtherNotes("");
        setSelectedOtherStatus('');
        setOtherStatus('');
        setSelectedOtherFile(null);
      }

      toast.success(`${type} contact saved! Ready for new entry.`);

    } catch (error) {
      console.error("Error preparing data:", error);
      toast.error("Error preparing data: " + error.message);
    }
  };

  const handleDelete = () => {
    try {
      if (onSave && initialData && typeof initialData.index !== "undefined") {
        onSave(null, initialData.index);
      }

      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Error deleting contact: " + error.message);
    }
  };

  return (
    <div
      className="modal d-block mt-5 popupadj popup"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", width: "100%", marginLeft: "10px", minWidth: "520px" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header border-0">
            <h5 className="modal-title">Create Contacts</h5>
            <button className="btn-close" title="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-3 d-flex gap-3">
              <label>
                <input type="radio" value="Contact" checked={type === "Contact"} onChange={() => setType("Contact")} /> Contact
              </label>
              <label>
                <input type="radio" value="Invoice" checked={type === "Invoice"} onChange={() => setType("Invoice")} /> Invoice
              </label>
              <label>
                <input type="radio" value="Delivery" checked={type === "Delivery"} onChange={() => setType("Delivery")} /> Delivery
              </label>
              <label>
                <input type="radio" value="Other" checked={type === "Other"} onChange={() => setType("Other")} /> Other
              </label>
            </div>
            {type === "Contact" && (
              <div>
                <img
                  src={ContactImage}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10%",
                    cursor: "pointer",
                  }}
                  onClick={handleContactClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleContactChange}
                  ref={ContactInputRef}
                  style={{ display: "none" }}
                />
                <div className="row">
                  <div className="col-md-6 text-start">
                    {/* <label className={`form-label ${error && !Name ? 'text-danger' : ''}`}>Name<span className="text-danger">*</span></label> */}
                    <label className="form-label d-flex justify-content-start">Name</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Name"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Contact No</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Contact No"
                      value={contact_no}
                      onChange={(e) => setcontact_no(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Address</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Address"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Country</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Country"
                      value={Country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Aadhar</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Aadhar"
                      value={Aadhar}
                      onChange={(e) => setAadhar(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Pan</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Pan"
                      value={Pan}
                      onChange={(e) => setPan(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start ">Email</label>
                    <input
                      type="text"
                      placeholder="Email"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      onFocus={() => setIsFocused("Email")}
                      onBlur={() => setIsFocused("")}
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Status</label>
                    <Select
                      type="text"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          border: "none",
                          borderBottom: state.isFocused
                            ? "2px solid #17a2b8"
                            : "2px solid #ccc",
                          boxShadow: "none",
                          borderRadius: "0",
                          backgroundColor: "transparent",
                          fontSize: "14px",
                          fontWeight: 500,
                          width: "350px",
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#666",
                          ":hover": { color: "#17a2b8" },
                        }),
                      }}
                      value={selectedContactStatus}
                      onChange={handleChangeContactStatus}
                      options={filteredOptionContactStatus}
                    />
                  </div>
                  {/* <div className="col-md-6">
                    <label className="form-label d-flex justify-content-start">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contact_no}
                      onChange={(e) => setcontact_no(e.target.value)}
                    />
                  </div> */}
                  <div className="mb-9 text-start">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      rows="3"
                      placeholder="Internal notes..."
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {type === "Invoice" && (
              <div>
                <img
                  src={InvoiceImage}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10%",
                  }}
                  onClick={handleInvoiceClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInvoiceChange}
                  ref={InvoiceInputRef}
                  style={{ display: "none" }}
                />
                <div className="row">
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Invoice Name</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Name"
                      value={Invoice_Name}
                      onChange={(e) => setInvoice_Name(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Contact No</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Contact No"
                      value={Invoice_contact_no}
                      onChange={(e) => setInvoice_contact_no(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Invoice Address</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Address"
                      value={Invoice_Address}
                      onChange={(e) => setInvoice_Address(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Country</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Country"
                      value={Invoice_Country}
                      onChange={(e) => setInvoice_Country(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Aadhar</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Aadhar"
                      value={Invoice_Aadhar}
                      onChange={(e) => setInvoice_Aadhar(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Pan</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Pan"
                      value={Invoice_Pan}
                      onChange={(e) => setInvoice_Pan(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Email</label>
                    <input
                      type="text"
                      placeholder="Email"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      value={Invoice_email}
                      onChange={(e) => setInvoice_email(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Status</label>
                    <Select
                      type="text"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          border: "none",
                          borderBottom: state.isFocused
                            ? "2px solid #17a2b8"
                            : "2px solid #ccc",
                          boxShadow: "none",
                          borderRadius: "0",
                          backgroundColor: "transparent",
                          fontSize: "14px",
                          fontWeight: 500,
                          width: "350px",
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#666",
                          ":hover": { color: "#17a2b8" },
                        }),
                      }}
                      value={selectedInvoiceStatus}
                      onChange={handleChangeInvoiceStatus}
                      options={filteredOptionInvoiceStatus}
                    />
                  </div>
                  <div className="mb-9 text-start">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      rows="3"
                      placeholder="Internal notes..."
                      value={Invoice_contactNotes}
                      onChange={(e) => setInvoice_ContactNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {type === "Delivery" && (
              <div>
                <img
                  src={DeliveryImage}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10%",
                    cursor: "pointer",
                  }}
                  onClick={handleDeliveryClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDeliveryChange}
                  ref={DeliveryInputRef}
                  style={{ display: "none" }}
                />
                <div className="row">
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Name</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Name"
                      value={DeliveryName}
                      onChange={(e) => setDeliveryName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Contact No</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Contact No"
                      value={Deliverycontact_no}
                      onChange={(e) => setDeliverycontact_no(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Address</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Address"
                      value={DeliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Country</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Country"
                      value={DeliveryCountry}
                      onChange={(e) => setDeliveryCountry(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Aadhar</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Aadhar"
                      value={DeliveryAadhar}
                      onChange={(e) => setDeliveryAadhar(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Pan</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Pan"
                      value={DeliveryPan}
                      onChange={(e) => setDeliveryPan(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Email</label>
                    <input
                      type="text"
                      placeholder="Email"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      value={Deliveryemail}
                      onChange={(e) => setDeliveryemail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Status</label>
                    <Select
                      type="text"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          border: "none",
                          borderBottom: state.isFocused
                            ? "2px solid #17a2b8"
                            : "2px solid #ccc",
                          boxShadow: "none",
                          borderRadius: "0",
                          backgroundColor: "transparent",
                          fontSize: "14px",
                          fontWeight: 500,
                          width: "350px",
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#666",
                          ":hover": { color: "#17a2b8" },
                        }),
                      }}
                      value={selectedDeliveryStatus}
                      onChange={handleChangeDeliveryStatus}
                      options={filteredOptionDeliveryStatus}
                    />
                  </div>
                  <div className="mb-9 text-start">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      rows="3"
                      placeholder="Internal notes..."
                      value={DeliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {type === "Other" && (
              <div>
                <img
                  src={OtherImage}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10%",
                  }}
                  onClick={handleOtherClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOtherChange}
                  ref={OtherInputRef}
                  style={{ display: "none" }}
                />
                <div className="row">
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Name</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Name"
                      value={otherName}
                      onChange={(e) => setOtherName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start"> Contact No</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Contact No"
                      value={otherContact_no}
                      onChange={(e) => setOthercontact_no(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Address</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Address"
                      value={otherAddress1}
                      onChange={(e) => setOtherAddress1(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Country</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Country"
                      value={otherCountry}
                      onChange={(e) => setOtherCountry(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Aadhar</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Aadhar"
                      value={otherAadhar}
                      onChange={(e) => setOtherAadhar(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Pan</label>
                    <input
                      type="text"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      placeholder="Pan"
                      value={otherPan}
                      onChange={(e) => setOtherPan(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Email</label>
                    <input
                      type="text"
                      placeholder="Email"
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      value={otherEmail}
                      onChange={(e) => setOtherEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label d-flex justify-content-start">Status</label>
                    <Select
                      type="text"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          border: "none",
                          borderBottom: state.isFocused
                            ? "2px solid #17a2b8"
                            : "2px solid #ccc",
                          boxShadow: "none",
                          borderRadius: "0",
                          backgroundColor: "transparent",
                          fontSize: "14px",
                          fontWeight: 500,
                          width: "350px",
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#666",
                          ":hover": { color: "#17a2b8" },
                        }),
                      }}
                      value={selectedOtherStatus}
                      onChange={handleChangeOtherStatus}
                      options={filteredOptionOtherStatus}
                    />
                  </div>
                  <div className=" mb-9 text-start">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      placeholder="Internal notes..."
                      style={{
                        ...emailInputStyle,
                        ...(isFocused ? emailInputFocusStyle : {}),
                        width: "350px",
                      }}
                      rows="3"
                      value={otherNotes}
                      onChange={(e) => setOtherNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div style={{ marginBottom: "1rem" }} className="modal-footer d-flex justify-content-end align-items-center gap-2">
            <button
              type="button"
              className="btn btn-success text-center"
              title="Save & Close"
              onClick={handleSave}
            >
              Save & Close
            </button>

            <button
              type="button"
              className="btn btn-success text-center"
              title="Save & New"
              onClick={handleNewSave}
            >
              Save & New
            </button>

            <button
              className="btn btn-danger px-4"
              title="Discard"
              onClick={onClose}
            >
              Discard
            </button>

            {initialData && (
              <button
                className="btn btn-danger"
                title="Delete"
                onClick={handleDelete}
              >
                <i className="bi bi-trash me-1"></i> Delete
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Typesofcontacts;