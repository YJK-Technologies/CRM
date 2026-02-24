import React, { useState, useRef, useEffect } from "react";
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from "date-fns/locale/en-US";
import differenceInDays from 'date-fns/differenceInDays';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate, useLocation } from "react-router-dom";
import './CRMSchedule.css';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CreatableSelect from "react-select/creatable";
import { toast, ToastContainer } from "react-toastify";
import './Column.css';
const config = require("../../Apiconfig");

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const styles = {
  dateGroup: {
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "none",
  },
  dateHeader: {
    fontWeight: "500",
    marginTop: "5px",
    marginBottom: "5px",
    color: "#1a1a1a",
    fontSize: "1.1rem",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "10px",
  },
  logItem: {
    display: "flex",
    alignItems: "flex-start",
    // marginBottom: "12px",
    paddingBottom: "12px",
  },
  avatarBase: {
    color: "white",
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    marginRight: "15px",
    fontSize: "1rem",
    flexShrink: 0,
    transition: "background-color 0.3s",
  },
  logDetails: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#4a4a4a",
    lineHeight: "1.5",
    padding: "0",
  },
  typeColors: {
    stage: {
      color: "#0056b3",
      bg: "#007bff",
    },
    note: {
      color: "#1e7e34",
      bg: "#28a745",
    },
    send: {
      color: "#c66c00",
      bg: "#ff9800",
    },
    activity: {
      color: "#4e2a84",
      bg: "#6f42c1",
    },
    event: {
      color: "#271bcfff",
      bg: "#4244c1ff",
    },
  },
  noData: {
    fontSize: "15px",
    color: '#999',
    padding: '15px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  actionMenuContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    fontSize: "0.9rem",
    marginTop: "5px",
    color: "#6c757d",
  },
  actionButton: {
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  markDone: {
    color: '#28a745',
  },
  edit: {
    color: '#17a2b8',
  },
  cancel: {
    color: '#dc3545',
  },
  actionButtonBase: {
    fontWeight: '500',
    borderRadius: '4px',
    padding: '4px 12px',
    fontSize: '0.9rem',
    minWidth: '100px',
    whiteSpace: 'nowrap',
  },
  buttonGroup: {
    display: "flex",
    // backgroundColor: '#7a5a82',
    // borderRadius: '4px',
    overflow: 'hidden',
    // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: '35px',
    gap: "20px"
  },
  stageButtonBase: {
    padding: "8px 18px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    transition: "all 0.1s ease",
    lineHeight: "1.5",
    textDecoration: 'none',
    outline: 'none',
    margin: "0",
    borderRadius: "0",
    boxShadow: '0'
  },
  wonButton: {
    backgroundColor: '#7a5a82',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  lostButton: {
    backgroundColor: '#f8f8f8',
    color: '#495057',
    boxShadow: 'inset 1px 0 0 rgba(0, 0, 0, 0.1)',
  },
};

export default function CRMCalendar() {
  const [view, setView] = useState(Views.MONTH);
  const [myEventsList, setEvents] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [Description, setDescription] = useState("");

  const navigate = useNavigate();
  const [showSpModal, setShowSpModal] = useState(false);
  const [addSPModal, setAddSPModal] = useState(false);
  const [pendingSP, setPendingSP] = useState(null);
  const [SalesCode, setSalesCode] = useState('');
  const [salespersonOptions, setSalespersonOptions] = useState([]);
  const [selectedSalespersons, setSelectedSalespersons] = useState([]);
  const [highlightRange, setHighlightRange] = useState(null);
  const [logData, setLogData] = useState([]);
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const companyCode = sessionStorage.getItem("selectedCompanyCode");
  const [showEventModal, setShowEventModal] = useState(false);

  const location = useLocation();
  const opportunityId = location.state?.opportunityId;
  const opportunityName = location.state?.opportunityName;

  const groupedData = logData.reduce((acc, item) => {
    const dateVal = item.Created_Date ? new Date(item.Created_Date) : null;
    const dateKey = dateVal && !isNaN(dateVal)
      ? dateVal.toISOString().split("T")[0]
      : "Unknown Date";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sortByType = (arr) => {
    const order = ["stage", "note", "send", "activity"];
    return arr.sort(
      (a, b) => order.indexOf(a.type) - order.indexOf(b.type)
    );
  };

  // ✅ highlight range effect
  useEffect(() => {
    const dayCells = document.querySelectorAll(".rbc-day-bg");
    dayCells.forEach((cell) => cell.classList.remove("highlighted"));

    if (!highlightRange) return;

    const { start, end } = highlightRange;

    dayCells.forEach((cell) => {
      const cellDateStr = cell.getAttribute("data-date");
      if (!cellDateStr) return;
      const cellDate = new Date(cellDateStr);
      if (cellDate >= start && cellDate <= end) {
        cell.classList.add("highlighted");
      }
    });
  }, [highlightRange]);


  // const handleAddEvent = async () => {
  // //   try {
  // //     const selectedLabels = selectedSalespersons.map((sp) => sp.label).join(",");

  // //     const data = {
  // //       Event_Name: newEvent.title,
  // //       All_Days: selectedDays.join(","),
  // //       Attendees: selectedLabels,
  // //       Videocall_URL: videoUrl,
  // //       Description: Description,
  // //       Start_date: `${format(range[0].startDate, "yyyy-MM-dd")} ${startTime}:00`,
  // //       End_date: `${format(range[0].endDate, "yyyy-MM-dd")} ${endTime}:00`,
  // //       Created_by: sessionStorage.getItem("selectedUserCode"),
  // //       Company_code: sessionStorage.getItem("selectedCompanyCode"),
  // //       Oppurtinity_ID: opportunityId,
  // //     };

  // //     const response = await fetch(`${config.apiBaseUrl}/CRM_NewEventInsert`, {
  // //       method: "POST",
  // //       headers: { "Content-Type": "application/json" },
  // //       body: JSON.stringify(data),
  // //     });

  // //     if (response.ok) {
  // //       toast.success("Saved successfully ✅");
  // //       setTimeout(() => {
  // //         setShowModal(false);
  // //       }, 1000);
  // //       const searchData = await response.json();
  // //       console.log(searchData);

  // //     } else {
  // //       const errorResponse = await response.json();
  // //       toast.warning(errorResponse.message);
  // //     }
  // //   } catch (error) {
  // //     toast.error("Error inserting data: " + error.message);
  // //   }
  // // };

  const handleAddEvent = async () => {
  try {
    // ===== REQUIRED FIELD VALIDATION =====

    if (!newEvent?.title?.trim()) {
      toast.warning("Event Name is required");
      return;
    }

    if (!range?.[0]?.startDate || !startTime) {
      toast.warning("Start date & time is required");
      return;
    }

    if (!range?.[0]?.endDate || !endTime) {
      toast.warning("End date & time is required");
      return;
    }

    if (!selectedSalespersons || selectedSalespersons.length === 0) {
      toast.warning("Please select at least one Salesperson ");
      return;
    }

    if (!Description || !Description.trim()) {
      toast.warning("Description is required");
      return;
    }

    const Created_by = sessionStorage.getItem("selectedUserCode");
    const Company_code = sessionStorage.getItem("selectedCompanyCode");

    if (!Created_by) {
      toast.warning("User not identified. Please login again");
      return;
    }

    if (!Company_code) {
      toast.warning("Company not selected");
      return;
    }

    // ===== DATE LOGICAL CHECK =====
    const start = new Date(
      `${format(range[0].startDate, "yyyy-MM-dd")} ${startTime}`
    );
    const end = new Date(
      `${format(range[0].endDate, "yyyy-MM-dd")} ${endTime}`
    );

    if (end <= start) {
      toast.warning("End date & time must be after start date");
      return;
    }

    // ===== DATA PREPARATION =====
    const selectedLabels = selectedSalespersons
      .map((sp) => sp.label)
      .join(",");

    const data = {
      Event_Name: newEvent.title.trim(),
      All_Days: selectedDays?.join(",") || "",
      Attendees: selectedLabels,
      Videocall_URL: videoUrl || "",
      Description: Description.trim(),
      Start_date: `${format(range[0].startDate, "yyyy-MM-dd")} ${startTime}:00`,
      End_date: `${format(range[0].endDate, "yyyy-MM-dd")} ${endTime}:00`,
      Created_by,
      Company_code,
      Oppurtinity_ID: opportunityId || null,
    };

    // ===== API CALL =====
    const response = await fetch(
      `${config.apiBaseUrl}/CRM_NewEventInsert`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      toast.success("Saved successfully ✅");
      setTimeout(() => setShowModal(false), 1000);

      const result = await response.json();
      console.log(result);
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to save event");
    }

  } catch (error) {
    toast.error("Error inserting data: " + error.message);
  }
};



  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refOne.current && !refOne.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchAllEvent = async () => {
      try {
        const [eventRes] = await Promise.all([
          fetch(`${config.apiBaseUrl}/GetAllEvent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Company_code: companyCode
            }),
          }),
        ]);

        // Handle each API independently
        const eventResult = eventRes.ok ? await eventRes.json() : [];

        // Format Events
        const formattedEvents = (eventResult || []).map((e) => ({
          type: "event",
          All_Days: e.All_Days,
          startDate: e.Start_date,
          startTime: e.Start_time,
          endDate: e.End_date,
          endTime: e.End_time,
          Assign_To: e.Attendees,
          Event_Name: e.Event_Name,
          Created_by: e.Created_by || "Unknown",
          Created_Date: e.created_date,
        }));

        // Merge & Sort
        const allData = [...formattedEvents].sort(
          (a, b) =>
            new Date(b.Created_Date || 0) - new Date(a.Created_Date || 0)
        );

        setLogData(allData);
      } catch (err) {
        console.error("Error fetching CRM logs:", err);
        setLogData([]);
      }
    };

    if (companyCode) fetchAllEvent();
  }, [companyCode]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/GetCalendarEvent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Company_code: companyCode }),
        });

        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        const formatted = data.map((item) => {
          const [startDay, startMonth, startYear] = item.Start_date.split("-");
          const [endDay, endMonth, endYear] = item.End_date.split("-");
          return {
            title: item.Event_Name,
            start: new Date(`${startYear}-${startMonth}-${startDay}`),
            end: new Date(`${endYear}-${endMonth}-${endDay}`),
          };
        });

        // const formatted = data.map((item) => ({
        //   title: item.Event_Name,
        //   start: new Date(item.Start_date),
        //   end: new Date(item.End_date),
        // }));

        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    if (companyCode) fetchEvents();
  }, [companyCode]);

  const fetchSalesperson = async (selectValueAfterFetch) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/salesPersonDropdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();

      const formattedOptions = data.map((option) => ({
        value: option.SalesCode,
        label: option.SalesPersonName
      }));

      setSalespersonOptions(formattedOptions);

      if (selectValueAfterFetch) {
        const matched = formattedOptions.find(
          (opt) => opt.label.toLowerCase() === selectValueAfterFetch.toLowerCase()
        );
        if (matched) setSalesCode(matched.value);
      }

    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchSalesperson();
  }, []);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleDay = (day) => {
    if (day === "All") {
      if (selectedDays.includes("All")) {
        setSelectedDays([]);
      } else {
        setSelectedDays(["All"]);
      }
    } else {
      let updatedDays = [...selectedDays];

      updatedDays = updatedDays.filter((d) => d !== "All");

      if (updatedDays.includes(day)) {
        updatedDays = updatedDays.filter((d) => d !== day);
      } else {
        updatedDays.push(day);
      }

      setSelectedDays(updatedDays);
    }
  };

  const handleChange = (newValue) => {
    if (newValue?.some((opt) => opt.value === "search_more")) {
      setShowSpModal(true);
    } else {
      setSelectedSalespersons(newValue || []);
    }
  };


  const isActive = (path) => location.pathname === path;

  const handleNavigate1 = () => { navigate("/CrmChart"); };
  const handleNavigate3 = () => { navigate("/CrmScheduler"); };
  const handleNavigate5 = () => { navigate("/CrmLocation"); };
  const handleNavigateKanban = () => { navigate("/Crmworkspace"); };

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 mb-2 bg-white rounded" >
        <div className="d-flex justify-content-between flex-wrap p-0">
          <div className="d-flex justify-content-start align-items-center ps-3">
            <h1 className="h4 mb-0">CRM Schedule</h1>
          </div>
          <div className="d-flex justify-content-end flex-wrap p-2">
            <addbutton className={`nav-btn-container nav-btn-kanban ${isActive('/Crmworkspace') ? 'active' : ''}`} onClick={handleNavigateKanban} title='crmworkspace'>
              <i className="bi bi-kanban nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-calendar ${isActive('/CrmScheduler') ? 'active' : ''}`} onClick={handleNavigate3} title='CrmScheduler'>
              <i className="bi bi-calendar3 nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-chart ${isActive('/CrmChart') ? 'active' : ''}`} onClick={handleNavigate1} title='CrmChart'>
              <i className="bi bi-bar-chart-fill nav-btn-icon"></i>
            </addbutton>
            <addbutton className={`nav-btn-container nav-btn-location ${isActive('/CrmLocation') ? 'active' : ''}`} onClick={handleNavigate5} title='CrmLocation'>
              <i className="bi bi-geo-alt-fill nav-btn-icon"></i>
            </addbutton>
            <button className="me-4 h-75 mt-2" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle-fill "></i> Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-9">
          <div className="card">
            <div className="mb-3 d-flex justify-content-end">
              {["DAY", "WEEK", "MONTH", "AGENDA"].map((v) => (
                <button
                  key={v}
                  className={`me-2 ${view === v.toLowerCase() ? "active" : ""}`}
                  onClick={() => setView(v.toLowerCase())}
                >
                  {v}
                </button>
              ))}
            </div>
            <Calendar
              localizer={localizer}
              events={myEventsList}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              selectable
              style={{ height: 600 }}
              onSelecting={(range) => {
                setHighlightRange(range);
                return true;
              }}
              onSelectEvent={(event) => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
              onSelectSlot={(slotInfo) => {
                const adjustedEnd = new Date(slotInfo.end);
                adjustedEnd.setDate(adjustedEnd.getDate() - 1);

                setRange([
                  { startDate: slotInfo.start, endDate: adjustedEnd, key: "selection" },
                ]);
                setShowModal(true);
                setNewEvent({ title: opportunityName });
                setHighlightRange(null);
              }}
              eventPropGetter={() => ({
                style: {
                  backgroundColor: "#0079faff",
                  color: "white",
                  border: "none",
                  height: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  borderRadius: "4px",
                  padding: "0 4px",
                  cursor: "pointer",
                },
              })}
            />
          </div>
        </div>

        <div className="col-md-3 rounded-3" style={{ maxHeight: 'calc(85vh - 100px)', overflowY: 'auto' }}>
          <div className="card shadow-sm" style={{ display: "flex", flexDirection: "column" }}>
            <div
              className="card-body p-0"
              style={{
                overflowY: 'auto',
                flexGrow: 1,
                padding: '10px'
              }}
            >
              {logData.length > 0 ? (
                Object.keys(groupedData)
                  .sort((a, b) => new Date(b) - new Date(a))
                  .map((date) => (
                    <div
                      key={date}
                      style={styles.dateGroup}
                    >
                      <div
                        style={styles.dateHeader}
                      >
                        {date === "Unknown Date"
                          ? "Unknown Date"
                          : new Date(date).toDateString()}
                      </div>

                      {sortByType(groupedData[date]).map((item, index) => {

                        const logItemStyle = {
                          ...styles.logItem,
                          borderBottom:
                            index !== groupedData[date].length - 1
                              ? "1px solid #f0f0f0"
                              : "none",
                        };

                        const avatarColor =
                          item.type === "stage"
                            ? styles.typeColors.stage.bg
                            : item.type === "note"
                              ? styles.typeColors.note.bg
                              : item.type === "send"
                                ? styles.typeColors.send.bg
                                : item.type === "activity"
                                  ? styles.typeColors.activity.bg
                                  : styles.typeColors.event.bg;

                        const avatarStyle = {
                          ...styles.avatarBase,
                          backgroundColor: avatarColor,
                        };

                        return (
                          <div
                            key={index}
                            style={logItemStyle}
                          >
                            <div style={avatarStyle}>
                              {item.Created_by
                                ? item.Created_by[0].toUpperCase()
                                : "U"}
                            </div>

                            <div>
                              <p style={styles.logDetails}>
                                <span>{item.Created_by}</span>{" "}

                                {item.type === "event" && (
                                  <>
                                    → <span>Event:</span>{" "}
                                    <span style={{ color: styles.typeColors.event.color }}>
                                      {item.Event_Name}
                                    </span>
                                    <br />
                                    <span>Start Date:</span> {item.startDate || "N/A"} <br />
                                    <span>End Date:</span> {item.endDate || "N/A"} <br />
                                    <span>Start Time:</span> {item.startTime || "N/A"} <br />
                                    <span>End Time:</span> {item.endTime || "N/A"} <br />
                                    <span>Salesperson:</span> {item.Assign_To || "N/A"} <br />
                                    <span>Days:</span> {item.All_Days || "N/A"}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
              ) : (
                <p style={styles.noData}>
                  No log data available
                </p>
              )}
            </div>
          </div>
        </div>

      </div>

      {showModal && (
        <div className="modal show d-block mt-5 popupadj Topnav-screen popup" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Event</h5>
                <button type="button" className="btn-close" title="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">

                  <input
                    type="text"
                    value={newEvent.title}
                    placeholder="Add Title"
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    style={{
                      display: "block",
                      width: "100%",
                      border: "none",
                      borderBottom: "2px solid #ccc",
                      outline: "none",
                      padding: "6px 2px",
                      marginTop: "4px",
                      fontSize: "14px",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderBottom = "2px solid #ffc107")}
                    onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                  />
                </div>
                <div>
                  <div className="mb-3" style={{ position: "relative", display: "flex", alignItems: "center", fontWeight: "600" }}>
                    <label
                      className="form-label"
                      style={{ marginRight: "10px", fontWeight: "600", whiteSpace: "nowrap", marginBottom: 0, gap: "10px" }}
                    >
                      Select Date Range:
                    </label>

                    <div style={{ position: "relative", width: "310px" }}>
                      <input
                        readOnly
                        value={`${format(range[0].startDate, "dd/MM/yyyy")} → ${format(
                          range[0].endDate,
                          "dd/MM/yyyy"
                        )}`}
                        onClick={() => setOpen(!open)}
                        className="form-control"
                        style={{ cursor: "pointer", backgroundColor: "white" }}
                      />

                      {open && (
                        <div
                          ref={refOne}
                          style={{
                            position: "absolute",
                            zIndex: 100,
                            top: "110%",
                            left: 0,
                          }}
                        >
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={range}
                            rangeColors={["#4a90e2"]}
                            showDateDisplay={false}
                            showMonthAndYearPickers={true}
                            direction="horizontal"
                            months={2}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="mb-3"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "600",
                      gap: "5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <label
                        className="form-label"
                        style={{ marginBottom: 0, whiteSpace: "nowrap" }}
                      >
                        Start Time:
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        style={{ width: "150px" }}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <label
                        className="form-label"
                        style={{ marginBottom: 0, whiteSpace: "nowrap" }}
                      >
                        End Time:
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        style={{ width: "150px" }}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "12px", padding: "6px" }}>
                    <label className="form-label" style={{ fontWeight: "600" }}>
                      Days:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginTop: "4px",
                      }}
                    >
                      <label style={{ display: "flex", alignItems: "center", fontWeight: "600" }}>
                        <input
                          type="checkbox"
                          checked={selectedDays.length === daysOfWeek.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDays([...daysOfWeek]);
                            } else {
                              setSelectedDays([]);
                            }
                          }}
                          style={{ marginRight: "6px" }}
                        />
                        All
                      </label>

                      {daysOfWeek.map((day) => (
                        <label key={day} style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes(day)}
                            onChange={() => toggleDay(day)}
                            style={{ marginRight: "6px" }}
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <label style={{ fontWeight: "600", marginRight: "10px" }}>Salesperson :</label>
                    <CreatableSelect
                      isMulti
                      isClearable
                      options={[...salespersonOptions, { value: "search_more", label: "Search more..." }]}
                      value={selectedSalespersons}
                      onChange={handleChange}
                      onCreateOption={(inputValue) => {
                        setPendingSP(inputValue);
                        setAddSPModal(true);
                      }}
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "transparent",
                          minWidth: "300px",
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                        multiValue: (styles) => ({
                          ...styles,
                          backgroundColor: "#e6f4ea",
                          borderRadius: "16px",
                          padding: "2px 8px",
                          display: "flex",
                          alignItems: "center",
                        }),
                        multiValueLabel: (styles) => ({
                          ...styles,
                          color: "#333",
                          fontWeight: "500",
                        }),
                        multiValueRemove: (styles) => ({
                          ...styles,
                          color: "#999",
                          ':hover': { color: "#ff4d4d", backgroundColor: "transparent" },
                        }),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <label style={{ fontWeight: "600", fontSize: "16px", color: "#333", minWidth: "80px" }}>
                      Video Call URL :
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      style={{
                        flex: 1,
                        border: "none",
                        borderBottom: "2px solid #ccc",
                        outline: "none",
                        padding: "6px 2px",
                        fontSize: "14px",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderBottom = "2px solid #ffc107")}
                      onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <label style={{ fontWeight: "600", fontSize: "16px", color: "#333", minWidth: "80px" }}>
                      Description :
                    </label>
                    <input
                      type="text"
                      value={Description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{
                        flex: 1,
                        border: "none",
                        borderBottom: "2px solid #ccc",
                        outline: "none",
                        padding: "6px 2px",
                        fontSize: "14px",
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={(e) => (e.target.style.borderBottom = "2px solid #ffc107")}
                      onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
                    />
                  </div>
                  {/* <div style={{ marginTop: "10px" }}>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        setRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }])
                      }
                    >
                      Clear
                    </button>
                  </div> */}
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleAddEvent} title="Save" className="">Save</button>
                <button onClick={() => setShowModal(false)} title="Discard" className="">Discard</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEventModal && selectedEvent && (
        <div
          className="custom-popover-overlay"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="custom-event-popover shadow-lg"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '250px', left: '250px',
              zIndex: 1050,
            }}
          >
            <div className="popover-header-custom p-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">{selectedEvent.title || "Event Details"}</h6>
              <button type="button" className="btn-close" onClick={() => setSelectedEvent(null)}></button>
            </div>

            <div className="p-3">
              <ul className="list-unstyled mb-3 popover-details-list">
                <li className="d-flex align-items-start mb-2">
                  <i className="bi bi-calendar-event me-2 mt-1 text-secondary popover-icon"></i>
                  <div>
                    <span className="fw-bold">
                      {format(selectedEvent.start, "MMMM dd")}-{format(selectedEvent.end, "dd, yyyy")}
                    </span>
                    <span className="ms-1 text-primary fw-bold popover-duration">
                      {differenceInDays(selectedEvent.end, selectedEvent.start) + 1} days
                    </span>
                  </div>
                </li>

                <li className="d-flex align-items-start mb-2">
                  <i className="bi bi-people-fill me-2 mt-1 text-secondary popover-icon"></i>
                  <div>
                    <span className="popover-custom-icon-y me-1">Y</span>
                    {selectedEvent.Assign_To || "YJK Balaji"}
                  </div>
                </li>

                <li className="d-flex align-items-start mb-2 popover-text-lead">
                  <i className="bi bi-tag-fill me-2 mt-1 text-secondary popover-icon"></i>
                  {selectedEvent.status || "Lead"}
                </li>

                <li className="d-flex align-items-start popover-text-owner">
                  <i className="bi bi-person-circle me-2 mt-1 text-secondary popover-icon"></i>
                  {selectedEvent.attendees || "YJK Balaji"}
                </li>
              </ul>
            </div>

            <div className="p-2 border-top d-flex popover-footer-buttons">
              <button
                className="btn btn-sm btn-edit-custom me-2"
                onClick={() => { setSelectedEvent(null); }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-delete-custom"
                onClick={() => {
                  setEvents(myEventsList.filter(ev => ev !== selectedEvent));
                  setSelectedEvent(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}