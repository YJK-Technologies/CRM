import { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate, useLocation } from "react-router-dom";
import './Column.css';

export default function CRMBoard() {
  const navigate = useNavigate();

  const defaultColumns = [
    { headerName: 'Created On', field: 'createdOn' },
    { headerName: 'Opportunities', field: 'name' },
    { headerName: 'Customer', field: 'email' },
    { headerName: 'Contact Number', field: 'phone' },
    { headerName: 'Email', field: 'activities' },
    { headerName: 'Phone', field: 'country' },
    { headerName: 'City', field: 'status' },
    { headerName: 'Country', field: 'source' },
    { headerName: 'Sales Person', field: 'product' },
    { headerName: 'Sales Team', field: 'industry' },
    { headerName: 'Priority', field: 'revenue' },
    { headerName: 'Activities', field: 'investment' },
    { headerName: 'Activity By', field: 'rotational' },
    { headerName: 'My Deadline', field: 'stage' },
    { headerName: 'Campaign', field: 'nextStep' },
    { headerName: 'Medium', field: 'owner' },
    { headerName: 'Source', field: 'createdBy' },
    { headerName: 'Expected Revenue', field: 'updatedOn' },
    { headerName: 'Expected Closing', field: 'rating' },
    { headerName: 'Stage', field: 'region' },
    { headerName: 'Probability', field: 'state' },
    { headerName: 'Lost Reason', field: 'city' },
    { headerName: 'Tags', field: 'zip' }
  ];

  const [customColumns, setCustomColumns] = useState([]);
  const [visibleFields, setVisibleFields] = useState([
    'name', 'email', 'phone', 'activities', 'country'
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);

  const allColumns = useMemo(() => [...defaultColumns, ...customColumns], [defaultColumns, customColumns]);

  const columnDefs = useMemo(() => {
    return allColumns.filter(col => visibleFields.includes(col.field));
  }, [allColumns, visibleFields]);

  const toggleColumn = (field) => {
    setVisibleFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleAddCustomColumn = () => {
    if (!newColumnName.trim()) return;

    const fieldKey = newColumnName.trim().toLowerCase().replace(/\s+/g, '_');

    const exists = allColumns.some(col => col.field === fieldKey);
    if (exists) {
      setNewColumnName('');
      setShowAddColumnModal(false);
      return;
    }

    const newCol = {
      headerName: newColumnName.trim(),
      field: fieldKey
    };

    setCustomColumns(prev => [...prev, newCol]);
    setVisibleFields(prev => [...prev, fieldKey]);
    setNewColumnName('');
    setShowAddColumnModal(false);
  };

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate = () => { navigate("/Crmworkspace"); };
  const handleNavigate1 = () => { navigate("/Crmlistpage"); };
  const handleNavigate2 = () => { navigate("/CrmChart"); };
  const handleNavigate3 = () => { navigate("/CrmScheduler"); };
  const handleNavigate4 = () => { navigate("/CrmActivity"); };
  const handleNavigate5 = () => { navigate("/CrmLocation"); };

  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap p-0">
          <div className="d-flex justify-content-start  align-items-center ps-3">
            <h1 className="h4 mb-0">CRM Workspace</h1>
          </div>
          <div className="d-flex justify-content-end flex-wrap p-2">
            <addbutton className={`nav-btn-container nav-btn-kanban ${isActive('/Crmworkspace') ? 'active' : ''}`} onClick={handleNavigate} title="Crmworkspace">
              <i className="bi bi-kanban nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-list ${isActive('/crmlistpage') ? 'active' : ''}`} onClick={handleNavigate1} title="ListPage">
              <i className="bi bi-card-list nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-calendar ${isActive('/CrmScheduler') ? 'active' : ''}`} onClick={handleNavigate3} title="Scheduler">
              <i className="bi bi-calendar3 nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-chart ${isActive('/CrmChart') ? 'active' : ''}`} onClick={handleNavigate2} title="Report">
              <i className="bi bi-bar-chart-fill nav-btn-icon"></i>
            </addbutton>
            {/* <addbutton className={`nav-btn-container nav-btn-activity ${isActive('/CrmActivity') ? 'active' : ''}`} onClick={handleNavigate4}>
              <i className="bi bi-stopwatch nav-btn-icon"></i>
            </addbutton> */}
            <addbutton className={`nav-btn-container nav-btn-location ${isActive('/CrmLocation') ? 'active' : ''}`} onClick={handleNavigate5} title="Location">
              <i className="bi bi-geo-alt-fill nav-btn-icon"></i>
            </addbutton>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="shadow-lg p-3 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap p-3">
          <div className="d-flex justify-content-start">
            <div className="ms-3">
              <label className="form-label col-md-2 fw-bold fs-6">
                Search:
              </label>
              <input
                type="text"
                className="exp-input-field form-control col-md-7"
              />
            </div>
          </div>

          {/* Column Selector Dropdown */}
          <div className="mb-2 p-0 d-flex justify-content-end flex-wrap me-5">
            <div className="dropdown">
              <button
                className="dropdown-toggle p-1"
                type="button"
                data-bs-toggle="dropdown"
                title='Drop down'
                aria-expanded="false"
              >
                <i className="bi bi-sliders"></i>
              </button>
              <ul
                className="dropdown-menu p-2"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  minWidth: "250px",
                }}
              >
                {allColumns.map((col) => (
                  <li key={col.field} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`col-${col.field}`}
                      checked={visibleFields.includes(col.field)}
                      onChange={() => toggleColumn(col.field)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`col-${col.field}`}
                    >
                      {col.headerName}
                    </label>
                  </li>
                ))}
                <hr />
                <li>
                  <button
                    className="p-2 fs-7"
                    onClick={() => setShowAddColumnModal(true)}
                  >
                    <i class="bi bi-plus-square-dotted"></i> Custom Column
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* AG Grid */}
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={[]} // Replace with real rowData
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={5}
          />
        </div>
      </div>

      {/* Add Column Modal */}
      {showAddColumnModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex justify-content-between w-100">
                  <h5 className="modal-title">Add Custom Column</h5>
                  <button
                    className="btn btn-danger p-1"
                    onClick={() => setShowAddColumnModal(false)}
                    aria-label="Close"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter column name"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddCustomColumn()
                  }
                />
              </div>
              <div className="modal-footer">
                <button className="" onClick={handleAddCustomColumn}>
                  <i class="bi bi-check-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
