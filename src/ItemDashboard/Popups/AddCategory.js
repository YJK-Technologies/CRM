import React from 'react';
import './popup.css'; // Import custom CSS for AddItem component

const AddItem = ({ closeCategory }) => {
  return (
    <div className="popup">
    <div className="popup-inner shadow-lg bg-body-tertiary rounded">
        



      <div class="d-flex justify-content-between mb-5 mt-5"><h2>Add Category</h2>
      <button className="btn-close p-2" onClick={closeCategory} style={{ float: 'right' }}></button>
      </div>
      <div class="mb-4 ms-5">
            <label >Enter Category:</label>
             </div>
       
     <div class="inputVar">      
<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="eg.Games" aria-label="Username"/>
</div></div> 
        
            <div class="Convertbtn" >
        <button type="button" className="btn btn-danger">Create</button>
        </div>
      
    </div>
  </div>
  );
};

export default AddItem;
