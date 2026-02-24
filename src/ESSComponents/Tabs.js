import React from 'react';
import './EmployeeLoan.css'

const TabButtons = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="shadow-lg bg-white rounded-top mt-2  pt-3">
    
    
    <div className='mobvi'>
      <div className="d-flex flex-wrap justify-content-start  me-3">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`p-1 ms-2 shadow-sm addTab1 ${activeTab === tab.label ? '' : ''}`}
            onClick={() => onTabClick(tab.label)}
            style={{
              minWidth: '200px', 
              flex: '1 1 auto',  
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      </div>
  
    <div className='Des'>
      <div className="d-flex flex-wrap justify-content-start me-3 ">
        {tabs.map((tab, index) => (
          <purButton
            key={index}
            className={`p-1 ms-2 shadow-sm  ${activeTab === tab.label ? 'bg-none ' : ''}`}
            onClick={() => onTabClick(tab.label)}
          >
            {tab.label}
          </purButton>
        ))}
      </div>
      </div>
    </div>
  );
};

export default TabButtons;
