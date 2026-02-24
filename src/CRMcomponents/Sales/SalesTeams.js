import { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toast } from 'react-toastify';
import SalesTeamHelp from './SalesTeamHelp';
const config = require('../../Apiconfig');

export default function SalesTeams({ showSalesTeamSearch, onSalesTeamSearchClose, onSaveSalesTeam }) {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSalesTeamHelp, setShowSalesTeamHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const popupRef = useRef(null);

  const filterOptions = [
    // "My Pipeline",
    // "Active",
    // "Inactive",
    // "Won",
    // "Lost"
  ];

  const dateFilterOptions = [
    // "Created On",
    // "Expected Closing",
    // "Date Closed"
  ];

  const groupByOptions = [
    "Sales Team Id",
    "Sales Team Name",
    "Team Leader",
    "Alias",
    "Email",
  ];

  const handleSelect = (item) => {
    let tagToSet = item;
    if (item.startsWith("Search ")) {
      const parts = item.split(' for: ');
      const field = parts[0].replace('Search ', '');
      const query = parts[1];
      tagToSet = `${field}: ${query}`;
    }

    if (!selectedTags.includes(tagToSet)) {
      setSelectedTags([...selectedTags, tagToSet]);
    }
    setOpenDropdown(null);
    setShowPopup(false);
    setSearchQuery('');
  };

  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const payload = {};
      const companyCode = sessionStorage.getItem("selectedCompanyCode");

      if (companyCode) {
        payload.Company_code = companyCode;
      }

      selectedTags.forEach(tag => {
        const parts = tag.split(':');
        if (parts.length > 1) {
          const field = parts[0].trim().replace(/\s/g, '');
          const value = parts[1].trim();
          if (field === "SalesTeamId") payload.Sales_ID = value;
          if (field === "SalesTeamName") payload.Sales_Team = value;
          if (field === "TeamLeader") payload.Team_Leader = value;
          if (field === "Alias") payload.Email_alias = value;
          if (field === "Email") payload.Emails_From = value;
        }
      });

      const response = await fetch(`${config.apiBaseUrl}/SalesTeamSearch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
      } else if (response.status === 404) {
        setRowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.Sales_ID === params.data.Sales_ID
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);

  };
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };


  const handleNavigateWithRowData = (selectedRow) => {
    setShowSalesTeamHelp(true);
    setSelectedRowData(selectedRow);
  };


  const columnDefs = [
    {
      headerName: 'Sales Team Id',
      field: 'Sales_ID',
      flex: true,
      hide: true,
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };

        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      }
    },

    {
      headerName: 'Sales Team Name',
      field: 'Sales_Team',
      flex: true,
      editable: true
    },
    {
      headerName: 'Team Leader',
      field: 'Team_Leader',
      flex: true,
      editable: true
    },
    {
      headerName: 'Alias',
      field: 'Email_alias',
      flex: true,
      editable: true
    },
    {
      headerName: 'Email',
      field: 'Emails_From',
      flex: true,
      editable: true
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowPopup(true);
  };

  if (!showSalesTeamSearch) return null;

  const handleSalesTeamClose = () => {
    setShowSalesTeamHelp(false);
    handleSearch();
  };

  // const handleRowClick = (params) => {

  //   if (onSaveSalesTeam) {
  //     onSaveSalesTeam(params.data);
  //   }
  // };
  const handleRowClick = (params) => {
    setSelectedRowData(params.data);
    setShowSalesTeamHelp(true);
  };



  const saveEditedData = async () => {
    try {
      const Company_code = sessionStorage.getItem('selectedCompanyCode');
      const modified_by = sessionStorage.getItem('selectedUserCode');

      const dataToSend = {
        editedData: Array.isArray(rowData) ? rowData : [rowData]
      };

      const response = await fetch(`${config.apiBaseUrl}/CRMSalesTeamUpdateGrid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Company_code": Company_code,
          "modified_by": modified_by
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => handleSearch(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error updating rows:", error);
      toast.error('Error Updating Data: ' + error.message);
    }
  };



  return (
    <>
      <div className="modal d-block mt-5 popupadj Topnav-screen popup" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} >
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex justify-content-between w-100">
                <h5 className="modal-title">Sales Team</h5>
                <button
                  className="btn btn-danger"
                  onClick={onSalesTeamSearchClose}
                  aria-label="Close"
                  title='Close'
                >
                  <i className="bi bi-x-lg"></i>
                </button>


              </div>
            </div>

            <div className="modal-body">
              <div className="row mb-3 d-flex justify-content-center">
                <div className="col-md-5 position-relative">
                  <div className="input-group">
                    <div className="form-control border-start-1 d-flex flex-wrap align-items-center">
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge bg-primary me-1 mb-1"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemove(tag)}
                        >
                          {tag} ✕
                        </span>
                      ))}
                      <input
                        type="text"
                        className="border-0 p-0"
                        placeholder="Search"
                        onFocus={() => setShowPopup(true)}
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>

                    <span className="input-group-text bg-white border-end-1" onClick={handleSearch} style={{ cursor: "pointer" }}>
                      <i className="bi bi-search"></i>
                    </span>
                  </div>

                  {showPopup && (
                    <div
                      ref={popupRef}
                      className="popup-menu shadow bg-white border"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "600px",
                        zIndex: 1000,
                        padding: "15px",
                      }}
                    >
                      {searchQuery.length > 0 ? (
                        <div>
                          <h6 className="fw-bold mb-3">Search for: {searchQuery}</h6>
                          <ul className="list-unstyled">
                            {groupByOptions.map((option, index) => (
                              <li
                                key={index}
                                className="p-1"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelect(`Search ${option} for: ${searchQuery}`)}
                              >
                                Search {option} for: <strong>{searchQuery}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="d-flex">
                          <div className="flex-fill border-end pe-3">
                            <h6 className="fw-bold mb-3">Filters</h6>
                            <ul className="list-unstyled">
                              {filterOptions.map((item) => (
                                <li
                                  key={item}
                                  className={`p-1 ${selectedTags.includes(item) ? "bg-light fw-bold" : ""
                                    }`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleSelect(item)}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <ul className="list-unstyled mt-3">
                              {dateFilterOptions.map((item) => (
                                <li
                                  key={item}
                                  className="p-1"
                                  style={{ cursor: "pointer", position: "relative" }}
                                  onClick={() =>
                                    setOpenDropdown(openDropdown === item ? null : item)
                                  }
                                >
                                  {item} <i className="bi bi-caret-right"></i>
                                  {openDropdown === item && (
                                    <ul
                                      className="list-unstyled shadow bg-white border rounded mt-1 p-2"
                                      style={{
                                        position: "absolute",
                                        left: "100%",
                                        top: 0,
                                        zIndex: 2000,
                                        minWidth: "180px",
                                      }}
                                    >
                                      {[
                                        "Today",
                                        "This Week",
                                        "This Month",
                                        "Last 30 Days",
                                        "Custom Date",
                                      ].map((subItem) => (
                                        <li
                                          key={subItem}
                                          className="p-1"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => handleSelect(`${item}: ${subItem}`)}
                                        >
                                          {subItem}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              )
                              )}
                            </ul>
                            <ul className="list-unstyled mt-3">
                              <li>Archived</li>
                              <li className="text-primary">+ Add Custom Filter</li>
                            </ul>
                          </div>
                          <div className="flex-fill border-end px-3">
                            <h6 className="fw-bold mb-3">Group By</h6>
                            <ul className="list-unstyled">
                              {groupByOptions.map((item) => (
                                <li
                                  key={item}
                                  className={`p-1 ${selectedTags.includes(item) ? "bg-light fw-bold" : ""
                                    }`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleSelect(item)}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <ul className="list-unstyled mt-3">
                              <li><i className="bi bi-x text-danger"></i> Clear all</li>
                              <li className="text-primary">+ Add Custom group</li>
                            </ul>
                          </div>

                          <div className="flex-fill ps-3">
                            <h6 className="fw-bold mb-3">Favorites</h6>
                            <ul className="list-unstyled">
                              {["Save current search"].map((item) => (
                                <li
                                  key={item}
                                  className={`p-1 ${selectedTags.includes(item) ? "bg-light fw-bold" : ""
                                    }`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleSelect(item)}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className='d-flex col-md-1 mt-1'>
                  <button
                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                    type="button"
                    onClick={() => setShowSalesTeamHelp(true)}
                    aria-label="Add New"
                    style={{ width: '30px', height: '30px' }}
                    title='Add SalesTeam'
                  >
                    <i className="bi bi-plus text-center" style={{ fontSize: '26px' }}></i>
                  </button>
                  <button
                    className="btn btn-success d-flex align-items-center justify-content-center p-3" style={{ width: "5px", height: "15px" }}
                    title='update'
                    onClick={saveEditedData}
                  >
                    <i class="bi bi-x-diamond-fill"></i>
                  </button>
                </div>
              </div>
              <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  pagination={true}
                  rowSelection="multiple"
                  onSelectionChanged={onSelectionChanged}
                  onGridReady={onGridReady}
                  onCellValueChanged={onCellValueChanged}
                  defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true,
                    editable: true
                  }}
                  paginationAutoPageSize={true}
                  onRowClicked={(params) => handleRowClick(params)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalesTeamHelp
        showSalesTeam={showSalesTeamHelp}
        onCloseSalesTeam={handleSalesTeamClose}
        title={selectedRowData ? "Update SalesTeam" : "Create SalesTeam"}
        initialData={selectedRowData}
        mode={selectedRowData ? "update" : "create"}
      />
    </>
  );
}
