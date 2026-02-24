import React, { useEffect, useState } from "react";
import "./InvoicePrint.css";
import { ToWords } from 'to-words';
import { useLocation } from 'react-router-dom';
import LZString from "lz-string";


const Invoice = () => {
    const [headerData, setHeaderData] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [taxData, setTaxData] = useState(null);

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
            <div className="InvoiceContainer custom-text topnav-screen">
                <div className="d-flex justify-content-between align-items-center border border-bottom-0 mb-0 border-1 border-dark text-dark px-3">
                    <h2 className="text-center w-100 fs-5 ms-5 m-0">DELIVERY CHALLAN</h2>
                </div>
                <div class="invoice">
                    <div className='invoiceDiv d-flex'>
                        <table className="table">
                            <tbody className="tbody">
                                <tr>
                                    <td colSpan="2" className="border border-dark">
                                        <div className="d-flex align-items-start">
                                            <div className="ms-3 mt-1">
                                                <img className="rounded-0"
                                                    src={processItemImages(headerData[0].company_logo)}
                                                    width={100}
                                                    height={100}
                                                    alt="Company Logo" />
                                            </div>
                                            <div className="mt-3 p-1">
                                                <strong>{headerData[0].company_name}</strong>
                                                <br />
                                                {[headerData[0].address1, headerData[0].address2, headerData[0].address3]
                                                    .filter((addr) => addr)
                                                    .join(", ")},{headerData[0].city} - {headerData[0].pincode}
                                                <br />
                                                <strong> GST NO: </strong>{headerData[0].company_gst_no}
                                            </div>
                                        </div>
                                        <hr className="hr" />
                                        <div className="mt-3 p-1">
                                            <strong>Bill to</strong>
                                            <br />
                                            <br />
                                            <strong>Name:</strong>{headerData[0].customer_name}<br />
                                            <strong>Address:</strong>  {[headerData[0].customer_addr_1,
                                            headerData[0].customer_addr_2,
                                            headerData[0].customer_addr_3,
                                            headerData[0].customer_addr_4]
                                                .filter((addr) => addr)
                                                .join(", ")}<br />
                                            <strong>GST No:</strong>{headerData[0].customer_gst_no}<br />
                                            <strong>State:</strong>{headerData[0].customer_state}<br />
                                        </div>
                                    </td>
                                    <td colSpan="2" className="border border-dark">
                                        <tr className="large-row border-bottom border-dark">
                                            <td className="p-1 border-dark"><strong> Dc No:</strong>
                                                <br />{headerData[0].transaction_no}</td>
                                        </tr>
                                        <tr className="large-row border-bottom border-dark">
                                            <td className="p-1"><strong>Date:</strong>
                                                <br />{new Date(headerData[0].transaction_date).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                        <tr className="large-row border-bottom border-dark">
                                            <td className="p-1 border-dark"><strong> PO No:</strong>
                                                <br />{headerData[0].transaction_no}</td>
                                        </tr>
                                        <tr className="large-row border-dark">
                                            <td className="p-1"><strong>Date:</strong>
                                                <br />{new Date(headerData[0].transaction_date).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                        {/* <tr className="small-row border-dark">
                                            <td className="p-1 text-break" style={{ maxWidth: "350px" }}><strong>Mobile No:</strong>
                                                <br />{headerData[0].contact_no}</td>
                                        </tr> */}
                                        {/* <tr className="small-row">
                                            <td className="p-1 text-break" style={{ maxWidth: "350px" }}><strong>Destination:</strong>
                                                <br /> {headerData[0].dispatch_through || "-"}</td>
                                        </tr> */}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="border border-dark p-1">
                                        <strong>Ship to</strong>
                                        <br />
                                        <br />
                                        <strong>Name:</strong>{headerData[0].ShipTo_customer_name}<br />
                                        <strong>Address:</strong> {[headerData[0].ShipTo_customer_addr_1,
                                        headerData[0].ShipTocustomer_addr_2,
                                        headerData[0].ShipTocustomer_addr_3,
                                        headerData[0].ShipTocustomer_addr_4]
                                            .filter((addr) => addr)
                                            .join(", ")}<br />
                                        <strong>GST No:</strong>{headerData[0].ShipTocustomer_gst_no}<br />
                                        <strong>State:</strong>{headerData[0].ShipTocustomer_state}<br />
                                    </td>
                                    <td colSpan="2" className="border border-dark p-1">
                                        <strong>Bank Details</strong>
                                        <br />
                                        <strong>{headerData[0].company_name}</strong>
                                        <br />
                                        <strong>Name:</strong> {headerData[0].account_name}<br />
                                        <strong>Account No:</strong> {headerData[0].account_number}<br />
                                        <strong>Branch:</strong> {headerData[0].branch}<br />
                                        <strong>IFSC Code:</strong> {headerData[0].IFSC_code}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <table className=" invoiceTable mt-2">
                    <thead >
                        <tr className="">
                            <th style={{ textAlign: "center" }}>S.No</th>
                            <th style={{ textAlign: "center" }}>Material</th>
                            <th style={{ textAlign: "center" }}>Description of Goods</th>
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
                    </tbody>
                </table>
                <section class="invoice-summary1 mt-2" style={{ marginTop: "0px" }}>
                    <table className="bordered-table1 ">
                        <thead>
                            <tr className="" >
                                <td style={{ textAlign: "right" }}><strong>SubTotal</strong></td>
                                <td style={{ paddingLeft: "10px" }}>{purchase}</td>
                            </tr>
                            {/* {taxData.map((row, index) => (
                                <tr key={index} className="">
                                    <td style={{ textAlign: "right" }}><strong>{row.tax_name_details || "-"}%</strong></td>
                                    <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.tax_amt || 0)}</td>
                                </tr>
                            ))} */}
                            <tr>
                                <td style={{ textAlign: "right" }}><strong>Grand Total</strong></td>
                                <td>{total}</td>
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
                            <div className="mt-5"></div>
                            <p style={{ marginTop: "100px", fontSize: "12px" }}>Consumer's Signature with Seal<br /></p>
                            <p style={{ fontSize: "12px" }}>Date:<br /></p>
                        </div>
                        <div className="col-6 ms-auto">
                            <div
                                className="border-dark border-bottom-0 border-top-0 border-end-0"
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <p style={{ fontSize: "12px" }}>
                                    For <strong>{headerData[0].company_name}</strong>
                                </p>
                                <img
                                    src={processSignatureImages(headerData[0].authorisedSignatur)}
                                    alt="Authorized Signature"
                                    style={{
                                        width: "250px",
                                        height: "200px",
                                        objectFit: "contain",
                                        marginTop: "10px",
                                        marginBottom: "5px"
                                    }}
                                />

                                <p style={{ fontSize: "12px" }}>
                                    <strong>Authority Signature</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
