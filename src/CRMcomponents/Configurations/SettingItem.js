import React from 'react';
import { Info } from 'lucide-react'; // Optional: Replace with Bootstrap icon if preferred

const SettingItem = ({ title, description, buttonText, onButtonClick, infoIcon }) => {
  return (
    <div className=" p-3 bg-none text-dark shadow-sm ">
      <div className="">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id={title} />
          <label className="form-check-label" htmlFor={title}>
            <div className="d-flex align-items-start gap-2">
              <div className="fw-bold">
                {title} {infoIcon && <Info size={14} className="text-light ms-1" />}
              </div>
            </div>
          </label>
        </div>
        <p className="mt-2 fs-7">{description}</p>

       
      </div>
    </div>
  );
};

export default SettingItem;
