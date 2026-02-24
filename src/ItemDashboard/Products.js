import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import "./Item.css";
import "../input.css";
import "../mobile.css";
import * as XLSX from 'xlsx';
import Select from 'react-select'
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const config = require("../Apiconfig");

const Products = () => {
  const [itemNames, setItemNames] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAdjustItemOpen, setIsAdjustItemOpen] = useState(false);
  const [Standard_Sales_Price, setSalesPrice] = useState(0);
  const [Standard_Purchase_Price, setPurchasePrice] = useState(0);
  const [Item_stock, setStockQty] = useState(0);
  const [Stock_Value, setStockValue] = useState(0);
  const [itemName, setItemName] = useState(" ");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [Transactiondrop, setTransactiondrop] = useState([]);
  const [transaction_type, settransaction_type] = useState("");
  const [selectedTransaction, setselectedTransaction] = useState('');
  const [selectedItemCode, setSelectedItemCode] = useState('');
  const [partycode, setPartyCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/Product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch item names");
        }
        const data = await response.json();
        console.log("Product data:", data); // Debug log
        setItemNames(data);
      } catch (error) {
        // Handle the error if needed
      }
    };
    fetchItemNames();
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })

      .then((data) => data.json())
      .then((val) => {
        setTransactiondrop(val);
  
        if (val.length > 0) {
          const firstOption = {
            value: val[0].attributedetails_name,
            label: val[0].attributedetails_name,
          };
          setselectedTransaction(firstOption);
          settransaction_type(firstOption.value);
        }
      });
  }, []);
  
  const handleChangetransaction = (selectedTransaction) => {
      setselectedTransaction(selectedTransaction);
      settransaction_type(selectedTransaction? selectedTransaction.value : '');
  };

  const filteredOptionTransaction = Transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


  const SelectItem = async (itemcode) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getitemstockvalue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_code: itemcode, company_code:sessionStorage.getItem("selectedCompanyCode") }),
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ item_code, Item_stock, Stock_Value, Standard_Purchase_Price, Standard_Sales_Price }] = searchData
        setSalesPrice(Standard_Sales_Price);
        setPurchasePrice(Standard_Purchase_Price);
        setStockQty(Item_stock);
        setStockValue(Stock_Value);
        setItemName(item_code);
        setSelectedItemCode(item_code);
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  useEffect(() => {
    if(partycode && selectedItemCode && fromDate && toDate){
      SelectedItemPartyDate();
    }
    else if(fromDate && toDate){
      SelectedItemDate();
    }
    else if ( partycode && selectedItemCode) {
      SelectedItemParty();
    }
    else if(selectedItemCode){
      SelectedItem(selectedItemCode);
    }
  }, [selectedItemCode, selectedTransaction, fromDate, toDate]);

  const SelectedItem = async (itemcode,) => {
    try {
      const mode = selectedTransaction ? selectedTransaction.value : '';

      const response = await fetch(`${config.apiBaseUrl}/TransDetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_code: itemcode , mode:mode, company_code:sessionStorage.getItem("selectedCompanyCode") }),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData)
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setRowData([]);
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handlePartyCodeChange = (e) => {
    setPartyCode(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (partycode) {
        SelectedItemParty(partycode);
      }
    }
  };

  const SelectedItemParty = async () => {
    try {
      const mode = selectedTransaction ? selectedTransaction.value : '';

      const response = await fetch(`${config.apiBaseUrl}/partytransdetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_code: selectedItemCode ,mode:mode , party_code:partycode, company_code:sessionStorage.getItem("selectedCompanyCode")}),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData)
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


  const SelectedItemDate = async () => {
    try {
      const mode = selectedTransaction ? selectedTransaction.value : '';

      const response = await fetch(`${config.apiBaseUrl}/datetransdetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_code:selectedItemCode ,mode:mode,start_date:fromDate ,end_date:toDate }),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData)
      } else if (response.status === 404) {
        console.log("Data Not found")
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };


  const SelectedItemPartyDate = async () => {
    try {
      const mode = selectedTransaction ? selectedTransaction.value : '';

      const response = await fetch(`${config.apiBaseUrl}/alltransdetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_code:selectedItemCode ,mode:mode,start_date:fromDate ,end_date:toDate, party_code:partycode }),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData)
      } else if (response.status === 404) {
        console.log("Data Not found")
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Transaction Date",
      field: "transaction_date",
      sortable: true,
      filter: true,
      // minWidth: 150,
      valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd'),
    },
    {
      headerName: "Transaction No",
      field: "transaction_no",
      sortable: true,
      filter: true,
      // minWidth: 120,
    },
    {
      headerName: "Item Name",
      field: "item_name",
      sortable: true,
      filter: true,
      // minWidth: 120,
    },
    {
      headerName: "Vendor/Customer Code",
      field: "party_code",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Vendor/Customer",
      field: "party_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Quantity",
      field: "bill_qty",
      sortable: true,
      filter: true,
      // minWidth: 120,
    },
    {
      headerName: "Transaction Type",
      field: "transaction_type",
      sortable: true,
      filter: true,
      // minWidth: 120,
    },
    {
      headerName: "Item Amount",
      field: "item_amt",
      sortable: true,
      filter: true,
      // minWidth: 350,
    },
    {
      headerName: "Total Amount",
      field: "bill_rate",
      sortable: true,
      filter: true,
      // minWidth: 350,
    },
  ];

  const handleNavigateToForm = () => {
    navigate("/ItemDataChart");
  };

  const handleItemClick = (item) => {
    const itemCode = item.Item_code
    SelectItem(itemCode);
    SelectedItem(itemCode);
  };

  const handleItemData = () => {
    navigate("/ItemData");
  };

  const handleVarientData = () => {
    navigate("/VarientData");
  };

  const handleUnitData = () => {
    navigate("/UnitData");
  };

  const filteredItems = itemNames.filter(item =>
    item.Item_code.toLowerCase().includes(searchTerm.toLowerCase()) || item.Item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const transformRowData = (data) => {
    return data.map(row => ({
      "Transaction Date": row.transaction_date,
      "Transaction No": row.transaction_no.toString(),
      "Item Name": row.item_name.toString(),
      "Vendor/Customer Code": row.party_code.toString(),
      "Vendor/Customer": row.party_name.toString(),
      "Quantity": row.bill_qty.toString(),
      "Transaction Type": row.transaction_type.toString(),
      "Item Amount": row.item_amt.toString(),
      "Total Amount": row.bill_rate.toString(),
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
    XLSX.writeFile(workbook, 'Item.xlsx');
  };

  return (
    <div className="container-fluid Topnav-screen  me-5">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-3 pb-3 bg-body-tertiary rounded mb-1 d-flex justify-content-center">
      <div className="radio-input">
  <label className="bg-primary">
    <input type="radio" name="radio" onChange={handleItemData} />
    <span className="name text-white">Item</span>
  </label>
  <label>
    <input type="radio" name="radio" onChange={handleVarientData} />
    <span className="name">Variant</span>
  </label>
  <label>
    <input type="radio" name="radio" onChange={handleUnitData} />
    <span className="name">Unit</span>
  </label>
  <div className="selection"></div>
</div>

      </div>
      <div className="row">
      <div className="leftbar overflow-y-scroll col-md-3 bg-light pt-3 mb-2 mt-1 shadow-lg bg-body-tertiary rounded ">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="">
                <ul className="list-group">
                    {filteredItems
                        .sort((a, b) => a.Item_code.localeCompare(b.Item_code) || a.Item_name.localeCompare(b.Item_name))
                        .map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    borderRadius: "5px",
                                    marginBottom: "2px",
                                    cursor: "pointer",
                                    overflow: "auto"
                                }}
                            >
                                <li
                                    onClick={() => handleItemClick(item)}
                                    className="list-group-item d-flex justify-content-between align-items-center btn btn-success"
                                >
                                    <div className="d-flex flex-column">
                                        <h6 className="mb-0">{item.Item_code} , {item.Item_name}</h6>
                                    </div>
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            fill="currentColor"
                                            className="bi bi-plus-circle-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                                        </svg>
                                    </span>
                                </li>
                            </div>
                        ))}
                </ul>
            </div>
        </div>

        <div className="col-md-9">
          <div className="shadow-lg p-1 pt-3 bg-body-tertiary rounded mt-1 mb-1">
            <div className="d-flex justify-content-between mb-1 ms-4">
              <div className="d-flex justify-content-start me-5">
                <h5>{itemName}</h5>
              </div>

              <div className="row-2 me-2">
              </div>
            </div>
            <div className="d-flex justify-content-between me-5">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <p className="price">Sale Price: </p>
                  <div>
                    <p style={{ color: "green" }}>{Standard_Sales_Price}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="price">Purchase Price: </p>
                  <div>
                    <p style={{ color: "green" }}>{Standard_Purchase_Price}</p>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <p className="price">Stock qty: </p>
                  <div>
                    <p style={{ color: "green" }}>{Item_stock}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="price">Stock Value: </p>
                  <div>
                    <p style={{ color: "green" }}>{Stock_Value}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-gap-3 mb-2"></div>
          <div className="shadow-lg bg-body-tertiary rounded pt-4 mb-2 pb-3">
          <div className="">
  <div className="row align-items-start ">
    {/* Party Code Input and Search Button */}
    <div className="col-12 col-md-2 d-flex mb-3 ms-2">
      <div className="col-8">
        <input
          type="text"
          className="form-control "
          placeholder="Enter Party Code..."
          value={partycode}
          onChange={handlePartyCodeChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="col-2 text-start">
        <button
          className=" ms-2"
          type="search"
          onClick={() => SelectedItemParty()}
        >
          <i className="fa-solid fa-magnifying-glass-arrow-right"></i>
        </button>
      </div>
    </div>

    {/* Date Range Inputs */}
    <div className="col-12 col-md-5 mb-3">
      <div className="input-group">
        <span className="me-2 mt-2">From</span>
        <input
          type="date"
          className="form-control"
          value={fromDate}
          onChange={handleFromDateChange}
        />
        <span className="ms-3 me-2 mt-2">To</span>
        <input
          type="date"
          className="form-control"
          value={toDate}
          onChange={handleToDateChange}
        />
      </div>
    </div>

    {/* Transaction Type Dropdown */}
    <div className="col-5 col-md-2 form-group mb-3 ms-2">
      <Select
        id="transactionType"
        value={selectedTransaction}
        onChange={handleChangetransaction}
        options={filteredOptionTransaction}
        className="border-secondary"
        placeholder=""
        required
        title="Please select a transaction type"
        maxLength={250}
      />
    </div>

    {/* Buttons (Excel Export and Navigation) */}

    <div className="col-3 col-md-1 text-center text-md-start">
      <button className="btn btn-dark" title="Excel" onClick={handleExportToExcel}>
        <i className="fa-solid fa-file-excel"></i>
      </button>
    </div>
    <div className="col-3 col-md-1 text-center text-md-start ">
      <icon className="btn btn-dark rounded-3" onClick={handleNavigateToForm}>
        <i className="fa-solid fa-chart-simple"></i>
      </icon>
    </div>
  </div>
</div>


            <div className="ag-theme-alpine" style={{ height: 575, width: "100%" }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={11}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
