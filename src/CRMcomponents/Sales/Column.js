import { Droppable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';
import LeadForm from './modal';
import './Column.css';

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
  const fixedContentHeight = '650px';

  return (
    <div className="card shadow-sm mb-1 my-2 col-12 col-md-4" style={{ minWidth: "300px", flex: 1, marginRight: "10px" }}>
      <div className="d-flex justify-content-between align-items-center p-1">
        <h5 className="mb-0 gradientText">{column.name} ({column.items.length})</h5>
        <button className="Btn" onClick={() => onAddLead(droppableId)}>
          <div className="sign">+</div>
          <div className="text" title='Create'>Create</div>
        </button>
      </div>
      <div className="card-body" style={{ 
       maxHeight: fixedContentHeight,     padding: "8px",    maxHeight: "70vh",overflowY:'auto',}}>
        {isAdding && (
          <LeadForm
            selectedColumnId={droppableId}
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
                minHeight:'100px',
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
                  onDeleteLead={(id) => onDeleteLead(id)}
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
