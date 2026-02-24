import { useState, useRef, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const config = require("../../Apiconfig");

const getInitialColumns = () => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthIndex = new Date().getMonth();
  const columns = {};

  for (let i = 0; i < 4; i++) {
    const monthIndex = (currentMonthIndex + i) % 12;
    const monthName = monthNames[monthIndex];
    columns[monthName.toLowerCase()] = {
      name: monthName,
      items: []
    };
  }

  return columns;
};

const initialData = {
  columns: getInitialColumns()
};

export default function CRMBoard() {
  const [data, setData] = useState(initialData);
  const [modalShow, setModalShow] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [editingLead, setEditingLead] = useState(null);
  const [addingToColumn, setAddingToColumn] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popupRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const filterOptions = [
    "Won",
    "Lost"
  ];

  const dateFilterOptions = [
    "Expected Closing"
  ];

  const groupByOptions = [
    "SalesPersonName",
    "Company",
    "Contact",
    "OpportunityName",
    "ContactPhone",
    "ExpectedRevenue",
    "Payment",
    "Email_id",
  ];

  const handleSearch = async () => {
    try {
      const payload = {};
      const companyCode = sessionStorage.getItem("selectedCompanyCode");

      if (companyCode) payload.company_code = companyCode;

      const fieldMapping = {
        Company: "Company",
        Contact: "Contact",
        OpportunityName: "OpportunityName",
        ContactPhone: "ContactPhone",
        ExpectedRevenue: "ExpectedRevenue",
        Payment: "Payment",
        Email_id: "Email_id",
        SalesPersonName: "SalesPersonName",
      };

      let groupByField = null;
      const tagsToProcess = [...selectedTags];

      if (selectedTags.includes("Won")) {
        payload.Stage = "Won";
      } else if (selectedTags.includes("Lost")) {
        payload.Mode = "Lost"; 
      }

      if (searchQuery && tagsToProcess.length > 0) {
        const lastTag = tagsToProcess[tagsToProcess.length - 1];
        if (fieldMapping[lastTag]) {
          tagsToProcess.pop();
          tagsToProcess.push(`${lastTag}: ${searchQuery}`);
        }
      }

      tagsToProcess.forEach((tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag.includes(":")) {
          const [label, value] = trimmedTag.split(":").map((x) => x.trim());
          const field = fieldMapping[label];
          if (field && value) {
            if (field === "ExpectedRevenue" || field === "Payment") {
              const num = Number(value);
              if (!isNaN(num)) payload[field] = num;
            } else {
              payload[field] = value;
            }
          }
        } else {
          const field = fieldMapping[trimmedTag];
          if (field) groupByField = field;
        }
      });

      if (groupByField) payload.group_by = groupByField;

      console.log("Final Payload Sent:", payload);

      // 🔹 Choose API route dynamically based on Mode = Lost
      let apiUrl = `${config.apiBaseUrl}/Forecastsearch`;

      if (payload.Mode === "Lost") {
        apiUrl = `${config.apiBaseUrl}/CRM_LoseSC`; // ✅ Lost-specific API route
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const leads = await response.json();
      console.log("Leads from backend:", leads);

      const normalizedLeads = leads.map((lead, index) => ({
        ...lead,
        MonthYear: lead.MonthYear || null,
        Opportunity_ID: lead.Opportunity_ID ?? `temp-${index}`,
        OpportunityName: lead.OpportunityName ?? "",
        Company: lead.Company ?? "",
        Contact: lead.Contact ?? "",
        ContactPhone: lead.ContactPhone ?? "",
        Email_id: lead.Email_id ?? "",
        ExpectedRevenue: Number(lead.ExpectedRevenue) || 0,
        SalesPersonName: lead.SalesPersonName ?? "",
      }));

      const validLeads = normalizedLeads.filter((lead) => lead.MonthYear);
      const uniqueMonths = [...new Set(validLeads.map((lead) => lead.MonthYear))];

      const monthOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const sortedMonths = uniqueMonths.sort(
        (a, b) => monthOrder.indexOf(a.split(" ")[0]) - monthOrder.indexOf(b.split(" ")[0])
      );

      const columns = {};
      sortedMonths.forEach((month) => {
        columns[month.toLowerCase()] = {
          name: month,
          items: validLeads
            .filter((lead) => lead.MonthYear === month)
            .map((lead) => ({
              id: lead.Opportunity_ID,
              title: lead.OpportunityName,
              company: lead.Company,
              contact: lead.Contact,
              phone: lead.ContactPhone,
              email: lead.Email_id,
              investment: lead.ExpectedRevenue,
              SalesPersonName: lead.SalesPersonName,
            })),
        };
      });

      setData({ columns });
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Data Not Found");
      setData({ columns: {} });
    }
  };

  const startAddLead = (columnId) => {
    setAddingToColumn(columnId);
    setSelectedColumnId('');
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

      // ✅ New update code
      try {
        // Example: destCol.name = "January 2026"
        const [monthName, yearStr] = destCol.name.split(" ");
        const monthNumber =
          new Date(`${monthName} 1, ${yearStr}`).getMonth() + 1;

        // Format the full ExpectedClosing date as YYYY-MM-01
        const expectedClosing = `${yearStr}-${monthNumber
          .toString()
          .padStart(2, "0")}-01`;

        const payload = {
          Opportunity_ID: removed.id,
          ExpectedClosing: expectedClosing,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          modified_by: sessionStorage.getItem("selectedUserCode"),
        };

        const response = await fetch(`${config.apiBaseUrl}/CRM_CompanyDateUpdate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const dataRes = await response.json();

        if (response.ok) {
          console.log("✅ Lead updated successfully:", dataRes.message);
        } else {
          console.error("❌ Update failed:", dataRes.message);
        }
      } catch (error) {
        console.error("⚠️ Error updating ExpectedClosing:", error);
      }
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
  const columnRefs = useRef({});
  const [highlightedColumn, setHighlightedColumn] = useState(null);


  const handleNavigate = () => {
    navigate("/crmlistpage"); // Pass selectedRows as props to the Input component
  };
  const handleNavigate1 = () => {
    navigate("/RChart"); // Pass selectedRows as props to the Input component
  };

  const handleNavigateKanban = () => {
    navigate("/Forcast"); // Pass selectedRows as props to the Input component
  };

  const handleNavigate6 = () => {
    navigate("/Rpivot"); // Pass selectedRows as props to the Input component
  };


  const handleDeleteColumn = (columnId) => {
    const confirmed = window.confirm("Are you sure you want to delete this month column?");
    if (!confirmed) return;

    setData((prev) => {
      const newColumns = { ...prev.columns };
      delete newColumns[columnId];
      return {
        ...prev,
        columns: newColumns
      };
    });

    delete columnRefs.current[columnId];
  };

  useEffect(() => {
    const fetchCompanyMonthData = async () => {
      try {

        const companyCode = sessionStorage.getItem('selectedCompanyCode');

        const response = await fetch(`${config.apiBaseUrl}/GetCompanyMonth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const leads = await response.json();

        const monthOrder = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        const validLeads = leads.filter(lead => lead.MonthYear);
        const uniqueMonths = [...new Set(validLeads.map(lead => lead.MonthYear))];
        const sortedMonths = uniqueMonths.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

        const columns = {};
        sortedMonths.forEach(month => {
          columns[month.toLowerCase()] = {
            name: month,
            items: validLeads.filter(lead => lead.MonthYear === month).map(lead => ({
              id: lead.Opportunity_ID,
              title: lead.OpportunityName,
              company: lead.Company,
              contact: lead.Contact,
              phone: lead.ContactPhone,
              email: lead.Email_id,
              investment: lead.ExpectedRevenue,
              // payment: lead.Payment,
              SalesPersonName: lead.SalesPersonName,
              Stage: lead.Stage
            }))
          };
        });

        setData({ columns });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchCompanyMonthData();
  }, []);

  const addNewMonthColumn = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const existingMonths = Object.values(data.columns).map(col => col.name);

    // Helper function to parse "Month Year" (e.g. "November 2024")
    const parseMonthYear = (monthYearStr) => {
      const [monthName, yearStr] = monthYearStr.split(" ");
      return {
        monthIndex: monthNames.indexOf(monthName),
        year: parseInt(yearStr, 10)
      };
    };

    // Parse all existing months
    const parsedMonths = existingMonths.map(parseMonthYear);

    // Find the latest month/year combination
    const lastMonthData = parsedMonths.reduce((latest, current) => {
      if (
        current.year > latest.year ||
        (current.year === latest.year && current.monthIndex > latest.monthIndex)
      ) {
        return current;
      }
      return latest;
    }, parsedMonths[0]);

    // Calculate the next month/year
    let nextMonthIndex = (lastMonthData.monthIndex + 1) % 12;
    let nextYear = lastMonthData.year + (nextMonthIndex === 0 ? 1 : 0);

    const nextMonthName = monthNames[nextMonthIndex];
    const nextMonthYearName = `${nextMonthName} ${nextYear}`;
    const lowerCaseKey = nextMonthYearName.toLowerCase().replace(" ", "_");

    // Only add if not already present
    if (!existingMonths.includes(nextMonthYearName)) {
      setData(prev => {
        const updated = {
          ...prev,
          columns: {
            ...prev.columns,
            [lowerCaseKey]: {
              name: nextMonthYearName,
              items: []
            }
          }
        };

        // Scroll to the new column after rendering
        setTimeout(() => {
          columnRefs.current[lowerCaseKey]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);

        return updated;
      });
    }
  };

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

  const handleSelect = (item) => {
    let tagToSet = item;
    if (item.startsWith("Search ")) {
      const parts = item.split(" for: ");
      const field = parts[0].replace("Search ", "");
      const query = parts[1];
      tagToSet = `${field}: ${query}`;
    }

    if (!selectedTags.includes(tagToSet)) {
      setSelectedTags([...selectedTags, tagToSet]);
    }
    setOpenDropdown(null);
    setShowPopup(false);
    setSearchQuery("");
  };

  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };

  return (
    <>
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="container-fluid Topnav-screen" style={{ width: "100%", minwidth: "510px" }} >
        <div className="shadow-lg p-3 mb-2 bg-white rounded">
          <div className="row align-items-center">

            {/* LEFT – HEADING */}
            <div className="col-md-3 d-flex align-items-center">
              <h1 className="h4 mb-0">Forecast</h1>
            </div>

            {/* CENTER – SEARCH + TAGS */}
            <div className="col-md-6">
              <div className="input-group">
                <div className="form-control d-flex flex-wrap align-items-center">

                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge bg-primary me-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemove(tag)}
                    >
                      {tag} <i className="bi bi-x"></i>
                    </span>
                  ))}

                  <input
                    type="text"
                    className="border-0 p-0 flex-grow-1"
                    placeholder="Search"
                    style={{ fontSize: "0.9rem", minWidth: "50px" }}
                    onFocus={() => setShowPopup(true)}
                    onChange={handleSearchChange}
                    value={searchQuery}
                  />
                </div>

                <button className="btn btn-outline-secondary" title='Search' onClick={handleSearch}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* RIGHT – BUTTONS */}
            <div className="col-md-3 d-flex justify-content-end">

              <addbutton className="btn ms-2 p-1" onClick={handleNavigate} title="CRM Workspace">
                <i className="bi bi-card-list text-dark fs-5"></i>
              </addbutton>

              <addbutton className="btn ms-2 p-1" onClick={handleNavigate1} title="Chart">
                <i className="bi bi-bar-chart-fill text-dark fs-5"></i>
              </addbutton>

              <addbutton className="btn ms-2 p-1 text-success" onClick={addNewMonthColumn} title="Add Month">
                <i className="bi bi-plus-square fs-5"></i>
              </addbutton>

              <addbutton className="btn ms-2 p-1 text-danger" onClick={handleDeleteColumn} title="Delete">
                <i className="bi bi-trash fs-5"></i>
              </addbutton>

              <addbutton className="btn ms-2 p-1 text-success" onClick={handleNavigate6} title="Pivot">
                <i className="bi bi-table fs-5"></i>
              </addbutton>

            </div>
          </div>

          {showPopup && (
            <div
              ref={popupRef}
              className="popup-menu shadow ms-3 bg-white border"
              tabIndex="-1"
              style={{
                position: "absolute",
                top: "140px",
                left: "550px",
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
                      ))}
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
        <div className="shadow-lg p-2 bg-white rounded" style={{ width: "100%", minWidth: "350px" }} >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="d-flex flex-wrap" style={{ width: "100%", minWidth: "350px", overflowX: "auto",}} >
              {Object.entries(data.columns).map(([id, column]) => (
                <Column
                  droppableId={id}
                  column={column}
                  onAddLead={() => startAddLead(id)}
                  onCancelAddLead={cancelAddLead}
                  onSubmitAddLead={handleSaveLead}
                  onEditLead={(lead) => openModal(id, lead)}
                  onDeleteLead={(leadId) => handleDeleteLead(id, leadId)}
                  onDeleteColumn={() => handleDeleteColumn(id)}
                  highlightedColumn={highlightedColumn}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}