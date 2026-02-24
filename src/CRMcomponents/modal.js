import React, { useState, useEffect } from 'react';
import AddContactModal from './contact.js'
import Select from 'react-select'
export default function LeadForm({ initialData = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    company: '',
    contact: '',
    opportunity: '',
    email: '',
    phone: '',
    investment: '',
    rotational: '',
    ...initialData
  }));

  // Only reset form if initialData changes (deep equality might be better, but usually shallow is fine)
  useEffect(() => {
    setForm({
      company: '',
      contact: '',
      opportunity: '',
      email: '',
      phone: '',
      investment: '',
      rotational: '',
      ...initialData
    });
  }, [JSON.stringify(initialData)]); // JSON.stringify ensures change detection on content, not ref

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.opportunity.trim()) return;

    const newLead = {
      id: initialData.id || `lead-${Date.now()}`,
      ...form,
    };

    onSubmit(newLead);

    // Clear form only if adding new (not editing)
    if (!initialData.id) {
      setForm({
        company: '',
        contact: '',
        opportunity: '',
        email: '',
        phone: '',
        investment: '',
        rotational: '',
      });
    }
  };

  const handleSaveContact = () => {
    // Add your contact save logic here
    setShowContactModal(false);
  };
  const [showContactModal, setShowContactModal] = useState(false);
const contactOptions = [
  { value: 'John Doe', label: 'John Doe' },
  { value: 'Jane Smith', label: 'Jane Smith' },
];
  return (
    <div className="card p-2 mb-2  " >
      {/* Company */}
      <div className="input-group mb-2">
        <span className="input-group-text text-dark"><i className="bi bi-building"></i></span>
        <input
          type="text"
          className="form-control"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
        />
      </div>

      {/* Contact Name */}
      <div>
    <div className="input-group mb-2">
  <span className="input-group-text">
    <i className="bi bi-person-fill"></i>
  </span>

 <Select
  className='col-md-8'
  options={contactOptions}
  isClearable
  isSearchable
  onChange={(selected) => setForm({ ...form, contact: selected?.value || '' })}
  value={contactOptions.find(opt => opt.value === form.contact) || null}
/>

  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => setShowContactModal(true)}
  >
    <i className="bi bi-plus-lg"></i>
  </button>
</div>


      {/* Modal Component */}
      <AddContactModal
        show={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSave={handleSaveContact}
      />
      </div>

      {/* Opportunity Name */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-lightbulb-fill"></i></span>
        <input
          type="text"
          className="form-control"
          name="opportunity"
          value={form.opportunity}
          onChange={handleChange}
          placeholder="Opportunity Name"
        />
      </div>

      {/* Email */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
        <input
          type="email"
          className="form-control"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Contact Email"
        />
      </div>

      {/* Phone */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
        <input
          type="tel"
          className="form-control"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Contact Phone"
        />
      </div>

      {/* Investment Money */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-cash-coin"></i></span>
        <input
          type="number"
          className="form-control"
          name="investment"
          value={form.investment}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      {/* Rotational Money */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="bi bi-arrow-repeat"></i></span>
        <input
          type="number"
          className="form-control"
          name="rotational"
          value={form.rotational}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <div className="d-flex justify-content-between">
        <button  className="" onClick={handleSubmit}>
          Save
        </button>
        <button type="button" className="" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
