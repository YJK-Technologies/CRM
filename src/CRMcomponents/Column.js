import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';
import LeadForm from './modal';

export default function Column({
  droppableId,
  column,
  onAddLead,
  isAdding,
  onCancelAddLead,
  onSubmitAddLead,
  onEditLead,
  onDeleteLead
}) {
  return (
    <div className="card shadow-sm m-2 " style={{ minWidth: "350px", flex: 1 }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{column.name}</h5>
        <button className=" mb-2" onClick={onAddLead}>
          <i className="bi bi-plus-circle me-1"></i> Lead
        </button>
      </div>
      <div className="card-body">
        {isAdding && (
          <LeadForm
            onSubmit={onSubmitAddLead}
            onCancel={onCancelAddLead}
          />
        )}

        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: "100px",
                background: snapshot.isDraggingOver ? "#f0f0f0" : "transparent",
                padding: 4,
              }}
            >
              {column.items.map((item, index) => (
                <LeadCard
                  key={item.id}
                  item={item}
                  index={index}
                  onDoubleClick={() => onEditLead(item)}
                  onDeleteLead={(id) => onDeleteLead(id)}  // Make sure this function is passed down

                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
