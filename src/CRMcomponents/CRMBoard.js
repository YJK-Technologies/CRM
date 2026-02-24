import { useState } from 'react';
import LeadModal from './modal';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { useNavigate } from "react-router-dom";

const initialData = {
  columns: {
    new: {
      name: 'New',
      items: [
        // {
        //   id: 'lead-1',
        //   company: 'Company X',
        //   contact: 'John Doe',
        //   opportunity: 'Website Revamp',
        //   email: 'john@example.com',
        //   phone: '1234567890',
        //   investment: 10000,
        //   rotational: 3000
        // },
        // {
        //   id: 'lead-2',
        //   company: 'Company Y',
        //   contact: 'Jane Smith',
        //   opportunity: 'Mobile App',
        //   email: 'jane@example.com',
        //   phone: '9876543210',
        //   investment: 20000,
        //   rotational: 5000
        // }
      ]
    },
    qualified: {
      name: 'Qualified',
      items: []
    },
    proposal: {
      name: 'Proposal',
      items: []
    },
    won: {
      name: 'Won',
      items: []
    }
  }
};

export default function CRMBoard() {
  const [data, setData] = useState(initialData);
  const [modalShow, setModalShow] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [editingLead, setEditingLead] = useState(null);
  const [addingToColumn, setAddingToColumn] = useState('');

  const startAddLead = (columnId) => {
    setAddingToColumn(columnId);
    setSelectedColumnId('');
  };

  const cancelAddLead = () => {
    setAddingToColumn('');
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(sourceCol.items);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      setData((prev) => ({
        columns: {
          ...prev.columns,
          [source.droppableId]: {
            ...sourceCol,
            items
          }
        }
      }));
    } else {
      const sourceItems = Array.from(sourceCol.items);
      const destItems = Array.from(destCol.items);

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setData((prev) => ({
        columns: {
          ...prev.columns,
          [source.droppableId]: {
            ...sourceCol,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destCol,
            items: destItems
          }
        }
      }));
    }
  };

  const openModal = (columnId, lead = null) => {
    setSelectedColumnId(columnId);
    setEditingLead(lead);
    setModalShow(true);
    setAddingToColumn('');
  };

  const handleSaveLead = (newLead) => {
    const colId = selectedColumnId || addingToColumn;
    const col = data.columns[colId];

    const updatedItems = editingLead
      ? col.items.map((item) => (item.id === newLead.id ? newLead : item))
      : [...col.items, newLead];

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [colId]: {
          ...col,
          items: updatedItems
        }
      }
    }));

    setModalShow(false);
    setEditingLead(null);
    setAddingToColumn('');
  };

  const handleDeleteLead = (columnId, leadId) => {
  const col = data.columns[columnId];
  const updatedItems = col.items.filter((item) => item.id !== leadId);

  setData((prev) => ({
    ...prev,
    columns: {
      ...prev.columns,
      [columnId]: {
        ...col,
        items: updatedItems
      }
    }
  }));
};
  const navigate = useNavigate();

 const handleNavigate = () => {
    navigate("/crmlistpage"); // Pass selectedRows as props to the Input component
  };
   const handleNavigate1 = () => {
    navigate("/CrmChart"); // Pass selectedRows as props to the Input component
  };

  

  return (
    <>
      <div className="container-fluid Topnav-screen">
        <div className="shadow-lg p-2 mb-2 bg-white rounded">
          <div className="d-flex justify-content-between flex-wrap p-3">
            <div className="d-flex justify-content-start">
              <h1 className="">CRM Workspace</h1>
            </div>
            <div className="d-flex justify-content-end">
             
              <addbutton className="mt-2 " onClick={handleNavigate}>
                <i class="bi bi-card-list text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 ">
                <i class="bi bi-calendar3 text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate1}>
                <i class="bi bi-bar-chart-fill text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 ">
                <i class="bi bi-stopwatch text-dark fs-4"></i>
              </addbutton>
            </div>
          </div>
        </div>

        <div className="shadow-lg p-3 bg-white rounded">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="d-flex justify-content-between flex-wrap p-3">
              {Object.entries(data.columns).map(([id, column]) => (
                <Column
                  key={id}
                  droppableId={id}
                  column={column}
                  onAddLead={() => startAddLead(id)}
                  isAdding={addingToColumn === id}
                  onCancelAddLead={cancelAddLead}
                  onSubmitAddLead={handleSaveLead}
                  onEditLead={(lead) => openModal(id, lead)}
                  onDeleteLead={(leadId) => handleDeleteLead(id, leadId)} // NEW
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Modal for editing leads */}
      {modalShow && (
        <LeadModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            setEditingLead(null);
          }}
          initialData={editingLead}
          onSubmit={handleSaveLead}
        />
      )}
    </>
  );
}
