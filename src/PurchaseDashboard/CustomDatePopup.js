import React from 'react';
import './Pro.css'; // Import custom CSS for AddItem component

const AdjustItem = ({ closeAdjustItem }) => {
  return (
    <div className="popup">
    <div className="popup-inner shadow-lg bg-body-tertiary rounded">
      <div class="d-flex justify-content-between">
        <h2 class="ms-4">Select Date</h2>
      <button className="btn-close p-2" onClick={closeAdjustItem} ></button>
      </div>
    </div>
  </div>
  );
};

export default AdjustItem;
