import React, { useState, useEffect } from 'react';
import './CRMActivityScheduler.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";

const activityTypes = ['To-Do', 'Email', 'Call', 'Meeting', 'Document'];

export default function ActivityScheduler({ opportunityId, opportunityName, activityData, setRefresh, handleCloseModal }) {
  const [selectedTab, setSelectedTab] = useState('To-Do');
  const config = require('../../Apiconfig');

  // Shared fields
  const [Summary, setSummary] = useState('');
  const [Due_date, setDue_date] = useState('');
  const [Assigned_To, setAssigned_To] = useState('');
  const [Notes, setNotes] = useState('');
  const [Attachments, setAttachments] = useState('');
  const [Id, setId] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    {
      if (!activityData) return;

      const formatDate = (dateStr) => {
        if (!dateStr) return "";

        const parts = dateStr.split("/"); 
        if (parts.length !== 3) return "";

        const [day, month, year] = parts;
        return `${year}-${month}-${day}`; 
      };

      setId(activityData.Id || "");
      setSelectedTab(activityData.Type_of_Activity || "");
      setSummary(activityData.Summary || "");
      setDue_date(formatDate(activityData.Due_date));
      setAssigned_To(activityData.Assigned_To || "");
      setNotes(activityData.Notes || "");
    }
  }, []);

  const summaryPlaceholderMap = {
    "To-Do": "Enter To-Do Summary",
    "Email": "Enter Email Subject",
    "Call": "Enter Call Summary",
    "Meeting": "Enter Meeting Title",
    "Document": "Enter Document Title",
  };

  const notesPlaceholderMap = {
    "To-Do": "Enter To-Do Notes",
    "Email": "Enter Email Body",
    "Call": "Enter Call Notes",
    "Meeting": "Enter Meeting Notes",
    "Document": "Enter Document Details",
  };

  useEffect(() => {
    if (!opportunityId, !opportunityName) {
      console.log("No opportunity ID received!");
    } else {
      console.log("Received opportunity ID:", opportunityId, opportunityName);
    }
  }, [opportunityId, opportunityName]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("Activity_ID", Id);
      formData.append("Summary", Summary);
      formData.append("Type_of_Activity", selectedTab);
      formData.append("Due_date", Due_date);
      formData.append("Assigned_To", Assigned_To);
      formData.append("Notes", Notes);
      formData.append("Created_by", sessionStorage.getItem("selectedUserCode"));
      formData.append("Company_code", sessionStorage.getItem("selectedCompanyCode"));

      if (opportunityId) {
        formData.append("Opportunity_ID", opportunityId);
      } else {
        toast.error("Opportunity ID not found!");
        return;
      }

      if (Attachments) {
        formData.append("Attachments", Attachments);
      }

      const response = await fetch(`${config.apiBaseUrl}/CRM_ActivityInsert`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        toast.success("Saved successfully");

        setSummary("");
        setDue_date("");
        setAssigned_To("");
        setNotes("");
        setAttachments(null);
        setRefresh((prev) => !prev);
        handleCloseModal();
      } else {
        toast.error("Failed to save!");
      }
    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  return (
    <div className="">
      <div className="shadow-lg bg-white rounded-3 mb-3">
        <div className="d-flex justify-content-between p-2">
          <h1>CRM Activity Scheduler</h1>
          {/* <div className="mt-2">
            <button className="btn btn-light border-0 shadow-none" onClick={() => navigate('/crmlistpage')}>
              <i className="bi bi-kanban fs-4" title='crmlistpage'></i>
            </button>
            <button className="btn btn-light border-0 shadow-none" onClick={() => navigate('/CrmChart')}>
              <i className="bi bi-bar-chart-fill fs-4" title='CrmChart'></i>
            </button>
            <button
           className="btn btn-light border-0 shadow-none"
           onClick={() => navigate('/CrmScheduler', { state: { opportunityId } })}
                >
             <i className="bi bi-calendar3 fs-4" title='CrmScheduler' ></i>
              </button>

            <button className="btn btn-light border-0 shadow-none" onClick={() => navigate('/CrmLocation')}>
              <i className="bi bi-geo-alt-fill fs-4" title='CrmLocation'></i>
            </button>
          </div> */}
        </div>
      </div>


      <div className="activity-scheduler bg-white text-dark p-4 border rounded shadow-sm">
        {/* Tabs */}
        <div className="d-flex border-bottom mb-3">
          {activityTypes.map((type) => (
            <div
              key={type}
              className={`tab-item px-3 py-2 ${selectedTab === type ? "active-tab" : ""}`}
              onClick={() => setSelectedTab(type)}
              role="button"
            >
              {type}
            </div>
          ))}
        </div>

        {/* Conditional content */}
        {selectedTab === "Meeting" ? (
          <div
            className="text-center d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "300px" }}
          >
            {/* Calendar icon */}
            <i
              className="bi bi-calendar3 mb-3"
              style={{ fontSize: "80px", color: "#5a5a5a" }}
            ></i>

            {/* Message */}
            <p className="text-muted mb-4">Schedule a meeting in your calendar</p>

            {/* Buttons */}
            <div className="d-flex justify-content-center gap-3">
              <button
                onClick={() =>
                  navigate("/CrmScheduler", { state: { opportunityName } })
                }
                className="btn"
                style={{
                  backgroundColor: "#5b2245",
                  color: "white",
                  padding: "8px 24px",
                  borderRadius: "8px",
                }}
              >
                Schedule
              </button>

              <button
                className="btn"
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  padding: "8px 24px",
                  borderRadius: "8px",
                }}
              >
                Discard
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2">
            {/* Summary */}
            <div className="mb-3 d-flex align-items-center">
              <label
                style={{
                  fontSize: "16px",
                  color: "#333",
                  minWidth: "80px",
                  textAlign: "left",
                  marginRight: "10px",
                }}
              >
                Summary :
              </label>
              <input
                type="text"
                style={{
                  flex: 1,
                  border: "none",
                  borderBottom: "2px solid #ccc",
                  outline: "none",
                  padding: "6px 2px",
                  fontSize: "14px",
                  transition: "border-color 0.2s ease",
                  width: "100%",
                }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #0f0e0cff")
                }
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                placeholder={summaryPlaceholderMap[selectedTab]}
                value={Summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {/* Due Date */}
            <div className="mb-3 d-flex align-items-center">
              <label
                style={{
                  fontSize: "16px",
                  color: "#333",
                  minWidth: "80px",
                  textAlign: "left",
                  marginRight: "10px",
                }}
              >
                Due Date :
              </label>
              <input
                type="date"
                style={{
                  flex: 1,
                  border: "none",
                  borderBottom: "2px solid #ccc",
                  outline: "none",
                  padding: "6px 2px",
                  fontSize: "14px",
                  transition: "border-color 0.2s ease",
                  width: "100%",
                }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #0f0e0cff")
                }
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                value={Due_date}
                onChange={(e) => setDue_date(e.target.value)}
              />
            </div>

            {/* Assigned To */}
            <div className="mb-3 d-flex align-items-center">
              <label
                style={{
                  fontSize: "16px",
                  color: "#333",
                  minWidth: "80px",
                  textAlign: "left",
                  marginRight: "10px",
                }}
              >
                Assigned To :
              </label>
              <input
                type="text"
                style={{
                  flex: 1,
                  border: "none",
                  borderBottom: "2px solid #ccc",
                  outline: "none",
                  padding: "6px 2px",
                  fontSize: "14px",
                  transition: "border-color 0.2s ease",
                  width: "100%",
                }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #0f0e0cff")
                }
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                placeholder="Enter assignee"
                value={Assigned_To}
                onChange={(e) => setAssigned_To(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="mb-3 d-flex align-items-center">
              <label
                style={{
                  fontSize: "16px",
                  color: "#333",
                  minWidth: "80px",
                  textAlign: "left",
                  marginRight: "10px",
                }}
              >
                Notes :
              </label>
              <textarea
                className="form-control"
                rows="2"
                style={{ maxWidth: "1700px" }}
                placeholder={notesPlaceholderMap[selectedTab]}
                value={Notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            {/* Attachments */}
            <div
              className="mb-3 d-flex align-items-center"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <label
                style={{
                  fontSize: "16px",
                  color: "#333",
                  minWidth: "100px",
                  textAlign: "left",
                }}
              >
                Attachments :
              </label>

              <input
                type="file"
                style={{
                  flex: 1,
                  border: "none",
                  borderBottom: "2px solid #ccc",
                  outline: "none",
                  padding: "6px 2px",
                  fontSize: "14px",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #0f0e0cff")
                }
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                onChange={(e) => setAttachments(e.target.files[0])}
              />
            </div>

            <button className="btn btn-primary" onClick={handleSave}>
              Save {selectedTab}
            </button>
          </div>
        )}
      </div>


    </div>
  );
}
