import React from 'react';
import './NewContactModal.css'; // Optional: use this for custom styling

const NewContactModal = ({ showC, onCloseC, onSaveC }) => {
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
                  <input type="text" className="form-control" placeholder="Enter full name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Email</label>
                  <input type="email" className="form-control" placeholder="Enter email" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Phone</label>
                  <input type="text" className="form-control" placeholder="Enter phone" />
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex justify-content-start">Country</label>
                  <select className="form-select">
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="India">India</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label d-flex justify-content-start">Notes</label>
                <textarea className="form-control" rows="3" placeholder="Additional details"></textarea>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="" onClick={onSaveC}>Save</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewContactModal;
