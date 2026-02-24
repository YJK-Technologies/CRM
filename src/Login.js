

import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; 
import login from './login.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import logo from './main.png'
import vec from './vector3.png'
import './loginsass.scss'
import ForgotPopup from "./Forgotpopup";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const config = require('./Apiconfig');


const Login = () => {
  const navigate = useNavigate();
  const [user_email, setuser_email] = useState('');
  const [user_code, setuser_code] = useState('');
  const [user_password, setuser_password] = useState('');
  const [user_code_signup, setuser_code_signup] = useState('');
  const [user_password_signup, setuser_password_signup] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showCapsLockWarning, setShowCapsLockWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [screenType,setScreenType] = useState(null)


  const secretKey = 'yjk26012024';

  useEffect(() => {
    const handleCapsLock = (e) => {
      if (e instanceof KeyboardEvent && e.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
        setShowCapsLockWarning(true);
        setTimeout(() => setShowCapsLockWarning(false), 2000); 
      } else {
        setIsCapsLockOn(false);
        setShowCapsLockWarning(false);
      }
    };

    window.addEventListener('keydown', handleCapsLock);
    window.addEventListener('keyup', handleCapsLock);

    return () => {
      window.removeEventListener('keydown', handleCapsLock);
      window.removeEventListener('keyup', handleCapsLock);
    };
  }, []);


  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true); // Start loading

    // Simulate form submission delay (replace this with actual form submission logic)
    setTimeout(() => {
      setLoading(false); // End loading after 3 seconds
    }, 3000);

    try {
      // Encrypt user_code and user_password
      const encryptedUserCode = CryptoJS.AES.encrypt(user_code, secretKey).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(user_password, secretKey).toString();

      console.log("encryptedUserCode",encryptedUserCode)
      console.log("encryptedPassword",encryptedPassword)

      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_code: encryptedUserCode, 
          user_password: encryptedPassword 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const [{ user_code, role_id, user_images, email_id }] = data;

        if (user_images && user_images.data) {
          const userImageBase64 = arrayBufferToBase64(user_images.data);
          sessionStorage.setItem('user_image', userImageBase64);
          console.log("Stored Image in sessionStorage:", sessionStorage.getItem('user_image'));
        }

        console.log('Login successful');
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('user_code', user_code);
        sessionStorage.setItem('role_id', role_id);
        sessionStorage.setItem('userEmailId', email_id )

        await UserPermission(role_id);
        await fetchUserData(user_code);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError('Internal server error occurred!');
    } finally {
      setIsPageLoading(false);
    }
  };



  const UserPermission = async (role_id) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getUserPermission`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role_id }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        
        // Store the permissions array in sessionStorage
        sessionStorage.setItem('permissions', JSON.stringify(data));
        const storedPermissions = JSON.parse(sessionStorage.getItem('permissions'));
        console.log('Stored permissions:', storedPermissions);

        window.dispatchEvent(new Event("permissionsUpdated"));
  
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getusercompany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_code })
      });

      if (response.ok) {
        const searchData = await response.json();
        if (searchData.length > 0) {
          const { user_code, user_name ,company_no,company_name,location_name,location_no} = searchData[0];
          handleSave(searchData[0]);

        navigate('/AccountInformation');
        
        // window.location.reload();

        } else {
          console.log("Data not found");
        }
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };
  

  const handleSave = (data) => {
    if (data) {
        sessionStorage.setItem('selectedCompanyCode', data.company_no);
        sessionStorage.setItem('selectedCompanyName', data.company_name);
        sessionStorage.setItem('selectedLocationCode', data.location_no);
        sessionStorage.setItem('selectedLocationName', data.location_name);
        sessionStorage.setItem('selectedShortName', data.short_name);
        sessionStorage.setItem('selectedUserName', data.user_name);
        sessionStorage.setItem('selectedUserCode', data.user_code);
    }
    console.log(data);
};
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSignUp(false); // Switch back to sign-in form
    setuser_email('');
    setuser_code_signup('');
    setuser_password_signup('');
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };




  const [loading, setLoading] = useState(false);

  // Function to simulate form submission
 
  return (
    <>
    {isPageLoading}
    <div className="container2">
    <div className="panels-container">
    <div className="panel left-panel">
      {/* Load the new image */}
      <img src={vec} className="vector" alt="Login Graphic" />
    </div>
  </div>
  <div className="forms-container">
    <div className="signin-signup">
      {isSignUp ? (
        <form className="sign-up-form" onSubmit={handleSignUp}>
          <h2 className="title">Sign up</h2>
          <div className="input-field">
            <i><FontAwesomeIcon icon={faUser} /></i>
            <input
              type="text"
              placeholder="Email"
              id="sign-up-email"
              autoComplete='off'
              value={user_email}
              onChange={(e) => setuser_email(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i><FontAwesomeIcon icon={faUser} /></i>
            <input
              type="text"
              placeholder="User Code"
              id="sign-up-usercode"
              autoComplete='off'
              value={user_code_signup}
              onChange={(e) => setuser_code_signup(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i><FontAwesomeIcon icon={faLock} /></i>
            <input
              placeholder="Password"
              id="sign-up-password"
              autoComplete='off'
              type={showPassword ? "text" : "password"}
              value={user_password_signup}
              onChange={(e) => setuser_password_signup(e.target.value)}
            />
            <span className="eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
            </span>
          </div>
          {showCapsLockWarning && isCapsLockOn && (
            <div style={{ color: 'red', padding: '5px' }}>Caps Lock is on </div>
          )}
          <input type="submit" value="Register" className="Submitbtn" />
        </form>
      ) : (
        <form className="sign-in-form" onSubmit={handleLogin}>
  <img src={logo} alt="Logo" className="logo" />
  <h2 className="headr">Sign in</h2>

  {/* Google Login Button */}


  {/* OR Divider */}


  {/* Display Error Message */}
  {loginError && (
    <div style={{ color: 'red', padding: '1px' }}>
      {loginError}
    </div>
  )}

  {/* User Code (Email Address) Input */}
  <div className="input-field">
    <i><FontAwesomeIcon icon={faUser} /></i>
    <input
      type="text"
      placeholder="Username"
      autoComplete="off"
      value={user_code}
      onChange={(e) => setuser_code(e.target.value)}
    />
  </div>

  {/* Password Input */}
  <div className="input-field">
    <i><FontAwesomeIcon icon={faLock} /></i>
    <input
      placeholder="Password"
      autoComplete="off"
      type={showPassword ? "text" : "password"}
      value={user_password}
      onChange={(e) => setuser_password(e.target.value)}
    />
    <span className="eye" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
    </span>
  </div>

  {/* Caps Lock Warning */}
  {showCapsLockWarning && isCapsLockOn && (
    <div style={{ color: 'red', padding: '5px' }}>Caps Lock is on</div>
  )}

  {/* Forgot Password Link */}
  <div className="forgot-password-container">
    <a onClick={handleClick} className="forgot-password">Forgot your password?</a>
  </div>

  {/* Submit Button */}
  {/* <input type="submit" value="Log in" className="Submitbtn" /> */}


  <button
        type="submit"
        className={`Submitbtn ${loading ? 'loading' : ''}`}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <>
            Please Wait
            <span className="spinner"></span>
          </>
        ) : (
          'Submit'
        )}
      </button>




  {/* Signup Link */}
  <div className="signup-container">
    <p>Don’t have an account? <a href="#">Sign up</a></p>
  </div>

  {/* Forgot Password Popup */}
  <ForgotPopup open={open} handleClose={handleClose} />
</form>

      )}
    </div>
  </div>
  
</div>

    </>
  );
};

// const LoadingScreen = () => (
//   <div className="loading-screen">
//     <FontAwesomeIcon icon={faSpinner} spin size="3x" />
//   </div>
// );

export default Login;





