import React from 'react';
import './popup.css'; // Import custom CSS for AddItem component

const AddItem = ({ closeUnit }) => {
  return (
    <div className="popup">
      <div className="popup-inner shadow-lg bg-body-tertiary rounded p-4">
        <div className="d-flex justify-content-between mb-5 mt-2">
          <h2 className="ms-3">NEW UNIT</h2>
          <button className="btn-close p-2 me-3" onClick={closeUnit}></button>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">UNIT NAME:</label>
            <input type="text" className="form-control" placeholder="bottle" aria-label="UnitName" />
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">SHORT NAME:</label>
            <input type="text" className="form-control" placeholder="Name.." aria-label="ShortName" />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-primary">SAVE</button>
          <button type="button" className="btn btn-secondary">SAVE NEW</button>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
