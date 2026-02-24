import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import './Table.css';
const config = require('../Apiconfig');

const ProductsTable = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/Product`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Map the fetched data to the required structure
          const mappedData = data.map((item) => ({
            id: item.id,
            image: item.image,
            name: item.item_name,
            price: item.price,
            Vendor: item.vendor,
            sell: item.sell,
            status: item.status,
            view: item.view,
            earning: item.earning,
          }));

          setRowData(mappedData);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while fetching data. Please try again later',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    navigate('/Item');
  };

  const handleSearch = async () => {
    try {
      // const searchParams = new URLSearchParams({ item_name: searchTerm }).toString();
      const response = await fetch(`${config.apiBaseUrl}/Product?`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const searchData = await response.json();

        // Map the search data to your product structure
        const mappedData = searchData.map((item) => ({
          id: item.id,
          Vendor: item.vendor,
          name: item.Item_name,
          Price: item.Item_std_purch_price,
          sell: item.sell,
          status: item.status,
          view: item.view,
          earning: item.earning,
        }));

        setRowData(mappedData);
        console.log('Data fetched successfully');
      } else if (response.status === 404) {
        console.log('Data not found');
        Swal.fire({
          title: 'Data not found',
          text: 'No data matching the search criteria',
          icon: 'info',
          confirmButtonText: 'OK',
        });
      } else {
        console.log('Bad request');
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred. Please try again later',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error fetching search data:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while fetching data. Please try again later',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const columnDefs = [
    // {
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   width: 50,
    // },
    { headerName: 'No', field: 'id', maxWidth: 60 },
    { headerName: 'Vendor', field: 'Vendor' },
   
    { headerName: 'Item Name', field: 'name', minWidth: 200 }, // Ensure field name matches your data
    { headerName: 'P.Price', field: 'Price', maxWidth: 100 },
    
    {
      headerName: 'Status',
      field: 'status',
      cellRendererFramework: (params) => (
        <span className={`badge ${params.value === 'Available' ? 'bg-success' : 'bg-danger'}`}>
          {params.value}
        </span>
      ),
    },
    { headerName: 'View', field: 'view' },
    { headerName: 'Earning', field: 'earning',minWidth: 650 },
  ];

  return (
    <div className="Table">
      <div className="d-flex justify-content-between">
        <h2 className="ms-4 mt-3">Products</h2>
      </div>
      <div className="d-flex justify-content-start">
        <div className="ms-4">
          <input
            type="text"
            placeholder="Search by Item Name"
            className="exp-input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="me-2">
          <button className="btn btn-dark" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </div>
        <div className="">
          <button className="btn btn-dark" onClick={handleClick}>
            <i className="fa-solid fa-circle-plus"></i> Product
          </button>
        </div>
      </div>
      <div className="mb-3">
        <div className="ag-theme-alpine mt-3" style={{ height: 410, width: '100%' }}>
          <AgGridReact rowData={rowData} columnDefs={columnDefs} rowSelection="multiple" />
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
