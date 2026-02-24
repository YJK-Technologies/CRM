import React, { useEffect, useState } from "react";
import "./InvoicePrint.css";
import { ToWords } from 'to-words';
import { useLocation } from 'react-router-dom';
import LZString from "lz-string";

const getPageName = (page) => {
    switch (page) {
      case "1":
        return "Original";
      case "2":
        return "Duplicate";
      case "3":
        return "Triplicate";
      default:
        return "";
    }
  };

const Invoice = () => {
    const [headerData, setHeaderData] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [taxData, setTaxData] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");
    const toWords = new ToWords();

    useEffect(() => {
        const header = sessionStorage.getItem('TaxInvoiceheaderData');
        const detail = sessionStorage.getItem('TaxInvoicedetailData');
        const tax = sessionStorage.getItem('TaxInvoicetaxData');

        if (header && detail && tax) {
            setHeaderData(JSON.parse(LZString.decompress(header)));
            setDetailData(JSON.parse(LZString.decompress(detail)));
            setTaxData(JSON.parse(LZString.decompress(tax)));
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

    if (!headerData || !detailData || !taxData) {
        return <div>Loading...</div>;
    }

    const totalAmount = parseFloat(headerData[0]?.bill_amt || 0);
    const taxAmount = parseFloat(headerData[0]?.tax_amount || 0);
    const purchaseAmount = parseFloat(headerData[0]?.sale_amt || 0);

    const totalAmountFormatted = totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const taxAmountFormatted = taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const purchaseAmountFormatted = purchaseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalAmountInWords = `${toWords.convert(totalAmount)} rupees only`;
    const taxAmountInWords = `${toWords.convert(taxAmount)} rupees only`;


    return (
        <div>
            <div className="InvoiceContainer custom-text topnav-screen">
                <div className="d-flex justify-content-between align-items-center border border-bottom-0 mb-0 border-1 border-dark text-dark px-3">
                <p className="m-0 w-50 " style={{ fontSize: "15px" }}>E-Way Bill No:{headerData[0].Eway_bill_no}</p>
                <h2 className="w-50 fs-5 m-0">INVOICE</h2>
                    <p className="m-0" style={{ fontSize: "15px" }}>{getPageName(page)}</p>
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
                                                <strong> GSTIN: </strong>{headerData[0].company_gst_no}
                                            </div>
                                        </div>
                                        <hr className="hr" />
                                        <div className="mt-3 p-1">
                                            <strong>Bill to</strong>
                                            <br />
                                            <br />
                                            <strong>Name:</strong> {headerData[0].billTo_customer_name}<br />
                                            <strong>Address:</strong> {[headerData[0].billTo_customer_addr_1,
                                            headerData[0].billTo_customer_addr_2,
                                            headerData[0].billTo_customer_addr_3,
                                            headerData[0].billTo_customer_addr_4]
                                                .filter((addr) => addr)
                                                .join(", ")}<br />
                                            <strong>GST No:</strong> {headerData[0].billTo_customer_gst_no}<br />
                                            <strong>State:</strong> {headerData[0].billTo_customer_state} <br />
                                        </div>
                                    </td>
                                    <td colSpan="2" className="border border-dark">
                                        <tr className="small-row border-bottom border-dark">
                                            <td className="p-1 border-end border-dark"><strong>Invoice No:</strong>
                                                <br /> {headerData[0].bill_no}</td>
                                            <td className="p-1"><strong>Date:</strong>
                                                <br /> {new Date(headerData[0].bill_date).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                        <tr className="small-row border-bottom border-dark">
                                            <td className="p-1 border-end border-dark"><strong>Buyer's Order No:</strong>
                                                <br /> {headerData[0].po_no}</td>
                                            <td className="p-1"><strong>Date:</strong>
                                                <br /> {new Date(headerData[0].po_date).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                        <tr className="small-row border-bottom border-dark">
                                            <td className="p-1"><strong>Supplier Ref:</strong>
                                                <br /> {headerData[0].supplier_ref}</td>
                                        </tr>
                                        <tr className="small-row border-bottom border-dark">
                                            <td className="p-1"><strong>Terms of Payment:</strong>
                                                <br /> {headerData.map((row, index) => (
                                                    <p key={index} style={{ fontSize: "12px" }}>
                                                        {index + 1}.{row.Terms_Conditions}
                                                    </p>
                                                ))}
                                            </td>
                                        </tr>
                                        <tr className="small-row border-bottom border-dark">
                                            <td className="p-1 text-break" style={{ maxWidth: "350px" }}><strong>Delivered Through:</strong>
                                                <br /> {headerData[0].dispatched_through || "-"}</td>
                                        </tr>
                                        <tr className="small-row">
                                            <td className="p-1 text-break" style={{ maxWidth: "350px" }}><strong>Destination:</strong>
                                                <br /> {headerData[0].Destination || "-"}</td>
                                        </tr>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="border border-dark p-1">
                                        <strong>Ship to</strong>
                                        <br />
                                        <br />
                                        <strong>Name:</strong>{headerData[0].shipTo_customer_name}<br />
                                        <strong>Address:</strong> {[headerData[0].shipTo_customer_addr_1,
                                        headerData[0].shipTo_customer_addr_2,
                                        headerData[0].shipTo_customer_addr_3,
                                        headerData[0].shipTo_customer_addr_4]
                                            .filter((addr) => addr)
                                            .join(", ")}<br />
                                        <strong>GST No:</strong>{headerData[0].ShipTo_customer_gst_no}<br />
                                        <strong>State:</strong>{headerData[0].shipTo_customer_state}<br />
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
                            <th style={{ textAlign: "center" }}>Tax</th>
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
                                <td style={{ textAlign: "right" }}>{row.tax_amt || 0}</td>
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
                                <td style={{ paddingLeft: "10px" }}>{purchaseAmountFormatted}</td>
                            </tr>
                            {taxData.map((row, index) => (
                                <tr key={index} className="">
                                    <td style={{ textAlign: "right" }}><strong>{row.tax_name_details || "-"}%</strong></td>
                                    <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.tax_amt || 0)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td style={{ textAlign: "right" }}><strong>Grand Total</strong></td>
                                <td>{totalAmountFormatted}</td>
                            </tr>
                        </thead>
                    </table>
                </section>
                <section className="text-amount mt-2">
                    <p className="amount-in-words1">Grand Total In Words:<strong><span className="invoice-amount-words1">{totalAmountInWords}</span></strong></p>
                </section>
                <div className="bank-details">
                    <div className="d-flex justify-content-between">
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
