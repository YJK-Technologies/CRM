import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import './Item.css';
import 'ag-grid-enterprise';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const config = require('../Apiconfig');

const UnitPage = () => {
  const [rowData, setRowData] = useState([]);
  const [itemVariant, setItemVariant] = useState([]);
  const [unit, setUnit] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  const navigate = useNavigate();

  const columnDefs = [
    { 
      headerName: 'Item Name', 
      field: 'Item_name', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'Item Weight', 
      field: 'Item_weight', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'UOM', 
      field: 'Item_primary_uom', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'Stock Value', 
      field: 'StockValue', 
      sortable: true, 
      filter: true 
    },
    { 
      headerName: 'Current Stock', 
      field: 'CurrentStock', 
      sortable: true, 
      filter: true, 
      // minWidth: 600 
    },
  ];

  const gridRef = useRef(null);

  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");
        const response = await fetch(`${config.apiBaseUrl}/DashboardUnit`, {
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

  const SelectedVarient = async (Item_SecondaryUOM) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/uomdetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UOM: Item_SecondaryUOM, company_code:sessionStorage.getItem("selectedCompanyCode") }),
      });

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        setUnit(searchData[0].Item_SecondaryUOM)
      } else if (response.status === 404) {
        toast.warning('Data not found');
        setRowData([]);
      } else {
        console.log('Bad request'); 
      }
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  const handleNavigateToForm = () => {
    if (!unit) {  // Check if the variant is not selected
      toast.warning('You need to select a unit before proceeding!');
    } else {
      navigate("/UnitDataChart", { state: { unit } });
    }
  };

  const handleClick = (unit) => {
    SelectedVarient(unit.Item_SecondaryUOM);
    console.log(unit.Item_SecondaryUOM);
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
      "Item Name": row.Item_name,
      "Item Weight": row.Item_weight.toString(),
      "UOM": row.Item_primary_uom.toString(),
      "Stock Value": row.StockValue.toString(),
      "Current Stock": row.CurrentStock.toString(),
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
    XLSX.writeFile(workbook, 'Unit.xlsx');
  };

  const filteredUnit = itemVariant.filter(unit =>
    unit.Item_SecondaryUOM.toLowerCase().includes(searchTerm.toLowerCase())
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
  <label>
    <input type="radio" name="radio" onChange={handleVarientData} />
    <span className="name">Variant</span>
  </label>
  <label  className="bg-primary">
    <input type="radio" name="radio" onChange={handleUnitData} />
    <span className="name text-white">Unit</span>
  </label>
  <div className="selection"></div>
</div>

      </div>
      <div className="row">
        <div className=" leftbar col-md-3 bg-light pt-3 mt-2 shadow-lg bg-body-tertiary rounded mt-1" >
          <div className="d-flex justify-content-between align-items-center  mb-3">
            <input type="text"
              className="form-control me-2 "
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* {isUnitOpen && <Unit closeUnit={handleClose} />} */}
          <div >
            <ul className="list-group">
              {filteredUnit
                .sort((a, b) => a.Item_SecondaryUOM.localeCompare(b.Item_SecondaryUOM))
                .map((unit, index) => (
                  <li
                    key={index}
                    onClick={() => handleClick(unit)}
                    className="list-group-item d-flex justify-content-between align-items-center mb-2 btn btn-success "
                    style={{ borderRadius: "5px", marginBottom: "2px", cursor: "pointer" }}
                  >
                    {unit.Item_SecondaryUOM}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="shadow-lg p-3 bg-body-tertiary rounded mt-2">
            <div className="d-flex justify-content-between">
              <div className='p-3'>
                <h5 className="ms-4">Unit</h5>
              </div>
              <div className="d-flex justify-content-between mb-2 me-4">
                <div className='p-2'>
                  <button className="btn btn-dark" title='excel' onClick={handleExportToExcel}>
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
            <div className="ag-theme-alpine pb-4" style={{ height: 720, width: '100%' }}>
              <div className='ms-3'>
                <h5 className="ms-2">{unit}</h5>
              </div>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitPage;
