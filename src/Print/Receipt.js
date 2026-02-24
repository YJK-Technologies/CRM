import React from "react";
import "./Receipt.css";

const Receipt = () => {
  return (
    <div className="receipt-container">
      <div className="receipt">
        <h2 className="store-name">M.S. VIJAYALAKSHMI TEXTILES</h2>
        <p className="store-address">
          No. 708&72, Hari Haran Bazaar Street, PONNERI - 601204.
        </p>
        <p className="store-contact">Ph: 044-27972339, 9789634560, 7094293456</p>
        <hr />
        <div className="receipt-details">
          <p><strong>B.No:</strong> 69486 <strong>SID:</strong> 0 <strong>Date:</strong> 17-01-2025 18:19</p>
        </div>
        <hr />
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Item</th>
              <th>Rate</th>
              <th>Disc</th>
              <th>Qty</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>PANT READYMADE</td>
              <td>730.00</td>
              <td>73.00</td>
              <td>1</td>
              <td>657.00</td>
            </tr>
            <tr>
              <td>2</td>
              <td>SHIRT READYMADE</td>
              <td>450.00</td>
              <td>45.00</td>
              <td>1</td>
              <td>405.00</td>
            </tr>
            <tr>
              <td>3</td>
              <td>DHOTIES & SHIRT</td>
              <td>1550.00</td>
              <td>77.50</td>
              <td>3</td>
              <td>1472.00</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div className="totals">
          <p>Total Qty: 3</p>
          <p>Discount: 195.50</p>
          <p>Round Off: 0.50</p>
          <h3>Net Amount: 2,535.00</h3>
        </div>
        <hr />
        <div className="payment-details">
          <p>Total Amount: 2730.00</p>
          <p>Discount: 195.50</p>
          <h3>Net Amount: 2535.00</h3>
        </div>
        <p className="exchange-policy">
          ANY EXCHANGE BRING BILL WITH PRICE TAG WITHIN 7 DAYS. <br />
          NO RETURN CASH. <br />
          Thank You. Visit Again.
        </p>
      </div>
    </div>
  );
};

export default Receipt;
