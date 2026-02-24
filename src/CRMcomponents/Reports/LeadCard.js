import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate } from "react-router-dom";

const config = require('../../Apiconfig');

export default function LeadCard({ item, index }) {
  const iconStyle = {
    width: '18px',
    marginRight: '6px',
    color: '#0d6efd'
  };

  const cardContainerStyle = {
    marginBottom: '5px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '8px',
    borderRadius: '4px',
  };

  const cardContentStyle = {
    padding: '0',
  };

  const cardDetailLineStyle = {
    marginBottom: '2px',
    fontSize: '0.85rem',
  };

  const titleStyle = {
    fontSize: '0.95rem',
    marginBottom: 0,
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getOpportunityDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Opportunity_ID: item.id,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/pipeline", { state: { data } });
      } else {
        console.error("Failed to fetch details:", data.message);
      }
    } catch (err) {
      console.error("Error fetching opportunity details:", err);
    }
  };


  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card"
          style={{
            ...cardContainerStyle,
            userSelect: "none",
            background: snapshot.isDragging ? "#e9ecef" : "white",
            width: '100%',
            boxSizing: 'border-box',
            ...provided.draggableProps.style,
          }}
        >
          <div className="card-body" onClick={handleClick} style={cardContentStyle}>
            <div className="d-flex align-items-center" style={{ marginBottom: '4px' }}>
              <h6 className="fw-bold flex-grow-1" style={titleStyle}>{item.title}</h6>
            </div>

            {item.company && <div className="d-flex align-items-center" style={cardDetailLineStyle}>
              <i className="bi bi-building" style={iconStyle}></i>
              <span>{item.company}</span>
            </div>}

            {item.contact && <div className="d-flex align-items-center" style={cardDetailLineStyle}>
              <i className="bi bi-person" style={iconStyle}></i>
              <span>{item.contact}</span>
            </div>}

            {item.email && <div className="d-flex align-items-center" style={cardDetailLineStyle}>
              <i className="bi bi-envelope" style={iconStyle}></i>
              <span> {item.email}</span>
            </div>}

            {item.phone && <div className="d-flex align-items-center" style={cardDetailLineStyle}>
              <i className="bi bi-telephone" style={iconStyle}></i>
              <span> {item.phone}</span>
            </div>}

            {item.investment && <div className="d-flex align-items-center" style={cardDetailLineStyle}>
              <i className="bi bi-cash" style={iconStyle}></i>
              <span> ₹{item.investment}</span>
            </div>}

            {/* {item.payment && <div className="col-12 mb-1 d-flex align-items-center">
              <i className="bi bi-currency-dollar" style={iconStyle}></i>
              <span> ₹{item.payment}</span>
            </div>} */}

            {item.SalesPersonName && <div className="d-flex align-items-center" style={cardDetailLineStyle}>
              <i className="bi bi-person-circle text-dark" style={iconStyle}></i>
              <span> {item.SalesPersonName}</span>
            </div>}

            {item.Stage && (
              <div className="d-flex align-items-center" style={cardDetailLineStyle}>
                <i className="bi bi-diagram-3 text-dark" style={iconStyle}></i>
                <span>{item.Stage}</span>
              </div>
            )}

            {/* <span
              className="text-danger d-flex justify-content-end"
              onClick={() => onDeleteLead(item.id)}
            >
              <i className="bi bi-trash" style={{ fontSize: "1.5rem" }}></i>
            </span> */}
          </div>
        </div>
      )}
    </Draggable>
  );
}