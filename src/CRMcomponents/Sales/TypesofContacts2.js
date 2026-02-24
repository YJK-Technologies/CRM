import React, { useState, useEffect, useRef } from "react";
import './NewContactModal.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import person from './person.png'
import { emailInputStyle, emailInputFocusStyle, companySelectStyles } from "./formStyles";

import Company from "./company.png";

const config = require('../../Apiconfig');

const Typesofcontacts = ({ showC, onCloseC, onSaveC }) => {
  const [type, setType] = useState("Contact");
  const [isFocused, setIsFocused] = useState(false);

  const [image, setImage] = useState(null); 
  const [preview, setPreview] = useState(type === "" ? person : Company);
  const [InvoiceImage, setInvoiceImage] = useState(Company);
  const [ContactImage, setContactImage] = useState(person);
  const [DeliveryImage, setDeliveryImage] = useState(person);

  const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);
  const [selectedContactFile, setSelectedContactFile] = useState(null);
  const [selectedDeliveryFile, setSelectedDeliveryFile] = useState(null);

  const InvoiceInputRef = useRef(null);
  const ContactInputRef = useRef(null);
  const DeliveryInputRef = useRef(null);

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

  const handleInvoiceClick = () => {
    InvoiceInputRef.current.click();
  };

  const handleContactClick = () => {
    ContactInputRef.current.click();
  };

  const handleDeliveryClick = () => {
    DeliveryInputRef.current.click();
  };

  const fileInputRef = useRef(null);

  // Person fields
  const [Name, setName] = useState('');
  const [contact_no, setcontact_no] = useState('');
  const [email, setemail] = useState('');
  const [Address, setAddress] = useState('');
  const [Country, setCountry] = useState('');
  const [Aadhar, setAadhar] = useState('');
  const [Pan, setPan] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  const [Invoice_Name, setInvoice_Name] = useState('');
  const [Invoice_contact_no, setInvoice_contact_no] = useState('');
  const [Invoice_Address, setInvoice_Address] = useState('');
  const [Invoice_Country, setInvoice_Country] = useState('');
  const [Invoice_Aadhar, setInvoice_Aadhar] = useState('');
  const [Invoice_Pan, setInvoice_Pan] = useState('');
  const [Invoice_email, setInvoice_email] = useState('');
  const [Invoice_contactNotes, setInvoice_ContactNotes] = useState('');

  const [DeliveryName, setDeliveryName] = useState('');
  const [Deliverycontact_no, setDeliverycontact_no] = useState('');
  const [DeliveryAddress, setDeliveryAddress] = useState('');
  const [DeliveryCountry, setDeliveryCountry] = useState('');
  const [DeliveryAadhar, setDeliveryAadhar] = useState('');
  const [DeliveryPan, setDeliveryPan] = useState('');
  const [Deliveryemail, setDeliveryemail] = useState('');
  const [DeliveryNotes, setDeliveryNotes] = useState('');

  const [otherAddress1, setOtherAddress1] = useState('');
  const [otherAddress2, setOtherAddress2] = useState('');
  const [otherCity, setOtherCity] = useState('');
  const [otherZip, setOtherZip] = useState('');
  const [otherState, setOtherState] = useState('');
  const [otherCountry, setOtherCountry] = useState('');
  const [otherEmail, setOtherEmail] = useState('');
  const [otherPhone, setOtherPhone] = useState('');
  const [otherNotes, setOtherNotes] = useState('');

  useEffect(() => {
    if (type === "person") {
      setImage(person);
    } else {
      setImage(Company);
    }
  }, [type]);

  if (!showC) return null;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };


  const handleSave = async () => {
    try {
      const formData = new FormData();

      if (type === "Contact") {
        formData.append("Name", Name);
        formData.append("contact_no", contact_no);
        formData.append("email", email);
        formData.append("Address", Address);
        formData.append("Country", Country);
        formData.append("Aadhar", Aadhar);
        formData.append("Pan", Pan);
        formData.append("Notes", contactNotes);
        formData.append("Screen_mode", type);
        formData.append("created_by", sessionStorage.getItem("selectedUserCode"));
        if (selectedContactFile) {
          formData.append("Image", selectedContactFile);
        }

      } else if (type === "Invoice") {
        formData.append("Screen_mode", "Invoice");
        formData.append("Name", Invoice_Name);
        formData.append("contact_no", Invoice_contact_no);
        formData.append("email", Invoice_email);
        formData.append("Address", Invoice_Address);
        formData.append("Country", Invoice_Country);
        formData.append("Aadhar", Invoice_Aadhar);
        formData.append("Pan", Invoice_Pan);
        formData.append("Notes", Invoice_contactNotes);
        formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
        formData.append("Created_by", sessionStorage.getItem('selectedUserCode'));
        if (selectedInvoiceFile) {
          formData.append("Image", selectedInvoiceFile);
        }

      } else if (type === "Delivery" || type === "Other") {
        formData.append("Name", DeliveryName);
        formData.append("contact_no", Deliverycontact_no);
        formData.append("email", Deliveryemail);
        formData.append("Address", DeliveryAddress);
        formData.append("Country", DeliveryCountry);
        formData.append("Aadhar", DeliveryAadhar);
        formData.append("Pan", DeliveryPan);
        formData.append("Notes", DeliveryNotes);
        formData.append("created_by", sessionStorage.getItem("selectedUserCode"));
        formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
        formData.append("Screen_mode", "Delivery");

        if (selectedDeliveryFile) {
          formData.append("Image", selectedDeliveryFile);
        }
      }

      const response = await fetch(`${config.apiBaseUrl}/addCRMContacts`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        toast.success(`${type} data saved successfully!`);
      } else {
        let errorMessage = "Something went wrong";
        try {
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        toast.warning(errorMessage);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data: " + error.message);
    }
  };



  return (
    <div
      className="modal d-block mt-5 popupadj  popup"
      style={{ backgroundColor: "rgba(0,0,0,0.5)",marginLeft:"10px",marginTop:"10px",width:"100%", minWidth:"520px" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header border-0">
            <h5 className="modal-title">Create </h5>
            <button className="btn-close" onClick={onCloseC}></button>
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
                    <label className="form-label">Name</label>
                     <input
                    type="text"
                      style={{
                    ...emailInputStyle,
                    ...(isFocused ? emailInputFocusStyle : {}), width:"340px"
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={Name}
                      onChange={(e) => setName(e.target.value)}
                  />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Contact No</label>
                    
                    
                     <input
                    type="text"
                      style={{
                    ...emailInputStyle,
                    ...(isFocused ? emailInputFocusStyle : {}), width:"340px"
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={contact_no}
                      onChange={(e) => setcontact_no(e.target.value)}
                  />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Address</label>
                   

                     <input
                    type="text"
                      style={{
                    ...emailInputStyle,
                    ...(isFocused ? emailInputFocusStyle : {}), width:"340px"
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                  />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Country</label>
                   

                     <input
                    type="text"
                      style={{
                    ...emailInputStyle,
                    ...(isFocused ? emailInputFocusStyle : {}), width:"340px"
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)} 
                  value={Country}
                      onChange={(e) => setCountry(e.target.value)}
                  />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Aadhar</label>

                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pan"
                      value={Aadhar}
                      onChange={(e) => setAadhar(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Pan</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pan"
                      value={Pan}
                      onChange={(e) => setPan(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-flex justify-content-start">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
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
                  <div className="mb-9">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Internal notes..."
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
                    <label className="form-label">Invoice Name</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Name"
                      value={Invoice_Name}
                      onChange={(e) => setInvoice_Name(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Contact No</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Contact No"
                      value={Invoice_contact_no}
                      onChange={(e) => setInvoice_contact_no(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Invoice Address</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Address"
                      value={Invoice_Address}
                      onChange={(e) => setInvoice_Address(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Country"
                      value={Invoice_Country}
                      onChange={(e) => setInvoice_Country(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Aadhar</label>

                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Aadhar"
                      value={Invoice_Aadhar}
                      onChange={(e) => setInvoice_Aadhar(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Pan</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pan"
                      value={Invoice_Pan}
                      onChange={(e) => setInvoice_Pan(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-flex justify-content-start">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={Invoice_email}
                      onChange={(e) => setInvoice_email(e.target.value)}
                    />
                  </div>
                  <div className="mb-9">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      className="form-control"
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
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Name"
                      value={DeliveryName}
                      onChange={(e) => setDeliveryName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Contact No</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Contact No"
                      value={Deliverycontact_no}
                      onChange={(e) => setDeliverycontact_no(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Address"
                      value={DeliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Country"
                      value={DeliveryCountry}
                      onChange={(e) => setDeliveryCountry(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Aadhar</label>

                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pan"
                      value={DeliveryAadhar}
                      onChange={(e) => setDeliveryAadhar(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Pan</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pan"
                      value={DeliveryPan}
                      onChange={(e) => setDeliveryPan(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-flex justify-content-start">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={Deliveryemail}
                      onChange={(e) => setDeliveryemail(e.target.value)}
                    />
                  </div>

                  <div className="mb-9">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      className="form-control"
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
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10%",
                  }}
                  onClick={handleImageClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <div className="row">
                  <div className="col-md-6 text-start">
                    <label className="form-label">Address 1</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Street..."
                      value={otherAddress1}
                      onChange={(e) => setOtherAddress1(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <label className="form-label">Address 2</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Street 2..."
                      value={otherAddress2}
                      onChange={(e) => setOtherAddress2(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="City"
                      value={otherCity}
                      onChange={(e) => setOtherCity(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="ZIP"
                      value={otherZip}
                      onChange={(e) => setOtherZip(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="State"
                      value={otherState}
                      onChange={(e) => setOtherState(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 text-start">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Country"
                      value={otherCountry}
                      onChange={(e) => setOtherCountry(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-flex justify-content-start">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={otherEmail}
                      onChange={(e) => setOtherEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-flex justify-content-start">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otherPhone}
                      onChange={(e) => setOtherPhone(e.target.value)}
                    />
                  </div>
                  <div className="mb-9">
                    <label className="form-label d-flex justify-content-start">Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Internal notes..."
                      value={otherNotes}
                      onChange={(e) => setOtherNotes(e.target.value)}
                    />
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer border-0">
            <button className="btn btn-primary" onClick={handleSave}>
              Save & Close
            </button>
            <button className="btn btn-primary">Save & New</button>
            <button className="btn btn-light border" onClick={onCloseC}>
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Typesofcontacts;
