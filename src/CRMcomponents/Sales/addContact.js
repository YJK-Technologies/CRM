import React, { useState, useEffect } from "react";
import './NewContactModal.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
const config = require('../../Apiconfig');

const NewContactModal = ({ showC, onCloseC, onSaveC }) => {
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [condrop, setCondrop] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCondrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setCountry(selectedCountry ? selectedCountry.value : '');
  };

  const handleInsert = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/addCRMContacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          contact_no: contactNo,
          email: email,
          Address: address,
          Country: country,
          Aadhar: aadhar,
          Pan: pan,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted successfully!");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  if (!showC) return null;

  return (
    <div className="modal d-block mt-5 popupadj Topnav-screen popup" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">

          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">Add Contact</h5>
              <button className="btn btn-danger" onClick={onCloseC} aria-label="Close">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div className="modal-body">
            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter phone"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Aadhaar No</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">PAN No</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter phone"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Country</label>
                  <Select
                    placeholder="Select Country"
                    className="exp-input-field"
                    value={selectedCountry}
                    onChange={handleChangeCountry}
                    options={filteredOptionCountry}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label d-flex justify-content-start">Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Additional details"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="" onClick={handleInsert}>Save</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewContactModal;
