import React, { useState } from "react";
import SettingItem from "./SettingItem";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select'
import './settings.css'
import CP from './settings_color_picker1'
import CP2 from './settings_color_picker2'
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
 const [showDigestSettings, setShowDigestSettings] = useState(false);
  return (
    <div
      className="container-fluid bg-none text-white Topnav-screen"
      style={{ minHeight: "100vh" }}
    >
      <div className="shadow-lg bg-white rounded-3 p-2 mb-3">
        <div className="d-flex justify-content-between">
          <h1 className="fw-semibold fs-4 text-dark">Settings</h1>
          <addbutton className="text-success">
            <i className="fa-solid fa-floppy-disk fs-5"></i>
          </addbutton>
        </div>
      </div>
      <div className="shadow-lg bg-white rounded-3 p-2 mb-3">
        <ul
          className="mt-3 d-flex justify-content-center col-md-12"
          role="tablist"
        >
          {["general", "crm", "calendar"].map((tabKey, index) => (
            <li
              className="nav-item col-md-4 d-flex justify-content-center"
              key={tabKey}
            >
              <button
                className={`nav-link col-md-11 text-dark rounded-2 p-2 ${
                  activeTab === tabKey ? "active" : ""
                }`}
                onClick={() => setActiveTab(tabKey)}
                type="button"
                role="tab"
              >
                {tabKey === "general" && "General Settings"}
                {tabKey === "crm" && "CRM Settings"}
                {tabKey === "calendar" && "Calendar Settings"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "general" && (
          <div className="row p-2">
            <div className="col-md-12 mb-3 card">
              <h5 className=" col-md-2 fw-bold fs-5 text-dark d-flex justify-content-start rounded-3  p-2">
                Language
              </h5>
              <div className="card-body">
                <span className="text-dark d-flex justify-content-start ">
                  Set default language for system users
                </span>
              </div>
              <Select
                className="mt-2 col-md-3 ms-3"
                placeholder="Select Language"
              />
            </div>

            <div className="col-md-12 mb-3 card ">
              <h5 className="col-md-2 fw-bold fs-5 text-dark d-flex justify-content-start rounded-3  p-2">
                Users
              </h5>
              <div className="card-body ">
                <div className="row">
                  <div className="col-md-5 col-12">
                    <span className="text-dark d-flex justify-content-start">
                      Invite New Users
                    </span>
                    <input type="email" className="form-control col-md-2 " />
                    <button className="col-md-3 d-flex justify-content-start mt-3">
                      Invite
                    </button>
                  </div>
                  <div
                    className="col-md-1 d-none d-md-block" // hidden on small screens, visible on md+
                    style={{
                      borderLeft: "2px solid #ccc",
                      height: "130px",
                      margin: "0 auto",
                    }}
                  ></div>
                  <div className="col-md-6 col-12">
                    <div className="mb-4">
                      <span className="text-dark d-flex justify-content-start">
                        <i class="bi bi-people-fill me-2"></i> Active User ~ 12
                        <span className="text-dark d-flex justify-content-center ms-4">
                          <i class="bi bi-patch-question-fill"></i>
                        </span>
                      </span>
                   
                    <span className="d-flex justify-content-start">
                      <a href="#" class="link-primary">
                        {" "}
                        <i class="bi bi-arrow-right"></i> Manage Users{" "}
                      </a>
                    </span>
                    </div>
                        <div>
                         <span className="text-dark d-flex justify-content-start">
                        <i class="bi bi-lock-fill me-2"></i> Password Reset
                        <span className="text-dark d-flex justify-content-center ms-4">
                          <i class="bi bi-patch-question-fill"></i>
                        </span>
                      </span>
                    </div>
                    <span className="d-flex justify-content-start">
                      <a href="#" class="link-primary">
                        {" "}
                        <i class="bi bi-arrow-right"></i> Manage Users{" "}
                      </a>
                    </span>


                    
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 mb-3 card ">
              <h5 className=" col-md-2 fw-bold fs-5 text-dark d-flex justify-content-start rounded-3  p-2">
                Companies:
              </h5>
              <div className="card-body ">
                <div className="row">
                  <div className="col-md-5 col-12">
                    <span className="fw-bold text-dark d-flex justify-content-start">
                      Company Name
                    </span>
                    <span className="text-dark d-flex justify-content-start">
                      Company Location
                    </span>
                    <span className="d-flex justify-content-start">
                      <a href="#" class="link-primary">
                        {" "}
                        <i class="bi bi-arrow-right "></i> Update Info{" "}
                      </a>
                    </span>

                    <div className="mt-4">
                    <span className="mt-4 fw-bold text-dark d-flex justify-content-start ">
                      Document Layout
                    </span>
                    <span className="text-muted d-flex justify-content-start">
                      Choose the layout of your documents
                    </span>
                    <span className="d-flex justify-content-start">
                      <a href="#" class="link-primary">
                        {" "}
                        <i class="bi bi-arrow-right"></i> Configure Document
                        Layout{" "}
                      </a>
                    </span>
                    </div>
                  </div>

                  <div
                    className="col-md-1 d-none d-md-block" // hidden on small screens, visible on md+
                    style={{
                      borderLeft: "2px solid #ccc",
                      height: "200px",
                      margin: "0 auto",
                    }}
                  ></div>

                  <div className="col-md-6 col-12">
                    <div className=" mb-5">
                      <span className="text-dark d-flex justify-content-start">
                        <i class="bi bi-people-fill me-2"></i> Company ~ 1
                        <span className="text-dark d-flex justify-content-center ms-4">
                          <i class="bi bi-patch-question-fill"></i>
                        </span>
                      </span>

                      <span className="d-flex justify-content-start">
                        <a href="#" class="link-primary">
                          {" "}
                          <i class="bi bi-arrow-right"></i> Manage Companies
                        </a>
                      </span>
                    </div>

                    <div className="">
                      <span className="text-dark d-flex justify-content-start">
                        <i class="bi bi-people-fill me-2"></i> Email Templates
                      </span>
                      <span className="text-muted d-flex justify-content-start ms-4 ">
                        Customize the look and feel of automated emails
                      </span>
                      <CP />
                      <CP2 />
                      <span className="d-flex justify-content-start">
                        <a href="#" class="link-primary">
                          {" "}
                          <i class="bi bi-arrow-right"></i> Review All Templates
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mb-3 card ">
              <h5 className=" col-md-2 fw-bold fs-5 text-dark d-flex justify-content-start rounded-3  p-2">
                Emails:
              </h5>
              <div className="card-body ">
                <div className="row">
                  <div className="col-md-5 col-12">
                    <div className="d-flex align-items-center mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id="customEmailServer"
                        // checked / onChange can be handled here
                      />
                      <span className="fw-bold text-dark mb-0">
                        Use Custom Email Servers
                      </span>
                      <span className="text-dark d-flex justify-content-end ms-4 ">
                        <i class="bi bi-patch-question-fill"></i>
                      </span>
                    </div>
                    

                    <span className="text-muted d-flex justify-content-start">
                      Configure your email servers to send and receive emails
                    </span>

                   
                   


                 <div className="d-flex align-items-center mb-2">
        <input
          type="checkbox"
          className="form-check-input me-2 mt-4"
          id="customEmailServer"
          checked={showDigestSettings}
          onChange={(e) => setShowDigestSettings(e.target.checked)}
        />

        <span className="mt-4 fw-bold text-dark d-flex justify-content-start">
          Digest Email
        </span>
      </div>

      <span className="text-muted d-flex justify-content-start">
        Add new users as recipient of a periodic email with key metrics
      </span>

      {showDigestSettings && (
        <>
          <span className="d-flex justify-content-start fw-bold mt-3 ms-4">
            Digest Email <input type="text" className="ms-2" />
            <i className="bi bi-arrow-right ms-3 mt-1 fw-bold"></i>
          </span>

          <span className="d-flex justify-content-start">
            <a href="#" className="link-primary mt-2">
              <i className="bi bi-arrow-right"></i> Configure Digest Emails
            </a>
          </span>
        </>
      )}
                  </div>

                  <div
                    className="col-md-1 d-none d-md-block" // hidden on small screens, visible on md+
                    style={{
                      borderLeft: "2px solid #ccc",
                      height: "200px",
                      margin: "0 auto",
                    }}
                  ></div>

                  <div className="col-md-6 col-12">
                    <div className=" mb-5">
                      <span className="text-dark d-flex justify-content-start">
                        <i class="bi bi-people-fill me-2"></i> Alias Domain
                        <span className="text-dark d-flex justify-content-center ms-4">
                          <i class="bi bi-patch-question-fill"></i>
                        </span>
                        </span>
                        <span className="text-muted d-flex justify-content-start">
                            Use different domains for your mail aliases
                        </span>

                        <span className="d-flex justify-content-start">
                          @ <input type="text" className="ms-1" placeholder="YJK@example.com"/>
                        </span>
                     <div className="d-flex align-items-center mb-2">
                        <input
                        type="checkbox"
                        className="form-check-input me-2 mt-4"
                        
                
                        />
                        <span className=" d-flex justify-content-start mt-3">
                        <i class="bi bi-people-fill me-2"></i> Restrict Template Rendering
                        </span> 
                        </div>
                         <span className="text-muted d-flex justify-content-start ms-4">
                            Restrict mail templates edition and QWEB placeholders usage.
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
{activeTab === "crm" && (
  <div className="row p-3">
    {[
      {
        title: "Recurring Revenues",
        description: "Define recurring plans and revenues on Opportunities"
      },
      {
        title: "Leads",
        description: "Add a qualification step before the creation of an opportunity"
      },
      {
        title: "Multi Teams",
        description: "Assign salespersons into multiple Sales Teams"
      },
      {
        title: "Membership / Partnership",
        description:
          "Manage members or partners. Members get grades and pricelists, partners allow lead assignment and commission plans."
      },
      {
        title: "Rule-Based Assignment",
        description: "Periodically assign leads based on priorities and filters.",
        
      },
      {
        title: "Predictive Lead Scoring",
        description: (
          <>
            The success rate is computed based on <strong>
              Stage, State, Country, Phone Quality, Email Quality, Source, Language and Tags
            </strong> for the leads created as of the <strong>22/05/2025</strong>.
          </>
        ),
        buttonText: "Update Probabilities"
      }
    ].map((item, index) => (
      <div key={index} className="col-md-6 mb-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title text-dark mb-2">
                  {item.title}
                  {item.infoIcon && (
                    <i className="bi bi-info-circle-fill text-primary ms-2" title="More Info"></i>
                  )}
                </h5>
              </div>
              <div>
                <input
                  type="checkbox"
                  className="form-check-input mt-1"
                  id={`checkbox-${index}`}
                />
              </div>
            </div>
            <span className="card-text text-dark d-block text-start">
              {item.description}
            </span>
            {item.buttonText && (
              <button className="  col-md-4 mt-3">
                {item.buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}


       {activeTab === "calendar" && (
  <div className="row p-3">
    {[
      {
        title: "Working Hours",
        description: "Set company-wide working hours"
      },
      {
        title: "Default Calendar View",
        description: "Choose between month, week, or day view as default"
      }
    ].map((item, index) => (
      <div key={index} className="col-md-6 mb-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title text-dark mb-2">{item.title}</h5>
              </div>
              <div>
                <input
                  type="checkbox"
                  className="form-check-input mt-1"
                  id={`calendar-checkbox-${index}`}
                />
              </div>
            </div>
            <span className="card-text text-dark d-block text-start">
              {item.description}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
};

export default SettingsPage;
