import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

// Make sure to import bootstrap-icons CSS in your project for these to work:
// import 'bootstrap-icons/font/bootstrap-icons.css';

export default function LeadCard({ item, index, onDoubleClick , onDeleteLead }) {
  const iconStyle = { width: '18px', marginRight: '6px', color: '#0d6efd' };

  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card mb-2 shadow-sm p-3"
          style={{
            userSelect: "none",
            background: snapshot.isDragging ? "#e9ecef" : "white",
            ...provided.draggableProps.style,
          }}
        >
          <div className="card-body p-0 ">
            <div className="row">
              <div className="col-12 mb-1 d-flex align-items-center">
                <h6 className="mb-0 fw-bold flex-grow-1">{item.title}</h6>
              </div>

              {item.company && (
                <div className="col-12 mb-1 d-flex align-items-center">
                  <i className="bi bi-building" style={iconStyle}></i>
                  <span>
                    <strong>Company:</strong> {item.company}
                  </span>
                </div>
              )}

              {item.contact && (
                <div className="col-12 mb-1 d-flex align-items-center">
                  <i className="bi bi-person" style={iconStyle}></i>
                  <span>
                    <strong>Contact:</strong> {item.contact}
                  </span>
                </div>
              )}

              {item.email && (
                <div
                  className="col-12 mb-1 d-flex align-items-center justify-content-start"
                  style={{ wordBreak: "break-word", fontSize: "14px" }}
                >
                  <i className="bi bi-envelope" style={iconStyle}></i>
                  <span style={{ whiteSpace: "normal" }}>
                    <strong>Email:</strong> {item.email}
                  </span>
                </div>
              )}

              {item.phone && (
                <div className="col-12 mb-1 d-flex align-items-center">
                  <i className="bi bi-telephone" style={iconStyle}></i>
                  <span>
                    <strong>Phone:</strong> {item.phone}
                  </span>
                </div>
              )}

              {item.investment && (
                <div className="col-12 mb-1 d-flex align-items-center">
                  {/* <i className="bi bi-currency-rupee" </i> */}
                  <i class="bi bi-cash" style={iconStyle}></i>
                  <span> ₹{item.investment}</span>
                </div>
              )}

              {item.rotational && (
                <div className="col-12 mb-1 d-flex align-items-center">
                  <i className="bi bi-arrow-repeat" style={iconStyle}></i>
                  <span>₹{item.rotational}</span>
                </div>
              )}

              <span
                className="text-danger d-flex justify-content-end"
                onClick={() => onDeleteLead(item.id)}
              >
                <i class="bi bi-trash" style={{ fontSize: "1.5rem" }}></i>
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
