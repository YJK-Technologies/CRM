import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';
import { ToastContainer, toast } from 'react-toastify';

const config = require('./Apiconfig');

function UserInput({ }) {
  const [user_code, setUser_code] = useState("");
  const [user_name, setUser_name] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [user_password, setUser_password] = useState("");
  const [user_status, setUser_status] = useState("");
  const [log_in_out, setLog_in_out] = useState("");
  const [role_id, setRole] = useState("");
  const [email_id, setEmail_id] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLog, setSelectedLog] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [roleDrop, setRoleDrop] = useState([]);
  const [Genderdrop, setGenderdrop] = useState([]);
  const [Loginoroutdrop, setLoginoroutdrop] = useState([]);
  const [error, setError] = useState("");
  const [user_images, setuser_image] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const usercode = useRef(null);
  const username = useRef(null);
  const firstname = useRef(null);
  const lastname = useRef(null);
  const password = useRef(null);
  const Status = useRef(null);
  const loginlogout = useRef(null);
  const usertype = useRef(null);
  const email = useRef(null);
  const Dob = useRef(null);
  const Gender = useRef(null);
  const ImagE = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const created_by = sessionStorage.getItem('selectedUserCode')
  const modified_by = sessionStorage.getItem("selectedUserCode");

  const [isUpdated, setIsUpdated] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  console.log(selectedRow);

  const clearInputFields = () => {
    setUser_code("");
    setUser_name("");
    setFirst_name("");
    setLast_name("");
    setSelectedStatus("");
    setSelectedRole("");
    setSelectedLog("");
    setSelectedGender("");
    setEmail_id("");
    setDob("");
    setSelectedImage("");
    if (ImagE.current) {
      ImagE.current.value = null;
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setUser_code(selectedRow.user_code || "");
      setUser_name(selectedRow.user_name || "");
      setFirst_name(selectedRow.first_name || "");
      setLast_name(selectedRow.last_name || "");
      setUser_password(selectedRow.user_password || "");
       setRole(selectedRow.role_id || "");
        setLog_in_out(selectedRow.log_in_out || "");
        setUser_status(selectedRow.user_status || "");
        setGender(selectedRow.gender || "");
      setSelectedStatus({
        label: selectedRow.user_status,
        value: selectedRow.user_status,
      });
      setSelectedRole({
        label: selectedRow.role_id,
        value: selectedRow.role_id,
      });
      setSelectedLog({
        label: selectedRow.log_in_out,
        value: selectedRow.log_in_out,
      });
      setSelectedGender({
        label: selectedRow.gender,
        value: selectedRow.gender,
      });
      setEmail_id(selectedRow.email_id || "");

      if (selectedRow.dob) {
        const formattedDate = new Date(selectedRow.dob).toISOString().split("T")[0];
        setDob(formattedDate);
      } else {
        setDob("");
      }

      if (selectedRow.user_images && selectedRow.user_images.data) {
        const base64Image = arrayBufferToBase64(selectedRow.user_images.data);
        const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'user_image.jpg');
        setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
        setuser_image(file);
      } else {
        setSelectedImage(null);
        setuser_image(null);
      }

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const base64ToFile = (base64Data, fileName) => {
    if (!base64Data || !base64Data.startsWith("data:")) {
      throw new Error("Invalid base64 string");
    }

    const parts = base64Data.split(',');
    if (parts.length !== 2) {
      throw new Error("Base64 string is not properly formatted");
    }

    const mimePart = parts[0];
    const dataPart = parts[1];

    const mime = mimePart.match(/:(.*?);/);
    if (!mime || !mime[1]) {
      throw new Error("Could not extract MIME type");
    }

    const binaryString = atob(dataPart);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    const fileBlob = new Blob([uint8Array], { type: mime[1] });
    return new File([fileBlob], fileName, { type: mime[1] });
  };


  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {

        toast.error('File size exceeds 1MB. Please upload a smaller file.')
        event.target.value = null;
        return;
      }
      if (file) {
        setSelectedImage(URL.createObjectURL(file));
        setuser_image(file);
      }
    }
  };


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Loginorout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setLoginoroutdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/gender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setGenderdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/UserRole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setRoleDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionRole = roleDrop.map((option) => ({
    value: option.role_id,
    label: option.role_name,
  }));

  const filteredOptionLog = Loginoroutdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionGender = Genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setUser_status(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeRole = (selectedRole) => {
    setSelectedRole(selectedRole);
    setRole(selectedRole ? selectedRole.value : '');
  };

  const handleChangeLog = (selectedLog) => {
    setSelectedLog(selectedLog);
    setLog_in_out(selectedLog ? selectedLog.value : '');
  };

  const handleChangeGender = (selectedGender) => {
    setSelectedGender(selectedGender);
    setGender(selectedGender ? selectedGender.value : '');
  };

  const handleInsert = async () => {
    if (
      !user_code ||
      !user_name ||
      !first_name ||
      !last_name ||
      !user_password ||
      !user_status ||
      !role_id ||
      !email_id ||
      !dob
    ) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    if (!validateEmail(email_id)) {
      toast.warning("Invalid email format.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("user_code", user_code);
      formData.append("user_name", user_name);
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("user_password", user_password);
      formData.append("user_status", user_status);
      formData.append("log_in_out", log_in_out);
      formData.append("email_id", email_id);
      formData.append("dob", dob);
      formData.append("role_id", role_id);
      formData.append("gender", gender);
      formData.append("created_by", sessionStorage.getItem("selectedUserCode"));

      if (user_images) {
        formData.append("user_img", user_images); // Appending the image file
      }

      const response = await fetch(`${config.apiBaseUrl}/useradd`, {
        method: "POST",
        body: formData, // Sending formData
      });

      if (response.ok) {
      toast.success("Data inserted Successfully", {
       onClose: () => clearInputFields()
       });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error('Failed to insert data');
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  function validateEmail(email) {
    const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleNavigate = () => {
    navigate("/User"); // Pass selectedRows as props to the Input component
  };

  // const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
  //   if (e.key === 'Enter') {
  //     // Check if the value has changed and handle the search logic
  //     if (hasValueChanged) {
  //       await handleKeyDownStatus(e); // Trigger the search function
  //       setHasValueChanged(false); // Reset the flag after the search
  //     }

  //     // Move to the next field if the current field has a valid value
  //     if (value) {
  //       nextFieldRef.current.focus();
  //     } else {
  //       e.preventDefault(); // Prevent moving to the next field if the value is empty
  //     }
  //   }
  // };

    const handleKeyDown = (e, nextRef, currentRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // For update mode, skip to Email from Log In/Out
      if (mode === 'update' && currentRef === loginlogout) {
        email.current?.focus();
      } else {
        nextRef?.current?.focus();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };


  const handleUpdate = async () => {
    if (
      !user_code ||
      !user_name ||
      !first_name ||
      !last_name ||
      !user_password ||
      !selectedRole ||
      !email_id ||
      !selectedStatus ||
      !dob
    ) {
      setError(" ");
      toast.warning("Please fill all required fields.");
      return;
    }

    if (!validateEmail(email_id)) {
      toast.warning("Invalid email format.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_code", sessionStorage.getItem("selectedCompanyCode"));
      formData.append("user_code", user_code);
      formData.append("user_name", user_name);
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("user_password", user_password);
      formData.append("user_status", selectedStatus.value);
      formData.append("log_in_out", selectedLog.value);
      formData.append("email_id", email_id);
      formData.append("dob", dob);
      formData.append("status", selectedStatus.value);
      formData.append("gender", selectedGender.value);
      formData.append("role_id", selectedRole.value);
      formData.append("modified_by", modified_by);

      if (user_images) {
        formData.append("user_images", user_images);
      }
      const response = await fetch(`${config.apiBaseUrl}/UserUpdates`, {
        method: "POST",
        body: formData,
      });

       if (response.ok) {
                    toast.success("Data updated successfully", {
                      onClose: () => clearInputFields()
                    });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to Update data");
        toast.error("Failed to Update data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class=""  >
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div class="row ">
            <div class="col-md-12 text-center" >
              <div >
              </div>
              <div>
                <div>
                  <div className="shadow-lg p-0 bg-body-tertiary rounded  ">
                    <div className=" mb-0 d-flex justify-content-between" >
                      <h1 align="left" class="purbut">{mode === "update" ? 'Update User' : 'Add User'}</h1>
                      <h1 align="left" class="mobileview fs-4">{mode === "update" ? 'Update User' : 'Add User'}</h1>
                      <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-2 mb-4">
              <div className="shadow-lg p-4 bg-body-tertiary rounded  mb-2">
                <div class="row">
                  <div className="col-md-3 form-group mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !user_code ? 'text-danger' : ''}`}>
                            User Code<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="ucode"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the user code"
                        value={user_code}
                        onChange={(e) => setUser_code(e.target.value)}
                        maxLength={18}
                        ref={usercode}
                        onKeyDown={(e) => handleKeyDown(e, username, usercode)}
                        readOnly={mode === "update"}
                      />
                      {/* {error && !user_code && <div className="text-danger">User Code should not be blank</div>} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !user_name ? 'text-danger' : ''}`}>
                            User Name<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="uname"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the user name"
                        value={user_name}
                        onChange={(e) => setUser_name(e.target.value)}
                        maxLength={250}
                        ref={username}
                        onKeyDown={(e) => handleKeyDown(e, firstname, username)}
                      />
                      {/* {error && !user_name && <div className="text-danger">User Name should not be blank</div>} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !first_name ? 'text-danger' : ''}`}>
                            First Name<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="fname"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the first name"
                        value={first_name}
                        onChange={(e) => setFirst_name(e.target.value)}
                        maxLength={250}
                        ref={firstname}
                        onKeyDown={(e) => handleKeyDown(e, lastname, firstname)}
                      />
                      {/* {error && !first_name && <div className="text-danger">First Name should not be blank</div>} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !last_name ? 'text-danger' : ''}`}>
                            Last Name<span className="text-danger">*</span>
                            </label>
                        </div>
                      </div>
                      <input
                        id="lname"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the last name"
                        value={last_name}
                        onChange={(e) => setLast_name(e.target.value)}
                        maxLength={250}
                        ref={lastname}
                        onKeyDown={(e) => handleKeyDown(e, password, lastname)}
                      />
                      {/* {error && !last_name && <div className="text-danger">Last Name should not be blank</div>} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !user_password ? 'text-danger' : ''}`}>
                            Password<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="upass"
                        class="exp-input-field form-control"
                        type="text"
                        placeholder=""
                        required title="Please enter the password"
                        value={user_password}
                        onChange={(e) => setUser_password(e.target.value)}
                        maxLength={50}
                        ref={password}
                        onKeyDown={(e) => handleKeyDown(e, Status, password)}
                      />
                      {/* {error && !last_name && <div className="text-danger">Password should not be blank</div>} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !user_status ? 'text-danger' : ''}`}>
                            Status<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <div title="Select the Status">
                      <Select
                        id="status"
                        value={selectedStatus}
                        onChange={handleChangeStatus}
                        options={filteredOptionStatus}
                        className="exp-input-field"
                        placeholder=""
                        maxLength={50}
                        ref={Status}
                        onKeyDown={(e) => handleKeyDown(e, loginlogout, Status)}
                      />
                      {/* {error && !user_status && <div className="text-danger">Status should not be blank</div>} */}
                    </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <label for="loginout" class="exp-form-labels">Log In/Out</label>
                      <div title="Select the Log In/Out">
                      <Select
                        id="loginout"
                        value={selectedLog}
                        onChange={handleChangeLog}
                        options={filteredOptionLog}
                        className="exp-input-field"
                        placeholder=""
                        maxLength={3}
                        ref={loginlogout}
                        onKeyDown={(e) => handleKeyDown(e, usertype, loginlogout)}
                      />
                    </div>
                    </div>
                  </div>
                  {mode !== 'update' && (
                  <div className="col-md-3 form-group  mb-2 ">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !user_status ? 'text-danger' : ''}`}>
                            Role ID<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <div title="Select the Role ID ">
                      <Select
                        id="usertype"
                        value={selectedRole}
                        onChange={handleChangeRole}
                        options={filteredOptionRole}
                        className="exp-input-field"
                        placeholder=""
                        maxLength={50}
                        ref={usertype}
                        onKeyDown={(e) => handleKeyDown(e, email, usertype)}
                      />
                      {/* {error && !user_status && <div className="text-danger">User Type should not be blank</div>} */}
                    </div>
                    </div>
                  </div>
                  )}
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !email_id ? 'text-danger' : ''}`}>
                            Email<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="uemail"
                        class="exp-input-field form-control"
                        type="email"
                        placeholder=""
                        required title="Please enter the email ID"
                        value={email_id}
                        onChange={(e) => setEmail_id(e.target.value)}
                        maxLength={150}
                        ref={email}
                        onKeyDown={(e) => handleKeyDown(e, Dob, email)}
                      />
                      {/* {error && !validateEmail(email_id) && <div className="text-danger">Please Enter Valid Email Id</div>} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group  mb-2">
                    <div class="exp-form-floating">
                      <div class="d-flex justify-content-start">
                        <div>
                          <label for="state" class="exp-form-labels" className={`${error && !dob ? 'text-danger' : ''}`}>
                            DOB<span className="text-danger">*</span>
                          </label>
                        </div>
                      </div>
                      <input
                        id="udob"
                        class="exp-input-field form-control"
                        type="date"
                        placeholder=""
                        required title="Please enter the DOB"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        ref={Dob}
                        onKeyDown={(e) => handleKeyDown(e, Gender, Dob)}
                      />
                      {/* {error && !user_status && <div className="text-danger">DOB should not be blank</div>} */}
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2 ">
                    <div class="exp-form-floating">
                      <label for="gender" class="exp-form-labels">
                        Gender
                      </label>
                      <div title="Select the Gender">
                      <Select
                        id="gender"
                        value={selectedGender}
                        onChange={handleChangeGender}
                        options={filteredOptionGender}
                        className="exp-input-field"
                        placeholder=""
                        maxLength={50}
                        ref={Gender}
                        onKeyDown={(e) => handleKeyDown(e, ImagE, Gender)}
                      />
                    </div>
                    </div>
                  </div>
                  <div className="col-md-3 form-group mb-2 ">
                    <div class="exp-form-floating">
                      <label for="locno" class="exp-form-labels">Image</label>
                      <input type="file"
                        class="exp-input-field form-control"
                        accept="image/*"
                        onChange={handleFileSelect}
                        ref={ImagE}
                        // onKeyDown={(e) => handleKeyDown(e, ImagE)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const fileInput = ImagE.current;
                            if (fileInput && fileInput.files.length > 0) {
                              if (mode === "update") {
                                handleUpdate();
                              } else {
                                handleInsert();
                              }
                            } else {
                              fileInput.click();
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  {selectedImage && (
                    <div className="col-md-3 form-group mb-2">
                      <div class="exp-form-floating">
                        <img
                          src={selectedImage}
                          alt="Selected Preview"
                          className="avatar rounded sm mt-4"
                          style={{ height: '200px', width: '200px' }}
                        /></div></div>
                  )}
                  {/* <div className="col-md-3 form-group  mb-2">
                    {mode === "create" ? (
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="state" class="exp-form-labels">
                              Created By
                            </label>
                          </div>
                        </div>
                        <input
                          id="emailid"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required
                          title="Please enter the email ID"
                          value={created_by}
                        />
                      </div>
                    ) : (
                      <div class="exp-form-floating">
                        <div class="d-flex justify-content-start">
                          <div>
                            <label for="state" class="exp-form-labels">
                              Modified By
                            </label>
                          </div>
                        </div>
                        <input
                          id="emailid"
                          class="exp-input-field form-control"
                          type="text"
                          placeholder=""
                          required
                          title="Please enter the email ID"
                          value={modified_by}
                        />
                      </div>
                    )}
                  </div> */}
                  <div class="col-md-3 form-group ">
                    {mode === "create" ? (
                      <button onClick={handleInsert} className="mt-4" title="Save">
                        <i class="fa-solid fa-floppy-disk"></i>
                      </button>
                    ) : (
                      <button onClick={handleUpdate} className="mt-4" title="Update">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserInput;
