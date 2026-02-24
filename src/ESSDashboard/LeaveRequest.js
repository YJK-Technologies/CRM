import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import LeavePopup from './LeaveReqPopup.js';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const config = require('../Apiconfig');


const LeaveRequestPage = () => {
  const [LeaveType, setLeaveType] = useState("");
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [Reason, setReason] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("");
  const [Select_slots, setSelect_Slots] = useState("");
  const [AlternativeReponsablePerson, setReasponsiblePerson] = useState("");
  const [ReportingManager, setReportingManager] = useState("");
  const [LeaveDrop, setLeaveDrop] = useState([]);
  const [SelectedLeave, setSelectedLeave] = useState("");
  const navigate = useNavigate();
  const [SlotDrop, setSlotDrop] = useState([]);
  const [SelectedSlot, setSelectedSlot] = useState("");
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [rowData, setrowData] = useState([]);
  const [error, setError] = useState('');
  const [Managerdrop, setManagerdrop] = useState([]);
  const [selectedmanager, setselectedmanager] = useState('');
  const gridRef = useRef()

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getapplyLeavetype`,{
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //   company_code: sessionStorage.getItem("selectedCompanyCode"),
  //   })
  // })
  //     .then((data) => data.json())
  //     .then((val) => setLeaveDrop(val));
  // }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getapplyLeavetype`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setLeaveDrop(val))
  }, []);

  const filterOptionLeaveType = LeaveDrop.map((option) => ({
    value: option.LeaveId,
    label: option.LeaveId,
  }));


  const handleLeaveType = (SelectedLeave) => {
    setSelectedLeave(SelectedLeave);
    setLeaveType(SelectedLeave ? SelectedLeave.value : '');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSelectslot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setSlotDrop(val));
  }, []);


  // useEffect(() => {
  // //   fetch(`${config.apiBaseUrl}/getSelectslot`)
  //  .then((data) => data.json())
  //     .then((val) => setSlotDrop(val));
  // }, []);


  const filterOptionSelect_Slots = SlotDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleSelect_Slots = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
    setSelect_Slots(selectedSlot ? selectedSlot.value : '');
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    validateDates(FromDate, e.target.value);
  };

  const handleFromDate = (e) => {
    setFromDate(e.target.value);
    validateDates(ToDate, e.target.value);
  };

  const validateDates = (FromDate, ToDate) => {
    if (FromDate && ToDate) {
      const fromDateObj = new Date(FromDate);
      const toDateObj = new Date(ToDate);

      if (fromDateObj > toDateObj) {
        toast.warning("From Date should not be after To Date");
      } else {
        setError("");
      }
    }
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getEmployeeTotalLeaveBalance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        EmployeeId: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setrowData(val));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!LeaveType ||
      !FromDate ||
      !ToDate ||
      !Select_slots ||
      !Reason ||
      !ReportingManager ||
      !AlternativeReponsablePerson) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    const formData = {
      LeaveType,
      FromDate,
      ToDate,
      Select_slots,
      Reason,
      ReportingManager,
      EmployeeId: sessionStorage.getItem("selectedUserCode"),
      company_code: sessionStorage.getItem('selectedCompanyCode'),
      created_by: sessionStorage.getItem("selectedUserCode"),
      AlternativeReponsablePerson,
    };

    try {

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeLeave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form Submitted Successfully", data);
        toast.success("Form Submitted Successfully");
        // setLeaveType("");
        // setFromDate("");
        // setToDate("");
        // setSelect_Slots("");
        // setReason("");
        // setReportingManager("");
        // setReasponsiblePerson("");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || 'Something went wrong.'}`);
      }

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("There was an error submitting the form. Please try again.");
    }
  };

  const [columnDefs] = useState([
    { headerName: 'Leave Type', field: 'leavetype', sortable: true, filter: true },
    { headerName: 'No of Leaves', field: 'creditedleave', sortable: true, filter: true },
    { headerName: 'No of Available Leaves', field: 'availableleave', sortable: true, filter: true },
  ]);


  const goBack = () => {
    navigate('/EmployeeDashboard');
  };

  const handleClose = () => {
    setOpen(false);

  };

  const [open, setOpen] = React.useState(false);
  const handleadjustmentbtn = () => {
    setOpen(true);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleLeave = async (data) => {

    if (data && data.length > 0) {
      const [{ LeaveType, FromDate, ToDate, LeaveStatus }] = data;

      setLeaveStatus(LeaveStatus);

      const fromDate = document.getElementById('FromDate');
      if (fromDate) {
        fromDate.value = FromDate;
        setFromDate(formatDate(FromDate));
      } else {
        console.error('FromDate not found');
      }

      const toDate = document.getElementById('ToDate');
      if (toDate) {
        toDate.value = ToDate;
        setToDate(formatDate(ToDate));
      } else {
        console.error('ToDate not found');
      }

      const leaveType = document.getElementById('LeaveType');
      if (leaveType) {
        const selectedLeaveType = filterOptionLeaveType.find(option => option.value === LeaveType);
        setSelectedLeave(selectedLeaveType);
        setLeaveType(selectedLeaveType.value);
      } else {
        console.error('LeaveType not found');
      }

    } else {
      console.log("Data not fetched...!");
    }
    console.log(data);
  };

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setReportingManager(selectedOption ? selectedOption.value : '');
  };

  const [leaveRowData, setLeaveRowData] = useState([]);
  const [leaveDrop, setleaveDrop] = useState([]);
  const [statusDrop, setstatusDrop] = useState([]);
  const [leaveType, setleaveType] = useState("");
  const [selectedLeave, setselectedLeave] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [LeaveStatus, setleaveStatus] = useState("");

  const leaveColumnDefs = [
    {
      checkboxSelection: true,
      headerName: "Leave Type",
      field: "LeaveType",
      cellStyle: { textAlign: "center" },
      editable: false,
    },
    {
      headerName: "From Date",
      field: "FromDate",
      editable: false,
      cellStyle: { textAlign: "center" },
      valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
    },
    {
      headerName: "To Date",
      field: "ToDate",
      editable: false,
      cellStyle: { textAlign: "center" },
      valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
    },
    {
      headerName: "Leave Status",
      field: "LeaveStatus",
      editable: false,
      cellStyle: { textAlign: "center" },
    },
  ];

  const handleSearchItem = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getEmployeeLeavesearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          EmployeeId: sessionStorage.getItem('selectedUserCode'),
          FromDate:fromDate,
          ToDate:toDate,
          LeaveStatus:LeaveStatus,
          LeaveType:leaveType
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setLeaveRowData(searchData);
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        setLeaveRowData([]);
        clearInputs([]);
        toast.warning("Data not found")
        console.log("Data not found");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {
        })
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleReload = () => {
    clearInputs([])
    setLeaveRowData([])
  };

  const clearInputs = () => {
    setfromDate('');
    settoDate('');
    setleaveStatus('');
    setleaveType('');
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getapplyLeavetype`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setleaveDrop(val))
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getLeaveStatus`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setstatusDrop(val))
  }, []);

  const filterOptionLeaves = [{ value: 'All', label: 'All' }, ...leaveDrop.map((option) => ({
    value: option.LeaveId,
    label: option.LeaveId,
  }))];

  const filterOptionStatus = [{ value: 'All', label: 'All' }, ...statusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const handleLeaves = (SelectedLeave) => {
    setselectedLeave(SelectedLeave);
    setleaveType(SelectedLeave ? SelectedLeave.value : '');
  };

  const handleStatus = (SelectedStatus) => {
    setselectedStatus(SelectedStatus);
    setleaveStatus(SelectedStatus ? SelectedStatus.value : '');
  };

  const handleConfirm = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select a row to load data");
      return;
    }

    const row = selectedRows[0];

    // Update all fields with selected row values
    setSelectedLeave({
      value: row.LeaveType,
      label: row.LeaveType,
    });

    setFromDate(row.FromDate ? format(new Date(row.FromDate), "yyyy-MM-dd") : "");
    setToDate(row.ToDate ? format(new Date(row.ToDate), "yyyy-MM-dd") : "");
    setleaveStatus(row.LeaveStatus || "");
  };

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    flex: 1
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow bg-white p-1 mt-2 mb-2 border-secondary rounded-3">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="mb-2 d-flex">Apply Leave</h1>
          </div>
          <div className="d-flex justify-content-start">
            <div class="mt-3">
              <delbutton class="p-5" style={{ cursor: "pointer" }} onClick={goBack}>
                <i class="fa-solid fa-circle-xmark"></i>
              </delbutton>
            </div>
          </div>
        </div>
      </div>
      <div>
      </div>
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow bg-white border-secondary rounded-3 p-4">
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className={`form-label ${error && !LeaveType ? 'text-danger' : ''}`}>
                  Leave Type<span className="text-danger">*</span>
                </label>
                <Select
                  id="LeaveType"
                  value={SelectedLeave}
                  onChange={handleLeaveType}
                  options={filterOptionLeaveType}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Select Slot</label>
                <Select
                  id="Select_slots"
                  value={SelectedSlot}
                  onChange={handleSelect_Slots}
                  options={filterOptionSelect_Slots}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className={`form-label ${error && !FromDate ? 'text-danger' : ''}`}>
                  From Date<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={FromDate}
                  onChange={handleFromDate}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className={`form-label ${error && !ToDate ? 'text-danger' : ''}`}>
                  To Date<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={ToDate}
                  onChange={handleToDateChange}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className={`form-label ${error && !Reason ? 'text-danger' : ''}`}>
                  Reason<span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  value={Reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  placeholder="Enter Reason for leave"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className={`form-label ${error && !ReportingManager ? 'text-danger' : ''}`}>
                  Reporting Manager<span className="text-danger">*</span>
                </label>
                <Select
                  value={selectedmanager}
                  options={filteredOptionManager}
                  onChange={handleChangemanager}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className={`form-label ${error && !AlternativeReponsablePerson ? 'text-danger' : ''}`}>
                  Responsible Person<span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={AlternativeReponsablePerson}
                  onChange={(e) => setReasponsiblePerson(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="d-flex mt-3 gap-3">
              {/* {leaveStatus !== "Pending" && leaveStatus !== "Approved" && (
                <button className="btn btn-primary" onClick={handleSave}>Apply</button>
              )}
              <button className="btn btn-secondary" onClick={handleadjustmentbtn}>
                Applied Leaves
              </button> */}
              {(LeaveStatus === "Pending" || LeaveStatus === "Rejected" || LeaveStatus === "") && (
                <button className="btn btn-primary" onClick={handleSave}>
                  Apply
                </button>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="pt-3">
              <h5>Leave Balance</h5>
              <div className="ag-theme-alpine" style={{ height: 300, width: "100%", borderRadius: "10px" }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  rowHeight={30}
                  domLayout="autoHeight"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <LeavePopup open={open} handleClose={handleClose} handleLeave={handleLeave} /> */}
      </div>
      <div className="shadow bg-white border-secondary rounded-3 mt-3 p-4">
        <h4 className="ms-1">Search Criteria :</h4>
        <div className="row">
          <div className="col-md-2 mb-3">
            <label className="form-label">
              From Date
            </label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setfromDate(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">
              To Date
            </label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => settoDate(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">
              Leave Type
            </label>
            <Select
              id="LeaveType"
              value={selectedLeave}
              onChange={handleLeaves}
              options={filterOptionLeaves}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Leave Status</label>
            <Select
              id="Select_slots"
              value={selectedStatus}
              onChange={handleStatus}
              options={filterOptionStatus}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
            />
          </div>
          <div className="col-md-2 mb-3">
            <div className="mt-4 d-flex justify-content-end">
              <icon className="icon popups-btn" onClick={handleSearchItem}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </icon>
              <icon className="icon popups-btn" onClick={handleReload}>
                <i class="fa-solid fa-arrow-rotate-right"></i>
              </icon>
              <icon className="icon popups-btn" onClick={handleConfirm}>
                <FontAwesomeIcon icon="fa-solid fa-check" />
              </icon>
            </div>
          </div>
          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
            <AgGridReact
              rowData={leaveRowData}
              columnDefs={leaveColumnDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
              ref={gridRef}
            // onSelectionChanged={handleRowSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
