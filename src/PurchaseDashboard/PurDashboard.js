// src/Dashboard.js
import React from 'react';
import './Pro.css'
import ProductsTable from './ProductsTable';
import RevenueChart from './RevenueChart';



const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
       
          <h2 class="ms-4">Purchase Analysis</h2>
        
      </div>
      <div class="d-flex justify-content-between ms-4">
      <div class="">
     <RevenueChart />
     </div>
     <div class="Cards">
    <div class="shadow-lg bg-body-tertiary rounded  ps-5 pt-3  pb-3 me-3 pe-5">
      <div className="row">
        <div class="col-md-4">
          <div class="btn btn-card bg-success p-4 custom-shadow">
              <h5 class="card-title ms-2" style={{color:"white"}}><i class="fa-solid fa-cart-shopping me-1"></i> Daily Purchase</h5>
              <p style={{color:"white", fontSize:"25px"}}> $ 1085</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="btn btn-card bg-danger p-4 custom-shadow" >
              <h5 class="card-title ms-2" style={{color:"white"}}><i class="fa-brands fa-weebly"></i> Weekly Purchase</h5>
              <p style={{color:"white", fontSize:"25px"}}> $ 2898</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="btn btn-card bg-warning p-4 custom-shadow">
              <h5 class="card-title ms-2" style={{color:"white"}}><i class="fa-solid fa-calendar-days"></i> Monthly Purchase</h5>
              <p style={{color:"white", fontSize:"25px"}}> $ 38950</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="btn btn-card bg-info p-4 custom-shadow">
          <h5 class="card-title ms-2" style={{color:"white"}}><i class="fa-solid fa-calendar-day"></i> Yearly Purchase</h5>

          <p style={{color:"white", fontSize:"25px"}}> $ 1005062</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="btn btn-card bg-secondary p-4 custom-shadow">
          <h5 class="card-title ms-2" style={{color:"white"}}><i class="fa-brands fa-codepen"></i> Item Purchase</h5>

          <p style={{color:"white", fontSize:"25px"}}> $ 1005062</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="btn btn-card bg-primary p-4 custom-shadow">
          <h5 class="card-title ms-2" style={{color:"white"}}><i class="fa-solid fa-user"></i> Total Vendors</h5>

          <p style={{color:"white", fontSize:"25px"}}> $ 1005062</p>
          </div>
        </div>
        
        <div></div>
       
       
      </div></div>
      </div></div>
     
    
       
          <ProductsTable />
        
      
    </div>
    
  );
};

export default Dashboard;
