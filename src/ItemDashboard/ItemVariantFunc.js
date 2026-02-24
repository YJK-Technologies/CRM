import React, { useState, useEffect } from 'react';
const config = require('../Apiconfig');
const YourComponent = () => {
  const [selectedPro, setSelectedPro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Standard_Sales_Price, setStandard_Sales_Price] = useState('');
  const [Standard_Purchase_Price, setStandard_Purchase_Price] = useState('');
  const [Item_stock, setItem_stock] = useState('');
  const [Stock_Value, setStock_Value] = useState('');

  const SelectItem = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getitemstockvalue`);
      if (!response.ok) {
        throw new Error('Failed to fetch item names');
      }
      const data = await response.json();
      setSelectedPro(data); // Set item names in state
      // Assuming data contains the necessary fields
      setStandard_Sales_Price(data.Standard_Sales_Price);
      setStandard_Purchase_Price(data.Standard_Purchase_Price);
      setItem_stock(data.Item_stock);
      setStock_Value(data.Stock_Value);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleItemClick = () => {
    SelectItem();
  };

  return (
    <div>
      <button onClick={handleItemClick}>Select Item</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="d-flex justify-content-between me-5">
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <p className="price">Sale Price: </p>
              <div>
                <p style={{ color: 'green' }}>{Standard_Sales_Price}</p>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <p className="price">Purchase Price: </p>
              <div>
                <p style={{ color: 'green' }}>{Standard_Purchase_Price}</p>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <p className="price">Stock qty: </p>
              <div>
                <p style={{ color: 'green' }}>{Item_stock}</p>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <p className="price">Stock Value: </p>
              <div>
                <p style={{ color: 'green' }}>{Stock_Value}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourComponent;
