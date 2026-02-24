// Sidebar.js
import React, { useState } from 'react';
import './Sidebar2.css'; // Assume CSS remains the same
import profileImage from './user.jpg'; // Ensure profile.jpg is in the same folder or adjust path

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleSubMenu = (menu) => {
    setShowSubMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? '' : 'close'}`}>
      <div className="logo">
        <i className="fab fa-trade-federation"></i>
        <span className="logo-name">Tivotal</span>
      </div>

      <ul className="nav-list">
        {/* Dashboard */}
        <li>
          <a href="#">
            <i className="fab fa-microsoft"></i>
            <span className="link-name">Dashboard</span>
          </a>
          <ul className="sub-menu blank">
            <li><a href="#" className="link-name">Dashboard</a></li>
          </ul>
        </li>

        {/* Courses */}
        <li>
          <div className="icon-link" onClick={() => toggleSubMenu('courses')}>
            <a href="#">
              <i className="fab fa-codepen"></i>
              <span className="link-name">Courses</span>
            </a>
            <i className="fas fa-caret-down arrow"></i>
          </div>
          <ul className={`sub-menu ${showSubMenu.courses ? 'show' : ''}`}>
            <li><a href="#" className="link-name">Courses</a></li>
            <li><a href="#">Block Chain</a></li>
            <li><a href="#">Cryptography</a></li>
            <li><a href="#">Animation</a></li>
          </ul>
        </li>

        {/* Blog */}
        <li>
          <div className="icon-link" onClick={() => toggleSubMenu('blog')}>
            <a href="#">
              <i className="fab fa-blogger"></i>
              <span className="link-name">Blog</span>
            </a>
            <i className="fas fa-caret-down arrow"></i>
          </div>
          <ul className={`sub-menu ${showSubMenu.blog ? 'show' : ''}`}>
            <li><a href="#" className="link-name">Blog</a></li>
            <li><a href="#">Web Design</a></li>
            <li><a href="#">Card Design</a></li>
            <li><a href="#">Form Design</a></li>
          </ul>
        </li>

        {/* Other static links */}
        {/* Repeat similar structure for Activity, Favourite, Compiler, etc. */}

        <li>
          <div className="profile-details">
            <div className="profile-content">
              <img src={profileImage} alt="Profile" />
            </div>
            <div className="name-job">
              <div className="name">Mary Karen</div>
              <div className="job">Web Developer</div>
            </div>
            <i className="fas fa-right-to-bracket"></i>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
