/*import React from 'react';
import "./App.css";
function Topbar() {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            
            <a className="navbar-brand ps-3" href="index.html">Start Bootstrap</a>
           
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
          
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
                </div>
            </form>
           
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="#!">Settings</a></li>
                        <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#!">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}

export default Topbar;

import React, { useState } from 'react';
import "./App.css";

function Topbar() {
   
    return (
        <div className="sb-nav-fixed">
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <a className="navbar-brand ps-3" href="index.html">Start Bootstrap</a>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!" >
                <i className="fas fa-bars"></i>
            </button>
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
                </div>
            </form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="#!">Settings</a></li>
                        <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#!">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
        </div>
    );
}

export default Topbar;

import React from 'react';
import Backbutton from './Backbutton';


function Topbar({ isSidebarOpen, toggleSidebar }) {
    return (
        <div className="sb-nav-fixed.sb-sidenav-toggled">
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                <a className="navbar-brand ps-3" href="index.html">Start Bootstrap</a>
                <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
          <Backbutton />
                <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                        <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
                    </div>
                </form>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><a className="dropdown-item" href="#!">Settings</a></li>
                            <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#!">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Topbar;
*/






import './App.css';
import Backbutton from './Backbutton';
import { useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import AppContent from './App_content';
import { useNavigate } from 'react-router-dom';
import MainPage from './logout';
import user from './user.jpg';
import { useState } from 'react';
import Setting from './Settings'
import Swal from 'sweetalert2';
import main from './main.png'
const config = require('./Apiconfig');


function Topbar({ isSidebarOpen, toggleSidebar }) {

    const user_code = sessionStorage.getItem('selectedUserCode');
    const [selectedImage, setSelectedImage] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const userImageBase64 = sessionStorage.getItem('user_image');
    const userImageSrc = userImageBase64 ? `data:image/png;base64,${userImageBase64}` : null;

    const navigate = useNavigate(); 
    
    
    // const navigate = useNavigate();
    // const handleLogout = () => {
    //     localStorage.clear();
    //     navigate('/', { replace: true }); 
    //     disableBackButton();
    //     window.history.replaceState(null, null, '/');
    //   };

    //   const disableBackButton = () => {
    //     window.history.pushState(null, null, window.location.href);
    //     window.onpopstate = function () {
    //       window.history.pushState(null, null, window.location.href);
    //     };
    //   };

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            // If not logged in, navigate to login page
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.removeItem('isLoggedIn'); // Remove session flag
        navigate('/login'); // Redirect to login page
    };


    const handlesetting = () => {
        navigate("/Settings")
    }

    const handleAccount = () => {
        navigate("/AccountInformation")
    }


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 1 * 1024 * 1024; 
        
            if (file.size > maxSize) {
              Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: 'File size exceeds 1MB. Please upload a smaller file.',
                confirmButtonText: 'OK'
              });
              return;
            }

        if (file) {
            Swal.fire({
                title: 'Do you want to change your profile picture?',
                text: "You selected a new image. Do you want to save it?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, change it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    setSelectedImage(file); 
                    handleSaveImage(file);
                    handleInsert(file);
                } else {
                    e.target.value = null;
                }
            });
        }
    }
    };
    

    const handleSaveImage = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                sessionStorage.setItem('user_image', reader.result.split(',')[1]);
                setSelectedImage(null); 
    
                Swal.fire(
                    'Changed!',
                    'Your profile picture has been updated.',
                    'success'
                );
            };
            reader.readAsDataURL(file);
        }
    };

    
    const handleInsert = async (file) => {

        try {
          const formData = new FormData();
          formData.append("user_code", user_code);
          if (file) {
            formData.append("user_img", file); 
          }
      
          const response = await fetch(`${config.apiBaseUrl}/UpdateUserImage`, {
            method: "POST",
            body: formData, 
          });
      
          if (response.status === 200) {
            console.log("Data inserted successfully");
            setTimeout(() => {
              Swal.fire({
                title: "Success",
                text: "Data inserted successfully!",
                icon: "success",
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
              })
            }, 1000);
          } else if (response.status === 400) {
            const errorResponse = await response.json();
            console.error(errorResponse.message);
            Swal.fire({
              title: 'Error!',
              text: errorResponse.message,
              icon: 'error',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            });
          } else {
            console.error("Failed to insert data");
            Swal.fire({
              title: 'Error!',
              text: 'Failed to insert data',
              icon: 'error',
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false
            });
          }
        } catch (error) {
          console.error("Error inserting data:", error);
          Swal.fire({
            title: 'Error!',
            text: 'Error inserting data: ' + error.message,
            icon: 'error',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      };
    
    const getInitials = (user_code) => {
        if (!user_code) return '';
        const nameParts = user_code.split(' ');
        return nameParts.map(part => part[0]).join('').toUpperCase().substring(0, 2); // Extract first two letters
    };


    return (
        <div className="">
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                <div className="container-fluid">

                    <div class="tMob">
                        <div class=" d-flex justify-content-start mt-1">
                            <div className="col-1 col-md-2">
                                <p className='navbar-brand '>
                                    <img src={main} width="50" height="50" alt="logo" />
                                    <b><sub><sub><i><font size="3" color="#D9B466">erp</font></i></sub></sub></b>
                                </p></div>


                                <ul className="col-1 col-md-2 ms-3  me-3 mt-2">
                                    <li className="nav-item dropdown ms-5 ">
                                        <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                             {userImageSrc ? (
                                            <img src={userImageSrc} alt="User Avatar" className="avatar" title={user_code}/>
                                        ) : (
                                            <div className="avatar-initials">
                                                {getInitials(user_code)}
                                            </div>
                                        )}
                                        </a>
                                        <ul className="dropdown-menu " aria-labelledby="navbarDropdown" style={{ cursor: "pointer" }}>
                                            <li > <a className="dropdown-item" onClick={handleAccount}>List of Companies</a></li>
                                            <li><a className="dropdown-item" onClick={handlesetting}>Settings</a></li>
                                            <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                                        </ul>
                                    </li>
                                </ul>
                                    <div className='col-1 col-md-2 mt-2'>
                                <div class="togglebtn  ms-5  ps-4">
                        <button className="btn-primary-link ms-5" id="sidebarToggle" required title="Toggle Sidebar" onClick={toggleSidebar}>
                            <i className="fas fa-bars"></i>
                        </button></div></div>
                              
                        

                        </div>
                    </div>

                    


                    <div class="tDesk">
                        <p className="navbar-brand">
                            <img src={main} width="50" height="50" alt="logo" />
                            <b><sub><sub><i><font size="3" style={{color:"#D9B466"}} >erp</font></i></sub></sub></b>
                        </p></div>

                    <div class="togglebtn">
                        <button className="btn-primary-link " id="sidebarToggle" required title="Toggle Sidebar" onClick={toggleSidebar}>
                            <i className="fas fa-bars"></i>
                        </button></div>



                    <Backbutton required title="Toggle Sidebar" />
                    <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                        <div className="input-group">
                            <p  style={{color:"#D9B466", fontSize:"13px"}}>{ sessionStorage.getItem('selectedCompanyName')},{ sessionStorage.getItem('selectedLocationName')}</p>
                            {/* <p className="form-control">Location Name:</p> */}
                        </div>
                    </form>




                </div>

                

                <ul className="navbar-nav ms-auto ms-md-0">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {/* <img src={user} alt="JK" className="avatar" required title={user_code} /> */}
                            {userImageSrc ? (
                             <img src={userImageSrc} alt="User Avatar" className="avatar" />
                            ) : (
                               <div className="avatar-initials">
                                    {getInitials(user_code)}
                                </div>
                            )}
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown" style={{ cursor: "pointer" }}>
                            <li > <a className="dropdown-item" onClick={handleAccount}>List of Companies</a></li>
                            <li><a className="dropdown-item" onClick={handlesetting}>Settings</a></li>
                            <li>
                            <label className="dropdown-item">
                                     Change Profile Picture
                             <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                 </label>
                                    </li>
                                 {selectedImage && (
                                     <li>
                             <button className="dropdown-item" onClick={handleSaveImage}>
                                    Save Image
                              </button>
                                            </li>
                                        )}
                                            






                        </ul>
                    </li>
                </ul>
                <div className="purbut">
            <div className="d-flex justify-content-end">
               
                <button  class="btn btn-info text-white" style={{cursor:"pointer"}}>
                <i class="fas fa-question-circle" title='help'></i>
                </button>
                <MainPage />
                </div>
                </div>

            </nav>
        </div>
    );
}

export default Topbar;