import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import './Template.css'
import { toWords } from 'number-to-words';
import {ToWords} from 'to-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'    
const config = require('./Apiconfig');

const Template = () => {
    const [headerData, setHeaderData] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [taxData, setTaxData] = useState(null);
    const componentRef = useRef("");
    const toWords = new ToWords();


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Purchase data'
    });

    const handleDownload = async () => {
        try {
          const invoiceElement = componentRef.current;
          const canvas = await html2canvas(invoiceElement);
          const imageData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
      
          const imgWidth = 210; // A4 width in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
      
          const blob = pdf.output('blob');
      
          if ('showSaveFilePicker' in window) {
            const opts = {
              types: [{
                description: 'PDF file',
                accept: { 'application/pdf': ['.pdf'] },
              }],
            };
      
            const handle = await window.showSaveFilePicker(opts);
            const writableStream = await handle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
          } else {
            const fileName = prompt("Enter file name:", "invoice.pdf");
            if (fileName) {
              saveAs(blob, fileName);
            }
          } 
        } catch (error) {
          console.error('Error saving the file:', error);
        }
      };

    useEffect(() => {
        const header = sessionStorage.getItem('SRheaderData');
        const detail = sessionStorage.getItem('SRdetailData');
        const tax = sessionStorage.getItem('SRtaxData');

        if (header && detail && tax) {
            setHeaderData(JSON.parse(header));
            setDetailData(JSON.parse(detail));
            setTaxData(JSON.parse(tax));
        } else {
            console.error('Data not found in sessionStorage');
        }
    }, []);


    if (!headerData || !detailData || !taxData) {
        return <div>Loading...</div>;
    }

    
      const totalAmount = headerData[0].bill_amt;
      const totalAmountInWords = `${toWords.convert(totalAmount)} rupees only`;
      
      const total = parseFloat(headerData[0].bill_amt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const tax = parseFloat(taxData[0].tax_amt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const sales = parseFloat(headerData[0].sale_amt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Fetch header data
    //             const headerResponse = await fetch(`${config.apiBaseUrl}/refNumberToHeaderPrintData`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ purch_autono: state.new_running_no })
    //             });
    //             const headerData = await headerResponse.json();
    //             // setHeaderData(headerData);
    //             // Fetch detail data
    //             const detailResponse = await fetch(`${config.apiBaseUrl}/refNumberToDetailPrintData`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ purch_autono: state.new_running_no })
    //             });
    //             const detailData = await detailResponse.json();
    //             // setDetailData(detailData);

    //             // Fetch tax data
    //             const taxResponse = await fetch(`${config.apiBaseUrl}/refNumberToSumTax`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ numberseries: state.new_running_no })
    //             });
    //             const taxData = await taxResponse.json();
    //             // setTaxData(taxData);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     if (state && state.new_running_no) {
    //         fetchData();
    //     }
    // }, [state.new_running_no]);

    if (!headerData || !detailData || !taxData) {
        return <div>Loading...</div>;
    }

    // const convertToWords = (amount) => {
    //     let words = toWords(amount);
    //     // Capitalize the first letter and add currency
    //     words = words.charAt(0).toUpperCase() + words.slice(1) + ' rupees only';
    //     return words;
    // };

  
    return (
        <>
            <div className="invoice-container" ref={componentRef}>
                <div className="invoice-header">
                    <div className="company-details">
                        <h2>{headerData[0].company_code}</h2>
                        {/* <p>Phone no: 9790876453</p> */}
                    </div>
                    <div className="logo">
                        {/* <img src="logo.png" alt="Company Logo" /> */}
                    </div>
                </div>
                <h1 className="invoice-title">Sales Return</h1>
                <div className="invoice-info">
                    <div className="bill-to">
                      <p>Customer Code :{headerData[0].customer_code}</p>
                      <p>Customer Name :{headerData[0].customer_name}</p>
                      <p>Return Date :{new Date(headerData[0].return_date).toLocaleDateString()}</p>
                      <p>Return Reason :{headerData[0].return_reason}</p>
                    </div>
                    <div className="invoice-details">
                        <p>Return No   : {headerData[0].return_no}</p>
                        <p>Transaction Date : {new Date(headerData[0].bill_date).toLocaleDateString()}</p>
                        <p>Purchase Type    : {headerData[0].sales_type}</p>
                        <p>Pay Type         : {headerData[0].pay_type}</p>
                    </div>
                </div>
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Item Name</th>
                            <th>Unit Weight</th>
                            <th>Qty</th>
                            <th>Return Qty</th>
                            <th>Return Weight</th>
                            <th>Unit Price</th>
                            <th>Tax</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                    {detailData.map((row, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{row.item_name}</td>
                                <td>{row.weight}</td>
                                <td>{row.bill_qty}</td>
                                <td>{row.return_qty}</td>
                                <td>{row.return_weight}</td>
                                <td>{row.item_amt}</td>
                                <td>{row.tax_amt}</td>
                                <td  style={{textAlign:"right"}}>{parseFloat(row.return_amt).toFixed(2)}</td>
                            </tr>
                               ))}
                        <tr className="total">
                            <td colSpan="8" style={{textAlign:"left"}}>Total</td>
                            <td  style={{textAlign:"right"}}>₹ {sales}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="invoice-summary">
                    <table>
                        <tr>
                            <td>Sub Total</td>
                            <td>₹ {sales}</td>
                        </tr>
                        {taxData.map((row, index) => (
                       <tr key={index}>
                            <td>{row.tax_name_details}@{row.tax_per}%</td>
                            <td>₹ {tax}</td>
                        </tr>
                        ))}
                        <tr>
                            <td>Round off</td>
                            <td>₹ {headerData[0].roff_amt}</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>₹ {total}</td>
                        </tr>
                    </table>
                    <p className="invoice-amount-words">Invoice Amount In Words: <span className="amount-in-words">{totalAmountInWords}</span></p>
                    <p style={{fontSize:"13px"}}>Terms and Conditions: Thanks for doing business with us!</p>
                </div>
                <div className="invoice-footer">
                    <p>For: My Company</p>
                    {/* <p>Authorized Signatory</p> */}
                </div>
              </div>
            
              <div class="d-flex justify-content-between" style={{ marginLeft: "45%", marginTop: "5px" }} >
                <div align="left" class="d-flex justify-content-start">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className='PrintButton'
                        >
                        <FontAwesomeIcon icon="fa-solid fa-download" />
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className='PrintButton'
                        >
                        <FontAwesomeIcon icon="fa-solid fa-print" />
                    </button>

                </div>
            </div>
        </>
    );
}

export default Template;
