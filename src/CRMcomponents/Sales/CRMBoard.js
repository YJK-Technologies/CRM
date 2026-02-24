import { useState, useEffect } from 'react';
import LeadModal from './modal';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import AddContactModal from './company';
import SalespersonSearch from './SalespersonSearch';
import SalesTeams from './SalesTeams';
import './Column.css';
const config = require('../../Apiconfig');

const initialData = {
  columns: {
    new: {
      name: 'New',
      items: []
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

function CRMBoard() {
  const [data, setData] = useState(initialData);
  const [modalShow, setModalShow] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [editingLead, setEditingLead] = useState(null);
  const [addingToColumn, setAddingToColumn] = useState('');
  const selectedTeam = JSON.parse(sessionStorage.getItem("selectedTeam"));
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showSalesPersonModal, setShowSalespersonModel] = useState(false);
  const [selectedsalesperon, setSelectedSalesperson] = useState(null);
  const [showSalesTeamModal, setShowSalesTeamModel] = useState(false);
  const [SelectedSalesTeam, setSelectedSalesTeam] = useState(null);

  useEffect(() => {
    if (!selectedTeam) {
      fetchLeads();
    } else {
      buildColumnsFromSelectedTeam(selectedTeam);
    }
    return () => {
      sessionStorage.removeItem("selectedTeam");
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      sessionStorage.removeItem("selectedTeam");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const buildColumnsFromSelectedTeam = (teamData) => {
    const freshColumns = {
      new: { name: "New", items: [] },
      qualified: { name: "Qualified", items: [] },
      proposal: { name: "Proposal", items: [] },
      won: { name: "Won", items: [] },
    };

    teamData.forEach((lead) => {
      const stage = lead.Stage?.toLowerCase() || "new";

      if (!freshColumns[stage]) {
        freshColumns[stage] = { name: lead.Stage, items: [] };
      }

      freshColumns[stage].items.push({
        id: lead.Opportunity_ID.toString(),
        title: lead.OpportunityName,
        contact: lead.Contact,
        investment: lead.ExpectedRevenue,
        priority: lead.Priority,
        stage: stage,
      });
    });

    setData({ columns: freshColumns });
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getNewCompany`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_code: sessionStorage.getItem("selectedCompanyCode") }),
      });

      const leads = await response.json();
      if (response.ok) {
        const freshColumns = {
          new: { name: "New", items: [] },
          qualified: { name: "Qualified", items: [] },
          proposal: { name: "Proposal", items: [] },
          won: { name: "Won", items: [] },
        };

        leads.forEach((lead) => {
          const stage = lead.Stage?.toLowerCase() || "new";

          if (!freshColumns[stage]) {
            freshColumns[stage] = { name: lead.Stage, items: [] };
          }

          freshColumns[stage].items.push({
            id: lead.Opportunity_ID.toString(),
            title: lead.OpportunityName,
            contact: lead.Contact,
            investment: lead.ExpectedRevenue,
            priority: lead.Priority,
            stage: stage,
          });
        });

        setData({ columns: freshColumns });
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  //company
  const handleCompanymodel = () => {
    setShowCompanyModal(true);
  };

  const handleCompanyClose = () => {
    setShowCompanyModal(false);
  };

  const handleSaveCompany = (id, name) => {
    console.log("Selected company:", id, name);
    setSelectedCompany({ id, name });
    setShowCompanyModal(false);
  };
  //sales Person Drop
  const handleSalesmodel = () => {
    setShowSalespersonModel(true);
  };

  const handleSalesPersonClose = () => {
    setShowSalespersonModel(false);
  };

  const handleSaveSalesPerson = (SalesCode, SalesPersonName) => {
    // console.log("Selected company:", SalesCode, SalesPersonName);
    setSelectedSalesperson({ SalesCode, SalesPersonName });
    setShowSalespersonModel(false);
  };

  //salesman drop

  const handleSalesTeamModel = () => {
    setShowSalesTeamModel(true);
  };

  const handleSalesTeamClose = () => {
    setShowSalesTeamModel(false);
  };

  const handleSaveSalesTeam = (SalesCode, SalesPersonName) => {
    // console.log("Selected company:", SalesCode, SalesPersonName);
    setSelectedSalesTeam({ SalesCode, SalesPersonName });
    setShowSalesTeamModel(false);
  };

  const startAddLead = (columnId) => {
    setAddingToColumn(columnId);
    setSelectedColumnId(columnId);
  };

  const cancelAddLead = () => {
    setAddingToColumn('');
  };

  const onDragEnd = async (result) => {
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
            items,
          },
        },
      }));
    } else {
      const sourceItems = Array.from(sourceCol.items);
      const destItems = Array.from(destCol.items);

      const [removed] = sourceItems.splice(source.index, 1);
      // destItems.splice(destination.index, 0, removed);

      const updatedRemoved = {
        ...removed,
        stage: destination.droppableId
      };

      destItems.splice(destination.index, 0, updatedRemoved);

      setData((prev) => ({
        columns: {
          ...prev.columns,
          [source.droppableId]: {
            ...sourceCol,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destCol,
            items: destItems,
          },
        },
      }));

      try {
        const response = await fetch(`${config.apiBaseUrl}/updateNewCompanyStage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Opportunity_ID: removed.id,
            Stage: destination.droppableId,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update stage");
        }

        const data = await response.json();
        console.log("Stage updated:", data);
      } catch (err) {
        console.error("Error updating stage:", err);
      }
    }
  };

  const openModal = (columnId, lead = null) => {
    setSelectedColumnId(columnId);
    setEditingLead(lead);
    setModalShow(true);
    setAddingToColumn(columnId);
  };

  //   const handleContact = () => {
  //     navigate("/TypesofContacts")
  //   }

  //   const handleSalesperson = () => {
  //     navigate("/SalespersonSearch")  
  //   }

  // const handleCompany = () => {
  //     navigate("/company")
  //   }

  const handleSaveLead = (newLead) => {
    const colId = newLead.stage || selectedColumnId;
    const col = data.columns[colId];

    const updatedItems = [...col.items, newLead];

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [colId]: {
          ...col,
          items: updatedItems,
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
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate = () => { navigate("/crmlistpage"); };
  const handleNavigate1 = () => { navigate("/CrmChart"); };
  const handleNavigate3 = () => { navigate("/CrmScheduler"); };
  const handleNavigate4 = () => { navigate("/CrmActivity"); };
  const handleNavigate5 = () => { navigate("/CrmLocation"); };
  const handleNavigateKanban = () => { navigate("/Crmworkspace"); };
  const handlesalesman = () => navigate("/Typesofcontacts");
  // const handleSalesperson = () => navigate("/CRMBoard");
  // const handleCompany = () => navigate("/CompanyDetails");


  return (
    <>
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="container-fluid Topnav-screen" style={{ width: "100%", minwidth: "510px" }} >
        <div className="shadow-lg p-0 mb-2 bg-white rounded" >
          <div className="d-flex justify-content-between flex-wrap p-0">
            <div className="d-flex justify-content-start align-items-center ps-3">
              <h1 className="h4 mb-0">CRM Workspace</h1>
            </div>
            <div className="d-flex justify-content-end flex-wrap p-2">
              <addbutton className={`nav-btn-container nav-btn-kanban ${isActive('/Crmworkspace') ? 'active' : ''}`} onClick={handleNavigateKanban} title="CRM Workspace">
                <i className="bi bi-kanban nav-btn-icon"></i>
              </addbutton>
              {/* <addbutton className={`nav-btn-container nav-btn-list ${isActive('/crmlistpage') ? 'active' : ''}`} onClick={handleNavigate} title="ListPage">
                <i className="bi bi-card-list nav-btn-icon"></i>
              </addbutton> */}
              <addbutton className={`nav-btn-container nav-btn-calendar ${isActive('/CrmScheduler') ? 'active' : ''}`} onClick={handleNavigate3} title="Scheduler">
                <i className="bi bi-calendar3 nav-btn-icon"></i>
              </addbutton>
              <addbutton className={`nav-btn-container nav-btn-chart ${isActive('/CrmChart') ? 'active' : ''}`} onClick={handleNavigate1} title="Report">
                <i className="bi bi-bar-chart-fill nav-btn-icon"></i>
              </addbutton>
              {/* <addbutton className={`nav-btn-container nav-btn-activity ${isActive('/CrmActivity') ? 'active' : ''}`} onClick={handleNavigate4}>
                <i className="bi bi-stopwatch nav-btn-icon"></i>
              </addbutton> */}
              <addbutton className={`nav-btn-container nav-btn-location ${isActive('/CrmLocation') ? 'active' : ''}`} onClick={handleNavigate5} title="Location">
                <i className="bi bi-geo-alt-fill nav-btn-icon"></i>
              </addbutton>
              {/* <div className="mb-2 p-0 d-flex justify-content-end flex-wrap me-5">
            <div className="dropdown"> */}
              <button
                className="btn btn-outline-success dropdown-toggle rounded-circle d-flex justify-content-center align-items-center mt-2"
                style={{
                  width: "40px",
                  height: "40px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                type="button"
                data-bs-toggle="dropdown"
                title="Options"
                aria-expanded="false"
              >
                <i className="bi bi-sliders"></i>
              </button>
              <div className="dropdown mb-3">
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={handleCompanymodel}>
                      <i className="bi bi-building me-2"></i> Company
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleSalesmodel}>
                      <i className="bi bi-person-lines-fill me-2" ></i> Salesperson
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleSalesTeamModel}>
                      <i className="bi bi-person-badge me-2"></i> Salesman
                    </button>
                  </li>
                </ul>
              </div>

              {/* Selected company display */}
              {selectedCompany && (
                <div className="alert alert-info w-50">
                  <strong>Selected Company:</strong> {selectedCompany.name}
                </div>
              )}

              {/* AddContactModal - Search Company Screen */}
              {showCompanyModal && (
                <AddContactModal
                  showCompany={showCompanyModal}
                  onCompanyClose={handleCompanyClose}
                  onSaveCompany={handleSaveCompany}
                />
              )}

              {selectedsalesperon && (
                <div className="alert alert-info w-50">
                  <strong>Selected Company:</strong> {selectedsalesperon.SalesPersonName}
                </div>
              )}
              {/* AddsalespersonModal - Search salesperson Screen */}
              {showSalesPersonModal && (
                <SalespersonSearch
                  showSpSearch={showSalesPersonModal}
                  onSpSearchClose={handleSalesPersonClose}
                  onSalespersonSaved={handleSaveSalesPerson}
                />
              )}

              {SelectedSalesTeam && (
                <div className="alert alert-info w-50">
                  <strong>Selected Sales Team:</strong> {SelectedSalesTeam.SalesPersonName}
                </div>
              )}
              {/* AddsalespersonModal - Search salesperson Screen */}
              {showSalesTeamModal && (
                <SalesTeams
                  showSalesTeamSearch={showSalesTeamModal}
                  onSalesTeamSearchClose={handleSalesTeamClose}
                  onSaveSalesTeam={handleSaveSalesTeam}
                />
              )}

            </div>
          </div>
        </div>

        <div className="shadow-lg p-3 bg-white rounded" style={{ width: "100%", minWidth: "375px" }} >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="d-flex flex-wrap" style={{ width: "100%", minWidth: "375px", gap: "10px" }} >
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
                  onDeleteLead={(leadId) => handleDeleteLead(id, leadId)}
                />
              ))}
            </div>
          </DragDropContext>
        </div>

      </div>
    </>
  );
}

export default CRMBoard;