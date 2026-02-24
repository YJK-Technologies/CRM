import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './EmployeeLoan.css';
import '../apps.css';
import config from '../Apiconfig';

function Input() {
  const [EmployeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [intervalId, setIntervalId] = useState(null);
  const [secondsPassed, setSecondsPassed] = useState(0); // Track total seconds passed
  const [open3, setOpen3] = React.useState(false);
  const [error, setError] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  // Timer Functions
  const startTimer = () => {
    const startTime = Date.now() - secondsPassed * 1000; // Start from where it left off
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
      setSecondsPassed(elapsed);
      setTimer(formatTime(elapsed));
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSecondsPassed(0);
    setTimer("00:00:00");
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleInsert = async () => {
    if (!EmployeeId || !date) {
      toast.warning("Employee ID and date are required.");
      return;
    }
   
    try {
      const response = await fetch(`${config.apiBaseUrl}/addDailyattendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmployeeId,
          date,
          created_by: sessionStorage.getItem("selectedUserCode"),
        }),
      });

      if (response.status === 200) {
        toast.success("Data inserted successfully!");
        setIsCheckedIn((prev) => {
          if (prev) {
            stopTimer(); // Stop the timer if checked out
          } else {
            startTimer(); // Start or resume the timer if checked in
          }
          return !prev; // Toggle check-in state
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
  const handleDailyAttendance= () => {
    setOpen3(true);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleDailyAttendance(EmployeeId)
    }
  };

//mathu-3-12-2024

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleDelete = async () => {
    if (
      !EmployeeId) {
      setError("Please fill all required fields.");
      return;
    }
  
    try {
      const deatils = {
        EmployeeId: EmployeeId
      }
  
      const response = await fetch(`${config.apiBaseUrl}/deleteDailyattendance`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deatils),
      });
  
      if (response.status === 200) {
        console.log("Data deleted successfully");
        setTimeout(() => {
          toast.success("Data deleted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {
        })
      }
    } catch (error) {
      console.error("Error delete data:", error);
      toast.error('Error delete data: ' + error.message, {
      });
    }
  };

  const handleUpdate = async () => {
    if (!EmployeeId || !date) {
      toast.warning("Employee ID and date are required.");
      return;
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/updateDailyattendance`, {
        method: "PUT",
        
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmployeeId,
          date,
          updated_by: sessionStorage.getItem("selectedUserCode"),
        }),
      });
  
      if (response.status === 200) {
        toast.success("Data updated successfully!");
        setIsCheckedIn((prev) => {
          if (prev) {
            stopTimer();
          } else {
            startTimer();
          }
          return !prev; // Toggle check-in state
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      toast.error("Error updating data: " + error.message);
    }
  };


  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" theme="colored" />
      <div className="shadow-lg p-0 bg-light rounded">
        <div className="purbut mb-0 d-flex justify-content-between">
          <h1 align="left" className="purbut">Employee Attendance</h1>
        </div>
      </div>

      <div className="shadow-lg bg-light rounded mt-2 p-3">
        <div className="row">
        <div class="d-flex justify-content-start">
            <div>
              <label for="cno" class="exp-form-labels">Employee ID </label>
            </div>
            <div>
              <span className="text-danger">*</span>
            </div>
          </div>
            <input
              id="cno"
              className=" form-control p-2"style={{width:"350px"}}
              type="text"
               placeholder=""
              required title="Please enter the company code"
              value={EmployeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              maxLength={18}
              onKeyPress={handleKeyPress}
            />
             <div className="position-absolute mt-4 me-1" style={{marginLeft:"300px"}}>
        <span className="icon searchIcon" 
        onClick={handleDailyAttendance}>
        <i className="fa fa-search"></i>
        </span>
      
      
          </div>
        
        <div className="col-md-1"> 

<div class=" d-flex justify-content-start  mt-2">
<div className="me-2">
{isUpdateMode ?           
(<savebutton 
// className="ESSbut rounded-5 p-3 ms-0 text-dark fs-6" 
onClick={handleUpdate} 
title="Save">
<i class="fa-solid fa-pen"></i>
</savebutton>
):(
<savebutton 
// className="ESSbut rounded-5 p-3 ms-0  fs-6" 
onClick={handleInsert} 
title="Save">
<i className="fa-solid fa-floppy-disk"></i>
</savebutton>

)}



</div>
<div className="ms-2">

<delbutton 
onClick={handleDelete} 
title="Delete">
<i className="fa-regular fa-trash-can"></i>
</delbutton>
</div>
<div className="col-md-1"> 
<div className="ms-2">
<reloadbutton
className="purbut"
onClick={reloadGridData}
title="save">
<i className="fa-solid fa-arrow-rotate-right"></i> 
</reloadbutton>
</div>
</div>
</div>         
</div>
</div>
      </div>

      <div className="shadow-lg bg-light rounded-top mt-2 pt-3">
        <button className="p-2 ms-2 shadow-sm addTab">Employee Attendance</button>
      </div>

      <div className="shadow-lg p-3 bg-light rounded-bottom mb-2">
        <div className="row">
          <div className="col-md-3 form-group mb-2">
            <label htmlFor="fdate" className="exp-form-labels">
              Date <span className="text-danger">*</span>
            </label>
            <input
              id="fdate"
              className="form-control"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 form-group mt-4">
            <button
              onClick={handleInsert}
              className="btn"
              style={{
                backgroundColor: isCheckedIn ? "red" : "green",
                color: "white",
              }}
              title={isCheckedIn ? "Check Out" : "Check In"}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </button>
          </div>

          <div className="col-md-3 form-group mb-2">
            <label htmlFor="timing" className="exp-form-labels">Timing</label>
            <input
              id="timing"
              className="form-control"
              type="text"
              readOnly
              value={timer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Input;
