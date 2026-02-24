import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ItemDash.css';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import config from './Apiconfig';
import SalesVendorPopup from './SalesVendorPopup';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemPage = () => {

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [hovered, setHovered] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [CustomerCode, setCustomerCode] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [perioddrop, setPerioddrop] = useState([]);
  const [period, setPeriod] = useState("");
  const [selectedType, setSelectedType] = useState('');
  const [typedrop, setTypedrop] = useState([]);
  const [Type, setType] = useState("");
  const [paydrop, setPaydrop] = useState([]);
  const [payType, setPayType] = useState("");
  const [salesModeDrop, setSalesModeDrop] = useState([]);
  const [selectedSalesMode, setSelectedSalesMode] = useState(null);
  const [salesMode, setSalesMode] = useState('');

  const [selectedPay, setSelectedPay] = useState(null);
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });

  const columnDefs = [
    {
      headerName: "Trans Date",
      field: "bill_date",
      valueFormatter: (params) => formatDate(params.value),
      // maxWidth: 130 
    },
    {
      headerName: "Trans No",
      field: "bill_no",
      // maxWidth: 200 
    },
    {
      headerName: "Customer Code",
      field: "customer_code",
      // minWidth: 90, 
      // maxWidth: 150 
    },
    {
      headerName: "Sales Type",
      field: "sales_type",
      // minWidth: 130, 
      // maxWidth: 130 
    },
    {
      headerName: "Pay Type",
      field: "pay_type",
      // minWidth: 130, 
      // maxWidth: 130 
    },
    {
      headerName: "Sold Amount",
      field: "bill_rate",
      // minWidth: 150, 
      // maxWidth: 150 
    },
    {
      headerName: "Tax Amount",
      field: "tax_amt",
      // minWidth: 150, 
      // maxWidth:150 
    },
    {
      headerName: "Tax Type",
      field: "tax_type",
      // minWidth: 200 
    },
    {
      headerName: "HSN code",
      field: "hsn_code",
      // minWidth: 60, 
      // maxWidth:100 
    },
  ];

  const navigate = useNavigate();

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

    fetch(`${config.apiBaseUrl}/getDashBoardType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => {
        setTypedrop(val);
        if (val.length > 0) {
          const firstOption = {
            value: val[0].attributedetails_name,
            label: val[0].attributedetails_name
          }
          setSelectedType(firstOption);
          setType(firstOption.value);
        }
      })
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getSalesMode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })

      .then((response) => response.json())
      .then((data) => {
        const updatedData = [{ attributedetails_name: "All" }, ...data];
        setSalesModeDrop(updatedData);

        if (updatedData.length > 0) {
          const defaultValue = {
            value: updatedData[0].attributedetails_name,
            label: updatedData[0].attributedetails_name,
          };
          setSelectedSalesMode(defaultValue);
          setSalesMode(defaultValue.value);
        }
      })
      .catch((error) => console.error("Error fetching purchase types:", error));
  }, []);

  const filteredOptionSalesMode = Array.isArray(salesModeDrop)
    ? salesModeDrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const handleChangeSalesMode = (selectedSalesMode) => {
    setSelectedSalesMode(selectedSalesMode);
    setSalesMode(selectedSalesMode ? selectedSalesMode.value : '');
  };

  const filteredOptionPeriod = perioddrop.map((option) => ({
    value: option.Sno,
    label: option.DateRangeDescription,
  }));

  const filteredOptionType = typedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangePeriod = (selectedPeriod) => {
    setSelectedPeriod(selectedPeriod);
    setPeriod(selectedPeriod ? selectedPeriod.value : '');
  };

  const handleChangeType = (selectedType) => {
    setSelectedType(selectedType);
    setType(selectedType ? selectedType.value : '');
  };

  const handlePrint = (params) => {
    console.log('Print', params.data);
  };

  // const handleNavigateToForm = (e) => {
  //   navigate("/SalesChart");
  //   e.preventDefault();
  // };

  const handleChangePay = (selectedOption) => {
    setSelectedPay(selectedOption);
    setPayType(selectedOption ? selectedOption.value : '');

  };

  const filteredOptionPay = paydrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/paytype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })

      .then((response) => response.json())
      .then((data) => {
        const updatedData = [{ attributedetails_name: "All" }, ...data]; // Adding "All" as the first item
        setPaydrop(updatedData);
      })
      .catch((error) => console.error("Error fetching payment types:", error));
  }, []);

  const handleNavigateToForm = (e) => {
    if (!Type) {
      toast.warning('You need to select a variant before proceeding!');
    } else {
      navigate("/SalesChart", { state: { Type } });
    }
    e.preventDefault();

  };

  const transformRowData = (data) => {
    return data.map(row => ({
      Transaction_Date: row.bill_date,
      Transaction_No: row.bill_no,
      Party_Code: row.customer_code.toString(),
      Sales_Type: row.sales_type.toString(),
      Pay_Type: row.pay_type.toString(),
      Sold_Amount: row.bill_amt.toString(),
      Tax_amount: row.tax_amount.toString(),
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
    XLSX.writeFile(workbook, 'Sales_Analysis.xlsx');
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleVendor = async (data) => {
    if (data && data.length > 0) {
      const [{ CustomerCode }] = data;
      setCustomerCode(CustomerCode);
    } else {
      console.error('Data is empty or undefined');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShowModal = () => {
    setOpen(true);
  };

  const [open, setOpen] = React.useState(false);

  const fetchSalesData = async () => {
    try {
      const body = {
        mode: period.toString(),
        customer_code: CustomerCode,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        type: Type,
        pay_type: payType,
        sales_mode: salesMode
      };

      if (selectedPeriod.label === "Custom Date") {
        body.StartDate = customDateRange.from;
        body.EndDate = customDateRange.to;
      }

      const response = await fetch(`${config.apiBaseUrl}/getsalesreport`, {
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
        setRowData([]);
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  useEffect(() => {
    if (period && Type) {
      fetchSalesData();
    }
  }, [period, customDateRange, Type, payType, salesMode]);

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prevRange) => ({
      ...prevRange,
      [name]: value
    }));
  };

  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded mb-2 me-2">
        <div className="d-flex justify-content-between ">
          <h1 className='purbut mt-3'>Sales Analysis</h1>
          <div className="mobileview">
            <div class="d-flex justify-content-between mt-2 me-4" >
              <h1 className='h1' style={{ marginRight: "5px" }}>Sales Analysis</h1>
              <div className="dropdown p-1 me-4 pt-2">
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
            <div className="d-flex justify-content-end me-5">
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
        <div className='row ms-4 mt-3 mb-3 me-4'>
          <div className="col-md-2 form-group">
            <label className="form-label"> Customer Code</label>
            <div class="d-flex justify-content-end">
              <input
                className="exp-input-field form-control justify-content-start"
                id='customercode'
                required
                value={CustomerCode}
                maxLength={18}
                onChange={(e) => setCustomerCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchSalesData()}
                autoComplete="off"
              />
              <div className='position-absolute mt-1 me-2'>
                <span className="icon searchIcon"
                  onClick={handleShowModal}>
                  <i class="fa fa-search"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-2 form-group">
            <label className="form-label">Select Period</label>
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
          {selectedPeriod.label === "Custom Date" && (
            <div className="col-md-5 mb-3">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">From</label>
                  <input
                    type="date"
                    className="form-control border-secondary"
                    name="from"
                    value={customDateRange.from}
                    onChange={handleCustomDateChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">To</label>
                  <input
                    type="date"
                    className="form-control border-secondary"
                    name="to"
                    value={customDateRange.to}
                    onChange={handleCustomDateChange}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="col-12 col-md-2">
            <label className="form-label">Select Type</label>
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
            <label className="form-label">Pay type</label>
            <Select
              id="payType"
              value={selectedPay}
              onChange={handleChangePay}
              options={filteredOptionPay}
              className="border-secondary"
              placeholder=""
              required
              data-tip="Please select a payment type"
              autoComplete="off"
            />
          </div>
          {selectedType.label === "Sales" && (
            <div className="col-12 col-md-2">
              <label className="form-label">Sales Mode</label>
              <Select
                id="payType"
                value={selectedSalesMode}
                onChange={handleChangeSalesMode}
                options={filteredOptionSalesMode}
                className="border-secondary"
                placeholder=""
                required
                autoComplete="off"
              />
            </div>
          )}
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
          <SalesVendorPopup open={open} handleClose={handleClose} handleVendor={handleVendor} />
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
