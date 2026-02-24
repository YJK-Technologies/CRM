import React from 'react';
import './popup.css'; // Import custom CSS for AddItem component

const AddItem = ({ closeConversion }) => {
  return (
    <div className="popup">
      <div className="popup-inner shadow-lg bg-body-tertiary rounded p-4">
        <div className="d-flex justify-content-between mb-5 p-3">
          <h2>Add Conversion</h2>
          <button className="btn-close p-2" onClick={closeConversion} style={{ float: 'right' }}></button>
        </div>
        <div className="mb-3 ms-4">
          <label>Enter Category:</label>
        </div>
        <div className="row mb-3 ms-4">
          <div className="col-12 col-md-4 mb-3">
            <label>Base Unit</label>
            <input type="text" className="form-control" placeholder="eg. Games" aria-label="Base Unit" />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <label>Rate</label>
            <input type="text" className="form-control" placeholder="eg. Clothes" aria-label="Rate" />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <label>Secondary Unit</label>
            <input type="text" className="form-control" placeholder="eg. Accessories" aria-label="Secondary Unit" />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger me-3">Add Conversion</button>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
