import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import * as XLSX from 'xlsx';
import './Item.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const config = require('../Apiconfig');

const VariantTab = () => {
  const navigate = useNavigate();
  const [itemVariant, setItemVariant] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [varient, setVarient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const columnDefs = [
    { 
      headerName: 'Item Name', 
      field: 'item_name', 
      sortable: true, 
      filter: true, 
      // minWidth: 250 
    },
    { 
      headerName: 'Current Stock', 
      field: 'Current_Stock', 
      sortable: true, 
      filter: true, 
      // minWidth: 250 
    },
    { 
      headerName: 'Total Purchase Stock', 
      field: 'Total_Purchased_Stock', 
      sortable: true, 
      filter: true, 
      // minWidth: 250 
    },
    { 
      headerName: 'Total Sales Stock', 
      field: 'Total_Sales_Stock', 
      sortable: true, 
      filter: true, 
      // minWidth: 250 
    },
    { 
      headerName: 'Stock Value', 
      field: 'Stock_Value', 
      sortable: true, 
      filter: true, 
      // minWidth: 250 
    },
  ];

  const gridRef = useRef(null);

  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/getAllItemVarient`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch item names');
        }
        const data = await response.json();
        setItemVariant(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchItemNames();
  }, []);


  const SelectedVarient = async (Item_variant) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/itemvairentname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Item_variant: Item_variant, company_code:sessionStorage.getItem("selectedCompanyCode") })
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData)
        setVarient(searchData[0].Item_variant)
        console.log(searchData[0].Item_variant)
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setRowData([]);
      } else {
        console.log("Bad request"); // Log the message for other errors
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleNavigateToForm = () => {
    if (!varient) {  
        toast.warning( 'You need to select a variant before proceeding!');
    } else {
        navigate("/VarientDataChart", { state: { varient } });
    }
};

  const handleClick = (item) => {
    SelectedVarient(item.Item_variant);
    console.log(item.Item_variant);
    setSelectedItem();
  };

  const handleItemData = () => {
    navigate('/ItemData');
  };
  
  const handleVarientData = () => {
    navigate('/VarientData');
  };

  const handleUnitData = () => {
    navigate('/UnitData');
  };


  const transformRowData = (data) => {
    return data.map(row => ({
      "Item Name": row.item_name,
      "Current Stock": row.Current_Stock.toString(),
      "Stock Value": row.Stock_Value.toString(),
      "Total Purchase Stock": row.Total_Purchased_Stock.toString(),
      "Total Sales Stock": row.Total_Sales_Stock.toString(),
    }));
  };

  const handleExportToExcel = () => {
    
    if (rowData.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data Available',
        text: 'There is no data to export.',
      });
      return;
    }
    const transformedData = transformRowData(rowData);
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Variants');
    XLSX.writeFile(workbook, 'ItemVariants.xlsx');
  };


  const filteredVarient = itemVariant.filter(item =>
    item.Item_variant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid Topnav-screen  me-5">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div class="shadow-lg p-3 pb-3 bg-body-tertiary rounded mb-1 d-flex justify-content-center"> 
      <div className="radio-input">
  <label>
    <input type="radio" name="radio" onChange={handleItemData} />
    <span className="name">Item</span>
  </label>
  <label  className="bg-primary">
    <input type="radio" name="radio" onChange={handleVarientData} />
    <span className="name text-white">Variant</span>
  </label>
  <label>
    <input type="radio" name="radio" onChange={handleUnitData} />
    <span className="name">Unit</span>
  </label>
  <div className="selection"></div>
</div>
          
          </div> 
      <div className="row">
        <div className="leftbar col-md-3 bg-light p-3 mt-2 shadow-lg bg-body-tertiary rounded mt-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <input type="text"
             className="form-control me-2 "
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          {/* {isAddCategoryOpen && <AddCategory closeCategory={handleClose} />} */}
          <div>
            <ul className="list-group" style={{ borderRadius: "5px", marginBottom: "2px", cursor: "pointer" }}>
            {filteredVarient
              .sort((a, b) => a.Item_variant.localeCompare(b.Item_variant))
              .map((item, index) => (
                <li 
                  key={index} 
                  onClick={() => handleClick(item)} 
                  className="list-group-item btn btn-success" 
                  style={{ borderRadius: "5px", marginBottom: "2px", marginTop: "2px" }}>
                  <div className="d-flex justify-content-between">
                    <span>{item.Item_variant}</span>
                    <span>{item.VariantCount}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="shadow-lg p-3 bg-body-tertiary rounded mt-2 pb-5">
            <div className="d-flex justify-content-between">
              <div className='p-3'>
                <h5 className="ms-4 ">Items</h5>
              </div>
              <div className="d-flex justify-content-between mb-2 me-4">
              <div className='p-2'>
                <button className="btn btn-dark" title='excel'  onClick={handleExportToExcel}>
                <i class="fa-solid fa-file-excel"></i>
                </button>
              </div>
              <div className='p-2'>
                <button className="btn btn-dark" onClick={handleNavigateToForm}>
                <i className="fa-solid fa-chart-simple"></i>
                </button>
              </div>
              </div>
            </div>
            <div className="ag-theme-alpine" style={{ height: 685, width: '100%' }}>
            <div className='ms-3'>
                <h5 className="ms-2">{varient}</h5>
              </div>
              <AgGridReact
                ref={gridRef} 
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

export default VariantTab;
