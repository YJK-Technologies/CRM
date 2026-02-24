import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../ItemDash.css';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import config from '../Apiconfig';
import { upperCase } from "upper-case";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PurchaseVendorPopup from '../PurchaseVendorPopup';
import Select from 'react-select';

const ItemPage = () => {

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [columnDefs] = useState([
    {
      headerName: "Trans Date",
      field: "transaction_date",
      // maxWidth: 130,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      headerName: "Trans No.",
      field: "transaction_no",
      // maxWidth: 200 
    },
    {
      headerName: "Vendor Code",
      field: "vendor_code",
      // minWidth: 100, 
      // maxWidth: 150 
    },
    {
      headerName: "Vendor name",
      field: "vendor_name",
      // minWidth: 150, 
      // maxWidth: 200 
    },
    {
      headerName: "Purchase Amount",
      field: "bill_rate",
      // minWidth: 10, 
      // maxWidth: 200 
    },
    {
      headerName: "Tax Amount",
      field: "tax_amount",
      // minWidth: 10, 
      // maxWidth: 200 
    },
    {
      headerName: "Tax Type",
      field: "tax_type",
      // minWidth: 200 
    },
    {
      headerName: "HSN code",
      field: "hsn_code",
      // minWidth: 100 
    },
    // { headerName: "Pay Type", field: "pay_type", minWidth: 100, maxWidth: 110 },
  ]);
  const [rowData, setRowData] = useState([]);
  const [vendor_code, setvendor_code] = useState("");
  const [hovered, setHovered] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [period, setPeriod] = useState("");
  const [type, setType] = useState("");
  const [perioddrop, setPerioddrop] = useState([]);
  const [typeDrop, setTypeDrop] = useState([]);


  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDateRange`)
      .then((data) => data.json())
      .then((val) => {
        setPerioddrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].Sno,
            label: val[0].DateRangeDescription,
          };
          setSelectedPeriod(firstOption);
          setPeriod(firstOption.value);
        }
      });
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getPurchaseAnalysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })

      .then((data) => data.json())
      .then((val) => {
        setTypeDrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].attributedetails_name,
            label: val[0].attributedetails_name,
          };
          setSelectedType(firstOption);
          setType(firstOption.value);
        }
      });
  }, []);



  const fetchpurchaseData = async () => {
    try {
      const body = {
        mode: period.toString(),
        vendor_code: vendor_code,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Type: type
      };

      if (selectedPeriod.label === "Custom Date") {
        body.StartDate = customDateRange.from;
        body.EndDate = customDateRange.to;
      }

      const response = await fetch(`${config.apiBaseUrl}/getpurchasereport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData)
        console.log(searchData);
      } else if (response.status === 404) {
        console.log("Data Not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };
  const navigate = useNavigate();

  const handlePrint = (params) => {
    console.log('Print', params.data);
  };

  // const handleNavigateToForm = (e) => {
  //   navigate("/PurchaseChart");
  //   e.preventDefault();
  // };


  const handleNavigateToForm = (e) => {
    if (!type) {
      toast.warning('You need to select a variant before proceeding!');
    } else {
      navigate("/PurchaseChart", { state: { type } });
    }
    e.preventDefault();

  };
  const transformRowData = (data) => {
    return data.map(row => ({
      Transaction_Date: row.transaction_date,
      Transaction_No: row.transaction_no,
      Vendor_Code: row.vendor_code.toString(),
      Vendor_Name: row.vendor_name.toString(),
      Pay_Type: row.pay_type.toString(),
      Purchase_Amount: row.purchase_amount.toString(),
      Tax_Amount: row.tax_amount.toString(),
      Total_Amount: row.total_amount.toString(),
    }));
  };

  const handleExportToExcel = () => {

    if (rowData.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }
    const transformedData = transformRowData(rowData);
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Variants');
    XLSX.writeFile(workbook, 'Purchase Analysis.xlsx');
  };

  const goBack = () => {
    navigate(-1);
  };


  const handleShowModal = () => {
    setOpen2(true);
  };

  const [open2, setOpen2] = React.useState(false);

  const handleClose = () => {

    setOpen2(false);

  };

  //Code for vendor popup to fetch the vendor details
  const handleVendor = async (data) => {
    if (data && data.length > 0) {
      const [{ VendorCode, VendorName }] = data;

      const upperVendorCode = upperCase(VendorCode);

      setvendor_code(upperVendorCode);

    } else {
      console.error('Data is empty or undefined');
    }
  };

  useEffect(() => {
    if (period && type) {
      fetchpurchaseData();
    }
  }, [period, customDateRange, vendor_code, type]);

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prevRange) => ({
      ...prevRange,
      [name]: value
    }));
  };

  const handleChangePeriod = (selectedPeriod) => {
    setSelectedPeriod(selectedPeriod);
    setPeriod(selectedPeriod ? selectedPeriod.value : '');
  };

  const handleChangeType = (selectedType) => {
    setSelectedType(selectedType);
    setType(selectedType ? selectedType.value : '');
  };

  const filteredOptionPeriod = perioddrop.map((option) => ({
    value: option.Sno,
    label: option.DateRangeDescription,
  }));

  const filteredOptionType = typeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded mb-2 me-2">
        <div className="d-flex justify-content-between">
          <h1 className='purbut mt-3'>Purchase Analysis</h1>
          <div className="mobileview">
            <div class="d-flex justify-content-between mt-2" >
              <h1 className='h1' style={{ marginRight: "5px" }}>Purchase Analysis</h1>
              <div className="dropdown me-5 p-3">
                <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fa-solid fa-list"></i>
                </button>
                <ul className="dropdown-menu ">
                  <li>
                    <icon class="iconbutton d-flex justify-content-center " onClick={handleNavigateToForm}>
                      <i class="fa-solid fa-chart-simple"></i>
                    </icon>
                  </li>
                  <li>
                    <icon class="iconbutton d-flex justify-content-center " onClick={handleExportToExcel}>
                      <i class="fa-solid fa-print"></i>
                    </icon>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="purbut">
            <div className="d-flex justify-content-end me-5" >
              <addbutton className=" mt-3 mb-3 rounded-3" onClick={handleExportToExcel}>
                <i class="fa-solid fa-file-excel"></i>
              </addbutton>
              <addbutton className=" mt-3 mb-3 rounded-3" onClick={handlePrint}>
                <i className="fa-solid fa-print"></i>
              </addbutton>
              <addbutton className=" mt-3 mb-3 rounded-3" onClick={handleNavigateToForm}>
                <i className="fa-solid fa-chart-simple"></i>
              </addbutton>
              <div class="mt-4">
                <delbutton class="" style={{ cursor: "pointer" }} onClick={goBack}>
                  <i class="fa-solid fa-circle-xmark"></i>
                </delbutton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-3 bg-body-tertiary rounded me-2">
        <div className="row d-flex justify-content-start mb-3">
          <div className='row'>
            <div className="col-12 col-md-2">
              <label>Vendor Code</label>
              <div className="exp-form-floating">
                <div class="d-flex justify-content-end">
                  <input
                    className="exp-input-field form-control justify-content-start"
                    id='party_code'
                    required
                    value={vendor_code}
                    onChange={(e) => setvendor_code(e.target.value)}
                    maxLength={18}
                    autoComplete='off'
                  />
                  <div className='position-absolute mt-2 me-2'>
                    <span
                      style={hovered ? { cursor: "pointer", borderRadius: "50%", backgroundColor: "#f0f0f0", padding: "10px" } : { cursor: "pointer", borderRadius: "50%", padding: "10px" }}
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                      onClick={handleShowModal}>
                      <i class="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-4 col-md-3">
              <label>Select Type</label>
              <Select
                id="wcode"
                value={selectedType}
                onChange={handleChangeType}
                options={filteredOptionType}
                className="border-secondary"
                placeholder=""
                required
                maxLength={18}
              />
            </div>
            <div className="col-12 col-md-2">
              <label>Select Period</label>
              <Select
                id="wcode"
                value={selectedPeriod}
                onChange={handleChangePeriod}
                options={filteredOptionPeriod}
                className="border-secondary"
                placeholder=""
                required title="Please select a item code"
                maxLength={18}
              />
            </div>
            <div className='col-lg-8'>
              {selectedPeriod.label === "Custom Date" && (
                <div className="row">
                  <div className="col-12 col-md-3">
                    <span className="">From</span>
                    <input
                      type="date"
                      className="form-control border-secondary"
                      name="from"
                      value={customDateRange.from}
                      onChange={handleCustomDateChange}
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <span className="">To</span>
                    <input
                      type="date"
                      className="form-control border-secondary"
                      name="to"
                      value={customDateRange.to}
                      onChange={handleCustomDateChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ag-theme-alpine mb-4" style={{ height: 610, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
        <div>
          <PurchaseVendorPopup open={open2} handleClose={handleClose} handleVendor={handleVendor} />
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
