import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer,toast } from 'react-toastify';
import Select from 'react-select';

import { Dropdown, DropdownButton } from 'react-bootstrap';
const config = require('./Apiconfig');


function Product() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [product, setProduct] = useState("");
  const [ourbranddrop, setourbranddrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [productDrop, setProductDrop] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [Product_Code, setProduct_Code] = useState("");
  const [Product_name, setProduct_name] = useState("");
  const [item_code, setitem_code] = useState("");
  const [item_name, setitem_name] = useState("");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const attributePermission = permissions
    .filter(permission => permission.screen_type === 'Attribute')
    .map(permission => permission.permission_type.toLowerCase());



  useEffect(() => {
  }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5500/attributedetData");
  //     const jsonData = await response.json();
  //     setRowData(jsonData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };   
  // Define the function to reload the grid data
  const reloadGridData = () => {
    window.location.reload();
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getItem`)
      .then((data) => data.json())
      .then((val) => setourbranddrop(val));
  }, []);


  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getproductsearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Product_Code, Product_name, item_code, item_name })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("data fetched successfully")

      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("No data matching the search criteria.").then((result) => {
          if (result.isConfirmed) {
            if (gridApi) {
              gridApi.refreshClientSideRowModel();
            } else {
              console.error("Grid API is not available.");
            }
          }
        });
      }

      else {
        console.log("Bad request");
        toast.error("An error occurred. Please try again later.")
      } // Log the message for other errors

    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("An error occurred while fetching data. Please try again later")
    }
  };


  const columnDefs = [

    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Product Code",
      field: "Product_Code",
      //editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 250,
      maxWidth: 250,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Product Name",
      field: "product_name",
      // editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Description",
      field: "description",
      editable: false,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },

    {
      headerName: "Item Code",
      field: "Item",
      // editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Item Name",
      field: "ItemName",
      // editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },


    {

      headerName: "Qty",
      field: "quantity",
      // editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {

      headerName: "Tax",
      field: "tax",
      editable: false,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {

      headerName: "Tot Amt",
      field: "tot_amt",
      editable: false,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },

  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    // sortable: true,
    //editable: true,
    flex: 1,
    // filter: true,
    // floatingFilter: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onSearchInputChange = (e) => {
    setSearchValue(e.target.value);
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };
  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert("Please select at least one row to generate a report.");
      return;
    }

    const reportData = selectedRows.map((row) => {
      return {
        /* Date: moment(row.expenses_date).format("YYYY-MM-DD"),
        Type: row.expenses_type,
        Expenditure: row.expenses_amount,
        "Spent By": row.expenses_spentby,
        Remarks: row.remarks,*/
        "product code": row.Product_Code,
        "product name": row.Product_name,
        "item name": row.item_name,
        "DESCRIPTION": row.description,
        //"Status": row.status,
        //"Founded Date": row.FoundedDate,
        //"Website URL": row.WebsiteURL,
        //"Company Logo": row.Company_logo,
        //"Contact Number": row.contact_no,
        //  "CEO Name": row.CEOName,
        // "Annual Report URL": row.AnnualReportURL,
        // "created by": row.created_by,
        // "created date": row.created_date,
        // "modfied by": row.modfied_by,
        // "modfied date": row.modfied_date,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Product</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      body {
          font-family: Arial, sans-serif;
          margin: 20px;
      }
      h1 {
          color: maroon;
          text-align: center;
          font-size: 24px;
          margin-bottom: 30px;
          text-decoration: underline;
      }
      table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
      }
      th, td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
          vertical-align: top;
      }
      th {
          background-color: maroon;
          color: white;
          font-weight: bold;
      }
      td {
          background-color: #fdd9b5;
      }
      tr:nth-child(even) td {
          background-color: #fff0e1;
      }
      .report-button {
          display: block;
          width: 150px;
          margin: 20px auto;
          padding: 10px;
          background-color: maroon;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          text-align: center;
          border-radius: 5px;
      }
      .report-button:hover {
          background-color: darkred;
      }
      @media print {
          .report-button {
              display: none;
          }
          body {
              margin: 0;
              padding: 0;
          }
      }
    `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write("<h1><u>Product Information</u></h1>");

    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

    // Populate the rows
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write("</tr>");
    });

    reportWindow.document.write("</tbody></table>");

    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };


  /*const handleNavigateToForm = () => {
    navigate("/form");
  };*/

  const handleNavigatesToForm = () => {
    navigate("/AddProductDetail", { selectedRows }); // Pass selectedRows as props to the Input component
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  // Assuming you have a unique identifier for each row, such as 'id'
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.Product_Code === params.data.Product_Code
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      // Add the edited row data to the state
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };



  const saveEditedData = async () => {
    try {
      const company_code = sessionStorage.getItem('selectedCompanyCode');
      const modified_by = sessionStorage.getItem('selectedUserCode');

      // Filter the editedData state to include only the selected rows
      const selectedRowsData = editedData.filter(row =>
        selectedRows.some(selectedRow => selectedRow.Product_Code === row.Product_Code
        )
      );

      const saveConfirmation = await swal.fire({
        title: "Confirm Update",
        text: "Are you sure you want to update the data in the selected rows?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      });

      if (!saveConfirmation.value) {
        return;
      }

      const response = await fetch(`${config.apiBaseUrl}/ProudctUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code,
          "Modified-By": modified_by,


        },
        body: JSON.stringify({
          Product_Codetoupdate: selectedRowsData.map(row => row.Product_Code),
          updatedData: selectedRowsData,
          "company_code": company_code,
          "modified_by": modified_by,



        }), // Send the selected rows for saving along with their header and detail codes
      });

      if (response.ok) {
        setTimeout(() => {
          swal.fire({
            text: "Data updated successfully!",
            icon: "success",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            handleSearch();
          });
        }, 1000);
      } else {
        console.error("Failed to save data");
        swal.fire({
          title: "Error!",
          text: "Failed to update data. Please try again later",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      swal.fire({
        title: "Error!",
        text: "An error occurred while saving data. Please try again later",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };




  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      swal.fire({
        title: "No Rows Selected",
        text: "Please select at least one row to delete",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }


    const confirmDelete = await swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete the selected rows?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    if (!confirmDelete.isConfirmed) {
      return;
    }

    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');

    const productcode_todelete = selectedRows.map((row) => row.Product_Code);


    try {
      const response = await fetch(`${config.apiBaseUrl}/delproductdetdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "company_code": company_code,
          "Modified-By": modified_by

        },
        body: JSON.stringify({ productcode_todelete }),
        "company_code": company_code,
        "modified_by": modified_by
        // Corrected the key name to match the server-side expectation
      });

      if (response.ok) {
        console.log("Rows deleted successfully:", productcode_todelete);
        handleSearch(); // Fetch updated data after deletion
        swal.fire({
          title: "Success",
          text: "Rows deleted successfully",
          icon: "success",
          confirmButtonText: "OK"
        });
      } else {
        // Check if the response status is 400 for custom error handling
        if (response.status === 400) {
          const errorMessage = await response.text(); // Extract error message from response
          swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "OK"
          }); // Display error message to the user
        } else {
          console.error("Failed to delete rows");
        }
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      // Handle network errors or other exceptions
      swal.fire({
        title: "Error",
        text: "An error occurred while deleting rows. Please try again later.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getItem`)
      .then((data) => data.json())
      .then((val) => setProductDrop(val));
  }, []);

  const filteredOptionProduct = productDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeProduct = (selectedOption) => {
    setSelectedProduct(selectedOption);
    if (selectedOption.value === 'Product') {
      fetchProductCodes();
    } else if (selectedOption.value === 'Single') {
      fetchItemCodes();
    }
    setProduct(selectedOption ? selectedOption.value : '');
  };

  const fetchProductCodes = () => {
    fetch(`${config.apiBaseUrl}/getProductcode`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((product) => ({
          value: product.Product_Code,
          label: product.Product_Code,
        }));
        setDynamicOptions(formattedData);
      })
      .catch((error) => console.error('Error fetching product codes:', error));
  };


  const fetchItemCodes = () => {
    fetch(`${config.apiBaseUrl}/itemcode`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          value: item.Item_code,
          label: item.Item_code,
        }));
        setDynamicOptions(formattedData);
      })
      .catch((error) => console.error('Error fetching item codes:', error));
  };




  return (


    <div className="container-fluid Topnav-screen" >
            <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      
      <div class="d-flex justify-content-between" className="head mx-1">
        <h1 align="left" class="purbut">Product Mapping</h1>


        <div className="mobileview">

          <div class="d-flex justify-content-between">
            <div className="" style={{ marginRight: "50px", marginLeft: "80px", textAlign: "left" }}><h1  >
              Product Mapping
            </h1></div>
            <div class="dropdown">
              <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-list"></i>
              </button>

              <ul class="dropdown-menu">

                <li class="iconbutton d-flex justify-content-center text-success">
                  {['add', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                    <icon
                      class="icon"
                      onClick={handleChangeProduct}
                    >
                      <i class="fa-solid fa-user-plus"></i>
                      {" "}
                    </icon>
                  )}
                </li>
                <li class="iconbutton  d-flex justify-content-center text-danger">
                  {['delete', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                    <icon
                      class="icon"
                      onClick={deleteSelectedRows}
                    >

                      <i class="fa-solid fa-user-minus"></i>
                    </icon>
                  )}
                </li>
                <li class="iconbutton  d-flex justify-content-center text-primary mb-0">
                  {['update', 'all permission'].some(permission => attributePermission.includes(permission)) && (
                    <icon
                      class="icon"
                      onClick={saveEditedData}
                    >
                      <i class="fa-solid fa-floppy-disk"></i>
                    </icon>
                  )}
                </li>
                <li class="iconbutton  d-flex justify-content-center text-dark  mt-0">
                  {['all permission', 'view'].some(permission => attributePermission.includes(permission)) && (
                    <icon
                      class="icon"
                      onClick={generateReport}
                    >

                      <i class="fa-solid fa-print"></i>
                    </icon>
                  )}
                </li>
              </ul></div></div>
        </div>
        <div class="d-flex me-3 " >
          {['add', 'all permission'].some(permission => attributePermission.includes(permission)) && (
            <addbutton onClick={handleNavigatesToForm}
              required title="Add Attribute"> <i class="fa-solid fa-user-plus"></i> </addbutton>
          )}
          {['delete', 'all permission'].some(permission => attributePermission.includes(permission)) && (
            <delbutton onClick={deleteSelectedRows} required title="Delete">
              <i class="fa-solid fa-user-minus"></i>
            </delbutton>
          )}
          {/* {['update', 'all permission'].some(permission => attributePermission.includes(permission)) && (
            <button class="save" onClick={saveEditedData} required title="Update"><i class="fa-solid fa-floppy-disk"></i></button>
          )} */}

          {/* <div class="d-flex flex-row my-2 mt-3 ">
          <button  onClick={} title="print"><i class="fa fa-print" aria-hidden="true"></i></button>
         */}
          {['all permission', 'view'].some(permission => attributePermission.includes(permission)) && (
            <button class="print" onClick={generateReport} required title="Generate Report"  ><i class="fa-solid fa-print"></i></button>
          )}
        </div></div>
      <p>Search Criteria</p>
      <hr />


      <div className="row ms-4">




        <div className="col-md-3 form-group">
          <div class="exp-form-floating">
            <label for="locno" class="exp-form-labels">
              Product Code
            </label><input
              id="locno"
              className="exp-input-field form-control"
              type="text"
              placeholder=""
              required title="Please fill the header code here"
              value={Product_Code}
              maxLength={18}
              onChange={(e) => setProduct_Code(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        <div className="col-md-3 form-group">
          <div class="exp-form-floating">
            <label for="lname" class="exp-form-labels">
              Product Na
            </label><input
              id="lname"
              className="exp-input-field form-control"
              type="text"
              placeholder=""
              required title="Please fill the sub code here"
              value={Product_name}
              maxLength={18}
              onChange={(e) => setProduct_name(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

          </div>
        </div>


        <div className="col-md-3 form-group mb-2" style={{ justifyContent: "center" }}>

          <label for="lname" class="exp-form-labels" >
            Item code
          </label>

          <div className="exp-form-floating">
            <div class="d-flex justify-content-between">
              <input
                id="Item code"
                value={item_code}
                onChange={(e) => setitem_code(e.target.value)}
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type" // Attach ref to Purchase Type
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
        </div>


        <div className="col-md-3 form-group">
          <div class="exp-form-floating">
            <label for="lname" class="exp-form-labels" >
              Item Name
            </label>
            <input
              className="exp-input-field"
              id='itemCode'
              required
              placeholder=""
              maxLength={18}
              value={item_name}
              onChange={(e) => setitem_name(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoComplete='off'

            />


            {/* <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Description
              </label><input
                id="state"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required title="Please fill the description here"
                value={descriptions}
                maxLength={250}
                onChange={(e) => setdescriptions(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div> */}
            {/* <div className="col-md-3 form-group">
              <div class="exp-form-floating">
              <label  class="exp-form-labels">
                  Status
                </label>
                <Select
                id="status"
                value={selectedStatus}
                onChange={handleChangeStatus}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                options={filteredOptionStatus}
                className="exp-input-field"
                placeholder=""
                maxLength={18}
              />
                
              </div>
            </div> */}


          </div>
        </div>
        <div className="col-md-3 form-group mt-4">
          <div class="exp-form-floating">
            <div class="d-flex justify-content-center">
              <button className="searchBtn" onClick={handleSearch} required title="Search"><i className="fas fa-search"></i></button>
              <button className="searchBtn" onClick={reloadGridData} required title="Refresh"><FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" /></button>
            </div> </div></div>
      </div>












      <hr />

      {/* <p>Result Set</p> */}

      <div class="ag-theme-alpine" style={{ height: 530, width: "100%", }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          //onCellValueChanged={onCellValueChanged}
          rowSelection="multiple"
          pagination={true}
          paginationAutoPageSize={true}
          onSelectionChanged={onSelectionChanged}
          onCellValueChanged={onCellValueChanged}

        />
      </div>
    </div>
  );
}

export default Product;
