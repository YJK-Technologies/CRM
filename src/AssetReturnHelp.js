import { useState } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

const columnDefs = [
    {
        checkboxSelection: true,
        headerName: "Allocation No",
        field: "allocation_no",
        cellStyle: { textAlign: "center" },
        editable: false,
    },
    {
        headerName: "Allocation Date",
        field: "allocation_date",
        editable: false,
        cellStyle: { textAlign: "center" },
        valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd')
    },
    {
        headerName: "Return No",
        field: "return_no",
        cellStyle: { textAlign: "center" },
        editable: false,
    },
    {
        headerName: "Return Date",
        field: "return_date",
        editable: false,
        cellStyle: { textAlign: "center" },
        valueFormatter: params => format(new Date(params.value), 'yyyy-MM-dd')
    },
    {
        headerName: "Return Person",
        field: "return_person",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Return Reason",
        field: "return_reason",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Item Code",
        field: "item_code",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Item Name",
        field: "item_name",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "EMP No",
        field: "Emp_no",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: " Serial No",
        field: "Serial_no",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Quantity ",
        field: "Quantity",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Return Quantity",
        field: "return_qty",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
];

const defaultColDef = {
    resizable: true,
    wrapText: true,
    sortable: true,
    editable: true, 
};

export default function AssetsHelp({ open, handleClose, AssetReturnHelp }) {

    const [rowData, setRowData] = useState([]);
    const [allocation_no, setallocation_no] = useState("");
    const [allocation_date, setallocation_date] = useState("");
    const [return_no, setreturn_no] = useState("");
    const [return_date, setreturn_date] = useState("");
    const [return_person, setreturn_person] = useState("");
    const [return_reason, setreturn_reason] = useState("");
    const [loading, setLoading] = useState('');


    const handleSearchItem = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/searchCriteriaAssertReturn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), allocation_no, allocation_date, return_no, return_date, return_person, return_reason })
            });
            if (response.ok) {
                const searchData = await response.json();
                setRowData(searchData);
                console.log("data fetched successfully")
            } else if (response.status === 404) {
                toast.warning('Data not found')
                setRowData([]);
                clearInputs([])
                console.log("Data not found");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReload = () => {
        clearInputs([])
        setRowData([])
    };

    const clearInputs = () => {
        setallocation_no("");
        setallocation_date("");
    };

    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowSelected = (event) => {
        setSelectedRows(event.api.getSelectedRows());
    };

    const handleConfirm = () => {
        const selectedData = selectedRows.map(row => ({
            AllocationNO: row.allocation_no,
            AllocationDate: row.allocation_date,
            ReturnNo: row.return_no,
            ReturnDate: row.return_date,
            ReturnPerson: row.return_person,
            ReturnReason: row.return_reason,
        }));
        AssetReturnHelp(selectedData);
        handleClose();
        clearInputs([]);
        setRowData([]);
        setSelectedRows([]);
    }

    return (
        <div className="">
            {open && (
                <fieldset>
                    <div>
                        <div className="purbut">
                            {loading && <LoadingScreen />}
                            <div className="modal mt-5 popupadj Topnav-screen popup" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document" >
                                    <div className="modal-content">
                                        <div class="row justify-content-center">
                                            <div class="col-md-12 text-center">
                                                <div className="p-0 bg-body-tertiary">
                                                    <div className="purbut mb-0 d-flex justify-content-between" >
                                                        <h1 align="left" className="purbut">Return Help</h1>
                                                        <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                                                            <i class="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                    <div class="d-flex justify-content-between">
                                                        <div className="d-flex justify-content-start">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-body">
                                                <div className="row ms-4 me-3">
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemCode"
                                                            className="exp-input-field form-control"
                                                            placeholder="Allocation No"
                                                            value={allocation_no}
                                                            onChange={(e) => setallocation_no(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="Date"
                                                            id="Variant"
                                                            className="exp-input-field form-control"
                                                            placeholder="Allocation Date"
                                                            value={allocation_date}
                                                            onChange={(e) => setallocation_date(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return No"
                                                            value={return_no}
                                                            onChange={(e) => setreturn_no(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="Date"
                                                            id="ShortName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return Date"
                                                            value={return_date}
                                                            onChange={(e) => setreturn_date(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return No"
                                                            value={return_person}
                                                            onChange={(e) => setreturn_person(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return No"
                                                            value={return_reason}
                                                            onChange={(e) => setreturn_reason(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="mb-2 mt-2  d-flex justify-content-end ">
                                                        <icon className="icon popups-btn" onClick={handleSearchItem}>
                                                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                                                        </icon>
                                                        <icon className="icon popups-btn" onClick={handleReload}>
                                                            <i class="fa-solid fa-arrow-rotate-right"></i>
                                                        </icon>
                                                        <icon className="icon popups-btn" onClick={handleConfirm}>
                                                            <FontAwesomeIcon icon="fa-solid fa-check" />
                                                        </icon>
                                                    </div>
                                                </div>
                                                <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                                                    <AgGridReact
                                                        rowData={rowData}
                                                        columnDefs={columnDefs}
                                                        defaultColDef={defaultColDef}
                                                        onSelectionChanged={handleRowSelected}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mobileview">
                            {loading && <LoadingScreen />}
                            <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                                    <div className="modal-content">
                                        <div class="row justify-content-center">
                                            <div class="col-md-12 text-center">
                                                <div class="mb-0 rounded-0 d-flex justify-content-between">
                                                    <div className="mb-0 d-flex justify-content-start">
                                                        <h1 className="h1">Return Help</h1>
                                                    </div>
                                                    <div className="mb-0 d-flex justify-content-end ">
                                                        <button onClick={handleClose} className="closebtn2" required title="Close">
                                                            <i class="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <div className="d-flex justify-content-start">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-body">
                                                <div className="row ms-4 me-3">
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemCode"
                                                            className="exp-input-field form-control"
                                                            placeholder="Allocation No"
                                                            value={allocation_no}
                                                            onChange={(e) => setallocation_no(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="Date"
                                                            id="Variant"
                                                            className="exp-input-field form-control"
                                                            placeholder="Allocation Date"
                                                            value={allocation_date}
                                                            onChange={(e) => setallocation_date(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return No"
                                                            value={return_no}
                                                            onChange={(e) => setreturn_no(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="Date"
                                                            id="ShortName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return Date"
                                                            value={return_date}
                                                            onChange={(e) => setreturn_date(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return No"
                                                            value={return_person}
                                                            onChange={(e) => setreturn_person(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-sm mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemName"
                                                            className="exp-input-field form-control"
                                                            placeholder="Return No"
                                                            value={return_reason}
                                                            onChange={(e) => setreturn_reason(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchItem()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="mb-2 mt-2">
                                                        <button className="" onClick={handleSearchItem}>
                                                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                                                        </button>
                                                        <button className="" onClick={handleReload}>
                                                            <i class="fa-solid fa-arrow-rotate-right"></i>
                                                        </button>
                                                        <button className="" onClick={handleConfirm}>
                                                            <FontAwesomeIcon icon="fa-solid fa-check" />
                                                        </button>
                                                    </div>
                                                    <div className="ag-theme-alpine " style={{ height: '400px', width: '100%' }}>
                                                        <AgGridReact
                                                            rowData={rowData}
                                                            columnDefs={columnDefs}
                                                            defaultColDef={defaultColDef}
                                                            rowSelection="multiple"
                                                            pagination
                                                            onSelectionChanged={handleRowSelected}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            )}
        </div>
    );
}
