import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';

const ForgotPopup = ({ open, handleClose }) => {
  const [email_id, setemail_id] = useState('');
  const [user_code, setuser_code] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [new_password, setNew_Password] = useState('');
  const [loginError, setLoginError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5500/forgetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id,user_code }),
      });

      if (response.ok) {
        setOtpSent(true);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        setLoginError("User doesn't exist. Register as a new user");
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError("Internal server error occurred!");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5500/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id, enteredOtp }),
      });

      if (response.ok) {
        console.log('OTP verified successfully');
        setPassword(true);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        setOtpError("Invalid OTP");
      }
    } catch (error) {
      console.error('Error:', error.message);
      setOtpError("Internal server error occurred!");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword === new_password) {
      try {
        const response = await fetch('http://localhost:5500/passwords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email_id, user_password:new_password, user_code }),
        });
        const data = await response.json();
        if (response.ok) {
          handleClose();
        
          toast.success("Password updated successfully")
          console.log('Password updated successfully');
        } else {
          
          toast.error("Error updating password")
          console.log('Error updating password');
        }
      } catch (error) {
       
        toast.error("Error updating password")
        console.log('Error updating password');
      }
    } else {
      setOtpError('Wrong Otp');
      toast.error("Wrong Otp")
    }
  };

  return (
    <div className={`Topnav-screen modal ${open ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <ToastContainer position="top-right" className="toast-design" theme="colored"/>
    <div className="modal-dialog modal-sm" role="document">
      <div className="modal-content">
        <div className="d-flex justify-content-between">
          
          <div class="mobileview">
            <h5 className="modal-title" id="alert-dialog-title">Verification</h5>
            </div>
         
            <div class="me-3">
              <button className="btn btn-danger mt-1" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              </div>
          
        </div>
        <hr />
        <div className="modal-body">
          <div className="d-flex flex-column align-items-center">
            {password ? (
              <>
                <div className="form-group w-100 mb-3">
                  <label htmlFor="newPassword">Enter New Password</label>
                  <input
                    id="newPassword"
                    className="form-control "
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    
                  />
                </div>
                <div className="form-group w-100 mb-3">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    className="form-control"
                    type="password"
                    value={new_password}
                    onChange={(e) => setNew_Password(e.target.value)}
                    
                  />
                </div>
                <div class="d-flex justify-content-center"><button class="btn btn-success mx-5 px-5" onClick={handlePasswordSubmit}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                  </svg></button></div>
              </>
            ) : otpSent ? (
              <>
                <div className="form-group w-100 mb-3">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    id="otp"
                    className="form-control"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                  
                  />
                </div>
                <div class="me-3"><button className="btn btn-success mt-3" onClick={handleOtpSubmit}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                </svg></button></div>              </>
            ) : (
              <>
                <div className="form-group w-100 mb-3">
                  <label htmlFor="email"> User Code</label>
                  <input
                    id="email"
                    className="form-control mt-3"
                    type="email"
                    value={user_code}
                    onChange={(e) => setuser_code(e.target.value)}
                    
                  />
                </div>
                <div className="form-group w-100 mb-3">
                  <label htmlFor="email"> Email ID</label>
                  <input
                    id="email"
                    className="form-control mt-3"
                    type="email"
                    value={email_id}
                    onChange={(e) => setemail_id(e.target.value)}
                    
                  />
                </div>
                
                <div class="me-3"><button className="btn btn-success mt-3" onClick={handleEmailSubmit}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg> Verify</button></div>
              </>
            )}
          </div>
          {otpError && <div className="text-danger mt-2">{otpError}</div>}
          {loginError && <div className="text-danger mt-2">{loginError}</div>}
        </div>
      
      </div>
    </div>
  </div>
  );
};

export default ForgotPopup;
