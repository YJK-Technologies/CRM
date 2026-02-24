import React, { useEffect, useState } from "react";
import "../Css/POPrint.css";
import PaymentQr from "../Pictures/PaymentQr.png";
import { ToWords } from 'to-words';
import LZString from "lz-string";


const Invoice = () => {
    const [headerData, setHeaderData] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [taxData, setTaxData] = useState(null);

    const toWords = new ToWords();

    useEffect(() => {
        const header = sessionStorage.getItem('POheaderData');
        const detail = sessionStorage.getItem('POdetailData');
        const tax = sessionStorage.getItem('POtaxData');

        if (header && detail && tax) {
            setHeaderData(JSON.parse(LZString.decompress(header)));
            setDetailData(JSON.parse(LZString.decompress(detail)));
            setTaxData(JSON.parse(LZString.decompress(tax)));
        } else {
            console.error('Data not found in sessionStorage');
        }
    }, []);


    if (!headerData || !detailData || !taxData) {
        return <div>Loading...</div>;
    }

    const bufferToBase64 = (buffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = '';

        for (let i = 0; i < bytes.byteLength; i += 1024) {
            const chunk = bytes.subarray(i, i + 1024);
            binary += String.fromCharCode.apply(null, chunk);
        }

        return `data:image/jpeg;base64,${window.btoa(binary)}`;
    };

    const processCompanyImages = () => {
        if (headerData[0].company_logo && headerData[0].company_logo.data) {
            return bufferToBase64(headerData[0].company_logo.data);
        }
        return '';
    };

    const processQRImages = () => {
        if (headerData[0].bank_paymentQRCode && headerData[0].bank_paymentQRCode.data) {
            return bufferToBase64(headerData[0].bank_paymentQRCode.data);
        }
        return '';
    };

    const processSignatureImages = () => {
        if (headerData[0].authorisedSignatur && headerData[0].authorisedSignatur.data) {
            return bufferToBase64(headerData[0].authorisedSignatur.data);
        }
        return '';
    };

    const totalAmount = parseFloat(headerData[0]?.total_amount || 0);
    const taxAmount = parseFloat(headerData[0]?.tax_amount || 0);
    const purchaseAmount = parseFloat(headerData[0]?.purchase_amount || 0);

    const totalAmountFormatted = totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const taxAmountFormatted = taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const purchaseAmountFormatted = purchaseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalAmountInWords = `${toWords.convert(totalAmount)} rupees only`;
    const taxAmountInWords = `${toWords.convert(taxAmount)} rupees only`;



    return (
        <div>
            <div className="InvoiceContainer topnav-screen">
                <h2 className="d-flex justify-content-center fs-5 border border-bottom-0 mb-0 border-1 border-dark text-dark">PURCHASE ORDER</h2>
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
                                GSTIN: <strong>{headerData[0].company_gst_no}</strong><br />
                                Contact no:{headerData[0].contact_no}
                            </p>
                        </div>
                        <div>
                            {/* <img className="rounded-0 me-1" src={CompanyLogo} width={100} height={100} /> */}
                            <img className="rounded-0 me-1" src={processCompanyImages(headerData[0].company_logo)} width={150} height={130} />
                        </div>
                    </div>
                </div>
                <div className="header-section1">
                    <div className="left-section">
                        <div className="addressBox ">
                            <p style={{ marginTop: "15px" }}><strong>Bill to</strong></p>
                            <p>
                                {/* Code: <strong>{detailData[0].vendor_code}</strong> */}
                                <br /> <strong>Name:{detailData[0].vendor_name}</strong>
                                <br />
                                <strong>
                                    Address:{" "}
                                    {[detailData[0].vendor_addr_1,
                                    detailData[0].vendor_addr_2,
                                    detailData[0].vendor_addr_3,
                                    detailData[0].vendor_addr_4]
                                        .filter((addr) => addr)
                                        .join(", ")}
                                </strong>
                                <br /><strong>GST No: {detailData[0].vendor_gst_no}</strong>
                                <br /> <strong>State:{detailData[0].state}</strong>
                                <br /> <strong>Mobile No:{detailData[0].contact_number}</strong>
                            </p>
                        </div>
                        <hr className="line" />
                        <div className="addressSection mt-0">
                            <p><strong>Ship to</strong></p>
                            <p>
                                {/* Code: <strong>{detailData[0].ShipTo_customer_code}</strong> */}
                                <br /> <strong>Name:{detailData[0].ShipTo_customer_name}</strong>
                                <br />
                                <strong>
                                    Address:{" "}
                                    {[detailData[0].ShipTo_customer_addr_1,
                                    detailData[0].ShipTo_customer_addr_2,
                                    detailData[0].ShipTo_customer_addr_3,
                                    detailData[0].ShipTo_customer_addr_4]
                                        .filter((addr) => addr)
                                        .join(", ")}
                                </strong>
                                <br /><strong>GST No:{detailData[0].ShipTo_vendor_gst_no}</strong>
                                <br /><strong>State:{detailData[0].ship_to_state}</strong>
                                <br /> <strong>Mobile No:{detailData[0].ship_to_contact_number}</strong>
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
                                        PO No:<br />
                                        <strong>{headerData[0].transaction_no}</strong>
                                    </td>
                                    <td className="label-top">
                                        Date:<br />
                                        <strong>{new Date(headerData[0].Entry_date).toLocaleDateString('en-GB')}</strong>
                                    </td>
                                </tr>
                                <tr className="small-row">
                                    <td colSpan="2" className="">
                                        Delivery Date:
                                        <strong>{new Date(headerData[0].delivery_date).toLocaleDateString('en-GB')}</strong>
                                    </td>
                                </tr>
                                <tr className="small-row">
                                    <td colSpan="2" className="">
                                        Credit:
                                        <strong> {headerData[0].credit}</strong>
                                    </td>
                                </tr>
                                <tr className="small-row">
                                    <td colSpan="2" className="">
                                        Remarks:
                                        <strong>{headerData[0].remarks} </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="justify-content-start">
                                                <strong>Bank Details</strong>
                                                <br />
                                                Name: <br /><strong> {headerData[0].account_name}</strong>
                                                <br />
                                                Account No: <br /><strong> {headerData[0].account_number}</strong>
                                                <br />
                                                Branch: <br /><strong> {headerData[0].branch}</strong>
                                                <br />
                                                IFSC Code: <br /><strong> {headerData[0].IFSC_code}</strong>
                                            </div>

                                            <div className="justify-content-end ms-4">
                                                <img src={processQRImages(headerData[0].bank_paymentQRCode)} alt="QR Code" width={150} height={150} />
                                            </div>
                                        </div>
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
                            <th style={{ textAlign: "center" }}>Item Name</th>
                            <th style={{ textAlign: "center" }}>HSN/SAC</th>
                            <th style={{ textAlign: "center" }}>Qty</th>
                            <th style={{ textAlign: "center" }}>Unit Price</th>
                            <th style={{ textAlign: "center" }}>Tax</th>
                            <th style={{ textAlign: "center" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailData.map((row, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center" }}>{row.ItemSNo || "-"}</td>
                                <td>{row.item_name || "-"}</td>
                                <td style={{ textAlign: "right" }}>{row.hsn}</td>
                                <td style={{ textAlign: "right" }}>{row.bill_qty || 0}</td>
                                <td style={{ textAlign: "right" }}>{row.item_amt || 0}</td>
                                <td style={{ textAlign: "right" }}>{row.tax_amount || 0}</td>
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
                    <table className="bordered-table1">
                        <thead>
                            <tr className="" >
                                <td style={{ textAlign: "right" }}><strong>SubTotal</strong></td>
                                <td style={{ paddingLeft: "10px" }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(headerData[0].purchase_amount)}</td>
                            </tr>
                            {taxData.map((row, index) => (
                                <tr key={index} className="">
                                    <td style={{ textAlign: "right" }}><strong>{row.tax_name_details || "-"}%</strong></td>
                                    <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.tax_amt || 0)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td style={{ textAlign: "right" }}><strong>Grand Total</strong></td>
                                <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(parseFloat(headerData[0].total_amount))}</td>
                            </tr>
                        </thead>
                    </table>
                </section>
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
