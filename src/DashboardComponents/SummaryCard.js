
// SummaryCard.js
import React from 'react';

const SummaryCard = ({ title, amount, bgColor, textColor }) => {
  return (
    <div className={`card ${bgColor} ${textColor} text-center`}>
      <div className="card-body">
      <div class="d-flex justify-content-between">
        <p className="card-title">{title}</p>
        <p className="card-text">{amount}</p>
      </div></div>
    </div>
  );
};

export default SummaryCard;
