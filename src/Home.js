import React from 'react'
import './Home.css'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import main from './main.png';

const Home = () => {

  const navigate = useNavigate();

  const handleNavigateToForm = () => {
    navigate("/Login"); 
  };
  return (
    <div>
         <div class="container1">
      <div class="navbar1">
        <div class="menu">
          <img src={main} alt="Logo Image" class="logo"></img> 
          <div class="hamburger_menu">
          {/* <FontAwesomeIcon icon={faBars} /> */}
          </div>
        </div>
      </div>

      <div class="main-container">
        <div class="main">
          <header id="header">
            <div class="overlay">
              <div class="inner">
                <h2 class="title1">Future is here</h2>
                <a><button class="button" onClick={handleNavigateToForm} >Login </button></a>
              </div>
            </div>
          </header>
        </div>
      </div>
      {/* <div class="links">
        <ul>
          <li>
            <a href="#" style={{'--i':'0.05s'}}>Home</a>
          </li>
          <li>
            <a href="#" style={{'--i': '0.2s;'}}>Admin Login</a>
          </li>
          <li>
            <a href="#" style={{'--i': '0.1s;'}}>Services</a>
          </li>
          <li>
            <a href="#" style={{'--i': '0.25s;'}}>About</a>
          </li>
          <li>
            <a href="#" style={{'--i': '0.3s;'}}>Contact</a>
          </li>
        </ul>
      </div> */}
    </div>
    </div>
  )
}

export default Home