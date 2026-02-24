import React from 'react';
import './popup.css'; // Import custom CSS for AddItem component

const AddItem = ({ closeAddItem }) => {
  return (
    <div className="popup">
    <div className="popup-inner shadow-lg bg-body-tertiary rounded">
      <div class="">
      <div class="d-flex justify-content-between mt-5">
        <h2>Add Item</h2>
      <button className="btn-close p-2" onClick={closeAddItem} style={{ float: 'right' }}></button>
      </div>
      <form>
        <div class="body">
    <div class="row-1">
        <div className="col mt-3 mb-3">
          <input type="text" className="form-control" placeholder="Item Name" />
        </div>
        <div className=" col mb-3">
          <input type="text" className="form-control" placeholder="Item HSN" />
        </div>
        <div className="mb-3 d-flex justify-content-between">
          <button type="button" className="btn btn-secondary">Select Unit</button>
          <button type="button" className="btn btn-secondary">Add Item Image</button>
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Category" />
        </div>
        <div className="mb-3 d-flex">
          <input type="text" className="form-control me-2" placeholder="Item Code"/>
          <button type="button" className="btn btn-secondary">Assign Code</button>
        </div>
        <h3>Pricing</h3>
        <div className="mb-3 d-flex align-items-center">
          <input type="text" className="form-control me-2" placeholder="Sale Price"/>
          <select className="form-select me-2">
            <option>Without Tax</option>
            <option>With Tax</option>
          </select>
          
        </div>
        <div className="mb-3 d-flex align-items-center">
          <input type="text" className="form-control me-2" placeholder="WholeSale Price"/>
          <select className="form-select me-2">
            <option>Without Tax</option>
            <option>With Tax</option>
          </select>
          
        </div>
        <div className="mb-3 d-flex align-items-start">
          <input type="text" className="form-control me-2" placeholder="Purchase Price" />
          <select className="form-select me-2">
            <option>Without Tax</option>
            <option>With Tax</option>
          </select>
        </div>
        <div className="mb-3">
          <select className="form-select">
            <option>Tax Rate</option>
            <option>None</option>
          </select>
        </div>
        <button type="button" className="btn btn-primary">Save</button>
        </div></div>
      </form>
    </div></div>
  </div>
  );
};

export default AddItem;
