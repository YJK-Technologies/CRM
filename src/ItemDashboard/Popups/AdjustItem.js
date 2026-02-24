import React from 'react';
import './popup.css'; // Import custom CSS for AddItem component

const AdjustItem = ({ closeAdjustItem }) => {
  return (
    <div className="popup">
    <div className="popup-inner shadow-lg bg-body-tertiary rounded">
      <div class="d-flex justify-content-between">
        <h2 class="ms-4">Stock Adjustment</h2>
      <button className="btn-close p-2" onClick={closeAdjustItem} style={{ float: 'right' }}></button>
      </div>
      <form>
    <div class="row">
        <div className="col mt-3 mb-3">
          
          <div class="d-flex justify-content-between">
          <label class="ms-0 mb-5">Item Name:</label>
          
                          
                  <div class="dropdown">
                  <a class="btn btn-secondary dropdown-toggle" style={{fontSize:"12px"}} href="#" role="button" data-bs-toggle="dropdown"
                   aria-expanded="false">
                    Add or Reduce Stock
                  </a>

                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Add Stock</a></li>
                    <li><a class="dropdown-item" href="#">Reduce Stock</a></li>
                  </ul>
                      </div>
                  
                  
                  </div>



          <div>
            <label class="mb-3">Adjustment Date:</label>
           <input type='date' class="form-control"  placeholder='MM/YY'/> 
          </div>
        </div>
        <hr />
        <div className=" col mb-2">
          <input type="text" className="form-control" placeholder="Total Qty" />
        </div>
        <div className="col mb-3 ">
        <input type="text" className="form-control" placeholder="At Price" />
        </div>
        <div className=" col mb-3">
          <input type="text" className="form-control" placeholder="Details" />
        </div>
        <hr />
         <button type="button" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default AdjustItem;
