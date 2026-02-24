import React from 'react';

const Cards = () => {
    return (
        <div className="row">
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Total Sales</h5>
                        <p className="card-text">$1,234</p>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">New Users</h5>
                        <p className="card-text">123</p>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Pending Orders</h5>
                        <p className="card-text">12</p>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Resolved Issues</h5>
                        <p className="card-text">9</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cards;
