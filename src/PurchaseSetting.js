import React, { useState, useEffect, useRef } from 'react';

import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';


const config = require('./Apiconfig');

const PurchaseSetting = () => {
  // Example state for settings


  const [payType, setPayType] = useState("");
  const [paydrop, setPaydrop] = useState([]);
  const [selectedSales, setSelectedSales] = useState(null);
  const [salesdrop, setSalesdrop] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [salesType, setSalesType] = useState("");
  const [orderdrop, setOrderdrop] = useState([]);

  const [billDate, setBillDate] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouse, setwarehouse] = useState("");
  const [warehouseDrop, setWarehouseDrop] = useState([]);
  const [error, setError] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [status, setStatus] = useState('');
  const [customerName, setCustomerName] = useState("");
  const [Type, setType] = useState("purchase");
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('')
  const [customercodedrop, setcustomercodedrop] = useState([]);
  const [vendorCode, setVendorCode] = useState('');
  const [vendorname, setVendorname] = useState('');
  const [selectedPay, setSelectedPay] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState('');
  const [DefaultWarehouse, setDefaultWarehouse] = useState('');
  const [vendorcodedrop, setvendorcodedrop] = useState([]);
  const [deletePurchaseType, setDeletePurchaseType] = useState("");
  const [purchaseType, setPurchaseType] = useState("");
  const [purchasedrop, setPurchasedrop] = useState([]);
  const [order_type, setOrderType] = useState("");
  const [Screen_Type, setScreeType] = useState("");
  const [Shiping_to, setShiping_to] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedPrint, setselectedPrint] = useState(null);
  const [printdrop, setprintdrop] = useState([]);
  const [selectedCopies, setselectedCopies] = useState(null);
  const [Print, setPrint] = useState(null);
  const [Copies, setCopies] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [PrintTemplate, setPrintTemplate] = useState([]);

  const [copiesdrop, setcopiesdrop] = useState([]);
  const navigate = useNavigate();

  const handleCdhange = (e) => {
    const Customer = e.target.value;
    setCustomerCode(Customer);
    setStatus("Typing...")
  };

  const handleChangePrint = (selectedOption) => {
    setselectedPrint(selectedOption);
    setPrint(selectedOption ? selectedOption.value : '');
  };
  const filteredOptionPrint = Array.isArray(printdrop) ? printdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  })) : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getPrint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setprintdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);


  const handleChangeCopeies = (selectedOption) => {
    setselectedCopies(selectedOption);
    setCopies(selectedOption ? selectedOption.value : '');
  };

  const handleChange = (selectedOption) => {
    setSelectedCode(selectedOption);
    setVendorCode(selectedOption ? selectedOption.value : '');
    setSelectedUserName(selectedOption ? selectedOption.label.split(' - ')[1] : '');
    setError(false);
  };

  const filteredOptionCode = vendorcodedrop.map((option) => ({
    value: option.vendor_code,
    label: `${option.vendor_code} - ${option.vendor_name}`,
  }));

  const filteredOptionCopies = Array.isArray(copiesdrop) ? copiesdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  })) : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getcopies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setcopiesdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');


    const fetchVendor = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/vendorcode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setvendorcodedrop(val);
      } catch (error) {
        console.error('Error fetching Vendors:', error);
      }
    };

    if (company_code) {
      fetchVendor();
    }
  }, []);

  const handleChangePurchase = (selectedOption) => {
    setSelectedPurchase(selectedOption);
    setPurchaseType(selectedOption ? selectedOption.value : '');
  };

  const filteredOptionPurchase = purchasedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  useEffect(() => {
    const companyCode = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/purchasetype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: companyCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => setPurchasedrop(data))
      .catch((error) => console.error("Error fetching purchase types:", error));
  }, []);


  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PrintTemplate.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PrintTemplate.length - 1 ? 0 : prev + 1));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchCustomer(customerCode);
    }
  };

  const handleSearchCustomer = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getCustomerCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), customer_code: code }) // Send company_no and company_name as search criteria
      });
      if (response.ok) {
        const searchData = await response.json();
        if (searchData.length > 0) {
          const [{ customer_code, customer_name }] = searchData
          setCustomerCode(customer_code);
          setCustomerName(customer_name);

          console.log("data fetched successfully")
        }
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setCustomerCode('');
        setCustomerName('');

      } else {
        toast.warning('There was an error with your request.');
        setCustomerCode('');
        setCustomerName('');

      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error('Error inserting data: ' + error.message);
      setCustomerCode('');
      setCustomerName('');
    } finally {
      setLoading(false);
    }

  };



  const handleChangePay = (selectedOption) => {
    setSelectedPay(selectedOption);
    setPayType(selectedOption ? selectedOption.value : '');
  };

  const filteredOptionPay = paydrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const companyCode = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/paytype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: companyCode,
      }),
    })

      .then((response) => response.json())
      .then((data) => setPaydrop(data))
      .catch((error) => console.error("Error fetching payment types:", error));

    fetch(`${config.apiBaseUrl}/salestype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: companyCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => setSalesdrop(data))
      .catch((error) => console.error("Error fetching sales types:", error));

    fetch(`${config.apiBaseUrl}/ordertype`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: companyCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => setOrderdrop(data))
      .catch((error) => console.error("Error fetching Order type:", error));

  }, []);


  const handleChangeSales = (selectedOption) => {
    setSelectedSales(selectedOption);
    setSalesType(selectedOption ? selectedOption.value : '');

  };
  const filteredOptionSales = salesdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const handleChangeOrder = (selectedOption) => {
    setSelectedOrder(selectedOption);
    setOrderType(selectedOption ? selectedOption.value : '');

  };

  const filteredOptionOrder = orderdrop.map((option) => {
    const words = option.attributedetails_name.trim().split(/\s+/);

    const formattedName = words.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      } else {
        return word.toLowerCase();
      }
    }).join(' ');

    return {
      value: formattedName,
      label: formattedName,
    };
  });

  const handleChangeWarehouse = (selectedOption) => {
    setSelectedWarehouse(selectedOption);
    setwarehouse(selectedOption ? selectedOption.value : '');

  };


  const filteredOptionWarehouse = Array.isArray(warehouseDrop) ? warehouseDrop.map((option) => ({
    value: option.warehouse_code,
    label: option.warehouse_code,
  })) : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/PrintTemplates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Screen_Type: Type
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const templates = data.map((item) => {
            const byteArray = new Uint8Array(item.Templates.data);
            const blob = new Blob([byteArray], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            return {
              keyfield: item.Key_field,
              image: imageUrl,
            };
          });
          setPrintTemplate(templates);
        }
      })
      .catch((error) =>
        console.error("Error fetching print templates:", error)
      );
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDefaultoptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Screen_Type: Type,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) return;

        const { pay_type, Party_code, Print_copies, Print_options, warehouse_code, Transaction_type, Party_name } = data[0];

        const setDefault = (type, setType, options, setSelected) => {
          if (type !== undefined && type !== null) {
            const typeStr = type.toString();
            setType(typeStr);
            setSelected(options.find((opt) => opt.value === typeStr) || null);
          }
        };

        setDefault(pay_type, setPayType, filteredOptionPay, setSelectedPay);
        setDefault(Party_code, setVendorCode, filteredOptionCode, setSelectedCode);
        setDefault(warehouse_code, setwarehouse, filteredOptionWarehouse, setSelectedWarehouse);
        setDefault(Transaction_type, setPurchaseType, filteredOptionPurchase, setSelectedPurchase);
        setDefault(Print_options, setPrint, filteredOptionPrint, setselectedPrint);
        setDefault(Print_copies, setCopies, filteredOptionCopies, setselectedCopies);

        if (Party_name) setVendorname(Party_name);  // Set vendor name if available
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [paydrop, orderdrop, copiesdrop, printdrop, warehouseDrop, purchasedrop, Type]);


  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
    setBillDate(currentDate);
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getwarehousedrop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setWarehouseDrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  const handleSaveButtonClick = async () => {
    if (!selectedCode || !vendorname || !selectedPay || !selectedPurchase || !selectedWarehouse) {
      setError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }
    setLoading(true)
    try {

      const selectedTemplate = PrintTemplate[currentIndex];
      const selectedKeyField = selectedTemplate ? selectedTemplate.keyfield : "";

      const Header = {
        company_code: sessionStorage.getItem('selectedCompanyCode'),
        Party_code: vendorCode,
        Party_name: vendorname,
        pay_type: selectedPay?.value,
        Transaction_type: selectedPurchase?.value,
        warehouse_code: selectedWarehouse?.value,
        order_type: order_type,
        Screen_Type: Type,
        Shiping_to: Shiping_to,
        Print_options: Print,
        Print_copies: Copies,
        Print_templates: selectedKeyField,
        created_by: sessionStorage.getItem('selectedUserCode')
      };
      const response = await fetch(`${config.apiBaseUrl}/AddTransactionSettinngs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        toast.success("purchase Data inserted Successfully");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert purchase data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    } finally {
      setLoading(false);
    }

  };


  const handleNavigate = () => {
    navigate("/Purchase"); // Pass selectedRows as props to the Input component
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded  ">
        <div className=" mb-0 d-flex justify-content-between" >
          <label className="fw-bold fs-5">Default  Settings: </label>
          <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="pt-2 mb-4">
        <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
          <div className="row  ms-3 me-3">
            <div className="col-md-3 form-group mb-2">
              <label htmlFor="party_code" className={`${error && !customerCode ? 'red' : ''}`}>
                Vendor Code<span className="text-danger">*</span>
              </label>
              <div className="exp-form-floating">
                <div class="d-flex justify-content-end">

                  <Select
                    className="exp-input-field  justify-content-start"
                    id='vendorCode'
                    required
                    value={selectedCode}
                    options={filteredOptionCode}
                    maxLength={18}
                    onChange={handleChange}
                    // onKeyPress={handleKeyPress}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label id="customer">vendor Name</label>
                <span className="text-danger">*</span>
                <input
                  className="exp-input-field form-control"
                  id="vendorname"
                  required
                  value={vendorname}
                  onChange={(e) => setVendorname(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2 ">
              <div className="exp-form-floating">
                <label htmlFor="" className={`${error && !payType ? 'red' : ''}`}>Pay type</label>
                <span className="text-danger">*</span>
                <Select
                  id="payType"
                  value={selectedPay}
                  onChange={handleChangePay}
                  options={filteredOptionPay}
                  className="exp-input-field"
                  placeholder=""
                  required
                  data-tip="Please select a payment type"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label className={`${error && !purchaseType ? 'red' : ''}`}> Purchase Type</label>
                <span className="text-danger">*</span>
                <Select
                  id="purchaseType"
                  value={selectedPurchase}
                  onChange={handleChangePurchase}
                  options={filteredOptionPurchase}
                  className="exp-input-field"
                  placeholder=""
                // onKeyDown={(e) => handleKeyDown(e, DatE,purchaseType)} // No next field after this
                // ref={purchaseType} // Attach ref to Purchase Type
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div className="exp-form-floating">
                <label htmlFor="" className={`${error && !order_type ? 'red' : ''}`} >

                  Default Warehouse</label>
                <span className="text-danger">*</span>
                <Select
                  id="returnType"
                  className="exp-input-field"
                  placeholder=""
                  required
                  value={selectedWarehouse}
                  onChange={handleChangeWarehouse}
                  options={filteredOptionWarehouse}
                  data-tip="Please select a default warehouse"
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2" >
              <div className="exp-form-floating">
                <label className={` ${error && !selectedPrint ? 'text-danger' : ''}`}> Print Options<span className="text-danger">*</span></label>
                <Select
                  className="exp-input-field "
                  id="customername"
                  placeholder=""
                  required
                  value={selectedPrint}
                  onChange={handleChangePrint}
                  options={filteredOptionPrint}
                  data-tip="Please select a default Options"
                />
              </div>
            </div>
            <div className="col-md-3 form-group mb-2" >
              <div className="exp-form-floating">
                <label className={` ${error && !selectedCopies ? 'text-danger' : ''}`}> Print Copies<span className="text-danger">*</span></label>
                <Select
                  className="exp-input-field "
                  id="customername"
                  placeholder=""
                  required
                  value={selectedCopies}
                  onChange={handleChangeCopeies}
                  options={filteredOptionCopies}
                  data-tip="Please select a default Copy"
                />
              </div>
            </div>
            <div className="col-md-3 d-flex flex-column justify-content-between align-items-center h-100">
              {/* Preview + Navigation */}
              <div className="position-relative d-flex justify-content-center my-4">
                {/* Left Arrow */}
                <button
                  className="nav-arrow btn btn-light rounded-1 position-absolute start-0 top-50 translate-middle-y"
                  onClick={handlePrev}
                  disabled={PrintTemplate.length === 0}
                >
                  ❮
                </button>
                {/* Preview Box */}
                <div className="template-preview-box border rounded shadow-sm py-2 ">
                  {PrintTemplate.length > 0 ? (
                    <img
                      src={PrintTemplate[currentIndex].image}
                      alt="Template"
                      className="preview-image"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  ) : (
                    <div className="placeholder-text">No Preview Available</div>
                  )}
                </div>
                {/* Right Arrow */}
                <button
                  className="nav-arrow btn btn-light rounded-1  position-absolute end-0 top-50 translate-middle-y"
                  onClick={handleNext}
                  disabled={PrintTemplate.length === 0}
                >
                  ❯
                </button>
              </div>
              {/* Template Info Text at Bottom */}
              <div className="mt-auto text-center small text-muted mb-2">
                Template {PrintTemplate.length > 0 ? currentIndex + 1 : 0} of {PrintTemplate.length}
              </div>
            </div>
            {/* <div className="col-md-3 form-group mb-2 ">
                  <div className="exp-form-floating">
                    <label htmlFor="" className={`${error && !billDate ? 'red' : ''}`}>Bill Date</label>
                    <span className="text-danger">*</span>
                    <input
                      name="transactionDate"
                      id="billDate"
                      className="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required
                      value={billDate}
                      onChange={(e) => {
                        setBillDate(e.target.value);
                      }}
                      autoComplete="off"
              
                    />
                  </div>
                </div> */}
            {/* <div className="col-md-3 form-group mb-2">
                 
                  <div class="exp-form-floating">
                  <label htmlFor="" className={`${error && !warehouse ? 'red' : ''}`}>Default Warehouse </label>
                  <span className="text-danger">*</span>
                    <Select
                      id="returnType"
                      className="exp-input-field"
                      placeholder=""
                      required
                      value={selectedWarehouse}
                      onChange={handleChangeWarehouse}
                      options={filteredOptionWarehouse}
                      data-tip="Please select a default warehouse"
                    />
                  </div>
                </div> */}
            <div className="col-md-3 form-group mb-2" style={{ display: "none" }}>
              <div className="exp-form-floating">
                <label id="customer">Screen Type</label>
                <input
                  className="exp-input-field form-control"
                  id="customername"
                  required
                  value={Type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div className="col-md-3 form-group mb-2" style={{ display: "none" }}>
                <div className="exp-form-floating">
                  <label id="customer">Shipping To</label>
                  <input
                    className="exp-input-field form-control"
                    id="customername"
                    required
                    value={Shiping_to}
                    onChange={(e) => setShiping_to(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
              <button className="" onClick={handleSaveButtonClick} title="Save">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSetting;
