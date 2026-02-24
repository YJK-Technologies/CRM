import React from 'react';
import './popup.css'; // Import custom CSS for AddItem component

const AddItem = ({ closeItem }) => {
  return (
    <div className="popup">
    <div className="popup-inner shadow-lg bg-body-tertiary rounded">
        


        <div class="SelectItems">
      <div class="d-flex justify-content-between "><h2>Select Items</h2>
      <button className="btn-close p-2" onClick={closeItem} style={{ float: 'right' }}></button>
      </div>
      <div class="">
           
             </div>
       </div>
 <div class="selectItemsin">         
<div class="input-group mb-3 p-2">
  <input type="text" class="form-control" placeholder="eg.Games" aria-label="Username"/>
</div></div>  
        <div>
            <ul>


            <div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
  <label class="form-check-label" for="flexCheckDefault">
    Rice
  </label>
</div>
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
  <label class="form-check-label" for="flexCheckDefault">
    Chicken
  </label>
</div>
<div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
  <label class="form-check-label" for="flexCheckDefault">
    Meat
  </label>
</div>

            </ul>
        </div>
        <div class="CreateBtn">
        <button type="button" className="btn btn-danger mt-5">Move to Variant</button>
        </div>
      
    </div>
  </div>
  );
};

export default AddItem;
