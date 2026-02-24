import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Doughnut, Bar, Line } from "react-chartjs-2";
import Vector from './logo.PNG'
import config from './Apiconfig';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { publicIpv4 } from "public-ip";
import publicIp from 'public-ip';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [rowData, setRowData] = useState('');
  const [NewJoinees, setNewJoinees] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");
  const [timer, setTimer] = useState("00:00:00");
  const intervalRef = useRef(null);
  const user_code = sessionStorage.getItem('selectedUserCode');
  const [deviceDetails, setDeviceDetails] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [holidayRowData, setHolidayRowData] = useState([]);


  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        // Get Device Details (User Agent)
        const userAgent = navigator.userAgent;
        setDeviceDetails(userAgent);

        // Get IP Address using public-ip package
        const ip = await publicIpv4.v4(); // Correct method for fetching public IPv4
        setIpAddress(ip);

        // Get Location using Geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude}, ${longitude}`);
            },
            (error) => {
              console.error("Error fetching location:", error);
              setLocation("Location unavailable");
            }
          );
        } else {
          setLocation("Geolocation not supported");
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
        setLocation("Failed to retrieve location");
      }
    };

    fetchDeviceInfo();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getHolidayDate`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem("selectedCompanyCode") }),

      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setHolidays(data.map((item) => item.HOLIDAYS.split("T")[0]));
      } else {
        throw new Error('Failed to load holidays');
      }
    } catch (err) {
      console.log(err.message || 'Failed to load holidays');
    }
  };

  // Fetch holidays when the component mounts
  useEffect(() => {
    fetchHolidays();
  }, []);
  // Fetch holidays when the component mounts




  useEffect(() => {
    fetch(`${config.apiBaseUrl}/EmployeeDashboardTotalLeave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        EmployeeId:sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setLeaveData(val));
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("elapsedTime")) {
      const storedTime = parseInt(sessionStorage.getItem("elapsedTime"));
      const hours = String(Math.floor(storedTime / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((storedTime % 3600) / 60)).padStart(2, "0");
      const seconds = String(storedTime % 60).padStart(2, "0");
      setTimer(`${hours}:${minutes}:${seconds}`);
    }
  }, []);


  useEffect(() => {
    if (isCheckedIn) {
      startTimer();
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [isCheckedIn]);

  const startTimer = () => {
    let storedElapsedTime = sessionStorage.getItem("elapsedTime")
      ? parseInt(sessionStorage.getItem("elapsedTime"))
      : 0;

    let startTime = parseInt(sessionStorage.getItem("startTime")) || Date.now() - storedElapsedTime * 1000;

    sessionStorage.setItem("startTime", startTime);

    if (intervalRef.current) clearInterval(intervalRef.current); // Clear any existing interval

    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      sessionStorage.setItem("elapsedTime", elapsedTime);

      const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, "0");
      const seconds = String(elapsedTime % 60).padStart(2, "0");

      setTimer(`${hours}:${minutes}:${seconds}`);
    }, 1000);
  };

  const reloadGridData = () => {
    window.location.reload();
  };


  const handleSearch = async () => {

    try {
      const response = await fetch(`${config.apiBaseUrl}/DailyattendanceandTime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startdate,
          end_date: enddate,
          EmployeeId:sessionStorage.getItem('selectedUserCode'),
          company_code:sessionStorage.getItem('selectedCompanyCode')
        }),
      });

      if (response.ok) {
        const searchData = await response.json();
        const newRows = searchData .map((matchedItem) => ({
          work_date :formatDates(matchedItem.work_date),
          First_CheckIn :matchedItem.First_CheckIn,
          Last_CheckOut :matchedItem.Last_CheckOut,
          Total_Worked_Hours :matchedItem.Total_Worked_Hours,
       }));
        setRowData(newRows); 
      } else if (response.status === 404) {
        setRowData([]); 
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
  };

  const formatDates = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  // AG Grid columns
  const holidayCols = [
    { 
      headerName: "Holiday Date", 
      field: "HOLIDAYS", 
      sortable: true, 
      filter: true, 
      cellStyle: { textAlign: "left" }
    },
    { 
      headerName: "Festival Name", 
      field: "Description", 
      sortable: true, 
      filter: true, 
      cellStyle: { textAlign: "left" } 
    },
  ];

  const Employeecol = [
    { 
      headerName: "Date", 
      field: "work_date", 
      sortable: true, 
      filter: true, 
      cellStyle: { textAlign: "left" }
    },
    { 
      headerName: "Check In", 
      field: "First_CheckIn", 
      sortable: true, 
      filter: true, 
      cellStyle: { textAlign: "left" } 
    },
    { 
      headerName: "Check Out", 
      field: "Last_CheckOut", 
      sortable: true, 
      filter: true, 
      cellStyle: { textAlign: "left" } 
    },
    { 
      headerName: "Total Hours", 
      field: "Total_Worked_Hours", 
      sortable: true, 
      filter: true, 
      cellStyle: { textAlign: "left" } 
    },
  ];

  useEffect(() => {
    const fetchHolidayGridData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/GetClr`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_code: sessionStorage.getItem("selectedCompanyCode") }),

        });
        if (response.ok) {
          const searchData = await response.json();
          const newRows = searchData .map((matchedItem) => ({
            HOLIDAYS :formatDates(matchedItem.HOLIDAYS),
            Description :matchedItem.Description,
         }));
          setHolidayRowData(newRows);
        } else if (response.status === 404) {
          console.log("Data Not found");
          setHolidayRowData([])
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };
    fetchHolidayGridData();
  }, []);

  const bufferToBlobUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob); // Creates a Blob URL
    return url;
  };

  const fetchNewJoins = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/EmployeeDashboardNewJoinee`, {
          company_code: sessionStorage.getItem("selectedCompanyCode") 
        });
      const employeesWithImages = response.data.map((joinee) => {
        return {
          ...joinee,
          Photos: joinee.Photos && joinee.Photos.data ? bufferToBlobUrl(joinee.Photos.data) : '', // Use bufferToBlobUrl if data exists
        };
      });
      setNewJoinees(response.data);
      setNewJoinees(employeesWithImages); // Set the data with Blob URL
    } catch (error) {
      console.error("Error fetching new joinees:", error);
    }
  };

  useEffect(() => {
    fetchNewJoins();
  }, []);


  //Calender Design 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);

  // Get current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Calculate days in the current month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week (0 = Sunday)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month

  // Get today's date
  const today = new Date();

  // Handle navigation
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = new Date(prevDate);
      prevMonth.setMonth(prevDate.getMonth() - 1);
      return prevMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonth = new Date(prevDate);
      nextMonth.setMonth(prevDate.getMonth() + 1);
      return nextMonth;
    });
  };

  // Generate calendar grid
  const daysArray = Array.from({ length: firstDayOfMonth }, () => "").concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  // Format a date as YYYY-MM-DD
  const formatDate = (year, month, day) => {
    if (!day) return null;
    const date = new Date(year, month, day);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Check if a day is a weekend
  const isWeekend = (day) => {
    const date = new Date(year, month, day);
    return date.getDay() === 0 || date.getDay() === 6 // Sunday (0) or Saturday (6)
  };

  const isHoliday = (day) => {
    if (!day) return false; // Handle empty days
    const formattedDate = formatDate(year, month, day);
    return holidays.includes(formattedDate);
  };

  // Check if a day is today
  const isToday = (day) => day &&
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;



  const [chartData, setChartData] = useState({
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Maximum Focus",
        data: [30, 50, 45, 60, 55, 80, 70], // Simulated data
        borderColor: "#FF4D4D",
        backgroundColor: "rgba(255, 77, 77, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Smooth curves
        pointRadius: 0,
        hoverRadius: 6, // Points appear larger on hover
        hitRadius: 20, // No points on the line
      },
      {
        label: "Minimum Focus",
        data: [10, 20, 15, 25, 30, 40, 35], // Simulated data
        borderColor: "#7B61FF",
        backgroundColor: "rgba(123, 97, 255, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Smooth curves
        pointRadius: 0,
        hoverRadius: 6, // Points appear larger on hover
        hitRadius: 20, // No points on the line
      },
    ],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#666", // Label color
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false }, // Remove gridlines on x-axis
        ticks: { color: "#aaa" },
      },
      y: {
        grid: { color: "#eee", display: false }, // Light gridlines
        ticks: { color: "#aaa", stepSize: 25 }, // Custom steps for better readability
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.map((value) => value + Math.round(Math.random() * 10 - 5)), // Randomized updates
        })),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  const handleLeave = () => {
    navigate('/LeaveReq')
  }

  const fetchBirthdaysinfo = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/EmployeeDashboardUpcomingBirthday`, {
        company_code: sessionStorage.getItem("selectedCompanyCode") 
      });
      const employeesWithImages = response.data.map((person) => {
        return {
          ...person,
          Photos: person.Photos && person.Photos.data ? bufferToBlobUrl(person.Photos.data) : '', 
        };
      });
      setUpcomingBirthdays(employeesWithImages); 
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
    }
  };

  useEffect(() => {
    fetchBirthdaysinfo();
  }, []);


  const stopTimer = () => {
    clearInterval(intervalRef.current);
    let lastElapsedTime = sessionStorage.getItem("elapsedTime") || "0";
    sessionStorage.setItem("lastElapsedTime", lastElapsedTime); // Save last elapsed time
    sessionStorage.removeItem("elapsedTime");
    sessionStorage.removeItem("startTime");
  };


  const handleTime = async () => {
    try {
      const route = isCheckedIn ? "/DailyLogOUT" : "/DailyLogin";
      const response = await fetch(`${config.apiBaseUrl}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: sessionStorage.getItem('selectedUserCode'),
          DeviceDetails: deviceDetails,
          IP_Address: ipAddress,
          Location: location,
        }),
      });

      if (response.status === 200) {
        setIsCheckedIn((prev) => {
          const newState = !prev;
          sessionStorage.setItem("isCheckedIn", newState);

          if (newState) {
            // When checking in, resume from last elapsed time
            let lastElapsedTime = sessionStorage.getItem("lastElapsedTime")
              ? parseInt(sessionStorage.getItem("lastElapsedTime"))
              : 0;
            sessionStorage.setItem("elapsedTime", lastElapsedTime);
            startTimer();
          } else {
            stopTimer();
          }
          return newState;
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      } else {
        toast.error("Failed to insert data");
      }
    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  //greeting code
  const [greeting, setGreeting] = useState("");

    useEffect(() => {
      const updateGreeting = () => {
        const currentHour = new Date().getHours();
  
        if (currentHour >= 5 && currentHour < 12) {
          setGreeting("Good Morning");
        } else if (currentHour >= 12 && currentHour < 17) {
          setGreeting("Good Afternoon");
        } else if (currentHour >= 17 && currentHour < 21) {
          setGreeting("Good Evening");
        } else {
          setGreeting("Good Night");
        }
      };
  
      updateGreeting();
    }, []);

  return (
    <div className="container-fluid  Topnav-screen pb-4 pt-2">
      <div className="d-flex justify-content-between p-1 rounded-4 row shadow-lg bg-white ms-1 me-1">
        <div className="col-12 col-md-8">
          <div className="d-flex justify-content-start ms-3">
            <h1 className="badge text-bg-secondary fs-4 text">{greeting}</h1>
          </div>
        </div>
        <div className="col-md-2 mt-1  purbut" >
          <div class=" d-flex justify-content-end  ">
            <div className="col-md-6 form-group me-5">
              <div className="mt-2 badge rounded-pill text-bg-success">
                {user_code}
              </div>
            </div>
            <div className="col-md-6 form-group mb-2">
              <input
                id="timing"
                className="form-control mt-1"
                type="text"
                readOnly
                value={timer}
              />
            </div>
            <div className="col-md-12 ms-3 mt-1">
              <button
                onClick={handleTime}
                className="btn"
                style={{
                  backgroundColor: isCheckedIn ? "red" : "green",
                  color: "white",
                }}
                title={isCheckedIn ? "Check OUT" : "Check IN"}
              >
                <i className="fa-solid fa-clock me-2"></i>
                {isCheckedIn ? "Check OUT" : "Check IN"}
              </button>
            </div>
          </div>
        </div>

      </div>





      <div className="row">

        <div className="col-md-8 clo-lg-6 col-sm-12  mb-3 mt-3">
          <div className="card rounded-4 shadow-lg h-100">
            <div className="">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold fs-5">Leave Balance</h6>
                <div className="d-flex justify-content-end ">
                  <button className="border-none p-1 " onClick={handleLeave} style={{ fontSize: "12px" }}>Apply Leave</button>
                </div>
                </div>
              <div className="row">
                {leaveData.length > 0 ? (
                  leaveData.map((leave, index) => (
                    <div key={index} className="col-md-3 col-12 mt-0 p-1">
                      <div className="card h-100">
                        <div className={`leave-icon fs-6 ${leave.leavetype}  rounded-5`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-capsule" viewBox="0 0 16 16">
                            <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429z" />
                          </svg>
                        </div>
                        <h6 className="fw-bolder fs-7 mt-4 mb-0">{leave.leavetype}</h6>
                        <h6 className="fs-7 text-dark ms-0">Total Leave: {leave.totalleave}</h6>
                        <h6 className="fs-7 text-primary">Available: {leave.availableleave}</h6>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No leave data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-3 mt-3 mb-3 col-sm-12">
          <div className="card rounded-4 shadow-lg p-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-4" style={{ maxHeight: "100px", paddingBottom: "10px" }}>
                <div className="d-flex justify-content-start ms-3 mt-3">
                  <h6 className="card-title">Alloted Holidays</h6>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="p-1"
                    onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                  >
                    {isCalendarVisible ? <i className="fa-solid fa-sliders"></i> : <i className="fa-solid fa-toggle-off"></i>}
                  </button>
                </div>
              </div>
              {isCalendarVisible && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button onClick={handlePrevMonth} className="p-1">
                      Prev
                    </button>
                    <h5 className="text-center">
                      {currentDate.toLocaleString("default", { month: "short" })} {currentDate.getFullYear()}
                    </h5>
                    <button onClick={handleNextMonth} className="p-1 ">
                      Next
                    </button>
                  </div>
                  <div className="calendar-grid">
                    <div className="d-grid grid-template-columns-7 text-center fw-bold">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                        <div key={index}>{day}</div>
                      ))}
                    </div>
                    <div className="d-grid grid-template-columns-7 text-center">
                      {daysArray.map((day, index) => {
                        const isDayToday = isToday(day);
                        const isDayWeekend = day && isWeekend(day);
                        const isDayHoliday = day && isHoliday(day);
                        return (
                          <div
                            key={index}
                            className={`day-cell ${isDayToday
                                ? "today-cell"
                                : isDayHoliday
                                  ? "holiday-cell"
                                  : isDayWeekend
                                    ? "weekend-cell"
                                    : ""
                              }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Employee Details Component */}
              {!isCalendarVisible && (
                <div className="p-0">
                  <div className="ag-theme-alpine rounded-4" style={{ height: 352, width: "100%", borderRadius: "15px" }}>
                    <AgGridReact columnDefs={holidayCols} rowData={holidayRowData} />
                  </div>
                </div>
              )}

              <style jsx>{`
            .calendar-grid {
              display: flex;
              flex-direction: column;
              gap: 1px;
            }

            .grid-template-columns-7 {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 3px;
            }

            .day-cell {
              padding: 8px;
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 60px;
              padding-left: 5px;
            }

            .weekend-cell {
              background-color: #ffe5e5;
            }

            .holiday-cell {
              background-color:rgb(86, 219, 115);
            }

            .today-cell {
              background-color: #cce5ff;
              font-weight: bold;
              border: 2px solid #007bff;
            }

            .day-cell:hover {
              background-color: #e9ecef;
              cursor: pointer;
            }
          `}</style>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3">
          <div className="card NewJoinees rounded-4 shadow-lg h-100" >
            <div className="card-body">
              <div className="d-flex justify-content-between flex-wrap align-items-center">
                <h6 className="card-title">New Joinees</h6>
                {/* <span className="dropdown-icon">⋮</span> */}
              </div>
              <div id="newJoineesCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner" >
                  {NewJoinees.length > 0 ? (
                    NewJoinees.map((joinee, index) => (
                      <div
                        key={joinee.id}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                        <div className="new-joinee-card text-center">
                          <img
                            src={joinee.Photos}
                            width={150}
                            height={150}
                            alt={`${joinee.EmployeeId}`}
                            className="d-block mx-auto rounded"
                          />
                          <p className="badge rounded-pill text-bg-info fs-6 mt-2">
                            {joinee.department_ID} - {joinee.EmployeeId}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    NewJoinees.map((joinee, index) => (
                      <div
                        // key={joinee.id}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                        <div className="new-joinee-card text-center">
                          <img
                            src={Vector}
                            width={180}
                            height={180}
                            alt=" No New Joinees"
                            className="d-block mx-auto rounded"
                          />
                          <p className="badge rounded-pill text-bg-info fs-6 mt-2">
                            No New Joinees
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {NewJoinees.length > 1 && (
                  <div className="NewJoineesbtn">
                    <button
                      className="carousel-control-prev NewJoineesbtn"
                      type="button"
                      data-bs-target="#newJoineesCarousel"
                      data-bs-slide="prev"


                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi Fbi-caret-left-fill text-dark" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                      </svg>
                    </button>
                    <button
                      className="carousel-control-next NewJoineesbtn"
                      type="button"
                      data-bs-target="#newJoineesCarousel"
                      data-bs-slide="next"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill text-dark" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>



        </div>
        <div className="col-lg-3 ">
          <div className="card Birthday rounded-4 shadow-lg h-100" style={{ maxHeight: "465px", paddingBottom: "80px" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title">Upcoming Birthdays</h6>
                {/* <span className="dropdown-icon">⋮</span> */}
              </div>
              <div className="birthday-container">
                {upcomingBirthdays.length > 0 ? (
                  upcomingBirthdays.map((person) => (
                    <div key={person.id} className="birthday-card">
                      <div className="d-flex justify-content-center mt-2">
                        <div className="">
                          <img
                            src={person.Photos}
                            width={110}
                            height={110}
                            style={{ borderRadius: "20px" }}
                            alt={person.Plainimg}
                          />
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        <h3 className="text-dark">{person.EmployeeName}</h3>
                        <p className="badge p-1 text-bg-warning fs-6">🎉🎂🎉🎂</p>
                      </div>
                    </div>
                  ))
                ) : (
                  upcomingBirthdays.map((person) => (
                    <div key={person.id} className="birthday-card">
                      <div className="d-flex justify-content-center mt-2">
                        <div className="">
                          <img
                            src={person.Vector}
                            width={110}
                            height={110}
                            style={{ borderRadius: "20px" }}
                            alt={person.Vector}
                          />
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        <h3 className="text-dark">There is no one birthdays</h3>
                        <p className="badge p-1 text-bg-warning fs-6">🎉🎂🎉🎂</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-8  ">
          <div className="card Birthday rounded-4 shadow-lg h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title">Productivity</h6>
                {/* <span className="dropdown-icon">⋮</span> */}
              </div>
              <div className="productivity-chart-container" style={{ width: "100%", height: "315px", padding: "20px" }}>
                <Line data={chartData} options={chartOptions} />

              </div>
            </div>
            </div>
            </div>
      </div>

      <div className="col-lg-12 col-md-12 mt-3">
        <div className="card Birthday rounded-4 shadow-lg h-100">
          <div className="card-body">

            <h6 className="d-flex justify-content-start ms-3 fw-bold fs-5">Search Criteria</h6>
            {/* <h6 className="d-flex justify-content-start ms-3 fw-bold fs-5">Employee Details</h6> */}

            <div className="row ms-3 me-3">
              <div className="col-md-4 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">From Date</label>
                  <input
                    id="startdate"
                    class="exp-input-field form-control"
                    type="date"
                    placeholder=""
                    required title="Please enter the founded date"
                    value={startdate}
                    onChange={(e) => setstartdate(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div className="col-md-4 form-group">
                <div className="exp-form-floating">
                  <label className="exp-form-labels">To Date</label>
                  <input
                    id="enddate"
                    class="exp-input-field form-control"
                    type="date"
                    placeholder=""
                    required title="Please enter the founded date"
                    value={enddate}
                    onChange={(e) => setenddate(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="col-md-2 form-group mb-2 mt-4">
                <div class="exp-form-floating">
                  <div class=" d-flex  justify-content-center">
                    <div class=''>
                      <icon className="popups-btn fs-6 p-3"
                        onClick={handleSearch}
                        required title="Search">
                        <i className="fas fa-search"></i>
                      </icon>
                    </div>
                    <div>
                      <icon className="popups-btn fs-6 p-3"
                        onClick={reloadGridData}
                        required title="Refresh">
                        <i className="fa-solid fa-arrow-rotate-right" />
                      </icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ag-theme-alpine mt-4 rounded-4" style={{ height: 540, width: '100%', borderRadius: "15px" }}>
                <AgGridReact
                  columnDefs={Employeecol}
                  rowData={rowData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
