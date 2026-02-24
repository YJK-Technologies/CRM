// ActivitySchedulerPopup.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const activityTypes = ['To-Do', 'Email', 'Call', 'Meeting', 'Document'];

export default function ActivitySchedulerPopup({ show, onClose, onSchedule }) {
  const [selectedTab, setSelectedTab] = useState('To-Do');
    const [showModal, setShowModal] = useState(false);
  const [activities, setActivities] = useState([]);
  
  const [formData, setFormData] = useState({
    summary: '',
    dueDate: '',
    recipient: '',
    phone: '',
    notes: ''
  });

  const handleSchedule = () => {
    const newActivity = { id: Date.now(), type: selectedTab, ...formData };
    onSchedule(newActivity);

    // Reset form
    setFormData({ summary: '', dueDate: '', recipient: '', phone: '', notes: '' });
    onClose();
  };

  const renderActivityForm = () => (
    <div className="activity-form">
      <div className="mb-3">
        <label className="form-label">Summary</label>
        <input
          type="text"
          className="form-control"
          placeholder={`Enter ${selectedTab} summary`}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Due Date</label>
        <input
          type="date"
          className="form-control"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>
      {selectedTab === 'Email' && (
        <div className="mb-3">
          <label className="form-label">Recipient</label>
          <input
            type="email"
            className="form-control"
            placeholder="email@example.com"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          />
        </div>
      )}
      {selectedTab === 'Call' && (
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Notes</label>
        <textarea
          className="form-control"
          rows="3"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <div className="text-end">
        <button className="me-2" onClick={onClose}>
          Cancel
        </button>
        <button className="" onClick={handleSchedule}>
          Schedule
        </button>
      </div>
    </div>
  );

  if (!show) return null;

  return (
    <div className="container-fluid Topnav-screen">
      <div className="activity-scheduler bg-white text-dark p-4 border rounded shadow-sm">
        <div className="d-flex border-bottom mb-3">
          {activityTypes.map((type) => (
            <div
              key={type}
              className={`tab-item px-3 py-2 ${
                selectedTab === type ? "active-tab" : ""
              }`}
              onClick={() => setSelectedTab(type)}
            >
              {type}
            </div>
          ))}
          <div
            className="ms-auto text-primary px-3 py-2 fw-semibold"
            role="button"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg"></i> Schedule activity
          </div>
        </div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-white text-dark border">
                
                {showModal &&(
                    <div className="modal-body">{renderActivityForm()}</div>
                )}
                
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
