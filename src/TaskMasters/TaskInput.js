import React, { useState, useEffect, useRef } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import { useLocation } from "react-router-dom";
const config = require('../Apiconfig');

export default function TaskInputPopup({ open, handleClose, ProjectID }) {

  const [TaskMaster, setTaskMaster] = useState('');
  const [Title, setTitle] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [UserID, setUserID] = useState('');
  const [Endtime, setEndtime] = useState('');
  const [StartDate, setStartDate] = useState('');
  const [selectedtstatus, setselectedtstatus] = useState('');
  const [status_type, setstatus_type] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [Descriptions, setDescriptions] = useState("");
  const [buffer, setbuffer] = useState("");
  const [selectedPriortyLeavel, setSelectedPriortyLeavel] = useState('');
  const [PriorityLevel, setPriorityLevel] = useState('');
  const [PriorityDrop, setPriorityDrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [userDrop, setUserDrop] = useState([]);
  
  const handleChangePriorityLevel = (selectedPriortyLeavel) => {
    setSelectedPriortyLeavel(selectedPriortyLeavel);
    setPriorityLevel(selectedPriortyLeavel ? selectedPriortyLeavel.value : '');
  };

  const handleChangestatus = (selectedstatus) => {
    setselectedtstatus(selectedstatus);
    setstatus_type(selectedstatus ? selectedstatus.value : '');
  };



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setPriorityDrop(val));
  }, []);

  const filteredOptionPriorityLevel = PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionTransaction = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));



  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTaskstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUserID(selectedUser ? selectedUser.value : '');
  };

  const filteredOptionUser = Array.isArray(userDrop)
  ? userDrop.map((option) => ({
    value: option.user_code,
    label: `${option.user_code} - ${option.user_name}`,
  }))
  : [];

  
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/usercode`)
      .then((data) => data.json())
      .then((val) => setUserDrop(val));
  }, []);

  const handleSave = async (e) => {

    if (!ProjectID || !UserID || !Title || !StartDate || !EndDate || !Endtime || !Descriptions) {
      setError(" ");
      toast.warning("Missing Required Fields")
      return;
    }

    e.preventDefault();
    setSaveButtonVisible(true);
    setIsSaving(true);
    setMessage('');

    const data = {
      TaskTitle: Title,
      Description: Descriptions,
      ProjectID: ProjectID,
      userID: UserID,
      StartDate: StartDate,
      EndDate: EndDate,
      EstimatedHours: Endtime,
      TaskStatus: status_type,
      BufferHours: buffer,
      PriorityLevel: PriorityLevel,
      company_code : sessionStorage.getItem("selectedCompanyCode"),
      created_by: sessionStorage.getItem('selectedUserCode')
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/addTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ TaskMasterID }] = searchData;
        setTaskMaster(TaskMasterID);
        toast.success("Tasks inserted Successfully")
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }

    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }
  };

  return (
    <div className="">
      {open && (
        <fieldset>
          <div className="purbut">
            <div className="purbut modal popupadj popup mt-5" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog  modal-xl  ps-5 p-1 pe-5" role="document">
                <div className="modal-content">
                  <div class="row ">
                    <div class="col-md-12 text-center">
                      <div >
                      </div>
                      <div>
                        <div>
                          <div className=" mb-0 d-flex justify-content-between" >
                            <h1 align="left" class="purbut fs-4">Add Task Master</h1>
                            <button onClick={handleClose} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="pt-2 mb-4">
                      <div class="row ms-3 me-3 mb-3">
                      <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="add1" className={`${error && !ProjectID ? 'red' : ''}`}>Project ID<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="LoanEligibleAmount"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Project ID"
                              value={ProjectID}
                              maxLength={50}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div className="exp-form-floating">
                            <div className="d-flex justify-content-start">
                              <div>
                                <label htmlFor="EmployeeId">Task Master ID</label>
                              </div>
                            </div>
                            <div class="d-flex justify-content-end">
                              <input
                                id="EmployeeId"
                                className="exp-input-field form-control p-2"
                                type="text"
                                placeholder=""
                                required
                                title="Please enter the Task Master ID"
                                value={TaskMaster}
                                onChange={(e) => setTaskMaster(e.target.value)}
                                maxLength={20}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="add2" className={`${error && !Title ? 'red' : ''}`}>Task Title<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="EffetiveDate"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Task Title"
                              value={Title}
                              onChange={(e) => setTitle(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                        </div>                   
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="add1" className={`${error && !UserID ? 'red' : ''}`}>User ID<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <Select
                              id="LoanEligibleAmount"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please Select the User ID"
                              value={selectedUser}
                              onChange={handleChangeUser}
                              options={filteredOptionUser}
                              maxLength={30}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="sname" className={`${error && !StartDate ? 'red' : ''}`}>Start Date<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="date"
                              class="exp-input-field form-control"
                              type="date"
                              placeholder=""
                              required title="Please Choose the Date"
                              value={StartDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="sname" className={`${error && !EndDate ? 'red' : ''}`}>End Date<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="date"
                              class="exp-input-field form-control"
                              type="date"
                              placeholder=""
                              required title="Please Choose the Date"
                              value={EndDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="add3" className={`${error && !Endtime ? 'red' : ''}`}>Estimated Hours <span className="text-danger">*</span></label>
                            <input
                              id="EndDate"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Estimated Hours"
                              value={Endtime}
                              onChange={(e) => setEndtime(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="add3" className={`${error && !buffer ? 'red' : ''}`}>
                              Buffer Hours <span className="text-danger">*</span>
                            </label>
                            <input
                              id="EndDate"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Buffer Hours"
                              value={buffer}
                              onChange={(e) => setbuffer(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label For="city" className={`${error && !Descriptions ? 'red' : ''}`}>Task Description<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <textarea
                              id="HowManyMonth"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              value={Descriptions}
                              onChange={(e) => setDescriptions(e.target.value)}
                              required title="Please enter the Task Description"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="add3" className={`${error && !selectedtstatus ? 'red' : ''}`}>Task Status <span className="text-danger">*</span></label>
                            <Select
                              id="taskstatus"
                              class="exp-input-field form-control"
                              required title="Please Select the Task Task Status"
                              type="text"
                              placeholder=""
                              value={selectedtstatus}
                              onChange={handleChangestatus}
                              options={filteredOptionTransaction}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="tcode" className={`${error && !selectedPriortyLeavel ? 'red' : ''}`}>Priority Level <span className="text-danger">*</span></label>
                            <Select
                              id="PriorityLevel"
                              className="exp-input-field"
                              type="text"
                              required title="Please Select the Task Priority Level"
                              placeholder=""
                              value={selectedPriortyLeavel}
                              onChange={handleChangePriorityLevel}
                              options={filteredOptionPriorityLevel}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2 mt-3">
                          <div class="exp-form-floating">
                            <button className=''                               required title=" Submit "onClick={handleSave}>
                              <i class="fa-brands fa-instalod"></i> Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobileview">
            <div className=" modal mt-5" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog  modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div className="mb-0 d-flex justify-content-between">
                        <div className="mb-0 d-flex justify-content-start me-4">
                          <h1 align="left" className="h1">Add Task Master</h1>
                        </div>
                        <div className="mb-0 d-flex justify-content-end" >
                          <button onClick={handleClose} className="closebtn2" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                        </div>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div class="row ms-3 me-3 mb-3">
                        <div className="col-md-3 form-group mb-2">
                          <div className="exp-form-floating">
                            <div className="d-flex justify-content-start">
                              <div>
                                <label htmlFor="EmployeeId" className="">Task Master ID</label>
                              </div>
                            </div>
                            <div class="d-flex justify-content-end">
                              <input
                                id="EmployeeId"
                                className="exp-input-field form-control p-2"
                                type="text"
                                placeholder=""
                                required
                                title="Please enter the company code"
                                value={TaskMaster}
                                onChange={(e) => setTaskMaster(e.target.value)}
                                maxLength={20}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div className="exp-form-floating">
                            <div className="d-flex justify-content-start">
                              <div>
                                <label htmlFor="EmployeeId" className={`${error && !Title ? 'red' : ''}`}>Task Title</label>
                              </div>
                            </div>
                            <div class="d-flex justify-content-end">
                              <input
                                id="EmployeeId"
                                className="exp-input-field form-control p-2"
                                type="text"
                                placeholder=""
                                required
                                title="Please enter the company code"
                                value={Title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={100}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="add1" className={`${error && !ProjectID ? 'red' : ''}`}>Project ID<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="LoanEligibleAmount"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the address"
                              value={ProjectID}
                              maxLength={50}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="add1" className={`${error && !UserID ? 'red' : ''}`}>User ID<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="LoanEligibleAmount"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the address"
                              value={UserID}
                              onChange={(e) => setUserID(e.target.value)}
                              maxLength={30}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="sname" className={`${error && !StartDate ? 'red' : ''}`}>Start Date<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="date"
                              class="exp-input-field form-control"
                              type="date"
                              placeholder=""
                              required title="Please enter the From Date"
                              value={StartDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label for="sname" className={`${error && !EndDate ? 'red' : ''}`}>End Date<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <input
                              id="date"
                              class="exp-input-field form-control"
                              type="date"
                              placeholder=""
                              required title="Please enter the From Date"
                              value={EndDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="add3" className={`${error && !Endtime ? 'red' : ''}`}>Hours Taken<span className="text-danger">*</span></label>
                            <input
                              id="EndDate"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the address"
                              value={Endtime}
                              onChange={(e) => setEndtime(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="add3" className={`${error && !buffer ? 'red' : ''}`}>Buffer Hours<span className="text-danger">*</span></label>
                            <input
                              id="EndDate"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the address"
                              value={buffer}
                              onChange={(e) => setbuffer(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <div class="d-flex justify-content-start">
                              <div>
                                <label For="city" className={`${error && !Descriptions ? 'red' : ''}`}>Task Description<span className="text-danger">*</span></label>
                              </div>
                            </div>
                            <textarea
                              id="HowManyMonth"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              value={Descriptions}
                              onChange={(e) => setDescriptions(e.target.value)}
                              required title="Please enter the address"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="add3" className={`${error && !selectedtstatus ? 'red' : ''}`}>Task Status<span className="text-danger">*</span></label>
                            <Select
                              id="taskstatus"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              value={selectedtstatus}
                              onChange={handleChangestatus}
                              options={filteredOptionTransaction}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="add3" className={`${error && !selectedPriortyLeavel ? 'red' : ''}`}>Priority Level <span className="text-danger">*</span></label>
                            <Select
                              id="taskstatus"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              value={selectedPriortyLeavel}
                              onChange={handleChangePriorityLevel}
                              options={filteredOptionPriorityLevel}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2 mt-5">
                          <div class="exp-form-floating">
                            <button className='' onClick={handleSave}>
                              <i class="fa-brands fa-instalod"></i> Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
