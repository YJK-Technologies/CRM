import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from '../ToastConfirmation';

const config = require('../Apiconfig');

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

function HoliDays() {
  const [HolidayDate, setHolidayDate] = useState("");
  const [error, setError] = useState("");
  const [Description, setDescription] = useState("");
  const [rowData, setRowData] = useState([]);
  const [startdate, setstartdate] = useState(getTodayDate)
  const [enddate, setenddate] = useState(getTodayDate);
  const [description, setdescription] = useState("");
  const [showAsterisk, setShowAsterisk] = useState(true);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      editedData: "true",
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;
        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Holiday Date",
      field: "HolidayDate",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
      editable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Description",
      field: "Description",
      editable: true,
      cellStyle: { textAlign: "center" },
      cellEditorParams: {
        maxLength: 250,
      },
    }
  ]

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const reloadGridData = () => {
    setRowData([]);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getsearchHoliday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startdate: startdate,
          enddate: enddate,
          Description: Description,
          company_code: sessionStorage.getItem('selectedCompanyCode'),
        }),
      });

      if (response.ok) {
        const resultData = await response.json();
        setRowData(resultData);
      } else if (response.status === 404) {
        setRowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }
  };

  const handleSave = async () => {
    if (!HolidayDate || !description) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    try {
      const Header = {
        HolidayDate,
        Description: description,
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        created_by: sessionStorage.getItem('selectedUserCode'),
      };

      const response = await fetch(`${config.apiBaseUrl}/addEmployeeHoliday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert Holiday data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
  };

  const saveEditedData = async () => {
    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        try {

          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/updateEmployeeHoliday`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "modified-by": modified_by
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data updated successfully", {
              onClose: () => handleSearch(), // Runs handleSearch when toast closes
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };


  const deleteSelectedRows = async (rowData) => {
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');

          const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };

          const response = await fetch(`${config.apiBaseUrl}/deleteEmployeeHoliday`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code
            },
            body: JSON.stringify(dataToSend)
          });

          if (response.ok) {
            toast.success("Data deleted successfully", {
              onClose: () => handleSearch(),
            });
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to insert sales data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error Deleting Data: ' + error.message);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  return (
    <div className="container-fluid Topnav-screen">
      <div>
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg  bg-body-tertiary rounded mb-2 mt-2">
          <div className=" d-flex justify-content-between  ">
            <h1 align="left" className="purbut">Employee Holiday</h1>
            <div className="col-md-1 mt-3 me-5">
              <div class=" d-flex justify-content-start  me-5">
                <div className="me-1 ">
                  <savebutton className="purbut" onClick={handleSave} required title="Save">
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton>
                  {/* <savebutton className="purbut" title='Update' onClick={handleSave} >
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton> */}
                </div>
                <div className="col-md-1">
                  <div className="ms-1">
                    <reloadbutton className="purbut" onClick={handleReload} title="Reload" style={{ cursor: "pointer" }}>
                      <i className="fa-solid fa-arrow-rotate-right"></i>
                    </reloadbutton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
          <div class="row ms-2">
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="add1" className={`${error && !HolidayDate ? 'red' : ''}`}>Holiday Date{showAsterisk && <span className="text-danger">*</span>}</label>
                  </div>
                </div>
                <input
                  id="HolidayDate"
                  class="exp-input-field form-control"
                  type="Date"
                  placeholder=""
                  required
                  title="Please Enter the Holiday Date"
                  value={HolidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="cname" className={`${error && !description ? 'red' : ''}`}>Description{showAsterisk && <span className="text-danger">*</span>}</label>
                  </div>
                </div>
                <input
                  id="Description"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  title="Please Enter the Description"
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  maxLength={255}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg p-3 bg-light rounded-bottom  mb-2">
          <div class="row  ms-2">
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="add1" class="exp-form-labels">Start Date</label>
                  </div>
                </div>
                <input
                  id="startdate"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please Enter the Start Date"
                  value={startdate}
                  onChange={(e) => setstartdate(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="add1" class="exp-form-labels">End Date</label>
                  </div>
                </div>
                <input
                  id="enddate"
                  class="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required title="Please Enter the End Date"
                  value={enddate}
                  onChange={(e) => setenddate(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="cname" class="exp-form-labels">Description</label>
                  </div>
                </div>
                <input
                  id="Description"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required
                  value={Description}
                  title="Please Enter the Description"
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  maxLength={255}
                />
              </div>
            </div>
            <div className="col-md-2 form-group mb-2 mt-4">
              <div class="exp-form-floating">
                <div class=" d-flex  justify-content-center">
                  <div class=''>
                    <icon className="popups-btn fs-6 p-3"
                      onClick={handleSearch}
                      required title="Search">
                      <i className="fas fa-search"></i>
                    </icon>
                  </div>
                  <div>
                    <icon className="popups-btn fs-6 p-3"
                      onClick={reloadGridData}
                      required title="Reload">
                      <i className="fa-solid fa-arrow-rotate-right" />
                    </icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ag-theme-alpine mt-2" style={{ height: 455, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              rowSelection="multiple"
              pagination={true}
              paginationAutoPageSize={true}
              gridOptions={gridOptions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HoliDays;