 import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import "./apps.css";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'ag-grid-autocomplete-editor/dist/main.css';
import "./mobile.css";
import { ToastContainer, toast } from 'react-toastify';
import { Dropdown, DropdownButton } from 'react-bootstrap';
const config = require('./Apiconfig');

const AccountInformation = () => {
    const user_code = sessionStorage.getItem('user_code'); 
    const [userName, setUserName] = useState("");
    const [userCode, setUserCode] = useState("");
    const [companyNo, setCompanyNo] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [shortName, setShortName] = useState("");
    const [locationNo, setLocationNo] = useState("");
    const [rowData, setRowData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedRadio, setSelectedRadio] = useState(null); 

    const columnData = [
        {
          checkboxSelection: true,
          headerName: 'S.No',
          field: 'ItemSNO',
          maxWidth: 80,
          sortable: false,
          editable: false
        },
        {
          headerName: 'Company Code',
          field: 'company_no',
          maxWidth: 300,
          minWidth: 300,
          sortable: false,
          editable: false
        },
        {
          headerName: 'Company Name',
          field: 'company_name',
          minWidth: 500,
          sortable: false,
          editable: false
        },
        {
          headerName: 'Location code',
          field: 'location_no',
          minWidth: 450,
          sortable: false,
          editable: false
        },
        {
          headerName: 'Location Name',
          field: 'location_name',
          minWidth: 500,
          sortable: false,
          editable: false
        },
        {
          headerName: 'Short Name',
          field: 'short_name',
          minWidth: 500,
          sortable: false,
          editable: false,
          hide:true
        },
    ];

  const UserPermission = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getUserPermission`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role_id:sessionStorage.getItem('role_id'), company_code:sessionStorage.getItem('selectedCompanyCode'), user_code:sessionStorage.getItem('user_code') } ),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
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

    const handleSave = (data) => {
        if (!data || Object.keys(data).length === 0) {
          toast.warning("Please select a row ");
          return;
        }
    
        sessionStorage.setItem('selectedCompanyCode', data.company_no);
        sessionStorage.setItem('selectedCompanyName', data.company_name);
        sessionStorage.setItem('selectedLocationCode', data.location_no);
        sessionStorage.setItem('selectedLocationName', data.location_name);
        sessionStorage.setItem('selectedShortName', data.short_name);
        sessionStorage.setItem('selectedUserName', data.user_name);
        sessionStorage.setItem('selectedUserCode', data.user_code);
    
        setUserName(data.user_name);
        setUserCode(data.user_code);
        setCompanyNo(data.company_no);
        setCompanyName(data.company_name);
        setLocationName(data.location_name);
        setShortName(data.short_name);
        setLocationNo(data.location_no);

        // Dispatch a custom event
        const event = new CustomEvent('storageUpdate');
        window.dispatchEvent(event);
    
        // UserPermission();

        toast.success("Data Saved Successfully");
       
    };

    useEffect(() => {
        // Function to fetch user data
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
                        setRowData(searchData.map((item, index) => ({
                            ...item,
                            ItemSNO: index + 1
                        })));

                        const savedCompanyNo = sessionStorage.getItem('selectedCompanyCode');
                        const savedLocationNo = sessionStorage.getItem('selectedLocationCode');

                        // Check if sessionStorage has saved data
                        if (savedCompanyNo && savedLocationNo) {
                            const savedData = searchData.find(item => 
                                item.company_no === savedCompanyNo && item.location_no === savedLocationNo
                            );
                            if (savedData) {
                                setUserName(savedData.user_name);
                                setUserCode(savedData.user_code);
                                setCompanyNo(savedData.company_no);
                                setCompanyName(savedData.company_name);
                                setLocationName(savedData.location_name);
                                setShortName(savedData.short_name);
                                setLocationNo(savedData.location_no);
                                setSelectedData(savedData);
                            } else {
                                // Default to the first data if no saved data is found
                                setDefaultData(searchData[0]);
                            }
                        } else {
                            // Default to the first data if no saved data is present
                            setDefaultData(searchData[0]);
                        }
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

        // Function to set the default data
        const setDefaultData = (data) => {
            setUserName(data.user_name);
            setUserCode(data.user_code);
            setCompanyNo(data.company_no);
            setCompanyName(data.company_name);
            setLocationName(data.location_name);
            setShortName(data.short_name);
            setLocationNo(data.location_no);
            setSelectedData(data);
        };

        fetchUserData(); 
    }, [user_code]);

    const onSelectionChanged = (event) => {
        const selectedNode = event.api.getSelectedNodes()[0];
        if (selectedNode) {
            const selectedData = selectedNode.data;
            setSelectedData(selectedData);
            setUserName(selectedData.user_name);
            setUserCode(selectedData.user_code);
            setCompanyNo(selectedData.company_no);
            setCompanyName(selectedData.company_name);
            setLocationName(selectedData.location_name);
            setShortName(selectedData.short_name);
            setLocationNo(selectedData.location_no);
        } else {
            setSelectedData(null);
        }
    };

    return (
       <div className="container-fluid Topnav-screen">
        <div>
                  <ToastContainer position="top-right" className="toast-design" theme="colored" />
          
      <div className="shadow-lg p-1 bg-body-tertiary rounded mt-2 mb-2">
        <div className="d-flex justify-content-between">
        <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">
              List Of Companies
              </h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
            <savebutton className="purbut" title="save" onClick={() => handleSave(selectedData)} >
                <i className="fa-solid fa-floppy-disk"></i>
              </savebutton>
            </div>
          <div className="mobileview">
          <div class="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1">
                  List Of Companies
                  </h1>
                </div>
            <div class="dropdown mt-2 me-5">
              <button
                class="btn btn-primary dropdown-toggle p-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fa-solid fa-list"></i>
              </button>

              <ul class="dropdown-menu menu">
              <li class="iconbutton d-flex justify-content-center text-primary ">                  
              <icon
                   class="icon"
                   onClick={() => handleSave(selectedData)}
                 > 
                   <i class="fa-solid fa-floppy-disk"></i>
                   </icon>
                </li>
              </ul>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2">
      <div className="row ms-4 mt-2 mb-3 me-4">
        <div className="col-md-4 form-group mb-1">
          <div className="exp-form-floating">
            <label className="exp-form-labels partyName">
              User Code: {userCode}
            </label>
          </div>
        </div>
        <div className="col-md-4 form-group mb-1">
          <div className="exp-form-floating">
            <label className="exp-form-labels partyName">
              User Name: {userName}
            </label>
          </div>
        </div>

        <div className="col-md-4 form-group mb-1">
          <div className="exp-form-floating">
            <label className="exp-form-labels partyName">
              Company Code: {companyNo}
            </label>
          </div>
        </div>
        <div className="col-md-4 form-group mb-1">
          <div className="exp-form-floating">
            <label className="exp-form-labels partyName">
              Company Name: {companyName}
            </label>
          </div>
        </div>
        <div className="col-md-4 form-group mb-1">
          <div className="exp-form-floating">
            <label className="exp-form-labels partyName">
              Location Code: {locationNo}
            </label>
          </div>
        </div>
        <div className="col-md-4 form-group">
          <div className="exp-form-floating">
            <label className="exp-form-labels partyName">
              Location Name: {locationName}
            </label>
          </div>
        </div>
      </div>
      <div
        className="ag-theme-alpine mb-2"
        style={{ height: 437, width: "100%", marginTop: "20px" }}
      >
        <AgGridReact
          columnDefs={columnData}
          rowData={rowData}
          defaultColDef={{ editable: true, resizable: true }}
          rowSelection="single"
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
    </div>
    </div>
  );
};

export default AccountInformation;
