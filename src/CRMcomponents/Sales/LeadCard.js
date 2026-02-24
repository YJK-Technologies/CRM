import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate } from "react-router-dom";
import './Column.css';
import { toast } from "react-toastify";
const config = require('../../Apiconfig');

// const styles = {
//   cardBase: {
//     position: 'relative',
//     overflow: 'hidden',
//     background: '#f9f9f9',
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     boxShadow: '0 6px 12px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.7), inset 0 -1px 3px rgba(0,0,0,0.1);',
//     transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
//   },
//   wonRibbonContainer: {
//     position: 'absolute',
//     top: '-5px',
//     right: '-5px',
//     zIndex: 10,
//     width: '100px',
//     height: '100px',
//     overflow: 'hidden',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   wonRibbon: {
//     position: 'absolute',
//     width: '150%',
//     height: '40px',
//     // backgroundImage: 'linear-gradient(45deg, #28a745 0%, #218838 51%, #28a745 100%)',
//     backgroundImage: 'linear-gradient(45deg, #00C853 0%, #00BFA5 60%, #4CAF50 100%)',
//     //  backgroundImage: 'linear-gradient(45deg, #4CAF50 0%, #388E3C 50%, #FFC107 100%)',
//     transform: 'rotate(45deg) translateY(-20px)',
//     boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
//     textAlign: 'center',
//     padding: '0',
//   },
//   wonRibbonText: {
//     color: 'white',
//     fontSize: '1em',
//     fontWeight: '700',
//     letterSpacing: '0.1em',
//     textTransform: 'uppercase',
//     lineHeight: '40px',
//     display: 'block',
//     width: '100%',
//   }
// };

export default function LeadCard({ item, index, onDeleteLead }) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(
    item.priority
      ? item.priority === "Low"
        ? 1
        : item.priority === "Medium"
          ? 2
          : 3
      : 0
  );

  const handleStarClick = async (value) => {
    const newRating = rating === value ? 0 : value;

    setRating(newRating);

    let priorityValue = "";
    if (newRating <= 1 && newRating > 0) priorityValue = "Low";
    else if (newRating === 2) priorityValue = "Medium";
    else if (newRating === 3) priorityValue = "High";

    try {
      const response = await fetch(`${config.apiBaseUrl}/updateNewCompanyPeriority`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Opportunity_ID: item.id,
          Priority: priorityValue, // send correct value
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error("Failed to update priority:", result.message);
      }
    } catch (err) {
      console.error("Error updating priority:", err);
    }
  };

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

  const handleDelete = async (e) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${config.apiBaseUrl}/CRM_NewCompanyDelete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Opportunity_ID: item.id,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Deleted successfully ✅");
        onDeleteLead(item.id, index);
      } else {
        const errorMsg =
          result?.message ||
          "Delete failed due to related records or server error.";
        toast.error(errorMsg);
        console.error("Delete failed:", errorMsg);
      }
    } catch (error) {
      toast.error("Error deleting record. Please try again later.");
      console.error("Error deleting lead:", error);
    }
  };

  const isWon = item.stage === 'won';

  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2 lead-card-3d"
          style={{
            userSelect: "none",
            background: snapshot.isDragging ? "#e0e0e0" : "#f9f9f9",
            ...provided.draggableProps.style,
          }}
        >
          {isWon && (
            <div className="won-ribbon-container">
              <div className="won-ribbon">
                <span className="won-ribbon-text">WON</span>
              </div>
            </div>
          )}
          <div className="card-body" style={{ padding: 0 }}>
            <div className="row">
              <div className="col-12 mb-1 d-flex align-items-center justify-content-between">
                <div className="d-flex w-100 me-2" onClick={handleClick}>
                  <h6 className="fw-bold flex-grow-1 text-start">{item.title}</h6>
                </div>
                <div className="dropdown">
                  <span
                    className="btn p-0 border-0"
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.2rem" }}></i>
                  </span>
                  <ul className="dropdown-menu rounded-0 dropdown-menu-end" aria-labelledby="dropdownMenuLink" style={{ fontSize: "1.0rem", padding: "5px", width: "100px" }}>
                    <li
                      className="dropdown-item"
                      onClick={handleClick}
                    >
                      Edit
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={handleDelete}
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              </div>

              {item.investment && (
                <div className="col-12 mb-1 d-flex align-items-center" onClick={handleClick}>
                  <i className="bi bi-currency-rupee me-1"></i>
                  <span className="fw-bold">{item.investment.toFixed(2)}</span>
                </div>
              )}

              {item.contact && (
                <div className="col-12 mb-1 d-flex align-items-center" onClick={handleClick}>
                  <i className="bi bi-person-fill me-1"></i>
                  <span>{item.contact}</span>
                </div>
              )}

              <div className="col-12 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  {[1, 2, 3].map((star) => (
                    <i
                      key={star}
                      className={`bi bi-star${rating >= star ? "-fill text-warning" : " text-secondary"}`}
                      style={{ fontSize: "18px", marginRight: "2px", cursor: "pointer" }}
                      onClick={() => handleStarClick(star)}
                    ></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
