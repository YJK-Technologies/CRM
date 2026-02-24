import { Droppable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';

export default function Column({
  droppableId,
  column,
  onEditLead,
  onDeleteLead,
  highlightedColumn,
  onDeleteColumn
}) {
  const isHighlighted = highlightedColumn === droppableId;
  const fixedContentHeight = '650px';

  return (
    <div className="card shadow-sm mb-1 my-2 col-md-4 m-2" style={{ minWidth: "350px", flex: 1 }}>
      <div className="d-flex justify-content-between align-items-center p-1">
        <h5 className="mb-0 gradientText">{column.name}</h5>
      </div>
      <div className="card-body" style={{
        maxHeight: fixedContentHeight, padding: "8px", maxHeight: "70vh", overflowY: 'auto',
      }}>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: '100px',
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
