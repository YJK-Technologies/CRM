import React, { useEffect, useState } from "react";
import "../Css/DcPrint.css";
import { ToWords } from 'to-words';
import { useLocation } from 'react-router-dom';
import LZString from "lz-string";

const Invoice = () => {
    const [headerData, setHeaderData] = useState(null);
    const [detailData, setDetailData] = useState(null);

    const location = useLocation();
    const toWords = new ToWords();

    useEffect(() => {
        const header = sessionStorage.getItem('DcheaderData');
        const detail = sessionStorage.getItem('DcdetailData');

        if (header && detail) {
            setHeaderData(JSON.parse(LZString.decompress(header)));
            setDetailData(JSON.parse(LZString.decompress(detail)));
        } else {
            console.error('Data not found in sessionStorage');
        }
    }, []);

    const bufferToBase64 = (buffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = '';

        for (let i = 0; i < bytes.byteLength; i += 1024) {
            const chunk = bytes.subarray(i, i + 1024);
            binary += String.fromCharCode.apply(null, chunk);
        }

        return `data:image/jpeg;base64,${window.btoa(binary)}`;
    };

    const processItemImages = () => {
        if (headerData[0].company_logo && headerData[0].company_logo.data) {
            return bufferToBase64(headerData[0].company_logo.data);
        }
        return '';
    };

    const processSignatureImages = () => {
        if (headerData[0].authorisedSignatur && headerData[0].authorisedSignatur.data) {
            return bufferToBase64(headerData[0].authorisedSignatur.data);
        }
        return '';
    };


    if (!headerData || !detailData) {
        return <div>Loading...</div>;
    }

    const totalAmount = headerData[0].total_amount;
    const totalAmountInWords = `${toWords.convert(totalAmount)} rupees only`;
    const purchase = parseFloat(headerData[0].purchase_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const total = parseFloat(headerData[0].total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const transport = parseFloat(headerData[0].transport_charges).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div>
            <div className="InvoiceContainer topnav-screen">
                <h2 className="d-flex justify-content-center fs-5 border border-bottom-0 mb-0 border-1 border-dark text-dark">DELIVERY CHALLAN</h2>
                <div class="CompanyDetailstax border border-dark border-bottom-0">
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='text-container'>
                            <h2 className='title-name'>
                                <strong>{headerData[0].company_name}</strong>
                            </h2>
                            <p className='' style={{ textAlign: "left", color: "#BF833D", fontWeight: "bold", fontFamily: "'Tw Cen MT', sans-serif", fontSize: "20px" }}>
                                Your Comfort Our Priority
                            </p>
                            <p className='subtitle-address' style={{ color: "#253F4E", fontSize: "18px" }}>
                                {[headerData[0].address1, headerData[0].address2, headerData[0].address3]
                                    .filter((addr) => addr)
                                    .join(", ")},{headerData[0].city} - {headerData[0].pincode}<br />
                                Mail id: {headerData[0].email_id}<br />
                                GSTIN:  <strong>{headerData[0].company_gst_no}</strong><br />
                                Contact no:{headerData[0].contact_no}
                            </p>
                        </div>
                        <div>
                            <img className="rounded-0 me-1" src={processItemImages(headerData[0].company_logo)} width={150} height={130} />
                        </div>
                    </div>
                </div>
                <div className="header-section1">
                    <div className="left-section">
                        <div className="addressBox">
                            <p style={{ marginTop: "15px" }}><strong>Bill to</strong></p>
                            <p>
                                {/* Code: <strong>{headerData[0].bill_to_customer_code}</strong> */}
                                <br /><strong>Name: {headerData[0].customer_name}</strong>
                                <br />

                                <strong>
                                    Address:{" "}
                                    {[headerData[0].customer_addr_1,
                                    headerData[0].customer_addr_2,
                                    headerData[0].customer_addr_3,
                                    headerData[0].customer_addr_4]
                                        .filter((addr) => addr)
                                        .join(", ")}
                                </strong>
                                <br /> <strong>GST No:{headerData[0].customer_gst_no}</strong>
                                <br /> <strong>State:{headerData[0].customer_state}</strong>
                                <br /> <strong>Mobile No:{headerData[0].customer_mobile_no}</strong>
                            </p>
                        </div>
                        <hr className="line" />
                        <div className="addressSection mt-0">
                            <p><strong>Ship to</strong></p>
                            <p>
                                {/* Code: <strong>{headerData[0].Ship_to_customer_code}</strong> */}
                                <br /> <strong>Name:{headerData[0].ShipTo_customer_name}</strong>
                                <br />

                                <strong>
                                    Address:{" "}
                                    {[headerData[0].ShipTo_customer_addr_1,
                                    headerData[0].ShipTocustomer_addr_2,
                                    headerData[0].ShipTocustomer_addr_3,
                                    headerData[0].ShipTocustomer_addr_4]
                                        .filter((addr) => addr)
                                        .join(", ")}
                                </strong>
                                <br /> <strong>GST No:{headerData[0].ShipTocustomer_gst_no}</strong>
                                <br /><strong>State:{headerData[0].ShipTocustomer_state}</strong>
                                <br /> <strong>Mobile No:{headerData[0].ShipTocustomer_mobile_no}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="invoice-info">
                        <table className="" style={{
                            height: "100%",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}>
                            <tbody>
                                <tr className="small-row">
                                    <td className="label-top">
                                        Dc No:<br />
                                        <strong>{headerData[0].transaction_no}</strong>
                                    </td>
                                    <td className="label-top">
                                        Date:<br />
                                        <strong>{new Date(headerData[0].transaction_date).toLocaleDateString('en-GB')}</strong>
                                    </td>
                                </tr>
                                <tr className="large-row">
                                    <td colSpan="4" className="">
                                        Delivery Note:
                                        <strong>{headerData[0].delivery_note}</strong>
                                    </td>
                                </tr>
                                <tr className="large-row">
                                    <td colSpan="2" className="">
                                        Dispatched Through:
                                        <strong> {headerData[0].dispatched_through}</strong>
                                    </td>
                                </tr>
                                <tr className="large-row">
                                    <td colSpan="2" className="">
                                        Destination:
                                        <strong>{headerData[0].destination}</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <table className="invoice-table mt-2">
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>S.No</th>
                            <th style={{ textAlign: "center" }}>Product / Item Name</th>
                            <th style={{ textAlign: "center" }}>Product Description</th>
                            <th style={{ textAlign: "center" }}>HSN/SAC</th>
                            <th style={{ textAlign: "center" }}>Qty</th>
                            <th style={{ textAlign: "center" }}>Unit Price</th>
                            <th style={{ textAlign: "center" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailData.map((row, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{row.SNo || "-"}</td>
                                <td>{row.name || "-"}</td>
                                <td>{row.Description || "-"}</td>
                                <td style={{ textAlign: "right" }}>{row.hsn_code}</td>
                                <td style={{ textAlign: "right" }}>{row.bill_qty || 0}</td>
                                <td style={{ textAlign: "right" }}>{row.unit_price || 0}</td>
                                <td style={{ textAlign: "right" }}>{parseFloat(row.bill_rate).toFixed(2)}</td>
                            </tr>
                        ))}
                        {/* <tr>
                            <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>
                                Total
                            </td>
                            <td style={{ fontWeight: "bold", textAlign: "right" }}>{purchaseAmountFormatted}</td>
                        </tr> */}
                    </tbody>
                </table>
                <section class="invoice-summary1 mt-2" style={{ marginTop: "0px" }}>
                    <table className="bordered-table1 ">
                        <thead>
                            <tr className="" >
                                <td style={{ textAlign: "right" }}><strong>SubTotal</strong></td>
                                <td style={{ paddingLeft: "10px" }}>{purchase}</td>
                            </tr>
                            <tr className="">
                                <td style={{ textAlign: "right" }}><strong>Transport</strong></td>
                                <td style={{ paddingLeft: "10px" }}>{transport}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "right" }}><strong>Grand Total</strong></td>
                                <td style={{ paddingLeft: "10px" }}>{total}</td>
                            </tr>
                        </thead>
                    </table>
                </section>
                <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }} className="mt-1">Note: <strong>{headerData[0].note_not_for_sale}</strong></p>
                <section className="text-amount mt-2">
                    <p className="amount-in-words1">Grand Total In Words:<strong><span className="invoice-amount-words1">{totalAmountInWords}</span></strong></p>
                </section>
                <div className="bank-details">
                    <div className="d-flex justify-content-between">
                        <div className="col-6">
                            <p className="" style={{ fontSize: "12px" }}>
                                <strong className="text-decoration-underline">TERMS AND CONDITIONS</strong><br />
                            </p>
                            {headerData.map((row, index) => (
                                <p key={index} style={{ fontSize: "12px" }}>
                                    {index + 1}.{row.Terms_Conditions}
                                </p>
                            ))}
                            {/* <p className="" style={{ fontSize: "12px" }}>
                                <strong className="text-decoration-underline">
                                    PAYMENT TERMS
                                </strong>
                                <br />
                                1. Net banking,cheque,cash<br />
                                2. 50 % Advanve 50% before delivery
                            </p> */}
                        </div>
                        <div className="col-5  ms-auto">
                            <div className="border border-1 border-dark border-bottom-0 border-top-0 border-end-0 p-3" style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}>
                                <p style={{ fontSize: "12px" }}>Prepared By:</p>
                                <br />
                                <p style={{ fontSize: "12px" }}>Verified By:</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <p style={{ fontSize: "12px" }}>Authority Signature:</p>
                                    <img
                                        src={processSignatureImages(headerData[0].authorisedSignatur)}
                                        alt="Authorized Signature"
                                        style={{
                                            width: "150px",
                                            height: "50px",
                                            objectFit: "contain",
                                            marginLeft: "auto",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=""></div>
                </div>
                <div>
                    <p className="d-flex justify-content-center mb-0">
                        SUBJECT TO CHENNAI JURISDICTION ONLY<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
