import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Item.css'; // Import CSS file for styling

const Tabs = () => {
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState(0); // Set default active tab index to 0

  useEffect(() => {
    // Navigate to the corresponding tab when the component mounts or ActiveTab changes
    if (ActiveTab === 0) {
      navigate('/ItemData');  
    } else if (ActiveTab === 1) {
      navigate('/VarientData');
    } else if (ActiveTab === 2) {
      navigate('/UnitData');
    }
  }, [ActiveTab, navigate]);

  const handleNavigate1 = () => {
    setActiveTab(0); // Update active tab index
  };

  const handleNavigate2 = () => {
    setActiveTab(1); // Update active tab index
  };

  const handleNavigate3 = () => {
    setActiveTab(2); // Update active tab index
  };


  return (
    <div class="tabs"> 
   <div class="shadow-lg p-3 bg-body-tertiary rounded"> 
   <div class="radio-inputs">
  <label class="radio">
    <input type="radio" name="radio" onClick={handleNavigate1} />
    <span class="name">Item </span>
  </label>
  <label class="radio">
    <input type="radio" name="radio" onClick={handleNavigate2}/>
    <span class="name">Varient </span>
  </label>
      
  <label class="radio">
    <input type="radio" name="radio" onClick={handleNavigate3}/>
    <span class="name">Unit </span>
  </label>
</div></div></div>
  );
};

export default Tabs;
