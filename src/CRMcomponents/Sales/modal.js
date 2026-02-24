import React, { useState, useEffect } from 'react';
import AddContactModal from './contact.js';
import AddCompanyModal from './company.js';
import Select from 'react-select';
import { toast } from 'react-toastify';
import './Column.css';
const config = require('../../Apiconfig');

export default function LeadModal({ onSubmit, onCancel, selectedColumnId }) {

  const [companyDrop, setCompanyDrop] = useState([]);
  const [nameDrop, setNameDrop] = useState([]);
  const [rateDrop, setRateDrop] = useState([]);
  const [dateDrop, setDateDrop] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [opportunityName, setOpportunityName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [expectedRevenue, setExpectedRevenue] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [email, setEmail] = useState('');
  const [showCompanyModal, setshowCompanyModal] = useState(false);
  const [companyInputValue, setCompanyInputValue] = useState("")
  const [contactInputValue, setContactInputValue] = useState("")
  const [showContactModal, setshowContactModal] = useState(false);


  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    if (rating === value) {
      setRating(0);
    } else {
      setRating(value);
    }
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/defaultCompanyNames`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setCompanyDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/defaultContactsName`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setNameDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setRateDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDateRangeCRM`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setDateDrop(val));
  }, []);

  const filteredOptionCompany = Array.isArray(companyDrop)
    ? companyDrop.map((option) => ({
      value: option.ID,
      label: option.Company,
      sourceType: option.sourceType
    }))
    : [];

  // const limitedCompanyOptions = [...filteredOptionCompany.slice(0, 5), { value: "search_more", label: "Search more..." }];

  const limitedCompanyOptions = companyInputValue
    ? filteredOptionCompany.filter((o) =>
      o.label.toLowerCase().includes(companyInputValue.toLowerCase())
    )
    : filteredOptionCompany.slice(0, 5).concat({ value: "search_more", label: "Search more..." });

  const filteredOptionName = Array.isArray(nameDrop)
    ? nameDrop.map((option) => ({
      value: option.ID,
      label: option.SecondColumn
        ? `${option.FirstColumn} - ${option.SecondColumn}`
        : `${option.FirstColumn}`,
      FirstColumn: option.FirstColumn,
      sourceType: option.sourceType
    }))
    : [];

  // const limitedContactOptions = [...filteredOptionName.slice(0, 5), { value: "search_more", label: "Search more..." }];

  const limitedContactOptions = contactInputValue
    ? filteredOptionName.filter((o) =>
      o.label.toLowerCase().includes(contactInputValue.toLowerCase())
    )
    : filteredOptionName.slice(0, 5).concat({ value: "search_more", label: "Search more..." });

  const filteredOptionDate = Array.isArray(dateDrop)
    ? dateDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const fetchContactsByCompany = (contact, sourceType) => {
    fetch(`${config.apiBaseUrl}/contactToCompany`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Contact_ID: contact,
        sourceType: sourceType,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        return response.json();
      })
      .then((data) => {
        setCompanyDrop(data);
      })
      .catch((error) => console.error("Error fetching contacts:", error));
  };

  const fetchContactsByEmail = async (contact, sourceType) => {

    try {
      const response = await fetch(`${config.apiBaseUrl}/getContactEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Contact_ID: contact,
          sourceType: sourceType,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const [{ Email, Phone }] = data;

        setEmail(Email);
        setPhoneNo(Phone);

      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert Purchase data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const fetchCompanyByContact = (company) => {
    fetch(`${config.apiBaseUrl}/companyToContact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        CompanyID: company,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          setNameDrop([])
          throw new Error("Failed to fetch company");
        }
        return response.json();
      })
      .then((data) => {
        setNameDrop(data);
      })
      .catch((error) => console.error("Error fetching company:", error));
  };

  const handleChangeCompany = (selectedCompany) => {
    if (selectedCompany?.value === "search_more") {
      setshowCompanyModal(true);
    } else {
      setSelectedCompany(selectedCompany);
      setCompany(selectedCompany ? selectedCompany.value : "");

      if (selectedCompany) {
        fetchCompanyByContact(selectedCompany.value);

        if (!opportunityName) {
          setOpportunityName(`${selectedCompany.label}'s Opportunity`);
        }
      } else {
        fetch(`${config.apiBaseUrl}/defaultContactsName`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        })
          .then((res) => res.json())
          .then((val) => setNameDrop(val))
          .catch((err) => console.error("Error fetching default companies:", err));
      }
    }
  };

  const handleChangeName = (selectedName) => {
    if (selectedName?.value === "search_more") {
      setshowContactModal(true);
    } else {
      setSelectedName(selectedName);
      setName(selectedName ? selectedName.value : "");

      if (selectedName) {
        fetchContactsByCompany(selectedName.value, selectedName.sourceType);
        fetchContactsByEmail(selectedName.value, selectedName.sourceType);
        if (!opportunityName) {
          setOpportunityName(`${selectedName.FirstColumn}'s Opportunity`);
        }

      } else {
        fetch(`${config.apiBaseUrl}/defaultCompanyNames`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        })
          .then((res) => res.json())
          .then((val) => setCompanyDrop(val))
          .catch((err) => console.error("Error fetching default contacts:", err));
      }
    }
  };

  const handleChangeDate = (selectedDate) => {
    setSelectedDate(selectedDate);
    setDate(selectedDate ? selectedDate.value : '');
  };


  const handleSubmit = async () => {
    let priorityText = "";
    if (rating <= 1) priorityText = "Low";
    else if (rating === 2) priorityText = "Medium";
    else if (rating === 3) priorityText = "High";

    const newCompanyData = {
      CompanyID: company,
      Contact_ID: name,
      // Company:selectedCompany.label,
      // Contact:selectedName.FirstColumn,
      sourceType: selectedName.sourceType,
      OpportunityName: opportunityName,
      Email_ID: email,
      ContactPhone: phoneNo,
      ExpectedRevenue: expectedRevenue ? expectedRevenue : 0,
      Payment: monthlyRevenue ? monthlyRevenue : 0,
      PaymentType: date,
      Priority: priorityText,
      Stage: selectedColumnId,
      Sales_man_code: "None",
      company_code: sessionStorage.getItem("selectedCompanyCode"),
      Created_by: sessionStorage.getItem("selectedUserCode")
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_NewCompanyInsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompanyData),
      });

      if (response.ok) {
        const data = await response.json();

        const [{ Opportunity_ID, OpportunityName, Contact, ExpectedRevenue, Priority, Stage }] = data;

        const newLead = {
          id: Opportunity_ID,
          title: OpportunityName,
          contact: Contact,
          investment: ExpectedRevenue,
          priority: Priority,
          stage: Stage
        };

        toast.success(`Data inserted successfully`);

        if (onSubmit) onSubmit(newLead);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert Purchase data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  return (
    <div className="card p-2 mt-1 mb-2 rounded-0">
      <div className="input-group mb-2">
        <span className="input-group-text text-dark"><i className="bi bi-building"></i></span>
        <div className="form-control p-0 border-0">
          <Select
            classNamePrefix="react-select"
            options={limitedCompanyOptions}
            isClearable
            placeholder="Company Name"
            onChange={handleChangeCompany}
            value={selectedCompany}
            onInputChange={(value) => setCompanyInputValue(value)}
            getOptionLabel={(option) =>
              option.value === "search_more"
                ? <span style={{ color: "blue", cursor: "pointer" }}>{option.label}</span>
                : option.label
            }
          />
        </div>
      </div>
      <AddCompanyModal
        showCompany={showCompanyModal}
        onCompanyClose={() => setshowCompanyModal(false)}
        onSaveCompany={(selectedCompanyID, selectedCompanyName) => {
          handleChangeCompany({ value: selectedCompanyID, label: selectedCompanyName });
          setshowCompanyModal(false);
        }}
        selectedColumnId={selectedColumnId}
      />

      <div className="input-group mb-2">
        <span className="input-group-text">
          <i className="bi bi-person-fill"></i>
        </span>
        <div className="form-control p-0 border-0">
          <Select
            classNamePrefix="react-select"
            options={limitedContactOptions}
            isClearable
            placeholder="Contact Name"
            onChange={handleChangeName}
            value={selectedName}
            onInputChange={(value) => setContactInputValue(value)}
            getOptionLabel={(option) =>
              option.value === "search_more"
                ? <span style={{ color: "blue", cursor: "pointer" }}>{option.label}</span>
                : option.label
            }
          />
        </div>
      </div>
      <AddContactModal
        showContact={showContactModal}
        onClose={() => setshowContactModal(false)}
         onSaveCompany={(selectedCompanyID, selectedCompanyName) => {
          handleChangeName({ value: selectedCompanyID, label: selectedCompanyName });
          setshowContactModal(false);
        }}
        selectedColumnId={selectedColumnId}
      />

      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-lightbulb-fill"></i></span>
        <input
          type="text"
          className="form-control"
          value={opportunityName}
          onChange={(e) => setOpportunityName(e.target.value)}
          placeholder="Opportunity Name"
        />
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Contact Email"
        />
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
        <input
          type="tel"
          className="form-control"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          placeholder="Contact Phone"
        />
      </div>

      <div className="row mb-2">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-cash-coin"></i>
            </span>
            <input
              type="number"
              className="form-control"
              name="investment"
              value={expectedRevenue}
              onChange={(e) => setExpectedRevenue(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
<div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-cash-coin"></i>
            </span>
            <input
              type="number"
              className="form-control"
              name="investment"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
  
      </div>

      
<div className="col-md-12">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-calendar-event"></i>
            </span>
            <Select
              className="col-md-10"
              isClearable
              isSearchable
              options={filteredOptionDate}
              placeholder="Range"
              onChange={handleChangeDate}
              value={selectedDate}
            />
          </div>
        </div>
         <div className="col-md-6">
          <div className="input-group justify-content-center">
            <div className="d-flex justify-content-center gap-3">
              {[1, 2, 3].map((star) => (
                <i
                  key={star}
                  className="bi bi-star-fill"
                  onClick={() => handleStarClick(star)}
                  style={{
                    fontSize: "25px",
                    cursor: "pointer",
                    color: star <= rating ? "#ffc107" : "#e4e5e9",
                    transition: "color 0.2s ease-in-out",
                  }}
                ></i>
              ))}
            </div>
          </div>
        </div>
      <div className="d-flex justify-content-between">
        <button className="btn Save-color" title='Save' onClick={handleSubmit}>
          Save
        </button>
        <button className="btn cancel-color" title='Cancel' onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
