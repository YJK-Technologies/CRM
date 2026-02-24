import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedin, faGoogle } from '@fortawesome/free-brands-svg-icons';
import './signup.css';

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const config = require('./Apiconfig');

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form from submitting and reloading the page

    try {
      // Check if the OTP is valid before adding the user to the database
      const otpResponse = await fetch(`${config.apiBaseUrl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (otpResponse.status === 200) {
        // OTP verification successful, add user to the database
        const response = await fetch(`${config.apiBaseUrl}/add-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        if (response.status === 200) {
          alert("User added successfully!");
          navigate("/mainpage");
        } else {
          console.error("Failed to add user to the database");
          alert("Failed to add user to the database");
        }
      } else {
        console.error("OTP verification failed");
        alert("OTP verification failed");
      }
    } catch (error) {
      console.error("Error during user registration:", error);
    }
  };

  return (
    <div className="container2">
      <div className="form-container">
        <div className="signin-signup">
          <form className="sign-up-form" onSubmit={handleSignup}>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
              <FontAwesomeIcon style={{marginLeft:"14px",marginTop:"13px",marginRight:"14px"}}icon={faUser} />
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon style={{marginLeft:"14px",marginTop:"13px",marginRight:"14px"}} icon={faEnvelope} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon style={{marginLeft:"14px",marginTop:"13px",marginRight:"14px"}}icon={faLock} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon style={{marginLeft:"14px",marginTop:"13px",marginRight:"14px"}}icon={faLock} />
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
